# codex-system-architecture

Visual knowledge-management SPA for the **Codex AI platform** — documents, knowledge graph, command palette, and **Tier 4 Control Panel (Screen 1)** intake UI.

[![Edit in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/edwardemoryphotography/codex-system-architecture)

## What this repo is

| Layer | Role |
|-------|------|
| **This app** | React + Vite + Supabase: browse Codex docs, graph, search, bookmarks, reading progress |
| **Control Panel** | Home screen when no doc is selected — task input, six route chips, Route Task / Fast Execute (alerts only; routing in Screen 2) |
| [`notion-wiki/`](./notion-wiki/README.md) | Agent skills + config for your Notion Second Brain |
| [`personal-wiki/`](./personal-wiki/README.md) | Copyable Obsidian vault pattern (raw → skills → wiki) |

**Notion:** [LLM Wiki hub](https://www.notion.so/365330f7bc3b8138a066de7fad91876f) · [Project page](https://www.notion.so/365330f7bc3b81b7b614e8def1b1bb7f) · [Ship sheet — Control Panel Screen 1](https://www.notion.so/c470440b63c6461aa417a35eb6cb69df)

## Tech stack

| Layer | Technology |
|-------|------------|
| UI | React 18, TypeScript, Tailwind CSS |
| Build | Vite 5 |
| Data | Supabase (PostgreSQL + RLS) |
| Agents | `CLAUDE.md`, `AGENTS.md`, `notion-wiki/` |

## Quick start

```bash
git clone https://github.com/edwardemoryphotography/codex-system-architecture.git
cd codex-system-architecture
npm install
cp .env.example .env.local   # add Supabase URL + anon key
npm run dev
```

Open the app → **Control Panel** is the default home. Pick a document from the sidebar to enter the knowledge viewer.

### Verify before PR

```bash
npm run typecheck
npm run lint
npm run build
```

## Environment

| Variable | Required |
|----------|----------|
| `VITE_SUPABASE_URL` | Yes |
| `VITE_SUPABASE_ANON_KEY` | Yes |

See [`.env.example`](./.env.example). Never commit `.env.local`.

**One Supabase project** for docs + Control Panel: `supabase-indigo-paddle` (`hzzzxmtpkgdmjcbncxjh`). Details: [`supabase/SCHEMA.md`](./supabase/SCHEMA.md).

## Deploy (Vercel)

1. Import this repo in [Vercel](https://vercel.com/new).
2. Framework preset: **Vite**.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in project **Environment Variables**.
4. Deploy. `vercel.json` rewrites all routes to `index.html` for the SPA.

```bash
npx vercel --prod
```

Paste the production URL into Notion **Project & Knowledge (Intake)** → `codex-system-architecture` → **Shipped URL**.

Standalone Control Panel prototype (earlier ship): [codex-control-panel on Vercel](https://codex-control-panel-fij70cpi2-edwardemoryphotographys-projects.vercel.app) — this repo now embeds Screen 1 in the main app home.

## Features

- Document tree + markdown viewer, TOC, tags, full-text search
- Command palette (`Cmd/Ctrl+K`), knowledge graph (`Cmd/Ctrl+G`), split view, focus mode
- Bookmarks, inline notes, reading progress (Supabase)
- **Control Panel Screen 1:** task textarea, six chips, Route Task / Fast Execute

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl+K` | Command palette |
| `Cmd/Ctrl+G` | Knowledge graph |
| `Cmd/Ctrl+Shift+F` | Focus mode |
| `Cmd/Ctrl+\` | Split view |
| `Esc` | Close modals / exit focus |

## Agent development

Read [`AGENTS.md`](./AGENTS.md) and [`CLAUDE.md`](./CLAUDE.md) before coding. Cloud Agent secrets must use valid env names (e.g. `GEMINI_API_KEY`, not labels with spaces).

## Related repos

- [`legacy-codex`](https://github.com/edwardemoryphotography/legacy-codex) — production neurodivergent execution UI
- [`mem-layer`](https://github.com/edwardemoryphotography/mem-layer) — AI memory aggregation
- [`neurocreative-platform`](https://github.com/edwardemoryphotography/neurocreative-platform) — EEG + WHOOP backend

## Roadmap

- [x] Control Panel Screen 1 (intake + chips)
- [ ] Screen 2 — routing / classifier
- [ ] Deploy URL on Notion intake (after Vercel link)
- [ ] Deeper README sync with `notion-wiki` inventory
