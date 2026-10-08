---
description: Set up the IA Collaborative design system in this project (copies the system, switches on the gate, notes it in CLAUDE.md)
---

Run this command from the project root and show the person its output:

```
node "${CLAUDE_PLUGIN_ROOT}/bin/setup.mjs" "$CLAUDE_PROJECT_DIR"
```

Then read `.claude/skills/ia-collaborative-design-system/SKILL.md` and follow its "Set up — once per project" steps for this project's stack (stylesheets and fonts). Tell the person, in plain words, what changed and that Claude Code must be restarted in this project for the gate to load.
