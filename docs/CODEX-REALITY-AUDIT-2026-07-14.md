# Codex Reality Audit — 2026-07-14

> **2026-07-15 correction:** The database-access limitation recorded in this
> audit has been resolved. Production was verified to use the `foundry-console`
> Supabase project (`pkydkbuodikttfeawqsw`), not the stale project reference
> cited below. The corrective provenance and parent-index migrations were
> applied and verified against all 59 canonical rows. See
> [CODEX-PUBLIC-REALITY-AUDIT-2026-07-15.md](./CODEX-PUBLIC-REALITY-AUDIT-2026-07-15.md)
> for the completed database, production-flow, repository, and deployment
> audit. The original text remains below as a dated record of what was known
> on 2026-07-14.

## Executive finding

The deployed Codex viewer could not be trusted as a record of Eddie's actual life, equipment, business, health data, or system status.

All **59 of 59 document bodies** lacked provenance and were replaced. This does **not** mean every sentence was false; it means none of the bodies reliably separated fact from generic guidance, generated examples, goals, or unimplemented architecture. Concrete false claims appeared across every major domain.

## Evidence inspected

- User-provided screenshot of the deployed Gear Specifications page.
- Live Vercel response from `https://codex-system-architecture.vercel.app`.
- GitHub repository `edwardemoryphotography/codex-system-architecture` at main commit `c9ba5ee` before this correction.
- Static corpus in `src/content/codexDocumentBodies.ts`.
- Corpus registry in `src/content/codexCorpus.ts`.
- Supabase seed and rich-content migrations in `supabase/migrations/`.
- User-confirmed profile, equipment, project history, product definitions, and working preferences available to this task.

The connected Supabase project could not be queried in this session because the connector denied project access. No database-state claim is made beyond what is observable in repository migrations and application code.

## What was fabricated or unsupported

### Equipment ownership

The site claimed ownership of camera bodies, lenses, tripods, heads, and filters that were never confirmed, including two different Sony camera bodies presented as primary equipment.

The corrected owned camera and lens inventory is:

- Sony A7 III
- Sony RX10 IV
- Sony 20mm f/1.8 G
- Rokinon 14mm f/2.8
- Sony 24–70mm f/4 Zeiss Vario-Tessar
- Star Adventurer Pro
- Star Adventurer Mini

Unverified support equipment is now explicitly unknown instead of filled with premium-product examples.

### Travel and photography projects

The site presented a detailed February 2026 Yosemite Firefall trip with dates, locations, equipment, and success criteria as a real plan. No confirmed booking or trip record was available.

It also presented Namibia as a booked 14-day June 2026 expedition with a route, gear list, budget, and shot list. The corrected state is a workshop concept being considered for **2027 or 2028**, with no confirmed departure date, final route, final price, or participant roster.

### Business and finances

The public site contained invented revenue mixes, a $15,000 monthly target, year-to-date progress, account balances, expenses, deductions, estimated taxes, and margins. It also displayed generated workshop economics and conversion funnels as if they described Eddie's operation.

All private financial figures were removed from the public corpus. The Money OS page now states that exact figures require fresh verification in a private, access-controlled system.

### Neurotechnology and health

The site turned Muse and WHOOP ideas into an apparently functioning adaptive system. It implied live integrations, model performance, recovery scheduling, and measured correlations without a real dated dataset.

The corrected pages distinguish:

- confirmed Muse 2 ownership and Mind Monitor/OSC prototype work;
- exploratory rule-based state ideas;
- unverified current WebSocket and WHOOP runtime status;
- no trained or validated adaptive model;
- no medical, diagnostic, or clinical claims.

### Analytics and performance

Unsupported examples included:

- a 63-session recovery analysis;
- location-focus scores and session counts;
- monthly five-figure revenue comparisons;
- a negative revenue-versus-satisfaction correlation;
- retrieval latency, relevance, satisfaction, and accuracy figures;
- system-health percentages and version status.

All such measurements were removed. Where real measurements do not exist, the page now says unknown or not measured.

### Software and automation status

The corpus routinely described designs as completed systems: autonomous council roles, multi-agent orchestration, automated fulfillment, continuous ingestion, adaptive scheduling, memory aggregation, and RAG infrastructure.

The corrected corpus distinguishes observable source code and deployments from runtime status. A repository, migration, or Vercel project no longer counts as proof that an end-to-end feature is active.

## Root cause

1. Large December 2025 SQL migrations inserted generic rich content into `codex_documents`.
2. Main commit `c9ba5ee` copied that content into a static fallback, so the false corpus existed in both database-oriented history and frontend source.
3. `getDocuments()` returned complete live Supabase rows unchanged. The fallback only activated for lean or failed datasets.
4. There was no provenance field, evidence label, forbidden-claim test, or policy preventing generated examples from being displayed as personal truth.

## Correction implemented

- Replaced all 59 public document bodies with concise, evidence-labeled content.
- Added `Evidence status`, `Evidence basis`, and `Last reviewed` to every page.
- Renamed misleading display titles while preserving paths for links and stored relationships.
- Made reviewed repository copy authoritative over matching Supabase rows while preserving live IDs, relationships, and timestamps.
- Added regression tests for the false equipment, metrics, project dates, and financial exposure.
- Added a generated forward-only Supabase migration that updates all 59 paths and aborts if any path is missing.
- Added a reproducible migration generator so database copy comes from the same canonical corpus.

## Historical migration policy

Previously applied migrations are not edited. They remain historical evidence of how the bad content entered the system. The new forward-only repair migration supersedes their stored copy.

Because old migrations still contain the false text, repository-wide searches must distinguish historical migration files from active canonical content. The active application and the corrective migration are required to contain no forbidden ownership or performance claims.

## Remaining blockers and unknowns

- The corrective Supabase migration is committed but not confirmed applied; the connected tool denied access to project `hzzzxmtpkgdmjcbncxjh` during this audit.
- The production Vercel URL will remain unchanged until the correction branch is merged or otherwise deployed.
- Several filenames retain old names such as `firefall_2026.md` and `namibia_2026.md` to preserve stable paths; their display titles and contents now show the real status.
- Runtime status of separate repositories and integrations must be inspected in their own audits.

## Permanent rule

No future Codex document may present generated examples as Eddie's current data. Unknown is an acceptable value. Invented specificity is not.
