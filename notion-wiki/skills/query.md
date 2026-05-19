# Skill: query (Notion)

Answer using **compiled wiki first**, then wider workspace search.

## Canonical index (always first)

**Knowledge Base → view "All Entries"** — `knowledge_base.url` in config.

Do not use a duplicate index on the LLM Wiki hub. Hub = router only. See `Index policy` in Notion or repo `docs/INDEX-POLICY.md`.

## Steps

1. Query/filter **Knowledge Base** (All Entries) for matching `Entry` / `Summary` / `Tags`.
2. `notion-fetch` the best 3–8 entry **pages** for body content.
3. `notion-search` — workspace (`query_type`: `internal`) for gaps.
4. Prioritize additional hits in:
   - Topics, Notes
   - Codex pages (Brain Dump Map, Command Center) for doctrine/shipping questions
5. Respond with:
   - **Answer** (short)
   - **Evidence** — bullet per page with title + URL
   - **Gaps** — what is missing from the wiki
6. If answer is durable, offer new **Knowledge Base** row (`Tags` includes `synthesis`) or update existing synthesis entry.

## Optional filters

- `page_url`: restrict to Second Brain subtree
- `data_source_url`: search only Knowledge Base collection

## Verification

- [ ] At least one Notion URL cited, or explicit “no coverage”
- [ ] Did not invent pages — only cited fetched/search results
