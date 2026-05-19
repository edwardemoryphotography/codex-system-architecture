# Skill: ingest (Notion)

**Enrich the corpus** — do not funnel all knowledge into the KB database.

See `docs/CORPUS-POLICY.md`.

## Input

Wiki Compile Queue row, INBOX/Resources/Notes/Project page, or external URL.

## Steps

1. **Fetch** source with `notion-fetch`.
2. **Enrich in place** — `notion-update-page` `insert_content`: compiled summary + links to related pages (Projects, Topics, Codex).
3. **Relate** — update Project/Topic database rows or add mentions in body.
4. **Optional synthesis** — if durable and cross-cutting: create/update **Knowledge Base** row (`knowledge_base.data_source_id`) with Summary, Tags, link back to source URL.
5. Queue → Done; append **Wiki Log**.

## Do not

- Imply KB is the only knowledge store
- Delete originals
- Duplicate entire source body into KB unless human asks

## Verification

- [ ] Source (or project) page updated with summary/links
- [ ] Human told which pages were touched (source, projects, optional KB)
