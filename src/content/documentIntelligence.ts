export type RelationshipKind = 'related' | 'bridges';

export type ReviewState = 'current' | 'due' | 'stale' | 'unknown';

export interface DocumentIntelligence {
  outcome: string;
  nextAction: string;
  proof: string;
  repository: string | null;
  reviewCadenceDays?: number;
}

export interface DocumentRelationship {
  sourcePath: string;
  targetPath: string;
  kind: RelationshipKind;
  rationale: string;
}

export interface OutcomeDraft {
  sourcePath: string;
  task: string;
  repository: string;
  requiredEvidence: string;
  chipId: 'execute' | 'research' | 'architect' | 'ship' | 'document' | 'status';
}

export const CANONICAL_REVIEW_DATE = '2026-08-24';

const CATEGORY_PLAYBOOKS: Record<
  string,
  {
    cadenceDays: number;
    decisionRules: readonly string[];
    evidenceSources: readonly string[];
  }
> = {
  root: {
    cadenceDays: 90,
    decisionRules: [
      'Use durable identity and working preferences to guide decisions; do not turn them into rigid personality claims.',
      'Keep private identity, employment, location, health, and financial details out of the public corpus.',
      'When a preference conflicts with current evidence or an explicit instruction, current evidence and the explicit instruction win.',
    ],
    evidenceSources: [
      'Owner-confirmed statements and durable operating preferences.',
      'Observed interaction patterns that have been explicitly promoted into project doctrine.',
    ],
  },
  council: {
    cadenceDays: 90,
    decisionRules: [
      'Treat every role as a review lens unless a real owner, agent, or service is explicitly named and verified.',
      'Surface contradictions between lenses instead of averaging them into vague consensus.',
      'Eddie remains the final decision-maker for product direction, exposure, deletion, and irreversible changes.',
    ],
    evidenceSources: [
      'Current agent doctrine, repository instructions, and owner-approved product boundaries.',
      'Verified decisions and postmortems showing how a lens changed an outcome.',
    ],
  },
  territory: {
    cadenceDays: 30,
    decisionRules: [
      'Prefer one explicit active outcome over a long undifferentiated backlog.',
      'Separate current state, next action, blocker, owner, and proof of completion.',
      'Do not mark work complete until the requested result is verified at the user-facing surface.',
    ],
    evidenceSources: [
      'Current repository state, active tasks, pull requests, deployments, and verified blockers.',
      'Dated decisions that supersede older status notes.',
    ],
  },
  artistic_systems: {
    cadenceDays: 60,
    decisionRules: [
      'Protect authorship, artistic intent, and real-world craft; automation should remove friction, not invent a body of work.',
      'Separate confirmed equipment, shoots, workshops, releases, and customers from ideas or candidate plans.',
      'Define the audience-facing or studio-facing result before selecting software or automation.',
    ],
    evidenceSources: [
      'Owner-confirmed creative practice, public portfolio evidence, and current project repositories.',
      'Dated product, deployment, event, inventory, or publication evidence where the claim depends on current status.',
    ],
  },
  neuro: {
    cadenceDays: 30,
    decisionRules: [
      'Never turn exploratory biometric signals into medical claims or diagnoses.',
      'Label simulated, recorded, streamed, modeled, and clinically interpreted data as different states.',
      'Require a dated dataset and reproducible pipeline before claiming an adaptive or personalized effect.',
    ],
    evidenceSources: [
      'Current neurocreative-platform code, captured datasets, runtime logs, and reproducible analyses.',
      'Owner-confirmed device access and explicit boundaries around health-sensitive data.',
    ],
  },
  automation: {
    cadenceDays: 30,
    decisionRules: [
      'A workflow is automated only when its trigger, owner, state transition, failure path, and evidence are operational.',
      'Preserve human approval for destructive, public, financial, credential, and high-impact actions.',
      'Prefer observable retries and idempotent writes over hidden autonomous behavior.',
    ],
    evidenceSources: [
      'Current workflow code, tests, run logs, task bindings, and verified external side effects.',
      'Failure cases showing that retries, ownership, and recovery behavior work as described.',
    ],
  },
  business: {
    cadenceDays: 30,
    decisionRules: [
      'Keep private financial figures private and never infer revenue, demand, conversion, or inventory.',
      'Define the customer, offer, delivery promise, capacity constraint, and proof of demand separately.',
      'Treat projections as scenarios until transactions or other dated market evidence exist.',
    ],
    evidenceSources: [
      'Owner-confirmed offers and constraints, public product pages, and dated operating evidence.',
      'Private financial or customer evidence only inside owner-authenticated systems, never in this public corpus.',
    ],
  },
  personal_os: {
    cadenceDays: 90,
    decisionRules: [
      'Design for access and reduced cognitive load without turning support needs into fixed limitations.',
      'Prefer practical environmental changes and reversible routines over unsupported psychological conclusions.',
      'Private reflections remain private unless the owner explicitly promotes a transferable lesson.',
    ],
    evidenceSources: [
      'Owner-confirmed working preferences and explicitly approved operating rules.',
      'Observed outcomes from a routine only when a dated record exists and the owner wants it retained.',
    ],
  },
  convergence: {
    cadenceDays: 14,
    decisionRules: [
      'Merged, deployed, runtime-verified, and outcome-producing are separate states.',
      'A new interface may reveal an older intent more clearly; improved observability is not automatically a new vision.',
      'Promote repeated lessons into doctrine, tests, schemas, or workflows instead of preserving endless transcripts.',
    ],
    evidenceSources: [
      'Live cross-repository, deployment, database, and user-facing verification.',
      'Contradiction audits comparing canonical doctrine with current implementation and outcomes.',
    ],
  },
};

export const DOCUMENT_INTELLIGENCE: Record<string, DocumentIntelligence> = {
  '/codex': {
    outcome: 'A single trustworthy map makes the purpose, boundaries, current state, and next useful move across the Codex ecosystem reconstructable by a human or agent.',
    nextAction: 'Start from the territory tied to the outcome you are trying to move, then use its next move and proof requirement instead of browsing the corpus passively.',
    proof: 'A reader can locate the correct territory, distinguish live systems from concepts, and identify a verifiable next action without consulting a separate transcript.',
    repository: 'codex-system-architecture',
    reviewCadenceDays: 14,
  },
  '/codex/root': {
    outcome: 'Durable identity, access needs, and truth rules consistently shape execution without exposing private details or becoming unchallengeable mythology.',
    nextAction: 'Review Identity, Territory Mode, and Reality Filter together whenever a system-level decision feels locally correct but globally wrong.',
    proof: 'A current decision can cite the exact Root rule that changed its scope, interaction model, or evidence standard.',
    repository: 'codex-system-architecture',
  },
  '/codex/root/identity.md': {
    outcome: 'Creative and technical work preserves Eddie’s authorship, visual values, teaching practice, and actual professional identity while excluding private facts.',
    nextAction: 'Use this identity boundary to review the next public description, product page, creative automation, or agent-generated biography before publishing it.',
    proof: 'Published material accurately reflects confirmed practice and contains no invented credentials, projects, equipment, achievements, or personal details.',
    repository: null,
  },
  '/codex/root/territory_mode.md': {
    outcome: 'Work begins from a vivid finish line and advances one protected real-world result with minimal routing and context loss.',
    nextAction: 'Name the finish line, the smallest irreversible uncertainty, and the next reversible action for the active task.',
    proof: 'The active task has one owner-visible outcome, one next action, one blocker state, and explicit evidence for completion.',
    repository: 'codex-control-panel',
    reviewCadenceDays: 30,
  },
  '/codex/root/reality_filter.md': {
    outcome: 'Every meaningful claim is visibly classified as verified, repository evidence, inference, concept, stale, or unknown before it influences a decision.',
    nextAction: 'Challenge the highest-impact unsupported claim in the active project and either verify it, narrow it, or mark it unknown.',
    proof: 'No user-facing status or canonical document presents a plan, historical note, mock, or inferred metric as current reality.',
    repository: 'codex-system-architecture',
    reviewCadenceDays: 30,
  },
  '/codex/council': {
    outcome: 'Important decisions are reviewed through complementary product, systems, access, integrity, creative, and owner lenses without pretending a council runtime exists.',
    nextAction: 'Apply only the two or three lenses that can materially change the current decision and record any contradiction they expose.',
    proof: 'The final decision states which lenses were used, what contradiction mattered, and who retained decision authority.',
    repository: 'codex-system-architecture',
  },
  '/codex/council/roles': {
    outcome: 'Each role page produces a distinct review question and does not blur conceptual perspectives into employees, autonomous agents, or delegated authority.',
    nextAction: 'Choose the lens most likely to falsify the current plan, then run that review before implementation expands.',
    proof: 'Role reviews produce specific scope, risk, evidence, experience, or authorship corrections rather than generic approval.',
    repository: 'codex-system-architecture',
  },
  '/codex/council/roles/architect.md': {
    outcome: 'Product boundaries remain coherent across Legacy Codex, Foundry Console, Control Panel, System Architecture, PocketForge, and Artful Intelligence.',
    nextAction: 'For the active feature, state which product owns the user problem, which system executes it, and what must remain out of scope.',
    proof: 'The feature has one primary product owner and does not duplicate an existing interface or collapse distinct execution and intention surfaces.',
    repository: 'codex-control-panel',
  },
  '/codex/council/roles/systems_architect.md': {
    outcome: 'Repositories, data stores, deployments, authentication, and failure boundaries form an observable system whose claims can be traced to current evidence.',
    nextAction: 'Draw the active request path from user action through repository, deployment, database, and verification surface; mark every unverified hop.',
    proof: 'The system path names canonical owners, interfaces, failure modes, and a user-facing verification for every release-gating dependency.',
    repository: 'codex-control-panel',
    reviewCadenceDays: 30,
  },
  '/codex/council/roles/ux_specialist.md': {
    outcome: 'The system reduces cognitive load, supports visual reasoning, works on the actual target device, and leads with a usable outcome instead of tooling jargon.',
    nextAction: 'Exercise the current primary workflow on the smallest supported viewport and remove the first point that requires unnecessary interpretation or copy-paste work.',
    proof: 'A user can complete the core task with clear language, visible state, accessible controls, and no avoidable terminal or authentication ping-pong.',
    repository: 'codex-system-architecture',
    reviewCadenceDays: 30,
  },
  '/codex/council/roles/cdaao.md': {
    outcome: 'AI and data features preserve provenance, privacy, uncertainty, and human authority while refusing unsupported personal, business, health, or performance claims.',
    nextAction: 'Trace one consequential output back to its source, transformation, permission boundary, and freshness date; record any missing link.',
    proof: 'A reviewer can reconstruct where the output came from, what is inferred, what is private, and which action still requires human approval.',
    repository: 'codex-system-architecture',
    reviewCadenceDays: 30,
  },
  '/codex/council/roles/creative_agent.md': {
    outcome: 'Creative systems amplify Eddie’s visual authorship and teaching voice without replacing photographs, inventing work, or optimizing away emotional truth.',
    nextAction: 'Review the next generated creative asset against authorship, factual provenance, visual identity, and whether it serves the intended audience experience.',
    proof: 'The delivered artifact is clearly sourced, visually coherent with the real body of work, and useful without misrepresenting authorship.',
    repository: 'Artful-Intelligence',
    reviewCadenceDays: 60,
  },
  '/codex/council/roles/chairman.md': {
    outcome: 'Owner authority is explicit at material decision points while routine reversible implementation can continue without repeated micro-confirmations.',
    nextAction: 'Identify whether the current decision is reversible execution, structural direction, sensitive exposure, deletion, or production mutation and apply the matching approval boundary.',
    proof: 'Work advances autonomously inside approved scope and stops before materially different, destructive, public, credential, financial, or privacy-impacting actions.',
    repository: null,
  },
  '/codex/council/protocols': {
    outcome: 'Recurring collaboration lessons become concise operational rules that improve execution, verification, and continuity across agents and repositories.',
    nextAction: 'Promote the most repeated current correction into a canonical rule, test, schema, or runbook and remove conflicting duplicate guidance.',
    proof: 'A future agent behaves differently without rereading the originating conversation, and the rule remains traceable and challengeable.',
    repository: 'codex-control-panel',
  },
  '/codex/council/protocols/7_phase_protocol.md': {
    outcome: 'Complex work moves from orientation through verified completion with evidence gates that prevent implementation, deployment, and live outcomes from being conflated.',
    nextAction: 'Place the active task in its actual phase and name the missing artifact required to advance to the next phase.',
    proof: 'The task has explicit orientation, verified starting state, outcome, scoped execution, validation evidence, and a durable closeout record.',
    repository: 'codex-control-panel',
    reviewCadenceDays: 30,
  },
  '/codex/council/protocols/swarm_layer.md': {
    outcome: 'Parallel agents work on bounded, independently reviewable tasks with real ownership, shared evidence, and no duplicated or falsely attributed output.',
    nextAction: 'Before delegating, split work by non-overlapping artifact, bind each worker to a trackable item, and define its verification handoff.',
    proof: 'Every worker result maps to an actual diff, report, pull request, or evidence item and can be accepted or rejected independently.',
    repository: 'codex-control-panel',
    reviewCadenceDays: 30,
  },
  '/codex/council/protocols/transparent_reasoning.md': {
    outcome: 'Decisions expose evidence, assumptions, uncertainty, tradeoffs, and verification without publishing private chain-of-thought or overwhelming the user.',
    nextAction: 'Rewrite the active recommendation as a short decision record: evidence, inference, chosen action, consequence, and verification.',
    proof: 'A reviewer can challenge the decision from its stated evidence and assumptions without needing hidden internal reasoning.',
    repository: 'codex-control-panel',
  },
  '/codex/territory': {
    outcome: 'The operating layer maintains one current view of active work, boundaries, versions, updates, and evidence across the ecosystem.',
    nextAction: 'Reconcile the highest-impact status contradiction between a canonical document, repository, deployment, and live interface.',
    proof: 'The current-state record points to dated evidence and old state is explicitly superseded rather than silently coexisting.',
    repository: 'codex-control-panel',
    reviewCadenceDays: 14,
  },
  '/codex/territory/territory_ledger.md': {
    outcome: 'Active territories show owner, finish line, current state, blocker, next move, and evidence without becoming another disconnected backlog.',
    nextAction: 'Update the active territory with its single next move and remove or supersede any competing status record.',
    proof: 'A new session can resume the correct work from the ledger and independently verify why it is current.',
    repository: 'codex-control-panel',
    reviewCadenceDays: 14,
  },
  '/codex/territory/boot_sequence.md': {
    outcome: 'Every substantial session starts in the canonical repository with current instructions, clean scope boundaries, and an evidence-based understanding of state.',
    nextAction: 'Run the repository, branch, status, instruction, and live-state checks before making the next material change.',
    proof: 'The session records the canonical root, branch relation to origin, unrelated local changes, applicable rules, and the actual failure or goal.',
    repository: 'codex-control-panel',
    reviewCadenceDays: 30,
  },
  '/codex/territory/version_schema.md': {
    outcome: 'Versions distinguish doctrine, source, schema, deployment, and evidence changes so “latest” has a precise, reconstructable meaning.',
    nextAction: 'Identify which layer changed in the active release and record its version or immutable reference without bumping unrelated layers.',
    proof: 'A release can be traced to source commit, migration set, deployment, standards version, and verification evidence where applicable.',
    repository: 'codex-control-panel',
  },
  '/codex/territory/update_protocol.md': {
    outcome: 'New evidence updates canonical truth, dependent surfaces, and verification records without erasing provenance or leaving contradictory status behind.',
    nextAction: 'For the newest verified change, update the canonical source first, then enumerate and reconcile every dependent consumer.',
    proof: 'The source of truth, application surface, database or deployment state, and status record agree or show an explicit unresolved conflict.',
    repository: 'codex-control-panel',
    reviewCadenceDays: 14,
  },
  '/codex/artistic_systems': {
    outcome: 'Photography, teaching, and creative software reinforce one authored practice and produce publishable work, useful learning, or sustainable offers.',
    nextAction: 'Choose the active creative outcome—make, teach, publish, sell, or systematize—and open the corresponding operating document.',
    proof: 'The active creative effort ends in a real artifact, audience experience, validated workflow, or evidence-backed decision.',
    repository: 'Artful-Intelligence',
    reviewCadenceDays: 30,
  },
  '/codex/artistic_systems/photography_ops': {
    outcome: 'Field preparation, capture, post-production, teaching, and publishing workflows protect creative attention and reliably produce finished photographic work.',
    nextAction: 'Select the next shoot or body-of-work outcome and verify location, conditions, equipment, safety, capture plan, and delivery path.',
    proof: 'The workflow produces backed-up source files, a reviewed edit, accurate metadata, and the intended published, printed, or teaching artifact.',
    repository: null,
    reviewCadenceDays: 30,
  },
  '/codex/artistic_systems/photography_ops/astro_ops.md': {
    outcome: 'Astrophotography sessions convert narrow weather and celestial windows into technically sound, emotionally coherent finished images.',
    nextAction: 'For the next candidate session, verify target, moon, clouds, access, safety, composition, equipment, and backup plan before committing travel.',
    proof: 'A dated session plan leads to protected captures, redundant backups, a completed edit, and an honest record of what conditions produced it.',
    repository: null,
    reviewCadenceDays: 30,
  },
  '/codex/artistic_systems/photography_ops/timelapse_ops.md': {
    outcome: 'Timelapse work captures a planned transformation with sufficient interval, exposure, continuity, power, storage, and post-production discipline for a finished sequence.',
    nextAction: 'Calculate the next sequence from desired screen duration backward to interval, capture count, real duration, storage, power, and environmental risk.',
    proof: 'The shoot yields a stable, backed-up image sequence and a rendered deliverable at the intended resolution, cadence, and narrative duration.',
    repository: null,
  },
  '/codex/artistic_systems/photography_ops/landscapes.md': {
    outcome: 'Landscape work communicates scale, stillness, weather, and place through deliberate observation rather than checklist image collection.',
    nextAction: 'Define the emotional and spatial relationship the next landscape image should preserve, then plan conditions and composition around it.',
    proof: 'The final image or sequence carries the intended relationship to place and is selected, edited, titled, and prepared for its real presentation context.',
    repository: null,
  },
  '/codex/artistic_systems/photography_ops/gear_specs.md': {
    outcome: 'A verified equipment record supports field planning, compatibility, packing, and teaching without inventing ownership or substituting specifications for creative intent.',
    nextAction: 'Before the next equipment-dependent plan, verify the required body, lens, support, power, storage, firmware, and compatibility against the physical kit.',
    proof: 'The packing or teaching plan cites only confirmed equipment and exposes any rental, purchase, compatibility, or availability gap before the shoot.',
    repository: null,
    reviewCadenceDays: 90,
  },
  '/codex/artistic_systems/photography_ops/firefall_2026.md': {
    outcome: 'Any Firefall plan is treated as a conditions-dependent candidate until access, timing, permits, weather, composition, safety, and an actual commitment are verified.',
    nextAction: 'Replace the historical 2026 concept with a dated current decision: archive it, convert it to a future candidate, or attach confirmed logistics.',
    proof: 'The page clearly shows cancelled, archived, candidate, planned, or completed status with dated supporting evidence and no implied booking.',
    repository: null,
    reviewCadenceDays: 14,
  },
  '/codex/artistic_systems/photography_ops/namibia_2026.md': {
    outcome: 'Namibia workshop history and future possibilities are represented accurately without converting aspiration into bookings, participants, dates, pricing, or logistics.',
    nextAction: 'Record the current owner decision for a future Namibia workshop and list the minimum market, partner, schedule, safety, and delivery evidence needed to advance it.',
    proof: 'The page separates verified past experience from future candidate years and links any planned claim to dated operational evidence.',
    repository: null,
    reviewCadenceDays: 30,
  },
  '/codex/artistic_systems/artful_intelligence': {
    outcome: 'Artful Intelligence turns real photographic expertise into useful, secure, deployed creative tools without overclaiming product maturity or replacing authorship.',
    nextAction: 'Select the highest-value active product path and verify its canonical repository, live frontend, backend health, user workflow, and next release gate.',
    proof: 'The selected product has a working user-facing path, traceable source, explicit data boundaries, and outcome evidence beyond a green build.',
    repository: 'Artful-Intelligence',
    reviewCadenceDays: 14,
  },
  '/codex/artistic_systems/artful_intelligence/ai_overview.md': {
    outcome: 'The AI portfolio has a coherent boundary: assist analysis, teaching, discovery, and operations while preserving provenance, privacy, and photographic authorship.',
    nextAction: 'Reconcile the overview with current Artful Intelligence source and deployment evidence, removing any capability that is only a mock, plan, or retired path.',
    proof: 'Every listed capability links to current source and a tested surface or is visibly labeled concept, partial, blocked, or retired.',
    repository: 'Artful-Intelligence',
    reviewCadenceDays: 14,
  },
  '/codex/artistic_systems/artful_intelligence/photo_coach_mvp.md': {
    outcome: 'A photographer can submit an image or scenario and receive useful, bounded coaching grounded in photographic practice and honest about model limitations.',
    nextAction: 'Exercise the current production workflow with a representative image and record upload, analysis, response quality, latency, privacy, and failure behavior.',
    proof: 'The public workflow completes end to end and its feedback is specific, safe, reproducible enough to review, and clearly presented as assistance rather than authority.',
    repository: 'Artful-Intelligence',
    reviewCadenceDays: 14,
  },
  '/codex/artistic_systems/artful_intelligence/edition_manager.md': {
    outcome: 'Edition state, provenance, availability, and fulfillment events remain internally consistent and auditable across an artwork’s lifecycle.',
    nextAction: 'Run one representative edition through creation, reservation or sale, state transition, and audit history using non-production test data.',
    proof: 'The same edition cannot be oversold or silently rewritten, and each state change records its actor, time, source, and resulting availability.',
    repository: 'Artful-Intelligence',
    reviewCadenceDays: 14,
  },
  '/codex/artistic_systems/artful_intelligence/6_figure_print_engine.md': {
    outcome: 'Print strategy connects authored work, audience, edition logic, offer design, delivery capacity, and evidence of demand without publishing private finances or treating a target as revenue.',
    nextAction: 'Define one testable print offer with audience, work selection, edition rule, price rationale, delivery promise, capacity, and demand signal.',
    proof: 'A dated offer test produces real market evidence and records delivery cost, capacity, and customer response privately without fabricating scale.',
    repository: 'Artful-Intelligence',
    reviewCadenceDays: 30,
  },
  '/codex/artistic_systems/artful_intelligence/creative_automations.md': {
    outcome: 'Repeatable creative operations move assets and metadata safely while leaving curation, authorship, publication, and irreversible decisions under explicit human control.',
    nextAction: 'Choose one repetitive workflow and document its trigger, inputs, transformation, approval point, output, failure recovery, and evidence before automating it.',
    proof: 'The workflow completes repeatedly on representative data, fails visibly, preserves originals, and never publishes or destroys work without approval.',
    repository: 'Artful-Intelligence',
    reviewCadenceDays: 30,
  },
  '/codex/artistic_systems/artful_intelligence/pwa_iphone16.md': {
    outcome: 'The primary mobile creative workflow is genuinely usable on the target iPhone viewport, network conditions, authentication path, and install mode.',
    nextAction: 'Run the current highest-value workflow on a physical or accurately emulated iPhone viewport and capture every overflow, keyboard, safe-area, authentication, and recovery failure.',
    proof: 'The workflow completes without desktop-only assumptions and passes documented mobile interaction, performance, accessibility, and installation checks.',
    repository: 'Artful-Intelligence',
    reviewCadenceDays: 30,
  },
  '/codex/neuro': {
    outcome: 'Neurotechnology experiments remain reproducible, privacy-aware, and explicit about the boundary between captured signals, exploratory models, creative interfaces, and health claims.',
    nextAction: 'Select the most mature pipeline and update its status from source, data, runtime, and visualization evidence rather than roadmap language.',
    proof: 'A reviewer can identify the device, dataset, transport, transformation, output, owner, privacy boundary, and verification state for each active neuro capability.',
    repository: 'neurocreative-platform',
    reviewCadenceDays: 14,
  },
  '/codex/neuro/muse2_eeg_pipeline.md': {
    outcome: 'Muse 2 recordings move from device capture through labeled, time-aligned, quality-checked storage into reproducible analysis without implying clinical meaning.',
    nextAction: 'Run or inspect the latest recorded session and document device connection, channels, timestamps, packet loss, artifacts, storage format, and reproducible processing command.',
    proof: 'A second run can load the dated dataset, reproduce quality metrics and derived outputs, and distinguish raw, cleaned, and interpreted data.',
    repository: 'neurocreative-platform',
    reviewCadenceDays: 14,
  },
  '/codex/neuro/websocket_servers.md': {
    outcome: 'Real-time signal transport exposes connection, schema, latency, loss, reconnection, and ownership behavior instead of merely demonstrating that a socket can open.',
    nextAction: 'Exercise the active server with a representative stream and record handshake, message schema, throughput, disconnect, retry, and malformed-message behavior.',
    proof: 'The documented client and server reconnect predictably, validate messages, expose failures, and preserve enough timing information for downstream analysis.',
    repository: 'neurocreative-platform',
    reviewCadenceDays: 14,
  },
  '/codex/neuro/adaptive_ml_models.md': {
    outcome: 'Adaptive model ideas advance only when a dated dataset, target, baseline, evaluation protocol, leakage controls, and interpretable limits are explicit.',
    nextAction: 'Choose one candidate adaptation claim and write the smallest offline evaluation that could falsify it before building live personalization.',
    proof: 'A reproducible comparison beats a stated baseline on held-out data without leakage and reports uncertainty, failure cases, privacy, and non-clinical limits.',
    repository: 'neurocreative-platform',
    reviewCadenceDays: 30,
  },
  '/codex/neuro/whoop_integration.md': {
    outcome: 'Any WHOOP-derived feature uses authorized, dated, understood fields with explicit sync, privacy, and interpretation boundaries.',
    nextAction: 'Verify whether a current authenticated integration exists; if not, keep the page conceptual and define the minimum data and consent contract before implementation.',
    proof: 'The status names the verified authentication and data path or clearly states that no live integration is present; no recovery or health effect is inferred.',
    repository: 'neurocreative-platform',
    reviewCadenceDays: 14,
  },
  '/codex/neuro/bio_geometry_engine.md': {
    outcome: 'Biometric visualization translates real signal structure into an exploratory visual form without fabricating measurements, certainty, or therapeutic meaning.',
    nextAction: 'Bind one visual parameter to a documented field from a recorded dataset and label the transformation, scale, missing-data behavior, and artistic interpretation.',
    proof: 'The same input reproduces the same geometry, transformed fields are inspectable, and the interface clearly separates measurement from artistic encoding.',
    repository: 'neurocreative-platform',
    reviewCadenceDays: 30,
  },
  '/codex/automation': {
    outcome: 'Automation connects human intent to bounded, observable execution with ownership, approval, retry, evidence, and recovery designed into the path.',
    nextAction: 'Select the automation closest to real use and map its trigger, state machine, external effects, approval gates, and failure recovery against current implementation.',
    proof: 'A representative run produces the intended external result, records evidence, handles replay safely, and exposes rather than hides failure.',
    repository: 'codex-control-panel',
    reviewCadenceDays: 14,
  },
  '/codex/automation/multi_agent_orchestration.md': {
    outcome: 'Multiple agents increase throughput without losing ownership, duplicating work, conflicting on files, or claiming results that are not tied to real artifacts.',
    nextAction: 'Audit the active orchestration surface for worker identity, bounded task, branch or artifact ownership, status, evidence, and merge or acceptance path.',
    proof: 'Each worker has a traceable assignment and independently reviewable output, and coordination detects overlap or stale attribution before integration.',
    repository: 'codex-control-panel',
    reviewCadenceDays: 14,
  },
  '/codex/automation/reliability_playbook.md': {
    outcome: 'Repeated failures become automated checks, clear runbooks, and safer defaults so future sessions do not rediscover the same deployment or data incident.',
    nextAction: 'Take the most recent repeated failure and add the smallest check or runbook step that detects it before the user encounters it.',
    proof: 'The original failure is reproducible, the guard fails before the fix, passes after it, and names the owner and recovery path.',
    repository: 'codex-control-panel',
    reviewCadenceDays: 30,
  },
  '/codex/automation/rag_photography.md': {
    outcome: 'Photography retrieval returns source-grounded, relevant material with visible provenance and refuses to invent technique, equipment, history, or artistic claims.',
    nextAction: 'Assemble a small verified evaluation set of real photography questions, authoritative source passages, expected citations, and unacceptable hallucinations.',
    proof: 'Retrieval and answer evaluation report citation correctness, relevance, missing evidence, and failure cases on a versioned corpus.',
    repository: 'Artful-Intelligence',
    reviewCadenceDays: 30,
  },
  '/codex/automation/automation_pipelines.md': {
    outcome: 'Data and asset pipelines expose each transformation, preserve originals, support idempotent replay, and deliver traceable outputs to the intended system.',
    nextAction: 'Document and test one end-to-end pipeline with representative input, schema validation, transformation, approval, output, retry, and audit record.',
    proof: 'Replaying the same input does not duplicate or corrupt state, failure is recoverable, and the output links back to its source and pipeline version.',
    repository: 'codex-control-panel',
    reviewCadenceDays: 30,
  },
  '/codex/business': {
    outcome: 'Business systems turn authentic creative value into offers that respect capacity, privacy, customer trust, delivery reality, and evidence of demand.',
    nextAction: 'Choose one active offer and verify its audience, promise, capacity, delivery path, current status, and next demand-learning action.',
    proof: 'The offer has a real customer-facing or testable artifact and its status is supported by dated evidence rather than projections.',
    repository: null,
    reviewCadenceDays: 30,
  },
  '/codex/business/drop_model.md': {
    outcome: 'A limited release creates clear scarcity, provenance, timing, delivery, and collector trust without manufacturing urgency or overselling capacity.',
    nextAction: 'Design one bounded drop test with selected work, edition rule, audience, timeline, fulfillment capacity, terms, and success or stop criteria.',
    proof: 'The test records real interest or transactions, delivery performance, collector questions, and an evidence-based continue, revise, or stop decision.',
    repository: 'Artful-Intelligence',
    reviewCadenceDays: 30,
  },
  '/codex/business/workshop_engines.md': {
    outcome: 'A workshop transforms real expertise into a safe, teachable, logistically credible experience with a defined audience and honest delivery capacity.',
    nextAction: 'Specify one workshop’s participant outcome, prerequisites, curriculum arc, location or format, safety, capacity, delivery cost, and demand test.',
    proof: 'A dated pilot or market test validates the learning promise and operational constraints before dates, participants, or revenue are claimed.',
    repository: null,
    reviewCadenceDays: 30,
  },
  '/codex/business/money_os.md': {
    outcome: 'Private financial operations support clear decisions about sustainability, capacity, runway, and investment without exposing figures in the public knowledge graph.',
    nextAction: 'Inside an owner-private system, identify the single financial decision the active creative or software outcome requires and the minimum current data needed.',
    proof: 'The decision is based on dated private records, states uncertainty and constraints, and exports only a non-sensitive conclusion to the public corpus.',
    repository: null,
    reviewCadenceDays: 30,
  },
  '/codex/personal_os': {
    outcome: 'The Personal OS provides practical, privacy-respecting support for attention, energy, communication, and continuity without turning private experience into public diagnosis or metrics.',
    nextAction: 'Use the page matching the current friction, apply one reversible support, and preserve only the transferable lesson if it proves useful.',
    proof: 'The support reduces friction for a real task and any retained lesson is owner-approved, non-clinical, and specific enough to guide future behavior.',
    repository: 'legacy-codex',
    reviewCadenceDays: 60,
  },
  '/codex/personal_os/personality_manual.md': {
    outcome: 'Collaborators understand how to communicate, structure choices, preserve momentum, and respond to overload while leaving room for context and change.',
    nextAction: 'Review the manual against the current collaboration and update only a pattern that has been explicitly confirmed or repeatedly demonstrated.',
    proof: 'The manual improves a real interaction, avoids unsupported labels, and separates durable preferences from temporary state.',
    repository: 'legacy-codex',
    reviewCadenceDays: 90,
  },
  '/codex/personal_os/neurodivergent_os.md': {
    outcome: 'Work systems reduce unnecessary cognitive load through clear outcomes, visual structure, fewer routing demands, protected continuity, and accessible interaction.',
    nextAction: 'Identify the first avoidable cognitive transition in the active workflow and replace it with a direct link, sensible default, visible state, or automated handoff.',
    proof: 'The user completes the workflow with fewer context switches or clarifying steps and without losing control, evidence, or reversibility.',
    repository: 'legacy-codex',
    reviewCadenceDays: 60,
  },
  '/codex/personal_os/reflections_between_worlds.md': {
    outcome: 'Private reflection can yield durable creative or operating insight without requiring the system to publish, pathologize, or preserve every personal experience.',
    nextAction: 'When a reflection repeatedly changes decisions, extract the transferable lesson and ask whether it belongs in private memory, public doctrine, creative work, or nowhere.',
    proof: 'The resulting artifact preserves useful meaning and provenance while respecting privacy and avoiding unsupported universal conclusions.',
    repository: 'legacy-codex',
    reviewCadenceDays: 90,
  },
  '/codex/convergence': {
    outcome: 'The ecosystem’s repositories, interfaces, doctrine, data, and verification evidence converge on one reconstructable purpose without pretending every component is integrated.',
    nextAction: 'Run a contradiction audit across the most consequential connected systems and promote the highest-value correction into source, schema, test, or doctrine.',
    proof: 'The graph shows current relationships and freshness, while each integration claim names its actual implementation and verification state.',
    repository: 'codex-system-architecture',
    reviewCadenceDays: 7,
  },
  '/codex/convergence/convergence_log_v16.md': {
    outcome: 'The convergence log is a current evidence ledger, not a celebratory version narrative, and distinguishes merged, deployed, verified, integrated, and outcome-producing states.',
    nextAction: 'Replace the static snapshot with the current verified status of each named system and explicitly mark stale, conflicting, or unavailable evidence.',
    proof: 'Every status entry has a dated source and survives comparison with current repositories, deployments, database state, and user-facing behavior.',
    repository: 'codex-system-architecture',
    reviewCadenceDays: 7,
  },
  '/codex/convergence/system_reflexivity.md': {
    outcome: 'The system evaluates whether its architecture is producing clearer decisions and real outcomes, then changes its own doctrine, data, tests, and interfaces based on evidence.',
    nextAction: 'Choose one repeated mismatch between intended behavior and observed behavior, reconstruct the shared higher-order lesson, and encode the smallest durable correction.',
    proof: 'A future session behaves better because the correction exists in an executable or canonical structure, and the original evidence remains traceable.',
    repository: 'codex-system-architecture',
    reviewCadenceDays: 14,
  },
};

export const DOCUMENT_RELATIONSHIPS: DocumentRelationship[] = [
  { sourcePath: '/codex/root/identity.md', targetPath: '/codex/personal_os/personality_manual.md', kind: 'bridges', rationale: 'Confirmed identity informs collaboration, while the manual translates it into practical interaction.' },
  { sourcePath: '/codex/root/territory_mode.md', targetPath: '/codex/territory/territory_ledger.md', kind: 'bridges', rationale: 'The attention model becomes operational only when an active outcome is recorded and resumable.' },
  { sourcePath: '/codex/root/reality_filter.md', targetPath: '/codex/convergence/convergence_log_v16.md', kind: 'bridges', rationale: 'Current integration claims must be classified by evidence and freshness.' },
  { sourcePath: '/codex/root/reality_filter.md', targetPath: '/codex/council/roles/cdaao.md', kind: 'bridges', rationale: 'Truth classification becomes the integrity lens used for AI, data, and status outputs.' },
  { sourcePath: '/codex/council/roles/architect.md', targetPath: '/codex/automation/multi_agent_orchestration.md', kind: 'bridges', rationale: 'Product ownership must constrain where orchestrated work is routed.' },
  { sourcePath: '/codex/council/roles/systems_architect.md', targetPath: '/codex/territory/version_schema.md', kind: 'bridges', rationale: 'System boundaries become reconstructable through explicit version and ownership references.' },
  { sourcePath: '/codex/council/roles/ux_specialist.md', targetPath: '/codex/personal_os/neurodivergent_os.md', kind: 'bridges', rationale: 'Access needs translate into concrete interaction and workflow requirements.' },
  { sourcePath: '/codex/council/roles/creative_agent.md', targetPath: '/codex/artistic_systems/artful_intelligence/ai_overview.md', kind: 'bridges', rationale: 'Creative authorship constrains what AI products should generate or claim.' },
  { sourcePath: '/codex/council/roles/cdaao.md', targetPath: '/codex/neuro/adaptive_ml_models.md', kind: 'bridges', rationale: 'Adaptive models require the strongest provenance, privacy, and evaluation boundaries.' },
  { sourcePath: '/codex/council/protocols/swarm_layer.md', targetPath: '/codex/automation/multi_agent_orchestration.md', kind: 'bridges', rationale: 'The coordination doctrine defines ownership and evidence for multi-agent execution.' },
  { sourcePath: '/codex/council/protocols/7_phase_protocol.md', targetPath: '/codex/territory/boot_sequence.md', kind: 'bridges', rationale: 'The first protocol phase is implemented by the repository and evidence boot sequence.' },
  { sourcePath: '/codex/council/protocols/transparent_reasoning.md', targetPath: '/codex/convergence/system_reflexivity.md', kind: 'bridges', rationale: 'Challengeable decision records make system self-correction possible.' },
  { sourcePath: '/codex/territory/update_protocol.md', targetPath: '/codex/automation/reliability_playbook.md', kind: 'bridges', rationale: 'Repeated updates and failures should become durable automated safeguards.' },
  { sourcePath: '/codex/artistic_systems/photography_ops/astro_ops.md', targetPath: '/codex/neuro/muse2_eeg_pipeline.md', kind: 'related', rationale: 'Field capture and biosignal capture share timing, artifact, environment, and reproducibility constraints.' },
  { sourcePath: '/codex/artistic_systems/photography_ops/timelapse_ops.md', targetPath: '/codex/automation/automation_pipelines.md', kind: 'related', rationale: 'Both require ordered source preservation, deterministic processing, and recoverable long-running execution.' },
  { sourcePath: '/codex/artistic_systems/artful_intelligence/photo_coach_mvp.md', targetPath: '/codex/automation/rag_photography.md', kind: 'bridges', rationale: 'Grounded retrieval can make coaching specific while exposing its photographic sources.' },
  { sourcePath: '/codex/artistic_systems/artful_intelligence/edition_manager.md', targetPath: '/codex/business/drop_model.md', kind: 'bridges', rationale: 'Edition integrity is the operational foundation for a trustworthy limited release.' },
  { sourcePath: '/codex/artistic_systems/artful_intelligence/6_figure_print_engine.md', targetPath: '/codex/business/money_os.md', kind: 'bridges', rationale: 'Offer strategy needs private financial constraints without publishing private figures.' },
  { sourcePath: '/codex/artistic_systems/artful_intelligence/creative_automations.md', targetPath: '/codex/automation/automation_pipelines.md', kind: 'bridges', rationale: 'Creative automation relies on safe, observable, replayable asset pipelines.' },
  { sourcePath: '/codex/artistic_systems/artful_intelligence/pwa_iphone16.md', targetPath: '/codex/personal_os/neurodivergent_os.md', kind: 'related', rationale: 'Mobile-first design and accessible work design both reduce avoidable cognitive transitions.' },
  { sourcePath: '/codex/neuro/whoop_integration.md', targetPath: '/codex/personal_os/neurodivergent_os.md', kind: 'bridges', rationale: 'Biometric context may inform support only when consent, interpretation, and non-clinical limits are explicit.' },
  { sourcePath: '/codex/neuro/websocket_servers.md', targetPath: '/codex/automation/automation_pipelines.md', kind: 'related', rationale: 'Real-time transport is an input layer whose retry and schema behavior shapes downstream reliability.' },
  { sourcePath: '/codex/neuro/bio_geometry_engine.md', targetPath: '/codex/artistic_systems/photography_ops/landscapes.md', kind: 'related', rationale: 'Both explore how measured or observed structure can become a visual experience without losing meaning.' },
  { sourcePath: '/codex/business/workshop_engines.md', targetPath: '/codex/artistic_systems/photography_ops', kind: 'bridges', rationale: 'A credible workshop is grounded in real field practice and a teachable capture-to-finish workflow.' },
  { sourcePath: '/codex/personal_os/reflections_between_worlds.md', targetPath: '/codex/convergence/system_reflexivity.md', kind: 'bridges', rationale: 'A repeated personal insight becomes system learning only after it is translated into a durable, challengeable rule.' },
  { sourcePath: '/codex/convergence/convergence_log_v16.md', targetPath: '/codex/territory/update_protocol.md', kind: 'related', rationale: 'The convergence ledger is only current when update and supersession rules are consistently applied.' },
];

function categoryFor(path: string): string {
  return path.split('/').filter(Boolean)[1] ?? 'root';
}

function titleFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  const segment = segments[segments.length - 1] ?? 'Codex';
  return segment
    .replace(/\.md$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getDocumentIntelligence(path: string): DocumentIntelligence | null {
  return DOCUMENT_INTELLIGENCE[path] ?? null;
}

export function getReviewCadenceDays(path: string): number {
  const intelligence = DOCUMENT_INTELLIGENCE[path];
  const category = categoryFor(path);
  const playbook = CATEGORY_PLAYBOOKS[category] ?? CATEGORY_PLAYBOOKS.root;
  return intelligence?.reviewCadenceDays ?? playbook.cadenceDays;
}

export function createOutcomeDraft(path: string): OutcomeDraft | null {
  const intelligence = getDocumentIntelligence(path);
  if (!intelligence) return null;
  const category = categoryFor(path);
  const chipId: OutcomeDraft['chipId'] =
    category === 'neuro'
      ? 'research'
      : category === 'root' || category === 'council'
        ? 'architect'
        : category === 'territory' || category === 'convergence'
          ? 'status'
          : 'execute';

  return {
    sourcePath: path,
    task: intelligence.nextAction,
    repository: intelligence.repository ?? '',
    requiredEvidence: intelligence.proof,
    chipId,
  };
}

export function getDocumentRelationships(path: string): DocumentRelationship[] {
  return DOCUMENT_RELATIONSHIPS.filter(
    (relationship) => relationship.sourcePath === path || relationship.targetPath === path,
  );
}

export function getReviewState(
  lastReviewed: string | null,
  cadenceDays: number,
  now = new Date(),
): ReviewState {
  if (!lastReviewed) return 'unknown';
  const reviewed = new Date(`${lastReviewed}T00:00:00.000Z`);
  if (Number.isNaN(reviewed.getTime())) return 'unknown';
  const ageDays = Math.max(0, (now.getTime() - reviewed.getTime()) / 86_400_000);
  if (ageDays <= cadenceDays) return 'current';
  if (ageDays <= cadenceDays * 2) return 'due';
  return 'stale';
}

export function operationalizeDocument(path: string, canonicalBody: string): string {
  const intelligence = DOCUMENT_INTELLIGENCE[path];
  if (!intelligence) return canonicalBody;
  const category = categoryFor(path);
  const playbook = CATEGORY_PLAYBOOKS[category] ?? CATEGORY_PLAYBOOKS.root;
  const cadence = getReviewCadenceDays(path);
  const relationships = getDocumentRelationships(path);
  const relatedLines = relationships.length > 0
    ? relationships.map((relationship) => {
        const otherPath = relationship.sourcePath === path
          ? relationship.targetPath
          : relationship.sourcePath;
        return `- **${titleFromPath(otherPath)}** \`${otherPath}\` — ${relationship.rationale}`;
      })
    : ['- This document currently relies on its hierarchy links. Add a cross-domain relationship only when the connection changes a decision or workflow.'];
  const repositoryLine = intelligence.repository
    ? `- **Primary implementation evidence:** \`${intelligence.repository}\``
    : '- **Primary implementation evidence:** owner-confirmed practice or a dated external artifact; no single repository is authoritative.';

  const reviewHeader = `**Last reviewed:** ${CANONICAL_REVIEW_DATE}`;
  const normalized = canonicalBody.replace(/^\*\*Last reviewed:\*\* \d{4}-\d{2}-\d{2}$/m, reviewHeader);
  const marker = `${reviewHeader}\n\n`;
  const [header, currentBody = ''] = normalized.includes(marker)
    ? normalized.split(marker, 2)
    : ['', normalized];

  return `${header ? `${header}\n${marker}` : ''}## Outcome contract

${intelligence.outcome}

**Next move:** ${intelligence.nextAction}

**Done when:** ${intelligence.proof}

## Current model and boundaries

${currentBody.trim()}

## Operating decisions

${playbook.decisionRules.map((rule) => `- ${rule}`).join('\n')}

## Evidence and refresh protocol

${repositoryLine}
- **Review cadence:** every ${cadence} days, or immediately when a named repository, deployment, database, owner decision, or real-world status materially changes.
${playbook.evidenceSources.map((source) => `- ${source}`).join('\n')}
- A review date means the claim set was checked; it does not convert concepts, unknowns, or private information into verified facts.

## Connected systems

${relatedLines.join('\n')}
`;
}
