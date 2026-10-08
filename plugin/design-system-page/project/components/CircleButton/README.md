# Circle icon button

IA's icon-only control: a --ctl-sm white circle (--surface) with an --input hairline and one Lucide chevron or arrow in --foreground at 16px, 2px stroke (the example's character stands in for the svg). The prev and next controls under a scrolling row of image cards, left-aligned beneath the row; also any small directional control. Hover lifts the ground to --canvas and focus is a 1px --ring with no offset; the recipe grammar has no states, so set them in the component. Never filled blue, never larger than --ctl-md, never with a label inside.

IA draws its motifs in the light theme only, so this card stays light when the page is dark. A brand motif written as CSS classes over IA's tokens (Substrate recipe `circle-button`, in `recipes.css` of the installed system and in this page's `bundle.css`). Classes: `.circle-button`, `.circle-button-icon`.

## Markup

```html
<button class="circle-button" type="button"><span class="circle-button-icon">›</span></button>
```
