# DropdownMenu

A menu of actions or options on a control.

This is the shadcn/ui component Substrate installed in IA's code projects (Radix underneath), sized from IA's tokens: the same code an agent uses in a project.

- Up to seven items; group with labels and separators. A choice that persists is a radio or checkbox item.

## Parts

Build a DropdownMenu from its parts; each is exported on its own (`IACollaborative.DropdownMenuTrigger`).

- **DropdownMenuTrigger**: The control that opens it.
- **DropdownMenuContent**: The menu.
- **DropdownMenuLabel**: A group heading.
- **DropdownMenuItem**: One action.
- **DropdownMenuGroup**: A group of items.
- **DropdownMenuRadioGroup**: A set of exclusive options.
- **DropdownMenuRadioItem**: One exclusive option.
- **DropdownMenuCheckboxItem**: An option that toggles.
- **DropdownMenuSeparator**: A hairline between groups.
- **DropdownMenuShortcut**: A keyboard hint.
- **DropdownMenuSub**: A nested menu.
- **DropdownMenuSubTrigger**: Opens a nested menu.
- **DropdownMenuSubContent**: The nested menu.
- **DropdownMenuPortal**: Renders it at the top of the page.
