# Production Supabase reality

The deployed viewer uses `foundry-console` (`pkydkbuodikttfeawqsw`). This was verified from the production Vercel bundle and the live Supabase schema on 2026-07-15. Earlier references to `supabase-indigo-paddle` were stale and must not be used as evidence of production state.

| Layer | Verified production state | Application behavior |
|-------|---------------------------|----------------------|
| Documents | `codex_documents` contains 59 canonical `/codex` rows plus 5 preserved, unrelated legacy rows | Canonical rows are public read-only |
| Provenance | `provenance_status`, `evidence_basis`, `last_reviewed`, `is_read_only` | Required whenever `path` is present |
| Hierarchy | `parent_id` foreign key and covering index | 0 broken canonical parent links |
| Bookmarks | Table not deployed | Disabled for canonical documents |
| Recent pages | `reading_progress` table not deployed | No persisted recent history |
| Notes | `document_notes` table not deployed | Disabled for canonical documents |
| Control Panel | Foundry tables and `initialize_session_start(session_mode)` exist | Separate from the reviewed document corpus |
| Edition Manager | Not present in this production project | Status is `unknown`; verify its separate upstream before use |

## Environment

This repository is a Vite SPA. Use `VITE_` variables and `@supabase/supabase-js`.

```env
VITE_SUPABASE_URL=https://pkydkbuodikttfeawqsw.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable or legacy anon key from the dashboard>
```

Never commit keys. Keep Vercel and local values pointed at the same verified project.

## Migrations and invariants

Run new migrations in timestamp order. Do not edit migrations already applied to a database.

Canonical documents must satisfy all of these invariants:

- `path`, `content`, `category`, `provenance_status`, `evidence_basis`, `last_reviewed`, and `is_read_only` are complete.
- `provenance_status` contains one or more of: `verified`, `repository_evidence`, `concept`, `unknown`.
- `is_read_only` remains true until authenticated, owner-scoped persistence is deliberately designed.
- Existing non-canonical rows with a null `path` are preserved and are not mislabeled as reviewed personal information.

The public `SELECT` policy on `codex_documents` is intentional. Anonymous bookmark, note, reading-progress, update, insert, and delete policies are not.
