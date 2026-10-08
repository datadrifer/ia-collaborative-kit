# IA Collaborative Design System: the kit

Version 1.0.0. Owner: Ross Gehm.

IA's colours, type, logo, photography and layout rules, packaged for Claude. Once it is set up, the decks, pages and documents people make with Claude come out looking like IA.

**Open `docs/index.html`** for the full guide. **`OWNER.md`** is the owner's guide: managing requests, updating the system in Claude, and publishing each version.

## Four steps to bring it into IA

**01. Get the kit.** You have it.

**02. Ross Gehm runs the setup.** In Claude Code (the Code tab of the Claude desktop app, or the terminal), signed in to IA's Claude account, open this folder and paste one line at a time:

```
/plugin marketplace add ./
/plugin install ia-design@ia-collaborative
```

Restart Claude Code in this folder, then paste:

```
/ia-design:create-page
```

Claude creates the **IA Collaborative** Design System page in IA's Claude account and gives you its link. Open it and check that it shows IA's logo, colours and components.

**03. IA's Claude admin makes it the default.** Set IA Collaborative as the default design system for IA's organisation. Claude Slides and Claude Design then use it without being asked.

**04. Share it with everyone at IA.** On the Design System page, open the Share menu and share it with IA's organisation. Send everyone the guide.

## What is in this folder

| Folder or file | What it is for |
| --- | --- |
| `docs/` | The guide for everyone at IA. |
| `OWNER.md` | How the owner manages, updates and publishes the system. |
| `CHANGELOG.md` | Every version: what changed. |
| `plugin/` | The Claude Code plugin: `/ia-design:create-page` (the Design System page), `/ia-design:sync` (brings this kit up to the page's version) and `/ia-design:setup` (code projects, with the gate). |
| `components/` | IA's sized shadcn/ui components for React projects. |
| `LICENSES.md` | Who owns which file. |

## Fonts

IA's face is Benton Sans, which IA licenses. It is not included and must never be shared. Every font setting names Benton Sans first and falls back to Libre Franklin (free, Google Fonts), so the work looks right on any machine.
