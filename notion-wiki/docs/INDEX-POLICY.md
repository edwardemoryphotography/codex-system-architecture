# Canonical index policy

**Decision (2026-05-19):** The wiki index is **🧠 Knowledge Base → All Entries**, not a separate hub page.

| Role | Location |
|------|----------|
| **Index (catalog)** | Knowledge Base table — `Entry`, `Summary`, `Status`, `Tags` |
| **Hub** | LLM Wiki — skills, queue, log, policies only |
| **Chronicle** | Wiki Log — what happened when |
| **Narrative spotlight** | Optional manual "Wiki spotlight" page (human-only, not agent-maintained) |

## Ingest contract

Every compile must set **Summary** (one-line index) and **Tags** (`source` | `entity` | `concept` | `synthesis`).

## Query contract

1. KB All Entries → 2. entry pages → 3. workspace search for gaps.

Notion page: [Index policy (canonical)](https://www.notion.so/365330f7bc3b81c29fe8ec0018f5aa13)
