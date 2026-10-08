# What was dropped

What the reading found on IA's site and left out of the system, and why.

## Client material

- **Six case-study illustrations**: the artwork on the Google, Apple, Airbnb, AbbVie, Nike and Audi tiles. They are IA's clients' marks and imagery, shown on IA's site as client work. They are not IA's identity and are not in this system.
- **Colours taken from client tiles.** The first read picked up #4d86f9 (the Google tile) as the card colour and black (the Apple tile) as the strong brand colour. Both were replaced with IA's own values.
- **Case-study and insight photography.** The images on IA's result and insight tiles are client or article content. None is included.

## Photography

- **Insight covers and article images** (the IDEALS diagrams, guide covers) are content of single articles, not brand imagery, and are not included.
- **IA's four studio photographs are included** (Photography group): they are IA's own space and team, not client work. See Decisions.

## Eyebrows

- **Eyebrow labels.** An early draft of the system put a small uppercase eyebrow above titles and cards. IA's pages carry none, so they were taken out.

## Interface glyphs

- **Thirteen small SVGs** harvested from the page were Lucide interface icons (chevrons, arrows, the menu icon, a pause button), one of them labelled "logo" by the page. They were replaced by the six clean icon files in the Icons group.

## Library defaults

- **Forty-five unused palette colours.** IA's stylesheet carries the full Tailwind palette. Only the thirteen colours IA paints are kept.
- **The component library's neutral theme.** IA's site includes a stock set of neutral component colours that IA never uses for its brand. None of them is in the system; every component here takes IA's tokens.
- **Pale status tints** (success, warning and information washes). IA paints none of them. The system keeps `destructive` for form errors only.

## Values the system cannot hold

These were read off IA's pages but have no place in the token set. Each is covered another way:

| Read on IA's site | What the system does instead |
| --- | --- |
| Focus outline, 1px #a1a1a1 | Focus is a 1px IA-blue `ring`, IA's own focus colour on the contact form. |
| Circle-button edge, 1px #d1d5dc | Control edges use `input` (#d7d7d7), IA's own field colour. |
| Button text, 16px medium | Set by the button component from the controls, at the same size and weight. |
| Field text, 16px regular | Set by the input component, at the same size and weight. |

## Recipes

- **The Machine view as a motif card.** It is a written rule instead (README, Surfaces): the checker would not accept a monospace font inside a motif, although the system ships JetBrains Mono.

## Licensed fonts

- **Benton Sans** is IA's licensed face and is never copied, uploaded or shipped. It is named first in every font stack, so it renders where IA has it installed. Libre Franklin is the free stand-in.
