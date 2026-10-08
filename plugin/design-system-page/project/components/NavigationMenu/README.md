# NavigationMenu

Top-level site navigation with panels for each section.

This is the shadcn/ui component Substrate installed in IA's code projects (Radix underneath), sized from IA's tokens: the same code an agent uses in a project.

- One level of panels; each link says where it goes.

## Parts

Build a NavigationMenu from its parts; each is exported on its own (`IACollaborative.NavigationMenuList`).

- **NavigationMenuList**: The row of items.
- **NavigationMenuItem**: One item.
- **NavigationMenuTrigger**: Opens an item's panel.
- **NavigationMenuContent**: The panel.
- **NavigationMenuLink**: A link.
- **NavigationMenuIndicator**: Points at the open item.
- **NavigationMenuViewport**: Holds the open panel.
