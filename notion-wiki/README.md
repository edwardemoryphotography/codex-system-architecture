# Notion second brain → skills → agents

Agent playbooks for your **existing Notion workspace** — not a separate Obsidian vault. Your knowledge stays where it already lives; agents follow `skills/` to ingest, query, and lint across databases.

Pattern: [Karpathy LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) · Obsidian twin: [`personal-wiki/`](../personal-wiki/README.md)

## Already wired in your workspace

| Piece | Notion |
|-------|--------|
| **Hub** | [🤖 LLM Wiki — Agent Layer](https://www.notion.so/365330f7bc3b8138a066de7fad91876f) (under Second Brain) |
| **Log** | [Wiki Log](https://www.notion.so/365330f7bc3b81148112f1ba57f6dccc) |
| **Compile queue** | [Wiki Compile Queue](https://www.notion.so/c7fa0a9d6f5f46d39ba8b16f5bc87c96) |
| **Compiled wiki** | [🧠 Knowledge Base](https://www.notion.so/53ef6c57168148b9bd4cb22ae90f8e8e) |
| **Capture** | Second Brain → INBOX, Resources, Notes |

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
│  Notion — Second Brain (raw) + Knowledge Base (compiled)     │
└──────────────────────────────────────────────────────────────┘
```

| Layer | You | Agent (with Notion MCP) |
|-------|-----|-------------------------|
| **Raw** | Clip to INBOX / Resources; queue row in Wiki Compile Queue | Reads pages; does not delete your history |
| **Wiki** | Browse Knowledge Base, Topics, Notes | Creates/updates entries, Summary, Tags, body content |
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

## Requirements

- **Notion MCP** connected in Cursor (or agent with Notion access)
- Repo cloned or `notion-wiki/` copied into a project your agent can read
- Optional: duplicate hub to another workspace using [`SETUP.md`](./SETUP.md)

## Files

| File | Role |
|------|------|
| `AGENTS.md` | Entry for any tool |
| `CLAUDE.md` | Schema: which DB for what, property names |
| `config/notion.workspace.json` | Page/database UUIDs |
| `skills/` | route, ingest, query, lint, backfill |
