# Codex Deployment Manifest

**Status:** Proposed canonical deployment contract  
**Audit date:** 2026-08-26  
**Tracking issue:** #40  

> This document distinguishes verified current state from target architecture. It must not be used to imply that a component has been absorbed, retired, or redirected until that change has been directly verified.

## 1. Canonical product decision

**Legacy Codex is the production product.**

The human-facing production entry point should remain:

- `https://legacy-codex.vercel.app`

The target is one obvious private operational product. Foundry and routing/control capabilities are product areas inside that system, not competing product identities.

## 2. Verified current state

### Duplicate Legacy Codex production deployments

Vercel currently has two Next.js projects deploying the same GitHub repository and the same production commit:

| Vercel project | Human-facing alias | GitHub repo | Branch | Verified production SHA | Current role |
|---|---|---|---|---|---|
| `frontend` | `legacy-codex.vercel.app` | `edwardemoryphotography/legacy-codex` | `main` | `bd79ce88cbe2f7f4fd3d112f6089428c63165ed5` | Holds the canonical URL today |
| `legacy-codex` | `legacy-codex-kappa.vercel.app` | `edwardemoryphotography/legacy-codex` | `main` | `bd79ce88cbe2f7f4fd3d112f6089428c63165ed5` | Duplicate production project |

**Conclusion:** these are currently redundant production deployments of the same root app at the same commit.

### Foundry Console

- Standalone production alias: `foundry-console-replacement.vercel.app`
- Standalone Vercel project: `foundry-console`
- The Foundry source also exists inside `edwardemoryphotography/legacy-codex` at `foundry-console/`.
- Its documented purpose is an owner-only operator console backed by real Supabase data.

### Codex Control Panel

- Standalone production alias: `codex-control-panel-two.vercel.app`
- Vercel project: `codex-control-panel`
- GitHub repo: `edwardemoryphotography/codex-control-panel`
- Its documented purpose is a mobile-first dispatcher/router for Legacy Codex.

### System Architecture

`edwardemoryphotography/codex-system-architecture` is the visual/documentation layer for the Codex ecosystem. Its own README explicitly says the viewer documents real projects and labeled designs but is not proof that every mapped system is deployed, integrated, or automated.

## 3. Target ownership model

| Surface | Target classification | Decision |
|---|---|---|
| Legacy Codex root app | **CANONICAL** | One production product and one obvious entry point |
| Foundry Console | **COMPONENT** | Converge into Legacy Codex as the builder/operator area |
| Codex Control Panel | **COMPONENT** | Converge routing/dispatcher capability into Legacy Codex |
| codex-system-architecture | **DOCUMENTATION** | Keep as architecture / knowledge / explainer surface, not the production runtime |
| Artful Intelligence | **SEPARATE PRODUCT** | May consume Codex infrastructure; do not merge product identity into Legacy Codex |

## 4. Recommended surviving Vercel project

**Recommendation:** keep the Vercel project named `legacy-codex` as the surviving root production project because its project identity matches the canonical GitHub repository and product name.

Before changing anything:

1. Compare environment variables between `frontend` and `legacy-codex`.
2. Compare project root directory, framework settings, Node version, build settings, functions, and protection settings.
3. Confirm both produce equivalent behavior at the same Git SHA.
4. Move `legacy-codex.vercel.app` from `frontend` to `legacy-codex` only after parity is proven.
5. Verify the canonical URL after the alias move.
6. Only then retire the duplicate `frontend` Vercel project and remove the `legacy-codex-kappa.vercel.app` alias if no longer needed.

## 5. Codex-linked Vercel classification queue

The following projects were visible in the Vercel account during the audit and are directly Codex-named or linked to the `legacy-codex` repository:

| Vercel project | Current evidence | Provisional classification | Retirement gate |
|---|---|---|---|
| `legacy-codex` | Root repo deployment | **CANONICAL TARGET** | Keep |
| `frontend` | Same repo + same production SHA as `legacy-codex`; owns canonical alias | **RETIRE AFTER MIGRATION** | Alias/env/config parity verified |
| `foundry-console` | Standalone operator console | **COMPONENT / ABSORB** | Foundry feature parity inside canonical product |
| `codex-control-panel` | Standalone Legacy Codex dispatcher | **COMPONENT / ABSORB** | Router/dispatcher parity inside canonical product |
| `codex-system-architecture` | Architecture/document viewer | **KEEP — DOCUMENTATION** | Not a runtime retirement target |
| `codex-starforge-dashboard` | Vercel project linked to `legacy-codex` repo | **VERIFY** | Determine whether it is an active feature, experiment, or duplicate |
| `legacy-codex-vercel-diagnostic` | Diagnostic-named project linked to `legacy-codex` repo | **RETIRE CANDIDATE** | Confirm no active diagnostic dependency or unique env/config |
| `legacy-codex-pr49-preview` | Preview-named project | **RETIRE CANDIDATE** | Confirm no longer required for historical PR verification |
| `foundry-console-retired` | Explicitly retired name, linked to `legacy-codex` | **RETIRE CANDIDATE** | Confirm no domain/env dependency remains |

Projects not clearly Codex-related are outside this cleanup until independently classified. Do not infer ownership from a vague project name.

## 6. Product route target

The desired user mental model is:

```text
Legacy Codex
├── Mission
├── Overview
├── Protocols
├── Sprint / Resumption
├── Biometrics
├── Codex knowledge
├── Controls / Routing
├── Foundry / Operator
└── Consolidation / system status
```

Supporting surfaces:

```text
codex-system-architecture
└── documentation, architecture map, reviewed corpus, explainer

Artful Intelligence
└── separate product/business using Codex infrastructure where appropriate
```

## 7. Rules that prevent deployment sprawl from returning

1. **No new production Vercel project for a Codex feature by default.** Add a route/component to the canonical product first.
2. New Vercel projects must be explicitly labeled as `PREVIEW`, `EXPERIMENT`, `DIAGNOSTIC`, `DOCUMENTATION`, or a genuinely separate product.
3. A preview/diagnostic project must have an owner and retirement condition when created.
4. Agents must treat `legacy-codex.vercel.app` as the canonical production entry point unless this manifest is intentionally superseded.
5. `codex-system-architecture` documents the system; it does not become a second operational source of truth.
6. Never delete a Vercel project until domains, environment variables, root directory, build configuration, current production SHA, and unique capabilities are verified.
7. Preserve real data and real integrations. Do not replace missing production behavior with mock or synthetic data to make consolidation appear complete.

## 8. Definition of done

Consolidation is complete only when:

- [ ] `legacy-codex.vercel.app` resolves to the single surviving canonical Legacy Codex production project.
- [ ] The duplicate root production project is retired.
- [ ] Foundry capability is reachable from the canonical Legacy Codex product, or an explicitly documented architectural reason exists for keeping it as a separate service.
- [ ] Routing/Control Panel capability is reachable from the canonical Legacy Codex product, or an explicitly documented architectural reason exists for keeping it as a separate service.
- [ ] Diagnostic/preview/retired Codex projects are either removed or explicitly retained with a current purpose.
- [ ] Agent instructions and architecture docs name the same canonical production entry point.
- [ ] No functionality, environment requirement, data access, or production behavior was lost during consolidation.
