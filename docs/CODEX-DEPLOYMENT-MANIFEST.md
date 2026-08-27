# Codex Deployment Manifest

**Status:** Proposed canonical deployment contract  
**Audit date:** 2026-08-26  
**Configuration metadata rechecked:** 2026-08-27  
**Tracking issue:** #40  

> This document distinguishes verified current state from target architecture. It must not be used to imply that a component has been absorbed, retired, or redirected until that change has been directly verified.

## 1. Canonical product decision

**Legacy Codex is the production product.**

The human-facing production entry point should remain:

- `https://legacy-codex.vercel.app`

The target is one obvious private operational product. Foundry and routing/control capabilities are product areas inside that system, not competing product identities.

## 2. Verified current state

### Overlapping Legacy Codex production deployments — parity unverified

Vercel currently has two Next.js projects linked to the same GitHub repository, branch, and verified production commit:

| Vercel project | Human-facing alias | GitHub repo | Branch | Verified production SHA | Current role |
|---|---|---|---|---|---|
| `frontend` | `legacy-codex.vercel.app` | `edwardemoryphotography/legacy-codex` | `main` | `bd79ce88cbe2f7f4fd3d112f6089428c63165ed5` | Current canonical-alias owner; keep active pending parity checks |
| `legacy-codex` | `legacy-codex-kappa.vercel.app` | `edwardemoryphotography/legacy-codex` | `main` | `bd79ce88cbe2f7f4fd3d112f6089428c63165ed5` | Provisional consolidation target; keep active pending parity checks |

**Verified overlap:** both projects report Next.js, Node.js 24.x, the same repository/branch/SHA, Turbopack, and the same deployment region (`iad1`).

**Not yet verified:** root directory; install, build, development, or output-directory overrides; environment-variable parity; function settings; deployment protection; and behavior at the two production aliases.

**Current conclusion:** the projects are potential duplicates, not verified redundant deployments. Treat both as active until the configuration comparison and same-SHA behavior checks establish parity.

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

## 4. Provisional consolidation target and parity gate

**Provisional target:** prefer the Vercel project named `legacy-codex` only because its identity matches the canonical repository and product name. This naming preference is not evidence of deployment parity and does not authorize an alias move or project retirement.

Before changing anything, record a side-by-side comparison of:

1. Root directory and framework preset.
2. Install, build, development, and output-directory overrides.
3. Node.js version and package-manager behavior.
4. Environment-variable names and scopes for Production, Preview, and Development, plus a redacted per-variable result: `MATCH`, `MISMATCH`, or `MISSING`.
5. Function configuration, regions, deployment protection, and domain settings.
6. Same-SHA behavior at both production aliases, including authentication, `/api/analyze`, Foundry/operator routes, routing/control paths, and Supabase-backed reads/writes.

Compare actual environment-variable values only inside Vercel's secret-management surface. In repositories, issues, pull requests, chat, or logs, record only variable names, scopes, and the redacted result; never copy or persist secret values.

Proceed only if that evidence shows behavioral parity:

1. Move `legacy-codex.vercel.app` from `frontend` to `legacy-codex`.
2. Verify the canonical URL and critical paths after the alias move.
3. Retire `frontend` and remove `legacy-codex-kappa.vercel.app` only if no unique configuration, environment, domain, or behavior remains.

If parity is not established, keep both projects active and document the concrete difference before choosing a survivor.

## 5. Codex-linked Vercel classification queue

The following projects were visible in the Vercel account during the audit and are directly Codex-named or linked to the `legacy-codex` repository:

| Vercel project | Current evidence | Provisional classification | Retirement gate |
|---|---|---|---|
| `legacy-codex` | Same repo/branch/SHA as `frontend`; root/build/env/behavior parity not yet established | **PROVISIONAL CANONICAL TARGET** | Keep active until parity is proven |
| `frontend` | Same repo/branch/SHA as `legacy-codex`; owns canonical alias; root/build/env/behavior parity not yet established | **CURRENT ALIAS OWNER / RETIREMENT CANDIDATE** | Retire only after documented parity and successful alias migration |
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
