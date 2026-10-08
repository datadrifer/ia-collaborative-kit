/**
 * Gate v2 (SUB-157): rewrite what has an exact token, deny only the rest, and
 * say which tokens are nearest. Ships verbatim in every install's `gate/`.
 *
 *   tokenTable(rootCss, themeCss)        the system's values, by kind
 *   rewriteLiterals(text, ext, table)    every literal that IS a token, replaced
 *   nearestTokens(finding, table)        the 2–3 closest tokens for a deny
 *   kindOf(rule)                         the four violation kinds people know
 *
 * A deny on a value that has an exact token is friction with no benefit; a hard
 * gate that keeps blocking is a gate people turn off. Dependency-free.
 */

/** Lovable's four violation types, which users already know; every rule maps to one. */
export function kindOf(rule) {
  if (/^(?:no-raw-hex|no-arbitrary-color|semantic-only|no-currentcolor-border)$/.test(rule)) return 'raw colour'
  if (/^(?:interactive|local-component)$/.test(rule)) return 'local copy of a component'
  if (rule === 'inline-style') return 'inline style override'
  return 'one-off value'
}

const HEX = /#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/i
const expand3 = (h) => (h.length === 4 ? `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}` : h).toLowerCase()

/**
 * The system's values, read from its own stylesheets: the first (light) value of
 * every token. Colours by hex; lengths in px by family (space, radius, type);
 * which semantic roles have a Tailwind colour utility (`--color-<role>`).
 */
export function tokenTable(rootCss = '', themeCss = '') {
  const first = new Map()
  for (const m of String(rootCss).matchAll(/(--[a-z0-9-]+)\s*:\s*([^;{}]+);/gi)) if (!first.has(m[1])) first.set(m[1], m[2].trim())
  const resolve = (v, depth = 0) => {
    const ref = v.match(/^var\(\s*(--[a-z0-9-]+)\s*\)$/i)
    return ref && depth < 6 && first.has(ref[1]) ? resolve(first.get(ref[1]), depth + 1) : v
  }
  const colors = new Map()
  const space = new Map()
  const radius = new Map()
  const text = new Map()
  const add = (map, key, name) => map.set(key, [...(map.get(key) ?? []), name])
  for (const [name, raw] of first) {
    const v = resolve(raw)
    if (/^#[0-9a-f]{6}$/i.test(v)) add(colors, v.toLowerCase(), name)
    const px = v.match(/^(-?\d*\.?\d+)px$/)?.[1]
    if (px == null) continue
    if (/^--sp-/.test(name) && !/hairline|optical/.test(name)) add(space, Number(px), name)
    else if (/^--(?:r|radius)-/.test(name)) add(radius, Number(px), name)
    else if (/^--text-[a-z0-9]+$/.test(name)) add(text, Number(px), name)
  }
  const utilityColors = new Set([...String(themeCss).matchAll(/--color-([a-z0-9-]+)\s*:/gi)].map((m) => m[1]))
  return { colors, space, radius, text, utilityColors }
}

/** Prefer the role a person would write: semantic before palette before primitive ramps. */
const rank = (name) => (/^--(?:color|palette)-|-\d{2,3}$/.test(name) ? 2 : /^--(?:r|sp)-/.test(name) ? 1 : 0)
/** Among equal roles, the ones a page names first. */
const FIRST = ['--primary', '--foreground', '--background', '--card', '--border', '--secondary', '--accent']
const order = (name) => (FIRST.includes(name) ? FIRST.indexOf(name) : FIRST.length)
const best = (names) => [...names].sort((a, b) => rank(a) - rank(b) || order(a) - order(b) || a.length - b.length || a.localeCompare(b))[0]

const LENGTH_PROPS = /^(?:padding|margin|gap|row-gap|column-gap|font-size|border(?:-(?:top|bottom)-(?:left|right))?-radius)(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?$/
const familyOf = (prop) => (/radius/i.test(prop) ? 'radius' : /font-?size/i.test(prop) ? 'text' : 'space')
const kebab = (p) => p.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

/** A px or rem length → px (1rem = 16px), or null. */
const toPx = (v) => {
  const m = String(v).match(/^(-?\d*\.?\d+)(px|rem)$/)
  return m ? Number(m[1]) * (m[2] === 'rem' ? 16 : 1) : null
}
const lengthToken = (table, family, px) => {
  const map = table[family]
  for (const [k, names] of map) if (Math.abs(k - px) < 0.01) return best(names)
  return null
}

/**
 * Replace every literal that is exactly a token: a hex in a declaration or a
 * style value → `var(--role)`; a `bg-[#hex]`-style class → `bg-role` when the
 * role has a colour utility; a spacing, radius or font-size length in a
 * declaration or style object → `var(--token)`. Comments and anything else are
 * left as they are. Returns the new text and every change, for the log.
 */
export function rewriteLiterals(text, ext, table) {
  const changes = []
  const lines = String(text).split('\n')
  const isCss = ext === 'css' || ext === 'scss'
  /* in code, only inside a style object (style / sx / css props): a bare number elsewhere (a Chart.js padding, a
   * layout constant in arithmetic, a framer-motion tween) must stay a number */
  const styleLines = isCss ? null : styleObjectLines(String(text))
  /* comments are prose: never rewritten */
  const commentLines = commentedLines(String(text))
  const colorToken = (hex) => {
    const names = table.colors.get(expand3(hex))
    return names ? best(names) : null
  }
  const out = lines.map((line, i) => {
    /* a waiver on this line or the one above holds the line as written */
    if (/substrate-allow/.test(line) || /substrate-allow/.test(lines[i - 1] ?? '')) return line
    if (commentLines.has(i)) return line
    let next = line
    /* arbitrary colour classes → the role's utility */
    next = next.replace(/\b(bg|text|border|ring|fill|stroke|outline|decoration|from|via|to)-\[(#[0-9a-f]{3,6})\]/gi, (all, util, hex) => {
      const names = table.colors.get(expand3(hex)) ?? []
      const role = names.map((n) => n.slice(2)).find((r) => table.utilityColors.has(r))
      if (!role) return all
      changes.push({ line: i + 1, from: all, to: `${util}-${role}` })
      return `${util}-${role}`
    })
    /* declarations: `prop: value` in css, `prop: 'value'` / `prop: 12` in style objects only */
    if (!isCss && !styleLines.has(i)) return next
    const decl = isCss ? /(^|[\s{;])([a-z-]+)(\s*:\s*)([^;{}]+)/g : /(^|[\s{,])([a-zA-Z]+)(\s*:\s*)('[^']*'|"[^"]*"|-?\d+(?:\.\d+)?(?![\w.%]))/g
    next = next.replace(decl, (all, lead, rawProp, colon, rawValue) => {
      const prop = isCss ? rawProp : kebab(rawProp)
      const quoted = /^['"]/.test(rawValue)
      let value = quoted ? rawValue.slice(1, -1) : rawValue
      let touched = false
      if (/url\(/i.test(value)) return all
      value = value.replace(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi, (hex) => {
        const t = colorToken(hex)
        if (!t) return hex
        touched = true
        changes.push({ line: i + 1, from: hex, to: `var(${t})` })
        return `var(${t})`
      })
      if (LENGTH_PROPS.test(prop)) {
        const family = familyOf(prop)
        const bareNumber = !isCss && !quoted && /^-?\d/.test(rawValue)
        if (bareNumber) {
          const t = Number(rawValue) !== 0 ? lengthToken(table, family, Number(rawValue)) : null
          if (t) {
            changes.push({ line: i + 1, from: `${rawProp}: ${rawValue}`, to: `${rawProp}: 'var(${t})'` })
            return `${lead}${rawProp}${colon}'var(${t})'`
          }
          return all
        }
        value = value.replace(/(?<![\w(-])-?\d*\.?\d+(?:px|rem)\b/g, (len) => {
          const px = toPx(len)
          if (px == null || px === 0 || Math.abs(px) <= 2) return len
          const t = lengthToken(table, family, px)
          if (!t) return len
          touched = true
          changes.push({ line: i + 1, from: len, to: `var(${t})` })
          return `var(${t})`
        })
      }
      if (!touched) return all
      return `${lead}${rawProp}${colon}${quoted ? `${rawValue[0]}${value}${rawValue[0]}` : value}`
    })
    return next
  })
  return { text: out.join('\n'), changes }
}

/** A colour handed to a chart: `<Line stroke=…>`, `<Bar fill=…>`, `colors={[…]}`, `backgroundColor:` in a dataset. */
const CHART_PROP = /<(?:Line|Bar|Area|Pie|Cell|Scatter|Radar|RadialBar|Funnel|Treemap|Sankey|Legend)\b[^>]*\b(?:stroke|fill)=|\b(?:colors|colorScheme|borderColor|backgroundColor|pointBackgroundColor|itemStyle|lineStyle)\s*[:=]/

/** Line indexes inside a `style={{…}}`, `sx={{…}}` or `css={{…}}` object (brace-balanced, across lines). */
function styleObjectLines(text) {
  const out = new Set()
  for (const m of text.matchAll(/\b(?:style|sx|css)\s*=\s*\{\{/g)) {
    let depth = 0
    let i = m.index + m[0].length - 2
    for (; i < text.length; i++) {
      if (text[i] === '{') depth++
      else if (text[i] === '}' && --depth === 0) break
    }
    const from = text.slice(0, m.index).split('\n').length - 1
    const to = text.slice(0, i).split('\n').length - 1
    for (let l = from; l <= to; l++) out.add(l)
  }
  return out
}

/** Line indexes that are wholly comment (`//`, or inside a block comment). */
function commentedLines(text) {
  const out = new Set()
  const lines = text.split('\n')
  let inBlock = false
  lines.forEach((line, i) => {
    const t = line.trim()
    if (inBlock) {
      out.add(i)
      if (t.includes('*/')) inBlock = false
      return
    }
    if (t.startsWith('//') || (t.startsWith('/*') && t.endsWith('*/')) || t.startsWith('*')) out.add(i)
    else if (t.startsWith('/*')) {
      out.add(i)
      inBlock = !t.includes('*/')
    }
  })
  return out
}

/** OKLab-ish distance between two hexes, good enough to rank neighbours. */
function hexDistance(a, b) {
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
  const [r1, g1, b1] = rgb(a)
  const [r2, g2, b2] = rgb(b)
  return Math.hypot((r1 - r2) * 0.3, (g1 - g2) * 0.59, (b1 - b2) * 0.11)
}

/** The 2–3 tokens nearest a finding's literal, for the deny message. */
export function nearestTokens(finding, table, n = 3) {
  const excerpt = String(finding.excerpt ?? '')
  const hex = excerpt.match(HEX)?.[0]
  /* a colour on a chart prop takes a chart token; deleting it hands the chart its library's default (SUB-187) */
  if (hex && CHART_PROP.test(excerpt)) {
    const charts = [...table.colors.values()].flat().filter((t) => /^--chart-\d$/.test(t)).sort()
    return (charts.length ? charts : ['--chart-1', '--chart-2', '--chart-3']).slice(0, n).map((t) => `var(${t}) (a chart series colour; never delete the colour, the library default is off-brand)`)
  }
  if (hex && /colour|color|hex/i.test(`${finding.rule} ${finding.message}`)) {
    return [...table.colors.entries()]
      .map(([h, names]) => ({ token: best(names), d: hexDistance(expand3(hex), h), value: h }))
      .sort((a, b) => a.d - b.d)
      .slice(0, n)
      .map((t) => `${t.token} (${t.value})`)
  }
  const len = excerpt.match(/(-?\d*\.?\d+)(px|rem)\b/) ?? excerpt.match(/-\[(\d+(?:\.\d+)?)px\]/)
  const px = len ? Number(len[1]) * (len[2] === 'rem' ? 16 : 1) : null
  if (px == null) return []
  const family = /radius|rounded/i.test(excerpt) ? 'radius' : /font-?size|text-\[/i.test(excerpt) ? 'text' : 'space'
  return [...table[family].entries()]
    .map(([k, names]) => ({ token: best(names), d: Math.abs(k - px), value: k }))
    .sort((a, b) => a.d - b.d)
    .slice(0, n)
    .map((t) => `${t.token} (${t.value}px)`)
}
