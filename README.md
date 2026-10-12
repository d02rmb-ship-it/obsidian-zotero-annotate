# Zotero → ZotLit → Obsidian: Reproducible Research Workflow

*A detailed implementation and GitHub publishing guide, based on a tested Obsidian Research Vault (October 2026).*

> **Status legend:** **Tested** means confirmed in the original research vault; **Documented** means supported by official documentation but not necessarily tested across every installation; **Experimental** means a possible extension, not part of the validated core workflow.
>
> **Scope:** This repository demonstrates the workflow. It must not contain an actual researcher's private vault, purchased PDFs, confidential notes, or unpublished research unless publication rights and privacy have been checked.

**Tested with:** ZotLit 2.1.4. Other versions of ZotLit, Obsidian, Dataview and Zotero may behave differently; see the version caution in section 3.

## 1. Purpose and design philosophy

Build a durable, personal academic knowledge base that supports multiple research projects. Its purpose is not simply to store PDF highlights: it should help researchers identify research gaps, compare evidence, develop concepts, and formulate arguments with traceable sources.

- **Zotero:** authoritative bibliographic records, PDFs, original annotations, comments, collection membership, and citation management.
- **ZotLit:** imports Zotero information into editable Markdown source notes in Obsidian.
- **Obsidian:** connected knowledge notes, project dashboards, evidence retrieval, and original interpretation.
- **DataviewJS:** reusable, dynamically computed views over Obsidian source notes.

**One annotation, multiple views:** A Zotero highlight appears in an individual paper note and in relevant project research-evidence categories. Researcher-written topic and argument notes should be distinct from imported evidence.

### Three intellectual layers

1. **Source notes:** What the paper actually says, with original passages, page links and annotation comments.
2. **Topic notes:** Verified claims about concepts, mechanisms and theories, written concisely in the researcher's words and linked to sources. These are meant to endure beyond a single project.
3. **Argument notes:** Original hypotheses, theoretical extensions, doubts, alternative explanations and questions, explicitly marked as interpretation rather than as established findings.

**Project notes** are additional working views over selected sources and shared knowledge, not independent duplications of every paper.

## 2. What has actually been demonstrated

| Feature | Status | Notes |
|---|---|---|
| Single-paper ZotLit notes | **Tested** | Created successfully, with source metadata and the `%%zt-managed%%` region. |
| PDF and bibliographic Zotero links | **Tested** | A fresh note's PDF backlink opened the PDF; its Zotero Record link selected the bibliographic item. |
| Seven annotation categories | **Tested** | Source-note Liquid template organizes highlights by category. |
| Multiple tags on one annotation | **Tested** | Same passage appears in multiple appropriate source-note categories. |
| Shared project aggregation | **Tested** | `research-evidence.js` collects annotations from source notes matching collection metadata. |
| Duplicate prevention | **Tested** | Multi-tagged annotation appears only once within each project category. |
| Unclassified annotations | **Tested** | Hillman and Moses examples appeared in Unclassified after the script update. |
| Deleting Obsidian source note | **Tested** | Corresponding evidence disappeared from the project view without manual deletion there. |
| Import a particular Zotero collection | **Documented** | Zotero collection right-click → ZotLit → Create or Update Literature Notes. |
| Dynamic topic-specific evidence | **Experimental** | Separate script drafted; not established as successful in the user's vault. |
| Automatically delete Obsidian notes when leaving all tracked Zotero collections | **Not implemented** | ZotLit is not a verified two-way, deletion-aware collection reconciler. |
| Automatic verification of manually written claims after source removal | **Not implemented** | Manual prose can still contain stale citations. |
| Obsidian Bases inventory, local AI/RAG | **Planned** | Not required for core setup. |

**Important:** Zotero's current collection membership and the `collections` value cached inside an Obsidian source note are not necessarily the same. Current project filtering relies on the latter until a separate reconciliation process is built.

## 3. Requirements and installation

### Required applications

1. Install [Zotero](https://www.zotero.org/), configure Zotero account/library sync and, if needed, attachment-file sync.
2. Install [Obsidian](https://obsidian.md/), create a vault, and optionally configure Obsidian Sync for multiple computers.
3. In Obsidian, install and enable [ZotLit](https://github.com/aidenlx/zotlit). The workflow was developed using **ZotLit 2.1.4**; consult its documentation for later changes.
4. Install **ZotLit Companion** in Zotero according to [official instructions](https://zotlit.aidenlx.site/docs/install-companion). The Companion is needed for collection-scoped bulk operations and live-update functionality.
5. In Obsidian Community plugins, install and enable **Dataview**. Enable **JavaScript queries** in Dataview settings for the custom views in this repository.

### Useful but optional

- **Templater:** consistent topic, project, argument and log templates.
- **Editing Toolbar:** convenient Markdown formatting for beginners.
- **Obsidian Sync:** synchronized vault across devices; independent backups still required.
- **Bases (Obsidian core plugin):** later inventory and reading-status views, not paragraph extraction.
- **Compact CSS** or a readable theme: optional display preference; does not affect research logic.
- **Better BibTeX:** recommended by ZotLit for citation workflows, but optional for the evidence-aggregation process described here.

**Version caution:** ZotLit v2 differs significantly from v1. Check the [migration guide](https://zotlit.aidenlx.site/docs/how-to/migrate-from-v1) before moving from v1 or reusing templates from an older installation.

## 4. Recommended vault structure

Create these folders (folder numbers are illustrative; use the same paths in all script references):

```text
Research Vault/
├── 00 Dashboard/
│   └── Scripts/
│       ├── research-evidence.js
│       └── topic-evidence.js                # optional, experimental
├── 01 Sources/                         # one ZotLit literature note per active Zotero item
├── 02 Topics/                          # shared concepts and theories
├── 03 Arguments/                       # original arguments, questions and explanations
├── 04 Projects/                        # project-specific dashboards
├── 05 Research Logs/                   # decisions, sessions, next actions
└── 07 Templates/                       # custom note templates
```

Do **not** mirror every Zotero collection as an Obsidian folder. The same paper may be used in more than one project; the item key and collection metadata identify it and its memberships.

## 5. Zotero organization and tagging conventions

Example Zotero hierarchy:

```text
My Library
└── Coursework
    └── COURSE101
        └── Example Project
            └── Literature
```

Use exactly these **seven research-purpose tags** for highlights (case differences are tolerated by the shared script):

| Tag | Intended use |
|---|---|
| Background | Context and motivation |
| Literature Review | Prior findings and established scholarship |
| Theory | Theoretical mechanisms, assumptions, definitions |
| Gap | Open questions and limitations in existing research |
| Method | Study design, sample, variables, analysis |
| Findings | Results supported by the paper |
| Contribution | Claimed or demonstrated theoretical/practical contribution |

An annotation may have multiple relevant category tags (e.g., `Theory` plus `Gap`). If it has **no recognized category**, including no tags, a typo such as `Theorry`, or an unrelated label, it should appear in **Unclassified**. No separate topic-tag taxonomy is required for the tested core workflow. Topic tags can be explored later if their added maintenance is justified.

When highlighting, add a brief comment only if it helps future interpretation. Distinguish a result the paper demonstrates from a secondary citation that merely mentions someone else's result.

## 6. Configure ZotLit and source-note output

### 6.1 Database and destinations

1. In Obsidian → Settings → ZotLit, confirm the Zotero profile and data directory are correct for **that computer**.
2. Set the destination for literature notes to **`01 Sources`**.
3. Enable/confirm database watching as appropriate; use **ZotLit: Refresh Zotero database** when recent changes do not appear.
4. Ensure ZotLit Companion is installed in Zotero and able to communicate with Obsidian.
5. Use the **Template Data Explorer** to inspect actual `zt` fields for a selected paper, particularly `attachments`, `contentType`, `backlink` and `key`.

On different computers, Zotero may store PDFs at different absolute paths. **Do not require identical Windows and Mac filesystem paths.** Use `zotero://` deep links instead of `file:///C:/Users/...` links.

### 6.2 Source note template: `templates/zotlit-note.liquid.md`

The latest design uses `attachment.backlink` for each PDF attachment and `zt.backlink` for the parent bibliographic item. That is different from the earlier `fileLink` design that produced machine-specific `file://` paths.

```liquid
# {{ zt.title }}
**{{ zt.authorsShort }} ({{ zt.date.year }})** | {% for attachment in zt.attachments %}{% if attachment.contentType == "application/pdf" %}[Open PDF]({{ attachment.backlink }}) | {% endif %}{% endfor %}[Zotero Record]({{ zt.backlink }})
## Paper Overview
**Key Contribution:**
**Relevance to My Research:**
**My Observations and Questions:**
{% render "content" with zt as zt %}
```

- `Open PDF` uses the attachment's Zotero backlink and opens the reader; it was confirmed with a newly generated note.
- `Zotero Record` selects the bibliographic item. It does **not** open the project's collection or necessarily launch the PDF.
- The template loops over PDFs, rather than assuming the first attachment is a PDF. A paper with more than one PDF will produce more than one `Open PDF` label; customizing the labels is an optional improvement.
- The `Paper Overview` section is written by the researcher.
- The included file is the **later reconstructed/tested design**. An earlier uploaded version of `zotlit-note.liquid.md` still contained only `[Open in Zotero]({{ zt.backlink }})`.

**Installation:** In ZotLit settings → Templates, use the supported custom note-template editor and paste the text from `templates/zotlit-note.liquid.md`. The template file inside this repository is a shareable example, not an automatically installed Obsidian configuration file.

### 6.3 Annotation template: `templates/zotlit-annotation.liquid.md`

This is the inspected working Liquid annotation template. It creates an Obsidian note callout with a Zotero page/annotation link, selected text or image, category tags, and optional researcher comment.

```liquid
{% bq %}
[!note] [Page {{ zt.pageLabel }}]({{ zt.backlink }})
{{ zt.imgLink | embed }}{{ zt.text }}
{% if zt.tags and zt.tags.size > 0 %}
**Category:** {% for tag in zt.tags %}{{ tag.name }}{% unless forloop.last %}, {% endunless %}{% endfor %}
{% endif %}
{% if zt.comment %}
**My comment:** {{ zt.comment }}
{% endif %}
{% endbq %}
```

**Compatibility constraint:** The project JavaScript parser expects the generated Markdown to contain a callout line resembling `> [!note]`, a `[Page ...](zotero:...)` link, and a `**Category:**` line when tagged. Changing those output conventions requires revisiting the parser and retesting.

### 6.4 Content template: `templates/zotlit-content.liquid.md`

This is the inspected working content template. It:

1. Renders any Zotero child notes.
2. Defines the seven categories.
3. Renders annotations separately under each matching category.
4. Renders those without any recognized category under `Unclassified`.
5. Reuses the annotation template via `{% render "annotation" with annotation as zt %}`.

An annotation with `Theory` and `Gap` intentionally appears in **both** source-note sections. The shared project script therefore performs category-local deduplication. See the complete file in `templates/` rather than pasting a second copy into this README.

### 6.5 Managed content and frontmatter

A generated note resembles:

```yaml
---
title: Example paper title
collections:
  - Coursework/COURSE101/Example Project/Literature
citekey: exampleCitationKey2025
citation: Example et al. (2025)
zotero-key: ABCD1234
---
```

Below the generated heading and Paper Overview, ZotLit adds a managed-content region marked by `%%zt-managed%%` and `%%/zt-managed%%`. Updating the note can regenerate content inside this region while preserving researcher-written text outside. **Ordinary updates may not regenerate the original heading or PDF navigation links.** To change those for old test notes, recreate them safely, or manually edit their header. Do not indiscriminately overwrite source notes with unique researcher-written observations.

`zotero-key` is the **bibliographic item identifier** used by ZotLit to find the note. An annotation deep link or PDF attachment uses other keys; these are **not interchangeable**.

Set `collections` frontmatter merge behaviour to **Replace** where supported and tested, instead of accumulating stale membership through an append strategy. Even then, full automatic collection removal/deletion reconciliation is not part of this documented implementation.

## 7. Import an entire Zotero subcollection

**Official, collection-scoped method:**

1. In **Zotero**, locate the desired subcollection, e.g. `Coursework → COURSE101 → Example Project → Literature`.
2. Right-click that **collection**, not `My Library`.
3. Choose **ZotLit → Create or Update Literature Notes**.
4. In Obsidian, review the batch confirmation showing new and existing notes.
5. Confirm. New notes are saved in the configured `01 Sources` destination.
6. Open one new source note and verify its parent Zotero link, direct PDF link, annotation categories, comments and collection metadata.

This is [documented by ZotLit](https://zotlit.aidenlx.site/docs/how-to/create-and-open-notes); nested subcollections are included. **Do not** use the Obsidian command `Create or update all literature notes` as a substitute when only one project collection should be imported; that command has a broader scope.

## 8. Dynamic project dashboard

Copy `scripts/research-evidence.js` into:

`Research Vault/00 Dashboard/Scripts/research-evidence.js`

In `04 Projects/Example Project.md`, use:

````markdown
## Research Evidence
```dataviewjs
await dv.view("00 Dashboard/Scripts/research-evidence", {
  collection: "Coursework/COURSE101/Example Project/Literature"
});
```
````

**Required:** Dataview with JavaScript queries enabled. The path in `dv.view` is relative to the vault root and omits `.js`.

### How the script works

1. Scans Markdown notes in `01 Sources`.
2. Selects notes whose YAML `collections` array includes the provided project collection path.
3. Loads note text through DataviewJS and parses ZotLit's annotation callout blocks.
4. Uses `Category:` values to route evidence to the seven headings, or to **Unclassified** if no recognized tag exists.
5. Deduplicates repeated renditions of the same annotation **within each category**, while allowing it to appear in two different categories.
6. Displays author-year, page deep link, and highlighted passage, sorted by author-year.

This was tested by assigning one Abbasi annotation both `Theory` and `Gap`. It displayed **once in each category**, instead of twice in each. Later, unclassified Hillman and Moses annotations appeared under the Unclassified heading as designed.

### Other projects

Reuse the **same script** and change only the `collection` string. Do not copy hundreds of lines of code into each project note.

### Important limitations

- The script reads cached `collections` YAML; **it does not query live Zotero collection membership**.
- It relies on the documented/tested annotation-callout formatting. A change to the Liquid templates may require a parser update.
- Some non-text or image-only annotations may not be represented as intended; test before relying on them.
- It is designed for this template's output, not arbitrary Markdown or other Zotero-to-Obsidian plugins.

## 9. Source removal: what happens and what does not

**Tested:** Delete a note from Obsidian `01 Sources`; the project dashboard automatically ceases showing its annotations, because the dashboard is computed from the existing source notes. The Zotero original is not deleted.

**Not implemented:** Removing a paper from a Zotero collection does not automatically delete its existing Obsidian source note, and stale YAML can leave evidence in the project view. Similarly, a `zotero://` link that merely launches Zotero does **not** prove the referenced bibliographic record still exists; links to trashed items may appear superficially successful.

**Target multi-project rule, still a design proposal:**

| Zotero action | Desired Obsidian result |
|---|---|
| Add to a tracked Literature collection | Create source note if absent (presently via ZotLit bulk import) |
| Remove from Project A, retain in Project B | Keep shared note; hide from A after membership refresh |
| Remove from the last tracked Literature collection | Delete Obsidian source note automatically |
| Trashed record | Exclude from active views and remove its source note |

A future reconciliation process must use stable Zotero **item keys and collection keys**, successfully read **all tracked collections**, and refuse to delete on connection errors, partial results or stale data. Start with a read-only preview, maintain backup and audit log, and avoid competing deletion processes on multiple synced computers. This is **future work**, not code included in this repository.

**Research integrity:** Even after a source note is removed, manually written quotations, linked claims or arguments elsewhere in the vault remain until reviewed. Dynamic evidence does not automatically invalidate or remove manually copied prose. Broken link and claim-provenance checks remain desirable future work.

## 10. Topics, arguments and project-independent knowledge

### Topics (`02 Topics`)

Make enduring, concept-centred notes such as `Resource Dependence Theory`, `Human Capital` and `Institutional Theory`. Include:

- a concise core idea;
- related concepts with `[[wikilinks]]`;
- **short claims grounded in verified source evidence** (the researcher’s wording, not long pasted highlights);
- supporting passage/page links;
- link(s) to related arguments.

Avoid permanently copying long annotations into these notes if the goal is to remove evidence when a source note disappears. Copied text persists even after its source is deleted. A dynamic evidence section can support the topic note, but should **not replace conceptual synthesis**.

### Topic evidence script (experimental)

An earlier `topic-evidence.js` was drafted and is preserved as `scripts/topic-evidence-EXPERIMENTAL.js`. It requires **two annotation tags**: the general category `Theory` and an exact theory-topic tag such as `Resource Dependence Theory`. The researcher subsequently decided to use **only the seven research-purpose tags as the default**. Consequently this script is **not part of the recommended core configuration**; it has not been validated against the finalized tagging practice. Do not present it as working production automation. Reconsider topic retrieval later through explicit note links/properties, or a deliberate second tag convention if desired.

### Arguments (`03 Arguments`)

Keep provisional mechanisms and research interpretations in separate notes, e.g. `Board Sustainability Expertise as a Resource`. Use links such as:

```markdown
**Related theory:** [[Resource Dependence Theory]]
**Project:** [[Example Project]]
```

In a Resource Dependence Theory note, the **Backlinks** pane can show which argument notes refer to it automatically—no reverse link is necessary. Topic notes should outlive individual projects; arguments should remain explicitly provisional until assessed.

## 11. Obsidian features worth learning

| Feature | Why use it | Example |
|---|---|---|
| `[[internal links]]` | Connect ideas | `[[Resource Dependence Theory]]` |
| Backlinks | Discover references to a note | Find arguments mentioning Resource Dependence Theory |
| `[[Note#Heading]]` | Navigate to an exact section | `[[Resource Dependence Theory#Key Concepts]]` |
| `![[Note#Heading]]` | Embed content without a static copy | Show a definition within another note |
| Properties / YAML | Filter structured metadata | `type: topic`, `status: developing` |
| Tags | Organize workflow, sparingly | `#to-review` in an Obsidian note (distinct from Zotero annotation tags) |
| Search | Find exact phrases and terms | `human capital` across vault |
| Callouts | Mark uncertainty or optional detail | `> [!warning] Verify original claim` |
| Templates | Avoid rebuilding note structures | Compact Topic/Argument/Project/Log templates |
| Bases | Filter and edit **note-level** properties | One row per paper note; reading-status list |
| DataviewJS | Aggregate passage-level evidence | This repository’s project view |
| Split panes / stacked tabs | Read and synthesize side by side | Zotero PDF beside a topic note |
| Page preview | Quick context without navigating | Hover a linked theory note |
| Research Logs | Resume work from decisions | `YYYY-MM-DD` notes with next action |

**Bases is not a replacement for Zotero**, nor for the passage-level DataviewJS parser. A later `Papers.base` can inventory paper notes, track reading status, and filter missing metadata; validate any added source-note properties against ZotLit refresh behaviour first.

## 12. Suggested daily research workflow

1. Open the relevant Zotero project Literature collection and choose one paper.
2. Read its PDF in Zotero; highlight only evidence relevant to research decisions.
3. Classify highlights using the seven category tags. Keep unclassified highlights visible for a later pass.
4. Add optional comments explaining significance or caution about secondary citations.
5. Run ZotLit refresh/update so new highlights appear in the individual source note.
6. Open the project note and review cross-paper evidence, including `Unclassified`.
7. Extract a **small number of meaningful, verifiable claims** into topic notes; add `[[links]]` to related concepts.
8. Write original theoretical inferences, alternatives or hypotheses in argument notes.
9. Record research decisions, unresolved issues and next action in a brief Research Log.
10. When drafting the manuscript, return to source PDFs and cite actual papers using Zotero, verifying page references.

Not every highlight merits a separate topic note. Prefer clarity and provenance over the number of notes or tags.

## 13. Common problems and how they were diagnosed

| Symptom | Cause or useful check | Resolution |
|---|---|---|
| PDF link contains `file:///C:/Users/other-name/...` | Template used `attachment.fileLink`; note created on another device | Use `attachment.backlink` with `contentType == "application/pdf"` in **new-note template**; regenerate expendable old test notes or edit only their headers |
| `[Open in Zotero]` selects record but does not open PDF | `zt.backlink` identifies bibliographic item | Add separate `Open PDF` using PDF attachment’s `backlink` |
| Existing note retains old links after template update | Header is outside ZotLit managed region | Update/regenerate only when safe; backup original analysis |
| `Failed to update literature note` | Inspect debug logs, e.g. `Zotero item not found: ABCD1234` | Confirm parent record is active and parent key matches YAML; attachment link opening alone is not proof |
| Item in Zotero Trash appears in project | Stale Obsidian source note and cached membership | Delete obsolete test note in `01 Sources`, or run a future integrity check |
| One Theory+Gap highlight appears twice under Theory | Source note renders one copy per category; original aggregator reprocessed both | Use current deduplicating `research-evidence.js` |
| Untagged highlights vanish from dashboard | Earlier aggregator skipped missing `Category:` | Use updated shared script with **Unclassified** |
| JavaScript shown literally | Code fence malformed or note in editing/live-preview mode | Use exact fenced `dataviewjs` block in **Reading View** and enable Dataview JS queries |
| File downloads unavailable from chat | Artifact transfer/client limitation | Paste text into a `.txt` file, then rename to `.js` (ensure Windows does not append `.txt`) |
| Annotations missing after changes in Zotero | Cached Zotero database | Refresh ZotLit database, then update literature note; check Companion |
| Annotation link launches Zotero but selects unrelated visible document | Referenced item may be gone; existing Zotero UI remains on prior document | Validate actual parent record and annotation, not merely application launch |
| A copied passage remains in Resource Dependence Theory after deleting its source | It was static text rather than dynamic evidence | Remove static duplicate; retain independently justified conceptual statements with valid citations |
| Import affects unexpectedly many notes | Used library-wide command | Use right-click on exact Zotero **collection** and inspect confirmation |

### Debugging ZotLit

In Settings → ZotLit → Maintenance, temporarily set logging to `debug` and enable writing logs to a file, reproduce the error, then inspect the **actual underlying error**. Return logging to normal afterward. Review logs for personal paths or private information before sharing them publicly.

## 14. Multiple computers, backups and privacy

- Use Zotero sync for its bibliographic records and Zotero’s configured file syncing for PDFs; use Obsidian Sync for the vault. These are **independent services**.
- Store Zotero PDFs under each computer's normal Zotero data directory. Cross-platform Zotero deep links avoid dependence on absolute Windows or macOS usernames.
- Check ZotLit configuration separately on each computer, including the local Zotero profile/data directory and Companion connectivity.
- Back up the research vault outside Obsidian Sync before bulk imports, overwrites and script upgrades. Sync is not a full backup strategy.
- Avoid publishing paid copyrighted article PDFs, unpublished manuscripts, detailed private annotations, credentials, tokens, personal file paths, workplace data, Zotero database backups, or real vault workspace/configuration files inadvertently.
- ZotLit is read-only toward the Zotero database; its local connectivity and database access should still be evaluated for privacy and workstation security.

## 15. Reproducibility checklist

Run this against a **small synthetic or redistributable sample**, not unpublished/private documents:

- [ ] Zotero item with PDF exists and ZotLit Companion is functioning.
- [ ] Source note is generated in `01 Sources` with `zotero-key`, `collections`, author-year and managed region.
- [ ] `Open PDF` opens the PDF in Zotero Reader; `Zotero Record` selects the parent item.
- [ ] Theory-tagged highlight appears once under Theory in its source note.
- [ ] A highlight tagged Theory + Gap appears under both headings in the source note.
- [ ] The same multi-category highlight appears **once per category** in the project dashboard.
- [ ] Untagged or misspelled-tag highlight appears under **Unclassified**.
- [ ] Comment and annotation page links remain attached to correct highlights.
- [ ] Deleting the test Obsidian source note removes its evidence from the dynamic project view.
- [ ] Reimporting the source note restores evidence without creating duplicates.
- [ ] A paper retained in a different project is not accidentally deleted during manual cleanup.
- [ ] New source-note metadata fields survive a ZotLit update before being introduced vault-wide.

## 16. Future roadmap (not part of this repository's tested scope)

1. **Source integrity:** reconcile current Zotero collection membership against Obsidian notes, preserve shared notes across projects, refuse unsafe deletions on partial/offline checks, and flag unsupported manual claims.
2. **Topic knowledge:** build concise, evidence-grounded concept notes linked to sources and each other; test a theory note before standardizing templates.
3. **Bases:** add a source inventory and optional reading-status dashboard.
4. **Research logs and review cadence:** adopt compact `YYYY-MM-DD` logs and periodic reviews of uncertain claims.
5. **Local AI pilot:** try LM Studio + local Qwen chat and a **separate** embedding model with the Local LLM Helper plugin; test semantic retrieval, citation fidelity, privacy, and stale indexes before wider adoption.
6. **PDF passage linking:** evaluate PDF++ only if Zotero's native annotation backlinks are insufficient; avoid parallel annotation repositories.

## 17. Publish this workflow as a GitHub repository

### 17.1 Public-repo safety review

**This repository is not the Research Vault.** Publish reusable examples, scripts and documentation; do not push live source notes, private project notes or PDFs by default. Before publishing, check all files for private names, usernames, local paths, secrets, research excerpts and materials restricted by copyright. Public Git commits can retain content in history even after later deletion.

### 17.2 Create a GitHub account and repository (browser method)

1. Sign in to [GitHub](https://github.com/) or create an account.
2. Click the **+** menu → **New repository**.
3. Suggested name: `zotero-zotlit-obsidian-research-workflow`.
4. Suggested description: `Reproducible academic research workflow for Zotero annotations, ZotLit literature notes, and Obsidian evidence dashboards.`
5. Choose **Private** for review/testing, and change to **Public** once the repository content has been checked. You can also create it Public directly when you are certain all material is publishable.
6. Initialize with a README if building the repository directly in GitHub. If uploading this prepared project, use the included `README.md` and avoid generating conflicting starter files where possible.
7. Click **Create repository**.

GitHub's [repository quickstart](https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories) documents these steps.

### 17.3 Recommended repository files

```text
zotero-zotlit-obsidian-research-workflow/
├── README.md
├── .gitignore
├── templates/
│   ├── zotlit-note.liquid.md
│   ├── zotlit-annotation.liquid.md
│   └── zotlit-content.liquid.md
├── scripts/
│   ├── research-evidence.js
│   └── topic-evidence-EXPERIMENTAL.js
└── examples/
    ├── project-note.md
    └── topic-note.md
```

The main `README.md` is the installation and handover guide. The `templates/`, `scripts/` and `examples/` files are intended for use by readers after adapting paths and settings.

### 17.4 Upload through GitHub's website

In the repository, select **Add file → Upload files** (or create files one by one), choose the prepared files and directory contents, review the list, and commit with a message such as `Add reproducible Zotero–Obsidian research workflow`. For a full directory tree, uploading using Git or GitHub Desktop may be easier.

### 17.5 Optional Git command-line method

From a local copy of the folder:

```bash
git init
git add .
git commit -m "Document Zotero-ZotLit-Obsidian research workflow"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zotero-zotlit-obsidian-research-workflow.git
git push -u origin main
```

Create an **empty remote repository** before using this method. Replace `YOUR_USERNAME`, and ensure Git is installed and GitHub authentication is configured. If a remote README or commit already exists, use GitHub Desktop or pull/reconcile histories rather than force-push.

### 17.6 Maintain and document changes

- Add a changelog or date-stamped README history when templates or script parsing assumptions change.
- State the actual ZotLit, Obsidian and Dataview versions used for each tested release.
- Keep a sample (non-copyrighted) annotation test case to demonstrate `Theory`, `Gap` and `Unclassified` behaviour.
- Use GitHub Issues to track bugs and proposed features, explicitly labelling **tested**, **experimental**, and **planned**.
- If other contributors are expected, add a `CONTRIBUTING.md` and clarify licensing before accepting contributions. Do not assume the upstream ZotLit license automatically licenses all user-authored scripts or third-party text.

## 18. Primary documentation and background

- [ZotLit v2 documentation](https://zotlit.aidenlx.site/docs)
- [ZotLit create/open/bulk operations](https://zotlit.aidenlx.site/docs/how-to/create-and-open-notes)
- [ZotLit GitHub project](https://github.com/aidenlx/zotlit)
- [ZotLit community](https://zotlit.aidenlx.site/community)
- [Zotero documentation](https://www.zotero.org/support/)
- [Obsidian Help](https://help.obsidian.md/)
- [Obsidian Bases](https://obsidian.md/help/bases)
- [Obsidian Properties](https://obsidian.md/help/properties)
- [Dataview documentation](https://blacksmithgu.github.io/obsidian-dataview/)
- [GitHub repository quickstart](https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories)
- [Steph Ango: How I use Obsidian](https://stephango.com/vault)

---

**Guiding principle:** Capture and classify evidence once in Zotero; present it reliably through ZotLit and DataviewJS; synthesize topics and arguments in durable linked Markdown notes; and distinguish tested workflows from future automation.
