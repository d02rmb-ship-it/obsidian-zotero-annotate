# Contributing

This repository holds **templates, documentation, scripts and anonymized
examples** for a Zotero → ZotLit → Obsidian research workflow. It is not a
research vault.

## What belongs here

| Belongs | Does not belong |
|---|---|
| Liquid templates and DataviewJS scripts | Real literature notes, project notes or argument notes from a vault |
| Documentation and setup guidance | PDFs, Zotero database files or backups |
| Synthetic or anonymized example notes | Highlights or comments copied from real papers |
| Test fixtures with invented text | Vault configuration (`.obsidian/` workspace or plugin data) |
| | Usernames, local file paths, tokens, keys or workplace data |

`.gitignore` blocks some risky file types (PDFs, SQLite files, environment
files, workspace files), but it **cannot recognise private Markdown notes**. Git
will track any `.md` file you add, and a public commit stays in the history even
after you delete the file. Review every file deliberately before you commit.

## Before you commit

- [ ] Run `git status` and read the full list of files you are adding.
- [ ] Every example and fixture uses invented or anonymized text. No quotations from real papers beyond what copyright allows.
- [ ] Search your changes for your name, username, email address, institution and local paths (for example `C:\Users\` or `/Users/`).
- [ ] No PDFs, database files, credentials, tokens or vault configuration files.
- [ ] No `file:///` links. PDF links use Zotero backlinks (`zotero://open-pdf/...`) so they work on any computer.

## Test your change

### Automated: every change

```bash
node tests/run-tests.js
```

Requires Node.js 18 or later. If you change a template or the script, the test
must still pass, or the expected output in `tests/expected-output.md` must be
updated deliberately and explained in your pull request. See `tests/README.md`.

### Manual: template or script changes

Run these on a **small synthetic or redistributable sample** in your own
Obsidian vault (the [reproducibility checklist](docs/guide.md#13-reproducibility-checklist) in the guide has the full list).

| # | Check | Expected result |
|---|---|---|
| 1 | Highlight tagged with one category (for example `Theory`) | Appears once under that heading in the source note and once under that category in the project dashboard |
| 2 | Highlight tagged with two categories (for example `Theory` + `Gap`) | Appears under both headings in the source note, and **once in each** category in the dashboard |
| 3 | Highlight with no tag, a misspelled tag (`Theorry`) or an unrelated tag | Appears under **Unclassified** in the dashboard |
| 4 | Researcher comment on a highlight | Shown in the source note; not copied into the dashboard text |
| 5 | Delete the test source note in `01 Sources` | Its evidence disappears from the dashboard; the Zotero item is untouched |
| 6 | Re-import the collection (right-click → ZotLit → Create or Update Literature Notes) | The evidence returns without duplicates |
| 7 | `Open PDF` link in the source note header | Opens the PDF in Zotero; the link starts with `zotero://` and contains no `file:///` path |
| 8 | `Zotero Record` link | Selects the parent item in Zotero |
| 9 | Open the same note on a second computer, if you have one | PDF links still work without editing |

Checks 1 to 3 and the link rule in check 7 are also covered by the automated
test. The rest need a live Zotero and Obsidian setup.

### Known untested areas

Image-only annotations (figures, tables) have not been validated against a live
ZotLit export, and annotations that have a comment but no text or image are
omitted from the dashboard. If you test either, please report what you see.

## Reporting results

In an issue or pull request, state the versions you used (Obsidian, ZotLit,
Dataview, Zotero) and label what you tested as **tested**, **experimental** or
**planned**, as the main README does.
