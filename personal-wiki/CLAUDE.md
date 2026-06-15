# Personal wiki — maintainer schema

You maintain a **persistent markdown wiki** for one human. Raw sources live in `raw/`; the compiled knowledge lives in `wiki/`. Follow skill playbooks in `skills/` for ingest, query, and lint.

## Vault paths

| Path | Purpose |
|------|---------|
| `raw/inbox/` | Unprocessed drops — ingest from here first |
| `raw/sources/` | Processed originals (immutable content) |
| `wiki/index.md` | Master catalog — update on every new/changed page |
| `wiki/log.md` | Append-only timeline |
| `wiki/sources/` | One page per ingested source (summary + links out) |
| `wiki/entities/` | People, orgs, tools, places |
| `wiki/concepts/` | Ideas, frameworks, patterns |
| `wiki/synthesis/` | Theses, comparisons, answers worth keeping |

## Page frontmatter (YAML)

Use on every wiki page except `index.md` and `log.md`:

```yaml
---
title: Human-readable title
type: source | entity | concept | synthesis
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: []          # paths under raw/ or wiki/sources/ slugs
tags: []
status: stub | active | stale
---
```

## Wiki page conventions

- **Filenames:** `kebab-case.md` in the correct subdirectory.
- **Links:** Obsidian-style `[[page-slug]]` — slug is filename without `.md`.
- **Source pages:** What it is, key claims, quotes worth keeping, links to entities/concepts.
- **Entity pages:** Who/what, why they matter to the human, linked sources.
- **Concept pages:** Definition in the human’s words, how it shows up across sources, open questions.
- **Synthesis pages:** Durable answers — comparisons, decisions, “what I believe about X today.”

## Ingest (summary)

When processing `raw/inbox/<file>`:

1. Read the raw file; discuss 3–5 takeaways with the human if they are present.
2. Create or update `wiki/sources/<slug>.md`.
3. Update every entity/concept page the source touches (create stubs if needed).
4. Update `wiki/index.md` and append `wiki/log.md` with prefix `## [YYYY-MM-DD] ingest | <title>`.
5. Move raw file to `raw/sources/<year>/<slug>/` (or ask where to file it).

Touch many pages per source — cross-linking is the product.

## Query (summary)

1. Read `wiki/index.md` to locate candidates.
2. Open relevant pages; synthesize with citations `[[page]]`.
3. If the answer is durable, offer to save under `wiki/synthesis/` and log it.

## Lint (summary)

Report (do not auto-delete without asking):

- Contradictions between pages
- `status: stale` pages contradicted by newer sources
- Orphans (no inbound `[[links]]`)
- Concepts mentioned repeatedly without a concept page
- Missing index entries

## Agent behavior

Adapted from [Karpathy coding guidelines](https://github.com/multica-ai/andrej-karpathy-skills) — applied to wiki work:

- State assumptions; ask when the human’s intent is ambiguous.
- Minimum pages needed; no speculative template sprawl.
- Surgical edits: don’t rewrite unrelated pages during ingest.
- Verify: index + log updated, links resolve, frontmatter valid.

## Customization

Co-evolve this file with the human. Add domains (health, business, fiction), extra folders, or languages. Document changes here so future sessions stay consistent.
