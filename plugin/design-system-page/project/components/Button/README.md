# Button

The action control: IA's blue pill (the contact form's submit), 48px tall, set in 16px medium.

This is the shadcn/ui component Substrate installed in IA's code projects (Radix underneath), sized from IA's tokens: the same code an agent uses in a project.

- The default Button is IA's blue pill: the contact form's submit and the chat send. The closing "Let's talk" of a page or article is the near-black Closing action motif, not this Button.
- On IA's pages, decks and articles a secondary action is a blue chevron link (the Chevron link motif), never an outlined or grey button. Outline, secondary and ghost are for product UI only: Cancel in a dialog, a trigger for a menu, a toolbar.
- Every Button is a pill (rounded-full), 48px tall (h-control-md) with 24px sides (px-inset-lg); size sm is 32px for dense rows, icon is a 48px circle.
- Destructive only for an action that cannot be undone. Never set a colour, height or padding by hand: the gate refuses raw hex and fixed px.
