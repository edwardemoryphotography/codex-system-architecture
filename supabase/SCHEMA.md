# Production Supabase reality

The deployed viewer uses `foundry-console` (`pkydkbuodikttfeawqsw`). This was verified from the production Vercel bundle and the live Supabase schema on 2026-07-15. Earlier references to `supabase-indigo-paddle` were stale and must not be used as evidence of production state.

| Layer | Verified production state | Application behavior |
|-------|---------------------------|----------------------|
| Documents | `codex_documents` contains 59 canonical `/codex` rows plus 5 preserved, unrelated legacy rows | Canonical rows are public read-only |
| Provenance | `provenance_status`, `evidence_basis`, `last_reviewed`, `is_read_only` | Required whenever `path` is present |
| Hierarchy | `parent_id` foreign key and covering index | 0 broken canonical parent links |
| Bookmarks | Migration `20260810090000` defines owner-scoped `bookmarks` (`user_id` + RLS) | Enabled only for authenticated sessions after migration apply |
| Recent pages | Migration `20260810090000` defines owner-scoped `reading_progress` | Enabled only for authenticated sessions after migration apply |
| Notes | Migration `20260810090000` defines owner-scoped `document_notes` | Enabled only for authenticated sessions after migration apply |
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
- `is_read_only` remains true for canonical document **content**. Personal bookmarks, notes, and reading progress are separate owner-scoped rows (`user_id = auth.uid()`), not content edits.
- Existing non-canonical rows with a null `path` are preserved and are not mislabeled as reviewed personal information.

The public `SELECT` policy on `codex_documents` is intentional. Anonymous bookmark, note, and reading-progress policies are not — see `20260810090000_owner_scoped_document_interactions.sql`.

## Auth + personal overlays

| Concern | Mechanism |
|---|---|
| Sign-in | Supabase magic link to `ROUTING_OWNER_EMAIL` (Control Panel) |
| App identity | `profiles` row keyed by `auth.users.id` (`storeUser` on session) |
| Personal data | `bookmarks`, `reading_progress`, `document_notes` with `user_id` + authenticated-only RLS |
| Client helpers | `src/lib/auth.ts` (`getCurrentUser`, `storeUser`, `requireOwner`) |

Until the owner-scoped migration is applied to the live project, personal overlays remain unavailable at the database layer; the UI stays disabled while signed out and degrades gracefully if tables are missing.

## Routing control plane — canonical ownership (recorded 2026-08-04, updated 2026-09-03)

Provenance: `repository_evidence` for every row below unless marked `unknown`.
`routed_requests` and `evidence_items` were confirmed live against the
`foundry-console` (`pkydkbuodikttfeawqsw`) Supabase project on 2026-08-07
(RLS, anon-zero-privilege, delete guards, correction-chain integrity,
idempotency-key uniqueness, and `persist_route_atomic` grants all checked
directly). Merged != deployed != runtime verified != live.

This architecture repo documents reviewed doctrine. It is not proof of deploy
or live runtime, and it is not the product Mission loop. Do not add a Mission
screen, product outcome chips, or a replacement loop here. Artful Intelligence
is a separate product; do not fold it in.

The Legacy Codex Autonomous Project Hygiene work (Lane A) fixed one
authoritative owner per operational record type. Do not introduce parallel
stores in *this* repo for any of these:

| Record type | Canonical owner | Status |
|---|---|---|
| Project/workspace registry | `workspaces` (Foundry, `foundry-console/SCHEMA.sql` in legacy-codex) | deployed per project.json |
| Control Panel / Foundry work item | `actions` (this repo's migration `20260520120000`) | deployed per project.json. Viewer/routing task queue only — **not** Mission |
| Mission (human outcome loop) | legacy-codex: `missions` + append-only `mission_events`; UI `src/components/tabs/MissionTab.tsx`; lifecycle `src/lib/missionLoop.ts` | **Merged** 2026-08-09 as [legacy-codex#37](https://github.com/edwardemoryphotography/legacy-codex/pull/37) (“Mission Loop: data model, lifecycle logic, evidence bridge”). Mission Screen UI later merged as legacy-codex#59. Live table apply and runtime verification from *this* repo: `unknown` |
| Append-only event history | `events` (Foundry) | deployed per project.json |
| Routed request | `routed_requests` — legacy-codex migrations `20260804010000_routing_control_plane.sql` + `20260804020000_routing_control_plane_hardening.sql` (merged via legacy-codex#47) | deployed and verified live 2026-08-07 |
| Evidence | `evidence_items` — same migrations | deployed and verified live 2026-08-07 |
| Agent run | recorded as `events` rows; dedicated table deferred | decision recorded |
| Generated status summary | derived only (`foundry-console/src/lib/derived-state.ts` in legacy-codex); never stored | decision recorded |

This repo's knowledge-graph document intelligence (PR #35) and Control Panel
six route chips are viewer/routing aids. They prefill or classify a routed
request; they are not the product Mission loop.

Known leftovers (updated 2026-09-03):

- `actions` carries public RLS (`USING (true)`, full CRUD) while every
  Foundry table is owner-only with anon revoked. Tightening it would break
  the deployed Control Panel read path — flagged, deliberately not changed.
  **Close-out decision (2026-08-11):** keep public RLS until Control Panel
  authenticates every actions read/write; do not invent a parallel Mission
  table in this repo.
- legacy-codex `CLAUDE.md` still (fetched 2026-09-03) claims this architecture
  repo's canonical project is `supabase-indigo-paddle`. This repo's verified
  project is `foundry-console` (`pkydkbuodikttfeawqsw`). Treat indigo-paddle
  references as stale. Sibling-doc correction is outside this repo.
- **Corrected 2026-09-03:** the 2026-08-11 close-out treated this repo's
  `actions` table as canonical “Mission / work item” and described
  legacy-codex#37 as still open/draft. That was wrong. #37 merged 2026-08-09.
  Mission lives in legacy-codex. This repo's `actions` table remains the
  Control Panel / Foundry task queue.

## Migration apply gate (owner-scoped overlays)

Repo migration `20260810090000_owner_scoped_document_interactions.sql` is
**ready in-repo**. Live apply to `foundry-console` (`pkydkbuodikttfeawqsw`)
is an operator step (Supabase SQL editor or CLI with project credentials).
Until applied, `feature_status` in `project.json` stays
`migration_ready_owner_scoped` for bookmarks / reading_progress /
document_notes; the SPA degrades gracefully while signed out or if tables
are missing.
