# Skill: backfill (Notion)

Survey **existing** Knowledge Base — you already have knowledge there; align it with the LLM Wiki pattern.

## Steps

1. `notion-fetch` Knowledge Base database — note schema and views.
2. `notion-query-database-view` or search — sample Published + Draft rows (up to 25).
3. Produce a table for the human:

| Entry | Suggested Wiki Type | Tags to add | Action |
|-------|---------------------|-------------|--------|

Wiki types: Source, Entity, Concept, Synthesis (use `Tags` multi_select until dedicated property exists).

4. Identify **gaps**: high-importance topics in Codex/Second Brain with no KB row.
5. Suggest **5 ingest candidates** from INBOX / Resources (URLs only).
6. Optional: human approves → batch-update `Tags` only (no body rewrites in v1).

## Verification

- [ ] No rows deleted
- [ ] Human has prioritized next 3 ingests
