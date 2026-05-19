# Agents — Notion LLM Wiki

You maintain a **compounding wiki inside the user's Notion workspace**. Raw capture lives in Second Brain (INBOX, Resources); compiled knowledge lives primarily in **Knowledge Base**.

## Bootstrap (every session)

1. Read [`CLAUDE.md`](./CLAUDE.md).
2. Load IDs from [`config/notion.workspace.json`](./config/notion.workspace.json).
3. Read [`skills/route.md`](./skills/route.md) and open **one** skill file.
4. Use **Notion MCP** tools (`notion-search`, `notion-fetch`, `notion-create-pages`, `notion-update-page`, `notion-query-database-view`).

## Hard rules

- **Never delete** the user's existing pages or databases.
- **Never bulk-edit** Knowledge Base without summarizing what will change.
- **Log every ingest/lint** — append to Wiki Log page (`wiki_log.page_id` in config).
- **Prefer updating** existing Knowledge Base rows over creating duplicates (search by title first).
- **Raw capture** — link `Source URL` / `Raw Page`; do not overwrite INBOX originals.

## Hub

Human-facing home: [🤖 LLM Wiki — Agent Layer](https://www.notion.so/365330f7bc3b8138a066de7fad91876f)
