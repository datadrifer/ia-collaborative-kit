# Let's talk panel

The single blue panel per page and a deck's closing slide: --brand-strong at --r-containers in IA's 5:4 proportion, --sp-region padding. A white --text-h2 question (medium) on a short measure at the top; anchored at the foot, the closer Let's talk. at the same size, lighter, and a white --ctl-md circle holding a dark Lucide chevron-right. The whole panel is one link to Contact. No asterisk, no blue link, no black logo on it. Right of the chat panel at the foot of home and section pages.

IA draws its motifs in the light theme only, so this card stays light when the page is dark. A brand motif written as CSS classes over IA's tokens (Substrate recipe `talk-panel`, in `recipes.css` of the installed system and in this page's `bundle.css`). Classes: `.talk-panel`, `.talk-panel-question`, `.talk-panel-foot`, `.talk-panel-closer`, `.talk-panel-arrow`.

## Markup

```html
<a class="talk-panel" href="#">
  <h2 class="talk-panel-question">Want to create the future of human experience?</h2>
  <div class="talk-panel-foot"><span class="talk-panel-closer">Let's talk.</span><span class="talk-panel-arrow">›</span></div>
</a>
```
