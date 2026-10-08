#!/usr/bin/env node
/**
 * The consumer gate's CLI (FR-115) — ships as `gate/check.mjs` in every
 * Substrate handoff package.
 *
 *   node gate/check.mjs <file>…   check files against the house source rules
 *                                 plus this brand's checkable bans
 *   node gate/check.mjs --verify  check this folder against manifest.json
 *   node gate/check.mjs --changed <base>
 *                                 the rules on the lines a branch added since <base>
 *                                 (a pull request in CI, SUB-160): findings on those
 *                                 lines only, the lock named, GitHub annotations
 *
 * Exit 0 when clean, 1 on any finding or mismatch. Node only, no dependencies:
 * it runs in any project the package is installed into. It sets
 * `process.exitCode` and returns rather than calling `process.exit()`, so
 * piped output is never cut off mid-report.
 */
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { appendFileSync, existsSync, readFileSync, readdirSync, realpathSync } from 'node:fs'
import { basename, dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import { CODE_EXTS, checkCode, verifyManifest } from './handoff.mjs'

const here = dirname(fileURLToPath(import.meta.url))
/* Installed: <skill>/gate/check.mjs, so the folder is one up. */
const folder = dirname(here)

function readJson(path, fallback) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return fallback
  }
}

/** Every file under `dir`, folder-relative, with forward slashes. */
function listFiles(dir, prefix = '') {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) out.push(...listFiles(join(dir, entry.name), rel))
    else out.push(rel)
  }
  return out
}

function verify() {
  const manifest = readJson(join(folder, 'manifest.json'), null)
  if (!manifest) {
    console.error('check: no manifest.json next to this gate — nothing to verify against.')
    return 1
  }
  const result = verifyManifest(
    manifest,
    (path) => {
      const full = join(folder, path)
      return existsSync(full) ? new Uint8Array(readFileSync(full)) : null
    },
    (bytes) => createHash('sha256').update(bytes).digest('hex'),
  )
  for (const f of result.files) {
    if (f.status === 'match') continue
    console.error(`${f.status.padEnd(8)} ${f.path}${f.status === 'withheld' ? ' (licensed — place your own copy here)' : ''}`)
  }
  if (result.problem) console.error(`check: ${result.problem}`)
  /* Files the manifest does not name are not part of this version — left over
   * from an older install, or added by hand. Reported, not failed. */
  const named = new Set([...Object.keys(manifest.files ?? {}), ...(manifest.withheld ?? []).map((w) => w.file), 'manifest.json'])
  for (const extra of listFiles(folder).filter((p) => !named.has(p))) {
    console.error(`extra    ${extra} (not in this version's manifest — remove it, or reinstall into an empty folder)`)
  }
  const matched = result.files.filter((f) => f.status === 'match').length
  console.log(
    result.ok
      ? `check: package verified — ${matched} files match manifest.json.`
      : 'check: the package does NOT match its manifest — a file was edited or is missing.',
  )
  return result.ok ? 0 : 1
}

function checkFiles(files) {
  const bans = readJson(join(here, 'bans.json'), [])
  const off = readJson(join(here, 'config.json'), {}).off ?? []
  let vocabulary = null
  try {
    vocabulary = new Set([...readFileSync(join(here, '..', 'root.css'), 'utf8').matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]))
  } catch {}
  let total = 0
  for (const file of files) {
    let code
    try {
      code = readFileSync(resolve(file), 'utf8')
    } catch {
      console.error(`check: cannot read ${file}`)
      total++
      continue
    }
    for (const f of checkCode(code, file, { bans, off, vocabulary })) {
      total++
      console.error(`${file}:${f.line}:${f.column}  [${f.rule}]  ${f.message}`)
      console.error(`  ${f.excerpt}`)
      console.error(`  why: ${f.why}`)
    }
  }
  console.log(total === 0 ? `check: clean — ${files.length} file(s).` : `check: ${total} finding(s).`)
  return total === 0 ? 0 : 1
}

/** The new-side line numbers of the hunks in one file's `git diff -U0` (only `@@` lines are read: no path parsing). */
export function hunkLines(diff) {
  const out = new Set()
  for (const line of String(diff).split('\n')) {
    const hunk = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/)
    if (!hunk) continue
    const start = Number(hunk[1])
    const count = hunk[2] == null ? 1 : Number(hunk[2])
    for (let i = 0; i < count; i++) out.add(start + i)
  }
  return out
}

/** The lock this gate belongs to, for the record a CI check leaves. */
function lockLine() {
  const path = join(folder, 'substrate.lock.json')
  if (!existsSync(path)) return 'no lock beside this gate'
  const bytes = readFileSync(path)
  const lock = readJson(path, {})
  return `lock ${lock.params ?? '?'} · sha256:${createHash('sha256').update(bytes).digest('hex').slice(0, 16)}`
}

/** A GitHub workflow command value: % CR LF escaped, plus : and , in a property. */
const ghData = (s) => String(s).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A')
const ghProp = (s) => ghData(s).replace(/:/g, '%3A').replace(/,/g, '%2C')

function checkChanged(base) {
  const git = (args, cwd) => spawnSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  /* paths from git are relative to the repository root, whatever folder this runs in */
  const top = git(['rev-parse', '--show-toplevel']).stdout.trim()
  if (!top) {
    console.error('check: --changed runs inside a git repository')
    return 1
  }
  /* NUL-separated names: a space, a tab or an accent in a path is still the path; --end-of-options: a base is never a flag */
  const names = git(['-c', 'core.quotepath=off', 'diff', '--name-only', '-z', '--no-ext-diff', '--diff-filter=AMR', '--end-of-options', `${base}...HEAD`], top)
  if (names.status !== 0) {
    console.error(`check: git diff against ${base} failed: ${(names.stderr || '').trim()} (in CI, check out with fetch-depth: 0)`)
    return 1
  }
  const name = readJson(join(folder, 'manifest.json'), {}).name ?? basename(folder)
  const bans = readJson(join(here, 'bans.json'), [])
  const off = readJson(join(here, 'config.json'), {}).off ?? []
  let vocabulary = null
  try {
    vocabulary = new Set([...readFileSync(join(here, '..', 'root.css'), 'utf8').matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]))
  } catch {}
  const annotate = process.env.GITHUB_ACTIONS === 'true'
  const changed = names.stdout.split('\0').filter(Boolean)
  /* the installed system changed without a new lock: its rules or tokens were edited in the pull request itself */
  const system = relative(top, folder).split(sep).join('/')
  const touched = changed.filter((f) => f === system || f.startsWith(`${system}/`))
  let total = 0
  if (touched.length && !touched.includes(`${system}/substrate.lock.json`)) {
    total++
    const message = `the installed system ${system} changed (${touched.slice(0, 3).join(', ')}) without a new lock: re-install a locked version (/substrate:update) instead of editing it`
    if (annotate) console.log(`::error file=${ghProp(touched[0])},title=${ghProp('substrate-lock')}::${ghData(message)}`)
    console.error(`check: ${message}`)
  }
  let files = 0
  const unread = []
  for (const file of changed) {
    const ext = file.split('.').pop()?.toLowerCase() ?? ''
    if (!CODE_EXTS.has(ext) || /(^|\/)(node_modules|\.claude)\//.test(file)) continue
    const abs = join(top, file)
    if (!existsSync(abs)) {
      unread.push(file)
      continue
    }
    const hunks = git(['diff', '--unified=0', '--no-color', '--no-ext-diff', '--end-of-options', `${base}...HEAD`, '--', file], top)
    if (hunks.status !== 0) {
      unread.push(file)
      continue
    }
    const lines = hunkLines(hunks.stdout)
    if (!lines.size) continue
    files++
    for (const f of checkCode(readFileSync(abs, 'utf8'), file, { bans, off, vocabulary })) {
      if (!lines.has(f.line)) continue
      total++
      if (annotate) console.log(`::error file=${ghProp(file)},line=${f.line},col=${f.column},title=${ghProp(f.rule)}::${ghData(`${f.message} (${f.why})`)}`)
      console.error(`${file}:${f.line}:${f.column}  [${f.rule}]  ${f.message}`)
      console.error(`  why: ${f.why}`)
    }
  }
  /* a changed code file the check could not read is a failure, never a silent pass */
  for (const f of unread) {
    total++
    console.error(`check: could not read the changed file ${f}`)
  }
  const summary = `check: ${name} · ${lockLine()} — ${total === 0 ? `clean, ${files} changed file(s)` : `${total} finding(s) on changed lines in ${files} file(s)`}.`
  console.log(summary)
  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Substrate gate\n\n${summary.replace(/^check: /, '')}\n`)
    } catch {}
  }
  return total === 0 ? 0 : 1
}

function main(args) {
  if (args.includes('--verify')) return verify()
  const changed = args.indexOf('--changed')
  if (changed !== -1) {
    const base = args[changed + 1]
    if (!base || base.startsWith('--')) {
      console.error('usage: node gate/check.mjs --changed <base ref>   (e.g. origin/main)')
      return 1
    }
    return checkChanged(base)
  }
  const files = args.filter((a) => !a.startsWith('--'))
  if (files.length === 0) {
    console.error('usage: node gate/check.mjs <file>…   |   node gate/check.mjs --verify   |   node gate/check.mjs --changed <base>')
    return 1
  }
  return checkFiles(files)
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === (() => {
  try {
    return realpathSync(process.argv[1])
  } catch {
    return process.argv[1]
  }
})()
if (isMain) process.exitCode = main(process.argv.slice(2))
