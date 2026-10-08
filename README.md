# IA Collaborative Design System: the kit

Version 1.0.0. Owner: Ross Gehm.

IA's colours, type, logo, photography and layout rules, packaged for Claude. Once it is set up, the decks, pages and documents people make with Claude come out looking like IA.

**Open `docs/index.html`** for the full guide. **`OWNER.md`** is the owner's guide: managing requests, updating the system in Claude, and publishing each version.

## Four steps to bring it into IA

**01. Get the kit.** You have it.

**02. Ross Gehm runs the setup.** First, in Terminal, once. Go to this folder: type `cd` and a space, drag this folder onto the window, and press Return. Keep the folder where it is afterwards. Then paste one line at a time:

```
claude plugin marketplace add ./
claude plugin install ia-design@ia-collaborative
```

If Terminal says `command not found: claude`, install Claude Code, open a new Terminal window, and run the two lines again:

```
curl -fsSL https://claude.ai/install.sh | bash
```

Then, in the Claude desktop app, signed in to IA's Claude account: open the Code tab, start a new session in this folder, and paste:

```
/ia-design:create-page
```

If it does not come up when you type `/`, quit and reopen the app, then start a new session. (The `/plugin` command does not work in the desktop app; the Terminal lines above do the same job.)

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

## For developers

Add the plugin from GitHub, so new versions reach you. In Terminal, one line at a time (git must be installed):

```
claude plugin marketplace add datadrifer/ia-collaborative-kit
claude plugin install ia-design@ia-collaborative
```

Then start a new Claude Code session in each project and run `/ia-design:setup` once. It copies the system in and switches on the gate. When the owner publishes a new version:

```
claude plugin marketplace update ia-collaborative
claude plugin update ia-design@ia-collaborative
```

Then start a new session in each project and run `/ia-design:setup` again.

## The kit's repository

The kit lives at https://github.com/datadrifer/ia-collaborative-kit. Publishing a new version to developers means pushing to it, so the owner needs a clone of it (`git clone https://github.com/datadrifer/ia-collaborative-kit`) and push access. The repository should sit in IA's own GitHub organisation: ask for it to be transferred there (GitHub keeps every old link working) before the first update.

## Fonts

IA's face is Benton Sans, which IA licenses. It is not included and must never be shared. Every font setting names Benton Sans first and falls back to Libre Franklin (free, Google Fonts), so the work looks right on any machine.
