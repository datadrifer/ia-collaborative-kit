---
version: "alpha"
name: "IA Collaborative"
description: "White pages, black type, one blue. IA speaks in plain first-person statements, marks the one that matters with an asterisk, shows real fieldwork photography, and asks one question per page in a single blue panel. Everything else is grey, flat and quiet."
colors:
  background: "{colors.palette-white}"
  foreground: "{colors.palette-black}"
  canvas: "#f9f9f9"
  surface: "#ffffff"
  surface-raised: "#ffffff"
  surface-overlay: "#ffffff"
  surface-sunken: "#f2f2f2"
  card: "{colors.palette-gray-100}"
  card-foreground: "{colors.palette-black}"
  popover: "#ffffff"
  popover-foreground: "#1f1f1f"
  primary: "{colors.palette-primary}"
  primary-foreground: "{colors.palette-white}"
  secondary: "{colors.palette-white}"
  secondary-foreground: "{colors.palette-black}"
  muted: "#f2f2f2"
  muted-foreground: "#515151"
  accent: "#f2f2f2"
  accent-foreground: "#1f1f1f"
  brand-muted: "#ebf2fe"
  brand-base: "{colors.palette-primary}"
  brand-strong: "{colors.palette-primary}"
  brand-emphasis: "#144e9c"
  brand-contrast: "{colors.palette-white}"
  interactive: "{colors.palette-primary}"
  interactive-foreground: "#ffffff"
  interactive-muted: "#ebf2fe"
  ring: "{colors.palette-primary}"
  destructive: "#e7000b"
  destructive-foreground: "{colors.palette-white}"
  destructive-muted: "#ffedea"
  destructive-solid: "#ba392f"
  destructive-solid-foreground: "#ffffff"
  success: "#1c603b"
  success-foreground: "#ffffff"
  success-muted: "#defae7"
  success-solid: "#288051"
  success-solid-foreground: "#ffffff"
  warning: "#724608"
  warning-foreground: "#ffffff"
  warning-muted: "#ffefdf"
  warning-solid: "#975f0e"
  warning-solid-foreground: "#ffffff"
  info: "#144e9c"
  info-foreground: "#ffffff"
  info-muted: "#ebf2fe"
  info-solid: "#2169cc"
  info-solid-foreground: "#ffffff"
  border: "{colors.palette-gray-200}"
  input: "{colors.palette-light-gray}"
  divider: "#e3e3e3"
  text-secondary: "{colors.palette-neutral-600}"
  text-tertiary: "#6d6d6d"
  prompt-bar: "#1f1f1f"
  prompt-bar-foreground: "#ffffff"
  prompt-bar-line: "#515151"
  chart-1: "{colors.palette-primary}"
  chart-2: "{colors.palette-black}"
  chart-3: "{colors.palette-gray-500}"
  chart-4: "#144e9c"
  chart-5: "#8a8a8a"
  sidebar: "#ffffff"
  sidebar-foreground: "#1f1f1f"
  sidebar-primary: "#2169cc"
  sidebar-primary-foreground: "#ffffff"
  sidebar-accent: "#f2f2f2"
  sidebar-accent-foreground: "#1f1f1f"
  sidebar-border: "#e3e3e3"
  sidebar-ring: "#144e9c"
  ink-heading: "{colors.palette-black}"
  ink-display: "{colors.palette-black}"
  primary-hover: "#1977ef"
  inverse-surface: "{colors.palette-black}"
  inverse-foreground: "{colors.palette-white}"
  ink-eyebrow: "{colors.palette-dark-gray}"
  palette-neutral-900: "#171717"
  palette-zinc-800: "#27272a"
  palette-neutral-600: "#525252"
  palette-gray-100: "#f3f4f6"
  palette-gray-200: "#e5e7eb"
  palette-neutral-400: "#a1a1a1"
  palette-primary: "#176cd9"
  palette-gray-500: "#6a7282"
  palette-neutral-700: "#404040"
  palette-black: "#000000"
  palette-white: "#ffffff"
  palette-light-gray: "#d7d7d7"
  palette-dark-gray: "#aeaeae"
typography:
  display:
    fontFamily: "Benton Sans"
    fontSize: "60px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.015em"
  h1:
    fontFamily: "Benton Sans"
    fontSize: "48px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  h2:
    fontFamily: "Benton Sans"
    fontSize: "36px"
    fontWeight: 500
    lineHeight: 1.11
    letterSpacing: "-0.02em"
  h3:
    fontFamily: "Benton Sans"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  lead:
    fontFamily: "Benton Sans"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "0em"
  body:
    fontFamily: "Benton Sans"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  small:
    fontFamily: "Benton Sans"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: "0em"
  caption:
    fontFamily: "Benton Sans"
    fontSize: "12.22px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0.0164em"
  micro:
    fontFamily: "Benton Sans"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: "0.05em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  2xl: "18px"
  controls: "8px"
  containers: "14px"
  inline: "6px"
  chip: "9999px"
  track: "9999px"
spacing:
  hairline: "2px"
  optical: "4px"
  inset-2xs: "6px"
  inset-xs: "8px"
  inset-sm: "10px"
  inset-md: "12px"
  inset-lg: "24px"
  inset-xl: "27px"
  stack-xs: "20px"
  stack-sm: "24px"
  stack-md: "24px"
  stack-lg: "40px"
  region: "48px"
  section: "100px"
  section-lg: "100px"
  chapter: "120px"
  chapter-lg: "128px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.controls}"
    padding: "12px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.controls}"
    height: "48px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.containers}"
    padding: "24px"
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
x-substrate:
  about: "Substrate keeps what DESIGN.md has no place for here. Tools that do not know this key ignore it."
  version: "1.0.0"
  lock: "sha256:bd2a44dc5c41157f38ee722835326830e60efda8240e37b79c4545d0786bfa59"
  faces:
    sans: "Benton Sans"
    display: "Benton Sans"
    rule: "display, h1, h2 and h3 take the display face (the engine's :where(h1, h2, h3) rule); every other step takes the sans"
  dark:
    colors:
      background: "#0a0a0a"
      foreground: "#f9f9f9"
      canvas: "#0a0a0a"
      surface: "#1f1f1f"
      surface-raised: "#373737"
      surface-overlay: "#373737"
      surface-sunken: "#0a0a0a"
      card: "#1f1f1f"
      card-foreground: "#f9f9f9"
      popover: "#1f1f1f"
      popover-foreground: "#f9f9f9"
      primary: "#2169cc"
      primary-foreground: "#ffffff"
      secondary: "#373737"
      secondary-foreground: "#f9f9f9"
      muted: "#373737"
      muted-foreground: "#ababab"
      accent: "#373737"
      accent-foreground: "#f9f9f9"
      brand-muted: "#031e44"
      brand-base: "#2169cc"
      brand-strong: "#2169cc"
      brand-emphasis: "#144e9c"
      brand-contrast: "#ffffff"
      interactive: "#78adf9"
      interactive-foreground: "#0a0a0a"
      interactive-muted: "#031e44"
      ring: "#78adf9"
      destructive: "#fb8374"
      destructive-foreground: "#0a0a0a"
      destructive-muted: "#3d0a07"
      destructive-solid: "#e45144"
      destructive-solid-foreground: "#0a0a0a"
      success: "#48c782"
      success-foreground: "#0a0a0a"
      success-muted: "#062615"
      success-solid: "#48c782"
      success-solid-foreground: "#0a0a0a"
      warning: "#bd7814"
      warning-foreground: "#0a0a0a"
      warning-muted: "#2f1a01"
      warning-solid: "#bd7814"
      warning-solid-foreground: "#0a0a0a"
      info: "#78adf9"
      info-foreground: "#0a0a0a"
      info-muted: "#031e44"
      info-solid: "#78adf9"
      info-solid-foreground: "#0a0a0a"
      border: "#373737"
      input: "#515151"
      divider: "#373737"
      text-secondary: "#cecece"
      text-tertiary: "#ababab"
      prompt-bar: "#f9f9f9"
      prompt-bar-foreground: "#1f1f1f"
      prompt-bar-line: "#cecece"
      chart-1: "#78adf9"
      chart-2: "#f9f9f9"
      chart-3: "#ababab"
      chart-4: "#2169cc"
      chart-5: "#8a8a8a"
      sidebar: "#1f1f1f"
      sidebar-foreground: "#f9f9f9"
      sidebar-primary: "#2169cc"
      sidebar-primary-foreground: "#ffffff"
      sidebar-accent: "#373737"
      sidebar-accent-foreground: "#f9f9f9"
      sidebar-border: "#373737"
      sidebar-ring: "#78adf9"
      ink-heading: "#f9f9f9"
      ink-display: "#f9f9f9"
      primary-hover: "#2474e0"
      inverse-surface: "#f9f9f9"
      inverse-foreground: "#0a0a0a"
      ink-eyebrow: "{colors.palette-dark-gray}"
  controls:
    2xs: "24px"
    xs: "28px"
    sm: "32px"
    md: "48px"
    lg: "48px"
    xl: "48px"
  motion:
    duration-tw-animation-delay: "0ms"
    ease-out: "cubic-bezier(0, 0, 0.2, 1)"
    default-transition-timing-function: "cubic-bezier(0.4, 0, 0.2, 1)"
  shadows:
    - "shadow/xs"
    - "shadow/sm"
    - "shadow/md"
    - "shadow/lg"
    - "shadow/xl"
  skipped:
    - "Sizes/measure/xs: a ch measure: it depends on the face, Figma has no unit for it"
    - "Sizes/measure/sm: a ch measure: it depends on the face, Figma has no unit for it"
    - "Sizes/measure/md: a ch measure: it depends on the face, Figma has no unit for it"
    - "Sizes/measure/lg: a ch measure: it depends on the face, Figma has no unit for it"
---

## Overview

White pages, black type, one blue. IA speaks in plain first-person statements, marks the one that matters with an asterisk, shows real fieldwork photography, and asks one question per page in a single blue panel. Everything else is grey, flat and quiet. It is plain, confident, consultative, disciplined, human. It is not decorative, techy, playful, gradient-heavy, corporate-generic.

## Colors

- One hue. IA blue --primary is the only colour on a page; everything else is black, white and grey (--card, --border, --input, --text-secondary, --palette-gray-500, --ink-eyebrow). There is no second accent, no tinted section, no blue wash.
- Blue goes on: every text link (--interactive, chevron after it), the asterisk, the hairline over a we statement, the one Let's talk panel per page (--brand-strong), the selected service row, the contact form's pill, the focus ring (--ring). Count them: a page has a handful of blue moments, not a blue theme.
- Blue never goes on headings or display text (the framework table's element names are IA's one exception), behind a section, on the nav, on borders or dividers (except the we hairline), over a photo, on icons other than the chevron that follows a blue link, or on the logo, which is never recoloured, stretched, outlined or retyped. The asterisk is never placed on the blue panel.
- On --brand-strong everything is --brand-contrast white: the question medium, the closer light, the arrow a white circle (recipe talk-panel) with a dark chevron. No asterisk, no blue link, no black logo, no second blue. If a mark is needed on blue or black, use ia-logo-white or ia-monogram-white.
- Links: --interactive at rest with the chevron; on hover the whole link, chevron included, goes --foreground black. No underline, no lighter blue on hover. Footer links are --text-small, black, underlined. A list of links (We Deliver) is a stack of chevron links at --text-lead medium, never plain text.
- Pill: --primary at rest, --primary-hover on hover, no lift or shadow; its 1px --ring focus sits --sp-hairline off the fill, because the ring is IA blue and needs that white gap to show on any blue. Circle buttons: --surface at rest, --canvas on hover, the same --ring focus. Inputs: --input hairline at rest, --ring hairline on focus (the form's focus:border-primary).
- The two blurred blue fields (chatbg, ia-blue-field-2) are IA's only gradients and they are image files: placed once as the ground of the conversational panel or a deck divider, bleeding off an edge. Text sits on the white side only; never behind running copy, never tinted or cropped to the blue. No coloured CSS gradient anywhere; linear-gradient only as the black photo scrim.
- Grey carries hierarchy, not decoration: we in --palette-neutral-400, prose --text-secondary, meta --palette-gray-500, labels --ink-eyebrow, the panel ground --card, hairlines --border and --input. No grey text lighter than --palette-neutral-400 on white, except IA's own form labels and list numbers in --ink-eyebrow; nothing lighter than --palette-gray-500 on a grey panel.
- Black is the second surface: the Machine view page, the photo scrim, the chat pill (--prompt-bar, white text), the monogram circle. Black blocks carry white type (--inverse-foreground) and nothing else; never blue type on black.
- Charts: --chart-1 blue, --chart-2 black, --chart-3 grey, --chart-4 deep blue, in that order; --chart-5 only as a fifth series. No rainbow. Semantic colours (--destructive, --success, --warning, --info) are for form errors and system alerts only, never in editorial work or decks.
- Light is IA. The Machine view and a quoted agent slide are drawn in light mode on --inverse-surface, never under .dark (dark turns --inverse-surface near-white). The .dark block is only for an embedded widget that follows the viewer's setting; never flip a page or deck to dark for mood.
- Photos are IA's own photography (the ia-studio and ia-work files), untinted and unfiltered; depth on photography is the black scrim (recipe image-card), not a shadow or a blue overlay. The only shadows: --sh-lg on image cards, --sh-sm on the chat pill and the mode tabs. Panels, nav, buttons and type sit flat on a hairline. The closer (Let's talk.) is light, never bold.

Dark mode: the same roles take the values under `x-substrate.dark.colors`.

## Typography

Faces: Benton Sans for display and headings, Benton Sans for everything else (display, h1, h2 and h3 take the display face (the engine's :where(h1, h2, h3) rule); every other step takes the sans).
- A section opens with a heading row: the marked statement (recipe asterisk-heading: a typed bold * in --primary tucked --sp-optical before a --text-h2 36px medium line in --ink-heading) left and at most one blue chevron link (recipe chevron-link, e.g. See More Results) right, then the content below. One marked statement per view.
- Decks keep the grammar at the [data-deck] scale: white slides, bold --text-h1 Title Case titles, one marked statement slide in medium weight, IA's studio photography at --r-containers, a blue Let's talk closing slide, ia-logo on the cover and close, ia-monogram small in a corner of content slides. One blue element per slide; a dark slide only to quote the Machine view.
- Articles open with a full-width photo or diagram at --r-containers, then the --text-h1 Title Case title, then text across the container on the same left edge. Full-width --border hairlines split sections; each opens with a --text-h3 topic word over its question at the h3 weight. The closing-action button ends it. One-pagers open with ia-logo and the title; the lettering is the home hero only.
- The Machine view is the one black page: --inverse-surface ground, --font-mono lines at --text-small padded to double leading in --palette-neutral-400, markdown-like prefixes (hash, greater-than, double hash) dimmer in --palette-neutral-600. It is IA's page for agents; --font-mono appears nowhere else.
- Anything interactive (menus, dialogs, selects, tabs, popovers, tooltips, toggles) comes from the shadcn/ui components in components/ui, dressed by the tokens: --r-controls on controls and tabs, --r-lg on inputs with an --input hairline, overlays on --surface at --r-containers with --sh-sm, focus ring --ring 1px, no offset except on a blue fill (--sp-hairline there).
- The closing action of a page or article is the near-black button (recipe closing-action): --palette-neutral-900, --r-lg, --ctl-md tall, --text-body regular white. The blue pill (recipe pill-action) is the contact form's submit only. Secondary actions are blue chevron links. Icon-only actions are circle buttons (recipe circle-button): --surface, --input hairline, one Lucide chevron or arrow.
- The nav is a compact white pill centred near the top, about 330px wide, floating over the hero's top edge: --surface, --stroke-hairline --border, --r-containers, ia-logo left at 24px or taller, one menu button (Lucide equal, two lines) right that opens the menu as a panel; no text links. IA's Classic, Agentic and Machine tabs belong to IA's own site articles only.

## Layout

- Pages sit on --background white at --lay-page (1400px) with --lay-gutter (32px) sides. Sections are --sp-section (100px) of plain air apart: no coloured bands, no alternating grey stripes. Inside a section: --sp-stack-lg (40px) from heading row to content, --sp-stack-sm (24px) between items, --sp-inset-lg (24px) inside cards, --sp-region (48px) inside panels.
- A section opens with a heading row: the marked statement (recipe asterisk-heading: a typed bold * in --primary tucked --sp-optical before a --text-h2 36px medium line in --ink-heading) left and at most one blue chevron link (recipe chevron-link, e.g. See More Results) right, then the content below. One marked statement per view.
- One family, --font-sans. Ladder: --text-display 60 bold, white over photography only; --text-h1 48 bold page titles; --text-h2 36 medium statements and section heads; --text-h3 30 bold sub-sections; --text-lead 20/1.625 prose; --text-body 16 UI and list rows; --text-small 14 meta and footer; --text-micro 12 uppercase only for form labels and list numbers, in --ink-eyebrow.
- Long-form copy is --text-lead in --text-secondary on white, running the page container as IA's articles do. First person plural. Titles of pages, articles, services and decks are Title Case with no full stop; statements (the marked line, section intros, we lines, card lines) are sentence case ending in a full stop. No emoji, no eyebrow above a title. Headings stay --ink-heading black.
- Home and section pages close with the same pair at --sp-stack-sm gap: the conversational panel (recipe chat-panel, chatbg ground) left and wider, the one blue Let's talk panel (recipe talk-panel) right, then the footer (recipe site-footer). An article closes with the closing-action button and the footer only, no pair.
- The manifesto is a three-column grid of we statements (recipe we-statement): a --primary hairline on top, we in --palette-neutral-400 at --text-h2 regular, the claim bold in --ink-heading at the same size, then a paragraph in --text-secondary. Lowercase we, a full stop, no asterisk, no icon. Rows sit --sp-section apart, columns --sp-stack-lg.
- Articles open with a full-width photo or diagram at --r-containers, then the --text-h1 Title Case title, then text across the container on the same left edge. Full-width --border hairlines split sections; each opens with a --text-h3 topic word over its question at the h3 weight. The closing-action button ends it. One-pagers open with ia-logo and the title; the lettering is the home hero only.

## Elevation & Depth

- The Machine view is the one black page: --inverse-surface ground, --font-mono lines at --text-small padded to double leading in --palette-neutral-400, markdown-like prefixes (hash, greater-than, double hash) dimmer in --palette-neutral-600. It is IA's page for agents; --font-mono appears nowhere else.
- Anything interactive (menus, dialogs, selects, tabs, popovers, tooltips, toggles) comes from the shadcn/ui components in components/ui, dressed by the tokens: --r-controls on controls and tabs, --r-lg on inputs with an --input hairline, overlays on --surface at --r-containers with --sh-sm, focus ring --ring 1px, no offset except on a blue fill (--sp-hairline there).
- The closing action of a page or article is the near-black button (recipe closing-action): --palette-neutral-900, --r-lg, --ctl-md tall, --text-body regular white. The blue pill (recipe pill-action) is the contact form's submit only. Secondary actions are blue chevron links. Icon-only actions are circle buttons (recipe circle-button): --surface, --input hairline, one Lucide chevron or arrow.
- The nav is a compact white pill centred near the top, about 330px wide, floating over the hero's top edge: --surface, --stroke-hairline --border, --r-containers, ia-logo left at 24px or taller, one menu button (Lucide equal, two lines) right that opens the menu as a panel; no text links. IA's Classic, Agentic and Machine tabs belong to IA's own site articles only.

## Shapes

- Pages sit on --background white at --lay-page (1400px) with --lay-gutter (32px) sides. Sections are --sp-section (100px) of plain air apart: no coloured bands, no alternating grey stripes. Inside a section: --sp-stack-lg (40px) from heading row to content, --sp-stack-sm (24px) between items, --sp-inset-lg (24px) inside cards, --sp-region (48px) inside panels.
- Every container is --r-containers (14px): cards, panels, photos, the hero, the nav. Grey panels are --card with a --stroke-hairline --border edge; white cards get the same hairline; both sit flat. Grids run three across at --sp-stack-sm gaps; split panels are 3fr 2fr. Inputs are --r-lg (10px), controls --r-md (8px); --r-chip is reserved for the primary pill, the chat input and circle icon buttons.
- Home and section pages close with the same pair at --sp-stack-sm gap: the conversational panel (recipe chat-panel, chatbg ground) left and wider, the one blue Let's talk panel (recipe talk-panel) right, then the footer (recipe site-footer). An article closes with the closing-action button and the footer only, no pair.
- Services are a numbered list (recipe service-list): rows at --text-body medium, the number (01. to 04.) at --text-micro in --ink-eyebrow, a chevron at the end, --r-containers corners, no hairlines. The one selected row is a solid --primary block with --primary-foreground text; hover draws an --input edge and turns the text blue.
- Decks keep the grammar at the [data-deck] scale: white slides, bold --text-h1 Title Case titles, one marked statement slide in medium weight, IA's studio photography at --r-containers, a blue Let's talk closing slide, ia-logo on the cover and close, ia-monogram small in a corner of content slides. One blue element per slide; a dark slide only to quote the Machine view.
- The Machine view is the one black page: --inverse-surface ground, --font-mono lines at --text-small padded to double leading in --palette-neutral-400, markdown-like prefixes (hash, greater-than, double hash) dimmer in --palette-neutral-600. It is IA's page for agents; --font-mono appears nowhere else.
- The closing action of a page or article is the near-black button (recipe closing-action): --palette-neutral-900, --r-lg, --ctl-md tall, --text-body regular white. The blue pill (recipe pill-action) is the contact form's submit only. Secondary actions are blue chevron links. Icon-only actions are circle buttons (recipe circle-button): --surface, --input hairline, one Lucide chevron or arrow.
- The nav is a compact white pill centred near the top, about 330px wide, floating over the hero's top edge: --surface, --stroke-hairline --border, --r-containers, ia-logo left at 24px or taller, one menu button (Lucide equal, two lines) right that opens the menu as a panel; no text links. IA's Classic, Agentic and Machine tabs belong to IA's own site articles only.

## Components

The components above are built from the tokens. Anything interactive comes from a component library dressed by these tokens, never hand-rolled.

## Do's and Don'ts

- Do: Pages sit on --background white at --lay-page (1400px) with --lay-gutter (32px) sides. Sections are --sp-section (100px) of plain air apart: no coloured bands, no alternating grey stripes. Inside a section: --sp-stack-lg (40px) from heading row to content, --sp-stack-sm (24px) between items, --sp-inset-lg (24px) inside cards, --sp-region (48px) inside panels.
- Do: A section opens with a heading row: the marked statement (recipe asterisk-heading: a typed bold * in --primary tucked --sp-optical before a --text-h2 36px medium line in --ink-heading) left and at most one blue chevron link (recipe chevron-link, e.g. See More Results) right, then the content below. One marked statement per view.
- Do: One family, --font-sans. Ladder: --text-display 60 bold, white over photography only; --text-h1 48 bold page titles; --text-h2 36 medium statements and section heads; --text-h3 30 bold sub-sections; --text-lead 20/1.625 prose; --text-body 16 UI and list rows; --text-small 14 meta and footer; --text-micro 12 uppercase only for form labels and list numbers, in --ink-eyebrow.
- Do: Long-form copy is --text-lead in --text-secondary on white, running the page container as IA's articles do. First person plural. Titles of pages, articles, services and decks are Title Case with no full stop; statements (the marked line, section intros, we lines, card lines) are sentence case ending in a full stop. No emoji, no eyebrow above a title. Headings stay --ink-heading black.
- Do: Every container is --r-containers (14px): cards, panels, photos, the hero, the nav. Grey panels are --card with a --stroke-hairline --border edge; white cards get the same hairline; both sit flat. Grids run three across at --sp-stack-sm gaps; split panels are 3fr 2fr. Inputs are --r-lg (10px), controls --r-md (8px); --r-chip is reserved for the primary pill, the chat input and circle icon buttons.
- Do: Home and section pages close with the same pair at --sp-stack-sm gap: the conversational panel (recipe chat-panel, chatbg ground) left and wider, the one blue Let's talk panel (recipe talk-panel) right, then the footer (recipe site-footer). An article closes with the closing-action button and the footer only, no pair.
- Do: Heroes are IA's own photography at --r-containers, the full width of --lay-page. The home hero carries the Insight to Action lettering (ia-insight-to-action, white) across the full width with a hairline and a --text-small caption under it. Inner-page heroes centre the title at --text-display, white, on the black scrim. No blue on a hero, no asterisk on a photo.
- Do: Case studies and insights are photo tiles (recipe image-card): a black scrim rising from the bottom and a bold white title bottom-left, no eyebrow; --sh-lg, --r-containers, portrait 4:5. A row scrolls sideways with two circle chevron buttons (recipe circle-button) beneath it, left-aligned. The title is always bold.
- Don't: No serif type anywhere: headings, prose, captions, decks are all --font-sans. IA is one sans family. The site paints one family, Benton Sans; a serif reads as another firm.
- Don't: No left-border accent cards, quotes or callouts. IA's accent line is the hairline above a we statement; otherwise a full --border hairline. The left stripe is a generic template move; IA's only coloured rule runs on top.
- Don't: No radial gradients, glows or blurred blobs painted in CSS. IA's only soft blue fields are the two image files. The site has no CSS colour gradient; its atmosphere is photographic (chatbg, ia-blue-field-2).
- Don't: No Tailwind radial gradient utilities; same rule as no-radial-gradient. The site has no CSS colour gradient.
- Don't: No conic gradients, rings or colour wheels. Not in IA's vocabulary; charts are flat --chart-1 to --chart-4.
- Don't: No frosted glass. The floating nav, the mode tabs and the chat pill are solid surfaces with a hairline, not blurred. The nav reads as plain white with a border; glass is not in the capture.
- Don't: No Tailwind backdrop-blur utilities; same rule as no-backdrop-filter. Solid surfaces only.
- Don't: No second accent colour: no green, red, amber, purple or a lighter blue as decoration. Semantic colours are for form errors and system alerts only. One hue is the system; nine rare colours were dropped from the palette on purpose.
- Don't: The asterisk is one per page, slide or panel, on white or --card only. Never a bullet, list marker, divider, repeated pattern, watermark, background or anything on the blue panel. It marks the single statement that matters; repetition empties it.
- Don't: No italic or all-caps headings, titles or display lines. Uppercase is the 12px eyebrow only (--text-micro, --case-eyebrow); italic only on a cited title inside prose. IA's headings are sentence case, upright (--case-heading none; the sans loads no italic).
- Don't: No illustration, 3D renders, icon grids, stock photography or tinted, filtered or blue-washed photos. IA's imagery is real fieldwork and studio photography, shown as shot. Client illustrations on the site are client work; IA's own imagery is photographic and untinted.
- Don't: No dark page or dark deck by default. The derived dark block is for the Machine view, a quoted agent slide or an embedded widget. The site is light only; dark is derived by rule, not designed.
