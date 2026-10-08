# Asterisk-marked heading

IA's marked heading: a typed bold asterisk in IA blue before the one statement that matters (a section head, a panel title, a deck's key slide), exactly as IA's site sets it: the * glyph at the heading's own size, --sp-optical before the first word, riding high on the line. One per view. Markup: a heading with two spans, the * then the text, so the mark never wraps. For a page statement swap the --text-h2 tokens for --text-h1; in a deck the [data-deck] scale applies on its own. The drawn six-spoke file is for the grey panel's corner only.

IA draws its motifs in the light theme only, so this card stays light when the page is dark. A brand motif written as CSS classes over IA's tokens (Substrate recipe `asterisk-heading`, in `recipes.css` of the installed system and in this page's `bundle.css`). Classes: `.asterisk-heading`, `.asterisk-heading-mark`, `.asterisk-heading-text`.

## Markup

```html
<h2 class="asterisk-heading"><span class="asterisk-heading-mark">*</span><span class="asterisk-heading-text">Every challenge is an innovation opportunity, if you know where to look.</span></h2>
```
