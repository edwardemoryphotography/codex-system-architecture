type EvidenceStatus =
  | 'VERIFIED FACTS'
  | 'CANONICAL DESIGN'
  | 'VERIFIED PROJECT STATUS'
  | 'MIXED — FACTS AND UNIMPLEMENTED DESIGN'
  | 'UNVERIFIED CONCEPT — NOT IMPLEMENTED';

import type { ProvenanceStatus } from '../types';
import {
  CANONICAL_REVIEW_DATE,
  operationalizeDocument,
} from './documentIntelligence';

function documentBody(
  title: string,
  status: EvidenceStatus,
  evidenceBasis: string,
  body: string,
): string {
  return `# ${title}

**Evidence status:** ${status}
**Evidence basis:** ${evidenceBasis}
**Last reviewed:** ${CANONICAL_REVIEW_DATE}

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
const BASE_CODEX_DOCUMENT_BODIES: Record<string, string> = {
  '/codex': documentBody(
    'Codex',
    'CANONICAL DESIGN',
    'User-confirmed product definition, repository structure, and a 2026-11-04 inspection of GitHub, Vercel, and Supabase.',
    `Codex is the map of Eddie's personal cognitive operating system and the creative and business work around it. This site is the reviewed, public description of that map. It is deliberately conservative: every page says what is verified, what is only a design, and what is unknown.

## What the ecosystem is made of

- **Legacy Codex:** the product. A personal cognitive operating system for preserving context, clarifying what matters, choosing the next meaningful action, and resuming without rebuilding the situation. Its canonical front door is legacy-codex.vercel.app. See the Legacy Codex product page.
- **Foundry Console:** the builder and operations layer behind Legacy Codex (routing, evidence, events, and control-plane data). It is an internal component with a deliberately separate owner-only access boundary, not a second product the owner has to coordinate.
- **Codex Control Panel:** a standalone, mobile-first dispatcher that takes a described task and routes it to the right tool. Its human-facing routing is being migrated into Legacy Codex; guarded persistence remains transitional.
- **This architecture viewer:** documentation and governance. It also holds the Goose Cookbook doctrine, the Notion wiki skills, and a copyable Obsidian vault pattern.
- **Artful Intelligence:** creator-focused tools and agent products, kept separate from Legacy Codex on purpose.
- **Supporting pieces:** PocketForge (a supporting module inside the Legacy Codex repository) and Photographer Agent Pack V1 (a packaged product).

The System Inventory page lists each piece with its repository, deployment, database, and verification date. The Not Built Yet page lists what is planned, blocked, or unproven.

## How to read any page

Each page opens with an evidence status, an evidence basis, and a review date. Below that, the outcome contract says what the page is for, the next move says what to do with it, and the done-when line says what proof would count. A review date means the claims were checked on that date. It never turns a concept or an unknown into a verified fact.

## Truth rule

Facts, active software, plans, and unimplemented concepts are labeled separately. A blank or unknown value is preferable to an invented one. Merged is not deployed, deployed is not runtime verified, and runtime verified is not live for every user.`,
  ),

  '/codex/root': documentBody(
    'Root',
    'CANONICAL DESIGN',
    'User-confirmed identity and operating preferences, plus the repository doctrine files that encode them.',
    `The Root territory holds the three things every other territory depends on: who the work is for (Identity), how attention and effort are protected (Territory Mode), and how claims are kept honest (Reality Filter).

## Why it exists

Most failures in this ecosystem were not missing features. They were confident descriptions of things that did not exist, or a good idea rebuilt from scratch because the earlier context was lost. Root is the small, stable layer that prevents both. It is read before any decision that changes scope, interaction style, or the standard of evidence.

## How it is used today

- Identity bounds what any public description of Eddie may say, so generated biographies cannot invent credentials, equipment, or projects.
- Territory Mode shapes how work is started and sequenced: one outcome, one next action, one proof of completion.
- Reality Filter sets the vocabulary for evidence. The same labels appear in repository status files and in this viewer's provenance badges.

## What it is not

It is not an analytics engine, a personality profile, or an automated service. It is durable written context that humans and agents are expected to read and follow. Private employment, home location, health, and financial details stay out of this public viewer.`,
  ),

  '/codex/root/identity.md': documentBody(
    'Identity',
    'VERIFIED FACTS',
    'User profile and user-confirmed professional history.',
    `Edward Emory Photography is a professional photographer, timelapse filmmaker, teacher, and self-taught AI and software builder. Friends call him Eddie. "Edward Emory" is the professional brand, not a separate person.

## Creative practice

- Primary specialties: astrophotography, landscape photography, long exposure, low light, and 4K timelapse.
- Secondary work: wildlife, portrait and event photography, and drone aerials.
- Artistic themes: awe, childlike wonder, alive silence, cosmic perspective, and the message "you are enough."
- Business website: https://www.edwardemory.com (WordPress).

## Builder practice

- Builds software and agent workflows primarily from an iPhone 16 Pro, which is why mobile-first behavior is a requirement across Codex rather than a polish step.
- Works in repositories and Vercel projects under the GitHub account edwardemoryphotography.
- Two brands are in use: Edward Emory Photography (established) and Artful Intelligence (a product line still in development).

## Boundary

Private employment, home-location, legal-identity, health, and financial details are intentionally excluded from this public viewer. Anything not confirmed by Eddie is left out rather than inferred.`,
  ),

  '/codex/root/territory_mode.md': documentBody(
    'Territory Mode',
    'CANONICAL DESIGN',
    'User-confirmed interaction needs and development rules, plus the Territory workspace verification record in the legacy-codex repository.',
    `Territory Mode is a working metaphor for protecting attention and moving one real outcome forward at a time. It started as a rule set for how Eddie and his AI collaborators work together, and it has since gained a real, narrow software expression.

## Operating rules

1. Start from the vivid end-state, then reverse-engineer the next actions.
2. Ask one important question at a time when input is required.
3. Prefer a single command or one-click path over long copy-and-paste chains.
4. Preserve unfinished work and avoid unrelated changes.
5. Convert important decisions into durable files or canonical records.
6. Verify before claiming completion.

## What exists in software

- Legacy Codex has a Territory workspace: a map and list view with lenses for Missions, Projects, Doctrine, and Constraints. Its verification record dated 2026-11-04 says the owner-scoped territory_nodes table was applied, merged, deployed, and live.
- A live check on 2026-11-04 confirmed the territory_nodes table exists in the foundry-console database. It currently holds no rows, so the workspace is built but no project, doctrine, or constraint entities have been saved yet.
- Entity-to-mission links are not drawn. The territory_links design is written but is planned work (see Not Built Yet).

## What does not exist

There is no verified automated territory engine measuring hours, interruptions, or energy. The map is a thinking and navigation surface, not a monitor.`,
  ),

  '/codex/root/reality_filter.md': documentBody(
    'Reality Filter',
    'CANONICAL DESIGN',
    'User-authored reality-filter rules, repository provenance rules, and current correction requirements.',
    `The Reality Filter prevents ideas, generated prose, and guesses from being presented as facts. It is always on, for people and for agents.

## Labels used in conversation and status files

- **Verified:** supported by a user-confirmed statement, observable repository state, or connected system evidence.
- **Partial:** related evidence exists, but the full claim is not established.
- **Inference:** a conclusion drawn from evidence and clearly labeled as such.
- **Unverified:** stated but not checked.
- **Needs confirmation:** a specific fact Eddie must confirm before it is used.
- **Missing:** expected evidence is absent.
- **Concept:** desired behavior or design, not current functionality.

## Labels used by this viewer

Every document carries one or more provenance values: verified, repository evidence, concept, or unknown. These are the only four allowed. They are computed from each page's evidence header, shown as badges, and stored with the document row.

## The ladder for software claims

Merged is not deployed. Deployed is not runtime verified. Runtime verified is not live for every user. Status files in the repositories use exactly this ladder, and a claim should be written at the highest rung that has direct evidence.

## Non-negotiable rule

No invented equipment, finances, health metrics, integrations, customers, bookings, project completion, or performance results. No mock or simulated data is shown as real. If a system could not be inspected, the page says so directly.`,
  ),

  '/codex/council': documentBody(
    'Council',
    'UNVERIFIED CONCEPT — NOT IMPLEMENTED',
    'Role names exist in the Codex information architecture; no autonomous council runtime is verified.',
    `Council is a set of decision-making lenses, not a verified staff, board, or continuously running group of agents.

## What it is for

When a decision touches product boundaries, systems, usability, data integrity, creative direction, or owner approval, the matching lens is a prompt for reviewing the work from that angle. The lenses exist so that a single enthusiastic pass does not substitute for a real review.

## Where real review does happen

Independent review happens in the repositories, not in a council runtime: pull requests, hosted CI (lint, type checks, tests, build), and separate reviewer passes recorded in status files. The lens pages describe what a reviewer should look for. They do not describe a service.

## Authority

Eddie remains the owner and final decision-maker. Structural changes, deletions, schema redesigns, and materially different product directions need clear authorization from him.

## Not built

- No autonomous council that debates, votes, or delegates.
- No named agents holding these roles.
- No automatic routing of a decision to a lens.`,
  ),

  '/codex/council/roles': documentBody(
    'Council Roles',
    'UNVERIFIED CONCEPT — NOT IMPLEMENTED',
    'Conceptual role taxonomy in this repository.',
    `The council roles are review perspectives. Each has its own page with the questions that lens asks and the evidence it should require.

- **Product Architect Lens:** keeps product boundaries clear (Legacy Codex, Foundry Console, Artful Intelligence).
- **Systems Architect Lens:** inspects repositories, data sources, deployments, auth boundaries, and failure modes.
- **UX and Accessibility Lens:** reduces friction and cognitive load; mobile-first.
- **Data and AI Integrity Lens:** demands provenance, blocks invented metrics, guards private data.
- **Creative Direction Lens:** protects Eddie's authorship and visual identity.
- **Owner:** final approval for structural and irreversible changes.

## How to apply them

Pick the one or two lenses that match the risk of the change, answer each lens's questions with evidence, and record any disagreement instead of averaging it away.

## Boundary

They must not be interpreted as named employees, deployed agents, or delegated authority.`,
  ),

  '/codex/council/roles/architect.md': documentBody(
    'Product Architect Lens',
    'CANONICAL DESIGN',
    'Legacy Codex and Foundry Console product boundary confirmed by the user, and the product-definition and source-graph documents in the legacy-codex repository.',
    `Use this lens to keep product boundaries clear and to stop duplicate front doors from appearing.

## Current canonical decisions (dated 2026-09-07 in the legacy-codex status file)

- **Legacy Codex root app:** canonical. One human-facing product.
- **Foundry Console:** internal component with its own owner-auth boundary until it can be exposed safely behind the canonical product.
- **Codex Control Panel:** migrate into the canonical product. Human-facing next-move routing moves into the Mission screen.
- **codex-system-architecture (this site):** architecture and governance.
- **Artful Intelligence:** separate on purpose.
- **Historical version labels (v24, v27, v35.3, v38):** provenance only, not product names.

## Questions this lens asks

1. Does this create a second place the owner must look?
2. Which repository and which table own this truth?
3. Is this a product feature or an internal capability?
4. What would make a duplicate project safe to retire, and has that been proven?

## Standing rule

Do not retire or alias a duplicate Vercel project or old branch by age or name. The 2026-08-31 check found a duplicate deployment that failed anonymous sign-in, so equivalence must be proven first.`,
  ),

  '/codex/council/roles/systems_architect.md': documentBody(
    'Systems Architect Lens',
    'CANONICAL DESIGN',
    'Repository and deployment working rules, checked against GitHub, Vercel, and Supabase on 2026-11-04.',
    `Use this lens to inspect repositories, data sources, deployments, auth boundaries, and failure modes before trusting any older architecture prose.

## Systems observed on 2026-11-04

- **GitHub:** the edwardemoryphotography organization holds legacy-codex, codex-control-panel, codex-system-architecture, Artful-Intelligence, and others. legacy-codex had a push the same day.
- **Vercel:** the frontend project serves legacy-codex.vercel.app and builds the legacy-codex repository. The foundry-console Vercel project built the same commit on the latest deployment. The architecture viewer, Control Panel, and Artful Intelligence each have their own projects. A project that earlier notes called legacy-codex is now named archived-legacy-codex.
- **Supabase:** two projects, foundry-console (used by Legacy Codex, Foundry, and this viewer) and artful-intelligence. Both reported healthy.
- **Render:** the Artful Intelligence backend is documented as a Render web service. Render could not be queried in this review, so its current state is unknown.

## What this lens must not assume

The existence of a repository or project does not prove a feature is live. Two Vercel projects building the same commit shows shared source, not equal configuration. A healthy database does not prove that a given migration has been applied.

## Questions this lens asks

Where is the source of truth? Which environment variables does it need? What fails when a service is paused? What did I actually inspect, and what am I inferring?`,
  ),

  '/codex/council/roles/ux_specialist.md': documentBody(
    'UX and Accessibility Lens',
    'VERIFIED FACTS',
    'User-confirmed accessibility and interaction preferences, and mobile layout checks recorded in the legacy-codex repository.',
    `Use this lens to reduce friction for a highly visual, technically capable user who benefits from lower cognitive load and does not have a traditional coding background.

## Requirements

- Lead with the outcome.
- Use actionable links when external setup is required.
- Prefer one question at a time.
- Avoid long terminal ping-pong.
- Make iPhone-first experiences genuinely usable.
- Use visual artifacts for decisions when prose becomes dense.
- Explain GitHub and deployment terms in plain language.

## How it shows up in the product

Legacy Codex status notes record phone-specific fixes driven by real screenshots: a clipped orb with the keyboard open, controls overlapping on Home, a primary button hidden under the tab bar at Safari's visible height. The standing method is to measure on a phone-sized WebKit viewport rather than assume a taller one, and to check for horizontal overflow.

## Questions this lens asks

Can the primary action be reached without scrolling? Does a failed read look like an empty state? Is any text smaller than a phone user can read? Is there more than one next step competing for attention?`,
  ),

  '/codex/council/roles/cdaao.md': documentBody(
    'Data and AI Integrity Lens',
    'CANONICAL DESIGN',
    'Reality Filter, user-confirmed data-handling rules, and the model-accountability contract recorded in the legacy-codex repository.',
    `Use this lens to prevent unsupported data and unsafe automation.

## Responsibilities

- Require provenance for personal data.
- Separate training concepts from measured outcomes.
- Never manufacture business, health, engagement, or model-performance metrics.
- Keep private financial details out of public pages.
- Treat external system state as current only after inspecting it.

## The accountability contract (draft)

On 2026-11-02 Eddie recorded a model accountability and transparency contract in the legacy-codex repository. It distinguishes contradiction, unsupported certainty, false assurance about capability or action, deception, unattributed discovery, and record sanitization. It states the goal as an evidence-preserving system whose behavior changes after a verified correction, not an AI that apologizes convincingly. The document is explicitly a requirements and plan record, not deployed behavior.

## Questions this lens asks

What is the source of this number? Could a model have produced it without evidence? Does a claim about what the system did have a receipt? Was a correction preserved, and did behavior actually change?`,
  ),

  '/codex/council/roles/creative_agent.md': documentBody(
    'Creative Direction Lens',
    'VERIFIED FACTS',
    'User-confirmed artistic themes and photography practice.',
    `Use this lens to preserve Eddie's visual identity: awe, scale, cosmic perspective, natural wonder, and emotionally honest processing.

## What it protects

- **Authorship:** AI may help organize, analyze, teach, or prototype. It must not replace the authorship of Eddie's photographs or invent a body of work he did not make.
- **Disclosure:** processing ranges from natural scene fidelity to clearly disclosed creative composites. The lens asks which one a piece is.
- **Emotional intent:** work is judged against awe, wonder, silence, and the message "you are enough," not against engagement metrics.

## Where it applies

Product copy for Artful Intelligence, print-drop storytelling, workshop descriptions, and any generated caption or biography.

## Questions this lens asks

Would Eddie recognize this as his voice? Does it claim a shoot, location, or result that did not happen? Is a composite labeled as one?`,
  ),

  '/codex/council/roles/chairman.md': documentBody(
    'Owner and Final Decision Maker',
    'VERIFIED FACTS',
    'User ownership of the projects and explicit approval rules.',
    `Eddie is the owner and final decision-maker.

## What agents may do

Inspect, recommend, implement requested work, and verify it. Eddie's current explicit request authorizes its own scope, even when it is not listed in a task file.

## What needs clear authorization

Structural changes, deletions, schema redesigns, production database changes, and materially different product directions. Credentials and service keys are never copied into browser code or public pages.

## What the owner role is not

It is not a rubber stamp to be assumed. Agents are expected to stop and ask when a decision cannot be undone and could reasonably go either way, and to work from Eddie's current explicit request rather than from an old task list.

## Practical effect

Work is delivered as a branch and pull request, not as a direct production action, unless direct action was explicitly approved. Production proof (for example a real owner session on a real device) is requested from Eddie rather than simulated.`,
  ),

  '/codex/council/protocols': documentBody(
    'Protocols',
    'CANONICAL DESIGN',
    'User-confirmed agent behavior, Reality Filter, and repository agent-instruction files.',
    `Protocols are working rules for reliable collaboration. They are not evidence of an autonomous orchestration service.

## The active core

Inspect reality, define the outcome, make the smallest safe change, verify it, and record what changed.

## Where the rules live

- AGENTS.md and CLAUDE.md in each repository set instruction precedence and verification gates.
- A shared standards kit in the Control Panel repository defines baseline agent behavior across repositories.
- The Goose Cookbook is the cross-system cognitive doctrine. Its North Star is preserving human intent so another intelligence can reconstruct, execute, verify, and continue it.

## The three protocol pages

The Seven-Phase Work Protocol, Parallel Agent Work, and Transparent Work Reporting each cover one part of that core. None of them is a running service.`,
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

## History

An earlier seven-phase collaboration protocol dated to late November 2025 used different phase names (Challenge, Reflect, Reframe, Clarify, Verify, Meta-recognize, Output). Its per-phase triggers were never recovered in full. The current seven phases are a consolidation aimed at software work and are the ones to follow. Historical versions of the seven-phase protocol are recorded in the legacy-codex builder-continuity document rather than merged silently.

## What it is not

It is a collaboration protocol, not proof that a seven-stage software engine is deployed. It is also distinct from the Scout, Architect, and Finisher roles in agent instruction files and from any routing engine.`,
  ),

  '/codex/council/protocols/swarm_layer.md': documentBody(
    'Parallel Agent Work',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'Cloud coding agents are used; commit history in this repository shows agent co-authorship; no persistent swarm service is verified.',
    `Parallel agents can be useful when tasks are independent, such as repository inspection, test analysis, and documentation review.

## Current reality

- Eddie uses cloud-based coding agents and connected tools. Commits in this repository carry agent co-author trailers, including the two most recent pull requests merged on 2026-09-06.
- Agent work is reconciled against the shared repository through pull requests before acceptance.
- A multi-agent setup for Claude Code (FABLE-LEADER-KIT) is described by Eddie as operational, with a builder, a verifier, and a researcher worker. It was not re-inspected for this review.

## Not verified

- An always-on swarm scheduler.
- Shared autonomous memory across agents.
- Any self-governing agent hierarchy.

## Rule of use

Parallelize only independent work. One agent's claim of completion is not evidence; a second check against the repository is.`,
  ),

  '/codex/council/protocols/transparent_reasoning.md': documentBody(
    'Transparent Work Reporting',
    'CANONICAL DESIGN',
    'User-confirmed transparency and failure-handling rules, and the 2026-11-02 accountability contract.',
    `Reports should expose assumptions, evidence, actions, and verification without pretending inaccessible internal reasoning is available.

## Required behavior

- Explain tool failures briefly and try one safe alternate path.
- Read back identifiers before high-impact actions.
- Tag uncertain claims.
- Provide the command or link that lets Eddie verify the result.
- Never claim a deploy, migration, merge, or security boundary succeeded without direct evidence.

## Reporting vocabulary

Use the ladder: merged, deployed, runtime verified, live. Say what was not verified in the same report as what was. A passing automated test is evidence about code, not about a real person's real session.

## Related requirement

The model accountability contract asks that unsupported claims about capability or completed action be mechanically checkable against runtime capability and execution receipts. That requirement is recorded; its enforcement is not shipped.`,
  ),

  '/codex/territory': documentBody(
    'Territory',
    'CANONICAL DESIGN',
    'Codex information architecture, repository workflow, and a 2026-11-04 check of the foundry-console database.',
    `Territory is the governance layer for deciding which record is canonical and how a change moves from idea to verified state. No geographic territory, ownership ledger, or automated governance service is implied.

## What lives here

- **Canonical Registry:** the order in which sources are trusted.
- **Session Boot Sequence:** how a working session starts.
- **Version and Status Schema:** the words used for software and product state.
- **Update Protocol:** how a change is made safely.

## Where each kind of truth lives

The legacy-codex repository keeps a canonical source graph and a data-ownership document that say which repository and which table own each kind of truth, and which stores are transitional. This site holds the reviewed public description. Dated status files hold coordination state, and they say plainly that they must be rechecked before a claim is promoted.

## Truth ladder as data

The foundry-console database contains a truth-ladder layer: ladder territories, ladder rules, and a function that evaluates them. A table comment states that active rules are evaluated and proposed rules are durable analysis awaiting an owner decision. On 2026-11-04 the database held 7 ladder territories and 10 rules. Changing a rule's meaning is a doctrine decision, not a code tweak.

## Not built

Automated enforcement of the ladder across every repository, and any geographic or ownership meaning for the word territory.`,
  ),

  '/codex/territory/territory_ledger.md': documentBody(
    'Canonical Registry',
    'CANONICAL DESIGN',
    'User-confirmed durability and source-of-truth rules, and a 2026-11-04 count of canonical rows in the foundry-console database.',
    `## Current source hierarchy

1. Direct, current user confirmation.
2. Live repository, deployment, database, or connected-app evidence.
3. Canonical product definitions and decision records.
4. Older chat summaries and planning documents.
5. Inference, clearly labeled.

Conflicting records are not silently merged. The conflict is surfaced and a candidate canonical value is proposed.

## The registry in practice

- Public document copy is canonical in this repository (the reviewed document bodies). The application merges that copy over matching database rows so stale database prose can never override reviewed facts.
- The live database held 64 document rows and 26 reviewed relationships on 2026-11-04. Pages that exist in the repository but have no database row yet render from the repository copy as read-only.
- Product truth for Legacy Codex lives in the legacy-codex repository: product definition, source graph, data ownership, and dated status files.

## Known conflicts that were found and resolved

- A note in a sibling repository named a different Supabase project as canonical for this site; it was reported stale on 2026-09-03 and may since have changed. The verified production project is foundry-console, confirmed from the deployed bundle and live schema on 2026-07-15.
- A "prepared, not pushed" triage of sibling repository work went stale; several of those items are merged.

## Not built

A single automated registry that reconciles every repository, deployment, and database. Today the registry is a written discipline plus these checks.`,
  ),

  '/codex/territory/boot_sequence.md': documentBody(
    'Session Boot Sequence',
    'CANONICAL DESIGN',
    'User-confirmed preference for guided, low-friction execution, and the session-start function defined in this repository.',
    `A practical session starts with four checks:

1. What outcome does Eddie want now?
2. What is the latest observable state?
3. What is the smallest safe next action?
4. What evidence will prove completion?

## What this looks like for an agent

Read the repository instructions, then the dated status file, then inspect the real system before trusting either. Say in one line what you are about to do. Keep a visible task list for anything with more than a couple of steps.

## What exists in software

The database defines a session-start function, initialize_session_start, that takes a high or low mode and returns prioritized open actions while marking a single next action. It belongs to the Control Panel and Foundry task queue, not to the Legacy Codex Mission loop.

Legacy Codex has its own front door: the Home screen greets the owner, shows the orb with a live state word, and offers a composer. The Mission screen holds the loop of capture, clarify, constrain, choose, act, and resume.

## Not built

There is no fixed 6:00 a.m. routine, no biometric-triggered boot, and no automatic energy-based scheduling verified.`,
  ),

  '/codex/territory/version_schema.md': documentBody(
    'Version and Status Schema',
    'CANONICAL DESIGN',
    'Git workflow, the status ladder used in repository status files, and the Legacy Codex release-naming rule.',
    `## Software state

- repository
- branch
- commit
- pull request
- merged
- deployed
- runtime verified
- live

Each rung needs its own evidence. Merged is a GitHub fact. Deployed is a Vercel fact for an exact commit. Runtime verified means someone exercised the real behavior. Live means a real user can reach it as intended.

## Product state

- concept
- prototype
- blocked
- active development
- deployed
- verified live
- paused
- retired

## Naming rule

The product is named Legacy Codex. Historical labels such as v24, v27, v35.3, and v38 are provenance, not the current product identity. The package version in the repository is 0.1.0. Future public versions are ordinary release tags created only when a real release policy needs them.

## Common traps

A version number does not establish deployment. A deployed URL does not establish that its content is correct. Two projects building the same commit are not necessarily configured the same way.`,
  ),

  '/codex/territory/update_protocol.md': documentBody(
    'Update Protocol',
    'CANONICAL DESIGN',
    'Repository instructions, CI configuration, and user-confirmed change-safety rules.',
    `1. Inventory the current state.
2. Protect unrelated work.
3. Add a regression check for the failure.
4. Change the canonical source.
5. Add forward-only migrations for already-applied database history.
6. Run tests, type checks, lint, and build as applicable.
7. Publish through a branch and pull request unless direct production action was explicitly approved.
8. Verify the live page and record the result.

## Checks used in this repository

Type checking, linting, and a production build are the minimum for a change under the source folder. The repository runs a continuous-integration workflow, and its test script pins a Node flag so tests behave the same in CI.

## Database changes

Applied migrations are never edited. A new file is added instead. Applying a migration to the production database needs project credentials and an operator, so a migration being present in the repository does not mean it is applied. On 2026-11-04 the owner-scoped document-interaction migration was present here but not applied to foundry-console.

## Recording

Update the dated status file with what merged, what deployed, what was verified, and what is still unknown. Write status at the highest rung that has direct evidence.`,
  ),

  '/codex/artistic_systems': documentBody(
    'Artistic Systems',
    'VERIFIED FACTS',
    'User-confirmed photography practice and Artful Intelligence work.',
    `This territory covers Eddie's real photography practice and the software experiments built around creative work.

## Two halves, kept separate

- **Photography operations:** astrophotography, timelapse, landscapes, the verified gear inventory, and two project status pages (Firefall and Namibia).
- **Artful Intelligence:** creator-focused tools and agent products, with their own deployments and databases.

The territory separates owned gear and completed shoots from planned expeditions, product ideas, and prototype software. A project appears here as a plan only if it is labeled as one.

## How it connects

Field practice feeds the print business and workshops (Business), supplies the vocabulary for coaching tools (Artful Intelligence), and shares timing and capture concerns with biosignal experiments (Neuro).`,
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

## Pages in this section

Astro Ops and Timelapse Ops describe method and confirmed field work. Landscapes lists confirmed locations. Gear Specs is the verified inventory. Firefall Status and Namibia Workshop Status record two projects whose current state is unresolved.

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

## Lens roles

The 20mm f/1.8 G is the favorite and the default. The Rokinon 14mm f/2.8 is the ultra-wide option. The 24 to 70mm f/4 is a general-purpose zoom, not the main night lens.

## Tracker experience

Eddie owns a Star Adventurer Pro and Star Adventurer Mini. A confirmed example used the Star Adventurer Pro for a single 121-second exposure.

## Confirmed field work

- La Cumbre Peak aurora panorama, May 12, 2024: 17 handheld portrait frames with the Milky Way core, aurora, airglow, and zodiacal light.
- Perseids at Lizard's Mouth, 2020: 2,305 frames, 13 hours on site, and 186 hours of post-production.
- Death Valley new-moon work at Ubehebe Crater, October 2024.

## Limits

No unverified tracked-panorama or advanced blending capability is claimed. Any settings above are starting points recorded from real work, not a promise for another night.`,
  ),

  '/codex/artistic_systems/photography_ops/timelapse_ops.md': documentBody(
    'Timelapse Operations',
    'VERIFIED FACTS',
    'User-confirmed 4K timelapse specialty and completed Perseids project.',
    `Eddie produces 4K timelapse work and has deep experience with long-duration capture and post-production.

## The strongest quantified example

The 2020 Perseids project: 2,305 source frames, 13 hours on location, and 186 hours of post work. It shows the real shape of timelapse effort: a long capture night followed by a much longer processing phase.

## Related finishing work

A moonrise timelapse from Portugal was enhanced with a command-line video workflow: denoised, upscaled to 3840 by 2560 while keeping its 3:2 ratio, and re-encoded as 10-bit HEVC. That is a record of one finishing pass, not a standard pipeline.

## What this page does not assert

No universal interval, frame count, storage requirement, or completion time is stated. Each sequence requires a shoot-specific plan. No automated timelapse pipeline is claimed.`,
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

## Processing

Processing ranges from natural scene fidelity to clearly disclosed creative composites, and a piece should say which it is.

## Not claimed

No inventory of future locations, permits, or trips is recorded here. Planned expeditions belong on their own status pages.`,
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

## Other confirmed equipment

- iPhone 16 Pro: the primary phone and the device most software is built on.
- A drone is part of the kit; its model is not recorded here.

## Unknown

Tripod, head, filter, battery, memory-card, drone-model, and maintenance details are **Unknown — not yet verified for this public inventory**.

Equipment researched or considered for purchase is not listed as owned. Earlier versions of this page listed cameras and lenses Eddie does not own; those were removed and a test guards against their return.`,
  ),

  '/codex/artistic_systems/photography_ops/firefall_2026.md': documentBody(
    'Firefall Status',
    'UNVERIFIED CONCEPT — NOT IMPLEMENTED',
    'No user-confirmed Firefall trip, booking, dates, permit, or equipment plan was located in the available context.',
    `A prior corpus presented a detailed Yosemite Firefall trip as if it were scheduled. That status was unsupported, and the page was rewritten to say so.

## Current status

- Trip: **Unknown — not confirmed**
- Dates: **Unknown — not confirmed**
- Lodging or campsite: **Unknown — not confirmed**
- Permit or reservation: **Unknown — not confirmed**
- Shot plan: **Not approved**

## What would change this page

Eddie confirming a real plan. If Firefall becomes a project, rebuild this page from confirmed reservations, current park rules, weather, water flow, and Eddie's actual gear.

## Why it is kept

A visible "unknown" stops the idea from being quietly re-promoted to a scheduled trip by a later summary or an agent.`,
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

## What is still missing

A confirmed date window, a fixed route and price, a partner agreement on current terms, and a sales page. Until those exist, the workshop is a plan.

Historical itineraries and prices are references only, not current commitments.`,
  ),

  '/codex/artistic_systems/artful_intelligence': documentBody(
    'Artful Intelligence',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'User-confirmed platform vision, plus a 2026-11-04 check of the Artful-Intelligence deployment on Vercel and the artful-intelligence Supabase project.',
    `Artful Intelligence is Eddie's umbrella concept for helping creatives automate tedious work and return to creating. It is a product line in development, kept separate from Legacy Codex on purpose.

## Confirmed audience

Photographers, artists, writers, musicians, and other creative professionals.

## What exists

- **Photographer Agent Pack V1:** shipped. It launched in June 2026 with a Vercel storefront and a Gumroad listing. Eddie describes it as three agents (Lead-to-Booking, Edit-to-Delivery, Print Drop) in a 35-file pack.
- **Storefront and app deployment:** a Vercel project named artful-intelligence builds the private Artful-Intelligence repository. Its production deployments were in a ready state on 2026-11-04, the latest from early October 2026.
- **Database:** a Supabase project named artful-intelligence was created on 2026-07-15 and reported healthy on 2026-11-04.
- **Backend:** documented as a Render web service. Render could not be queried in this review, so its current state is unknown. Notes recorded in July say the free instance sleeps when idle, which delays the first request by about a minute.

## Important boundary

The broader all-in-one platform is not verified as a completed product. Individual prototypes and products must be evaluated separately. First-buyer status for the agent pack, and any revenue or customer figure, is not published here and was not verified.`,
  ),

  '/codex/artistic_systems/artful_intelligence/ai_overview.md': documentBody(
    'Artful Intelligence Product Overview',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'User-confirmed vision and project launch record, plus Vercel deployment records checked on 2026-11-04.',
    `## Vision

A creator-focused system that can support planning, photography education, client workflow, product sales, and automation without burying the creative user in technical setup.

## Reality as of 2026-11-04

| Piece | State |
| --- | --- |
| Photographer Agent Pack V1 | Shipped (June 2026) |
| Artful Intelligence storefront | Deployed on Vercel from the Artful-Intelligence repository |
| Backend service | Documented on Render; current state unknown |
| Photo Coach | Prototype and MVP work exists; production availability not verified |
| Edition Manager | Source code in the architecture repository; runtime unverified |
| Creator-wide operating system | Concept, not a verified complete platform |
| Native iOS product | Multiple concepts exist; no single App Store release verified |

## Recent engineering evidence

Early-October 2026 commits in the Artful-Intelligence repository fixed a WebSocket route used by a Remote view and added retries so a first upload survives the backend waking from sleep. A follow-up commit reduced the backend's dependencies after a build on Render failed; the commit message says the exact Render cause was unconfirmed.

## Why it is separate

Legacy Codex serves the individual creator and operator. Artful Intelligence serves creators who want tools and agents. The product-boundary decision is to keep them separate and not fold one into the other.`,
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

## How it is meant to work

A photographer uploads an image. The backend reads its camera metadata, asks a vision model for a structured critique, and the phone interface shows concrete next steps. The aim is specificity to the shooter's real gear and genres.

## Current unknowns

- Public production URL: **Unknown — not verified**
- Which repository or deployment currently holds this code: **Needs confirmation**
- Active users: **Unknown — not verified**
- Paid customers: **Unknown — not verified**
- Model accuracy or satisfaction metrics: **Unknown — not measured here**

## Not built

Grounded retrieval from Eddie's own manuals and field notes (see Photography Retrieval Status) is a concept, not part of this MVP.`,
  ),

  '/codex/artistic_systems/artful_intelligence/edition_manager.md': documentBody(
    'Edition Manager',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'Observable scripts, API routes, migrations, and event files in this repository.',
    `This repository contains Edition Manager code: an ingest API, migration tooling, local scripts, and event records.

## What is in the repository

- Two serverless API routes: one to ingest edition records and one to apply a database migration.
- A configuration file and a data folder for the ingest endpoint.
- Local scripts, including one that runs the manager locally and a Python script for a print-sales agent.
- A SQL migration file for edition manager events.

## What that proves

The implementation has source code and database design work.

## What it does not prove

- that every database migration is applied
- that ingestion is running continuously
- that print orders are automatically fulfilled
- that inventory or sales counts are current
- that the system has processed real customer orders

## Status on 2026-11-04

Whether the edition events migration is applied to the production database was not confirmed in this review. A general events table exists in the foundry-console database, but this review did not establish that it belongs to the Edition Manager. Runtime status must be checked directly before any of those claims are made.`,
  ),

  '/codex/artistic_systems/artful_intelligence/6_figure_print_engine.md': documentBody(
    'Print Revenue Engine',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'User-confirmed print model and product goals; no six-figure performance evidence.',
    `Eddie's fine-art print model centers on one-of-one archival metal prints using ChromaLuxe.

## Confirmed business context

- One-of-one positioning is intentional.
- Fine-art qualification and high-value collector positioning have been explored.
- The Print Drop agent in Photographer Agent Pack V1 focuses on the print-drop workflow.

## Reality check

"Six figure" was a goal label, not a verified revenue result. This page contains no claimed annual revenue, conversion rate, collector count, sell-through rate, or active inventory because those figures have not been verified here.

## What would make this page stronger

A dated record of real drops: what was offered, to whom, and what sold. Private financial details belong in a private system, not on this public site.`,
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

## The packaged form

Photographer Agent Pack V1 packages three workflows for photographers: turning inquiries into bookings, moving edits to delivery, and running a print drop. A first-buyer execution kit exists to support launching it, including a short demo-reel script and outreach templates. Whether any buyer has used the pack is not verified here.

## Boundary

No claim is made that lead generation, client delivery, print fulfillment, bookkeeping, social posting, or newsletter publishing is fully automated. Each workflow requires direct verification, and a packaged agent being available is not evidence that it ran for a customer.`,
  ),

  '/codex/artistic_systems/artful_intelligence/pwa_iphone16.md': documentBody(
    'iPhone-First PWA Work',
    'VERIFIED PROJECT STATUS',
    'User-confirmed iPhone 16 Pro ownership and PWA prototype history, plus Legacy Codex and Control Panel repository evidence.',
    `Eddie uses an iPhone 16 Pro and consistently prioritizes mobile-first tools.

## Confirmed concepts and prototypes

- photo analysis and coaching interfaces
- Camera Coach and AstroCapture planning ideas
- a photographer workflow PWA
- CelestiaDome EEG visualization
- mobile 3D gallery work

These are separate experiments at different stages. This page does not combine them into a fictional single production app.

## Where iPhone-first is real today

- **Legacy Codex:** layout fixes driven by real iPhone screenshots, Home Screen icons added as static assets in early November 2026, and a live-voice route whose microphone and handshake waits were bounded in a recent fix.
- **Codex Control Panel:** described as a mobile-first dispatcher with voice input where the browser supports it.

## Unknown

App Store release, active users, offline reliability, and production backend status for the older prototypes are **Unknown — not verified**. Physical-iPhone behavior of recent Legacy Codex changes is listed in the product's own status notes as still to be confirmed by Eddie.`,
  ),

  '/codex/neuro': documentBody(
    'Neuro and Biometric Work',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'User-confirmed Muse 2 ownership and prototype history, plus a 2026-11-04 check of the foundry-console database.',
    `This territory covers experiments using a Muse 2 headset to explore focus, calm, stress, flow, and recovery. It is a personal creative technology project, not a medical device, diagnostic system, or validated neuroscience product.

## Pages in this territory

- Muse 2 EEG Pipeline: the device and the prototype pipeline.
- EEG WebSocket Bridge: the intended real-time path.
- Adaptive Model Status: why no trained model is claimed.
- WHOOP Integration Status: a recovery data source that is not connected.
- Biometric Visualization Concept: the CelestiaDome direction.

## What exists as structure

The Legacy Codex source contains a Biometrics tab component. This review did not inspect whether it shows real or sample data, so no biometric display is claimed. The foundry-console database has a set of tables with an nd_ prefix created by a neuro UX data migration: preferences, captures, bookmarks, and biometric trends. On 2026-11-04 the biometric trends table existed and held no rows.

## What does not exist

No validated brain-state detection, no trained adaptive model, no live WHOOP connection, and no clinical claim.`,
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

## The intended flow

The headset streams to the Mind Monitor app on the phone. The app forwards band values over OSC. A receiver turns those messages into events a visualizer can use, and a session summary is produced at the end.

## Confirmed project history

NeuroMuse and CelestiaDome prototypes explored live EEG bands, visual feedback, and session summaries.

## Limits

No clinical interpretation, diagnosis, validated brain-state detection, or proven flow classifier is claimed. Current end-to-end runtime status is **Unknown — not freshly verified**. Simulated, recorded, streamed, and modeled data must stay labeled as different things.`,
  ),

  '/codex/neuro/websocket_servers.md': documentBody(
    'EEG WebSocket Bridge',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'User-confirmed prototype pipeline; current server status not inspected in this repository.',
    `The intended path is Mind Monitor OSC to a local bridge, then WebSocket messages to a browser or native visualizer.

## Why a bridge

Mind Monitor speaks OSC over UDP, which a browser cannot read directly. A small local server translates the stream into WebSocket messages that a web page or app can subscribe to.

## Status

Prototype work exists in the project history. No always-on server URL, uptime, latency, throughput, or current deployment is verified on this page.

## Not built

A hosted, authenticated, monitored bridge. Retry and message-schema rules for real-time input are listed in the automation pipelines page as requirements.`,
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

## What would make it real

1. A dated set of real, labeled sessions with consent and storage rules.
2. A reproducible pipeline from raw signal to features.
3. An evaluation protocol with a held-out set.
4. A written statement of what the output may and may not be used for.

Until those exist, the system must be described as exploratory and rule-based.`,
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
- A biometric trends table exists in the foundry-console database and held no rows on 2026-11-04.

## Boundary

No recovery scores or health conclusions are displayed here. Health-related data requires consent, interpretation limits, and private storage before it informs any scheduling.`,
  ),

  '/codex/neuro/bio_geometry_engine.md': documentBody(
    'Biometric Visualization Concept',
    'UNVERIFIED CONCEPT — NOT IMPLEMENTED',
    'User-confirmed interest in responsive 3D EEG visualization.',
    `The concept is to translate live EEG signals into an expressive visual environment such as a dome, star field, sphere, or spatial animation.

## The clearest direction

CelestiaDome is the clearest named direction in the available project history. It joins the night-sky imagery at the center of Eddie's photography with live signal, so the visual reflects the person watching it.

## What is not claimed

No validated Bio Geometry Engine, production SDK, spatial-analysis model, or measured therapeutic effect is claimed.

## Rule for any future version

Any visual driven by biometric input must say whether the input is live, recorded, or simulated.`,
  ),

  '/codex/automation': documentBody(
    'Automation',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'Connected development workflows and repository, deployment, and commit-history evidence checked on 2026-11-04.',
    `Eddie uses AI agents and connected tools to reduce the friction of software development and project operations. The current reality is a collection of agent-assisted workflows, repositories, and deployments, not a single autonomous operating system.

## Automation that is observable today

- **Git-driven deploys:** pushes to main in the Legacy Codex and Artful Intelligence repositories produce Vercel production deployments.
- **Hosted checks:** repositories run continuous integration (lint, type checks, tests, build) on pull requests.
- **Evidence snapshot:** the Legacy Codex repository receives automated commits titled "update evidence snapshot" from a workflow; two production deployments on 2026-11-04 (UTC) were built from such commits.
- **Agent-authored pull requests:** recent merges in this repository carry coding-agent co-author trailers.
- **Knowledge-base skills:** the notion-wiki and personal-wiki folders define ingest, query, lint, and routing skills for a Notion workspace and an Obsidian-style vault.

## What is not established

Continuous operation of any pipeline, monitoring coverage, error-free synchronization, and customer-facing automation. Each pipeline needs its own live verification.

## Pages in this section

Multi-Agent Orchestration Status, Reliability Playbook, Photography Retrieval Status, and Automation Pipeline Status.`,
  ),

  '/codex/automation/multi_agent_orchestration.md': documentBody(
    'Multi-Agent Orchestration Status',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'User-confirmed cloud-agent usage and agent co-authorship in repository history; no persistent orchestrator verified.',
    `Multiple agents can inspect different bounded parts of a task in parallel, but their output must be reviewed and reconciled.

## Verified

- Cloud coding agents are part of Eddie's workflow.
- Repositories and deployment tools can be connected to agent sessions.
- Pull requests in this repository show agent co-authorship, and the repository's own status file records that a cloud agent here only has write access to this one repository, so sibling-repository fixes need their own sessions.

## Owner-described setups (not re-inspected here)

- **FABLE-LEADER-KIT:** a multi-agent orchestration setup for Claude Code with three workers (a builder, a verifier, and a researcher) and instruction templates for the legacy-codex and artful-intelligence repositories. Eddie described it as operational in July 2026.
- **Managed Agents memory scaffold:** a private repository for reusable per-client memory plumbing. In July 2026 Eddie reported that a second, independent session correctly recalled details a first session had written to the memory store. It is not yet tied to a shipping product, and a wider Managed Agents evaluation was parked until after a first paying buyer.

## Not verified

- persistent cross-agent memory in production
- autonomous task assignment
- a production queue or scheduler
- agents merging or deploying without explicit workflow authority`,
  ),

  '/codex/automation/reliability_playbook.md': documentBody(
    'Reliability Playbook',
    'CANONICAL DESIGN',
    'User-confirmed agent and tool-failure rules, and durable lessons recorded in the legacy-codex repository status file.',
    `## Working rules

1. Inspect the actual system before trusting old architecture prose.
2. Reproduce the failure and trace the data source.
3. Make one scoped correction at a time.
4. Use tests to prevent the false state from returning.
5. Explain failures briefly; do not dump raw errors on Eddie.
6. Retry a temporary failure once, then use a different safe path.
7. Verify identifiers and captured values before writes.
8. Never report success from intent alone.

## Lessons learned the hard way (from Legacy Codex status notes)

- **A failed read is not an empty state.** An empty list and a failed load look identical on screen, so the interface must know which one it has before it shows a reassuring first-run message.
- **supabase-js does not throw on failed writes.** It returns an error object, so wrapping a write in try and catch silently swallows rejected saves. Check the returned error on every write.
- **Do not create demo data in production to verify.** Each new browser mints a new anonymous user; scripted walks pollute the real database. Verify with tests and non-writing checks, and ask Eddie to confirm with his own real content.
- **Automated tests are not real-account proof.** Passing suites show the code behaves as written, not that a real person's session worked.
- **Measure phones at Safari's visible height.** A layout that fits a tall desktop emulation can hide the primary button under the tab bar.
- **Equal source is not equal configuration.** Two deployments of one commit can still differ in environment variables and behavior.`,
  ),

  '/codex/automation/rag_photography.md': documentBody(
    'Photography Retrieval Status',
    'UNVERIFIED CONCEPT — NOT IMPLEMENTED',
    'A prior design described retrieval over photography material; no indexed production knowledge base is verified.',
    `A photography retrieval system could use Eddie's camera manuals, field notes, confirmed gear, and teaching material to answer context-specific questions.

## Current status

- Production vector database: **Not verified**
- Indexed manuals or note count: **Unknown**
- Embedding model: **Not selected here**
- Query latency, relevance, satisfaction, and accuracy: **Not measured**

The earlier counts and performance numbers were unsupported and have been removed.

## Nearest real things (not the same thing)

- Legacy Codex project review reads real, account-scoped mission notes and evidence on the server before answering. That is retrieval over a person's saved work, not over photography material.
- The notion-wiki and personal-wiki folders define a raw to skills to wiki pattern for organizing knowledge by hand and by agent. It is a document workflow, not a vector index.

## What would make it real

A defined corpus, a stated retrieval method, and a small set of real questions with answers Eddie judges correct. Only then can accuracy be reported.`,
  ),

  '/codex/automation/automation_pipelines.md': documentBody(
    'Automation Pipeline Status',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'Repository, GitHub, Vercel, and Supabase evidence.',
    `## Verified components

- GitHub repositories store application code and history.
- Vercel projects deploy several web applications from Git.
- This site reads Codex documents with a Supabase-backed path and a canonical repository fallback.
- Edition Manager-related APIs and scripts exist in this repository.
- Legacy Codex has an evidence snapshot workflow that commits a status file when evidence changes.
- The foundry-console database has row-level security enabled on every public table seen on 2026-11-04.

## Requirements for any real-time or scheduled pipeline

Define the trigger, the owner, the state transitions, the failure path, how retries avoid duplicate writes, and the evidence that proves it ran. Real-time inputs, such as an EEG stream, also need a message schema and a retry rule.

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

## Lines of work

- **Fine-art prints:** one-of-one archival metal prints for collectors (see the print model pages).
- **Photography services:** portrait and event work.
- **Education and workshops:** teaching, with the Namibia workshop as the major unfinished project.
- **Digital creator tools:** Photographer Agent Pack V1 and the wider Artful Intelligence direction.

## What is deliberately not on this site

Revenue, customer counts, prices, and private records are not published without current verified records, and private financial details never belong on this public viewer.`,
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

## The software side

The Print Drop agent is a shipped component of Photographer Agent Pack V1, and Edition Manager code exists to track editions. Neither proves a fully automated sales operation.

## What a stronger page needs

A dated record of the most recent drop: what was offered, the audience reached, and the result, kept in a private system with only public-safe facts brought here.`,
  ),

  '/codex/business/workshop_engines.md': documentBody(
    'Workshop Business Status',
    'VERIFIED PROJECT STATUS',
    'User-confirmed Namibia attempts and current planning direction.',
    `Eddie is a natural teacher and has pursued photography workshop products, especially Namibia.

## Confirmed reality

- Multiple Namibia launch attempts occurred between 2020 and 2023.
- Those attempts produced limited signups and did not become the intended completed workshop.
- Richard Morsbach is the named local guide and partner.
- A redesigned 7-night/8-day format is being considered for 2027 or 2028.

## Open decisions

The date window, final route, and final price are unconfirmed.

There is no confirmed current workshop date, enrollment count, venue, price, profit, or launch funnel on this page.`,
  ),

  '/codex/business/money_os.md': documentBody(
    'Money OS',
    'VERIFIED PROJECT STATUS',
    'User requested financial tracking; this Vercel site is not the appropriate ledger.',
    `Private financial figures are intentionally excluded from this public architecture site.

## Public-safe status

This viewer intentionally contains no personal financial history, balances, obligations, income, expenses, tax information, or private business records.

## Rule

Financial planning belongs in a private, access-controlled system with dated source records. No invented targets, allocations, dashboards, deductions, or tax payments are permitted here.

## What a recommendation must include

Any monetization suggestion must name a buyer, a price band, a first deliverable within 14 days, a sales channel, and the proof required. A vague plan is not accepted.`,
  ),

  '/codex/personal_os': documentBody(
    'Personal OS',
    'CANONICAL DESIGN',
    'User-confirmed accessibility and work preferences.',
    `The Personal OS is a practical support layer for preserving context, lowering overwhelm, and turning complex visions into one manageable next action.

## What it contains

Working With Eddie (what helps and what does not), the Accessible Work System (design requirements for tools), and Reflections Between Worlds (the roles and the tension between them).

## What it must not become

It should support Eddie's life and creativity, not turn self-understanding into another endless optimization project. New frameworks are not added until a current artifact has shipped or been user-tested.

## How it reaches the software

The same principles appear in Legacy Codex as a single next move, saved drafts that survive reload, and honest empty and failed states.`,
  ),

  '/codex/personal_os/personality_manual.md': documentBody(
    'Working With Eddie',
    'VERIFIED FACTS',
    'User-confirmed communication and execution preferences.',
    `## What works

- Guide the conversation and ask specific questions.
- Ask one important question at a time when possible, and only what is needed to start.
- Start with the outcome, then give concrete steps.
- Explain unfamiliar technical terms in plain language without talking down.
- Use direct links for tools, setup, and verification.
- Prefer one safe command or one-step deployment over repeated terminal copy-and-paste.
- Prefer the smallest safe patch.
- Make progress visible through working artifacts.
- Be direct when an idea is not viable or evidence is missing.
- End substantial answers with one concrete next action.

## What does not work

- invented details
- vague reassurance
- long unprioritized lists
- claiming access or completion that was not verified
- treating plans as shipped products
- building a new framework before a current one has shipped

## For strategy requests

Lead with a verdict, then why it matters, the move, the build path, the risks, and the next action.`,
  ),

  '/codex/personal_os/neurodivergent_os.md': documentBody(
    'Accessible Work System',
    'VERIFIED FACTS',
    'User-confirmed interaction preferences and accessibility needs, plus early outside feedback on the product.',
    `Eddie benefits from systems that reduce working-memory load and ambiguity.

## Practical design requirements

- preserve context across sessions
- reduce decisions to the next meaningful choice
- use visual end-states and reverse-engineered steps
- avoid unnecessary context switching
- make recovery and sleep legitimate constraints
- separate urgent action from optional ideas
- record decisions outside chat

## Early outside feedback

In October 2026 the first outside person to use Legacy Codex for a real assignment said the recommended small next moves were the most helpful part, especially for getting past writer's block. That supports the design choice of one small next move over a long plan.

## Boundary

This is an accessibility and workflow framework, not a medical treatment plan. No diagnosis or health claim is made on this public page.`,
  ),

  '/codex/personal_os/reflections_between_worlds.md': documentBody(
    'Reflections Between Worlds',
    'VERIFIED FACTS',
    'User-confirmed roles, creative themes, and the tension between art and software building.',
    `Eddie moves between several real roles: professional photographer, teacher, and AI builder.

The central tension is not lack of ideas. It is protecting enough energy and continuity to turn vivid creative visions into finished, testable work.

## What the roles share

Eddie describes seeing end-states vividly and needing help working out the path to them. That is why the system favors reverse-engineered, concrete next steps.

## The recurring center

The recurring artistic center is awe: night skies, landscapes, time, silence, and the feeling that human life belongs inside something much larger.

## Why it is in the Codex

A repeated personal insight should become system learning instead of being rediscovered. The principle behind Legacy Codex is to carry a lesson out of the context where it was learned and into new work.`,
  ),

  '/codex/convergence': documentBody(
    'Convergence',
    'VERIFIED PROJECT STATUS',
    'User-confirmed product differentiation and observable repository and deployment work, checked on 2026-11-04.',
    `Convergence is where photography, neurotechnology experiments, personal context, business tools, and software infrastructure are evaluated together. The goal is useful connection, not a claim that every system is already integrated.

## Pages in this section

- **Current Integration Status:** what is verified, active, and removed, with dates.
- **System Reflexivity:** how the system checks whether it is producing real outcomes.
- **System Inventory:** every repository, deployment, and database that makes up the ecosystem, with what was checked.
- **Legacy Codex Product:** the main product in detail.
- **Not Built Yet:** planned, blocked, and unproven work.

## The principle behind convergence

Recognize when superficially unrelated things share the same underlying structure, and carry a lesson out of the context where it was learned into new work. This is the idea Legacy Codex is built around. It is a design principle, not a claim of sentience or consciousness.`,
  ),

  '/codex/convergence/convergence_log_v16.md': documentBody(
    'Current Integration Status',
    'VERIFIED PROJECT STATUS',
    'GitHub, Vercel, and Supabase inspection on 2026-11-04 plus user-confirmed June to November 2026 project updates.',
    `The file name still says v16. The page is a current, dated status, not a version log.

## Verified progress

- **Product boundary defined (2026-09-07 decisions):** Legacy Codex is canonical; Foundry Console is an internal component; the Control Panel migrates into Legacy Codex; this site is architecture and governance; Artful Intelligence is separate on purpose.
- **Legacy Codex core loop:** capture, clarify, constrain, choose, act, resume was runtime-verified in a persistent real session on 2026-09-07.
- **Recent Legacy Codex work:** the Home screen became the Codex Glass screen with its orb (2026-10-30); a Territory workspace was recorded as merged, deployed, and live (2026-11-04); an atomic next-action replacement merged on 2026-11-03.
- **Foundry Console database:** owner-only access and hardening migrations are applied, with the latest applied migration dated 2026-10-20. The project reported healthy on 2026-11-04 after an earlier period when its free tier had been paused.
- **Photographer Agent Pack V1:** shipped in June 2026 with a Vercel storefront and Gumroad listing.
- **This architecture viewer:** deployed from main on 2026-09-06 and connected to Supabase document data. This content refresh is not live until it is merged and deployed.
- **Reality repair:** a July 2026 audit found and replaced a large fabricated corpus in this site.

## Active or incomplete

- Broader Artful Intelligence platform: incomplete.
- Artful Intelligence backend on Render: current state unknown.
- Photo Coach production service: not verified live.
- Muse and EEG end-to-end runtime: not freshly verified.
- Namibia workshop: candidate 2027 or 2028, not booked.
- Owner-scoped document interactions in this viewer: migration not applied.
- Deployment consolidation contract: proposed, not accepted.
- Automated creator and business operating system: not verified.

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

## Examples of the loop working

- A July 2026 reality audit of this site removed a fabricated corpus and added tests that fail if known false claims return.
- A builder-continuity incident on 2026-10-31 was recorded with its source messages and turned into a standing instruction and a continuous-integration check.
- An audit on 2026-10-16 replayed real data and reported that no confirmed lesson transfer had yet been observed, instead of declaring the learning feature proven.
- An early-September finding that the mission tables were empty in production shaped how the first demonstration was designed.

## What this page does not claim

No productivity, recovery, focus, revenue, relationship, or creative-satisfaction metric is assumed without a dated real dataset.`,
  ),

  '/codex/convergence/system_inventory.md': documentBody(
    'System Inventory',
    'VERIFIED PROJECT STATUS',
    'GitHub repository list, Vercel project and deployment records, Supabase project and table inspection, and repository status files, all read on 2026-11-04.',
    `This page lists what comprises the Codex ecosystem and what was actually checked. Rows marked "not inspected" are real parts of the ecosystem whose current state this review could not read.

## Products and where they run

| Piece | Source | Runs on | State on 2026-11-04 |
| --- | --- | --- | --- |
| Legacy Codex | legacy-codex repository (public) | Vercel project frontend, domain legacy-codex.vercel.app; Next.js 16 and React 19 | Latest production deployment ready from main; repository pushed the same day |
| Foundry Console | foundry-console folder inside legacy-codex | Vercel project foundry-console | Built the same commit as frontend; separate owner-only boundary; equal configuration not shown |
| Codex Control Panel | codex-control-panel repository (public) | Vercel project codex-control-panel | Last repository push 2026-10-16; routing migrating into Legacy Codex |
| Architecture viewer (this site) | codex-system-architecture repository (public) | Vercel project codex-system-architecture; Vite and React 18 | Last production deployment 2026-09-06; generated domains sit behind Vercel sign-in and no custom domain is attached |
| Artful Intelligence | Artful-Intelligence repository (private) | Vercel project artful-intelligence; backend documented on Render | Production deployments ready, latest early October 2026; Render not inspected |
| Photographer Agent Pack V1 | packaged product | Gumroad listing and a Vercel storefront | Shipped June 2026; listing not reachable from this review |
| PocketForge | pocketforge folder inside legacy-codex (Convex and iOS) | not established | A 2026-09-07 status note said its agent file did not parse and needs its own decision; not rechecked |

## Data

| Database | Contents seen | State |
| --- | --- | --- |
| Supabase foundry-console | Reviewed documents (64 rows) and relationships (26), actions, routed requests, events, evidence, missions and mission events, truth-ladder tables, territory entities, neuro UX tables | Healthy. 30 migrations recorded, latest 2026-10-20. Row-level security on for every public table. Owner-scoped document-interaction tables absent |
| Supabase artful-intelligence | Not read | Healthy; created 2026-07-15 |

## Other surfaces

- **Notion workspace:** an LLM wiki hub, a project page, and a ship sheet are linked from the repository README. Not inspected.
- **edwardemory.com:** the business site on WordPress. Not inspected.
- **GitHub account:** also holds a knowledge hub repository, a systems repository, and a portfolio repository. Not inspected.
- **Vercel team:** 35 projects. Besides the ones above, several are diagnostics, previews, retired, or renamed (for example archived-legacy-codex and foundry-console-retired). They are archaeology until dependencies are checked; do not delete by age or name.

## Known contradictions

- The Vercel project named frontend, not the one named legacy-codex, owns the canonical domain.
- Two Vercel projects building one commit does not prove equal configuration.
- A July note recorded a naming collision across eleven Codex artifacts, including two called Codex Control Panel. Whether it was resolved is **Needs confirmation**.`,
  ),

  '/codex/convergence/legacy_codex_product.md': documentBody(
    'Legacy Codex Product',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'legacy-codex repository documents and source at commit 7c20b55, plus Vercel and Supabase checks on 2026-11-04.',
    `Legacy Codex is the canonical human-facing product of the ecosystem. It exists to preserve context, clarify what matters, choose the next meaningful action, and let Eddie resume without rebuilding the whole situation.

## North Star

Preserve human intent so another intelligence can reconstruct, execute, verify, and continue it. The cross-system doctrine is the Goose Cookbook, kept in this repository's notion-wiki folder. A reviewed projection of it ships in the product and is passed to the model routes. Legacy Codex is more than a next-action tool: discovery, creation, synthesis, and recognition do not each have to produce an action.

## The core loop

Capture, clarify, constrain, choose, act, resume. On 2026-09-07 one real mission was captured, one linked action was saved, started, paused with a note, reloaded as ready to resume, and resumed with no duplicate and no error. That is the strongest runtime proof on record.

## Screens present in the source

- **Home:** the default screen since 2026-10-30, called Codex Glass. A single orb with a live state word, a greeting, four starter chips, and a pill composer with a tools sheet. Orb states are meant to come from real causes, not decoration.
- **Mission:** the working surface. A recommended next move, saved actions that can be started, paused, and resumed, attached project files, and a project review that critiques its own proposal once.
- **Brief:** Daily Brief, Triage, and Ask over saved missions.
- **Territory:** a map and list workspace with lenses for missions, projects, doctrine, and constraints; recorded as live on 2026-11-04.
- **Controls:** account and settings, including email sign-in work.
- Several other tab components exist in the source (Codex, Origin, Overview, Protocols, Biometrics, Resumption Log, Sprint Linker, Constraint Validator). Whether each is reachable in current navigation was not checked.

## How the AI part works

- Server routes handle analysis, briefs, next-move operations, project reviews, lessons, lesson relay, live voice, and task routing.
- Text answers use a chain from Claude to an optional Gemini step to OpenAI, name the answering provider, and give a sanitized reason when a fallback occurs. File analysis uses Claude only. Model routing was refreshed on 2026-10-31.
- Project review reads real, account-scoped notes, evidence, and commitments on the server. A proposed lesson becomes a scoped rule only after Eddie confirms it with conditions, and it can be retired later. Ember color is reserved for a boomerang, meaning a lesson verifiably carried into a different mission.

## Data and identity

Data lives in the foundry-console Supabase project under row-level security. Visitors sign in anonymously, so a fresh browser is a new user with no missions. An email sign-in flow exists for attaching an email and signing in elsewhere. A failed session read never replaces an existing identity, and a failed data read is never shown as an empty workspace.

## What is verified

Merged and deployed: atomic next-action replacement, merged 2026-11-03 and carried by the canonical deployment. Runtime verified: the core loop on 2026-09-07.

## What is not proven

- Candidate work not recorded as shipped: Legacy Relay (passing a confirmed lesson to someone else), an iPhone layout repair, and email sign-in conversion.
- Real-account model usefulness, confirmed-lesson transfer across missions, and recovery on Eddie's original iPhone. An audit on 2026-10-16 found no confirmed lesson transfer yet.
- Not authorized yet: navigation changes, a Handoff surface, a lesson workflow, a native wrapper, and a replacement notes system.`,
  ),

  '/codex/convergence/not_built_yet.md': documentBody(
    'Not Built Yet',
    'MIXED — FACTS AND UNIMPLEMENTED DESIGN',
    'Repository status files, Supabase and Vercel inspection on 2026-11-04, and user-confirmed project history. Items marked unknown could not be inspected.',
    `This page lists what is missing, blocked, or unproven. It exists so that a plan is never mistaken for a product. Each item says what is true today and what would change it.

## Built, but blocked or not yet applied

- **Owner-scoped document interactions in this viewer.** Bookmarks, reading progress, notes, and profiles are designed and the migration file is in this repository. On 2026-11-04 the foundry-console database had none of those tables and the migration was not in its applied list. Signed-in overlays cannot persist until an operator applies it with project credentials.
- **This content refresh.** It is not live until it is merged and deployed. The new pages here have no database rows yet; they render from the repository copy as read-only until a forward-only migration adds them.
- **Territory entities.** The workspace is live, but the territory_nodes table held no rows on 2026-11-04, so no project, doctrine, or constraint entities have been saved.

## Designed or specified, not shipped

- **Territory links.** Entity-to-mission connections are designed for a second phase. None are drawn.
- **Legacy Relay.** A consent-based way to pass a confirmed lesson to another person. The first slice is a candidate; automated tests are not proof of a real two-person transfer.
- **Model accountability layer.** A contract recorded on 2026-11-02 requires unsupported claims about capability or completed action to be checkable against receipts. Enforcement is not shipped.
- **Email sign-in conversion.** Prepared in October; real email delivery and conversion on Eddie's own account are **Needs confirmation**.
- **Deployment consolidation.** The proposed contract and its tracking issue remain open; its checklist is unchecked and parity between the two Vercel projects is not established.
- **A reachable public viewer.** This site's generated Vercel domains require Vercel sign-in and no custom domain is attached. Outsiders cannot read it today. It also has no handling for sign-in error redirects: on 2026-11-04 an expired emailed sign-in link landed on this site with an otp_expired error and nothing explained it. The link likely pointed here because of a redirect setting (**Inference**).

## Unproven with real accounts

- Model answer quality and the full objective, next action, save, reload, resume workflow with a real model on a real account.
- Confirmed-lesson transfer between missions.
- Physical-iPhone behavior of recent layout and voice fixes.

## Concepts with no implementation

A running council of agents, a persistent agent swarm, a verified territory engine, a trained adaptive biometric model, a live WHOOP connection, a photography retrieval index, a biometric visualization engine, and an automated creator and business operating system. Each has its own status page.

## Business items that are unconfirmed

- Namibia workshop: dates, route, price, and bookings.
- Firefall trip: no confirmed plan.
- Photographer Agent Pack V1: first-buyer status and the live listing price and link were not verified.
- Print drops: inventory, dates, and results.

## Parts that were not inspected

The Artful Intelligence backend on Render, the Notion workspace, the WordPress business site, the Gumroad listing, Photo Coach in production, the Edition Manager at runtime, the EEG pipeline at runtime, and the PocketForge module.

## Empty structures

The manual table and the biometric trends table existed and held no rows on 2026-11-04.`,
  ),

};

export const CODEX_DOCUMENT_BODIES: Record<string, string> = Object.fromEntries(
  Object.entries(BASE_CODEX_DOCUMENT_BODIES).map(([path, body]) => [
    path,
    operationalizeDocument(path, body),
  ]),
);

export function getCodexDocumentBody(path: string, fallback = ''): string {
  return CODEX_DOCUMENT_BODIES[path] ?? fallback;
}

export interface CodexDocumentProvenance {
  provenance_status: ProvenanceStatus[];
  evidence_basis: string;
  last_reviewed: string;
}

const provenanceOrder: ProvenanceStatus[] = [
  'verified',
  'repository_evidence',
  'concept',
  'unknown',
];

/** Documents with a reviewed, explicit unresolved-current-state boundary. */
const CANONICAL_UNKNOWN_PATHS = new Set([
  '/codex/artistic_systems/photography_ops/gear_specs.md',
  '/codex/artistic_systems/photography_ops/firefall_2026.md',
  '/codex/artistic_systems/photography_ops/namibia_2026.md',
  '/codex/artistic_systems/artful_intelligence',
  '/codex/artistic_systems/artful_intelligence/ai_overview.md',
  '/codex/artistic_systems/artful_intelligence/photo_coach_mvp.md',
  '/codex/artistic_systems/artful_intelligence/edition_manager.md',
  '/codex/artistic_systems/artful_intelligence/6_figure_print_engine.md',
  '/codex/artistic_systems/artful_intelligence/creative_automations.md',
  '/codex/artistic_systems/artful_intelligence/pwa_iphone16.md',
  '/codex/neuro',
  '/codex/neuro/muse2_eeg_pipeline.md',
  '/codex/neuro/websocket_servers.md',
  '/codex/neuro/adaptive_ml_models.md',
  '/codex/neuro/whoop_integration.md',
  '/codex/neuro/bio_geometry_engine.md',
  '/codex/automation/rag_photography.md',
  '/codex/automation/automation_pipelines.md',
  '/codex/business/drop_model.md',
  '/codex/business/workshop_engines.md',
  '/codex/convergence/convergence_log_v16.md',
  '/codex/convergence/legacy_codex_product.md',
  '/codex/convergence/not_built_yet.md',
]);

/** Parse the required evidence header into machine-readable provenance. */
export function getCodexDocumentProvenance(path: string): CodexDocumentProvenance {
  const content = CODEX_DOCUMENT_BODIES[path];
  if (!content) throw new Error(`Missing canonical Codex body for ${path}`);

  const evidenceStatus = content.match(/^\*\*Evidence status:\*\* ([^\r\n]+)$/m)?.[1];
  const evidenceBasis = content.match(/^\*\*Evidence basis:\*\* ([^\r\n]+)$/m)?.[1];
  const lastReviewed = content.match(/^\*\*Last reviewed:\*\* (\d{4}-\d{2}-\d{2})$/m)?.[1];

  if (!evidenceStatus || !evidenceBasis || !lastReviewed) {
    throw new Error(`Incomplete provenance header for ${path}`);
  }

  const statuses = new Set<ProvenanceStatus>();
  if (/VERIFIED FACTS|VERIFIED PROJECT STATUS|MIXED/.test(evidenceStatus)) {
    statuses.add('verified');
  }
  if (/repository|GitHub|Vercel|Supabase|source code|deployment/i.test(evidenceBasis)) {
    statuses.add('repository_evidence');
  }
  if (/DESIGN|CONCEPT|UNIMPLEMENTED/.test(evidenceStatus)) {
    statuses.add('concept');
  }
  if (
    /UNVERIFIED|Unknown|not verified|not freshly verified/i.test(
      `${evidenceStatus}\n${evidenceBasis}`,
    ) || CANONICAL_UNKNOWN_PATHS.has(path)
  ) {
    statuses.add('unknown');
  }

  if (statuses.size === 0) {
    throw new Error(`Unsupported evidence status for ${path}: ${evidenceStatus}`);
  }

  return {
    provenance_status: provenanceOrder.filter((status) => statuses.has(status)),
    evidence_basis: evidenceBasis,
    last_reviewed: lastReviewed,
  };
}
