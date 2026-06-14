# Technical Debt Register

Last updated: 2026-06-14
Scope of scan: `codex-system-architecture` (the on-disk Codex architecture repo). The
`legacy-codex` production front-end is a separate repository and was not reachable
from this session, so it is not covered here.

Total items: 7 (1 resolved in this PR)

## Priority scoring

`Priority score = (impact × frequency) / fix_effort`, each factor expressed numerically:

- **Impact** — `Low = 1`, `Medium = 3`, `High = 5`
- **Frequency** — how often a developer or user encounters the issue, `1` (rare) to
  `5` (every build/session). Shown per row in the Freq column.
- **Effort** — `S = 2`, `M = 3`, `L = 4`

Higher score = fix sooner.

| ID | Category | Description | Files | Effort | Impact | Freq | Priority | Added | Sprint |
|----|----------|-------------|-------|--------|--------|------|----------|-------|--------|
| TD-007 | Dependency | `package.json` declared `pg` (added for the Edition Manager API in `487b450`) but the lockfile was never updated, leaving `package.json` and `package-lock.json` out of sync. `npm ci` fails on any clean-install environment (e.g. Netlify deploy previews) with `EUSAGE … Missing: pg`. | `package.json`, `package-lock.json`, `api/apply-edition-migration.js` | S | High | 5 | 12.5 | 2026-06-14 | Fixed in this PR |
| TD-001 | Test | No automated tests and no `test` script in `package.json` (only `lint`/`typecheck`). All logic — markdown parsing, validators, search, session-start routing — is unverified. Accepted so far because the app is a browser-native SPA shipped via StackBlitz/Vercel with manual verification. | `package.json`, whole repo | L | High | 5 | 6.3 | 2026-06-14 | Backlog |
| TD-002 | Code Quality / Security | `searchDocuments` interpolates raw user input into a PostgREST `.or(title.ilike.%${query}%,content.ilike.%${query}%)` filter without escaping PostgREST/LIKE metacharacters (`%`, `_`, `,`, `(`, `)`, `.`). A query containing a comma or paren splits or malforms the filter, breaking search or returning wrong results. | `src/lib/supabase.ts:49` | S | Medium | 3 | 4.5 | 2026-06-14 | Backlog |
| TD-003 | Code Quality | Table-of-contents navigation is a non-functional stub: `DocumentViewer` passes `onNavigate={(id) => console.log('Navigate to:', id)}`, so clicking a heading only logs. Rendered headings in `MarkdownRenderer` carry no DOM `id` anchors, and the TOC id scheme (`heading-N`, counting h1/h2/h3) diverges from the renderer's section keys (`section-N`, h1/h2 only). A real fix requires emitting matching `id`s, reconciling the two schemes, and expanding collapsed sections before scrolling. | `src/components/DocumentViewer.tsx:240`, `src/components/TableOfContents.tsx`, `src/components/MarkdownRenderer.tsx` | M | Medium | 4 | 4.0 | 2026-06-14 | Backlog |
| TD-004 | Code Quality | Errors across components are handled only by `console.error`/`console.log` (17 sites). User-facing failures (search/load/export errors) are swallowed to the console even though a `Toast` provider exists to surface them. | `src/App.tsx:57`, `src/components/DocumentViewer.tsx`, `src/components/CommandPalette.tsx`, `src/components/SearchBar.tsx`, `src/components/Navigation.tsx`, `src/components/ExportMenu.tsx`, `src/components/TagFilter.tsx`, `src/components/KnowledgeGraph.tsx` | M | Medium | 3 | 3.0 | 2026-06-14 | Backlog |
| TD-005 | Code Quality | Repeated `if (!supabase) return [...]` guard in 19 functions, each followed by a redundant re-check inside `client()`. Duplicated boilerplate; the dual guard can be consolidated. | `src/lib/supabase.ts` | S | Low | 2 | 1.0 | 2026-06-14 | Backlog |
| TD-006 | Code Quality | `KnowledgeGraph.tsx` is 529 lines (over the 500-line god-object threshold), combining data fetch, force-simulation physics, canvas rendering, and pointer interaction in a single component. Hard to test or modify in isolation. | `src/components/KnowledgeGraph.tsx` | L | Low | 1 | 0.3 | 2026-06-14 | Backlog |

## Notes on accepted (non-debt) patterns

- **Centralized state in `App.tsx`** — documented design choice in `CLAUDE.md` ("All
  top-level UI state lives in `App.tsx`"). Conscious, not debt.
- **No `TODO`/`FIXME`/`HACK`/`@deprecated`/`@ts-ignore`/`as any` markers** were found
  anywhere in the source. The codebase is clean of literal debt markers; everything
  above was inferred from structure and behavior.

## Recommended next steps

1. **TD-002 (search escaping)** — smallest contained fix with real correctness impact.
2. **TD-003 (TOC navigation)** — most visible broken feature; medium effort.
3. **TD-001 (test scaffolding)** — highest long-term payoff; large effort, schedule deliberately.
