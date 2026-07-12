# Unified Supabase schema

**One project for everything in this repo:** `supabase-indigo-paddle` (`hzzzxmtpkgdmjcbncxjh`).

| Layer | Tables / RPC | Used by |
|-------|----------------|---------|
| Knowledge | `codex_documents`, `codex_tags`, `codex_document_tags`, `document_links` | Sidebar, viewer, graph, search |
| Interactions | `reading_progress`, `bookmarks`, `document_notes` | Document viewer |
| Control Panel | `actions`, `initialize_session_start(session_mode)` | Home screen Route Task |
| Edition Manager | `edition_manager_events` (REST POST) | `scripts/print-sales-auto-agent.py` |

## Environment (all clients)

This repo is a **Vite SPA**, not Next.js. Use `VITE_` env vars and `@supabase/supabase-js`
(`createClient`). Do **not** paste Supabase dashboard Next.js snippets (`@supabase/ssr`,
`NEXT_PUBLIC_*`, `middleware.ts`, `cookies()`).

```env
VITE_SUPABASE_URL=https://hzzzxmtpkgdmjcbncxjh.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key from dashboard>
# Optional alias if the dashboard only shows a publishable key:
# VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Use the same values in **Vercel**, **local `.env.local`**, and **Control Panel** (`codex-control-panel`).
Canonical project remains `supabase-indigo-paddle` (`hzzzxmtpkgdmjcbncxjh`) unless you
intentionally migrate and run the full `supabase/migrations/` set on a new project.

**`legacy-codex` is not a client of this schema.** It runs its own separate Supabase
project (`pkydkbuodikttfeawqsw`) with its own tables (`nd_codex_bookmarks`, `nd_prefs`,
`nd_captures`). Do not point it at `supabase-indigo-paddle`, and do not assume its data
lives here.

## Migrations

Run every file in `supabase/migrations/` in timestamp order on the canonical project. The unified actions migration is `20260520120000_unified_actions_and_session_start.sql` (idempotent if you already created `actions` manually).

## RLS

All tables use **public** read/write policies (no auth), matching the SPA design in `CLAUDE.md`. Server-only service role is optional for admin scripts, not required for the Vite app.
