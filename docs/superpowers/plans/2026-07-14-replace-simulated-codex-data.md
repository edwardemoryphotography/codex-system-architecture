# Replace Simulated Codex Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Subagent execution is disabled for this task.

**Goal:** Remove every unsupported personal claim from the deployed Codex site and replace it with verified facts, honest project statuses, or explicit unknowns.

**Architecture:** Keep the existing document paths and navigation, but replace the generated body corpus with a concise, provenance-labeled source of truth. Merge live Supabase rows with canonical repository content by path so stale database text cannot override corrections, and add a forward-only data migration to repair stored rows.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, Supabase/PostgreSQL, Vercel

## Global Constraints

- Do not use mock, sample, synthetic, placeholder, or invented personal data.
- Do not represent a concept, goal, or design as deployed/current functionality.
- Preserve unknown values as `Unknown — not yet verified`.
- Every leaf document must show its evidence status and last reviewed date.
- Do not edit migrations that may already be applied; add one forward-only corrective migration.
- Preserve existing paths and document IDs so bookmarks, notes, and links remain valid.

---

### Task 1: Corpus Reality Contract

**Files:**
- Modify: `src/content/codexCorpus.test.ts`
- Create: `src/content/codexReality.test.ts`

- [ ] Add a failing test requiring all 59 corpus entries to have a non-empty canonical body.
- [ ] Add failing tests rejecting known false equipment, fabricated revenue, invented biometric metrics, fake integration status, and obsolete project dates.
- [ ] Add a failing test requiring each leaf document to include `Evidence status` and `Last reviewed: 2026-07-14`.
- [ ] Run `npm test -- src/content/codexReality.test.ts` and confirm failures come from the current fabricated corpus.

### Task 2: Verified Canonical Corpus

**Files:**
- Replace: `src/content/codexDocumentBodies.ts`
- Modify: `src/content/codexCorpus.ts`

- [ ] Replace all generated bodies with concise content grounded in user-confirmed facts and repository evidence.
- [ ] Correct owned gear to Sony A7 III, Sony RX10 IV, Sony 20mm f/1.8 G, Rokinon 14mm f/2.8, Sony 24–70mm f/4 Zeiss, Star Adventurer Pro, and Star Adventurer Mini.
- [ ] Correct Namibia to a 2027-or-2028 workshop relaunch candidate with no confirmed date, bookings, route, price, or participant count.
- [ ] Mark Firefall as an unverified idea with no confirmed trip.
- [ ] Separate shipped software from concepts, prototypes, paused work, and blocked integrations.
- [ ] Replace fabricated analytics, revenue, budgets, counts, performance targets, and health claims with verified facts or explicit unknowns.
- [ ] Run the corpus tests and confirm they pass.

### Task 3: Canonical Content Wins Over Stale Supabase Rows

**Files:**
- Modify: `src/content/codexCorpus.ts`
- Modify: `src/lib/supabase.ts`
- Modify: `src/lib/supabase.test.ts`

- [ ] Add a failing test where a live row contains the Sony A7R IV text and the merged result returns the corrected canonical body while preserving the live row ID and timestamps.
- [ ] Implement a pure merge helper keyed by document path.
- [ ] Use that helper in `getDocuments()` and `getDocumentByPath()` so stale database content cannot override canonical content.
- [ ] Run `npm test -- src/lib/supabase.test.ts src/content/codexReality.test.ts`.

### Task 4: Forward-Only Supabase Repair Migration

**Files:**
- Create: `supabase/migrations/20260714000000_replace_simulated_codex_content.sql`

- [ ] Generate one `UPDATE ... FROM (VALUES ...)` statement containing the canonical title and body for every corpus path.
- [ ] Update `updated_at` and leave IDs, parent IDs, notes, bookmarks, tags, and links unchanged.
- [ ] Add a migration assertion that raises an exception if any expected path is missing.
- [ ] Validate the SQL against the connected Supabase project before applying it.

### Task 5: Audit Record and Repository Copy

**Files:**
- Create: `docs/CODEX-REALITY-AUDIT-2026-07-14.md`
- Modify: `README.md`
- Modify: `CLAUDE.md`

- [ ] Document the false-claim categories found and the correction rule used for each.
- [ ] Record verified sources without claiming inaccessible chat history or systems were scanned.
- [ ] Remove repository prose that incorrectly claims the architecture site is another repo's production frontend.
- [ ] Document that canonical personal content lives in the repository and Supabase stores synchronized copies.

### Task 6: Full Verification

**Files:** No new files.

- [ ] Run `npm test`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Run a repository-wide forbidden-claim scan excluding historical migrations, tests, and the audit report; explain every remaining match.
- [ ] Inspect `git diff --check`, `git status -sb`, and the full scoped diff.

### Task 7: Publish, Migrate, Deploy, and Verify

**Files:** No new files.

- [ ] Commit the scoped correction on `agent/replace-simulated-codex-data`.
- [ ] Push the branch and open a pull request through the connected GitHub app.
- [ ] Apply the forward-only migration to Supabase project `hzzzxmtpkgdmjcbncxjh` after local verification.
- [ ] Merge the verified change or deploy the connected branch according to repository protections.
- [ ] Verify the live Gear, Namibia, Business, Neuro, and Convergence pages no longer contain forbidden claims.
- [ ] Report the exact commit, PR, deployment URL, database migration, and any remaining unknowns.
