# Dialog

A modal step that needs an answer before the page goes on.

This is the shadcn/ui component Substrate installed in IA's code projects (Radix underneath), sized from IA's tokens: the same code an agent uses in a project.

- A title that says the action, one primary Button, and a way out.
- The panel takes the containers corner (14px) and a 24px inset.

## Parts

Build a Dialog from its parts; each is exported on its own (`IACollaborative.DialogTrigger`).

- **DialogTrigger**: The control that opens it.
- **DialogContent**: The panel, over a dimmed page.
- **DialogHeader**: Title and description.
- **DialogTitle**: What it asks.
- **DialogDescription**: What happens next.
- **DialogFooter**: The actions.
- **DialogClose**: The way out.
- **DialogOverlay**: The dimmed page behind.
- **DialogPortal**: Renders it at the top of the page.
