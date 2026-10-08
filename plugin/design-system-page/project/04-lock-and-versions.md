# Lock and versions

## IA Collaborative 1.0.0

Locked by Substrate on **8 October 2026, 04:21 UTC** (8 October, 00:21 in New York).

| What | Value |
| --- | --- |
| Version | 1.0.0 |
| Tokens fingerprint | `bd2a44dc5c41157f38ee722835326830e60efda8240e37b79c4545d0786bfa59` |
| Lock file (sha256) | `abb20b86f325bddbc4ef593ae7812350e86ae4c5a88dc62866762867fc9b1a3d` |
| Brand files fingerprint | `56b0cd8464902a54a16652dac85349c5da57480c030a8adf99c78c44b3bac3d5` (16 files) |
| Values taken exactly from IA | 55 |
| Values derived by rule from IA's | 273 |
| Values from a library default | 0 |
| Values read but not held (see What was dropped) | 4 |

Where each fingerprint appears:

- **This page**: `tokens.json` carries the tokens fingerprint and the lock time under `meta`.
- **DESIGN.md** carries the tokens fingerprint.
- **The style guide PDF** prints the first 16 characters of the lock file's sha256 (`abb20b86f325bddb`).
- **The code skill** (`substrate.lock.json`) carries all three. Its `SKILL.md` header shows a short "fingerprint" (`1314c1ee12d4fd10`) that is one internal file's hash, not the lock's; read the lock file for the real values.
- **The DTCG and shadcn files** carry the version, 1.0.0.

## How it got here

| Version | What changed |
| --- | --- |
| 0.9.0 | The first build from the reading of IA's site, with every misread value corrected from IA's own pages and stylesheet. |
| 0.9.1 | IA's heading ladder (60 / 48 / 36 / 30), measured across nine pages. |
| 0.9.2 | Heading tracking loosened for the Libre Franklin stand-in. |
| 1.0.0 | The design pass: IA's brief, the motifs, the brand files; the dark theme corrected by hand; then corrected against IA's site over four rounds of sample review: the typed asterisk, no eyebrows, the closing button, the framework table, bold steps at 600, IA's seven photographs, the one-pager layout. |

The pre-release versions were working builds and were never shared. 1.0.0 was packaged several times before release while defects were fixed; only the lock above is delivered.

## Changing the system

A change is a new version. Adjust the value, re-lock, and the version number moves (1.0.1 for a correction, 1.1.0 for an addition). Everything built from the tokens takes the change on its next build: the code skill by reinstalling it, this page by republishing its tokens, Claude decks and designs the next time they are made from it. Pieces already made keep the version they were made with; the version number on each says which.
