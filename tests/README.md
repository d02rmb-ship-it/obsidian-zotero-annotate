# Parser regression tests

`scripts/research-evidence.js` reads the Markdown that your ZotLit annotation
template produces. It depends on three conventions:

```text
> [!note] [Page 3](zotero:...)      <- callout line with a Zotero page link
> Highlighted text...
> **Category:** Theory, Gap         <- optional category line
```

If you edit `templates/zotlit-annotation.liquid.md` or the content template, run
this test to check that the script still extracts the same evidence.

## Run it

Requires Node.js 18 or later. No installation or packages are needed.

```bash
node tests/run-tests.js
```

The runner feeds the real script a small stand-in for the Dataview API, so it
tests the script's own parsing, filtering, categorising and de-duplication.

## What is covered

| Behaviour | Fixture example |
|---|---|
| Annotation with two tags appears once in each category | `ANNOT001` (Theory + Gap), `ANNOT005` (Background + Literature Review) |
| The same annotation rendered under several headings is not duplicated | each multi-tag annotation appears twice in its source note |
| Category tags are case-insensitive | `findings` |
| No tag, or an unrecognised or misspelled tag, goes to Unclassified | `ANNOT003`, `Theorry` |
| Researcher comments are kept out of the evidence text | `**My comment:**` lines |
| Callouts without a Zotero page link are skipped | `> [!warning] ...` |
| Highlights spanning several lines are kept together | `ANNOT002` |
| Image annotation: kept as its embed text (`![[...]]`), `ANNOT008` | Documents current behaviour; the embed format is assumed |
| Comment-only annotation (no text, no image) is omitted, `ANNOT009` | Documents current behaviour |
| Notes from other collections are excluded | `Other et al 2023.md` |
| Missing or unknown collection settings fail gracefully | empty-state messages |

## Files

- `fixtures/vault/01 Sources/` — four **synthetic** source notes. All text is
  invented; none comes from a real paper or from a real Zotero library.
- `expected-output.md` — the exact output the script should produce for the
  collection `Coursework/COURSE101/Example Project/Literature`.
- `run-tests.js` — the test runner.

## Limits

- The fixtures are written to match the template output as documented in the
  main README. They are not captured from a live ZotLit export. If you change
  the templates, regenerate one real note, copy its annotation blocks into the
  fixtures and update `expected-output.md` by hand.
- **Image annotations are not validated.** The image fixture uses an assumed
  embed line (`![[synthetic-figure.png]]`). Capture a real image annotation from
  your own ZotLit export and replace the fixture before relying on figures or
  tables.
- The test checks the script's logic, not how Dataview renders the result
  inside Obsidian. Check that part visually using the reproducibility
  checklist in section 15 of the main README.
