# codex-system-architecture — CLAUDE.md

Visual knowledge management SPA for the **Codex AI platform**: a neurodivergent execution and knowledge management system. This repo is the design/documentation layer; it visualizes how Codex components connect (AI agents, memory layers, automation workflows, UI shells).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18.3 + TypeScript 5.5 |
| Build | Vite 5.4 |
| Styling | Tailwind CSS 3.4 + PostCSS |
| Database | Supabase (PostgreSQL + RLS) |
| Icons | Lucide React |
| Linting | ESLint 9.9 + typescript-eslint 8.3 |
| Dev target | StackBlitz (browser-native) |

## NPM Scripts

```bash
npm run dev        # Vite dev server with HMR
npm run build      # Production build → dist/
npm run lint       # ESLint (TypeScript + React hooks rules)
npm run preview    # Preview production build locally
npm run typecheck  # tsc --noEmit (strict, no emit)
```

## Environment Setup

Copy `.env.example` to `.env.local` and fill in:

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

`.env.local` is gitignored — never commit it.

## Project Structure

```
src/
  App.tsx              # Root component: all top-level state, keyboard shortcuts, layout
  main.tsx             # ReactDOM.createRoot entry point
  index.css            # Tailwind directives only
  vite-env.d.ts        # Vite type reference
  components/          # 13 UI components (PascalCase.tsx)
  hooks/               # useFormValidation (generic form state + validation)
  lib/
    supabase.ts        # ALL Supabase queries live here — never query inline
    validation.ts      # Composable validator functions (required, email, minLength…)
  types/
    index.ts           # CodexDocument, CodexTag, DocumentWithTags interfaces
supabase/
  migrations/          # 9 sequential timestamped migration files
public/
```

## Key Components

| Component | Purpose |
|-----------|--------|
| `App.tsx` | Root state (selectedPath, darkMode, splitView, focusMode, search, tags), keyboard shortcuts, layout |
| `DocumentViewer.tsx` | Full document render with markdown, bookmarks, notes, reading progress, export |
| `KnowledgeGraph.tsx` | Force-directed canvas graph; physics simulation; hover/drag/zoom/double-click |
| `CommandPalette.tsx` | Cmd+K modal: grouped search (docs, bookmarks, recent, actions), keyboard navigation |
| `Navigation.tsx` | Sidebar: document tree from Supabase, category sections, current path highlighting |
| `MarkdownRenderer.tsx` | Custom markdown→JSX with syntax highlighting, dark mode aware |
| `SplitView.tsx` | Side-by-side document comparison with independent selections |
| `SearchBar.tsx` | Real-time full-text search with 150 ms debounce, category filter |
| `TableOfContents.tsx` | Auto-generated from markdown headings, click-to-scroll |
| `TagFilter.tsx` | Filter documents by tags; colored tag pills |
| `ExportMenu.tsx` | Export to Markdown / PDF / JSON |
| `Toast.tsx` | Context-provider toast notifications, dark mode aware |
| `ParticleField.tsx` | Decorative animated canvas background with mouse interaction |
| `FeedbackFormExample.tsx` | Demo of `useFormValidation` hook |

## Naming Conventions

- **Components**: `PascalCase.tsx`
- **Props interfaces**: `{ComponentName}Props`
- **Custom hooks**: `use{Feature}` (e.g., `useFormValidation`)
- **Utility functions**: `camelCase`
- **Database tables / columns**: `snake_case`
- **Constants / color maps**: `camelCase` objects (e.g., `categoryColors`)

## Supabase Schema

All data access goes through `src/lib/supabase.ts` — never write inline Supabase calls in components.

| Table | Key Columns | Notes |
|-------|-------------|-------|
| `codex_documents` | `id`, `title`, `path` (unique), `content`, `category`, `parent_id`, `order` | Core content table |
| `codex_tags` | `id`, `name` (unique), `color` | Tag definitions |
| `codex_document_tags` | `document_id` + `tag_id` (composite PK) | Junction table |
| `reading_progress` | `document_id` (PK), `scroll_position`, `time_spent_seconds`, `completed` | Upserted every 5 s |
| `bookmarks` | `id`, `document_id` | User bookmarks |
| `document_notes` | `id`, `document_id`, `content`, `position` | Inline annotations |
| `document_links` | `source_document_id`, `target_document_id`, `link_type` | Graph edges |

**RLS**: All tables allow public access (no auth required) — reads and writes (`addBookmark`, `updateReadingProgress`, `addDocumentNote`) work without authentication. No user sign-in is implemented.

Migrations are in `supabase/migrations/` as timestamped SQL files. Run them in order; do not edit applied migrations.

## State Management

- All top-level UI state lives in `App.tsx` as `useState`.
- Supabase is the sole source of truth for document data — no local cache layer.
- `localStorage` is used only for dark mode persistence (`darkMode`).
- No Redux, Zustand, or other state library — the app is simple enough.

## Category Color System

The app has 9 named categories. Each entry in the `categoryColors` map provides:
`{ bg, text, border, darkBg, darkText, darkBorder }`

When adding a new category:
1. Add it to the `categoryColors` map in the component that renders it.
2. Never hardcode Tailwind color classes for categories inline — always read from the map.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl+K` | Open command palette |
| `Cmd/Ctrl+G` | Open knowledge graph |
| `Cmd/Ctrl+Shift+F` | Toggle focus mode |
| `Cmd/Ctrl+\` | Toggle split view |
| `Esc` | Close modals / exit focus mode |

## Coding Rules

- All Supabase queries belong in `src/lib/supabase.ts` — components call these functions.
- Use `useCallback` for event handlers passed as props to avoid needless re-renders.
- Use `useRef` for canvas refs, animation frame IDs, and DOM refs — not `useState`.
- Tailwind only for styling — no inline `style` props unless dealing with dynamic canvas/SVG values.
- Dark mode is prop-drilled as `isDarkMode: boolean` for component logic; the root `dark` class on `document.documentElement` is managed in `App.tsx` for Tailwind's `dark:` variant support.
- Form validation: use the existing `useFormValidation` hook + `src/lib/validation.ts` validators; do not add external form libraries.
- Canvas rendering: always account for `devicePixelRatio` to avoid blurry output on retina screens.
- Reading progress: upserted to Supabase every 5 seconds from `DocumentViewer` — do not increase this frequency.

## Performance Patterns

- Debounce search at 150 ms (`SearchBar`).
- Debounce form validation at 300 ms (`useFormValidation` default).
- Knowledge graph data is fetched lazily on modal open — do not preload.
- Canvas-based components manage their own animation loop via `requestAnimationFrame` stored in a `useRef`.

## Agent behavior

How AI assistants should work in this repo. Adapted from [Karpathy behavioral guidelines](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/.cursor/rules/karpathy-guidelines.mdc). **Coding Rules** and **Performance Patterns** above win for project-specific facts.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks (typos, comment-only), use judgment.

### Instruction precedence

1. The user's request for the current task
2. This file (`CLAUDE.md`) — stack, schema, conventions, and agent behavior
3. [`AGENTS.md`](./AGENTS.md) — entrypoint and verification checklist
4. Tool-specific files (e.g. `.cursor/rules/`) — pointers only; must not contradict this file

### Think before coding

- State assumptions explicitly; ask when uncertain.
- If multiple interpretations exist, present them — do not pick silently.
- If a simpler approach exists, say so.
- If something is unclear, stop and name what is confusing.

### Simplicity first

- No features, abstractions, or configurability beyond what was asked.
- No error handling for impossible scenarios.
- If the diff is much larger than the task requires, simplify.

### Surgical changes

- Do not "improve" adjacent code, comments, or formatting.
- Match existing style; every changed line should trace to the request.
- Remove imports or symbols only if **your** changes made them unused.
- Mention unrelated dead code; do not delete it unless asked.

### Goal-driven execution

Turn requests into verifiable outcomes, for example:

- "Fix the bug" → reproduce, fix, then confirm with checks below
- "Add validation" → invalid inputs rejected; `npm run typecheck` passes
- "Refactor X" → same behavior; `npm run typecheck && npm run lint` pass

For multi-step work, state a short plan with a verify step per step.

### Verification (before claiming done)

| Change type | Verify |
|-------------|--------|
| TypeScript / React (`src/`) | `npm run typecheck && npm run lint` |
| Build / Vite config | Also `npm run build` |
| Supabase schema | New file in `supabase/migrations/`; do not edit applied migrations |
| UI behavior | `npm run dev` and exercise affected flows |

Do not claim success without running the checks that apply to your diff.

## Related Repos in the Codex Ecosystem

| Repo | Role |
|------|------|
| [`legacy-codex`](https://github.com/edwardemoryphotography/legacy-codex) | Neurodivergent execution framework (this repo's production front-end) |
| `neurocreative-platform` | EEG + WHOOP biometric backend |
| `mem-layer` | AI memory/conversation aggregation |
