# Select

One choice from a longer list, in a menu on the popover surface.

This is the shadcn/ui component Substrate installed in IA's code projects (Radix underneath), sized from IA's tokens: the same code an agent uses in a project.

- Use a Label. The trigger is sized like Input (48px, 10px corners); the menu takes the containers corner (14px).

## Parts

Build a Select from its parts; each is exported on its own (`IACollaborative.SelectTrigger`).

- **SelectTrigger**: The closed field that opens the menu.
- **SelectValue**: The chosen option, inside the trigger.
- **SelectContent**: The open menu.
- **SelectGroup**: A labelled group of options.
- **SelectLabel**: The heading of a group.
- **SelectItem**: One option; the chosen one carries a check.
- **SelectSeparator**: A hairline between groups.
- **SelectScrollUpButton**: Scroll control at the top of a long menu.
- **SelectScrollDownButton**: Scroll control at the bottom of a long menu.
