/**
 * @substrate/validate — THE validator. One implementation, called from three
 * places (CI, pre-commit, and the MCP `validate_snippet` tool) so a rule can
 * never pass in one context and fail in another.
 *
 *   validate(code, filename) → findings[]
 *
 * Escape hatch, for the rare honest exception:
 *   // substrate-allow no-raw-hex — third-party embed needs a literal
 * on the offending line or the line directly above it.
 */

/** @typedef {{rule:string, line:number, column:number, excerpt:string, message:string, why:string}} Finding */

/* Intent colors — a left border tinted with one of these is signalling meaning
 * through a decorative bar, which is the banned pattern. Structural neutrals
 * (border/input/divider/transparent) are how real edges are drawn. */
const INTENT = String.raw`primary|secondary|accent|ring|brand(?:-[a-z]+)?|info|success|warning|destructive|escalate|muted-foreground|chart-\d`

/**
 * The ban is on ACCENT BARS, not on every border that happens to be on the
 * left. A 1px structural edge is how a right-hand Sheet meets the page, how a
 * scrollbar track is inset, how a segmented control divides its cells — all
 * legitimate. What's banned is a bar used as decoration: thick (≥2px) or
 * tinted with an intent color.
 */
const leftRuleFinder = (line) => {
  const hits = []
  // utility classes: border-l-4 / border-s-2 / border-l-primary / border-l-info/30
  const util = new RegExp(
    String.raw`\bborder-(?:l|s)-(?:(\d+)|(${INTENT})(?:\/\d+)?)\b`,
    'g',
  )
  for (const m of line.matchAll(util)) {
    const width = m[1] ? Number(m[1]) : null
    if (width !== null && width < 2) continue // border-l-0 / -1 are not accents
    hits.push({ index: m.index ?? 0, kind: 'class' })
  }
  // raw CSS: border-left: 4px … / border-left-width: 3px / border-inline-start-width: 3px
  const css = /border-(?:left|inline-start)(?:-width)?\s*:\s*([\d.]+)px/g
  for (const m of line.matchAll(css)) {
    if (Number(m[1]) >= 2) hits.push({ index: m.index ?? 0 })
  }
  // positioned-element bars: a full-height, edge-hugging, few-px-wide element
  // (`absolute inset-y-0 left-0 w-1`) is the same banned accent bar built
  // without a border — this exact evasion shipped once (signal-card).
  const bar =
    /\b(?:inset-y-0|h-full)\b(?=.*\b(?:left|right)-0\b)(?=.*\bw-(?:0\.5|1|1\.5|2)\b)|\b(?:left|right)-0\b(?=.*\b(?:inset-y-0|h-full)\b)(?=.*\bw-(?:0\.5|1|1\.5|2)\b)/
  const bm = bar.exec(line)
  if (bm) hits.push({ index: bm.index, kind: 'class' })
  return hits
}

/* Spacing utilities that must resolve through the named scale. Longest-first so
 * `gap-x` beats `gap` and `px` beats `p`. Deliberately excludes w-/h-/size-/
 * inset-/translate-: those are sizes and offsets, not spacing, and they do not
 * participate in density. */
const SPACE_PREFIX =
  String.raw`gap-x|gap-y|gap|space-x|space-y|px|py|pt|pb|pl|pr|ps|pe|p|mx|my|mt|mb|ml|mr|ms|me|m`

/**
 * Numeric spacing (`p-4`) and arbitrary spacing (`p-[13px]`) are both off-token:
 * neither can be re-pointed, so neither responds to data-density. `-0` is exempt
 * — zero is zero at every density.
 */
const numericSpacingFinder = (line) => {
  const hits = []
  const numeric = new RegExp(
    String.raw`(?<![\w-])-?(?:${SPACE_PREFIX})-(\d+(?:\.\d+)?)(?![\w-])`,
    'g',
  )
  for (const m of line.matchAll(numeric)) {
    if (m[1] === '0') continue
    hits.push({ index: m.index ?? 0 })
  }
  const arbitrary = new RegExp(
    String.raw`(?<![\w-])-?(?:${SPACE_PREFIX})-\[[^\]]*\]`,
    'g',
  )
  for (const m of line.matchAll(arbitrary)) hits.push({ index: m.index ?? 0 })
  return hits
}

/* Control box heights that have tokens: 28/32/36/40/48px. Deliberately a
 * closed set rather than "any number" — h-4 and size-3.5 are icon and indicator
 * sizes, which hold at every density and must stay literal. Widths are not
 * checked at all: a numeric w- is layout far more often than it is a control. */
const CONTROL_STEPS = '7|8|9|10|12'

const numericControlFinder = (line) => {
  const hits = []
  const re = new RegExp(
    String.raw`(?<![\w-])(?:min-h|max-h|size|h)-(?:${CONTROL_STEPS})(?![\w-])`,
    'g',
  )
  for (const m of line.matchAll(re)) hits.push({ index: m.index ?? 0 })
  return hits
}

/* The ramp vocabulary. A numeric step after a colour name is the signature of
 * the PRIMITIVE tier — `bg-signal-600` compiles to `--color-signal-600`, one
 * fixed value that no skin re-points. The semantic tier has no steps in it
 * (`bg-surface-sunken`, `text-muted-foreground`), and the one semantic role that
 * does carry a number — `chart-1` … `chart-5` — is outside this set, which is
 * why matching the step vocabulary rather than the family names works. */
const RAMP_STEP = String.raw`0|50|100|200|300|400|500|600|700|800|900|950`

/* Utilities that carry colour. `border` is here bare as well as sided, and both
 * are load-bearing: `border-neutral-300` and `border-t-neutral-300` are the same
 * bypass. */
const COLOR_PROP = String.raw`bg|text|border|border-[trblxyse]|divide|ring|ring-offset|outline|fill|stroke|caret|accent|decoration|placeholder|shadow|from|via|to`

/* Middle segments that are not colour names. Without these, `border-b-0` (a
 * width), `border-spacing-0` (a table property) and `ring-offset-0` read as
 * ramp references. */
const NOT_A_FAMILY = String.raw`spacing|offset|width|current|transparent|inherit|dashed|solid|dotted|double|none|hidden`

/**
 * A reference to the primitive tier from code that should only see the semantic
 * one — the last door the other colour rules leave open.
 *
 * `no-raw-hex` and `no-arbitrary-color` catch colour that never entered the
 * system. This catches colour that entered it and then stopped one tier short:
 * `bg-signal-600` is a real token, resolves, passes every other rule, and is
 * still unskinnable, because tier 1 is where a value is DEFINED and tier 2 is
 * where a role decides which value it wants. A component reaching past the role
 * is a component the ia skin cannot re-point — the same failure as a hex, minus
 * every visible symptom.
 *
 * Also catches the var() form, since `var(--color-signal-600)` in a stylesheet
 * is the identical bypass with the utility layer skipped.
 */
const semanticOnlyFinder = (line) => {
  const hits = []
  const util = new RegExp(
    String.raw`(?<![\w-])(?:${COLOR_PROP})-(?!(?:${NOT_A_FAMILY})(?![a-z]))[a-z]{3,}-(?:${RAMP_STEP})(?:\/\d+)?(?![\w-])`,
    'g',
  )
  for (const m of line.matchAll(util)) hits.push({ index: m.index ?? 0, kind: 'class' })
  const cssVar = new RegExp(String.raw`var\(\s*--color-[a-z]+-(?:${RAMP_STEP})\s*[,)]`, 'g')
  for (const m of line.matchAll(cssVar)) hits.push({ index: m.index ?? 0 })
  return hits
}

const RULES = [
  {
    name: 'no-numeric-control-size',
    classOnly: true,
    find: numericControlFinder,
    appliesTo: ['tsx', 'ts', 'jsx', 'js'],
    message: 'Numeric control height.',
    why: 'Control boxes must come from the control scale (h-control-md, size-control-sm) so data-density can re-point them. A density mode that tightens padding but leaves button height welded to 36px is only half a mode. Icon glyph sizes (size-4) are outside this range on purpose — they hold at every density.',
  },
  {
    name: 'no-numeric-spacing',
    classOnly: true,
    find: numericSpacingFinder,
    appliesTo: ['tsx', 'ts', 'jsx', 'js'],
    message: 'Numeric or arbitrary spacing value.',
    why: 'Spacing must come from the named scale (p-inset-md, gap-stack-sm, py-section) so data-density can re-point it. A numeric utility is welded to one density — it compiles to a multiple of --spacing and cannot compress non-linearly. Sizes (w-, h-, size-) are exempt.',
  },
  {
    name: 'no-left-rule',
    find: leftRuleFinder,
    appliesTo: ['tsx', 'ts', 'jsx', 'js', 'css'],
    message: 'Left-rule / side-bar accent is banned system-wide.',
    why: 'Accent bars down one edge are a stock "callout" cliché and read as unconsidered. Carry intent with a tinted ground, a uniform border, and a colored icon instead. (A plain 1px structural border-l is fine — this fires on ≥2px or intent-colored bars.)',
  },
  {
    name: 'no-currentcolor-border',
    classOnly: true,
    // `border-[color]` / `border-t-[color]` supply their own color; a bare
    // `border` or `border-b` inherits whatever the base layer sets.
    pattern: /\bborder-(?:current|\[currentColor\])\b/g,
    appliesTo: ['tsx', 'ts', 'jsx', 'js'],
    message: 'Border painted in currentColor.',
    why: 'Border color must resolve through the semantic tier. The base layer already defaults every border to --border; opting back into currentColor reintroduces the near-black hairline bug and is invisible to skinning.',
  },
  {
    name: 'no-raw-hex',
    pattern: /#[0-9a-fA-F]{3,8}\b/g,
    appliesTo: ['tsx', 'ts', 'jsx', 'js', 'css'],
    message: 'Raw hex color outside the token source.',
    why: 'Color must come from the semantic tier so a skin can re-point it. A literal hex is invisible to theming and to the contrast checks.',
    // hex inside an inline SVG data URI is an asset, not styling
    skipLine: (line) => line.includes('data:image/') || line.includes('svg+xml'),
  },
  {
    name: 'no-arbitrary-color',
    classOnly: true,
    pattern: /-\[(?:#[0-9a-fA-F]{3,8}|(?:rgb|rgba|hsl|hsla|oklch|lab|color)\()/g,
    appliesTo: ['tsx', 'ts', 'jsx', 'js'],
    message: 'Arbitrary Tailwind color value.',
    why: 'Off-token styling silently breaks skinning — the same rule that makes the system themeable. Use a semantic utility.',
  },
  {
    name: 'semantic-only',
    find: semanticOnlyFinder,
    appliesTo: ['tsx', 'ts', 'jsx', 'js', 'css'],
    message: 'Primitive ramp step referenced directly.',
    why: 'Colour must be reached through the semantic tier (bg-card, text-muted-foreground, border-input), not through the ramp it happens to resolve to today. `bg-signal-600` is tier 1 — one fixed value, identical under every skin — so a component using it is a component ia cannot re-theme and the contrast contract cannot see, since the contract is declared over roles. The ramps exist to be pointed AT by roles, not used from components. If no role says what you mean, the missing thing is a role.',
  },
  {
    name: 'no-mono',
    // `font-mono`, a monospace family-name, or a raw monospace CSS declaration.
    // The utility no longer exists (the theme key is deleted), which makes a
    // stray `font-mono` a silent no-op rather than a visible error — precisely
    // the failure a linter is for.
    // `Geist Mono` leads the family list on purpose: now that the sans is
    // Geist, its monospaced sibling is the single most tempting thing to reach
    // for, and it is exactly as banned as the rest.
    pattern:
      /\bfont-mono\b|font-family:[^;]*\bmonospace\b|['"](?:Geist Mono|Roboto Mono|SF Mono|ui-monospace|JetBrains Mono|IBM Plex Mono|Menlo|Consolas)['"]/g,
    appliesTo: ['tsx', 'ts', 'jsx', 'js', 'css'],
    message: 'Monospace family or font-mono utility.',
    why: 'There is no mono in this system — one family, worked hard. `--font-mono` is deleted from the theme, so `font-mono` is not a utility and fails silently to the OS monospace instead of erroring. Geist Mono is a sibling of the sans and is banned like any other. Mark code and literals with a muted ground alone; rank everything else with size, weight, tracking, and ink. (`tabular-nums` is not the answer here either — it is for digits that form a column or change in place, not for styling numbers.)',
  },
]

/* ── class positions (SUB-177) ─────────────────────────────────────────────────
 * A class rule reads strings in CLASS positions only: `className=` / `class=`
 * (and `*ClassName:` / `*Classes =` keys), the arguments of cn / cx / clsx /
 * classnames / cva / tv / twMerge / twJoin (across lines, into nested objects),
 * `tw` templates, and any string that is itself a run of utilities. `{ id: "m-1" }`
 * in a data file is data. Comments are not code. A scanner, not a parser: a
 * quote that does not close on its own line (an apostrophe in JSX text) is not
 * a string. */
const CLASS_FN = /(?:^|[^\w$])(?:[\w$]+\.)*(?:cn|cx|clsx|classnames|classNames|cva|tv|twMerge|twJoin|classList\.(?:add|toggle|replace))\s*(?:<[^<>()]*>)?\s*$/
const CLASS_KEY = /(?:^|[^\w$-])(?:class|className|[A-Za-z]+ClassName|[A-Za-z]+Class|[A-Za-z]*[cC]lasses|class:list)\s*[:=]\s*$/
/** One utility with an arbitrary value (`p-[13px]`): no data string looks like that. */
const ARBITRARY = /^!?-?(?:[a-z0-9@*-]+:)*[a-z][\w-]*-\[[^\]\s]+\](?:\/\d+)?$/
/** Markup inside a string (`'<div class="p-4">'`) is read whole. */
const MARKUP_IN_STRING = /\bclass(?:Name)?\s*=/
const UTILITY = /^!?-?(?:[a-z0-9@*-]+:)*!?-?[a-z@[][^\s]*$/
/** A string that is a run of utilities: two or more tokens, two with a dash or a variant, none prose-shaped. */
function looksLikeClasses(text) {
  const tokens = text.trim().split(/\s+/).filter(Boolean)
  if (tokens.length < 2) return false
  if (tokens.filter((t) => /[-:]/.test(t)).length < 2) return false
  return tokens.every((t) => UTILITY.test(t) && !/[.,;!?]$/.test(t) && !/[A-Z]/.test(t.replace(/\[[^\]]*\]/g, '')))
}

/**
 * The [start, end) offsets of every string or template literal in a class
 * position, for the js family and markup read as JSX — or `null` when the scan
 * cannot be trusted (an unclosed comment or template, a stray backtick, brackets
 * left open), and the caller checks every line as before. Fail safe: a scanner
 * that loses its place must never hide the rest of a file from the gate.
 * @param {string} code
 * @returns {[number, number][] | null}
 */
export function classRanges(code) {
  /* a backtick in a regex literal (or a lone one anywhere) throws template parity for the whole file */
  if ((code.match(/`/g) ?? []).length % 2) return null
  const ranges = []
  const stack = []
  const n = code.length
  let i = 0
  while (i < n) {
    const ch = code[i]
    if (ch === '/' && code[i + 1] === '/' && (i === 0 || /[\s;{}(),=:\[]/.test(code[i - 1]))) {
      const e = code.indexOf('\n', i)
      i = e < 0 ? n : e
      continue
    }
    /* a comment opens after code punctuation or a space; `/api/*` in JSX text is not one */
    if (ch === '/' && code[i + 1] === '*' && (i === 0 || /[\s;{}(),=:\[]/.test(code[i - 1]))) {
      const e = code.indexOf('*/', i + 2)
      if (e < 0) return null
      i = e + 2
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      let j = i + 1
      while (j < n && code[j] !== ch && !(ch !== '`' && code[j] === '\n')) j += code[j] === '\\' ? 2 : 1
      if (j >= n || code[j] !== ch) {
        if (ch === '`') return null
        i++
        continue
      }
      const before = code.slice(Math.max(0, i - 64), i)
      const text = code.slice(i + 1, j)
      if (stack.some((f) => f.cls) || CLASS_KEY.test(before) || (ch === '`' && /(?:^|[^\w$])tw\s*$/.test(before)) || looksLikeClasses(text) || ARBITRARY.test(text.trim()) || MARKUP_IN_STRING.test(text)) ranges.push([i + 1, j])
      i = j + 1
      continue
    }
    if (ch === '(' || ch === '{' || ch === '[') {
      const before = code.slice(Math.max(0, i - 64), i)
      stack.push({ cls: (ch === '(' && CLASS_FN.test(before)) || (ch === '{' && CLASS_KEY.test(before)) })
    } else if (ch === ')' || ch === '}' || ch === ']') stack.pop()
    i++
  }
  /* a class frame left open would swallow everything after it */
  if (stack.some((f) => f.cls)) return null
  return ranges
}

/** A lookup: is this absolute offset inside a class position? */
export function inClassRanges(ranges) {
  return (at) => {
    let lo = 0
    let hi = ranges.length - 1
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      const [a, b] = ranges[mid]
      if (at < a) hi = mid - 1
      else if (at >= b) lo = mid + 1
      else return true
    }
    return false
  }
}

/** Offsets of each line's first character, so a per-line hit maps to an offset in the file. */
export function lineStarts(code) {
  const starts = [0]
  for (let i = 0; i < code.length; i++) if (code[i] === '\n') starts.push(i + 1)
  return starts
}

const JS_FAMILY = new Set(['tsx', 'ts', 'jsx', 'js'])

const ALLOW = /substrate-allow\s+([a-z-]+)/g
/** A one-off with its reason: `substrate-allow: Stripe's own brand colour on the partner logo`. Three words at least, on its own line. */
export function waived(text) {
  for (const m of String(text).matchAll(/substrate-allow:[ \t]*([^\n*]*?)[ \t]*(?:\*\/|-->|$)/gm)) if (m[1].trim().split(/\s+/).filter(Boolean).length >= 3) return true
  return false
}

function allowedRules(text) {
  const out = new Set()
  for (const m of text.matchAll(ALLOW)) if (m[1]) out.add(m[1])
  /* SUB-157: `substrate-allow: <reason>` waives every rule on the line, and the gate logs the reason */
  if (waived(text)) out.add('*')
  return out
}

/**
 * @param {string} code
 * @param {string} [filename]
 * @returns {Finding[]}
 */
export function validate(code, filename = 'snippet.tsx', opts = {}) {
  const ext = filename.split('.').pop()?.toLowerCase() ?? 'tsx'
  const lines = code.split('\n')
  /** @type {Finding[]} */
  const findings = []
  /* SUB-177: in the js family a class rule counts only inside a class position (unless the scan lost its place) */
  const ranges = JS_FAMILY.has(ext) && opts.scoped !== false ? classRanges(code) : null
  const scoped = ranges !== null
  const inClass = scoped ? inClassRanges(ranges) : () => true
  const starts = scoped ? lineStarts(code) : []

  for (const rule of RULES) {
    if (!rule.appliesTo.includes(ext)) continue
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? ''
      if (rule.skipLine?.(line)) continue
      // allow-comment on this line or the one above
      const scope = `${lines[i - 1] ?? ''}\n${line}`
      const allow = allowedRules(scope)
      if (allow.has(rule.name) || allow.has('*')) continue

      // A rule supplies either a `find(line) → [{index}]` matcher (when the
      // decision needs logic, e.g. comparing a border width) or a plain regex.
      /** @type {{index:number}[]} */
      let hits = []
      if (rule.find) {
        hits = rule.find(line)
      } else {
        rule.pattern.lastIndex = 0
        let m
        while ((m = rule.pattern.exec(line)) !== null) {
          hits.push({ index: m.index })
          if (m.index === rule.pattern.lastIndex) rule.pattern.lastIndex++
        }
      }
      for (const h of hits) {
        if (scoped && (rule.classOnly || h.kind === 'class') && !inClass(starts[i] + h.index)) continue
        findings.push({
          rule: rule.name,
          line: i + 1,
          column: h.index + 1,
          excerpt: line.trim().slice(0, 100),
          message: rule.message,
          why: rule.why,
        })
      }
    }
  }

  return findings.sort((a, b) => a.line - b.line || a.column - b.column)
}

export const ruleNames = RULES.map((r) => r.name)
