# Corpus policy — whole workspace is the knowledge base

## The distinction that matters

| Term | Meaning |
|------|---------|
| **Knowledge base (corpus)** | **All** Notion pages + active projects (and stubs linking to GitHub/repos) |
| **🧠 Knowledge Base (database)** | **Wiki synthesis** — optional distilled rows; Karpathy-style compiled notes, not the full brain |

Agents must not treat the database title as the scope of what the user knows.

## Three layers

```
Layer 3 — Agents (Notion AI, Cursor, Claude, Codex)
Layer 2 — Skills (route, ingest, query, lint)
Layer 1 — Corpus = entire Notion + project context
         └── synthesis DB = small compiled lens on top
```

## Query order

1. Workspace-wide search
2. Corpus map zones (Second Brain, Projects, Codex, Topics, Notes, Resources, Intake)
3. Active projects table on Corpus map
4. 🧠 Knowledge Base — only as pre-digested shortcut

## Ingest default

1. Enrich source page in place (summary + links)
2. Link Projects / Topics
3. Optional KB row for durable cross-cutting synthesis
4. Log

Notion: [Corpus policy](https://www.notion.so/365330f7bc3b81c29fe8ec0018f5aa13) · [Corpus map](https://www.notion.so/365330f7bc3b81d58db3d8f2a257e701)
