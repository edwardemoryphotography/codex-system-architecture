# Technical Debt Register

Last updated: 2026-09-06
Provenance: `repository_evidence` against `main` HEAD `d33fa3b` (PR #42, then #34, then #31).
Scope of scan: `codex-system-architecture` (this on-disk architecture repo). The
`legacy-codex` production front-end is a separate repository and is not covered here.

Total items: 7 (5 resolved or obsolete; 2 still open)

## Priority scoring

`Priority score = (impact × frequency) / fix_effort`, each factor expressed numerically:

- **Impact** — `Low = 1`, `Medium = 3`, `High = 5`
- **Frequency** — how often a developer or user encounters the issue, `1` (rare) to
  `5` (every build/session). Shown per row in the Freq column.
- **Effort** — `S = 2`, `M = 3`, `L = 4`

Higher score = fix sooner. Resolved / obsolete rows keep historical scores.

| ID | Category | Description | Files | Effort | Impact | Freq | Priority | Added | Sprint |
|----|----------|-------------|-------|--------|--------|------|----------|-------|--------|
| TD-004 | Code Quality | User-facing failures are still mostly swallowed to `console.error` even though a `Toast` provider exists. Scan on 2026-09-06 found **20** `console.error` sites in 11 files (no `console.log` in `src/`). Partial toast coverage exists (DocumentViewer bookmark / add-note; ControlPanelScreen route/auth). Search, export, graph load, nav/tag load, and several other failures still have no user-visible error. `ErrorBoundary` logging is appropriate and is not the debt. `App.tsx` is no longer a site (thin route switch). | `src/components/SearchBar.tsx:34`, `src/components/CommandPalette.tsx:103,135`, `src/components/ExportMenu.tsx:31,58,71`, `src/components/Navigation.tsx:53`, `src/components/TagFilter.tsx:27`, `src/components/KnowledgeGraph.tsx:602`, `src/components/CodexAppShell.tsx:65`, `src/components/DocumentViewer.tsx:241,268,323`, `src/hooks/useAuthSession.ts:27,42`, `src/components/ControlPanelScreen.tsx:154,168` | M | Medium | 3 | 3.0 | 2026-06-14 | Backlog |
| TD-006 | Code Quality | `KnowledgeGraph.tsx` is **2031 lines** (~78KB), far past the 500-line god-object threshold recorded as 529 lines on 2026-06-14. Graph *model* construction now lives in `src/lib/knowledgeGraph.ts` (316 lines) with unit tests, but the component still combines data fetch, force-simulation physics, canvas rendering, and pointer / mobile interaction. Hard to test or modify in isolation. | `src/components/KnowledgeGraph.tsx` | L | Low | 1 | 0.3 | 2026-06-14 | Backlog |
| TD-007 | Dependency | `package.json` declared `pg` (added for the Edition Manager API in `487b450`) but the lockfile was never updated, so `npm ci` failed on clean installs. | `package.json`, `package-lock.json`, `api/apply-edition-migration.js` | S | High | 5 | 12.5 | 2026-06-14 | Fixed (2026-06-14) |
| TD-001 | Test | Originally: no automated tests and no `test` script. **Obsolete.** `package.json` now has `test` / `test:watch` (Vitest; #34 sets `NODE_OPTIONS=--no-experimental-webstorage`). 14 `*.test.ts` / `*.test.tsx` files cover corpus, supabase helpers, knowledge-graph model, cognition, auth, and several components. Coverage is not 100% (markdown parser / TOC / validators still thin) — that is ordinary follow-on work, not the original "no tests" debt. | `package.json`, `src/**/*.test.ts(x)`, `scripts/codex-content-migration.test.ts` | L | High | 5 | 6.3 | 2026-06-14 | Obsolete (tests exist; #34) |
| TD-002 | Code Quality / Security | Originally: `searchDocuments` interpolated raw input into a PostgREST `.or(title.ilike.%${query}%,…)` filter without escaping LIKE / filter metacharacters. **Fixed.** `searchDocuments` is now an in-memory filter over `getDocuments()` (`src/lib/supabase.ts` ~250–259). No PostgREST `ilike` / `.or()` interpolation remains in that function. | `src/lib/supabase.ts:250` | S | Medium | 3 | 4.5 | 2026-06-14 | Fixed |
| TD-003 | Code Quality | Originally: TOC was a stub (`onNavigate` only `console.log`), headings had no DOM `id`s, and TOC `heading-N` diverged from renderer `section-N`. **Fixed.** Headings emit shared `heading-N` ids (`MarkdownRenderer.tsx` ~92–94, 174–175, 236–241); TOC uses the same scheme (`TableOfContents.tsx` ~31–48); `DocumentViewer` wires `navigateToHeading` (`~277–282`, `~684`). Residual (not the original stub): `navigateToHeading` does not expand a user-collapsed ancestor before `scrollIntoView`. Default render starts expanded (`collapsedSections` is an empty `Set`). | `src/components/DocumentViewer.tsx:277`, `src/components/TableOfContents.tsx`, `src/components/MarkdownRenderer.tsx:92` | M | Medium | 4 | 4.0 | 2026-06-14 | Fixed |
| TD-005 | Code Quality | Originally: repeated `if (!supabase) return […]` plus a redundant re-check inside `client()`. **Fixed in #31.** `client()` still throws when unconfigured (`src/lib/supabase.ts` ~156–163). Call sites that should degrade keep a single outer `if (!supabase)` and then use `supabase` / `client()` without a second identical check. Remaining early-returns are the intended unconfigured path, not the dual-guard debt. | `src/lib/supabase.ts` | S | Low | 2 | 1.0 | 2026-06-14 | Fixed in #31 |

## Notes on accepted (non-debt) patterns

- **Centralized viewer state** — still a documented design choice (`CLAUDE.md` still names `App.tsx`). On disk, `App.tsx` is a 21-line `/cognition` vs shell switch; top-level viewer state lives in `src/components/CodexAppShell.tsx`. Conscious split, not new debt. The CLAUDE.md filename is a stale pointer.
- **Literal debt markers** — no `TODO` / `FIXME` / `HACK` / `@deprecated` / `@ts-ignore` / `as any` markers were found in `src/` on 2026-09-06. The only `TODO` hit is the `ActionStatus` union member `'TODO'` in `src/types/index.ts`.
- **Mission ownership** — product Mission lives in `legacy-codex` (corrected on `main` by PR #42). Not debt in this repo. Do not add a Mission screen here.
- **Issue #40** — proposed production-surface contract (PR #41) is still proposed. This register refresh does not accept that contract or claim Vercel parity.

## Recommended next steps

1. **TD-004 (surface errors via Toast)** — remaining open item with real user impact; smallest contained UX fix.
2. **TD-006 (split KnowledgeGraph)** — still the largest file; extract simulation / canvas / pointer layers when someone is already in that component. Do not treat the 2026-06-14 "529 lines" figure as current.
3. **TD-003 residual** — optional: expand collapsed ancestors in `navigateToHeading`. Not a stub anymore; do not prioritize as a broken TOC.
