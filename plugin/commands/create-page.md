---
description: Create the IA Collaborative Design System page in this Claude account from the kit (once, at setup; or to rebuild a lost page)
allowed-tools: Bash, Read, Write, Artifact
---

Create IA's Design System page in the Claude account this session is signed in to, from the kit's copy of it. Claude Slides and Claude Design read that page. Keep every message short and plain: the person may not be technical.

Run this once, at setup. After that the page is the master copy: the owner changes it in Claude, and `/ia-design:sync` brings the kit up to date. Run this again only to rebuild a page that was lost or broken, and only after a sync, so nothing on the page is undone.

Tool: `node "${CLAUDE_PLUGIN_ROOT}/bin/publish-page.mjs"`. Run it from the folder this session is working in.

1. **Find the page.** List the person's Design System pages (Artifact `action: "list"`, `type: "Design System"`).
   - One titled `IA Collaborative` exists: read its `project/tokens.json` (Artifact `action: "read"`, `path`). If its `meta.version` is newer than the kit's (`plugin/design-system-page/page.json`), stop: the page has changes the kit lacks. Tell the person to run `/ia-design:sync` first. Otherwise this run rebuilds that page; say so and continue.
   - None: this run creates it.
2. **Say what happens**, in one line: "Publishing IA Collaborative <version> (colours, type, the brand book, components, IA's logos, photos and downloads) to a Design System page in your Claude account. It stays private until you share it."
3. **Prepare.**
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/bin/publish-page.mjs" prepare
   ```
   It prints JSON: `work` (a folder it made here), `title`, `version` and `uploads` (the upload calls).
4. **Create the page** when none exists: list the Artifact types (`action: "list"`, `scope: "types"`), take **Design System**, and create it with its `type_url`, `title: "IA Collaborative"` and `auto_open: "after_first_write"`. Never create a second one.
5. **Upload the files.** For each entry in `uploads`, one Artifact publish to the page's url with `asset: true`: `file_paths` for an entry that has `file_paths`, `file_path` for one that has `file_path`. Write every result to `<work>/results.json` as `[{ "path": "<the entry's paths, in order>", "url": "/_blob/<id the upload returned>" }]`, then:
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/bin/publish-page.mjs" record "<work>" --from "<work>/results.json"
   ```
6. **Finish.** When rebuilding, first read the page's `project/design-system.json` and save it as `<work>/existing.json`. Then:
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/bin/publish-page.mjs" finish "<work>" [--existing "<work>/existing.json"]
   ```
   It prints `publish`: `root`, `file_path` and `files`.
7. **Publish the page.** One Artifact publish with the page's `url` and exactly that `root`, `file_path` and `files`.
8. **Tell the person**, in a few lines: the page's link and its version; next, an admin of IA's Claude account makes it the organisation's default design system, and the page is shared with everyone at IA from its Share menu; the `<work>` folder can be deleted.

If any step is blocked or refused, say which step and why, and stop. Never work around a permission check. Publish the files exactly as the kit has them.
