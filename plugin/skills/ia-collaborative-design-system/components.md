# Interactive components

The tokens in this folder dress the components; they do not replace them. Anything
interactive — menus, dialogs, selects, tabs, popovers, tooltips, toggles, command
palettes — comes from a library that already handles focus, keyboard and ARIA.

## React projects: shadcn/ui

Set up once (the /substrate:install step does this for you):

    node "<plugin>/scripts/components.mjs" . --skill ia-collaborative-design-system

That runs `shadcn init` (Radix base) and adds the starter set:
`button`, `input`, `textarea`, `label`, `checkbox`, `radio-group`, `switch`, `select`, `dialog`, `sheet`, `dropdown-menu`, `popover`, `tooltip`, `tabs`, `accordion`, `navigation-menu`, `command`, `sonner`.
It then removes shadcn's own theme from your CSS and imports this system's
`substrate.css` in its place — the variable names are the same, so every
component wears the brand. Add more parts with `npx shadcn@latest add <name>`.

Use them from `components/ui`: `<Button>`, `<Dialog>`, `<DropdownMenu>`,
`<Select>`, `<Tabs>`, `<Tooltip>`. Style them only with this system's
semantic utilities and recipes. Never build a widget from a `div` with a click
handler or a hand-written `role="dialog"`: the Substrate gate blocks that write
in a project that has components.json.

## Plain HTML

Use the native elements: `<button>`, `<dialog>`, `<details>/<summary>`,
`<select>`, `<input type="checkbox|radio|range">`, styled with `root.css`.
