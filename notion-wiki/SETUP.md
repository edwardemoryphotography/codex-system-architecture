# Setup — new workspace or fork

Your live workspace is already configured in `config/notion.workspace.json`. Use this only to rebuild elsewhere.

## Option A — Use existing hub (recommended)

1. Open [LLM Wiki hub](https://www.notion.so/365330f7bc3b8138a066de7fad91876f) under Second Brain.
2. Connect Notion MCP in your agent.
3. Run: *Follow `notion-wiki/skills/backfill.md`*.

## Option B — New hub in another Notion workspace

1. Pick a parent page (e.g. your Second Brain equivalent).
2. Agent creates:
   - Hub page
   - Wiki Log child page
   - Wiki Compile Queue database
3. Copy new IDs into `config/notion.workspace.json`.
4. Map your existing KB database ID to `knowledge_base`.

## Manual ID discovery

```text
notion-fetch <paste Notion URL>
```

Copy `database_id`, `data_source_id` / `collection://…` from the response into JSON.

## Link hub to Knowledge Base

On the hub page, add a linked database view of 🧠 Knowledge Base (Notion UI: `/linked` → select database).
