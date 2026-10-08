# Site footer

The last line of every page, under the chat and Let's talk pair: a --border hairline on top, --sp-inset-lg vertical padding, --text-small in --foreground, the company line on the left and underlined links (Privacy Policy, Cookie Settings) on the right. Nothing else: no logo row, no columns of links, no social icons, no colour. In a deck the equivalent is the monogram in a corner of content slides.

IA draws its motifs in the light theme only, so this card stays light when the page is dark. A brand motif written as CSS classes over IA's tokens (Substrate recipe `site-footer`, in `recipes.css` of the installed system and in this page's `bundle.css`). Classes: `.site-footer`, `.site-footer-line`, `.site-footer-links`, `.site-footer-link`.

## Markup

```html
<footer class="site-footer">
  <p class="site-footer-line">IA Collaborative Holdings, LLC. All rights reserved.</p>
  <nav class="site-footer-links">
    <a class="site-footer-link" href="#">Privacy Policy</a>
    <a class="site-footer-link" href="#">Cookie Settings</a>
  </nav>
</footer>
```
