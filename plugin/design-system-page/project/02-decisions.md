# Decisions

Every call made while building this system, and why. IA supplied no brand files, so each one rests on IA's own site. The calls marked **For IA to confirm** are the ones made with less than full certainty; each says what would change if IA decides otherwise.

## Colour

**IA blue is the one hue.** `primary` is #176cd9, IA's own theme token (`--color-primary`), painted on the contact form's submit, the Let's talk panel, every link and the asterisk. The first read took the near-black of the article mode tabs as primary; that was corrected from IA's stylesheet.

**Thirteen colours, not fifty-eight.** IA's stylesheet carries the whole Tailwind palette. Only the thirteen colours IA actually paints are kept, under IA's own names (`palette-gray-100`, `palette-light-gray`, …).

**Prose grey is #525252.** IA uses two greys for running text: #525252 on the About page and #6a7282 for card descriptions. #6a7282 falls to 4.4:1 on IA's grey panel, so `text-secondary` takes the About grey (7.8:1) and #6a7282 stays for meta on white.

**Hover is IA's own rule.** IA brightens the pill by 10% on hover; `primary-hover` is that value (#1977ef), not a darker shade.

**For IA to confirm: the eyebrow grey.** IA paints form labels and small uppercase eyebrows in #aeaeae (`ink-eyebrow`), which reads 2.2:1 on white, well under the 4.5:1 floor for small text. It is kept exact because it is IA's. If IA agrees to fix it, #6a7282 (`palette-gray-500`, 4.8:1) is the nearest IA grey that passes; decks already use it.

**For IA to confirm: chart colours.** IA's site has no charts. The series follow the brand's own logic: IA blue for the series that matters, black for the comparison, grey for context, a deep IA blue fourth, a mid grey fifth. No rainbow.

**For IA to confirm: the dark theme.** IA's site is light only. Dark was derived by rule, then corrected by hand where the rule broke: headings and display text are near-white (#f9f9f9), and the dark charts follow the same blue, white and grey logic. It is meant for one job: a widget or tool that follows the viewer's setting. IA's Machine view stays in the light theme on its black surface, and decks and pages are never flipped to dark.

## Type

**Libre Franklin stands in for Benton Sans.** Benton Sans is licensed to IA and is never shipped. Libre Franklin is the closest free face by letter shape (86% alike, measured against IA's own font files). Weights were compared by ink density on IA's own pages: 400 matches. **IA's bold steps are 600**, the value IA's own stylesheet asks for on titles: IA loads Benton Sans at 300, 400, 500 and 700 only, so 600 renders as Benton Bold wherever Benton Sans is installed, and as a Libre Franklin SemiBold elsewhere. Two reviewers read Libre Franklin's 700 as a black poster face beside IA's Benton Bold; 600 matches it. Libre Franklin's 500 is the opposite: about 11% lighter than Benton Medium, so in Claude Slides and Design (where Benton Sans never loads) IA's medium roles are set at 580 (600 from 60px up in Slides, which takes whole hundreds only). In code the tokens keep 500, so machines with Benton Sans render it exactly. Every font stack names Benton Sans first, so machines that have it render the real face.

**IA's heading ladder is 60 / 48 / 36 / 30.** Measured across nine of IA's pages: hero titles 60 bold, page titles 48 bold, section heads 36 medium, sub-sections 30 bold, prose 20 on a 1.625 leading.

**For IA to confirm: heading tracking.** Libre Franklin sets about 3% narrower than Benton Sans in bold. With IA's exact tracking the stand-in's headings looked cramped beside IA's pages, so tracking was loosened by 0.01 to 0.015em. Where Benton Sans is installed, headings will sit very slightly looser than the website. If IA's teams all have Benton Sans, IA's exact tracking (-0.025 to -0.03em) can be restored in a new version.

**JetBrains Mono, for the Machine view only.** It is IA's own choice on the site's page for agents.

**Two steps IA uses have no token.** IA's 24px bold card titles and the light (300) "Let's talk." closer. The recipes stand in with the nearest steps (the lead size at bold; the h2 size at 300) and the gap is named in their notes.

## Shape and space

**Radius 6 / 8 / 10 / 14 / 18.** IA's own `--radius: .625rem` ladder, read from the site: controls 8, inputs 10, every container 14. The full pill is not part of the ladder; it is kept for the primary pill, the chat input and the circle buttons.

**Controls are 48px**, from the contact form's submit and fields and the article's Let's talk button.

**Spacing derives from the type**, anchored on IA's own measures: 100px between sections, 40px from a heading row to its content, 24px grid gaps and card insets, 32px page gutters at a 1400px page.

**For IA to confirm: the circle buttons.** IA draws its prev and next buttons at 36px. The control ladder steps from 32 to 48 with nothing between, so the circle-button recipe uses 32px. A 36px step can be added in a new version if IA wants the exact size.

## Brand files

**The logo, monogram, asterisk and lettering are IA's own drawings**, fetched from IA's site. The monogram is the logo's own circle, cut from the logo file (IA's site uses it as the chat avatar and favicon).

**For IA to confirm: the white versions.** IA publishes the logo and monogram in black and the Insight to Action lettering in white. The white logo, white monogram and black lettering were made from those files by changing the ink only. Nothing was redrawn. IA should confirm it is happy to have these versions in circulation.

**The blue fields are image files.** IA's soft blue grounds are two photographs of a blur (the chat panel's ground and a second, wider field), not CSS gradients. The second was reduced from a 5504px, 14 MB PNG to a 2400px, 100 KB JPG with no visible change.

**Six icons, all Lucide.** IA's site uses Lucide at a 2px stroke. The six glyphs IA actually uses are included, black, plus the IA-blue link chevron.

## Checked again against IA's site

A judge compared the first sample deck, one-pager and web pages with IA's site and scored two of them 3 out of 5. Each point was checked on IA's live pages before anything changed:

- **The statement asterisk is a typed `*`**, bold IA blue, at the heading's own size, 4px before the first word. The drawn six-spoke file is only the grey panel's corner mark. Corrected everywhere.
- **No eyebrows.** IA's pages put no small uppercase label above titles or cards; the one label is the bold black one on IA's framework table. Removed from the system.
- **Titles are Title Case**, statements sentence case with a full stop. Written into the voice rules.
- **The closing button is near-black** (#171717, 10px corners), as at the end of IA's articles; the blue pill is the contact form's submit only. Added as the Closing action motif.
- **The nav is a compact pill** with the logo and a menu button, no text links. Corrected.
- **The services list** has 16px medium rows, small grey numbers and no hairlines; the solid blue selected row is IA's own and stays.
- **Frameworks** follow IA's own IDEALS table: initials bold IA blue, key phrases bold. Added as the Framework table motif.
- **Articles run the full container** under a full-width photo or diagram, one left edge for everything.
- Not changed: the judge read IA's side margins as wider, but that came from comparing captures at different widths; at the same width they match.

**Photographs that may carry type.** Only the two darker studio rooms (the team at work, the model shop) carry white type, under a clean black scrim; the open studio and the glass room are bright with glare and are used framed, without type. Reviewers flagged white type on glare as the main legibility fault.

**For IA to confirm: photography.** IA is photo-led, and samples without photographs read as templates. Seven of IA's own photographs are now in the system as brand imagery: the four studio photographs from the home page (taken at 2400px from IA's full-size originals) and three of the team at work from the About page. They show IA's own people and space, not client work; a fourth About photograph, an in-car prototype, was left out as likely client work. IA should confirm they are cleared for this use.

## Composition and decks

**The motifs come from IA's pages.** The asterisk heading, we statement, grey statement panel, Let's talk panel, chevron link, pill action, image card, service list, chat panel, circle button and footer were each rebuilt from IA's pages using only the tokens, then compared side by side with the original until they matched.

**For IA to confirm: slide eyebrows.** Small uppercase labels on slides use #6a7282 instead of IA's web #aeaeae, which is too faint to read on a projector.

**For IA to confirm: deck sizes.** IA's decks were not available, so slide type follows the system's deck scale (titles 111px, headings 74px, body 36px at 1920 × 1080) with IA's website weights. Decks built in code from the skill set slide headings one weight heavier (bold section heads, semi-bold sub-heads); decks made in Claude Slides use IA's weights as this page writes them. If IA shares a real deck, the deck scale should be checked against it.

## Checked, no change

- Every colour pair in IA's own palette was checked for contrast. The failing pairs are IA's own and are kept, with a note on each token.
- The system was tried by two builders who never saw IA's site. Both produced pages that read as IA: white, black type, one blue, the asterisk heading, photo tiles, the blue Let's talk panel.
