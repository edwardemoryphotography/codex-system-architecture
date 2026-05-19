# Skill: query (Notion)

Answer using **compiled wiki first**, then wider workspace search.

## Steps

1. `notion-search` — query across workspace (`query_type`: `internal`).
2. Prioritize hits in:
   - Knowledge Base database
   - Topics, Notes
   - Codex pages (Brain Dump Map, Command Center) for doctrine/shipping questions
3. `notion-fetch` top 3–8 pages.
4. Respond with:
   - **Answer** (short)
   - **Evidence** — bullet per page with title + URL
   - **Gaps** — what is missing from the wiki
5. If answer is durable, offer new **Knowledge Base** row (`Tags` includes `synthesis`) or update existing synthesis entry.

## Optional filters

- `page_url`: restrict to Second Brain subtree
- `data_source_url`: search only Knowledge Base collection

## Verification

- [ ] At least one Notion URL cited, or explicit “no coverage”
- [ ] Did not invent pages — only cited fetched/search results
