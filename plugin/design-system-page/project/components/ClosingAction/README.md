# Closing action

The closing action of a page or article, as IA's article ends: a near-black --palette-neutral-900 block with --palette-white text at --text-body regular, --ctl-md (48px) tall, --sp-inset-lg side padding, --r-lg (10px) corners. One per view. Hover lifts nothing; focus is the 1px --ring. The blue pill is kept for the contact form's submit.

IA draws its motifs in the light theme only, so this card stays light when the page is dark. A brand motif written as CSS classes over IA's tokens (Substrate recipe `closing-action`, in `recipes.css` of the installed system and in this page's `bundle.css`). Classes: `.closing-action`, `.closing-action-label`.

## Markup

```html
<a class="closing-action" href="#"><span class="closing-action-label">Let's talk</span></a>
```
