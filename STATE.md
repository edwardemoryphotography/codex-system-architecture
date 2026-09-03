# STATE.md — codex-system-architecture

_Last updated: 2026-09-03_  
_Refreshed against `main` HEAD `60c841a` (2026-08-27, PR #41)._  
_This file records repository truth. Merged != deployed != runtime verified != live._

## ✅ SHIPPED (on `main` — merge evidence only)

- **Proposed production contract (2026-08-27, PR #41)** → added [`docs/CODEX-DEPLOYMENT-MANIFEST.md`](./docs/CODEX-DEPLOYMENT-MANIFEST.md) as a **proposed** canonical-surface contract. Tracking issue **#40 remains open**. Definition-of-done boxes are unchecked. Vercel `frontend` vs `legacy-codex` parity is **not** established. Do not treat the manifest as accepted live consolidation.
- **Knowledge graph / corpus (2026-08-24)** → PR #35 document intelligence + “Start this outcome” Control Panel prefill; #36 canonical review date in headers; #37 graph review gaps; #38 drop legacy task stubs from the atlas; #39 mobile graph. These are **viewer/routing aids**, not the product Mission loop (Mission lives in `legacy-codex`).
- **Tooling (2026-08-24, PR #33)** → cross-version npm clean installs; CI + vendor-chunk split.
- **Close-out (2026-08-11, PR #30)** → landed hygiene #23, cognition v2.1 #17, interactive UX #18, standards pointer #29; salvaged #14 branding/tokens (Syne/DM Sans, Codex PWA meta) without conflicted shell rewrites; fixed `useToast` imports after hygiene split; documented owner-scoped migration apply gate + actions RLS deferral in `SCHEMA.md`. **Already merged — not NEXT.**
- **Hygiene pass (2026-08-04)** → lint warnings cleared: memoized `defaultActions` in CommandPalette, hoisted `particleColors` in ParticleField, stabilized CognitionDeck / useFormValidation callbacks, moved `useToast` + `ToastContext` to `src/hooks/useToast.ts`.

## 🔴 BLOCKED

- Live apply of `20260810090000_owner_scoped_document_interactions.sql` to `foundry-console` (needs Supabase project credentials — not available in this agent env). `supabase/project.json` `feature_status` for bookmarks / reading_progress / document_notes remains `migration_ready_owner_scoped`.
- This cloud agent only has write access to `codex-system-architecture`. Sibling leftovers must be fixed in those repos.

### Sibling leftovers (GitHub evidence 2026-09-03, not runtime)

The 2026-08-11 “prepared, not pushed” triage is stale. On GitHub:

- `legacy-codex` #35 (standards/agent-router), #62 (flock hub docs), and #14 (CLAUDE test-coverage notes) are **merged**.
- `legacy-codex` #19 PocketForge is **merged**, not an open draft.
- `codex-control-panel` #9 is **closed**; #5 and #2 are **merged**. That repo had **no open issues** at this refresh.
- `legacy-codex` `CLAUDE.md` still names this architecture repo’s canonical project as `supabase-indigo-paddle`. This repo’s verified project is `foundry-console` (`pkydkbuodikttfeawqsw`). Stale sibling copy; not fixed here.

**Mission ownership (repository_evidence, 2026-09-03):** [legacy-codex#37](https://github.com/edwardemoryphotography/legacy-codex/pull/37) merged 2026-08-09. Product Mission lives in `legacy-codex` (`src/components/tabs/MissionTab.tsx`, `src/lib/missionLoop.ts`, `missions` / `mission_events`). This architecture viewer is not Mission owner. Live apply / runtime verification of those tables from this repo: `unknown`.

## 🚧 NEXT

- Operator-apply the owner-scoped document-interaction migration to `foundry-console` and flip `project.json` `feature_status` only after that apply is verified.
- Leave GitHub issue **#40 open** until the proposed deployment contract is accepted and Vercel parity is actually verified. Do not check definition-of-done boxes from architecture-doc updates.
- Do not add a Mission screen, product outcome chips, or an Artful Intelligence fold-in here.
