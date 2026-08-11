# STATE.md — codex-system-architecture

_Last updated: 2026-08-11_

## ✅ SHIPPED

- **Close-out (2026-08-11)** → landed PR #23 hygiene, #17 cognition v2.1, #18 interactive UX polish, #29 standards pointer; salvaged #14 branding/tokens (Syne/DM Sans, Codex PWA meta) without conflicted shell rewrites; fixed `useToast` imports after hygiene split; documented owner-scoped migration apply gate + actions RLS deferral in `SCHEMA.md`.
- **Hygiene pass (2026-08-04)** → lint warnings cleared: memoized `defaultActions` in CommandPalette, hoisted `particleColors` in ParticleField, stabilized CognitionDeck / useFormValidation callbacks, moved `useToast` + `ToastContext` to `src/hooks/useToast.ts`.

## 🔴 BLOCKED

- Live apply of `20260810090000_owner_scoped_document_interactions.sql` to `foundry-console` (needs Supabase project credentials — not available in agent env).
- Sibling-repo leftovers (legacy-codex / codex-control-panel open PRs, Gumroad Step 0, etc.) are outside this repo’s merge gate.

## 🚧 NEXT

- Operator: apply owner-scoped migration, then flip `project.json` feature_status for bookmarks / reading_progress / document_notes to verified.
- Close superseded open PRs (#14/#17/#18/#23/#29) once this close-out PR merges.
