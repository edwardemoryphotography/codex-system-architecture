# Agents

Entry point for AI coding assistants working in this repo (Cursor, Claude Code, Codex, Cloud Agents, etc.).

## Start here

1. Read [`CLAUDE.md`](./CLAUDE.md) for stack, structure, Supabase conventions, and **Agent behavior**.
2. Follow **Coding Rules** and **Performance Patterns** in `CLAUDE.md` for all implementation work.
3. Before claiming a task is done, run the **Verification** table in `CLAUDE.md` → Agent behavior.

## Tool-specific notes

| Tool | How this repo is wired |
|------|-------------------------|
| **Claude Code / Codex / generic agents** | Use `CLAUDE.md` as the single source of truth. |
| **Cursor** | `CLAUDE.md` is loaded as workspace context; `.cursor/rules/karpathy-guidelines.mdc` is an optional pointer to the same Agent behavior section (not a second copy of the rules). |

## Cloud Agent secrets (git hooks)

Cursor injects secrets for pre-commit scanning via `CLOUD_AGENT_INJECTED_SECRET_NAMES`. Each entry must be a **valid environment variable name** (letters, numbers, underscores only — e.g. `GEMINI_API_KEY`). A display label with spaces (e.g. `Gem api`) breaks bash hooks with `invalid variable name`. Fix in **Cursor → Cloud Agents → Secrets**: use one identifier per secret; do not paste API keys into chat.

## Upstream

Agent behavior is adapted from [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills). Update the **Agent behavior** section in `CLAUDE.md` when pulling substantive changes from upstream; keep `.cursor/rules/` as a thin pointer only.
