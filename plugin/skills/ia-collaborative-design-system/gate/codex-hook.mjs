#!/usr/bin/env node
/**
 * The write-time gate for OpenAI Codex (SUB-160) — ships as `gate/codex-hook.mjs`
 * in every Substrate handoff package. `gate/enable-hook.mjs --codex` wires it
 * into the project's `.codex/hooks.json` as a PreToolUse hook on `apply_patch`.
 *
 * Codex writes files through one tool, `apply_patch`, whose input is a patch:
 *
 *   *** Begin Patch
 *   *** Add File: src/a.tsx        (every line +)
 *   *** Update File: src/b.css     (@@ hunks of ' ', '-', '+' lines; *** Move to: optional)
 *   *** Delete File: src/c.ts
 *   *** End Patch
 *
 * Each added file becomes a Write and each updated file a MultiEdit (one edit per
 * hunk: the context and removed lines → the context and added lines), judged by
 * this folder's own `hook.mjs`, unchanged — the same rules, waivers and log as in
 * Claude Code. Codex cannot take a rewritten Write, so the rewrite is off here:
 * an exact-token literal is refused with its token instead. A refusal is exit 2
 * with the reasons on stderr (Codex's deny). Anything this cannot read passes:
 * the gate never blocks a tool it does not understand.
 */
import { spawnSync } from 'node:child_process'
import { readFileSync, realpathSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const hook = join(dirname(fileURLToPath(import.meta.url)), 'hook.mjs')

/** A Codex patch as Claude Code tool calls: [{ tool_name, tool_input }]. */
export function patchCalls(patch) {
  const lines = String(patch ?? '').split('\n')
  const calls = []
  let current = null
  let hunk = null
  const closeHunk = () => {
    if (current?.kind === 'update' && hunk && (hunk.old.length || hunk.new.length)) current.edits.push({ old_string: hunk.old.join('\n'), new_string: hunk.new.join('\n') })
    hunk = null
  }
  const close = () => {
    closeHunk()
    if (!current) return
    if (current.kind === 'add') calls.push({ tool_name: 'Write', tool_input: { file_path: current.path, content: current.content.join('\n') } })
    if (current.kind === 'update' && current.edits.length) calls.push({ tool_name: 'MultiEdit', tool_input: { file_path: current.to ?? current.path, edits: current.edits } })
    current = null
  }
  for (const line of lines) {
    const head = line.match(/^\*\*\* (Add|Update|Delete) File: (.+)$/)
    if (head) {
      close()
      current = { kind: head[1].toLowerCase(), path: head[2].trim(), content: [], edits: [] }
      continue
    }
    if (/^\*\*\* (Begin|End) Patch\s*$/.test(line) || /^\*\*\* End of File\s*$/.test(line)) {
      if (/End Patch/.test(line)) close()
      continue
    }
    if (!current) continue
    const move = line.match(/^\*\*\* Move to: (.+)$/)
    if (move) {
      current.to = move[1].trim()
      continue
    }
    if (current.kind === 'add') {
      if (line.startsWith('+')) current.content.push(line.slice(1))
      continue
    }
    if (current.kind !== 'update') continue
    if (line.startsWith('@@')) {
      closeHunk()
      hunk = { old: [], new: [] }
      continue
    }
    hunk ??= { old: [], new: [] }
    if (line.startsWith('+')) hunk.new.push(line.slice(1))
    else if (line.startsWith('-')) hunk.old.push(line.slice(1))
    else if (line.startsWith(' ') || line === '') {
      hunk.old.push(line.slice(1))
      hunk.new.push(line.slice(1))
    }
  }
  close()
  return calls
}

function main() {
  let input
  try {
    input = JSON.parse(readFileSync(0, 'utf8') || '{}')
  } catch {
    return 0
  }
  if (input?.tool_name !== 'apply_patch') return 0
  const patch = typeof input.tool_input?.command === 'string' ? input.tool_input.command : typeof input.tool_input?.patch === 'string' ? input.tool_input.patch : typeof input.tool_input === 'string' ? input.tool_input : ''
  const calls = patchCalls(patch)
  const reasons = []
  for (const call of calls) {
    const r = spawnSync(process.execPath, [hook], {
      input: JSON.stringify({ hook_event_name: 'PreToolUse', cwd: input.cwd, ...call }),
      encoding: 'utf8',
      /* Codex's cwd is the session's project: its patch paths are relative to it */
      env: { ...process.env, SUBSTRATE_NO_REWRITE: '1', CLAUDE_PROJECT_DIR: typeof input.cwd === 'string' ? input.cwd : process.env.CLAUDE_PROJECT_DIR ?? process.cwd() },
      timeout: 30_000,
    })
    if (r.status === 2) reasons.push(`${call.tool_input.file_path}: ${(r.stderr || r.stdout).trim()}`)
  }
  if (!reasons.length) return 0
  process.stderr.write(`${reasons.join('\n\n')}\n`)
  return 2
}

const real = (p) => {
  try {
    return realpathSync(p)
  } catch {
    return p
  }
}
const isMain = process.argv[1] && real(fileURLToPath(import.meta.url)) === real(process.argv[1])
if (isMain) process.exitCode = main()
