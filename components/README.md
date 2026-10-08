# IA's shadcn/ui components

The 23 shadcn/ui components (Radix underneath) sized and coloured by IA Collaborative 1.0.0: 48px pill buttons, 48px fields with 10px corners and 16px text, 14px-cornered cards and overlays, every padding on IA's spacing steps. They are the same components shown live on the Design System page, and they pass IA's write-time gate.

Use them in a React project on Tailwind CSS v4 (Next.js or Vite).

## Set up

1. Set up shadcn once: `npx shadcn@latest init` with the Radix base and the nova preset (`-p nova`).
2. Copy `components/ui/*.tsx` over your `components/ui/`, and `lib/utils.ts` over your `lib/utils.ts`.
3. Install what they use: `npm i radix-ui class-variance-authority cn lucide-react cmdk sonner`.
4. Copy the `ia-collaborative-design-system` folder into `.claude/skills/` (see START-HERE.md). In your global stylesheet, remove shadcn's theme block (`:root { --background … }` and `.dark { … }`) and import, right after `@import "tailwindcss";`:

   ```css
   @import "../.claude/skills/ia-collaborative-design-system/substrate.css";
   @import "../.claude/skills/ia-collaborative-design-system/recipes.css";
   ```

   Adjust the relative path to where your stylesheet sits. If the build says "@import rules must precede all rules", move the two font `@import url(...)` lines from the top of `substrate.css` to the very top of your own stylesheet.

## Notes

- `lib/utils.ts` gives `cn` IA's own class names (`text-h2`, `rounded-containers`, `p-inset-md` …), so a class you pass a component replaces its own instead of fighting it.
- Add more components with `npx shadcn@latest add <name>`. They arrive with shadcn's sizes; dress them from the tokens the same way before use.
- Licence: shadcn/ui is MIT. These files are shadcn's with IA's sizes.
