# Zotero → ZotLit → Obsidian: Reproducible Research Workflow

Turn Zotero highlights into traceable, project-level evidence dashboards in Obsidian. Highlight and tag a passage once in Zotero; ZotLit imports each paper as a Markdown source note; a DataviewJS view then gathers the highlights from every paper in a project, grouped by research purpose (Theory, Gap, Method and so on), with a link back to the exact page in the PDF.

**Who it is for:** researchers who use, or want to use, Zotero, Obsidian, ZotLit v2 and Dataview and want a documented, repeatable setup for literature reviews that span several projects.

> **Status legend:** **Tested** means confirmed in the author's research vault; **Documented** means supported by official documentation but not necessarily tested across every installation; **Experimental** means a possible extension, not part of the validated core workflow.
>
> **Scope:** This repository holds templates, documentation, scripts and anonymized examples only. It must not contain an actual researcher's private vault, purchased PDFs, confidential notes, or unpublished research unless publication rights and privacy have been checked. `.gitignore` cannot recognise private Markdown notes, so review every file before committing; see [CONTRIBUTING.md](CONTRIBUTING.md).

**Tested with:** Obsidian 1.14.4, ZotLit 2.1.4, Dataview 0.5.68 and Zotero 10.0.6 (64-bit, Windows). Other versions of ZotLit, Obsidian, Dataview and Zotero may behave differently; see the version caution in the [guide §2](docs/guide.md#2-requirements-and-installation).

## What you get

- **A tagging convention:** seven research-purpose tags (Background, Literature Review, Theory, Gap, Method, Findings, Contribution) plus an Unclassified bucket for anything untagged.
- **Three ZotLit templates** in [`templates/`](templates/): source note, annotation and managed content, with portable `zotero://` links to the PDF and the Zotero record.
- **A shared DataviewJS view,** [`scripts/research-evidence.js`](scripts/research-evidence.js): one script serves every project, and each annotation appears once per category.
- **Examples and tests:** sample project and topic notes in [`examples/`](examples/), and a regression test in [`tests/`](tests/) that catches template changes that would break the script.
- **A full guide** to vault structure, setup, daily use, backups and troubleshooting in [`docs/`](docs/).

## Quick start

The shortest path from a tagged Zotero highlight to a project evidence dashboard. Each "guide §" link goes to the matching section of the [implementation guide](docs/guide.md).

1. **Install the tools** ([guide §2](docs/guide.md#2-requirements-and-installation)): Zotero with the ZotLit Companion, and Obsidian with the ZotLit and Dataview plugins. In Dataview settings, enable JavaScript queries.
2. **Create two vault folders** ([guide §3](docs/guide.md#3-recommended-vault-structure)): `01 Sources` for imported notes and `00 Dashboard/Scripts` for the script.
3. **Install the ZotLit templates** ([guide §5](docs/guide.md#5-configure-zotlit-and-source-note-output)): In Obsidian, open Settings → ZotLit → Templates and set the Template folder (for example, `06 Templates/ZotLit`). Place the following files in that folder:
   - `zotlit-note.liquid.md` — Literature note template
   - `zotlit-annotation.liquid.md` — Individual annotation template
   - `zotlit-content.liquid.md` — Managed content template

   ZotLit recognizes templates following the `zotlit-<name>.liquid.md` naming convention. Verify that the Literature note, Annotation, and Content entries reference the expected files. Set the literature note destination to `01 Sources`.
4. **Add the script** ([guide §7](docs/guide.md#7-dynamic-project-dashboard)): copy `scripts/research-evidence.js` into `00 Dashboard/Scripts`.
5. **Tag highlights in Zotero** ([guide §4](docs/guide.md#4-zotero-organization-and-tagging-conventions)): use the seven category tags (Background, Literature Review, Theory, Gap, Method, Findings, Contribution). Untagged highlights appear under Unclassified.
6. **Import a collection** ([guide §6](docs/guide.md#6-import-an-entire-zotero-subcollection)): in Zotero, right-click the collection → ZotLit → Create or Update Literature Notes.
7. **Add the dashboard to a project note** ([guide §7](docs/guide.md#7-dynamic-project-dashboard)): paste the `dataviewjs` block from `examples/project-note.md`, set `collection` to your Zotero collection path, and view the note in Reading View.

Before relying on it, run the reproducibility checklist ([guide §13](docs/guide.md#13-reproducibility-checklist)) on a small sample.

## What has been demonstrated

| Feature | Status | Notes |
|---|---|---|
| Single-paper ZotLit notes | **Tested** | Created successfully, with source metadata and the `%%zt-managed%%` region. |
| PDF and bibliographic Zotero links | **Tested** | A fresh note's PDF backlink opened the PDF; its Zotero Record link selected the bibliographic item. |
| Seven annotation categories | **Tested** | Source-note Liquid template organizes highlights by category. |
| Multiple tags on one annotation | **Tested** | Same passage appears in multiple appropriate source-note categories. |
| Shared project aggregation | **Tested** | `research-evidence.js` collects annotations from source notes matching collection metadata. |
| Duplicate prevention | **Tested** | Multi-tagged annotation appears only once within each project category. |
| Unclassified annotations | **Tested** | Untagged highlights appeared in Unclassified after the script update. |
| Image-only annotations (figures, tables) | **Untested** | Behaviour is inferred from the script and template, not confirmed in a live vault; see the limitations in [guide §7](docs/guide.md#7-dynamic-project-dashboard). |
| Deleting Obsidian source note | **Tested** | Corresponding evidence disappeared from the project view without manual deletion there. |
| Import a particular Zotero collection | **Documented** | Zotero collection right-click → ZotLit → Create or Update Literature Notes. |
| Dynamic topic-specific evidence | **Experimental** | Separate script drafted; not established as working in the author's vault. |
| Automatically delete Obsidian notes when leaving all tracked Zotero collections | **Not implemented** | ZotLit is not a verified two-way, deletion-aware collection reconciler. |
| Automatic verification of manually written claims after source removal | **Not implemented** | Manual prose can still contain stale citations. |
| Obsidian Bases inventory, local AI/RAG | **Planned** | Not required for core setup. |

**Important:** Zotero's current collection membership and the `collections` value cached inside an Obsidian source note are not necessarily the same. Current project filtering relies on the latter until a separate reconciliation process is built.

## Known limitations

- **The dashboard reads cached collection metadata** from each source note, not live Zotero membership. Removing a paper from a Zotero collection does not remove its note or evidence automatically ([guide §8](docs/guide.md#8-source-removal-what-happens-and-what-does-not)).
- **The script depends on the annotation template's output format** (the `> [!note]` callout, the page link and the `**Category:**` line). Run `node tests/run-tests.js` after changing a template or the script ([guide §7](docs/guide.md#7-dynamic-project-dashboard)).
- **Image and table annotations are untested,** and annotations with a comment but no text or image are omitted.
- **The topic-evidence script is experimental** and is not part of the recommended setup.

## Documentation

| Page | What it covers |
|---|---|
| [Implementation guide](docs/guide.md) | Design, requirements, vault structure, ZotLit and template setup, the dashboard, topics and arguments, daily workflow, backups and privacy, reproducibility checklist, roadmap |
| [Troubleshooting](docs/troubleshooting.md) | Symptoms, causes and fixes; how to debug ZotLit |
| [Publishing your own copy](docs/publishing-your-own-copy.md) | Sharing an adapted version safely as a GitHub repository |
| [Contributing](CONTRIBUTING.md) | What belongs in the repository, pre-commit checks and the contributor testing checklist |
| [Tests](tests/README.md) | What the regression test covers and its limits |

## Repository contents

```text
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── .gitignore
├── docs/
│   ├── guide.md
│   ├── troubleshooting.md
│   └── publishing-your-own-copy.md
├── templates/
│   ├── zotlit-note.liquid.md
│   ├── zotlit-annotation.liquid.md
│   └── zotlit-content.liquid.md
├── scripts/
│   ├── research-evidence.js
│   └── topic-evidence-EXPERIMENTAL.js
├── examples/
│   ├── project-note.md
│   └── topic-note.md
└── tests/
    ├── README.md
    ├── run-tests.js
    ├── expected-output.md
    └── fixtures/vault/01 Sources/   # synthetic sample source notes
```

## Licence

Released under the [MIT Licence](LICENSE).

---

**Guiding principle:** Capture and classify evidence once in Zotero; present it reliably through ZotLit and DataviewJS; synthesize topics and arguments in durable linked Markdown notes; and distinguish tested workflows from future automation.
