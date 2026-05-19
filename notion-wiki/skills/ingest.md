# Skill: ingest (Notion)

Compile one raw item into **Knowledge Base** (+ related Topics/Notes if needed).

## Input

One of:

- Wiki Compile Queue row URL or name (`Status` = Inbox)
- Second Brain INBOX item URL
- Resources / Notes page URL
- External URL + title (create queue row first)

## Steps

1. **Fetch** source with `notion-fetch`.
2. **Search** Knowledge Base for similar `Entry` title — update if found, else create.
3. **Set queue** row `Status` → `Processing` (if using queue).
4. **Create/update Knowledge Base** row (`knowledge_base.data_source_id`):
   - `Entry`, `Summary`, `Source URL`, `Tags` (include wiki-type tag)
   - `Status`: `Draft`
   - Body: key claims, quotes, `[[mentions]]` to related Notion pages where possible
5. **Fan out** — update or create **Topics** rows for major concepts; link in KB body.
6. **Queue** → `Done`; set `Wiki Type` on queue row.
7. **Append Wiki Log** (`wiki_log.page_id`) via `notion-update-page` `insert_content` at end.

## Do not

- Delete or archive source pages unless human asks
- Create duplicate KB rows for the same source

## Verification

- [ ] KB row URL returned to human
- [ ] Log entry appended
- [ ] Queue status updated (if applicable)
