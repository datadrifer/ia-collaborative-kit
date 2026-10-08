# Grey statement panel

The IA means Insight to Action panel: a --card ground with a --border hairline at --r-containers and --sp-region padding, the asterisk as a 60px corner mark (mask in --primary, --text-display square) at --sp-inset-lg from the top-right, a --text-h2 title on a short measure, then a 3fr 2fr body: paragraphs in --palette-gray-500 at --text-small on the left, a bold --text-small label (We Deliver) over a list of blue statement-panel-link chevron links on the right. One panel of this kind per page; it is the only place the asterisk is large.

IA draws its motifs in the light theme only, so this card stays light when the page is dark. A brand motif written as CSS classes over IA's tokens (Substrate recipe `statement-panel`, in `recipes.css` of the installed system and in this page's `bundle.css`). Classes: `.statement-panel`, `.statement-panel-mark`, `.statement-panel-title`, `.statement-panel-body`, `.statement-panel-prose`, `.statement-panel-label`, `.statement-panel-list`, `.statement-panel-link`.

## Markup

```html
<section class="statement-panel">
  <span class="statement-panel-mark"></span>
  <h2 class="statement-panel-title">IA means Insight to Action</h2>
  <div class="statement-panel-body">
    <div>
      <p class="statement-panel-prose">Every solution we launch starts with people.</p>
      <p class="statement-panel-prose">We uncover actionable insights about your users. Then we apply them to a rigorous design and prototyping process that complements your business strategy and generates real value.</p>
      <p class="statement-panel-prose">This is how we deliver new products, new digital experiences, and new ways of working that drive growth and foster continuous innovation.</p>
    </div>
    <div>
      <p class="statement-panel-label">We Deliver</p>
      <ul class="statement-panel-list">
        <li>
          <a class="statement-panel-link" href="#">Behavioral Insight and Intent Intelligence ›</a>
        </li>
        <li>
          <a class="statement-panel-link" href="#">Enterprise Data and AI Strategy ›</a>
        </li>
        <li>
          <a class="statement-panel-link" href="#">Experience and Product ›</a>
        </li>
        <li>
          <a class="statement-panel-link" href="#">Operating Model Transformation ›</a>
        </li>
      </ul>
    </div>
  </div>
</section>
```
