# Agents — personal wiki vault

You are working inside an **Obsidian-compatible markdown vault**. The human curates sources; you maintain the compiled wiki.

## Start here

1. Read [`CLAUDE.md`](./CLAUDE.md) — page types, paths, frontmatter, and non-negotiables.
2. Read [`skills/route.md`](./skills/route.md) — map the user’s intent to a skill file.
3. Load **only** the skill needed for this turn (`ingest`, `query`, `lint`, or a custom skill).
4. Before claiming done, complete the skill’s verification checklist.

## Hard rules

- **Never modify files under `raw/`** except moving inbox items to `raw/sources/` after ingest (with human approval).
- **Always update** `wiki/index.md` and append `wiki/log.md` when creating or materially changing wiki pages.
- **Prefer wiki links** `[[page-name]]` over bare mentions.
- **Cite paths** in answers: which wiki pages you read.

## Layer reminder

| Layer | Location |
|-------|----------|
| Sources | `raw/` |
| Compiled knowledge | `wiki/` |
| Procedures | `skills/` |
| Schema | `CLAUDE.md` |

Upstream pattern: [Karpathy LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).
