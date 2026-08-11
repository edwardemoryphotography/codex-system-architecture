# STATE.md — codex-system-architecture

_Last updated: 2026-08-11_

## ✅ SHIPPED

- **Close-out (2026-08-11)** → landed PR #23 hygiene, #17 cognition v2.1, #18 interactive UX polish, #29 standards pointer; salvaged #14 branding/tokens (Syne/DM Sans, Codex PWA meta) without conflicted shell rewrites; fixed `useToast` imports after hygiene split; documented owner-scoped migration apply gate + actions RLS deferral in `SCHEMA.md`.
- **Hygiene pass (2026-08-04)** → lint warnings cleared: memoized `defaultActions` in CommandPalette, hoisted `particleColors` in ParticleField, stabilized CognitionDeck / useFormValidation callbacks, moved `useToast` + `ToastContext` to `src/hooks/useToast.ts`.

## 🔴 BLOCKED

- Live apply of `20260810090000_owner_scoped_document_interactions.sql` to `foundry-console` (needs Supabase project credentials — not available in agent env).
- Sibling-repo leftovers (`legacy-codex`, `codex-control-panel`): this cloud agent only has write access to `codex-system-architecture`. Local close-out branches were prepared under `/tmp/codex-siblings/` but pushes returned 403.

### Sibling triage (prepared, not pushed)

**legacy-codex** (branch `cursor/codex-closeout-d397` locally):
- Land #35 standards/agent-router docs + #62 flock hub patch docs
- Merge #14 CLAUDE test-coverage notes; correct stale “separate Supabase project / indigo-paddle” claim → shared `foundry-console` (`pkydkbuodikttfeawqsw`)
- Leave #19 PocketForge draft (merge conflicts / separate product scope)

**codex-control-panel**:
- Close #9 — LLM key trim already on `main`
- Close #5 — superseded by Foundry AI routing / `createAction` intentionally disabled
- Close #2 — only trivial `next.config.ts` churn; 7-tab UI already shipped

## 🚧 NEXT

- Merge architecture PR #30, then operator-apply owner-scoped migration and flip `project.json` feature_status.
- Re-run close-out from an agent/environment with write access to `legacy-codex` and `codex-control-panel`, or push the prepared local branches manually.
