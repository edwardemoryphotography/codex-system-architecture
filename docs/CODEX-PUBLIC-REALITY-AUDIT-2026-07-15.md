# Codex Public Reality Audit — 2026-07-15

## Executive result

The canonical Codex viewer, its production database, and its production UI now
enforce a machine-readable provenance contract for every one of the 59 public
Codex documents. All five unresolved findings from pull request #19 were fixed
and merged in pull request #20. The corrective Supabase migrations were applied
to the production project and verified with direct SQL. The production viewer
was then exercised in a real browser.

The wider public-surface audit found unresolved truth-labeling problems outside
the canonical viewer. In particular, Legacy Codex is published under three
Vercel project surfaces and describes itself as operational and free of mock
data while presenting hard-coded personal/system claims without provenance.
`codex-control-panel` contains unsupported business targets, pricing, biometric
thresholds, health/work-style claims, and system-status claims without
provenance. Three EEG repositories also overstate or contradict their current
implementation status. A separate `public-preview` deployment displays
dashboard-like personal state values without a source or provenance.

This report does not silently convert those claims into facts. They remain
explicit remediation findings.

## Scope and method

- GitHub inventory: 52 repositories, of which 24 were public.
- Source inspection: all 20 non-empty public repositories were shallow-cloned
  and searched; four archived public repositories were confirmed empty.
- Vercel inventory: all 29 projects in the connected team were inspected.
- Deployed surfaces: 20 projects exposed public domains; 18 returned a live
  application and two returned a 404 shell during the audit. Nine projects had
  no deployed public domain.
- Browser testing: the canonical production viewer received full functional
  testing. Every other live public project received a rendered root-page audit.
- Static bundle limitation: a bulk attempt to retrieve 93 Vercel JavaScript
  assets timed out. No bundle-wide claim is made. Repository source inspection
  and rendered-browser inspection are the evidence used here.
- “Clean” below means no simulated Eddie-specific personal claim was found by
  this audit. It does not certify the entire repository for every security,
  correctness, or licensing concern.

## Completed canonical remediation

### Pull request findings

Pull request #20 fixed and closed all five unresolved review threads from pull
request #19:

1. Dollar-delimited text is now emitted with a static SQL delimiter.
2. Markdown H1 extraction accepts CRLF line endings.
3. Canonical parent paths resolve to live Supabase UUIDs.
4. Documents embedded in bookmark and recent-page responses receive canonical
   titles, bodies, read-only state, and provenance.
5. Persistence rejects synthetic corpus IDs and any non-UUID document ID.

Pull request: <https://github.com/edwardemoryphotography/codex-system-architecture/pull/20>

Merged commit: `4e476264e6d05d25f6db860f335b76416e8cb981`

### Provenance contract

Every canonical personal-information document requires:

| Field | Requirement |
|---|---|
| `provenance_status` | Non-empty array containing only `verified`, `repository_evidence`, `concept`, or `unknown` |
| `evidence_basis` | Non-empty text identifying the basis for the classification |
| `last_reviewed` | Review date |
| `is_read_only` | `true` for the public canonical corpus |

The contract is enforced in TypeScript, canonical source generation, merge
logic, tests, the visible document UI, and Supabase constraints. Stale database
copy cannot override reviewed repository copy. Unknown information remains
unknown; a repository or deployment existing is not proof of every claim made
inside it.

### Supabase correction and verification

The deployed viewer uses the `foundry-console` production project
`pkydkbuodikttfeawqsw`. The previous `hzz…` project reference was stale.

Applied migrations:

- `enforce_codex_provenance`
- `index_codex_document_parents`

Direct post-migration verification returned:

| Check | Result |
|---|---:|
| Canonical `/codex` rows | 59 |
| Rows with complete read-only provenance | 59 |
| Rows with invalid provenance | 0 |
| Known fabricated claims in active canonical rows | 0 |
| Broken parent relationships | 0 |
| Canonical root rows | 1 |
| Preserved unrelated legacy rows without paths | 5 |

The allowed values observed in production were exactly `concept`,
`repository_evidence`, `unknown`, and `verified`. The corrected gear document
contains the Sony A7 III and RX10 IV and does not claim an A7R IV or A7S III.

Supabase advisors were rerun after adding the parent index. Remaining advisor
warnings concern pre-existing Foundry schema policies and function settings,
not this corpus migration. The public `SELECT` policy for canonical documents
is intentional; anonymous personal-interaction writes are not enabled.

## Production feature verification

Production URL: <https://codex-system-architecture.vercel.app/>

The merged Vercel deployment reached `READY`; Vercel and Netlify checks passed,
the canonical URL returned HTTP 200, and no Vercel runtime errors appeared in
the inspected one-hour window.

| Feature | Production result |
|---|---|
| Documents | Loaded from the live 59-row corpus with visible provenance and evidence |
| Search | “Gear Specs” returned the correct canonical path and document |
| Document truth | Gear page showed Sony A7 III and RX10 IV; known false bodies did not appear |
| Bookmarks | Disabled, with “Personal bookmark storage is not enabled” |
| Recent pages | Empty/absent because `reading_progress` is not deployed; no simulated recents |
| Notes | Disabled, with “Personal note storage is not enabled” |
| Command palette | Opened, searched live documents, and navigated to the selected result |
| Provenance UI | Displayed allowed status labels plus evidence; concept/unknown documents remained visibly qualified |

Bookmarks, notes, and recent history were tested as honest unavailable states.
They were not declared working and were not backed by anonymous shared tables.

## Public repository inventory and dispositions

### Action required

| Repository | Finding | Disposition |
|---|---|---|
| `codex-control-panel` | Hard-coded “personal operating system,” “v17 OPERATIONAL,” “no mock data,” `$100K` print target, `$137K` workshop target, `$237K` combined target, pricing, biometric thresholds, ADHD/autism workflow assertions, and energy schedules. No provenance fields exist. | **High:** unsupported personal/business/health/system claims are publicly served. Remove them or attach allowed provenance plus evidence before calling the surface reality-filter compliant. |
| `legacy-codex` | Public UI says “v27 — OPERATIONAL,” “Reality Filter Active,” and “No mock data.” Its Codex data includes personal identity, neurodivergence, mission, market, and operating claims without provenance. Deployment status defaults to the current date rather than externally verified state. | **High:** the blanket no-mock-data claim is not supported by the data model. Add provenance at the entry level and remove blanket truth claims. |
| `MuseEEGProject` | README claims `main.py`, automated CI/CD workflows, a comprehensive test suite, real-time streaming, and production portability. The public repository contains six files, no `main.py`, no workflow, and only `tests/test_placeholder.py`. | **High:** README materially overstates repository evidence. |
| `muse-neurofeedback` | README labels EEG streaming functional, Muse compatibility verified, and development active. Repository code implements an OSC-to-WebSocket bridge, but `STATE.md` says the Muse 2 system is blocked by Docker errors and WHOOP is unstarted. | **Medium:** implementation evidence exists, but operational/verified status is contradictory and lacks dated provenance. |
| `neurocreative-platform` | Overview says it connects Muse 2 data with WHOOP 4.0, while the status table, feature list, and roadmap say WHOOP integration is in progress/planned. | **Medium:** change the overview to a concept/planned statement and add provenance. |
| `codex-system-architecture` | Active canonical copy is corrected and enforced. Older, already-applied migration files retain historical fabricated strings, and tests retain them as rejection fixtures. | **Controlled historical evidence:** not active copy; keep clearly documented and never use as a current source. |

### No Eddie-specific simulated personal claim found

The audit found no Eddie-specific simulated personal claim in these public
repositories:

- `agenticSeek`
- `agentmemory`
- `brew`
- `claude-code-game-studios`
- `gemini-cli`
- `loopndroll`
- `mem-layer`
- `opencode`
- `plugins`
- `retain`
- `snag`
- `stackblitz-starters-xkcxeg`
- `superwhisper-claude-code`
- `vibetunnel`

Generic examples, upstream documentation, template identities, and test
fixtures were not treated as claims about Eddie.

### Confirmed empty archived repositories

- `muse-r3f-visualizer`
- `congenial-spork`
- `congenial-spork-d400e`
- `congenial-spork-4eec4`

## Deployed-site inventory and dispositions

### Public personal-claim findings

| Public surface | Finding | Disposition |
|---|---|---|
| <https://legacy-codex.vercel.app/> | Legacy Codex duplicate: “OPERATIONAL,” “Reality Filter Active,” and “No mock data,” with unsourced personal/system content | **High** |
| <https://legacy-codex-kappa.vercel.app/> | Same Legacy Codex application under a second project/domain | **High** |
| <https://codex-starforge-dashboard.vercel.app/> | Same Legacy Codex application under a third project/domain | **High** |
| <https://codex-control-panel-two.vercel.app/> | Source repository contains the unsupported personal/business/health claims listed above | **High** |
| <https://public-preview-tau.vercel.app/> | Displays dashboard-like state such as “Open loops 12” and “Lunch mode 45 min” without a source or provenance | **Medium** |

### Public surfaces with no simulated Eddie-specific claim found on the rendered root

- <https://codex-system-architecture.vercel.app/> — fully tested, not only root-inspected
- <https://foundry-console-omega.vercel.app/> — owner sign-in boundary; latest build was `ERROR`, but an earlier production deployment served the sign-in page
- <https://artful-intelligence.vercel.app/>
- <https://intimate-detector-prototype.vercel.app/>
- <https://v0-designer-portfolio-three-mauve.vercel.app/> — generic “Alex Chen” template identity, not presented as Eddie
- <https://v0-aura-vibes-pulse-ecru.vercel.app/>
- <https://create-react-app-ashy-nine-96.vercel.app/>
- <https://neuroviz-eeg-3d-mvp.vercel.app/>
- <https://wizi-ai-code-search-pj8d.vercel.app/>
- <https://scope-builder-mocha.vercel.app/>
- <https://nextjs-nine-roan-hhhl0oc48s.vercel.app/>
- <https://camera-and-onject-detection-app.vercel.app/>
- <https://artful-intelligence-webhook.vercel.app/>

`superwhisper-claude-code.vercel.app` and `comet-lite-v3.vercel.app` returned
404 shells. They did not expose a rendered personal claim during this audit.

### Projects without deployed public domains

- `v0-aleodev-ltd`
- `v0-finance-app`
- `v0-grok-creative-studio`
- `v0-shader-gradient-component`
- `get-started-with-upstash-redis-and-next-js`
- `v0-neon-maze`
- `v0-fork-of-grimoire-chapter-1`
- `v0-portfolio`
- `v0-nano-banana-pro-playground`

## Required cleanup outside the canonical viewer

The canonical Codex requirement is complete. Global public-surface compliance
is not complete until the findings above are corrected. The safe order is:

1. Remove or qualify the blanket “No mock data” and “OPERATIONAL” assertions on
   all three Legacy Codex deployment surfaces.
2. Replace unsupported numeric, health, neurodivergence, business, and system
   assertions in `codex-control-panel` with evidence-backed records or
   `unknown`/`concept` classifications.
3. Add visible provenance and evidence fields to each Legacy Codex entry that
   contains personal information.
4. Correct EEG README status tables to match repository evidence and the dated
   blocker record.
5. Remove the simulated values from `public-preview` or connect them to a real,
   dated source with allowed provenance.
6. Redeploy affected projects and repeat rendered-browser verification.

Until those actions are completed, the canonical viewer is provenance-safe,
but the broader public ecosystem is not uniformly reality-filter compliant.
