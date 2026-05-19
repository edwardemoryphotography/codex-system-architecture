# Skill: ingest

Turn one raw source into updated wiki pages. **Never edit** the body of a raw file; you may move it after success.

## Inputs

- Path under `raw/inbox/` (required), or user points to a new file elsewhere under `raw/`

## Steps

1. **Read** the raw source end-to-end.
2. **Propose** 3–5 bullet takeaways to the human (skip if they said “just ingest”).
3. **Create/update** `wiki/sources/<slug>.md` with frontmatter `type: source`.
4. **Fan out** — for each person, idea, or tool that matters:
   - Create or update `wiki/entities/<slug>.md` or `wiki/concepts/<slug>.md`
   - Link back to the source page with `[[wiki/sources/slug]]` or relative `[[sources/slug]]` per vault convention
5. **Update** `wiki/index.md` — every touched page gets a one-line summary.
6. **Append** `wiki/log.md`:
   ```markdown
   ## [YYYY-MM-DD] ingest | <Source title>
   - Raw: `raw/...`
   - Pages touched: ...
   ```
7. **Move** raw file from `inbox/` to `raw/sources/<year>/<slug>/` (confirm path with human if unsure).

## Quality bar

- Cross-links beat long prose on the source page.
- Flag contradictions with existing wiki content inline: `> **Contradicts** [[other-page]]: ...`
- New entities/concepts can start as `status: stub` — but must exist if named twice.

## Verification

- [ ] `wiki/index.md` reflects all new/changed pages
- [ ] `wiki/log.md` has an ingest entry
- [ ] No edits under `raw/` except approved move
- [ ] Human told what to read first in Obsidian (1–3 links)
