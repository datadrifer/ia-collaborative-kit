# Image card

Case-study and insight tiles. A portrait 4:5 block at --r-containers with --sh-lg; a photo layer filling it (a background-image here, an img with alt text in production); a scrim over it (--inverse-surface to clear at 0.75, dark at the foot); a caption pinned bottom-left: a bold white title, no eyebrow (IA's 24px bold has no token; --text-lead at the h3 weight stands in). One anchor per card; photos never tinted. Rows of three at --sp-stack-sm, or a scroll row with two circle-buttons.

IA draws its motifs in the light theme only, so this card stays light when the page is dark. A brand motif written as CSS classes over IA's tokens (Substrate recipe `image-card`, in `recipes.css` of the installed system and in this page's `bundle.css`). Classes: `.image-card`, `.image-card-photo`, `.image-card-scrim`, `.image-card-caption`, `.image-card-title`.

## Markup

```html
<a class="image-card" href="#">
  <div class="image-card-photo"></div>
  <span class="image-card-scrim"></span>
  <div class="image-card-caption">
    <h3 class="image-card-title">Proving ROI from enterprise generative AI.</h3>
  </div>
</a>
```
