# Running the IA Collaborative Design System

Owner: **Ross Gehm**. Version in this kit: **1.0.0**.

The design system lives in one place: the **IA Collaborative** Design System page in IA's Claude account. That page is the master copy. Claude Slides, Claude Design and Claude chat read it directly. Code projects get a copy of it through this kit.

Running it is three jobs: manage requests, update the page in Claude, and publish each new version to code projects. Nothing here needs anyone outside IA.

## Who does what

| Role | Who | What they do |
| --- | --- | --- |
| Owner | Ross Gehm | Decides what changes, makes the change in Claude, publishes each version. |
| Backup owner | Name one | Can do everything the owner does, so the system never waits on one person. |
| Claude admin | Whoever manages IA's Claude account | Keeps IA Collaborative as the organisation's default design system. |
| Everyone at IA | | Uses the system, and asks for changes with a comment on the page. |

**Access.** Share the page with everyone at IA so they can see it and comment. Give edit access only to the owner and the backup owner.

## Managing requests

1. **Collect.** People ask for changes by commenting on the Design System page: what should change, and why. Code teams can also open an issue in the kit's repository.
2. **Decide, once a week.** Accept a request when it fixes something wrong, or adds something many people need. Decline it when it is one person's taste or one project's need, or when it pulls away from IA's look. Reply with the reason either way.
3. **Batch.** Make the accepted changes together, as one new version, so people are not chasing a new version every day.
4. **Close the loop.** Reply to each comment with the version that answers it.

## Version numbers

- **1.0.1**: a correction. A value or a rule was wrong.
- **1.1.0**: an addition. A new colour, brand file, pattern or rule.
- **2.0.0**: a new look. IA's brand itself changed. Plan this as a project, not an update.

Every version gets one line in the page's **Lock and versions** section: the number, what changed, and why.

## Updating the system in Claude

Open Claude, signed in to IA's account, and start a new chat. Paste one of the prompts below. For [page link], use the link to IA's Design System page. Claude gives you that link when it first creates the page during setup. Keep it where the owner and the backup can find it. Claude reads the page, makes the change everywhere it appears, records the new version, and publishes the page. Then open the page and check the change.

Each prompt does one job. Replace the parts in [brackets].

### Change a value

```
Update the IA Collaborative design system [page link]: change [token, for example ink-eyebrow] from [old value] to [new value], because [reason]. Keep every other value. Update the token's usage note and every place the brand book mentions the old value. Record this as version [1.0.1] in tokens.json and in the Lock and versions section, with the reason. Show me the before and after, then publish.
```

What it does: Claude changes the one token on the page, rewrites the notes that mention it, adds the version line, and publishes. Slides and Design use the new value from the next piece on.

### Add a brand file

Attach the file (a logo, a mark, or a photograph IA owns) to the chat.

```
Add the attached file to the IA Collaborative design system [page link] as [file name], in the [Logos / Brand elements / Photography] group, with this rule: [when and how to use it]. Add it to the brand book. Record this as version [1.1.0], then publish.
```

What it does: Claude uploads the file to the page, lists it in its group with its rule, and records the version.

### Add a colour or a pattern

```
Add [a new colour / a new pattern] to the IA Collaborative design system [page link]: [name], [value or description], used for [purpose]. Check that any text on it reads at 4.5:1 or better. Add it with a usage note, record this as version [1.1.0], then publish.
```

What it does: Claude adds it to the tokens (a colour) or the brand book (a pattern), checks the contrast, and records the version.

### Change a rule

```
In the IA Collaborative design system [page link], change the brand book's rule about [topic] to: [the new rule]. Change nothing else. Record this as version [1.0.1], then publish.
```

What it does: Claude rewrites that one rule in the brand book and records the version. Claude reads the brand book every time it makes something, so the new rule applies from the next piece on.

### Work through comments

```
Read the open comments on the IA Collaborative design system [page link]. List each one with what it asks for and whether it fits IA's look. Wait for my decisions. Then make the ones I approve as one version, and reply to each comment with that version.
```

What it does: Claude turns the week's comments into one list for you to decide on, then makes the approved changes as one version. If Claude cannot read the comments where you are working, paste them into the chat.

### Check a change

```
Using the IA Collaborative design system, make a two-slide test deck that uses [the thing that changed], so I can see it in use.
```

What it does: shows the change in a real piece before you tell everyone.

### Undo a change

```
Undo the last change to the IA Collaborative design system [page link]: put [token or rule] back to [the old value]. Record this as version [1.0.2], with the reason, then publish.
```

What it does: a change is never erased. Undoing it is a new version, so the history stays true.

**Two rules.** Make every change through a prompt that records a version, so the history stays complete. Never paste values from another brand or an old file into the page.

## Publishing a new version

### In Claude

Nothing more to do. The page is live the moment Claude publishes it: new decks, designs and documents use the new version. Pieces made before keep the version they were made with.

### In code projects

Code projects use a copy of the system from this kit. Bring the kit up to the page's version, then share it.

1. In Claude Code, signed in to IA's account, open your clone of the kit's repository (see The kit's repository in the README) and run:

   ```
   /ia-design:sync
   ```

   Claude reads the page and brings the kit up to the same version: the values, the brand files, the brand book and the version number. It shows what changed. If the page changed without a new version number, it stops and says so.
2. When Claude offers, let it commit, push and tag the new version (for example `v1.0.1`). Developers only get the version once it is pushed.
3. Developers, who added the plugin from GitHub (README, For developers), then run in Terminal, one line at a time:

   ```
   claude plugin marketplace update ia-collaborative
   claude plugin update ia-design@ia-collaborative
   ```

   then start a new Claude Code session in each project and run `/ia-design:setup`.

### Tell people

Post one line where IA shares news:

> IA Collaborative [1.0.1] is live: [what changed]. Nothing to do in Claude. Code projects: update the plugin and run setup.

## If something goes wrong

- **A change looks wrong on the page.** Use the undo prompt.
- **The page is broken or lost.** In Claude Code, in the kit folder, run `/ia-design:create-page`. It rebuilds the page from the kit's last synced version. If the page holds a newer version than the kit, the command stops: fix the page with the undo prompt instead.
- **Claude Slides does not use IA's look.** Check that IA Collaborative is still the default design system, or name it in the request.
- **The gate refuses something in a code project.** Fix the code. If the system truly lacks a value the project needs, add it to the system with an update, never to the project.
- **Sync refuses.** It says why. Usually the page changed without a new version number: ask Claude to record the version on the page, then sync again.
- **The owner leaves.** The backup owner takes over and names a new backup.
