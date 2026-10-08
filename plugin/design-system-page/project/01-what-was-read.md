# What was read

Substrate read IA's brand from iacollaborative.com on 7 October 2026: the home page, About, an insights article and the contact form in a local Chrome (the cookie banner was declined), plus six more inner pages in the browser to check the type ladder. No brand files were supplied, so every value comes from IA's own site. Values the reader took from a client's case study or a page widget were corrected from IA's own pages; the column *As first read* shows the reader's value where it changed.

Sources: **read off the page** (the colour or size the browser painted), **IA's own CSS token** (a custom property in the site's stylesheet), **set from IA's own sources** (corrected or added from IA's pages and tokens during the reading), **the reader's call**, **by rule** (not given by the site; derived from IA's tokens by the engine).

## Colour (light)

| Role | Value | Source | Confidence | Where | As first read |
|---|---|---|---|---|---|
| `background` | `#ffffff` | read off the page | 100% | body background-color |  |
| `foreground` | `#000000` | read off the page | 100% | body color (div.container.flex > div.flex.flex-row > h1.text-2xl.md:text-4xl is set in it) |  |
| `primary` | `#176cd9` | set from IA's own sources | 100% | --color-primary: #176cd9 (IA's own theme token); painted on the contact form's submit (bg-primary), the 'Let's talk' panel, every link and the asteris… | `#0a0a0a` |
| `brand-base` | `#176cd9` | set from IA's own sources | 100% | --color-primary: #176cd9 (IA's own theme token) | `#0a0a0a` |
| `ring` | `#176cd9` | set from IA's own sources | 100% | contact form inputs focus:border-primary (IA's own focus colour) | `#a1a1a1` |
| `secondary` | `#ffffff` | read off the page | 90% | div.w-full > div.mx-auto.max-w-[1400px] > button.w-9.h-9 background-color |  |
| `secondary-foreground` | `#000000` | read off the page | 100% | div.w-full > div.mx-auto.max-w-[1400px] > button.w-9.h-9 color |  |
| `text-secondary` | `#525252` | set from IA's own sources | 100% | IA's long-form secondary text: the About page paragraphs, text-neutral-600 (#525252). The home card descriptions' gray-500 #6a7282 reads 4.39:1 on IA'… | `#6a7282` |
| `heading` | `#000000` | read off the page | 100% | div.relative.flex > div.w-full.flex > h2.text-base.md:text-lg color |  |
| `display` | `#000000` | read off the page | 100% | div.container.flex > div.flex.flex-row > h1.text-2xl.md:text-4xl color |  |
| `interactive` | `#176cd9` | set from IA's own sources | 100% | links: a.text-primary (We Deliver list, See More Results, Read Insights) | `#0a0a0a` |
| `card` | `#f3f4f6` | set from IA's own sources | 100% | the 'IA means Insight to Action' panel: bg-gray-100 rounded-xl border-gray-200 (home) | `#4d86f9` |
| `card-foreground` | `#000000` | read off the page | 100% | div.container > div.grid.grid-cols-2 > div.flex.flex-col color |  |
| `brand-strong` | `#176cd9` | set from IA's own sources | 100% | the 'Want to create the future of human experience? Let's talk.' panel: a.bg-primary rounded-xl (home) | `#000000` |
| `border` | `#e5e7eb` | read off the page | 90% | div.w-full > div.grid.grid-cols-1 > div.min-h-[360px].md:min-h-[420px] border-top-color |  |
| `primary-hover` | `#1977ef` | set from IA's own sources | 100% | the contact form submit's hover, brightness(1.1) on #176cd9 | — |
| `inverse-surface` | `#000000` | set from IA's own sources | 100% | the Machine view (section bg-black) and the monogram circle | — |
| `inverse-foreground` | `#ffffff` | set from IA's own sources | 100% | white type on the Machine view and over photography | — |
| `input` | `#d7d7d7` | set from IA's own sources | 100% | contact form fields: border-light-gray (--color-light-gray #d7d7d7) | — |
| `eyebrow` | `#aeaeae` | set from IA's own sources | 100% | contact form labels: text-dark-gray (--color-dark-gray #aeaeae), 12px uppercase | — |
| `chart-1` | `#176cd9` | set from IA's own sources | 100% | charts, derived: IA blue (IA has no chart colours of its own) | — |
| `chart-2` | `#000000` | set from IA's own sources | 100% | charts, derived: IA ink | — |
| `chart-3` | `#6a7282` | set from IA's own sources | 100% | charts, derived: IA gray-500 | — |
| `chart-4` | `#144e9c` | set from IA's own sources | 100% | charts, derived: the deep step of IA blue's ramp | — |
| `primary-foreground` | `#ffffff` | set from IA's own sources | 100% | white on the blue submit and the Let's talk panel | `#0a0a0a` |
| `brand-contrast` | `#ffffff` | set from IA's own sources | 100% | white on the Let's talk panel | `#000000` |
| `destructive` | `#e7000b` | set from IA's own sources | 100% | the site's --destructive token and the contact form's error text (text-red-600) | `#ffe2e2` |

Dark: IA's site is light only. The dark theme is derived by rule from these values (see Decisions).

## Palette

The colours IA paints, under their site names (`--palette-<name>`).

| Name | Value | Source | Where |
|---|---|---|---|
| `neutral-900` | `#171717` | IA's own CSS token | --color-neutral-900: lab(7.78201% -.0000149012 0) |
| `zinc-800` | `#27272a` | IA's own CSS token | --color-zinc-800: lab(15.7305% .613764 -2.16959) |
| `neutral-600` | `#525252` | IA's own CSS token | --color-neutral-600: lab(34.924% 0 0) |
| `gray-100` | `#f3f4f6` | IA's own CSS token | --color-gray-100: lab(96.1596% -.0823438 -1.13575) |
| `gray-200` | `#e5e7eb` | IA's own CSS token | --color-gray-200: lab(91.6229% -.159115 -2.26791) |
| `neutral-400` | `#a1a1a1` | IA's own CSS token | --color-neutral-400: lab(66.128% -.0000298023 .0000119209) |
| `primary` | `#176cd9` | IA's own CSS token | --color-primary: #176cd9 |
| `gray-500` | `#6a7282` | IA's own CSS token | --color-gray-500: lab(47.7841% -.393182 -10.0268) |
| `neutral-700` | `#404040` | IA's own CSS token | --color-neutral-700: lab(27.036% 0 0) |
| `black` | `#000000` | IA's own CSS token | --color-black: #000 |
| `white` | `#ffffff` | IA's own CSS token | --color-white: #fff |
| `light-gray` | `#d7d7d7` | IA's own CSS token | --color-light-gray: #d7d7d7 |
| `dark-gray` | `#aeaeae` | IA's own CSS token | --color-dark-gray: #aeaeae |

## Type

Face: **Benton Sans** (licensed; IA's site loads it as `bentonSans`), free stand-in **Libre Franklin** (letter shapes 86% alike, matched live on IA's own woff2). Mono: **JetBrains Mono** (free; IA's Machine view).

| Role | Size | Line height | Tracking | Weight | Source | Where | As first read |
|---|---|---|---|---|---|---|---|
| `display-1` | 60px | 1 | -0.015em | 700 | set from IA's own sources | hero titles over photography: About, Careers, Contact (60px bold, -1.8px) | 36px / 500 |
| `heading-2` | 36px | 1.11 | -0.02em | 500 | set from IA's own sources | section headings: home ('Every challenge…', 'IA means Insight to Action'), Insights (36px medium) | 18px / 100 |
| `heading-3` | 30px | 1.25 | -0.015em | 700 | set from IA's own sources | sub-sections: the article h2, Results, Careers, Services (30px bold) | 24px / 700 |
| `body` | 16px | 1.5 | 0 | 400 | read off the page | a.flex-shrink-0.max-w-[80vw] > div.mt-3.px-1 > p.text-md.text-gray-500 |  |
| `small` | 14px | 1.43 | 0 | 400 | read off the page | footer and card meta: text-sm 14px/20px |  |
| `button` | 16px | 1.5 | 0 | 500 | set from IA's own sources | contact form submit: rounded-full px-8 py-3 text-base font-medium bg-primary text-white | 16px / 400 |
| `input` | 16px | 1.56 | 0 | 400 | set from IA's own sources | div.min-h-[360px].md:min-h-[420px] > div.relative.mt-6 > input.mx-3.h-10 | 18px / 400 |
| `heading-1` | 48px | 1.15 | -0.01em | 700 | set from IA's own sources | page titles on white: Insights, Results, every article, Get in touch (48px, 600 painted as 700) | — |
| `lead` | 20px | 1.625 | 0 | 400 | set from IA's own sources | About page paragraphs (text-lg md:text-xl, 20px/32.5px) | — |
| `eyebrow` | 12px | 1.33 | 0.05em | 500 | set from IA's own sources | contact form labels (text-xs font-medium uppercase tracking-wider) | — |

## Shape, controls and space

| Value | Read | Source | Confidence | Where | As first read |
|---|---|---|---|---|---|
| radius.`controls` | 8px | set from IA's own sources | 100% | the site's shadcn controls: rounded-md (8px) on the mode tabs and the 'See More Results' button; the site's own --radius: .625rem ladder (6/8/10/14). … |  |
| radius.`inputs` | 10px | set from IA's own sources | 100% | contact form inputs and textarea: rounded-lg (10px; the site's --radius: .625rem) | 0px |
| radius.`containers` | 14px | read off the page | 100% | div.w-full > div.grid.grid-cols-1 > div.min-h-[360px].md:min-h-[420px] border-radius |  |
| controls.`button-height` | 48px | set from IA's own sources | 100% | contact form submit (py-3, 48px) and the article 'Let's talk' button (px-6 py-3, 48px) | 29px |
| controls.`button-pad-x` | 32px | set from IA's own sources | 100% | contact form submit px-8 | 8px |
| controls.`input-height` | 48px | set from IA's own sources | 100% | contact form inputs (py-3 + 16px text = 48px inside a 1px border) and the chat pill input (md:h-12) |  |
| spacing.`gutter` | 32px | read off the page | 100% | main.flex-1 > div.block > div.container padding-left |  |
| spacing.`card-pad` | 24px | read off the page | 100% | div.w-full > div.grid.grid-cols-1 > div.min-h-[360px].md:min-h-[420px] padding |  |
| spacing.`page-max` | 1400px | read off the page | 100% | main.flex-1 > div.block > div.container max-width |  |
| spacing.`band` | 100px | set from IA's own sources | 100% | the h-[10vh] spacers between home sections (100px at a 1000px window) | — |
| spacing.`grid` | 24px | set from IA's own sources | 100% | card grids: gap-4 md:gap-6 | — |
| spacing.`stack` | 40px | set from IA's own sources | 100% | heading row to content: gap-10 | — |
| lines.`focus` | 1px #a1a1a1 | read off the page | 100% | div.w-full > div.mx-auto.max-w-[1400px] > button.w-9.h-9:focus-visible outline | |
| lines.`card-border` | 1px  | read off the page | 100% | div.w-full > div.grid.grid-cols-1 > div.min-h-[360px].md:min-h-[420px] border-width | |
| lines.`outline-ring` | 1px #d1d5dc | read off the page | 100% | div.w-full > div.mx-auto.max-w-[1400px] > button.w-9.h-9 border | |
| elevation | shadows present | read off the page | 90% | div.relative.py-5 > div.absolute.inset-y-0 > button.inline-flex.items-center, div.group/tabs.flex > div.rounded-lg.p-[3px] > button#radix-_R_atb_-trig… | |

The focus outline and the circle-button edge were read as 1px lines in two greys. The system keeps every line at one 1px hairline and gives the colour to a role: focus is IA blue (`ring`, from the contact form's own focus colour) and control edges are `input` (#d7d7d7).

Everything the site does not give (the colour ramps, the dark theme, the spacing between the read steps, control heights below 48px, the shadow ladder) is derived by rule from these values, never taken from a library default. The lock counts which tokens are exact and which are by rule (Lock and versions).

