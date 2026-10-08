# Numbered service list

IA's services as the list on its services page: four rows 01. to 04. at --text-body medium, each number at --text-micro in --ink-eyebrow, a chevron at the end, --r-containers corners, --sp-inset-xs apart, no hairlines. The selected row is a solid --primary block with --primary-foreground text and its number (service-list-number-on) at 0.8; hover draws an --input edge and turns the text --interactive (set states in the component). The chevron character stands in for Lucide chevron-right. The selected service's detail sits beside the list.

IA draws its motifs in the light theme only, so this card stays light when the page is dark. A brand motif written as CSS classes over IA's tokens (Substrate recipe `service-list`, in `recipes.css` of the installed system and in this page's `bundle.css`). Classes: `.service-list`, `.service-list-item`, `.service-list-selected`, `.service-list-label`, `.service-list-number`, `.service-list-number-on`, `.service-list-chevron`, `.service-list-chevron-on`.

## Markup

```html
<ol class="service-list">
  <li class="service-list-selected">
    <span class="service-list-label"><span class="service-list-number-on">01.</span><span>Behavioral Insight &amp; Intent Intelligence</span></span>
    <span class="service-list-chevron-on">›</span>
  </li>
  <li class="service-list-item">
    <span class="service-list-label"><span class="service-list-number">02.</span><span>Enterprise Data &amp; AI Strategy</span></span>
    <span class="service-list-chevron">›</span>
  </li>
  <li class="service-list-item">
    <span class="service-list-label"><span class="service-list-number">03.</span><span>Experience &amp; Product</span></span>
    <span class="service-list-chevron">›</span>
  </li>
  <li class="service-list-item">
    <span class="service-list-label"><span class="service-list-number">04.</span><span>Operating Model Transformation</span></span>
    <span class="service-list-chevron">›</span>
  </li>
</ol>
```
