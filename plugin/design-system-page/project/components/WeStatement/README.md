# We statement

The About manifesto unit. A 1px --primary rule on top, the word we in --palette-neutral-400 at --text-h2 size and regular weight, the claim bold (the --text-h3 weight) in --ink-heading at the same size on the next line, then a paragraph in --text-secondary at --text-lead. Lowercase we, the claim ends in a full stop, no asterisk, no icon. Three across on the About page (grid, --sp-stack-lg column gap, --sp-section row gap); one alone as a deck slide or a one-pager pull.

IA draws its motifs in the light theme only, so this card stays light when the page is dark. A brand motif written as CSS classes over IA's tokens (Substrate recipe `we-statement`, in `recipes.css` of the installed system and in this page's `bundle.css`). Classes: `.we-statement`, `.we-statement-we`, `.we-statement-claim`, `.we-statement-body`.

## Markup

```html
<article class="we-statement">
  <span class="we-statement-we">we</span>
  <h3 class="we-statement-claim">provide insight to action.</h3>
  <p class="we-statement-body">IA stands for Insight to Action, which means we never share an insight without a plan for action, or take an action that is not grounded in insight. By finding connections between insights and actions, and demonstrating them clearly, we are able to deliver breakthrough work.</p>
</article>
```
