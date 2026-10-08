# Pill primary action

IA's one primary action per view: a --primary pill, --primary-foreground label at --text-body medium, --ctl-md (48px) tall with --sp-inset-lg side padding, --r-chip. The contact form's submit and the chat send only; the closing Let's talk of a page or article is the closing-action. Hover is --primary-hover and focus a 1px --ring with no offset; the recipe grammar has no states, so set them in the component. Never outlined, never grey, never two pills side by side; the second action is a chevron-link.

IA draws its motifs in the light theme only, so this card stays light when the page is dark. A brand motif written as CSS classes over IA's tokens (Substrate recipe `pill-action`, in `recipes.css` of the installed system and in this page's `bundle.css`). Classes: `.pill-action`, `.pill-action-label`.

## Markup

```html
<a class="pill-action" href="#"><span class="pill-action-label">Let's talk</span></a>
```
