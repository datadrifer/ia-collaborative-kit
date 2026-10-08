# Conversational panel

The chat invitation at the foot of a page, left of the Let's talk panel and wider: --surface at --r-containers, a --border hairline, chatbg as its ground (cover, the blue mass low), --sp-inset-lg padding. Top: the monogram as a --ctl-sm avatar (ia-monogram masked in --foreground), a bold --text-small greeting, grey text on the white side. Bottom: the input pill, --ctl-md tall, --prompt-bar black with white text and --sh-sm, a placeholder span and a round send button (Lucide arrow-up in production). No running copy over the blue.

IA draws its motifs in the light theme only, so this card stays light when the page is dark. A brand motif written as CSS classes over IA's tokens (Substrate recipe `chat-panel`, in `recipes.css` of the installed system and in this page's `bundle.css`). Classes: `.chat-panel`, `.chat-panel-message`, `.chat-panel-avatar`, `.chat-panel-name`, `.chat-panel-text`, `.chat-panel-input`, `.chat-panel-field`, `.chat-panel-send`.

## Markup

```html
<section class="chat-panel">
  <div class="chat-panel-message">
    <div class="chat-panel-avatar"></div>
    <div>
      <p class="chat-panel-name">Hey there, how's it going?</p>
      <p class="chat-panel-text">Welcome to IA Collaborative. I can help shape a tailored path from strategy to shipped outcomes. What challenge are you trying to solve right now?</p>
    </div>
  </div>
  <div class="chat-panel-input">
    <span class="chat-panel-field">Ask IA Collaborative...</span>
    <button class="chat-panel-send" type="button">↑</button>
  </div>
</section>
```
