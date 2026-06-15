# Sync Notion inventory when `notion-wiki/` changes

**Canonical Notion page:** [notion-wiki — full inventory](https://www.notion.so/365330f7bc3b819aada3eebd29226ecd) (under LLM Wiki hub).

When you add/rename skills or change `notion.workspace.json`:

1. Update the Notion **full inventory** page (file tree + summaries + UUIDs).
2. Bump "Last synced" date on that page.
3. Optionally update Note: **notion-wiki agent layer — living inventory** on the project row.

Notion AI cannot read the GitHub repo — if the inventory page is stale, gap #6 returns.
