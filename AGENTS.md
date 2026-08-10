# Agents

Entry point for AI coding assistants working in this repo (Cursor, Claude Code, Codex, Cloud Agents, etc.).

## Start here

1. Read [`CLAUDE.md`](./CLAUDE.md) for stack, structure, Supabase conventions, and **Agent behavior**.
2. Read [`notion-wiki/docs/GOOSE-COOKBOOK.md`](./notion-wiki/docs/GOOSE-COOKBOOK.md) for canonical Legacy Codex cognitive-transmission doctrine. **Catch the fucking boomerang.**
3. Follow **Coding Rules** and **Performance Patterns** in `CLAUDE.md` for all implementation work.
4. Before claiming a task is done, run the **Verification** table in `CLAUDE.md` → Agent behavior.

## Tool-specific notes

| Tool | How this repo is wired |
|------|-------------------------|
| **Claude Code / Codex / generic agents** | Use `CLAUDE.md` plus the Goose Cookbook as shared context. |
| **Cursor** | `CLAUDE.md` is loaded as workspace context; `.cursor/rules/karpathy-guidelines.mdc` is an optional pointer to the same Agent behavior section (not a second copy of the rules). Read the Goose Cookbook before interpreting system-level intent. |

## Cognitive transmission rule

Do not flatten system-level intent into the local component being edited. When analogies, artifacts, corrections, implementations, or verified evidence repeatedly point toward the same higher-order structure, integrate them. Improved observability of an existing end-state is not automatically a new vision.

## Cloud Agent secrets (git hooks)

Cursor injects secrets for pre-commit scanning via `CLOUD_AGENT_INJECTED_SECRET_NAMES`. Each entry must be a **valid environment variable name** (letters, numbers, underscores only — e.g. `GEMINI_API_KEY`). A display label with spaces (e.g. `Gem api`) breaks bash hooks with `invalid variable name`. Fix in **Cursor → Cloud Agents → Secrets**: use one identifier per secret; do not paste API keys into chat.

## Upstream

Agent behavior is adapted from [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) and now lives canonically in `codex-control-panel/standards/AGENT-BEHAVIOR.md` (Standards Kit 2.1.0) rather than inlined in `CLAUDE.md`; keep `.cursor/rules/` and this file as thin pointers only.

## Cross-repo standards

This repo is named in the Legacy Codex Master Charter (`codex-control-panel/standards/MASTER-CHARTER.md`) §1 for coordination purposes, but does not implement its design-token (§4) or AI-task-lifecycle (§3/§5) sections — this is a Vite/React knowledge-graph SPA with its own established Tailwind design and no AI routing surface. What applies: the shared `AGENT-BEHAVIOR.md` baseline above, and §9 discovery-before-modification if this repo is ever migrated into the design/lifecycle sections.
