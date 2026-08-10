# Flock Hub Wiring — Agent Prompt

**Status:** Canonical handoff prompt
**Purpose:** Wire the Artful Intelligence unified hub (frontend, backend, intelligence) without regressing verified state or doctrine.
**Created:** August 10, 2026
**Updated:** August 10, 2026 — hub canonized into its own repo (see below).

---

You are working on "Artful Intelligence — One Home for the Whole Flock", a unified hub
for Eddie's ecosystem (Legacy Codex, Foundry Console, Control Panel, System Atlas,
PocketForge, Goose Cookbook, LLM Wiki).

## Where the hub lives (canonical)

**Repo: `edwardemoryphotography/artful-intelligence-hub`** (private). It contains:

- `src/pages/Home.tsx` — the hub UI (dark-first, Gemini-inspired, theme toggle)
- `supabase/migrations/20260810000000_constellation_status.sql` — the canonical
  migration for the live `constellation_status()` function
- `README.md` — verified-state record and agent rules

Do not rebuild the hub from scratch and do not look for it in codex-control-panel;
attach `artful-intelligence-hub` and work there. (This note exists because an agent
correctly refused to guess when the hub existed only outside any reachable repo.)

## Read first (non-negotiable)

1. `notion-wiki/docs/GOOSE-COOKBOOK.md` in edwardemoryphotography/codex-system-architecture
   — the canonical doctrine. Especially: the Goose Principle, CATCH THE FUCKING BOOMERANG,
   the MasterChef of Geese addendum, and Fear-Based DevOps.
2. The truth ladder is law: `Merged != Deployed != Runtime Verified != Live`.
   Never mark a feature Live without runtime evidence. Preserve honest pending/unknown states.
3. "Don't preserve every experience. Preserve what the experience taught the system."
   Recurrent lessons become structure (rules, tests, runbooks), not transcript archaeology.

## Current verified state (do not regress)

- Frontend: React + TS + Vite + Tailwind. `src/pages/Home.tsx` is a dark-first,
  Gemini-inspired hub with a light/dark toggle (`?theme=` override + localStorage).
- Live data: the hub calls `supabase.rpc('constellation_status')` against foundry-console
  (project ref `pkydkbuodikttfeawqsw`) using the publishable key. That function is
  SECURITY DEFINER, anon-safe, and returns only coarse aggregates (counts, lanes, repos,
  timestamps) — NEVER intent text, action titles, or user content. Any new public-facing
  function must uphold the same exposure contract. RLS on routed_requests, evidence_items,
  events, and actions is authenticated-only; do not weaken it.
- Ladder stages are derived client-side from real signals (routes confirmed, evidence
  verified, actions done). These heuristics are first-pass and marked as such.

## Your mission — three layers

### 1. Backend wiring
- Move the ladder derivation server-side: create `constellation_ladder()` (same anon-safe
  contract) that returns per-territory stage + signal, so the rules live in one canonical
  place instead of the client. Migrate the client to consume it; keep client-side fallback
  rendering honest when the control plane is unreachable (error pill already exists).
- Add Supabase Realtime subscriptions (or 30–60s polling fallback) so the ladder and the
  Control-plane-pulse event stream update without refresh.
- Owner sign-in: reuse the magic-link pattern already proven in Control Panel
  (`persist_route_owner` requires an authenticated session; there is no service-role key
  in the browser — keep it that way). Gate anything beyond read-only aggregates behind auth.

### 2. Intelligence (the command bar)
- Wire "Ask the flock anything…" to a Supabase Edge Function (`flock-ask`) that:
  - requires the owner session;
  - grounds answers in constellation_status + canonical doctrine (fetch GOOSE-COOKBOOK.md
    or a synced copy in DB) before answering;
  - can propose routes, but persistence MUST go through `persist_route_owner` /
    `persist_route_atomic` — never a side-channel insert;
  - returns structured responses the UI can render as cards (answer, proposed route,
    required evidence, confidence).
- The four doctrine chips become real prompt starters, not decoration.

### 3. Canonize the ladder rules
- The per-territory promotion rules (what counts as Merged/Deployed/Verified/Live for
  Legacy Codex, Foundry, Control Panel, System Atlas, PocketForge, Goose Cookbook,
  LLM Wiki) are a doctrine decision. Encode them as data (a `ladder_rules` table or
  versioned config) with provenance, so future agents inherit the rules instead of
  rediscovering them. Ask the owner before changing a rule's meaning.

## Verification protocol (Fear-Based DevOps — be relentless)

- `npm run typecheck`, `npm run lint`, full test suite, production build — all green.
- Test the anon path: constellation functions must return aggregates and nothing sensitive
  (write a test that asserts response keys).
- Test the unauthenticated UI path renders honestly (sync/error states, no fake Live).
- Verify realtime/polling against the real foundry-console project before claiming
  Runtime Verified. `Merged != Deployed != Runtime Verified != Live`.
- Green build != working integration. Say what you verified and how.

## Before closing (the final test)

Ask: "What did this interaction teach the system that the next instance should not have
to rediscover?" Encode the answer durably (migration, test, runbook, or doctrine note).
A goose is not always a goose. Catch the fucking boomerang.
