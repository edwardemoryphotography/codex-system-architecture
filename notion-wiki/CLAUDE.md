# Notion wiki — maintainer schema

## Config

All UUIDs: [`config/notion.workspace.json`](./config/notion.workspace.json).

## Notion databases (this workspace)

### Wiki Compile Queue

- **data_source_id:** `wiki_compile_queue.data_source_id`
- **Use:** Agent intake queue — what to compile next
- **Properties:** `Name` (title), `Status` (Inbox | Processing | Done | Skipped), `Wiki Type` (Source | Entity | Concept | Synthesis), `Source URL`, `Raw Page`

### Knowledge Base (compiled wiki)

- **data_source_id:** `knowledge_base.data_source_id`
- **Use:** Primary compiled entries — summaries, status, verification
- **Key properties:** `Entry` (title), `Summary`, `Status`, `Tags`, `Source URL`, `Importance`, `Notes`, `Last Verified`, `Next Review`

When creating from ingest:

- `Status`: start as `Draft` → `Published` when human approves
- `Summary`: 1–3 sentences
- `Tags`: use for Wiki Type hint (`source`, `entity`, `concept`, `synthesis`) until a dedicated property is added
- Page **body**: detailed notes, bullet claims, links to other Notion pages using Notion markdown mention syntax per MCP docs

### Second Brain (capture)

| Database | Role |
|----------|------|
| INBOX | Unprocessed captures — ingest source |
| Resources | Reference material |
| Topics | Concept-like index |
| Notes | Working notes |

Do not restructure these databases without explicit human approval.

### Codex pages (context, usually read-only)

- Brain Dump Map, Command Center, Legacy Codex — doctrine and shipping context
- Use `notion-search` with `page_url` on Command Center when questions are about “what to ship”

## Workflows (see skills/)

| Skill | Outcome |
|-------|---------|
| `ingest.md` | Queue → Knowledge Base (+ Topics/entities as needed) → log |
| `query.md` | Search + fetch → answer with Notion URLs |
| `lint.md` | Health report on KB + orphans |
| `backfill.md` | Map existing KB rows to wiki types / gaps |

## Wiki Log page

Append markdown sections via `notion-update-page` `insert_content` at end:

```markdown
## [YYYY-MM-DD] ingest | Title
- Queue: ...
- KB entries: ...
```

## MCP tool cheat sheet

| Task | Tool |
|------|------|
| Find pages | `notion-search` query_type `internal` |
| Read page/DB schema | `notion-fetch` with page or database URL |
| New KB row | `notion-create-pages` parent `data_source_id` = knowledge_base |
| Update row | `notion-update-page` `update_properties` + `update_content` |
| Filter queue | `notion-query-database-view` on compile queue view URL (after fetch DB) |

## Agent behavior

Same discipline as repo root `CLAUDE.md` when present: surgical changes, verifiable steps, ask when ambiguous.
