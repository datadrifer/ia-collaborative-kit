# Blue chevron link

Every text link on an IA page: --interactive, medium weight, no underline, a Lucide chevron-right directly after the words (the example's single character stands in for the 16px or 24px svg). At --text-lead in a list (the We Deliver links); add chevron-link-compact for --text-body in a heading row (See More Results, Read Insights). On hover the whole link, chevron included, goes --foreground black; the recipe grammar cannot carry that state, so set it in the component's hover rule. Never underlined, never a lighter blue, never a button.

IA draws its motifs in the light theme only, so this card stays light when the page is dark. A brand motif written as CSS classes over IA's tokens (Substrate recipe `chevron-link`, in `recipes.css` of the installed system and in this page's `bundle.css`). Classes: `.chevron-link`, `.chevron-link-icon`, `.chevron-link-compact`.

## Markup

```html
<a class="chevron-link" href="#"><span>See More Results</span><span class="chevron-link-icon">›</span></a>
```
