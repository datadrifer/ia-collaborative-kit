# Card

A surface for one unit of content: an insight, a capability, a result. IA's grey panel with 14px corners.

This is the shadcn/ui component Substrate installed in IA's code projects (Radix underneath), sized from IA's tokens: the same code an agent uses in a project.

- Cards sit in grids of three on white; the ground is IA's light grey (card) with a hairline border, 24px inside.
- One action per card at most, usually a link.
- The single blue panel per page is a recipe (the Let's talk panel), not a blue Card.

## Parts

Build a Card from its parts; each is exported on its own (`IACollaborative.CardHeader`).

- **CardHeader**: The top: title, description and an optional action.
- **CardTitle**: The card's name.
- **CardDescription**: One supporting line in the muted ink.
- **CardAction**: A small control pinned to the header's corner.
- **CardContent**: The body.
- **CardFooter**: The bottom row, for its action.
