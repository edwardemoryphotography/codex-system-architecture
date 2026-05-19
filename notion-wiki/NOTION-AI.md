# Notion AI vs external agents

## Why Notion AI said “those paths don’t exist”

**Notion AI was correct.** It runs in Notion’s sandbox (`modules/notion/`, `modules/skills/research/`, etc.). It does **not** see your GitHub repo unless you paste files in or duplicate them as **Notion pages**.

| Instruction style | Works in |
|-------------------|----------|
| `notion-wiki/AGENTS.md`, `skills/ingest.md` | Cursor, Claude Code, Codex **with repo cloned** + optional Notion MCP |
| Pages under **🤖 LLM Wiki — Agent Layer** in Notion | **Notion AI** (in-app) |
| Paste skill text into chat | Any chat, one-off |

## What actually exists in your Notion workspace

These were created and are searchable (confirmed via workspace search):

| Asset | URL |
|-------|-----|
| Hub | https://www.notion.so/365330f7bc3b8138a066de7fad91876f |
| Wiki Compile Queue | https://www.notion.so/c7fa0a9d6f5f46d39ba8b16f5bc87c96 |
| Example item | https://www.notion.so/365330f7bc3b81cba89ee80ba450e072 |
| Wiki Log | https://www.notion.so/365330f7bc3b81148112f1ba57f6dccc |
| Knowledge Base | https://www.notion.so/53ef6c57168148b9bd4cb22ae90f8e8e |

Notion AI may need you to **@ mention** the hub or database, or paste the prompt below, so it searches your workspace instead of looking for files.

## Copy-paste for Notion AI

```
Search my workspace for "LLM Wiki Agent Layer" and open "📋 For Notion AI — start here".

Follow Skill: Route, then Skill: Ingest.

Process the Wiki Compile Queue database item titled "Example — run ingest skill on me":
- Read its Source URL (Karpathy LLM Wiki gist)
- Create or update a row in 🧠 Knowledge Base with Summary + Draft status
- Mark the queue item Done
- Append a line to the Wiki Log page

Do not look for filesystem paths like notion-wiki/ — use only Notion pages and databases.
```

## Two-tool workflow (recommended)

| Job | Tool |
|-----|------|
| Daily capture, browse, graph | Notion + Notion AI |
| Heavy ingest, lint, git-backed skills | Cursor / Claude Code + `notion-wiki/` + Notion MCP |

Keep **skills in sync**: when you change `notion-wiki/skills/*.md` in GitHub, update the matching Notion pages under the hub (or ask an external agent to copy them).
