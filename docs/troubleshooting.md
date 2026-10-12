# Troubleshooting

Common problems and how they were diagnosed. Back to the [implementation guide](guide.md) or the [README](../README.md).

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
| Annotations missing after changes in Zotero | Cached Zotero database | Refresh ZotLit database, then update literature note; check Companion |
| Annotation link launches Zotero but selects unrelated visible document | Referenced item may be gone; existing Zotero UI remains on prior document | Validate actual parent record and annotation, not merely application launch |
| A copied passage remains in Resource Dependence Theory after deleting its source | It was static text rather than dynamic evidence | Remove static duplicate; retain independently justified conceptual statements with valid citations |
| Import affects unexpectedly many notes | Used library-wide command | Use right-click on exact Zotero **collection** and inspect confirmation |

## Debugging ZotLit

In Settings → ZotLit → Maintenance, temporarily set logging to `debug` and enable writing logs to a file, reproduce the error, then inspect the **actual underlying error**. Return logging to normal afterward. Review logs for personal paths or private information before sharing them publicly.
