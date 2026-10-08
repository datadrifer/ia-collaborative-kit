#!/usr/bin/env node
// Brings the kit up to the version on IA's Design System page in Claude.
// The page is the master copy: the owner changes it in Claude, then runs this from the
// kit folder (Claude reads the page into a copy folder first; see commands/sync.md).
//
//   node sync.mjs <copy dir>
//     <copy dir>/project/...           every file read from the page
//     <copy dir>/blobs/<id>.<ext>      every asset the page's index names, saved by id
//
// It updates, in the kit (the current folder):
//   plugin/design-system-page/   a fresh copy of the page (what /ia-design:create-page rebuilds from)
//   plugin/skills/<slug>/        the token values, brand files, brand book and version
//   version numbers              plugin.json, marketplace.json, the skill's manifest and SKILL.md
//   CHANGELOG.md                 one entry per synced version
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const SLUG = 'ia-collaborative-design-system'
const KIT = process.cwd()
const SKILL = join(KIT, 'plugin', 'skills', SLUG)
const SNAPSHOT = join(KIT, 'plugin', 'design-system-page')
const BRAND_GROUPS = ['Logos', 'Brand elements', 'Photography']
const PREFIX = { 'space-': '--sp-', 'radius-': '--r-', 'control-': '--ctl-', 'shadow-': '--sh-' }
const DARK_OPEN = ".dark, [data-theme='dark'] {"

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))
const writeJson = (path, data) => writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`)
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex')
const fail = (message) => {
  console.error(`sync: ${message}`)
  process.exitCode = 1
}

/** A page token name as the code's custom property: space-inset-md → --sp-inset-md. */
function cssName(name) {
  for (const [from, to] of Object.entries(PREFIX)) if (name.startsWith(from)) return to + name.slice(from.length)
  return `--${name}`
}

/** Compare semantic versions: 1 when a is newer than b. */
function newer(a, b) {
  const pa = String(a).split('.').map(Number)
  const pb = String(b).split('.').map(Number)
  for (let i = 0; i < 3; i++) if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) > (pb[i] ?? 0)
  return false
}

// ---- What the page says: every token as the code names it, light and dark ----------------

function pageValues(tokens) {
  const light = new Map()
  const dark = new Map()
  const raw = new Map()
  for (const family of ['color', 'spacing', 'radius', 'size', 'shadow']) {
    for (const t of tokens[family]?.tokens ?? []) {
      raw.set(t.name, t.value)
      const value = typeof t.value === 'object' && t.value !== null ? t.value : { light: t.value }
      light.set(cssName(t.name), value.light)
      if (value.dark !== undefined) dark.set(cssName(t.name), value.dark)
    }
  }
  for (const group of tokens.type?.groups ?? []) {
    for (const s of group.styles ?? []) {
      const base = `--text-${s.name}`
      if (s.fontSize !== undefined) light.set(base, s.fontSize)
      if (s.lineHeight !== undefined) light.set(`${base}--line-height`, s.lineHeight)
      if (s.fontWeight !== undefined) light.set(`${base}--font-weight`, s.fontWeight)
      if (s.letterSpacing !== undefined) light.set(`${base}--letter-spacing`, s.letterSpacing)
    }
  }
  return { light, dark, raw }
}

/** A page value written for CSS: an alias {palette-primary} becomes var(--palette-primary). */
const asCss = (value) => String(value).replace(/^\{([A-Za-z0-9_.-]+)\}$/, (_, name) => `var(${cssName(name)})`)

// ---- What the code says: the base definitions, and the dark block ------------------------

/** The text before the dark block (the base definitions) and the dark block's span. */
function regions(css) {
  const darkStart = css.indexOf(DARK_OPEN)
  if (darkStart === -1) return { base: [0, css.length], dark: null }
  const darkEnd = css.indexOf('\n}', darkStart)
  return { base: [0, darkStart], dark: [darkStart, darkEnd] }
}

/** The first definition of each custom property inside [from, to). */
function definitions(css, [from, to]) {
  const map = new Map()
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi
  re.lastIndex = from
  let m
  while ((m = re.exec(css)) && m.index < to) {
    if (!map.has(m[1])) map.set(m[1], { value: m[2].trim(), index: m.index, length: m[0].length })
  }
  return map
}

/** A value with every var() and page alias resolved, normalised for comparison. */
function resolver(defs, pageRaw) {
  const resolve = (value, depth = 0) => {
    if (depth > 12 || value === undefined || value === null) return String(value)
    const text = String(value).trim()
    const alias = text.match(/^\{([A-Za-z0-9_.-]+)\}$/)
    if (alias) {
      const target = pageRaw.get(alias[1])
      const v = typeof target === 'object' && target !== null ? target.light : target
      return resolve(v ?? `var(${cssName(alias[1])})`, depth + 1)
    }
    const ref = text.match(/^var\((--[a-z0-9-]+)\)$/i)
    if (ref) return resolve(defs.get(ref[1])?.value, depth + 1)
    return normalise(text)
  }
  return resolve
}

/** One spelling per value, so only real changes count: rgba(23, 23, 23, 0.10) and rgb(23 23 23 / 0.1) match, 0px and 0 match. */
function normalise(text) {
  return text
    .toLowerCase()
    .replace(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[,/]\s*([\d.]+%?))?\s*\)/g, (_, r, g, b, a) =>
      `rgb(${Number(r)} ${Number(g)} ${Number(b)}${a === undefined ? '' : ` / ${a.endsWith('%') ? Number.parseFloat(a) / 100 : Number(a)}`})`)
    .replace(/(^|[^\d.])0(?:px|rem|em)\b/g, '$10')
    .replace(/\d*\.\d+/g, (n) => String(Number(n)))
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** The page's values in one stylesheet: returns the changes, and writes them only when `write`. */
function syncStylesheet(file, page, write, only) {
  if (!existsSync(file)) return []
  let css = readFileSync(file, 'utf8')
  const changes = []
  for (const [mode, values] of [['light', page.light], ['dark', page.dark]]) {
    const span = regions(css)[mode === 'light' ? 'base' : 'dark']
    if (!span) continue
    const defs = definitions(css, span)
    const allBase = definitions(css, regions(css).base)
    const resolveCode = resolver(mode === 'light' ? defs : new Map([...allBase, ...defs]), page.raw)
    const resolvePage = resolver(mode === 'light' ? defs : new Map([...allBase, ...defs]), page.raw)
    // Edit from the end, so earlier indexes stay valid
    const edits = []
    for (const [name, pageValue] of values) {
      if (only && !only.has(`${mode} ${name}`)) continue
      const def = defs.get(name)
      if (!def) continue
      if (resolveCode(def.value) === resolvePage(pageValue)) continue
      const next = asCss(pageValue)
      edits.push({ def, name, next })
      changes.push({ mode, name, from: def.value, to: next })
    }
    for (const { def, name, next } of edits.sort((a, b) => b.def.index - a.def.index)) {
      css = `${css.slice(0, def.index)}${name}: ${next};${css.slice(def.index + def.length)}`
    }
  }
  // Tokens the page added that the code does not have yet: appended to the base block
  const known = definitions(css, regions(css).base)
  const added = [...page.light].filter(([name]) => !known.has(name) && (!only || only.has(`light ${name}`)))
  if (added.length) {
    const lines = added.map(([name, value]) => `  ${name}: ${asCss(value)};`).join('\n')
    const at = regions(css).base[1]
    css = `${css.slice(0, at)}/* Added on IA's Design System page */\n:root {\n${lines}\n}\n${css.slice(at)}`
    for (const [name, value] of added) changes.push({ mode: 'light', name, from: null, to: asCss(value) })
  }
  if (write) writeFileSync(file, css)
  return changes
}

// ---- The page copy, brand files and brand book ---------------------------------------------

function snapshot(copy, index, version) {
  const blobs = readdirSync(join(copy, 'blobs'))
  const fileOf = (id) => blobs.find((f) => f.startsWith(`${id}.`))
  rmSync(SNAPSHOT, { recursive: true, force: true })
  cpSync(join(copy, 'project'), join(SNAPSHOT, 'project'), { recursive: true })
  const assets = []
  for (const group of index.groups ?? []) {
    const g = index.assetGroups?.[group]
    if (!g) continue
    for (const name of g.order ?? []) {
      const record = Object.values(g.files ?? {}).find((f) => f.name === name)
      if (!record) continue
      const saved = fileOf(record.blob)
      if (!saved) throw new Error(`asset ${group}/${name} (${record.blob}) was not read from the page`)
      mkdirSync(join(SNAPSHOT, 'assets', group), { recursive: true })
      cpSync(join(copy, 'blobs', saved), join(SNAPSHOT, 'assets', group, name))
      assets.push({ group, name, type: record.type, size: record.size, blob: record.blob })
    }
  }
  writeJson(join(SNAPSHOT, 'page.json'), { title: index.title, version, snapshotAt: new Date().toISOString(), assets })
  return assets
}

/** Brand files on the page that the skill lacks or holds older copies of; copied when `write`. */
function syncBrandFiles(copy, index, write) {
  const blobs = readdirSync(join(copy, 'blobs'))
  const changes = []
  for (const group of BRAND_GROUPS) {
    const g = index.assetGroups?.[group]
    for (const record of Object.values(g?.files ?? {})) {
      const saved = blobs.find((f) => f.startsWith(`${record.blob}.`))
      if (!saved) continue
      const from = join(copy, 'blobs', saved)
      const to = join(SKILL, 'assets', record.name)
      // The page re-saves files (an SVG's spacing changes), so compare with the copy last synced
      const last = join(SNAPSHOT, 'assets', group, record.name)
      if (existsSync(last) && sha256(last) === sha256(from)) continue
      if (existsSync(to) && sha256(to) === sha256(from)) continue
      changes.push({ file: `assets/${record.name}`, change: existsSync(to) ? 'updated' : 'added' })
      if (!write) continue
      mkdirSync(join(SKILL, 'assets'), { recursive: true })
      cpSync(from, to)
    }
  }
  return changes
}

const POINTER = `
> **The brand book.** \`brand-book.md\` is the README of IA's Design System page in Claude, at this version. Where it and the brief below differ, the brand book is newer: follow it.
`

function syncBrandBook(copy, write) {
  const readme = join(copy, 'project', 'README.md')
  if (!existsSync(readme)) return false
  const target = join(SKILL, 'brand-book.md')
  const last = join(SNAPSHOT, 'project', 'README.md')
  const before = existsSync(target) ? readFileSync(target, 'utf8') : existsSync(last) ? readFileSync(last, 'utf8') : ''
  const after = readFileSync(readme, 'utf8')
  if (!write) return before !== after
  writeFileSync(target, after)
  const skill = join(SKILL, 'SKILL.md')
  const text = readFileSync(skill, 'utf8')
  if (!text.includes('`brand-book.md`')) {
    const marker = '## Set up'
    writeFileSync(skill, text.includes(marker) ? text.replace(marker, `${POINTER}\n${marker}`) : `${text}\n${POINTER}`)
  }
  return before !== after
}

function setVersion(version) {
  const skill = join(SKILL, 'SKILL.md')
  writeFileSync(
    skill,
    readFileSync(skill, 'utf8')
      .replace(/design system v\d+\.\d+\.\d+/g, `design system v${version}`)
      .replace(/\(v\d+\.\d+\.\d+, /, `(v${version}, `),
  )
  const plugin = join(KIT, 'plugin', '.claude-plugin', 'plugin.json')
  writeJson(plugin, { ...readJson(plugin), version })
  const market = join(KIT, '.claude-plugin', 'marketplace.json')
  const m = readJson(market)
  writeJson(market, { ...m, metadata: { ...m.metadata, version }, plugins: m.plugins.map((p) => ({ ...p, version })) })
}

/** Re-seal the skill folder: every file the manifest names, and the files this sync added. */
function reseal(version, extra) {
  const path = join(SKILL, 'manifest.json')
  const manifest = readJson(path)
  const files = { ...manifest.files }
  for (const rel of new Set([...Object.keys(files), ...extra])) {
    const full = join(SKILL, rel)
    if (!existsSync(full)) continue
    files[rel] = { bytes: statSync(full).size, sha256: sha256(full) }
  }
  writeJson(path, { ...manifest, version, files })
}

function changelog(version, changes) {
  const path = join(KIT, 'CHANGELOG.md')
  const head = existsSync(path) ? readFileSync(path, 'utf8') : '# Changelog\n'
  const lines = [
    ...changes.tokens.map((c) => `- \`${c.name}\`${c.mode === 'dark' ? ' (dark)' : ''}: ${c.from ?? 'new'} → ${c.to}`),
    ...changes.files.map((c) => `- ${c.file} ${c.change}`),
    ...(changes.brandBook ? ['- The brand book changed (see brand-book.md)'] : []),
  ]
  const day = new Date().toISOString().slice(0, 10)
  const entry = `\n## ${version} (synced ${day})\n\n${lines.length ? lines.join('\n') : '- No value or file changes.'}\n`
  const [title, ...rest] = head.split('\n')
  writeFileSync(path, [title, entry, ...rest].join('\n').replace(/\n{3,}/g, '\n\n'))
}

/**
 * The token values that differ from the copy of the page taken at the last sync, as
 * "light --name" / "dark --name". The code can hold values the page never had and the
 * other way round (the Machine view label is page-only), so the last copy is the baseline.
 * No copy yet: null, and every value is compared with the code.
 */
function changedSinceLastSync(page) {
  const lastTokens = join(SNAPSHOT, 'project', 'tokens.json')
  if (!existsSync(lastTokens)) return null
  const last = pageValues(readJson(lastTokens))
  const only = new Set()
  for (const mode of ['light', 'dark']) {
    for (const [name, value] of page[mode]) {
      const before = last[mode].get(name)
      if (before === undefined || normalise(String(before)) !== normalise(String(value))) only.add(`${mode} ${name}`)
    }
  }
  return only
}

// ---- Run ------------------------------------------------------------------------------------

function main() {
  const copy = resolve(process.argv[2] ?? '')
  const market = join(KIT, '.claude-plugin', 'marketplace.json')
  if (!existsSync(market) || readJson(market).name !== 'ia-collaborative') {
    return fail('run this from the kit folder (the one with .claude-plugin/marketplace.json).')
  }
  for (const need of ['project/tokens.json', 'project/design-system.json', 'blobs']) {
    if (!existsSync(join(copy, need))) return fail(`${join(copy, need)} is missing: read the page into the copy folder first.`)
  }
  const tokens = readJson(join(copy, 'project', 'tokens.json'))
  const index = readJson(join(copy, 'project', 'design-system.json'))
  const pageVersion = tokens.meta?.version
  const kitVersion = readJson(join(SKILL, 'manifest.json')).version
  if (!pageVersion) return fail('the page has no version (tokens.json meta.version). Ask Claude to record one, then sync.')
  if (newer(kitVersion, pageVersion)) return fail(`the kit (${kitVersion}) is newer than the page (${pageVersion}). Nothing to sync.`)

  const page = pageValues(tokens)
  const only = changedSinceLastSync(page)
  const stylesheets = [join(SKILL, 'root.css'), join(SKILL, 'substrate.css')]
  const plan = (write) => ({
    tokens: stylesheets.flatMap((file) => syncStylesheet(file, page, write, only)),
    files: syncBrandFiles(copy, index, write),
    brandBook: syncBrandBook(copy, write),
  })

  // Plan without writing; refuse before touching anything
  const planned = plan(false)
  const changed = planned.tokens.length || planned.files.length || planned.brandBook
  if (!changed && pageVersion === kitVersion) {
    console.log(JSON.stringify({ version: kitVersion, upToDate: true, next: 'Nothing to sync: the kit already matches the page.' }, null, 2))
    return undefined
  }
  if (changed && pageVersion === kitVersion) {
    return fail(`the page changed but still says version ${pageVersion}. Ask Claude to record a new version on the page, then sync again.`)
  }

  // Apply
  const applied = plan(true)
  snapshot(copy, index, pageVersion)

  // One entry per token (both stylesheets carry the same change)
  const seen = new Set()
  const tokens1 = applied.tokens.filter((c) => {
    const key = `${c.mode}${c.name}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  const fileChanges = applied.files
  const brandBook = applied.brandBook

  setVersion(pageVersion)
  reseal(pageVersion, ['brand-book.md', ...fileChanges.map((c) => c.file)])
  changelog(pageVersion, { tokens: tokens1, files: fileChanges, brandBook })
  console.log(
    JSON.stringify(
      {
        version: { from: kitVersion, to: pageVersion },
        tokens: tokens1.map((c) => `${c.name}${c.mode === 'dark' ? ' (dark)' : ''}: ${c.from ?? 'new'} → ${c.to}`),
        files: fileChanges.map((c) => `${c.file} ${c.change}`),
        brandBook: brandBook ? 'updated' : 'unchanged',
        next: 'Check the changes, then commit, push and tag the new version.',
      },
      null,
      2,
    ),
  )
  return undefined
}

try {
  main()
} catch (error) {
  fail(error.message)
}
