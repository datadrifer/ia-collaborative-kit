# Exports

IA Collaborative 1.0.0 in the formats other tools read. All come from the same lock.

| File | What it is for |
| --- | --- |
| `ia-collaborative-style-guide-1.0.0.pdf` | The style guide: colour, type, space, the motifs and the brand files on printable pages. For anyone without Claude. |
| `DESIGN.md` | The whole system as one text file: tokens, rules and the brief. Give it to any AI tool that builds pages or decks. |
| `light.tokens.json`, `dark.tokens.json`, `base.tokens.json`, `ia-collaborative-design-system.resolver.json` | The tokens in the W3C design tokens format (DTCG 2025.10): the base set plus a light and a dark theme, joined by the resolver. For Figma variables (through Tokens Studio or a plugin) and any token pipeline. |
| `shadcn-ia-collaborative-design-system.json` | A shadcn registry item. `npx shadcn add` with this file puts IA's tokens into a shadcn project. |

For Claude Code projects, use the `ia-collaborative-design-system` skill from the delivery folder instead: it carries the same tokens plus the motifs, the brand files and the gate.
