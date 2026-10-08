# Framework table

IA's way of setting a named framework (the IDEALS model), from IA's own table: a small bold uppercase black label on top, then one row per element: the element's name at --text-h2 in --interactive regular with its initial (framework-table-initial) bold --primary, and beside it the question at --text-lead in --ink-heading with its key phrases bold (framework-table-key). Rows split by white (--background) lines on a --card ground at --r-containers, no outer border. Initials spell the acronym down the left edge; never badges or circles.

IA draws its motifs in the light theme only, so this card stays light when the page is dark. A brand motif written as CSS classes over IA's tokens (Substrate recipe `framework-table`, in `recipes.css` of the installed system and in this page's `bundle.css`). Classes: `.framework-table`, `.framework-table-label`, `.framework-table-row`, `.framework-table-name`, `.framework-table-initial`, `.framework-table-question`, `.framework-table-key`.

## Markup

```html
<div class="framework-table">
  <p class="framework-table-label">IDEALS framework</p>
  <div class="framework-table-row">
    <h3 class="framework-table-name"><span class="framework-table-initial">I</span><span>ntelligence</span></h3>
    <p class="framework-table-question"><span>What </span><span class="framework-table-key">model, algorithm + context</span><span> will we engineer?</span></p>
  </div>
  <div class="framework-table-row">
    <h3 class="framework-table-name"><span class="framework-table-initial">D</span><span>ata</span></h3>
    <p class="framework-table-question"><span>What </span><span class="framework-table-key">data sources + integrations</span><span> will unlock insight?</span></p>
  </div>
</div>
```
