# Skills (routing layer)

These files are **playbooks**, not code. Any agent that can read markdown can follow them.

## How routing works

1. Human states intent in natural language.
2. Agent reads [`route.md`](./route.md) and opens **one** workflow file.
3. Agent follows steps; verification checklist is mandatory.

## Adding a skill

1. Create `skills/<name>.md` with: purpose, inputs, steps, verification.
2. Add a row to the router table in `route.md`.
3. If the skill needs new folders or frontmatter fields, update [`CLAUDE.md`](../CLAUDE.md).

## Cursor / Claude Code tip

Reference skills explicitly: *“Follow `personal-wiki/skills/ingest.md` for `raw/inbox/article.md`.”*  
Over time, mirror important skills into your tool’s native skill format if you use one — **this folder stays the source of truth** for the vault.
