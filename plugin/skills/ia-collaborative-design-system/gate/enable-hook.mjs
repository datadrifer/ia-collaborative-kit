#!/usr/bin/env node
/**
 * Switch on the write-time gate (D14, FR-115, SUB-160) — ships as
 * `gate/enable-hook.mjs` in every Substrate handoff package.
 *
 *   node .claude/skills/<slug>/gate/enable-hook.mjs [--project <dir>] [--codex] [--ci]
 *
 * Adds ONE PreToolUse entry to the project's `.claude/settings.json` (created
 * if missing) that runs this folder's `hook.mjs` on every Write, Edit and
 * MultiEdit. Claude Code reads it, and so does Cursor (its third-party hooks
 * read `.claude/settings.json`; exit 2 is a deny there too). The path is
 * anchored on $CLAUDE_PROJECT_DIR, falling back to the folder the agent runs in,
 * because Cursor does not set the variable.
 *
 *   --codex  also adds a PreToolUse hook on `apply_patch` to `.codex/hooks.json`
 *            (written by default when the project has a `.codex/` folder). Codex
 *            asks you to trust a new hook once, in /hooks.
 *   --ci     also writes `.github/workflows/substrate-<slug>-gate.yml`: the same
 *            rules on a pull request's changed lines, with the lock in the output,
 *            for agents with no hooks at all.
 *
 * Idempotent; it never rewrites a settings file it cannot parse. The commands it
 * writes are built HERE, from this file's own location — never read from SKILL.md
 * or anything a publisher wrote — so installing a system can only ever enable
 * this gate.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs'
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const hook = join(here, 'hook.mjs')
const codexHook = join(here, 'codex-hook.mjs')

const MATCHER = 'Write|Edit|MultiEdit'

/** A gate file's path from the project root, or null when the gate sits outside the project. */
function inside(project, file) {
  const rel = relative(project, file)
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel) ? rel.split(sep).join('/') : null
}

/** Only these characters ever reach a shell command or a workflow this writes: nothing to quote, nothing to run. */
const SAFE_PATH = /^[A-Za-z0-9._/@+-]+$/
export const safePath = (p) => typeof p === 'string' && SAFE_PATH.test(p) && !p.split('/').includes('..')

/** The repository root, real path, or null outside git. */
function gitTop(dir) {
  const r = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd: dir, encoding: 'utf8' })
  const top = r.status === 0 ? r.stdout.trim() : ''
  return top && existsSync(top) ? realpathSync(top) : null
}

/** The Claude Code / Cursor hook command for a project root, and the older form it replaces. */
export function hookCommand(project) {
  const rel = inside(project, hook)
  if (rel) return safePath(rel) ? { command: `node "\${CLAUDE_PROJECT_DIR:-.}/${rel}"`, older: `node "$CLAUDE_PROJECT_DIR/${rel}"` } : null
  return safePath(hook) ? { command: `node "${hook}"`, older: null } : null
}

/** The Codex hook command, from the repository root (Codex runs it there), or null when the path is not safe to write. */
export function codexCommand(top) {
  const rel = inside(top, codexHook)
  if (rel) return safePath(rel) ? `node "$(git rev-parse --show-toplevel 2>/dev/null || pwd)/${rel}"` : null
  return safePath(codexHook) ? `node "${codexHook}"` : null
}

function readSettings(file) {
  if (!existsSync(file)) return { ok: true, value: {} }
  try {
    const value = JSON.parse(readFileSync(file, 'utf8'))
    if (!value || typeof value !== 'object' || Array.isArray(value)) return { ok: false, why: 'is not a settings object' }
    return { ok: true, value }
  } catch {
    return { ok: false, why: 'is not valid JSON — fix it first' }
  }
}

/** One PreToolUse entry with `command`, added (or upgraded from `older`) without touching the rest. */
function withHook(settings, matcher, command, older) {
  const hooks = settings.hooks && typeof settings.hooks === 'object' && !Array.isArray(settings.hooks) ? settings.hooks : {}
  const pre = Array.isArray(hooks.PreToolUse) ? hooks.PreToolUse : []
  if (pre.some((e) => Array.isArray(e?.hooks) && e.hooks.some((h) => h?.command === command))) return null
  const upgraded = pre.map((e) => (Array.isArray(e?.hooks) && e.hooks.some((h) => older && h?.command === older) ? { ...e, hooks: e.hooks.map((h) => (h?.command === older ? { ...h, command } : h)) } : e))
  const changed = upgraded.some((e, i) => e !== pre[i])
  return { ...settings, hooks: { ...hooks, PreToolUse: changed ? upgraded : [...pre, { matcher, hooks: [{ type: 'command', command }] }] } }
}

function writeHook(file, matcher, command, older, label) {
  const read = readSettings(file)
  if (!read.ok) {
    console.error(`enable-hook: ${file} ${read.why}. Nothing was changed.`)
    return { code: 1, wrote: false }
  }
  const next = withHook(read.value, matcher, command, older)
  if (!next) {
    console.log(`enable-hook: the ${label} gate is already on.`)
    return { code: 0, wrote: false }
  }
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`)
  console.log(`enable-hook: the ${label} gate is on — ${file}`)
  return { code: 0, wrote: true }
}

/**
 * The pull-request workflow. The gate that judges a pull request is the base
 * branch's copy (a pull request cannot loosen the rules it is judged by); the
 * pull request's own copy is used only when the system is new in it. The base
 * ref reaches the shell as an environment variable, never pasted into the script.
 * `gate` is the gate folder from the repository root, already checked safe.
 */
export function workflow(slug, gate) {
  const system = gate.replace(/\/gate$/, '')
  return [
    `name: Substrate gate (${slug})`,
    'on: pull_request',
    'permissions:',
    '  contents: read',
    'jobs:',
    '  gate:',
    '    runs-on: ubuntu-latest',
    '    env:',
    '      BASE: ${{ github.base_ref }}',
    '    steps:',
    '      - uses: actions/checkout@v4',
    '        with:',
    '          fetch-depth: 0',
    '      - uses: actions/setup-node@v4',
    '        with:',
    '          node-version: 20',
    '      - name: The installed system matches its lock',
    `        run: node ${gate}/check.mjs --verify`,
    "      - name: The base branch's gate",
    '        run: |',
    `          if git cat-file -e "origin/$BASE:${system}/gate/check.mjs" 2>/dev/null; then`,
    '            mkdir -p "$RUNNER_TEMP/base"',
    `            git archive "origin/$BASE" ${system} | tar -x -C "$RUNNER_TEMP/base"`,
    `            echo "GATE=$RUNNER_TEMP/base/${gate}" >> "$GITHUB_ENV"`,
    '          else',
    `            echo "GATE=${gate}" >> "$GITHUB_ENV"`,
    '          fi',
    '      - name: The changed lines keep to the system',
    '        run: node "$GATE/check.mjs" --changed "origin/$BASE"',
    '',
  ].join('\n')
}

function main(args) {
  const flag = args.indexOf('--project')
  const given = resolve(flag !== -1 && args[flag + 1] ? args[flag + 1] : (process.env.CLAUDE_PROJECT_DIR ?? process.cwd()))
  /* the real path, as this file's own location is (macOS: /var is /private/var), so "inside the project" holds */
  const project = existsSync(given) ? realpathSync(given) : given
  const hookCmd = hookCommand(project)
  if (!hookCmd) {
    console.error('enable-hook: the gate sits in a folder whose path has characters a hook command cannot hold safely (only letters, digits and . _ / @ + -). Nothing was changed.')
    return 1
  }
  let code = writeHook(join(project, '.claude', 'settings.json'), MATCHER, hookCmd.command, hookCmd.older, 'write-time').code
  /* Codex and GitHub both work from the repository root: a monorepo app's install is addressed from there */
  const top = gitTop(project) ?? project
  if (args.includes('--codex') || existsSync(join(top, '.codex'))) {
    const cmd = codexCommand(top)
    if (!cmd) {
      console.error('enable-hook: the Codex hook path is not safe to write. Nothing was written for Codex.')
      code = 1
    } else {
      const codex = writeHook(join(top, '.codex', 'hooks.json'), '^apply_patch$', cmd, null, 'Codex')
      code = codex.code || code
      if (codex.wrote) console.log('enable-hook: Codex asks you to trust a new hook once — open /hooks in Codex and trust it. It gates apply_patch; files a shell command writes in Codex are not gated (the pull-request check catches them).')
    }
  }
  if (args.includes('--ci')) {
    const gate = inside(top, here)
    const slug = basename(dirname(here))
    if (!gate || !safePath(gate) || !safePath(slug)) {
      console.error('enable-hook: --ci needs the system installed inside the repository, at a path of letters, digits and . _ / @ + -. Nothing was written for CI.')
      return 1
    }
    const file = join(top, '.github', 'workflows', `substrate-${slug}-gate.yml`)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, workflow(slug, gate))
    console.log(`enable-hook: the pull-request check is written — ${file}`)
  }
  return code
}

const real = (p) => {
  try {
    return realpathSync(p)
  } catch {
    return p
  }
}
const isMain = process.argv[1] && real(fileURLToPath(import.meta.url)) === real(process.argv[1])
if (isMain) process.exitCode = main(process.argv.slice(2))
