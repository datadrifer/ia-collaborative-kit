# Popover

A small panel anchored to a control, for a few related actions or a short form.

This is the shadcn/ui component Substrate installed in IA's code projects (Radix underneath), sized from IA's tokens: the same code an agent uses in a project.

- Use for content a person asks for; a hint on hover is a Tooltip.

## Parts

Build a Popover from its parts; each is exported on its own (`IACollaborative.PopoverTrigger`).

- **PopoverTrigger**: The control it belongs to.
- **PopoverContent**: The panel.
- **PopoverHeader**: Its title block.
- **PopoverTitle**: The name.
- **PopoverDescription**: One line under it.
- **PopoverAnchor**: Anchors it to another element.
