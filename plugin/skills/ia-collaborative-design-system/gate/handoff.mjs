/**
 * @substrate/validate/handoff — the CONSUMER gate (FR-115).
 *
 * A locked system ships as a Skill folder (lib/handoff in the hub). This file
 * travels inside it, verbatim, as `gate/handoff.mjs`, next to a verbatim copy
 * of `index.mjs`, so the agent-written code in someone else's project is held
 * to the same source rules as the system's own source — not a reimplementation
 * that could drift. It adds two things the house rules do not know:
 *
 *   checkBans(code, file, bans)    this brand's CHECKABLE bans (the brief's
 *                                  `bans` that carry a `check`), as findings
 *   verifyManifest(manifest, …)    every file of the folder against the sha-256
 *                                  manifest.json pinned when it was served
 *
 * Dependency-free on purpose: the hash function and the file reader are
 * injected, so this runs in Node (the gate, the CLI) and in tests alike.
 */
import { waived, classRanges, inClassRanges, lineStarts, validate } from './index.mjs'

export const HANDOFF_FORMAT = 'substrate.handoff/1'

/** Files a consumer writes that the gate reads. */
export const CODE_EXTS = new Set(['tsx', 'ts', 'jsx', 'js', 'mjs', 'css', 'html', 'vue', 'svelte', 'astro', 'mdx'])

/** The house rules know these extensions directly. */
const HOUSE_EXTS = new Set(['tsx', 'ts', 'jsx', 'js', 'css'])
/** Token families a Substrate system emits: a var() in one of them that this system lacks is another brand's (SUB-159). */
const TOKEN_FAMILY = /^--(palette|color|sp|spacing|text|font|r|radius|ctl|control|sh|shadow|lay|motion|duration|ease|ink|deck|chart|stroke|frame|p-frame)-/

/**
 * `var(--x)` where `--x` looks like a design token but this system has no such
 * token: another brand's value (a client's component borrowing a sibling
 * system's `--palette-header-bg`), or a typo. Names declared in the same text are
 * the file's own custom properties and pass.
 */
export function unknownTokens(code, vocabulary) {
  const own = new Set([...code.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]))
  /* only the families this system declares; font- and color- belong to next/font and shadcn charts too */
  const families = new Set([...vocabulary].map((n) => n.match(TOKEN_FAMILY)?.[1]).filter((f) => f && f !== 'font' && f !== 'color'))
  const lines = code.split('\n')
  const out = []
  for (let i = 0; i < lines.length; i++) {
    for (const m of lines[i].matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) {
      const name = m[1]
      if (!families.has(name.match(TOKEN_FAMILY)?.[1]) || vocabulary.has(name) || own.has(name)) continue
      if (allowed(`${lines[i - 1] ?? ''}\n${lines[i]}`).has('unknown-token')) continue
      out.push({ rule: 'unknown-token', line: i + 1, column: m.index + 1, excerpt: lines[i].trim().slice(0, 100), message: `${name} is not a token of this design system.`, why: 'A var() must name one of this system’s tokens. A name from another brand’s system (installed beside this one) or a typo resolves to nothing here and silently falls back.' })
    }
  }
  return out
}

/* ── fixed lengths in declarations (SUB-175) ──────────────────────────────────
 * "No fixed px" held only for Tailwind class names; a stylesheet or an inline
 * style object could set any length. A spacing, radius or type length in a CSS
 * declaration (a .css file, a <style> block) or a style object is checked too.
 * Allowed: 0, a 1px or 2px hairline, `auto`, percentages and viewport units,
 * anything through var(). Widths, heights and SVG geometry are layout, not checked. */
const LENGTH_PROPS = String.raw`padding(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?|margin(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?|gap|row-gap|column-gap|border(?:-(?:top|bottom)-(?:left|right))?-radius|font-size|line-height|letter-spacing`
const CSS_DECL = new RegExp(String.raw`(?<![\w-])(${LENGTH_PROPS})\s*:\s*([^;{}]+)`, 'gi')
const STYLE_PROPS = String.raw`padding(?:Top|Right|Bottom|Left|Inline|Block)?(?:Start|End)?|margin(?:Top|Right|Bottom|Left|Inline|Block)?(?:Start|End)?|gap|rowGap|columnGap|border(?:(?:Top|Bottom)(?:Left|Right))?Radius|fontSize|lineHeight|letterSpacing`
const STYLE_DECL = new RegExp(String.raw`(?<![\w$])(${STYLE_PROPS})\s*:\s*(-?\d+(?:\.\d+)?(?![\w.%])|'[^']*'|"[^"]*"|\`[^\`]*\`)`, 'g')
const HAIRLINE = new Set(['0', '0px', '1px', '2px', '-1px'])
/** The fixed lengths in a value: px/rem/em numbers outside var(), minus the hairlines. */
function fixedIn(value) {
  const bare = value.replace(/var\([^()]*(?:\([^()]*\)[^()]*)*\)/g, '')
  return [...bare.matchAll(/-?\d*\.?\d+(?:px|rem|em)\b/g)].map((m) => m[0]).filter((v) => !HAIRLINE.has(v))
}
export function fixedLengths(code, ext) {
  const lines = code.split('\n')
  const out = []
  const push = (i, col, prop, value) => out.push({ rule: 'no-fixed-length', line: i + 1, column: col + 1, excerpt: lines[i].trim().slice(0, 100), message: `Fixed length in ${prop}: ${value}.`, why: 'Spacing, radius and type come from the system’s tokens (var(--sp-inset-md), var(--radius-controls), var(--text-small)) or their utilities, so a density mode or a re-lock moves them. A literal length is welded to one value.' })
  const cssLike = ext === 'css' || ext === 'scss' || MARKUP.has(ext)
  const styleRanges = MARKUP.has(ext) ? [...code.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>|\bstyle\s*=\s*(["'])[^"']*\2/gi)].map((m) => [m.index, m.index + m[0].length]) : null
  const starts = lineStarts(code)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (allowed(`${lines[i - 1] ?? ''}\n${line}`).has('no-fixed-length')) continue
    if (cssLike) {
      for (const m of line.matchAll(CSS_DECL)) {
        if (styleRanges && !styleRanges.some(([a, b]) => starts[i] + m.index >= a && starts[i] + m.index < b)) continue
        const bad = fixedIn(m[2])
        if (bad.length) push(i, m.index, m[1], bad.join(' '))
      }
    }
    if (JS_LIKE.has(ext) || MARKUP.has(ext)) {
      for (const m of line.matchAll(STYLE_DECL)) {
        const prop = m[1]
        const raw = m[2]
        /* a bare number is px to React, except line-height, where it is a ratio */
        const bad = /^-?\d/.test(raw) ? (prop === 'lineHeight' || Number(raw) === 0 || HAIRLINE.has(`${raw}px`) ? [] : [`${raw}`]) : fixedIn(raw.slice(1, -1))
        if (bad.length) push(i, m.index, prop, bad.join(' '))
      }
    }
  }
  return out
}
const JS_LIKE = new Set(['tsx', 'ts', 'jsx', 'js', 'mjs'])

/** Markup files: their <style> blocks and class directives hold classes too. */
const MARKUP = new Set(['html', 'vue', 'svelte', 'astro', 'mdx'])
/** Sorted, overlapping ranges merged, so the binary search stays exact. */
function mergeRanges(ranges) {
  const out = []
  for (const r of ranges) {
    const last = out.at(-1)
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1])
    else out.push([...r])
  }
  return out
}

/** Markup with class attributes reads like JSX to the house rules. */
const MARKUP_AS = { html: 'tsx', vue: 'tsx', svelte: 'tsx', astro: 'tsx', mdx: 'tsx', mjs: 'js' }

const ALLOW = /substrate-allow\s+([a-z0-9:-]+)/g

function allowed(text) {
  const out = new Set()
  for (const m of text.matchAll(ALLOW)) if (m[1]) out.add(m[1])
  /* a waiver with a reason waives every rule, brand bans included (SUB-157) */
  if (waived(text)) for (const r of ['unknown-token', 'no-fixed-length', '*']) out.add(r)
  return out
}

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')

/** `text-shadow` → `textShadow`, so a style object is caught too. */
const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase())

/**
 * The matcher for one ban check. The kinds are a closed set and every value is
 * escaped — no model-written pattern ever runs here.
 */
function banMatcher(check) {
  const v = escapeRegex(check.value)
  switch (check.kind) {
    case 'class':
      /* Exactly this class: `rounded-full`, not `rounded-full-x`. */
      return new RegExp(String.raw`(?<![\w-])${v}(?![\w-])`, 'g')
    case 'class-prefix':
      /* Every class that starts with it: `bg-gradient` → `bg-gradient-to-r`. */
      return new RegExp(String.raw`(?<![\w-])${v}[\w-]*`, 'g')
    case 'css-property':
      return new RegExp(String.raw`(?<![\w-])(?:${v}|${escapeRegex(camel(check.value))})\s*:`, 'g')
    case 'css-function':
      return new RegExp(String.raw`(?<![\w-])${v}\s*\(`, 'gi')
    case 'literal':
      return new RegExp(v, 'gi')
    default:
      return null
  }
}

/**
 * This brand's checkable bans, as findings in the house shape. A line (or the
 * line above it) carrying `substrate-allow ban:<id>` is exempt, like any rule.
 *
 * @param {string} code
 * @param {string} filename
 * @param {{id:string, text:string, why:string, check?:{kind:string, value:string}}[]} bans
 */
export function checkBans(code, filename, bans = [], opts = {}) {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  if (!CODE_EXTS.has(ext)) return []
  const lines = code.split('\n')
  const findings = []
  /* SUB-177: a class ban reads class positions in code (markup reads as JSX), plus a markup file's <style>
   * blocks and `class:name` directives; a stylesheet is checked whole, and so is a scan that lost its place */
  const ranges = ext !== 'css' && opts.scoped !== false ? classRanges(code) : null
  if (ranges && MARKUP.has(ext)) {
    for (const m of code.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) ranges.push([m.index + m[0].indexOf(m[1]), m.index + m[0].indexOf(m[1]) + m[1].length])
    for (const m of code.matchAll(/\bclass:([\w-]+)/g)) ranges.push([m.index + 6, m.index + 6 + m[1].length])
    ranges.sort((a, b) => a[0] - b[0])
  }
  const scoped = ranges !== null
  const inClass = scoped ? inClassRanges(mergeRanges(ranges)) : () => true
  const starts = scoped ? lineStarts(code) : []
  for (const ban of bans) {
    if (!ban?.check) continue
    const re = banMatcher(ban.check)
    if (!re) continue
    const classBan = ban.check.kind === 'class' || ban.check.kind === 'class-prefix'
    const rule = `ban:${ban.id}`
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? ''
      const ok = allowed(`${lines[i - 1] ?? ''}\n${line}`)
      if (ok.has(rule) || ok.has('*')) continue
      re.lastIndex = 0
      let m
      while ((m = re.exec(line)) !== null) {
        if (classBan && !inClass(starts[i] + m.index)) {
          if (m.index === re.lastIndex) re.lastIndex++
          continue
        }
        findings.push({
          rule,
          line: i + 1,
          column: m.index + 1,
          excerpt: line.trim().slice(0, 100),
          message: ban.text,
          why: ban.why,
        })
        if (m.index === re.lastIndex) re.lastIndex++
      }
    }
  }
  return findings
}

/**
 * Everything the consumer gate says about one file: the house source rules
 * (for markup, read as JSX — a class attribute is a className) plus the bans.
 */
export function checkCode(code, filename, { bans = [], off = [], scoped = true, vocabulary = null } = {}) {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  if (!CODE_EXTS.has(ext)) return []
  const foreign = vocabulary && !off.includes('unknown-token') ? unknownTokens(code, vocabulary) : []
  const lengths = off.includes('no-fixed-length') ? [] : fixedLengths(code, ext)
  const houseExt = HOUSE_EXTS.has(ext) ? ext : MARKUP_AS[ext]
  /* `off`: house rules this system does not hold (gate/config.json) — `no-mono` for a brand that ships a mono face (SUB-173).
   * `scoped: false` — a fragment with no file around it (an Edit whose file could not be read): every line is checked, as before SUB-177 */
  const skip = new Set(off)
  const house = houseExt ? validate(code, `consumer.${houseExt}`, { scoped }).filter((f) => !skip.has(f.rule)) : []
  return [...house, ...checkBans(code, filename, bans, { scoped }), ...foreign, ...lengths].sort(
    (a, b) => a.line - b.line || a.column - b.column,
  )
}

/**
 * Verify a folder against its manifest. Never throws on a mismatch — it
 * reports per file, and `ok` is the whole-folder verdict.
 *
 * @param {{ $format?: string, files?: Record<string, {sha256:string, bytes?:number}> }} manifest
 * @param {(path: string) => Uint8Array | null} readFile  the bytes at a folder-relative path, or null
 * @param {(bytes: Uint8Array) => string} sha256  hex digest
 */
export function verifyManifest(manifest, readFile, sha256) {
  if (!manifest || typeof manifest !== 'object' || !manifest.files || typeof manifest.files !== 'object') {
    return { ok: false, files: [], problem: 'not a handoff manifest: no `files` map.' }
  }
  if (manifest.$format && manifest.$format !== HANDOFF_FORMAT) {
    return { ok: false, files: [], problem: `unknown manifest format "${manifest.$format}".` }
  }
  const files = []
  for (const [path, entry] of Object.entries(manifest.files)) {
    if (path.includes('..') || path.startsWith('/')) {
      files.push({ path, status: 'refused', expected: entry?.sha256 ?? null, actual: null })
      continue
    }
    const bytes = readFile(path)
    if (!bytes) {
      files.push({ path, status: 'missing', expected: entry?.sha256 ?? null, actual: null })
      continue
    }
    const actual = sha256(bytes)
    files.push({ path, status: actual === entry?.sha256 ? 'match' : 'changed', expected: entry?.sha256 ?? null, actual })
  }
  /* Withheld files (licensed, not redistributable) are bring-your-own: absent
   * is expected and not a failure; present must be the exact file. */
  for (const entry of Array.isArray(manifest.withheld) ? manifest.withheld : []) {
    const path = entry?.file
    if (typeof path !== 'string' || path.includes('..') || path.startsWith('/')) continue
    const bytes = readFile(path)
    if (!bytes) {
      files.push({ path, status: 'withheld', expected: entry.sha256 ?? null, actual: null })
      continue
    }
    const actual = sha256(bytes)
    files.push({ path, status: actual === entry.sha256 ? 'match' : 'changed', expected: entry.sha256 ?? null, actual })
  }
  const ok =
    files.some((f) => f.status === 'match') && files.every((f) => f.status === 'match' || f.status === 'withheld')
  return { ok, files }
}
