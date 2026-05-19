# Skill: query (Notion)

Answer from the **whole workspace corpus**, not only the 🧠 Knowledge Base database.

See `docs/CORPUS-POLICY.md`.

## Search order

1. `notion-search` — full workspace (`query_type`: `internal`).
2. **Corpus map zones** — Second Brain, Projects, Tasks, Topics, Notes, Resources, Codex pages (config IDs in `notion.workspace.json`).
3. **Active projects** — bias toward rows on Corpus map (Notion page).
4. **Knowledge Base** — synthesis shortcut only; `notion-fetch` if a row likely answers the question.
5. Open best 3–8 **pages** (any zone) for body content.

## Respond with

- Short answer
- Evidence bullets — **multiple zones**, title + URL each
- Gaps (including external repos not in Notion)
- Optional: offer KB synthesis row only if a new cross-cutting distill is warranted

## Verification

- [ ] Evidence is not KB-only unless the question was meta/synthesis-specific
- [ ] Did not invent pages
