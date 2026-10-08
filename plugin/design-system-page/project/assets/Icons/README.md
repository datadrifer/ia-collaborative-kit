# Icons

The six icons IA's site uses, from **Lucide** (lucide.dev, ISC licence), at a 2px stroke on a 24px grid. Ink is baked in: black #000000, except `chevron-right-blue.svg` in IA blue #176cd9.

| File | Where IA uses it |
| --- | --- |
| `chevron-right-blue.svg` | After every blue text link ("See More Results"), 16px inline, 24px in lists. |
| `chevron-right.svg`, `chevron-left.svg` | Inside the circle buttons under a scrolling row of photo tiles. |
| `arrow-up.svg` | The chat input's send button. |
| `plus.svg` | An add or expand control, used sparingly. |
| `pause.svg` | Pausing the hero film or the logo scroller. |

In code, import the same glyphs from `lucide-react` so they take the text colour. Icons follow the ink of the text they sit with; only the link chevron is blue. No icon grids, no decorative or filled icons, no emoji.
