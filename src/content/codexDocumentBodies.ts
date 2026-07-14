type EvidenceStatus =
  | 'VERIFIED FACTS'
  | 'CANONICAL DESIGN'
  | 'VERIFIED PROJECT STATUS'
  | 'MIXED — FACTS AND UNIMPLEMENTED DESIGN'
  | 'UNVERIFIED CONCEPT — NOT IMPLEMENTED';

function documentBody(
  title: string,
  status: EvidenceStatus,
  evidenceBasis: string,
  body: string,
): string {
  return `# ${title}

**Evidence status:** ${status}
**Evidence basis:** ${evidenceBasis}
**Last reviewed:** 2026-07-14

${body.trim()}
`;
}

/**
 * Public, canonical content for the Codex architecture viewer.
 *
 * Rules:
 * - Personal facts must be user-confirmed.
 * - Repository facts must be observable in the named repository.
 * - Designs and goals must never be presented as running systems.
 * - Unknown values remain unknown.
 */
export const CODEX_DOCUMENT_BODIES: Record<string, string> = {
  '/codex': documentBody(
    'Codex',
    'CANONICAL DESIGN',
    'User-confirmed product definition plus this repository structure.',
    `Codex is the map of Eddie's personal cognitive operating system and connected creative work.

## Product boundary

- **Legacy Codex:** the personal cognitive operating system. It answers what matters now, what should happen next, and what context must not be lost.
- **Foundry Console:** the builder and operations environment for tools, agents, integrations, and deployments.
- **This site:** a documentation and architecture viewer. It does not prove that every system shown is deployed or automated.

## Truth rule

Facts, active software, plans, and unimplemented concepts are labeled separately. A blank or unknown value is preferable to an invented one.`,
  ),

  '/codex/root': documentBody(
    'Root',
    'CANONICAL DESIGN',
    'User-confirmed identity and operating preferences.',
    `The Root territory holds identity, working style, and the Reality Filter.

It is not an analytics engine. It contains durable context that should guide decisions across photography, software, business, and personal systems.`,
  ),

  '/codex/root/identity.md': documentBody(
    'Identity',
    'VERIFIED FACTS',
    'User profile and user-confirmed professional history.',
    `Edward Emory Photography is a professional photographer, timelapse filmmaker, teacher, and self-taught AI/software builder.

## Creative practice

- Primary specialties: astrophotography, landscape photography, long exposure, low light, and 4K timelapse.
- Secondary work: wildlife, portrait and event photography, and drone aerials.
- Artistic themes: awe, childlike wonder, alive silence, cosmic perspective, and the message “you are enough.”
- Business website: https://www.edwardemory.com

Private employment, home-location, and legal-identity details are intentionally excluded from this public viewer.`,
  ),

  '/codex/root/territory_mode.md': documentBody(
    'Territory Mode',
    'CANONICAL DESIGN',
    'User-confirmed interaction needs and development rules.',
    `Territory Mode is a working metaphor for protecting attention and moving one real outcome forward at a time.

## Operating rules

1. Start from the vivid end-state, then reverse-engineer the next actions.
2. Ask one important question at a time when input is required.
3. Prefer a single command or one-click path over long copy-and-paste chains.
4. Preserve unfinished work and avoid unrelated changes.
5. Convert important decisions into durable files or canonical records.
6. Verify before claiming completion.

There is no verified automated “territory engine” measuring hours, interruptions, or energy.`,
  ),

  '/codex/root/reality_filter.md': documentBody(
    'Reality Filter',
    'CANONICAL DESIGN',
    'User-authored reality-filter rules and current correction requirements.',
    `The Reality Filter prevents ideas, generated prose, and guesses from being presented as facts.

## Required labels

- **Verified:** supported by a user-confirmed statement, observable repository state, or connected system evidence.
- **Partial:** related evidence exists, but the full claim is not established.
- **Inference:** a conclusion drawn from evidence and clearly labeled as such.
- **Unknown:** not yet verified.
- **Concept:** desired behavior or design, not current functionality.

## Non-negotiable rule

No invented equipment, finances, health metrics, integrations, customers, bookings, project completion, or performance results.`,
  ),

  '/codex/council': documentBody(
    'Council',
    'UNVERIFIED CONCEPT — NOT IMPLEMENTED',
    'Role names exist in the Codex information architecture; no autonomous council runtime is verified.',
    `Council is a set of decision-making lenses, not a verified staff, board, or continuously running group of agents.

Eddie remains the owner and final decision-maker. The role pages are prompts for reviewing work from different perspectives.`,
  ),

  '/codex/council/roles': documentBody(
    'Council Roles',
    'UNVERIFIED CONCEPT — NOT IMPLEMENTED',
    'Conceptual role taxonomy in this repository.',
    `The council roles are review perspectives:

- product architecture
- technical systems
- user experience and accessibility
- data and AI integrity
- creative direction
- owner approval

They must not be interpreted as named employees, deployed agents, or delegated authority.`,
  ),

  '/codex/council/roles/architect.md': documentBody(
    'Product Architect Lens',
    'CANONICAL DESIGN',
    'Legacy Codex and Foundry Console product boundary confirmed by the user.',
    `Use this lens to keep product boundaries clear.

## Current canonical decision

Legacy Codex serves the individual creator/operator. Foundry Console serves the builder/operator managing systems and deployments. They may exchange requests and status, but should not duplicate each other's primary interface.`,
  ),

  '/codex/council/roles/systems_architect.md': documentBody(
    'Systems Architect Lens',
    'CANONICAL DESIGN',
    'Repository and deployment working rules.',
    `Use this lens to inspect repositories, data sources, deployments, auth boundaries, and failure modes.

## Current known systems

- GitHub repositories include codex-system-architecture, legacy-codex, and Artful-Intelligence.
- Vercel hosts multiple projects, including this architecture viewer and Foundry Console-related work.
- Supabase is used by this site for document storage and by other projects for application data.

The existence of a repository or project does not prove a feature is live.`,
  ),

  '/codex/council/roles/ux_specialist.md': documentBody(
    'UX and Accessibility Lens',
    'VERIFIED FACTS',
    'User-confirmed accessibility and interaction preferences.',
    `Use this lens to reduce friction for a highly visual, technically capable user who benefits from lower cognitive load and does not have a traditional coding background.

## Requirements

- Lead with the outcome.
- Use actionable links when external setup is required.
- Prefer one question at a time.
- Avoid long terminal ping-pong.
- Make iPhone-first experiences genuinely usable.
- Use visual artifacts for decisions when prose becomes dense.
- Explain GitHub and deployment terms in plain language.`,
  ),

  '/codex/council/roles/cdaao.md': documentBody(
    'Data and AI Integrity Lens',
    'CANONICAL DESIGN',
    'Reality Filter and user-confirmed data-handling rules.',
    `Use this lens to prevent unsupported data and unsafe automation.

## Responsibilities

- Require provenance for personal data.
- Separate training concepts from measured outcomes.
- Never manufacture business, health, engagement, or model-performance metrics.
- Keep private financial details out of public pages.
- Treat external system state as current only after inspecting it.`,
  ),

  '/codex/council/roles/creative_agent.md': documentBody(
    'Creative Direction Lens',
    'VERIFIED FACTS',
    'User-confirmed artistic themes and photography practice.',
    `Use this lens to preserve Eddie's visual identity: awe, scale, cosmic perspective, natural wonder, and emotionally honest processing.

AI may help organize, analyze, teach, or prototype. It must not replace the authorship of Eddie's photographs or invent a body of work he did not make.`,
  ),

  '/codex/council/roles/chairman.md': documentBody(
    'Owner and Final Decision Maker',
    'VERIFIED FACTS',
    'User ownership of the projects and explicit approval rules.',
    `Eddie is the owner and final decision-maker.

Agents may inspect, recommend, implement requested work, and verify it. Structural changes, deletions, schema redesigns, and materially different product directions require clear authorization.`,
  ),

  '/codex/council/protocols': documentBody(
    'Protocols',
    'CANONICAL DESIGN',
    'User-confirmed agent behavior and Reality Filter.',
    `Protocols are working rules for reliable collaboration. They are not evidence of an autonomous orchestration service.

The active core is: inspect reality, define the outcome, make the smallest safe change, verify it, and record what changed.`,
  ),

  '/codex/council/protocols/7_phase_protocol.md': documentBody(
    'Seven-Phase Work Protocol',
    'CANONICAL DESIGN',
    'Consolidation of the user-confirmed plan, execute, verify, and durability rules.',
    `1. **Orient:** identify the real repository, page, data source, and current state.
2. **Verify:** classify claims as verified, partial, inferred, unknown, or concept.
3. **Define:** state the intended outcome and constraints.
4. **Plan:** break work into testable steps.
5. **Execute:** make scoped changes while preserving unrelated work.
6. **Validate:** test the original failure, the build, and the live result.
7. **Record:** save decisions, links, migrations, and remaining risks.

This is a collaboration protocol, not proof that a seven-stage software engine is deployed.`,
  ),

  '/codex/council/protocols/swarm_layer.md': documentBody(
    'Parallel Agent Work',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'Cloud coding agents are used; no persistent swarm service is verified.',
    `Parallel agents can be useful when tasks are independent, such as repository inspection, test analysis, and documentation review.

## Current reality

- Eddie uses cloud-based coding agents and connected tools.
- Agent work must be reconciled against the shared repository before acceptance.
- No always-on swarm scheduler, shared autonomous memory, or self-governing agent hierarchy is verified.`,
  ),

  '/codex/council/protocols/transparent_reasoning.md': documentBody(
    'Transparent Work Reporting',
    'CANONICAL DESIGN',
    'User-confirmed transparency and failure-handling rules.',
    `Reports should expose assumptions, evidence, actions, and verification without pretending inaccessible internal reasoning is available.

## Required behavior

- Explain tool failures briefly and try one safe alternate path.
- Read back identifiers before high-impact actions.
- Tag uncertain claims.
- Provide the command or link that lets Eddie verify the result.
- Never claim a deploy, migration, merge, or security boundary succeeded without direct evidence.`,
  ),

  '/codex/territory': documentBody(
    'Territory',
    'CANONICAL DESIGN',
    'Codex information architecture and repository workflow.',
    `Territory is the governance layer for deciding which record is canonical and how changes move from idea to verified state.

No geographic territory, ownership ledger, or automated governance service is implied.`,
  ),

  '/codex/territory/territory_ledger.md': documentBody(
    'Canonical Registry',
    'CANONICAL DESIGN',
    'User-confirmed durability and source-of-truth rules.',
    `## Current source hierarchy

1. Direct, current user confirmation.
2. Live repository, deployment, database, or connected-app evidence.
3. Canonical product definitions and decision records.
4. Older chat summaries and planning documents.
5. Inference, clearly labeled.

Conflicting records are not silently merged. The conflict is surfaced and a candidate canonical value is proposed.`,
  ),

  '/codex/territory/boot_sequence.md': documentBody(
    'Session Boot Sequence',
    'CANONICAL DESIGN',
    'User-confirmed preference for guided, low-friction execution.',
    `A practical session starts with four checks:

1. What outcome does Eddie want now?
2. What is the latest observable state?
3. What is the smallest safe next action?
4. What evidence will prove completion?

There is no fixed 6:00 a.m. routine or biometric-triggered boot sequence verified.`,
  ),

  '/codex/territory/version_schema.md': documentBody(
    'Version and Status Schema',
    'CANONICAL DESIGN',
    'Git workflow and Reality Filter.',
    `## Software state

- repository
- branch
- commit
- pull request
- deployment
- database migration

## Product state

- concept
- prototype
- blocked
- active development
- deployed
- verified live
- paused
- retired

A version number does not establish deployment. A deployed URL does not establish that its content is correct.`,
  ),

  '/codex/territory/update_protocol.md': documentBody(
    'Update Protocol',
    'CANONICAL DESIGN',
    'Repository instructions and user-confirmed change-safety rules.',
    `1. Inventory the current state.
2. Protect unrelated work.
3. Add a regression check for the failure.
4. Change the canonical source.
5. Add forward-only migrations for already-applied database history.
6. Run tests, type checks, lint, and build as applicable.
7. Publish through a branch and pull request unless direct production action was explicitly approved.
8. Verify the live page and record the result.`,
  ),

  '/codex/artistic_systems': documentBody(
    'Artistic Systems',
    'VERIFIED FACTS',
    'User-confirmed photography practice and Artful Intelligence work.',
    `This territory covers Eddie's real photography practice and software experiments built around creative work.

It separates owned gear and completed shoots from planned expeditions, product ideas, and prototype software.`,
  ),

  '/codex/artistic_systems/photography_ops': documentBody(
    'Photography Operations',
    'VERIFIED FACTS',
    'User-confirmed specialties, equipment, and field projects.',
    `## Primary work

- astrophotography
- landscape photography
- timelapse filmmaking
- night and low-light work
- long exposure

## Secondary work

- wildlife
- portraits and events
- drone aerials

Equipment and project pages list only confirmed ownership or confirmed status.`,
  ),

  '/codex/artistic_systems/photography_ops/astro_ops.md': documentBody(
    'Astrophotography Operations',
    'VERIFIED FACTS',
    'User-confirmed gear, baseline settings, tracker ownership, and completed shoots.',
    `## Baseline capture setup

- Sony A7 III with Sony 20mm f/1.8 G.
- Typical untracked Milky Way starting point: 15 seconds, ISO 4000, f/1.8 to f/2.2.
- Final settings still depend on sky brightness, foreground, tracking, and the intended blend.

## Tracker experience

Eddie owns a Star Adventurer Pro and Star Adventurer Mini. A confirmed example used the Star Adventurer Pro for a single 121-second exposure.

## Confirmed field work

- La Cumbre Peak aurora panorama, May 12, 2024: 17 handheld portrait frames with the Milky Way core, aurora, airglow, and zodiacal light.
- Perseids at Lizard's Mouth, 2020: 2,305 frames, 13 hours on site, and 186 hours of post-production.
- Death Valley new-moon work at Ubehebe Crater, October 2024.

No unverified tracked-panorama or advanced blending capability is claimed.`,
  ),

  '/codex/artistic_systems/photography_ops/timelapse_ops.md': documentBody(
    'Timelapse Operations',
    'VERIFIED FACTS',
    'User-confirmed 4K timelapse specialty and completed Perseids project.',
    `Eddie produces 4K timelapse work and has deep experience with long-duration capture and post-production.

The strongest quantified example currently recorded is the 2020 Perseids project: 2,305 source frames, 13 hours on location, and 186 hours of post work.

No universal interval, frame count, storage requirement, or completion time is asserted; each sequence requires a shoot-specific plan.`,
  ),

  '/codex/artistic_systems/photography_ops/landscapes.md': documentBody(
    'Landscape Operations',
    'VERIFIED FACTS',
    'User-confirmed specialties, locations, and artistic themes.',
    `Landscape work is closely tied to astronomy, weather, remote places, and the feeling of scale.

## Confirmed examples

- La Cumbre Peak aurora and Milky Way panorama.
- Ubehebe Crater in Death Valley during extreme heat in October 2024.
- Lunar eclipse work on California's Central Coast.
- Light-painting work at Far de Favàritx in Menorca with Eric Paré and Kim Henry.

Processing ranges from natural scene fidelity to clearly disclosed creative composites.`,
  ),

  '/codex/artistic_systems/photography_ops/gear_specs.md': documentBody(
    'Verified Gear Inventory',
    'VERIFIED FACTS',
    'Equipment ownership directly confirmed by the user.',
    `## Camera bodies

| Camera | Confirmed role |
| --- | --- |
| Sony A7 III | Primary full-frame camera for astrophotography, landscapes, timelapse, low light, portraits, and events |
| Sony RX10 IV | Second camera with built-in 24–600mm-equivalent zoom for wildlife, travel, and distant subjects |

## Lenses owned for the Sony A7 III

| Lens | Confirmed use |
| --- | --- |
| Sony 20mm f/1.8 G | Favorite lens; primary astrophotography and wide landscape lens |
| Rokinon 14mm f/2.8 | Ultra-wide astrophotography and landscape lens |
| Sony 24–70mm f/4 Zeiss Vario-Tessar | General-purpose standard zoom |

## Tracking equipment

- Star Adventurer Pro
- Star Adventurer Mini

## Other equipment

Tripod, head, filter, battery, memory-card, drone-model, and maintenance details are **Unknown — not yet verified for this public inventory**.

Equipment researched or considered for purchase is not listed as owned.`,
  ),

  '/codex/artistic_systems/photography_ops/firefall_2026.md': documentBody(
    'Firefall Status',
    'UNVERIFIED CONCEPT — NOT IMPLEMENTED',
    'No user-confirmed Firefall trip, booking, dates, permit, or equipment plan was located in the available context.',
    `A prior corpus presented a detailed Yosemite Firefall trip as if it were scheduled. That status was unsupported.

## Current status

- Trip: **Unknown — not confirmed**
- Dates: **Unknown — not confirmed**
- Lodging or campsite: **Unknown — not confirmed**
- Permit or reservation: **Unknown — not confirmed**
- Shot plan: **Not approved**

If Firefall becomes a real project, this page should be rebuilt from confirmed reservations, current park rules, weather, water flow, and Eddie's actual gear.`,
  ),

  '/codex/artistic_systems/photography_ops/namibia_2026.md': documentBody(
    'Namibia Workshop Status',
    'VERIFIED PROJECT STATUS',
    'User-confirmed workshop history and June 2026 relaunch update.',
    `The Namibia workshop has been attempted and revised across multiple years, but no current departure is booked or on sale.

## Confirmed history

- Partner and local guide: Richard Morsbach of Namib Adventure.
- Earlier 2023 versions were proposed and later postponed.
- Prior launches produced only one or two signups and did not become a completed workshop.
- The newer concept is a 7-night/8-day slack-packing format combining a four-day hut-to-hut section with lodge-based editing and wildlife work.

## Current status

- Candidate year: **2027 or 2028**, depending on logistics and build quality.
- Exact dates: **Unknown — not confirmed**
- Final route: **Unknown — not confirmed**
- Final price: **Unknown — not confirmed**
- Booked participants: **None confirmed in the available record**
- Public sales page readiness: **Not verified**

Historical itineraries and prices are references only, not current commitments.`,
  ),

  '/codex/artistic_systems/artful_intelligence': documentBody(
    'Artful Intelligence',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'User-confirmed platform vision plus shipped and prototype project history.',
    `Artful Intelligence is Eddie's umbrella concept for helping creatives automate tedious work and return to creating.

## Confirmed audience

Photographers, artists, writers, musicians, and other creative professionals.

## Confirmed shipped work

Photographer Agent Pack V1 launched in June 2026 with a Vercel storefront and Gumroad listing.

## Important boundary

The broader all-in-one platform is not verified as a completed product. Individual prototypes and products must be evaluated separately.`,
  ),

  '/codex/artistic_systems/artful_intelligence/ai_overview.md': documentBody(
    'Artful Intelligence Product Overview',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'User-confirmed vision and project launch record.',
    `## Vision

A creator-focused system that can support planning, photography education, client workflow, product sales, and automation without burying the creative user in technical setup.

## Reality as of review

- Photographer Agent Pack V1: shipped.
- Artful Intelligence storefront: deployed.
- Photo Coach: prototype/MVP work exists; production availability is not verified.
- Creator-wide operating system: concept, not a verified complete platform.
- Native iOS product: multiple concepts exist; no single App Store release is verified.`,
  ),

  '/codex/artistic_systems/artful_intelligence/photo_coach_mvp.md': documentBody(
    'Photo Coach MVP',
    'VERIFIED PROJECT STATUS',
    'User-confirmed May and August 2025 MVP work.',
    `Photo Coach is an AI-assisted critique and education concept tuned for Eddie's Sony A7 III workflow and specialties.

## Confirmed build history

- A FastAPI backend was designed to use OpenAI vision responses with structured JSON.
- EXIF extraction and a mobile single-page interface were part of the MVP.
- The intended focus is actionable feedback for astro, landscape, timelapse, and workshop scenarios.

## Current unknowns

- Public production URL: **Unknown — not verified**
- Active users: **Unknown — not verified**
- Paid customers: **Unknown — not verified**
- Model accuracy or satisfaction metrics: **Unknown — not measured here**`,
  ),

  '/codex/artistic_systems/artful_intelligence/edition_manager.md': documentBody(
    'Edition Manager',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'Observable scripts, API routes, migrations, and event files in this repository.',
    `This repository contains Edition Manager code, including an ingest API, migration-related tooling, local scripts, and event records.

## What that proves

The implementation has source code and database design work.

## What it does not prove

- that every database migration is applied
- that ingestion is running continuously
- that print orders are automatically fulfilled
- that inventory or sales counts are current
- that the system has processed real customer orders

Runtime status must be checked directly before any of those claims are made.`,
  ),

  '/codex/artistic_systems/artful_intelligence/6_figure_print_engine.md': documentBody(
    'Print Revenue Engine',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'User-confirmed print model and product goals; no six-figure performance evidence.',
    `Eddie's fine-art print model centers on one-of-one archival metal prints using ChromaLuxe.

## Confirmed business context

- One-of-one positioning is intentional.
- Fine-art qualification and high-value collector positioning have been explored.
- Agent C in Photographer Agent Pack V1 focuses on print-drop workflow.

## Reality check

“Six figure” was a goal label, not a verified revenue result. This page contains no claimed annual revenue, conversion rate, collector count, sell-through rate, or active inventory because those figures have not been verified here.`,
  ),

  '/codex/artistic_systems/artful_intelligence/creative_automations.md': documentBody(
    'Creative Automations',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'User-confirmed workflow goals and connected-tool usage.',
    `Automation should remove repetitive work while leaving creative judgment with Eddie.

## Confirmed workflow areas

- GitHub repository work
- Vercel deployment
- Supabase-backed applications
- Notion documentation
- photography business planning
- agent-assisted product workflows

## Boundary

No claim is made that lead generation, client delivery, print fulfillment, bookkeeping, social posting, or newsletter publishing is fully automated. Each workflow requires direct verification.`,
  ),

  '/codex/artistic_systems/artful_intelligence/pwa_iphone16.md': documentBody(
    'iPhone-First PWA Work',
    'VERIFIED PROJECT STATUS',
    'User-confirmed iPhone 16 Pro ownership and PWA prototype history.',
    `Eddie uses an iPhone 16 Pro and consistently prioritizes mobile-first tools.

## Confirmed concepts and prototypes

- photo analysis and coaching interfaces
- Camera Coach/AstroCapture planning ideas
- a photographer workflow PWA
- CelestiaDome EEG visualization
- mobile 3D gallery work

These are separate experiments at different stages. This page does not combine them into a fictional single production app. App Store release, active users, offline reliability, and production backend status are **Unknown — not verified**.`,
  ),

  '/codex/neuro': documentBody(
    'Neuro and Biometric Work',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'User-confirmed Muse 2 ownership and prototype history.',
    `This territory covers experiments using a Muse 2 headset to explore focus, calm, stress, flow, and recovery.

It is a personal creative technology project, not a medical device, diagnostic system, or validated neuroscience product.`,
  ),

  '/codex/neuro/muse2_eeg_pipeline.md': documentBody(
    'Muse 2 EEG Pipeline',
    'VERIFIED PROJECT STATUS',
    'User-confirmed device, apps, pipeline components, and prototype goals.',
    `## Confirmed equipment and tools

- Muse 2 headset
- Mind Monitor with OSC
- optional LSL exploration
- Python OSC receiver and WebSocket bridge work
- React/Three.js and SwiftUI visualization concepts

## Confirmed project history

NeuroMuse and CelestiaDome prototypes explored live EEG bands, visual feedback, and session summaries.

## Limits

No clinical interpretation, diagnosis, validated brain-state detection, or proven flow classifier is claimed. Current end-to-end runtime status is **Unknown — not freshly verified**.`,
  ),

  '/codex/neuro/websocket_servers.md': documentBody(
    'EEG WebSocket Bridge',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'User-confirmed prototype pipeline; current server status not inspected in this repository.',
    `The intended path is Mind Monitor OSC to a local bridge, then WebSocket messages to a browser or native visualizer.

Prototype work exists in the project history. No always-on server URL, uptime, latency, throughput, or current deployment is verified on this page.`,
  ),

  '/codex/neuro/adaptive_ml_models.md': documentBody(
    'Adaptive Model Status',
    'UNVERIFIED CONCEPT — NOT IMPLEMENTED',
    'Project history describes rule-based state ideas; no trained or validated adaptive model is verified.',
    `Focus, calm, stress, and flow labels have been explored as product concepts.

## Current status

- Personally labeled training dataset: **Unknown — not verified**
- Trained production model: **Not verified**
- Accuracy, precision, recall, or validation cohort: **Not available**
- Clinical validity: **Not claimed**

Until real labeled sessions and an evaluation protocol exist, the system must be described as exploratory and rule-based.`,
  ),

  '/codex/neuro/whoop_integration.md': documentBody(
    'WHOOP Integration Status',
    'UNVERIFIED CONCEPT — NOT IMPLEMENTED',
    'User previously used WHOOP 4.0 and discussed an integration; no current live connection is verified.',
    `WHOOP data was considered as a recovery and sleep context source for NeuroMuse and personal planning.

## Current status

- Device/account use: previously used; current active status **Unknown**
- OAuth connection: **Not verified**
- Automatic data import: **Not verified**
- Recovery-based scheduling: **Not implemented as a verified production workflow**

No recovery scores or health conclusions are displayed here.`,
  ),

  '/codex/neuro/bio_geometry_engine.md': documentBody(
    'Biometric Visualization Concept',
    'UNVERIFIED CONCEPT — NOT IMPLEMENTED',
    'User-confirmed interest in responsive 3D EEG visualization.',
    `The concept is to translate live EEG signals into an expressive visual environment such as a dome, star field, sphere, or spatial animation.

CelestiaDome is the clearest named direction in the available project history. No validated “Bio Geometry Engine,” production SDK, spatial-analysis model, or measured therapeutic effect is claimed.`,
  ),

  '/codex/automation': documentBody(
    'Automation',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'Connected development workflows and repository evidence.',
    `Eddie uses AI agents and connected tools to reduce the friction of software development and project operations.

The current reality is a collection of agent-assisted workflows, repositories, and deployments—not a single autonomous operating system.`,
  ),

  '/codex/automation/multi_agent_orchestration.md': documentBody(
    'Multi-Agent Orchestration Status',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'User-confirmed cloud-agent usage; no persistent orchestrator verified.',
    `Multiple agents can inspect different bounded parts of a task in parallel, but their output must be reviewed and reconciled.

## Verified

- Cloud coding agents are part of Eddie's workflow.
- Repositories and deployment tools can be connected to agent sessions.

## Not verified

- persistent cross-agent memory
- autonomous task assignment
- a production queue or scheduler
- agents merging or deploying without explicit workflow authority`,
  ),

  '/codex/automation/reliability_playbook.md': documentBody(
    'Reliability Playbook',
    'CANONICAL DESIGN',
    'User-confirmed agent and tool-failure rules.',
    `## Working rules

1. Inspect the actual system before trusting old architecture prose.
2. Reproduce the failure and trace the data source.
3. Make one scoped correction at a time.
4. Use tests to prevent the false state from returning.
5. Explain failures briefly; do not dump raw errors on Eddie.
6. Retry a temporary failure once, then use a different safe path.
7. Verify identifiers and captured values before writes.
8. Never report success from intent alone.`,
  ),

  '/codex/automation/rag_photography.md': documentBody(
    'Photography Retrieval Status',
    'UNVERIFIED CONCEPT — NOT IMPLEMENTED',
    'A prior design described RAG; no indexed production knowledge base is verified.',
    `A photography retrieval system could use Eddie's camera manuals, field notes, confirmed gear, and teaching material to answer context-specific questions.

## Current status

- Production vector database: **Not verified**
- Indexed manuals or note count: **Unknown**
- Embedding model: **Not selected here**
- Query latency, relevance, satisfaction, and accuracy: **Not measured**

The earlier counts and performance numbers were unsupported and have been removed.`,
  ),

  '/codex/automation/automation_pipelines.md': documentBody(
    'Automation Pipeline Status',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'Repository, GitHub, Vercel, and Supabase evidence.',
    `## Verified components

- GitHub repositories store application code and history.
- Vercel projects deploy several web applications.
- This site reads Codex documents with a Supabase-backed path and a canonical repository fallback.
- Edition Manager-related APIs and scripts exist in this repository.

## Not established by those facts

- continuous operation
- successful customer fulfillment
- error-free synchronization
- complete Notion or memory ingestion
- production monitoring coverage

Each pipeline needs its own live verification.`,
  ),

  '/codex/business': documentBody(
    'Business',
    'VERIFIED FACTS',
    'User-confirmed photography business, products, and workshop history.',
    `Edward Emory Photography is the established creative business. Artful Intelligence is the newer product and automation direction.

Current business work includes fine-art prints, photography services, education/workshops, and digital creator tools. Revenue or customer counts are not published without current verified records.`,
  ),

  '/codex/business/drop_model.md': documentBody(
    'Fine-Art Print Drop Model',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'User-confirmed one-of-one metal print model and agent-pack workflow.',
    `## Confirmed model

- one-of-one archival metal prints
- ChromaLuxe as the named print medium
- collector-oriented positioning
- limited-release storytelling rather than commodity print volume

## Current unknowns

- active inventory
- next drop date
- collector list size
- sell-through rate
- current revenue

The Print Drop Agent is a shipped component of Photographer Agent Pack V1; that does not prove a fully automated sales operation.`,
  ),

  '/codex/business/workshop_engines.md': documentBody(
    'Workshop Business Status',
    'VERIFIED PROJECT STATUS',
    'User-confirmed Namibia attempts and current planning direction.',
    `Eddie is a natural teacher and has pursued photography workshop products, especially Namibia.

## Confirmed reality

- Multiple Namibia launch attempts occurred between 2020 and 2023.
- Those attempts produced limited signups and did not become the intended completed workshop.
- Richard Morsbach is the named local guide/partner.
- A redesigned 7-night/8-day format is being considered for 2027 or 2028.

There is no confirmed current workshop date, enrollment count, venue, price, profit, or launch funnel on this page.`,
  ),

  '/codex/business/money_os.md': documentBody(
    'Money OS',
    'VERIFIED PROJECT STATUS',
    'User requested financial tracking; this Vercel site is public and is not the appropriate ledger.',
    `Private financial figures are intentionally excluded from this public architecture site.

## Public-safe status

This viewer intentionally contains no personal financial history, balances, obligations, income, expenses, tax information, or private business records.

## Rule

Financial planning belongs in a private, access-controlled system with dated source records. No invented targets, allocations, dashboards, deductions, or tax payments are permitted here.`,
  ),

  '/codex/personal_os': documentBody(
    'Personal OS',
    'CANONICAL DESIGN',
    'User-confirmed accessibility and work preferences.',
    `The Personal OS is a practical support layer for preserving context, lowering overwhelm, and turning complex visions into one manageable next action.

It should support Eddie's life and creativity, not turn self-understanding into another endless optimization project.`,
  ),

  '/codex/personal_os/personality_manual.md': documentBody(
    'Working With Eddie',
    'VERIFIED FACTS',
    'User-confirmed communication and execution preferences.',
    `## What works

- Guide the conversation and ask specific questions.
- Ask one important question at a time when possible.
- Start with the outcome, then give concrete steps.
- Explain unfamiliar technical terms without talking down.
- Use direct links for tools, setup, and verification.
- Prefer one safe command over repeated terminal copy-and-paste.
- Make progress visible through working artifacts.
- Be direct when an idea is not viable or evidence is missing.

## What does not work

- invented details
- vague reassurance
- long unprioritized lists
- claiming access or completion that was not verified
- treating plans as shipped products`,
  ),

  '/codex/personal_os/neurodivergent_os.md': documentBody(
    'Accessible Work System',
    'VERIFIED FACTS',
    'User-confirmed interaction preferences and accessibility needs.',
    `Eddie benefits from systems that reduce working-memory load and ambiguity.

## Practical design requirements

- preserve context across sessions
- reduce decisions to the next meaningful choice
- use visual end-states and reverse-engineered steps
- avoid unnecessary context switching
- make recovery and sleep legitimate constraints
- separate urgent action from optional ideas
- record decisions outside chat

This is an accessibility and workflow framework, not a medical treatment plan.`,
  ),

  '/codex/personal_os/reflections_between_worlds.md': documentBody(
    'Reflections Between Worlds',
    'VERIFIED FACTS',
    'User-confirmed roles, creative themes, and the tension between art and software building.',
    `Eddie moves between several real roles: professional photographer, teacher, and AI builder.

The central tension is not lack of ideas. It is protecting enough energy and continuity to turn vivid creative visions into finished, testable work.

The recurring artistic center is awe: night skies, landscapes, time, silence, and the feeling that human life belongs inside something much larger.`,
  ),

  '/codex/convergence': documentBody(
    'Convergence',
    'VERIFIED PROJECT STATUS',
    'User-confirmed product differentiation and observable repository/deployment work.',
    `Convergence is where photography, neurotechnology experiments, personal context, business tools, and software infrastructure are evaluated together.

The goal is useful connection, not a claim that every system is already integrated.`,
  ),

  '/codex/convergence/convergence_log_v16.md': documentBody(
    'Current Integration Status',
    'VERIFIED PROJECT STATUS',
    'GitHub/Vercel inspection plus user-confirmed June–July 2026 project updates.',
    `## Verified progress

- Legacy Codex and Foundry Console now have a defined product boundary.
- Foundry Console received owner-only security work and Supabase-backed infrastructure in the legacy-codex project history.
- Photographer Agent Pack V1 shipped with a Vercel storefront and Gumroad listing.
- This codex-system-architecture app is deployed on Vercel and connected to Supabase document data.
- The current audit identified and is replacing a large fabricated corpus in this site.

## Active or incomplete

- Broader Artful Intelligence platform: incomplete.
- Photo Coach production service: not verified live.
- Muse/EEG end-to-end runtime: not freshly verified.
- Namibia workshop: candidate 2027 or 2028, not booked.
- Automated creator/business operating system: not verified.

## Removed claims

There is no evidence here for integrated recovery scheduling, location-focus analytics, monthly five-figure creative revenue, automatic fulfillment of customer orders, system-health percentages, or a v16.2.1 production engine.`,
  ),

  '/codex/convergence/system_reflexivity.md': documentBody(
    'System Reflexivity',
    'CANONICAL DESIGN',
    'Reality Filter, repository audit practice, and user-confirmed real-versus-perceived progress reviews.',
    `System reflexivity means checking whether the systems are producing real outcomes or only producing more documentation.

## Review loop

1. **Observe:** inspect repositories, deployments, databases, and actual user results.
2. **Compare:** separate shipped work from plans, prototypes, and repeated rebuilds.
3. **Decide:** identify the smallest high-value correction.
4. **Execute:** change the canonical source and its live counterpart.
5. **Verify:** test the original problem from the user's point of view.
6. **Record:** preserve the evidence, decision, and remaining uncertainty.

No productivity, recovery, focus, revenue, relationship, or creative-satisfaction metric is assumed without a dated real dataset.`,
  ),
};

export function getCodexDocumentBody(path: string, fallback = ''): string {
  return CODEX_DOCUMENT_BODIES[path] ?? fallback;
}
