# Accordion

Stacks questions or details that open one at a time: a framework, an FAQ.

This is the shadcn/ui component Substrate installed in IA's code projects (Radix underneath), sized from IA's tokens: the same code an agent uses in a project.

- Triggers are short; answers in body text. Open the first item when it carries the point.

## Parts

Build a Accordion from its parts; each is exported on its own (`IACollaborative.AccordionItem`).

- **AccordionItem**: One question and its answer.
- **AccordionTrigger**: The question: opens and closes its item.
- **AccordionContent**: The answer.
