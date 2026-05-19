# Notion second brain → skills → agents

Agent playbooks for your **existing Notion workspace** — not a separate Obsidian vault. Your knowledge stays where it already lives; agents follow `skills/` to ingest, query, and lint across databases.

Pattern: [Karpathy LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) · Obsidian twin: [`personal-wiki/`](../personal-wiki/README.md)

## Already wired in your workspace

| Piece | Notion |
|-------|--------|
| **Hub** | [🤖 LLM Wiki — Agent Layer](https://www.notion.so/365330f7bc3b8138a066de7fad91876f) (under Second Brain) |
| **Log** | [Wiki Log](https://www.notion.so/365330f7bc3b81148112f1ba57f6dccc) |
| **Compile queue** | [Wiki Compile Queue](https://www.notion.so/c7fa0a9d6f5f46d39ba8b16f5bc87c96) |
| **Corpus (your whole brain)** | **Entire Notion workspace** — see [Corpus map](https://www.notion.so/365330f7bc3b81d58db3d8f2a257e701) |
| **Wiki synthesis (distill only)** | [🧠 Knowledge Base](https://www.notion.so/53ef6c57168148b9bd4cb22ae90f8e8e) — not the boundary of knowledge |
| **Capture** | Second Brain → INBOX, Resources, Notes, **Projects** |

IDs are in [`config/notion.workspace.json`](./config/notion.workspace.json).

## Three layers (your mapping)

```
┌──────────────────────────────────────────────────────────────┐
│  Agents — Cursor, Claude Code, Codex + Notion MCP            │
│  Read AGENTS.md → route.md → ingest | query | lint           │
└────────────────────────────┬─────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│  skills/*.md — procedures + which Notion tools to call       │
└────────────────────────────┬─────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│  Corpus — all Notion + projects; KB DB = synthesis only      │
└──────────────────────────────────────────────────────────────┘
```

| Layer | You | Agent (with Notion MCP) |
|-------|-----|-------------------------|
| **Corpus** | Work across Notion — projects, notes, Codex, inbox | Searches whole workspace; enriches pages in place |
| **Synthesis** | Optional distill rows in 🧠 Knowledge Base | Adds KB row only when insight is cross-cutting |
| **Skills** | “Ingest this”, “What do I know about X?” | Loads the right `skills/*.md` |
| **Agents** | Steer emphasis | `notion-search`, `notion-fetch`, `notion-create-pages`, `notion-update-page` |

## First commands

**Ingest** (queue item or INBOX page):

> Read `notion-wiki/AGENTS.md`, load `config/notion.workspace.json`, follow `skills/ingest.md` for [paste Notion URL].

**Query** (your whole workspace):

> Follow `skills/query.md` — what do I believe about [topic]?

**Lint**:

> Follow `skills/lint.md` on Knowledge Base + Topics.

**Index what you already have**:

> Follow `skills/backfill.md` — survey Knowledge Base and suggest Tags / gaps.

## Notion AI (in-app) — read this if paste failed

Notion AI **does not see** `notion-wiki/` on disk. That is expected.

Use pages under the hub instead: **[📋 For Notion AI — start here](https://www.notion.so/365330f7bc3b81b9bc24e59570ec6c7b)** and the **Skill:** pages next to it.

Full explanation + copy-paste prompt: [`NOTION-AI.md`](./NOTION-AI.md).

## Requirements (Cursor / Claude Code / Codex)

- **Notion MCP** connected
- Repo cloned so `notion-wiki/` exists on disk
- Optional: duplicate hub to another workspace using [`SETUP.md`](./SETUP.md)

## Files

| File | Role |
|------|------|
| `AGENTS.md` | Entry for any tool |
| `CLAUDE.md` | Schema: which DB for what, property names |
| `config/notion.workspace.json` | Page/database UUIDs |
| `skills/` | route, ingest, query, lint, backfill |
