# Input

A single-line field: 48px tall, 10px corners, IA's light-gray border, 16px text.

This is the shadcn/ui component Substrate installed in IA's code projects (Radix underneath), sized from IA's tokens: the same code an agent uses in a project.

- Every Input has a Label above it (IA sets labels in the micro step, uppercase, wide-tracked).
- Placeholders give an example, never the instruction: "you@company.com", "Organization name".
- An error sets aria-invalid; the border turns destructive and a short message sits under the field.
