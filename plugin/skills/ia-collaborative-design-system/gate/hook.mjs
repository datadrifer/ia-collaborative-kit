#!/usr/bin/env node
/**
 * The write-time gate (D14, FR-115) — ships as `gate/hook.mjs` in every
 * Substrate handoff package. Opt-in: `node .claude/skills/<slug>/gate/enable-hook.mjs`
 * adds it to the project's `.claude/settings.json`, with the path anchored on
 * $CLAUDE_PROJECT_DIR so it still runs after the agent changes directory:
 *
 *   { "hooks": { "PreToolUse": [ { "matcher": "Write|Edit|MultiEdit",
 *       "hooks": [ { "type": "command",
 *         "command": "node \"$CLAUDE_PROJECT_DIR/.claude/skills/<slug>/gate/hook.mjs\"" } ] } ] } }
 *
 * Claude Code hands the pending tool call on stdin. The text about to be
 * written (a Write's content, an Edit's new string, every MultiEdit new
 * string) goes through the same checks as `gate/check.mjs`. Any finding blocks
 * the write: exit 2, with the findings on stderr, which Claude Code feeds back
 * to the model so it can fix the code — never the rule.
 *
 * Fails OPEN on anything it cannot read (bad JSON, a tool it does not know): a
 * gate that crashes every write is a gate people delete. Sets
 * `process.exitCode` rather than calling `process.exit()`, so the reason on
 * stderr always reaches Claude Code in full.
 */
import { appendFileSync, existsSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { CODE_EXTS, checkCode } from './handoff.mjs'
import { kindOf, nearestTokens, rewriteLiterals, tokenTable } from './rewrite.mjs'

/* SUB-157: every rewrite, deny, waiver and loop-allow is appended here (`substrate report` reads it) */
const LOG = 'log.jsonl'
/** Denies on one file within this window before the gate warns instead of blocking (a loop). */
const LOOP = { denies: 3, windowMs: 15 * 60_000 }

const here = dirname(fileURLToPath(import.meta.url))

/**
 * Files the gate leaves alone: installed skills (the system's own stylesheets —
 * substrate.css, root.css, layer.css, recipes.css — live there and carry raw
 * values by definition), dependencies, and build output at the project's top
 * level. Judged on the path RELATIVE to the project root, so a component that
 * happens to live in `src/build/` is still checked, and a file merely NAMED
 * like a system stylesheet anywhere else (`src/app/recipes.css`) is checked too
 * (SUB-176: that name was a one-file bypass of the whole gate).
 */
function exempt(path) {
  const root = realish(resolve(process.env.CLAUDE_PROJECT_DIR ?? process.cwd()))
  /* resolved, so `src/node_modules/../a.tsx` or `.claude/skills/x/../../src/a.tsx` is judged where it lands */
  const rel = relative(root, realish(resolve(root, path))).replace(/\\/g, '/')
  if (rel === '..' || rel.startsWith('../')) return false
  /* any installed skill folder (a subfolder install's own stylesheets too), dependencies, top-level build output */
  return /(?:^|\/)node_modules\//.test(rel) || /(?:^|\/)\.claude\/skills\//.test(rel) || /^(?:dist|build|out|\.next)\//.test(rel)
}

/** realpath when the path exists (or its folder does), so a symlinked project or a case difference compares equal. */
function realish(p) {
  try {
    return realpathSync(p)
  } catch {
    try {
      return join(realpathSync(dirname(p)), p.slice(dirname(p).length + 1))
    } catch {
      return p
    }
  }
}

function readStdin() {
  try {
    return readFileSync(0, 'utf8')
  } catch {
    return ''
  }
}

/**
 * What an Edit or MultiEdit leaves in the file, and the line spans it wrote, so a
 * class rule sees the class position around the edit (SUB-177 review): an edit
 * of `gap-2 text-sm` → `gap-[13px] text-sm` has no quotes of its own. Null when
 * the file or an old string cannot be found: the fragments are then checked line
 * by line, unscoped.
 */
function afterEdit(tool, params, path) {
  const file = isAbsolute(path) ? path : resolve(process.env.CLAUDE_PROJECT_DIR ?? process.cwd(), path)
  if (!existsSync(file)) return null
  let text = readFileSync(file, 'utf8')
  const edits = tool === 'Edit' ? [params] : Array.isArray(params.edits) ? params.edits : []
  let spans = []
  for (const e of edits) {
    if (typeof e?.old_string !== 'string' || typeof e?.new_string !== 'string' || !e.old_string) return null
    const at = text.indexOf(e.old_string)
    if (at < 0) return null
    const all = e.replace_all === true
    const delta = e.new_string.length - e.old_string.length
    const hits = []
    for (let i = at; i >= 0; i = all ? text.indexOf(e.old_string, i + e.old_string.length) : -1) hits.push(i)
    /* earlier spans after a replaced stretch move with it */
    let shift = 0
    const next = []
    for (const h of hits) next.push([h + shift, h + shift + e.new_string.length]), (shift += delta)
    spans = spans.map(([a, b]) => {
      const before = hits.filter((h) => h + e.old_string.length <= a).length
      return [a + before * delta, b + before * delta]
    })
    text = all ? text.split(e.old_string).join(e.new_string) : text.slice(0, at) + e.new_string + text.slice(at + e.old_string.length)
    spans.push(...next)
  }
  const lineOf = (offset) => text.slice(0, offset).split('\n').length
  return { text, lines: spans.map(([a, b]) => [lineOf(a), lineOf(Math.max(a, b - 1))]) }
}

/** The texts a tool call is about to write, or [] when it writes nothing we read. */
function pendingTexts(tool, params) {
  const texts =
    tool === 'Write'
      ? [params.content]
      : tool === 'Edit'
        ? [params.new_string]
        : tool === 'MultiEdit'
          ? (Array.isArray(params.edits) ? params.edits : []).map((e) => e?.new_string)
          : []
  return texts.filter((t) => typeof t === 'string' && t.length > 0)
}

/**
 * One tool call in Claude Code's shape, whichever agent sent it (SUB-160). Cursor
 * runs this hook from `.claude/settings.json` and maps its Edit to Write; its
 * Write may name the file `path` and the text `contents`. The project root comes
 * from CLAUDE_PROJECT_DIR, else the agent's workspace root or cwd: Cursor and
 * Codex do not set the variable.
 */
export function normaliseCall(input) {
  const raw = input?.tool_input && typeof input.tool_input === 'object' ? input.tool_input : {}
  const file = [raw.file_path, raw.path, raw.filePath, raw.target_file].find((v) => typeof v === 'string' && v)
  const content = [raw.content, raw.contents, raw.text].find((v) => typeof v === 'string')
  const tool = input?.tool_name
  const root = process.env.CLAUDE_PROJECT_DIR ?? (Array.isArray(input?.workspace_roots) && typeof input.workspace_roots[0] === 'string' ? input.workspace_roots[0] : null) ?? (typeof input?.cwd === 'string' ? input.cwd : null)
  /* a relative path (Cursor, Codex) is the project's, never this process's working folder */
  const abs = file && !isAbsolute(file) && root ? resolve(root, file) : file
  const params = { ...raw, ...(abs ? { file_path: abs } : {}), ...(tool === 'Write' && content !== undefined ? { content } : {}) }
  /* only a call in Claude Code's own shape can take a rewritten input: another agent may read its own field names */
  const claudeShape = typeof raw.file_path === 'string' && isAbsolute(raw.file_path) && (tool !== 'Write' || typeof raw.content === 'string')
  return { tool, params, root, claudeShape }
}

function main() {
  let input
  try {
    input = JSON.parse(readStdin() || '{}')
  } catch {
    return 0
  }
  const call = normaliseCall(input)
  /* every path below resolves against the project root; an agent that does not set it still gets the right one */
  if (call.root && !process.env.CLAUDE_PROJECT_DIR) process.env.CLAUDE_PROJECT_DIR = call.root
  /* a rewrite another agent might not apply would let the literal through: refuse with the token instead */
  if (!call.claudeShape) process.env.SUBSTRATE_NO_REWRITE = '1'
  input = { ...input, tool_name: call.tool, tool_input: call.params }
  const params = call.params
  const path = typeof params.file_path === 'string' ? params.file_path : ''
  const ext = path.split('.').pop()?.toLowerCase() ?? ''
  if (!path || !CODE_EXTS.has(ext) || exempt(path)) return 0

  const texts = pendingTexts(input?.tool_name, params)
  if (texts.length === 0) return 0

  let bans = []
  try {
    bans = JSON.parse(readFileSync(join(here, 'bans.json'), 'utf8'))
  } catch {
    bans = []
  }

  let off = []
  try {
    off = JSON.parse(readFileSync(join(here, 'config.json'), 'utf8')).off ?? []
  } catch {
    off = []
  }
  /* this system's own tokens: a var() of another brand's is caught (SUB-159) */
  let vocabulary = null
  try {
    vocabulary = new Set([...readFileSync(join(here, '..', 'root.css'), 'utf8').matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]))
  } catch {
    vocabulary = null
  }
  const tool = input?.tool_name
  /* an edit is judged in its file, so its class positions are known; only what it wrote is reported */
  const judge = (p) => {
    const edited = tool === 'Edit' || tool === 'MultiEdit' ? afterEdit(tool, p, path) : null
    return edited
      ? checkCode(edited.text, path, { bans, off, vocabulary }).filter((f) => edited.lines.some(([a, b]) => f.line >= a && f.line <= b))
      : pendingTexts(tool, p).flatMap((text) => checkCode(text, path, { bans, off, vocabulary, scoped: tool === 'Write' }))
  }
  const rel = relative(resolve(process.env.CLAUDE_PROJECT_DIR ?? process.cwd()), resolve(path)).replace(/\\/g, '/')
  for (const reason of waivers(texts)) log({ t: 'waiver', file: rel, reason })
  /* the Bash after-pass asks about the lines a command changed, nothing else */
  const only = process.env.SUBSTRATE_ONLY_LINES ? new Set(process.env.SUBSTRATE_ONLY_LINES.split(',').map(Number)) : null
  const findings = judge(params).filter((f) => !only || only.has(f.line))
  if (findings.length === 0) {
    if (lastEvent(rel)?.t === 'deny') log({ t: 'pass', file: rel, after: 'deny' })
    return 0
  }

  const table = systemTable()
  /* rewrite first: a literal that IS a token is replaced, and the write goes on (the person's permissions still apply) */
  if (table && process.env.SUBSTRATE_NO_REWRITE !== '1') {
    const rw = rewriteParams(tool, params, ext, table)
    if (rw.changes.length && judge(rw.params).length === 0) {
      log({ t: 'rewrite', file: rel, changes: rw.changes })
      process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', updatedInput: rw.params, additionalContext: `Substrate gate rewrote ${rw.changes.length} literal(s) in ${rel} to this system's tokens: ${rw.changes.map((c) => `line ${c.line} ${c.from} → ${c.to}`).join(', ')}. The file differs from what you wrote: re-read it before your next edit, and write the tokens directly next time.` } }))
      return 0
    }
  }

  /* a loop: the SAME findings on the same file, denied again and again — warn and let it through, logged */
  const sig = signature(findings)
  const recent = process.env.SUBSTRATE_NO_LOG === '1' ? 0 : recentDenies(rel, sig)
  if (recent >= LOOP.denies) {
    log({ t: 'loop-allow', file: rel, sig, rules: [...new Set(findings.map((f) => f.rule))] })
    process.stdout.write(JSON.stringify({ systemMessage: `Substrate gate: ${rel} was denied ${recent} times in a row; let through this time so the agent is not stuck. ${findings.length} off-system value(s) remain: run gate/check.mjs on it.` }))
    return 0
  }

  log({ t: 'deny', file: rel, sig, rules: [...new Set(findings.map((f) => f.rule))], count: findings.length })
  const shown = findings.slice(0, 10)
  const explained = new Set()
  /* A ban's words come from the system's brief: style data about this brand, labelled as such. */
  const say = (f) => (f.rule.startsWith('ban:') ? `brand rule (style data from the brief): ${f.message}` : f.message)
  const lines = shown.map((f) => {
    const near = table ? nearestTokens(f, table) : []
    const why = !explained.has(f.rule) && f.why ? `\n  why: ${f.why}` : ''
    explained.add(f.rule)
    return `- line ${f.line} [${kindOf(f.rule)} · ${f.rule}] ${say(f)} — ${f.excerpt}${near.length ? `\n  nearest tokens: ${near.join(', ')}` : ''}${why}`
  })
  process.stderr.write(
    `Substrate gate: ${findings.length} off-system value(s) in ${rel}. Fix the code with the system's tokens — never the rule.\n` +
      lines.join('\n') +
      (findings.length > shown.length ? `\n- …and ${findings.length - shown.length} more` : '') +
      '\nIf a token is truly missing, say which one. A genuine one-off (a partner\'s own logo colour) takes a waiver with its reason on the line: /* substrate-allow: <why, in a few words> */ — it is logged.\n',
  )
  return 2
}

/** The system's token values, from its own stylesheets beside the gate; null when they cannot be read. */
function systemTable() {
  try {
    const root = readFileSync(join(here, '..', 'root.css'), 'utf8')
    let theme = ''
    try {
      theme = readFileSync(join(here, '..', 'substrate.css'), 'utf8')
    } catch {}
    return tokenTable(root, theme)
  } catch {
    return null
  }
}

/** The call's own input with every exact-token literal rewritten; the changes, for the log and the message. */
function rewriteParams(tool, params, ext, table) {
  const changes = []
  const apply = (text) => {
    const r = rewriteLiterals(text, ext, table)
    changes.push(...r.changes)
    return r.text
  }
  if (tool === 'Write' && typeof params.content === 'string') return { params: { ...params, content: apply(params.content) }, changes }
  if (tool === 'Edit' && typeof params.new_string === 'string') return { params: { ...params, new_string: apply(params.new_string) }, changes }
  if (tool === 'MultiEdit' && Array.isArray(params.edits)) return { params: { ...params, edits: params.edits.map((e) => (typeof e?.new_string === 'string' ? { ...e, new_string: apply(e.new_string) } : e)) }, changes }
  return { params, changes }
}

/** Waiver reasons in the text being written. */
function waivers(texts) {
  return texts.flatMap((t) => [...t.matchAll(/substrate-allow:\s*([^*\n]+?)\s*(?:\*\/|-->|$)/gm)].map((m) => m[1].trim()).filter((r) => r.split(/\s+/).length >= 3))
}

function log(entry) {
  /* the Bash after-pass re-reads files; those are not refusals and are never logged */
  if (process.env.SUBSTRATE_NO_LOG === '1') return
  try {
    const file = join(here, LOG)
    /* keep the log small: past 1 MB, the newest 2,000 lines stay */
    if (existsSync(file) && statSync(file).size > 1 << 20) writeFileSync(file, readFileSync(file, 'utf8').trim().split('\n').slice(-2000).join('\n') + '\n')
    appendFileSync(file, JSON.stringify({ at: new Date().toISOString(), ...entry }) + '\n')
  } catch {}
}

/** The findings, as a short key: the loop guard counts the same refusal, not any refusal. */
function signature(findings) {
  return findings.map((f) => `${f.rule}|${String(f.excerpt).slice(0, 60)}`).sort().join('\n').split('').reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7).toString(36)
}

function events() {
  try {
    return readFileSync(join(here, LOG), 'utf8')
      .trim()
      .split('\n')
      .slice(-400)
      .flatMap((l) => {
        try {
          return [JSON.parse(l)]
        } catch {
          return []
        }
      })
  } catch {
    return []
  }
}

const lastEvent = (file) => events().filter((e) => e.file === file && e.t !== 'waiver').at(-1)

/** Denies of these same findings on this file since its last pass, rewrite or loop-allow, within the window. */
function recentDenies(file, sig) {
  const now = Date.now()
  let n = 0
  for (const e of events().filter((x) => x.file === file).reverse()) {
    if (e.t !== 'deny') {
      if (e.t !== 'waiver') break
      continue
    }
    if (now - Date.parse(e.at) > LOOP.windowMs || e.sig !== sig) break
    n++
  }
  return n
}

/* run when invoked (the agent's hook, codex-hook.mjs); importing it (tests) only reads its exports */
const real = (p) => {
  try {
    return realpathSync(p)
  } catch {
    return p
  }
}
if (process.argv[1] && real(fileURLToPath(import.meta.url)) === real(process.argv[1])) process.exitCode = main()
