# Unified Supabase schema

**One project for everything in this repo:** `supabase-indigo-paddle` (`hzzzxmtpkgdmjcbncxjh`).

| Layer | Tables / RPC | Used by |
|-------|----------------|---------|
| Knowledge | `codex_documents`, `codex_tags`, `codex_document_tags`, `document_links` | Sidebar, viewer, graph, search |
| Interactions | `reading_progress`, `bookmarks`, `document_notes` | Document viewer |
| Control Panel | `actions`, `initialize_session_start(session_mode)` | Home screen Route Task |

## Environment (all clients)

```env
VITE_SUPABASE_URL=https://hzzzxmtpkgdmjcbncxjh.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key from dashboard>
```

Use the same values in **Vercel**, **local `.env.local`**, and any **Next.js / iPhone** app — do not create a second Supabase project for Codex.

## Migrations

Run every file in `supabase/migrations/` in timestamp order on the canonical project. The unified actions migration is `20260520120000_unified_actions_and_session_start.sql` (idempotent if you already created `actions` manually).

## RLS

All tables use **public** read/write policies (no auth), matching the SPA design in `CLAUDE.md`. Server-only service role is optional for admin scripts, not required for the Vite app.
