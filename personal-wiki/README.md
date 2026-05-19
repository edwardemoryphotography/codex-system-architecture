# Personal wiki (second brain → skills → agents)

A **copyable Obsidian vault** pattern for a compounding personal knowledge base. Inspired by [Karpathy's LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) and the idea that humans curate sources while agents do the bookkeeping.

This folder is **not** the Codex React app. It is a standalone vault you can copy to `~/Documents/MyBrain`, open in Obsidian, and drive with Claude Code, Cursor, or Codex.

## Three layers

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 3 — Agents (Cursor, Claude Code, Codex, …)           │
│  Read schema + skills; edit wiki; never touch raw originals │
└───────────────────────────────┬─────────────────────────────┘
                                │ loads
┌───────────────────────────────▼─────────────────────────────┐
│  Layer 2 — Skills (`skills/*.md`)                           │
│  Route intent: ingest | query | lint | (your custom flows)  │
└───────────────────────────────┬─────────────────────────────┘
                                │ maintains
┌───────────────────────────────▼─────────────────────────────┐
│  Layer 1 — Second brain                                     │
│  `raw/` immutable sources  +  `wiki/` compiled markdown   │
└─────────────────────────────────────────────────────────────┘
```

| Layer | You do | Agent does |
|-------|--------|------------|
| **Raw** | Clip articles, drop PDFs, journal exports, meeting notes into `raw/inbox/` | Reads only; never edits |
| **Wiki** | Browse in Obsidian; steer emphasis when ingesting | Writes summaries, entity pages, links, index, log |
| **Skills** | Pick a workflow (“ingest this”, “lint the wiki”) | Follows the matching `skills/*.md` playbook |
| **Agents** | Ask questions; approve big structural changes | Executes skills; cites wiki pages |

**Why skills sit in the middle:** Your vault can grow for years. One giant `CLAUDE.md` becomes noisy. Small **routing skills** tell the agent which procedure to run so the same vault works for research, health, projects, or reading a book—you add `skills/read-book.md` without rewriting the core schema.

## Quick start

1. **Copy this folder** to where you keep Obsidian vaults, e.g. `~/Obsidian/PersonalWiki/`.
2. **Open it as a vault** in Obsidian (optional but recommended for graph view + reading).
3. **Open the same folder** in your agent tool (Claude Code, Cursor, etc.).
4. Tell the agent: *“Read `AGENTS.md` and `skills/route.md`, then ingest `raw/inbox/<file>`.”*

## Daily workflows

| You say | Agent loads | Outcome |
|---------|-------------|---------|
| “Ingest the article in inbox” | `skills/ingest.md` | New/updated pages under `wiki/`, index + log updated |
| “What do I believe about X?” | `skills/query.md` | Answer with `[[wiki links]]`; optional new synthesis page |
| “Lint the wiki” | `skills/lint.md` | Report: orphans, contradictions, stale pages, gaps |
| “Not sure what to run” | `skills/route.md` | Picks ingest / query / lint / custom |

## Folder layout

```
personal-wiki/
  CLAUDE.md          # Wiki schema (conventions, page types, frontmatter)
  AGENTS.md          # Entrypoint for any coding agent
  raw/
    inbox/           # Drop zone — process then move to raw/sources/…
    sources/         # Organized originals (by year, project, etc.)
  wiki/
    index.md         # Catalog of all wiki pages
    log.md           # Chronological ingest/query/lint log
    sources/         # One summary page per ingested source
    entities/        # People, places, tools, companies
    concepts/        # Ideas, frameworks, recurring themes
    synthesis/       # Your evolving theses, comparisons, answers worth keeping
  skills/
    route.md         # Intent router
    ingest.md
    query.md
    lint.md
```

## Compounding rules

1. **Raw is sacred** — agents read, never modify.
2. **Good chat answers get filed** — if a query produced a durable insight, save it under `wiki/synthesis/`.
3. **Every ingest touches the index and log** — no silent edits.
4. **Co-evolve `CLAUDE.md`** — when a convention works, write it down; when it doesn’t, change the schema.

## Optional tooling

- **Obsidian Web Clipper** → markdown into `raw/inbox/`
- **Git** — this vault is a normal repo; commit after agent sessions you care about
- **Search at scale** — when `index.md` isn’t enough, add [qmd](https://github.com/tobi/qmd) or similar (see Karpathy gist)
- **Codex SPA** (this monorepo’s `src/`) — a possible *fourth* layer later: publish slices of `wiki/` to Supabase for the graph UI

## Relation to codex-system-architecture

| This vault | Codex React app |
|------------|-----------------|
| Personal, local markdown | Shared/visualized knowledge product |
| You + agent maintain files | Supabase documents + graph |
| Fast to start today | Deeper UX, RLS, reading progress |

Many people run **both**: vault for private compounding; Codex for presentation and ecosystem docs.
