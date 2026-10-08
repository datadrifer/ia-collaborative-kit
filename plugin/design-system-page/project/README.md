# IA Collaborative

White pages, black type, one blue. IA speaks in plain first-person statements, marks the one that matters with a blue asterisk, leads with photography of its own studio and work, and asks one question per page in a single blue panel. Everything else is grey, flat and quiet.

This is IA's design system, version **1.0.0**. It was read from iacollaborative.com (7 October 2026) and locked so every deck, page, article and one-pager IA makes with Claude comes out the same way. The values are IA's own wherever the site paints them; where the site says nothing, a rule fills the gap and the section **Decisions** says so.

- **Colour, type, space, radius** live in `tokens.json` (shown under Tokens). Every value has a usage note.
- **The brand motifs** (the asterisk heading, the we statement, the Let's talk panel, the framework table and nine more) are live cards under Components, with the shadcn components IA's code projects get.
- **Logos, the asterisk, the lettering, the blue fields, IA's studio photography, icons and the exports** are under Assets.

## How to use it

**In Claude (Slides, Design, chat).** Say "use the IA Collaborative design system", or make it your default design system so every new deck and design starts from it without asking. Claude reads this README and `tokens.json`, installs the fonts and uses the files under Assets.

**In code (Claude Code).** Install the `ia-collaborative-design-system` skill from the delivery folder into the project's `.claude/skills/`. It carries the tokens as a Tailwind v4 stylesheet (`substrate.css`), the motifs (`recipes.css`), the brand files and a gate that refuses off-brand values as they are written: a raw hex, a fixed pixel size, an arbitrary Tailwind value, a serif.

**Without Claude.** The Exports group holds the style guide PDF, `DESIGN.md` (the whole system as one text file for any AI tool), the DTCG token files for Figma or Tokens Studio, and a shadcn registry item.

## The idea: Insight to Action

IA stands for **Insight to Action**: never an insight without a plan for action, never an action not grounded in insight. Every surface follows the same order: what we saw, then what to do. The look serves that. It is plain, confident, consultative, disciplined and human. It is never decorative, techy, playful, gradient-heavy or corporate-generic.

## Voice

IA writes like a consultant who has done the work: plain, confident, specific, in the first person plural.

- **We, not the firm.** "We uncover actionable insights about your users." Never "IA Collaborative leverages…".
- **Titles are Title Case, with no full stop**: pages, articles, services, decks. "The IDEALS Model for Custom AI Implementation." is wrong; "The IDEALS Model for Custom AI Implementation" is right.
- **Statements are sentence case and end with a full stop**: the marked line, section intros, we lines, card lines, slide headings that make a claim. "Every challenge is an innovation opportunity, if you know where to look."
- **Concrete over abstract.** "Scrubbing in to observe a surgery in London, shooting hoops with teens in the Bronx, or living with families in Mumbai." Name the place, the person, the number.
- **Questions lead sections in thought leadership.** "What model, algorithm and context will we engineer?" "How will it learn and improve?"
- **Frameworks get a name and an acronym** (the IDEALS model: Intelligence, Data, Experience, Autonomy, Learning, Security), then the framework table in that order: each initial IA blue in weight 600, the question beside it with its key phrases in 600. In a framework table IA joins pairs with "+": "What model, algorithm + context will we engineer?"
- **Close with an invitation, not a slogan.** "Want to create the future of human experience? Let's talk."
- No emoji. No exclamation marks. No hype words ("supercharge", "game-changing", "revolutionary").
- No kicker labels. IA puts no small uppercase eyebrow above a title, a slide heading or a card; the title stands alone.

Lines to take the measure from, all IA's own:

> Human-Centered Solutions for Industry Leaders' Most Complex Challenges.

> Every challenge is an innovation opportunity, if you know where to look.

> Before you can make progress, you have to start making.

## Colour: one blue

IA blue is the only hue on a page. Everything else is black, white and grey. There is no second accent, no tinted section and no blue wash.

| Token | Light | Where it goes | Contrast |
| --- | --- | --- | --- |
| `background` | #ffffff | The page ground. Every page, slide and one-pager. | |
| `foreground` | #000000 | Headings, UI text and body copy. | 21:1 on white, 19:1 on `card` |
| `primary` | #176cd9 | IA blue: links, the asterisk, the Let's talk panel, the selected service row, the contact form's pill, focus. | 5.0:1 on white, 4.6:1 on `card` |
| `primary-foreground` | #ffffff | Text on IA blue. | 5.0:1 |
| `card` | #f3f4f6 | The grey panel ground, with a `border` hairline (the framework table has none; its rows are split by white lines). | |
| `border` | #e5e7eb | Card and panel hairlines. Decorative. | |
| `input` | #d7d7d7 | Form-field hairlines. | 1.4:1, see the note below |
| `text-secondary` | #525252 | Long-form prose. | 7.8:1 on white, 7.1:1 on `card` |
| `palette-gray-500` | #6a7282 | Meta and descriptions on white cards. | 4.8:1 on white, 4.4:1 on `card` |
| `palette-neutral-400` | #a1a1a1 | The grey "we" of a we statement, large text only. | 2.6:1 |
| `ink-eyebrow` | #aeaeae | Form-field labels and list numbers (01. to 04.), as IA paints them. | 2.2:1, see the note below |
| `inverse-surface` | #000000 | The one black surface: the Machine view, the photo scrim. | |
| `destructive` | #e7000b | Form errors only. | 4.8:1 on white, 4.3:1 on `card` |

**Where blue goes.** Every text link (`interactive`, a chevron after it), the asterisk, the hairline over a we statement, the one Let's talk panel per page (`brand-strong`), the selected service row, the contact form's pill, the focus ring (`ring`). A page has a handful of blue moments, not a blue theme.

**Where blue never goes.** Headings or display text (one exception: the framework table's element names, as IA's own table sets them); behind a section; the nav; borders or dividers (except the we hairline); over a photo; icons other than the chevron after a blue link; the logo.

**On the blue panel** everything is white (`brand-contrast`): no asterisk, no blue link, no black logo, no second blue. A mark on blue or black is `ia-logo-white` or `ia-monogram-white`.

**Grey carries hierarchy, not decoration.** "We" in `palette-neutral-400`, prose in `text-secondary`, meta in `palette-gray-500`, labels in `ink-eyebrow`. No grey text lighter than `palette-neutral-400` on white.

**Black is the second surface**: the closing button (near-black #171717), the Machine view, the photo scrim, the chat pill, the monogram circle. Black carries white type and nothing else.

**Charts**: `chart-1` IA blue (the series that matters), `chart-2` black (the comparison), `chart-3` grey (context), `chart-4` deep IA blue; `chart-5` mid grey only as a fifth series. Axes and grid lines in `muted-foreground` and `border`. No rainbow.

**Dark** is not IA's look. Light is IA, and the Machine view is a black page drawn in the light theme on `inverse-surface`, never under dark (dark turns `inverse-surface` near-white). The dark theme exists for one job: an embedded widget or tool that follows the viewer's setting. Never flip a page or deck to dark for mood. Dark values were derived by rule and set by hand where the rule broke (see Decisions).

**Contrast notes, IA's own values kept.** Three of IA's colours sit under the 4.5:1 floor where IA uses them, and they are kept exact because they are IA's:

- `ink-eyebrow` (#aeaeae) reads 2.2:1 on white. IA uses it for form labels and list numbers. The proposed fix, for IA to decide, is `palette-gray-500` (#6a7282, 4.8:1).
- `palette-gray-500` reads 4.4:1 on the grey `card`. Use it on white cards; on a grey panel use `text-secondary`.
- `input` (#d7d7d7) reads 1.4:1 on white, under the 3:1 a control edge needs. Always pair a field with a visible label; focus turns the edge `ring` blue.
- `interactive` on `interactive-muted` reads 4.5:1 exactly at the floor, and `destructive` on `card` 4.3:1. Keep error text on white.

## Type: one family

IA sets everything in **Benton Sans**, one family, sentence case. Benton Sans is licensed to IA and is never shipped here. **Libre Franklin** is the free stand-in (an 86% letter-shape match) and is included as font files. Every family stack names Benton Sans first, so machines with IA's licence installed render the real face:

`"Benton Sans", BentonSans, "Libre Franklin", system-ui, sans-serif`

Heading tracking is loosened by 0.015em against the site so Libre Franklin sets at Benton Sans's width.

**IA's bold is 600.** It is the value IA's own stylesheet asks for on titles. IA loads Benton Sans at 300, 400, 500 and 700 only, so where Benton Sans is installed 600 renders as Benton Bold; in Libre Franklin it renders a SemiBold with the same colour on the page. Libre Franklin 700 and heavier reads as a black poster face beside IA's: never set type heavier than 600.

| Style | Size / leading | Weight | Tracking | Use |
| --- | --- | --- | --- | --- |
| `display` | 60 / 1.0 | 600 | -0.015em | Hero titles, white over photography only. |
| `h1` | 48 / 1.15 | 600 | -0.01em | Page and article titles on white. |
| `h2` | 36 / 1.11 | 500 | -0.02em | Statements, section heads and panel titles; the asterisk-marked line. |
| `h3` | 30 / 1.25 | 600 | -0.015em | Sub-sections and question sub-heads. |
| `lead` | 20 / 1.625 | 400 | | Long-form prose, in `text-secondary`. |
| `body` | 16 / 1.5 | 400 | | UI text and short copy. |
| `small` | 14 / 1.43 | 400 | | Meta, captions, the footer. |
| `caption` | 12.22 / 1.45 | 400 | 0.016em | Fine print. |
| `micro` | 12 / 1.33 | 500 | 0.05em | Form-field labels and list numbers, uppercase, in `ink-eyebrow`. A framework table's label uses it bold and black. Never an eyebrow above a title. |

Two gaps on IA's site have no token: the 24px bold card title (use `lead` at the h3 weight) and the light 300 closer of the Let's talk panel (set at `h2` size, weight 300, the one place 300 appears).

Large statements are medium (500); IA's biggest display lines are never heavier than its titles.

**Weights in Claude Slides and Design.** Benton Sans never loads there, so the page is always Libre Franklin, whose 500 carries about 11% less ink than Benton Medium and reads as Regular. Set IA's medium roles (statements, section heads, slide headings, the blue panel's question, card headlines) at **580**, its bold roles at **600**, body at 400 and the light closer at 300. **Slides** takes whole hundreds only: there, medium roles are **500** at sizes under 60px and **600** from 60px up (large type needs the extra weight to read as IA's Medium), bold roles **600**, and size carries the difference. Slides' inline bold (`<b>`) renders 700: use it only for a framework table's initials and key phrases, nowhere else. In code keep the tokens (500 and 600), so machines with Benton Sans render it exactly.

**JetBrains Mono** appears in one place: IA's Machine view, the black page for agents, at 14/28 in grey. Nowhere else.

## Space and shape

Spacing derives from the type. The numbers that build a page:

| Token | Value | Use |
| --- | --- | --- |
| `space-section` | 100px | Plain air between sections. No coloured bands, no alternating stripes. |
| `space-region` | 48px | Padding inside panels. |
| `space-stack-lg` | 40px | Heading row to content. |
| `space-stack-sm` | 24px | Between items; grid gaps. |
| `space-inset-lg` | 24px | Padding inside cards. |

Pages sit in one container, 1400px wide with 32px gutters, and everything on a page shares its left edge: nav, hero, titles, text and the closing pair.

**Radius.** Every container is `radius-containers` (14px): cards, panels, photos, the hero, the nav. Inputs are `radius-lg` (10px), controls and tabs `radius-controls` (8px). `radius-chip` (a full pill) is kept for the contact form's submit, the chat input and circle icon buttons.

**Controls** are `control-md`, 48px tall; circle buttons `control-sm`, 32px.

**Depth.** Panels, nav, buttons and type sit flat on a hairline. The only shadows: `shadow-lg` on photo cards, `shadow-sm` on the chat pill and the mode tabs. Depth on photography is the black scrim, never a shadow or a blue overlay.

## Composition

**A section** opens with a heading row: the marked statement on the left (a typed bold `*` in IA blue, then the `h2` line in medium), at most one blue chevron link on the right ("See More Results"), then the content `space-stack-lg` below. One asterisk per view.

**Grids** run three across at `space-stack-sm`. Split panels are 3fr 2fr.

**A list of links** ("We Deliver") is a stack of blue chevron links at `lead` size, medium weight, one per line; never plain black text.

**Below 1024px** the closing pair stacks: the chat panel, then the blue panel at full width, its 5:4 proportion capped at 480px tall.

**Home and section pages close** with the same pair: the conversational panel (left, wider, on the soft blue field) and the one blue Let's talk panel (right) in IA's 5:4 proportion, its question at the top and "Let's talk." (light) with the arrow anchored at the foot. Under it the footer: a hairline, the company line left, underlined links right. **An article closes** with the near-black Let's talk button and the footer only. One closing action per page, never two.

**Heroes** are real photography or film at full width. The home hero carries the Insight to Action lettering in white. Inner-page heroes centre the title at `display`, white, on the photograph under the black scrim ("About Us").

**Case studies and insights** are portrait photo tiles: a black scrim rising from the bottom and a bold white title bottom-left, no eyebrow. A row scrolls sideways with two circle chevron buttons beneath it.

**The manifesto** is a three-column grid of we statements: a blue hairline on top, "we" in grey, the claim bold in black at the same size, then a paragraph.

**Services** are a numbered list as on IA's services page: rows at 16px medium, the number (01. to 04.) small in grey, a thin grey chevron at the end, 14px corners, no hairlines; the selected row is a solid IA-blue block with white text and the selected service's detail sits beside the list. Numbers are plain figures with a full stop, never badges.

**The closing action** of a page or article is the near-black button (the Closing action motif): #171717, white 16px regular label, 48px tall, 10px corners, one per view. The blue pill is only the contact form's submit. Secondary actions are blue chevron links, never an outlined or grey button.

**Frameworks** (IDEALS and the like) are the framework table: a small bold black uppercase label on a grey panel, then one row per element with its name in IA blue, the initial bold, and its question beside it with the key phrases bold.

**The nav** is a compact floating white pill centred near the top, about 330px wide: a hairline, the logo left at 24px or taller, one menu button (two lines: Lucide `equal`) right that opens the menu as a panel. It floats over the top edge of the hero. No row of text links. The Classic, Agentic and Machine tabs are IA's own website's; other pages and documents carry none.

## Surfaces

**Articles and thought leadership.** As IA's articles run: a full-width diagram or photograph at `radius-containers` first, then the `h1` Title Case title, then the text across the whole container on the same left edge (no narrow column, no empty right band). A full-width `border` hairline splits each section, with 48px above and below it; a section opens with its topic word at `h3` ("Intelligence"), 12px under it the question it asks at `lead` size in weight 600, then 24px to the prose at `lead` in `text-secondary`. One marked statement, 48px clear of the text above and below. The near-black "Let's talk" button ends the article; no closing pair after it. A framework sits in the framework table.

**Diagrams.** When the piece has a model, lead with it rather than a photograph: flat, IA blue for the subject, black type, greys and white for structure, on white or the grey `card` at 14px corners. The framework table is the default diagram. No 3D, no gradients, no second hue.

**One-pagers and print (US letter, 816 × 1056 px at 96 dpi).** One layout, set the way a senior IA designer would; the One-pager card under Components shows it. Follow it exactly, zone by zone:

| Zone | Specification |
| --- | --- |
| Hero band | Full bleed across the top, 408px tall: one of IA's photographs (`object-fit: cover`), chosen for the subject, (`ia-studio-model-shop` or `ia-studio-team-at-work`, never a bright one) under the black scrim: `linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.6) 42%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.32) 100%)`, so the white title holds 4.5:1, the photograph at `object-position: 50% 40%`. `ia-logo-white` 24px tall, 56px from the left and 40px from the top. At the foot of the band, 56px in and 36px up: the Title Case title at 44px / 1.06, weight 600, -0.01em, white, at most 600px wide; 20px under it a 1px white rule (70%) across the band between the 56px margins; 12px under the rule one line (the dek: what the reader gets, in one sentence) at 14px / 1.43, white at 92%. |
| Body margins | 56px left and right. The body starts 32px under the band and ends 48px above the bottom edge. |
| Intro row | Two equal columns, 32px apart. Left: the marked statement, the piece's own key line (a typed bold `*` in IA blue, 4px, then the line at 26px / 1.15, weight 580, -0.02em, black), at most three lines. Right: the lead at 14px / 1.55 in #525252, three to five lines, starting 2px lower so its first line sits on the statement's. |
| Content grid | 32px under the intro: three columns, 32px apart, in rows. Each cell has a 1px #e5e7eb hairline on top, 16px of space above its text and 24px below. In a cell: the name at 24px / 1.1, regular, -0.01em, IA blue, with its initial in weight 600; 10px under it the question at 14px / 1.36, weight 600, black, at most two lines (about 50 characters); 6px under that one sentence at 13px / 1.5 in #525252, at most three lines (about 90 characters). Framework questions join pairs with "+". Six parts make a 3 × 2 grid; three or four parts keep the three-column grid. |
| Foot | Pinned to the bottom margin: a 1px #e5e7eb hairline across the body, then 16px under it `ia-logo` (black) 24px tall on the left and the action line on the right at 12px: "Let's talk." in IA blue, weight 500, then `iacollaborative.com/contact` in black. |
| Never | No grey panel behind the content, no button, no lettering masthead, no second photograph, no one-word last lines (set `text-wrap: pretty` on paragraphs, `balance` on questions), nothing set heavier than 600. |
| Fonts on a canvas | Install the system's `fonts/LibreFranklin-Variable.woff2`, then one `@font-face` for "Libre Franklin" at `ds/<folder>/fonts/LibreFranklin-Variable.woff2` (relative to the artboard; or the file uploaded, at its `/_blob/` URL), `font-weight: 100 900`, `font-display: block` so a PDF never catches the fallback. |
| Type details | Curly apostrophes and quotes (’ “ ”). The contact address may be a live link, set in black. |

**Decks (1920 × 1080).** White slides, bold Title Case titles, one marked statement slide, IA's studio photography at a 14px radius, a blue Let's talk closing slide, `ia-logo` on the cover and the close, `ia-monogram` small in the footer of content slides. One blue element per slide (a framework table counts as one); a dark slide only to quote the Machine view.

In Claude Slides, set every slide in **Libre Franklin** (`'Libre Franklin', Arial, sans-serif`). Slides loads only the fonts it installs, so Benton Sans cannot be named there.

The sizes come from the locked deck scale, rounded to whole pixels, with IA's own weights and tracking (the web steps' em values times the size; tighter looks cramped in Libre Franklin):

| Slide style | Size / leading | Weight | Tracking |
| --- | --- | --- | --- |
| Statement (display) | 160px / 1.05 | 580 | -2.4px |
| Title (h1): cover and close | 111px / 1.05 | 600 (the close's question: 580) | -1.1px |
| Slide heading (h2) | 74px / 1.08 | 580 | -1.5px |
| Sub-head (h3) | 50px / 1.15 | 600 | -0.8px |
| Body | 36px / 1.35 | 400 | 0 |
| Caption, footer | 24px / 1.4 | 400 | 0 |
| Framework label | 24px, uppercase, black | 600 | 1.2px |

| Space and shape on a slide | Value |
| --- | --- |
| Margins | 128px (the Slides frame) |
| Title to content | 48px |
| Between items in a row or list | 32px |
| Card padding | 48px |
| Card and photo corners | 14px |
| Hairlines | 2px, #e5e7eb (IA blue only over a we statement) |
| Footer row | 24px type, 64px from the bottom: `ia-monogram` at 32px left, the page number right as a plain figure in #525252 |
| List numbers | 24px, #525252, "01." with a full stop |
| Framework table | names 50px regular IA blue with the initial in weight 600; questions 36px black, key phrases bold; rows split by 2px white lines on the #f3f4f6 panel; label 24px bold black uppercase; columns 1fr 2fr |

Slide colours are the same hexes: white #ffffff ground, black #000000 type, IA blue #176cd9, grey card #f3f4f6 with a #e5e7eb hairline, prose #525252. Slide headings stand alone: no eyebrow above them. Any secondary grey on a slide is #525252, never a cool slate.

The slides IA's decks are made of:

- **Cover:** IA's home-hero grammar. `ia-studio-team-at-work` (or the model shop) full bleed under a black scrim strong enough that the white title holds 4.5:1 over the brightest part behind it (typically 70% at the foot, 35% at mid height, clear by two thirds, 30% at the very top under the logo); `ia-logo-white` top-left at 48px; the Title Case title at 111px, weight 600, white, bottom-left in the 128px margin; a 2px white hairline under it and one 36px line in white. Pick the photograph for the subject.
- **Statement:** a 160px medium statement led by a typed bold `*` in IA blue at the same size, 8px before the first word (the glyph rides high, as on IA's site), then one paragraph at 36px in #525252, 1400px wide, everything from the top margin. Once per deck.
- **Content:** a 74px heading, then the content: the framework table (initials bold IA blue, questions with bold key phrases), a numbered list (items at 50px weight 600, text 36px), two or three grey cards with a clear step between card title (50px, 600) and text (36px), or a photo at 14px corners beside the text. Never heavier than 600. Fill the slide; no dead band below the content.
- **Close:** full-bleed IA blue (the only solid blue slide); the question at 111px, weight 500, white; "Let's talk." at 111px, weight 300, white, with a 96px white circle holding a 48px black chevron; `ia-logo-white` 48px tall, bottom-right, on the "Let's talk." line. The question is the piece's own invitation (IA's site: "Want to create the future of human experience?"). No asterisk on blue.

**The Machine view** is the one black page (its closing button turns white with black text there): `inverse-surface` ground, JetBrains Mono lines at `small` padded to double leading in `palette-neutral-400`, markdown-like prefixes dimmer in `palette-neutral-600`. It is IA's page for agents.

**Product UI.** Menus, dialogs, selects, tabs, popovers, tooltips and toggles come from the shadcn components (cards under Components), dressed by the tokens: `radius-controls` on controls and tabs, `radius-lg` on inputs with an `input` hairline, overlays on `surface` at `radius-containers` with `shadow-sm`, a 1px `ring` focus with no offset. The ring is IA blue, so on a blue fill (the pill, the selected service row, the blue panel) it sits `space-hairline` off the edge, leaving a white gap that shows.

## Logo

- `ia-logo` (black) on white and IA's light greys; `ia-logo-white` on IA blue, black and photography. The IA letters are cut out of the circle, so the ground shows through them.
- `ia-monogram` alone where the lockup does not fit or the name is already said: avatars, slide footers, favicons. Smallest 16px; the lockup 24px tall or more on screen.
- Clear space: the monogram's height on every side. Never recolour, stretch, outline or retype it. Never set "IA Collaborative" in another face beside the mark.

## The asterisk

IA's asterisk comes in two forms. **On a statement** it is a typed bold `*` in IA blue at the statement's own size, set 4px before the first word; the glyph rides high on the line, small against the text, exactly as IA's site sets it. **Large**, the drawn six-spoke file `ia-asterisk` is the one corner mark of a grey panel (60–80px, top-right). One per page or slide, counting both forms: a page with the grey panel's corner mark has no marked statement. On white or the grey `card` only. Never a bullet, a pattern or a background; never on the blue panel, a photo or black.

## Imagery

- **Photography** leads: IA is photo-led, and an all-type piece reads as a template. The Photography group holds seven of IA's own photographs: four of the studio (2400px, from IA's originals) and three of the team at work. Natural light, never filtered or tinted, always in a `radius-containers` frame. White type over a photo sits on a black scrim. Choose by subject and give each kind of piece its own. **Type over a photograph** only on the darker rooms: `ia-studio-team-at-work` and `ia-studio-model-shop`. The open studio and the glass room are bright and full of glare: use them framed, with no type on them. Deck covers lead with the team at work, one-pagers with the model shop, web heroes with the team at work or a framed open studio, the capabilities page with the team at work. The three `ia-work` photographs are web copies: use them at half a slide or a page tile at most, never full bleed or as a hero. Scrims are a clean black, never a grey haze: at least 60% under every line of white type, clearing above it.
- **The blue fields** (`ia-blue-field-1`, `ia-blue-field-2`) are IA's only gradients: a soft blur of IA blue into white, as the ground of one quiet panel or a deck's section divider (not the cover: covers lead with a photograph), the blue mass low and off an edge. Text sits on the white side. Never painted in CSS, never tiled, never cropped to the blue.
- **Not IA:** illustration, 3D renders, abstract tech art, stock photography. Client work is shown as client work, with the client's permission, never as IA's identity. This system holds no client logos and no case-study images.

## Iconography

IA uses **Lucide** (lucide.dev, ISC licence) at a 2px stroke, and few of them: a chevron after every text link, arrows in round buttons, the odd plus or pause. In code, import from `lucide-react`. The Icons group holds the six glyphs IA's site uses, ink baked in (black, plus the IA-blue chevron for links). No icon grids, no decorative icons, no emoji.

## Never

- No serif type anywhere. IA is one sans family.
- No left-border accent cards, quotes or callouts. IA's only coloured rule runs on top of a we statement.
- No radial or conic gradients, glows or blurred blobs painted in CSS. The soft blue is two image files.
- No frosted glass. The nav, the mode tabs and the chat pill are solid with a hairline.
- No second accent colour, no blue headings, no blue section bands.
- No outlined or grey secondary buttons: secondary actions are blue chevron links.
- No blue pill except the contact form's submit; no solid blue except the Let's talk panel, the selected service row and the closing slide.
- No eyebrow labels above titles, slide headings or cards.
- No type heavier than 600 in Libre Franklin.
- No button on paper: a printed action is a line with the address.
- No narrow centred blog column: one container, one left edge.
- No illustration, stock photography or tinted photos.

## Files in this system

**Fonts**, as files on this page: `fonts/LibreFranklin-Variable.woff2` (weights 100–900), `fonts/LibreFranklin-Italic-Variable.woff2` (100–900, italic), `fonts/JetBrainsMono-Variable.woff2` (100–800). `tokens.json` lists them under `type.fonts`. Benton Sans is IA's licensed face and is not here.

**Brand files and downloads**, uploaded to this page. Use a file by its URL exactly as written:

| Group | File | URL |
| --- | --- | --- |
| Logos | `ia-logo.svg` | `/_blob/969fe5215cee723744ec0a643a4410d0` |
| Logos | `ia-logo-white.svg` | `/_blob/5e610245ad05beae9cc8790ce913387c` |
| Logos | `ia-monogram.svg` | `/_blob/d34c35ea108dc58cf90aa400597f109b` |
| Logos | `ia-monogram-white.svg` | `/_blob/75f439213fb8e798908b268b7568ba21` |
| Brand elements | `ia-asterisk.svg` | `/_blob/099a11ba9a001cdfb3da0eb02e196e20` |
| Brand elements | `ia-insight-to-action.svg` | `/_blob/b06f2be7bd26b4d1d3368838747a346f` |
| Brand elements | `ia-insight-to-action-black.svg` | `/_blob/f55616718f2d8e929232717beb1dc984` |
| Brand elements | `ia-blue-field-1.png` | `/_blob/22feb044e57955f567e0586f26a53f19` |
| Brand elements | `ia-blue-field-2.jpg` | `/_blob/141e99ac74b7b335471e7b9bab65a68b` |
| Photography | `ia-studio-open-plan.jpg` | `/_blob/68ffbbd23c554f6a4199a3487fa2ad14` |
| Photography | `ia-studio-team-at-work.jpg` | `/_blob/9b62e540f89115663964a71c27b3ed73` |
| Photography | `ia-studio-glass-room.jpg` | `/_blob/1ac38f21d9cb05e83564aa529cdcee41` |
| Photography | `ia-studio-model-shop.jpg` | `/_blob/20646a20b50e7eb1320a540ac0fc52f0` |
| Photography | `ia-work-synthesis-wall.jpg` | `/_blob/064914fc863b8174d32d2a6d90f2e237` |
| Photography | `ia-work-side-by-side.jpg` | `/_blob/5b39ff47c3df2093eebd7de47b9892f3` |
| Photography | `ia-work-research-review.jpg` | `/_blob/6c0d83468b347ee5970a095ba22a5d75` |
| Icons | `chevron-right-blue.svg` | `/_blob/0c15712ee037adbd61620e91c1436b6d` |
| Icons | `chevron-right.svg` | `/_blob/efa9ed3ef08520ece1a94aa245ec794d` |
| Icons | `chevron-left.svg` | `/_blob/39d28fe8713bc70f200dd97beed95954` |
| Icons | `arrow-up.svg` | `/_blob/09585b7ba37116579443b8e8d8f5b44f` |
| Icons | `plus.svg` | `/_blob/9d75a6b98f0bb0de5152e5aa5b92e6bd` |
| Icons | `pause.svg` | `/_blob/441c060a607925415f0def5c70e1136d` |
| Exports | `ia-collaborative-style-guide-1.0.0.pdf` | `/_blob/b3822e5ca447eb926bbc4af352d94da3` |
| Exports | `DESIGN.md` | `/_blob/fa69c176be6bb2f27b6cd74786a7251b` |
| Exports | `light.tokens.json` | `/_blob/41e8b7ecbb7d222c38f1e35721ed2f1f` |
| Exports | `dark.tokens.json` | `/_blob/4fb824d70f95228357ad161c9076624a` |
| Exports | `base.tokens.json` | `/_blob/9dd1a6ec6a9c7e3f9f10c8749c4a7391` |
| Exports | `ia-collaborative-design-system.resolver.json` | `/_blob/8500d70bee1526c64b7e7899b1bd1e8e` |
| Exports | `shadcn-ia-collaborative-design-system.json` | `/_blob/6f274d0c5132dafb46660fc6cf4c609e` |

**Components:** `components/bundle.js` assigns `window.IACollaborative` (the namespace; folder name when installed: `iacollaborative`), on React 18; `components/bundle.css` styles it; `components/index.d.ts` lists the props.

**Outside this page** (a deck, a canvas, a document), copy each brand file you use into that piece (an asset copy from this page by the id in its URL; the piece then has its own URL for it) and use the piece's URL, and draw a motif from the values in its card's README: the motif classes in `bundle.css` point at this page's own file addresses.

## Names in code

The installed skill uses short CSS variable names. They carry the same values as the tokens here.

| Here | In code |
| --- | --- |
| `primary`, `card`, `text-secondary`, … | `--primary`, `--card`, `--text-secondary`, … (Tailwind: `bg-primary`, `text-text-secondary`) |
| `space-section`, `space-stack-lg`, … | `--sp-section`, `--sp-stack-lg`, … (`py-section`, `gap-stack-lg`) |
| `radius-containers`, `radius-controls`, … | `--r-containers`, `--r-controls`, … (`rounded-containers`) |
| `control-md`, `control-sm` | `--ctl-md`, `--ctl-sm` |
| `shadow-lg`, `shadow-sm` | `--sh-lg`, `--sh-sm` |
| `h2`, `lead`, `micro`, … | `--text-h2`, `--text-lead`, `--text-micro`, … (`text-h2`) |
| Benton Sans stack, JetBrains Mono | `--font-sans`, `--font-mono` |

## Version

IA Collaborative 1.0.0, locked 8 October 2026 (UTC) by Substrate. The fingerprints that tie the code skill, the exports and this page to that one lock are listed under **Lock and versions**. A change to IA's system is a new version: re-lock, and everything built from the tokens takes the change.
