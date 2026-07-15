import type { CodexDocument } from '../types';
import { getCodexDocumentBody, getCodexDocumentProvenance } from './codexDocumentBodies';

/** Seeded Codex corpus used when the live DB is lean/incomplete. */
export interface CorpusDocument {
  title: string;
  path: string;
  content: string;
  category: string;
  parentPath: string | null;
  order: number;
}

export interface CorpusLink {
  sourcePath: string;
  targetPath: string;
  linkType: 'hierarchy' | 'related' | 'bridges';
}

export const CORPUS_DOCUMENTS: CorpusDocument[] = [
  { title: 'Codex', path: '/codex', content: 'Knowledge and operational systems', category: 'root', parentPath: null, order: 0 },
  { title: 'Root', path: '/codex/root', content: 'Core identity and territorial concepts', category: 'root', parentPath: '/codex', order: 0 },
  { title: 'Identity', path: '/codex/root/identity.md', content: 'Personal identity framework and definition', category: 'root', parentPath: '/codex/root', order: 0 },
  { title: 'Territory Mode', path: '/codex/root/territory_mode.md', content: 'Operating model and territorial principles', category: 'root', parentPath: '/codex/root', order: 1 },
  { title: 'Reality Filter', path: '/codex/root/reality_filter.md', content: 'Perception and reality filtering system', category: 'root', parentPath: '/codex/root', order: 2 },

  { title: 'Council', path: '/codex/council', content: 'Organizational structure and protocols', category: 'council', parentPath: '/codex', order: 1 },
  { title: 'Roles', path: '/codex/council/roles', content: 'Council member roles and responsibilities', category: 'council', parentPath: '/codex/council', order: 0 },
  { title: 'Architect', path: '/codex/council/roles/architect.md', content: 'Architecture role definition', category: 'council', parentPath: '/codex/council/roles', order: 0 },
  { title: 'Systems Architect', path: '/codex/council/roles/systems_architect.md', content: 'Systems architecture role', category: 'council', parentPath: '/codex/council/roles', order: 1 },
  { title: 'UX Specialist', path: '/codex/council/roles/ux_specialist.md', content: 'UX and user experience role', category: 'council', parentPath: '/codex/council/roles', order: 2 },
  { title: 'Data & AI Integrity', path: '/codex/council/roles/cdaao.md', content: 'Data provenance and AI integrity review lens', category: 'council', parentPath: '/codex/council/roles', order: 3 },
  { title: 'Creative Direction', path: '/codex/council/roles/creative_agent.md', content: 'Creative direction review lens', category: 'council', parentPath: '/codex/council/roles', order: 4 },
  { title: 'Owner', path: '/codex/council/roles/chairman.md', content: 'Owner and final decision-maker', category: 'council', parentPath: '/codex/council/roles', order: 5 },
  { title: 'Protocols', path: '/codex/council/protocols', content: 'Operational protocols and procedures', category: 'council', parentPath: '/codex/council', order: 1 },
  { title: '7 Phase Protocol', path: '/codex/council/protocols/7_phase_protocol.md', content: 'Seven phase operational protocol', category: 'council', parentPath: '/codex/council/protocols', order: 0 },
  { title: 'Swarm Layer', path: '/codex/council/protocols/swarm_layer.md', content: 'Swarm coordination and communication', category: 'council', parentPath: '/codex/council/protocols', order: 1 },
  { title: 'Transparent Reasoning', path: '/codex/council/protocols/transparent_reasoning.md', content: 'Transparent decision making framework', category: 'council', parentPath: '/codex/council/protocols', order: 2 },

  { title: 'Territory', path: '/codex/territory', content: 'Territory management and governance', category: 'territory', parentPath: '/codex', order: 2 },
  { title: 'Territory Ledger', path: '/codex/territory/territory_ledger.md', content: 'Record of territorial governance', category: 'territory', parentPath: '/codex/territory', order: 0 },
  { title: 'Boot Sequence', path: '/codex/territory/boot_sequence.md', content: 'System initialization sequence', category: 'territory', parentPath: '/codex/territory', order: 1 },
  { title: 'Version Schema', path: '/codex/territory/version_schema.md', content: 'Version control and schema management', category: 'territory', parentPath: '/codex/territory', order: 2 },
  { title: 'Update Protocol', path: '/codex/territory/update_protocol.md', content: 'Update and upgrade procedures', category: 'territory', parentPath: '/codex/territory', order: 3 },

  { title: 'Artistic Systems', path: '/codex/artistic_systems', content: 'Creative and artistic operations', category: 'artistic_systems', parentPath: '/codex', order: 3 },
  { title: 'Photography Ops', path: '/codex/artistic_systems/photography_ops', content: 'Photography operations and projects', category: 'artistic_systems', parentPath: '/codex/artistic_systems', order: 0 },
  { title: 'Astro Ops', path: '/codex/artistic_systems/photography_ops/astro_ops.md', content: 'Astrophotography operations', category: 'artistic_systems', parentPath: '/codex/artistic_systems/photography_ops', order: 0 },
  { title: 'Timelapse Ops', path: '/codex/artistic_systems/photography_ops/timelapse_ops.md', content: 'Timelapse photography operations', category: 'artistic_systems', parentPath: '/codex/artistic_systems/photography_ops', order: 1 },
  { title: 'Landscapes', path: '/codex/artistic_systems/photography_ops/landscapes.md', content: 'Landscape photography', category: 'artistic_systems', parentPath: '/codex/artistic_systems/photography_ops', order: 2 },
  { title: 'Gear Specs', path: '/codex/artistic_systems/photography_ops/gear_specs.md', content: 'Photography equipment specifications', category: 'artistic_systems', parentPath: '/codex/artistic_systems/photography_ops', order: 3 },
  { title: 'Firefall Status', path: '/codex/artistic_systems/photography_ops/firefall_2026.md', content: 'Unverified Firefall concept status', category: 'artistic_systems', parentPath: '/codex/artistic_systems/photography_ops', order: 4 },
  { title: 'Namibia Workshop Status', path: '/codex/artistic_systems/photography_ops/namibia_2026.md', content: 'Current Namibia workshop history and status', category: 'artistic_systems', parentPath: '/codex/artistic_systems/photography_ops', order: 5 },
  { title: 'Artful Intelligence', path: '/codex/artistic_systems/artful_intelligence', content: 'AI-powered creative systems', category: 'artistic_systems', parentPath: '/codex/artistic_systems', order: 1 },
  { title: 'AI Overview', path: '/codex/artistic_systems/artful_intelligence/ai_overview.md', content: 'Overview of AI creative systems', category: 'artistic_systems', parentPath: '/codex/artistic_systems/artful_intelligence', order: 0 },
  { title: 'Photo Coach MVP', path: '/codex/artistic_systems/artful_intelligence/photo_coach_mvp.md', content: 'AI photo coaching MVP', category: 'artistic_systems', parentPath: '/codex/artistic_systems/artful_intelligence', order: 1 },
  { title: 'Edition Manager', path: '/codex/artistic_systems/artful_intelligence/edition_manager.md', content: 'Edition management system', category: 'artistic_systems', parentPath: '/codex/artistic_systems/artful_intelligence', order: 2 },
  { title: 'Print Revenue Engine', path: '/codex/artistic_systems/artful_intelligence/6_figure_print_engine.md', content: 'Verified print model and unverified revenue goals', category: 'artistic_systems', parentPath: '/codex/artistic_systems/artful_intelligence', order: 3 },
  { title: 'Creative Automations', path: '/codex/artistic_systems/artful_intelligence/creative_automations.md', content: 'Creative automation workflows', category: 'artistic_systems', parentPath: '/codex/artistic_systems/artful_intelligence', order: 4 },
  { title: 'iPhone-First PWA Work', path: '/codex/artistic_systems/artful_intelligence/pwa_iphone16.md', content: 'Status of iPhone-first prototypes', category: 'artistic_systems', parentPath: '/codex/artistic_systems/artful_intelligence', order: 5 },

  { title: 'Neuro', path: '/codex/neuro', content: 'Neurotechnology and biometric systems', category: 'neuro', parentPath: '/codex', order: 4 },
  { title: 'Muse2 EEG Pipeline', path: '/codex/neuro/muse2_eeg_pipeline.md', content: 'Muse 2 EEG data pipeline', category: 'neuro', parentPath: '/codex/neuro', order: 0 },
  { title: 'WebSocket Servers', path: '/codex/neuro/websocket_servers.md', content: 'Real-time WebSocket communication', category: 'neuro', parentPath: '/codex/neuro', order: 1 },
  { title: 'Adaptive Model Status', path: '/codex/neuro/adaptive_ml_models.md', content: 'Current status of adaptive model ideas', category: 'neuro', parentPath: '/codex/neuro', order: 2 },
  { title: 'WHOOP Status', path: '/codex/neuro/whoop_integration.md', content: 'Current WHOOP integration status', category: 'neuro', parentPath: '/codex/neuro', order: 3 },
  { title: 'Biometric Visualization', path: '/codex/neuro/bio_geometry_engine.md', content: 'Exploratory biometric visualization concept', category: 'neuro', parentPath: '/codex/neuro', order: 4 },

  { title: 'Automation', path: '/codex/automation', content: 'Automation and orchestration systems', category: 'automation', parentPath: '/codex', order: 5 },
  { title: 'Multi-Agent Orchestration', path: '/codex/automation/multi_agent_orchestration.md', content: 'Multi-agent system coordination', category: 'automation', parentPath: '/codex/automation', order: 0 },
  { title: 'Reliability Playbook', path: '/codex/automation/reliability_playbook.md', content: 'System reliability and resilience', category: 'automation', parentPath: '/codex/automation', order: 1 },
  { title: 'RAG Photography', path: '/codex/automation/rag_photography.md', content: 'Retrieval-augmented generation for photography', category: 'automation', parentPath: '/codex/automation', order: 2 },
  { title: 'Automation Pipelines', path: '/codex/automation/automation_pipelines.md', content: 'Data and workflow pipelines', category: 'automation', parentPath: '/codex/automation', order: 3 },

  { title: 'Business', path: '/codex/business', content: 'Business models and operations', category: 'business', parentPath: '/codex', order: 6 },
  { title: 'Drop Model', path: '/codex/business/drop_model.md', content: 'Limited edition drop business model', category: 'business', parentPath: '/codex/business', order: 0 },
  { title: 'Workshop Engines', path: '/codex/business/workshop_engines.md', content: 'Workshop and training operations', category: 'business', parentPath: '/codex/business', order: 1 },
  { title: 'Money OS', path: '/codex/business/money_os.md', content: 'Financial operations system', category: 'business', parentPath: '/codex/business', order: 2 },

  { title: 'Personal OS', path: '/codex/personal_os', content: 'Personal operating system and mindset', category: 'personal_os', parentPath: '/codex', order: 7 },
  { title: 'Personality Manual', path: '/codex/personal_os/personality_manual.md', content: 'Personal operating manual', category: 'personal_os', parentPath: '/codex/personal_os', order: 0 },
  { title: 'Accessible Work System', path: '/codex/personal_os/neurodivergent_os.md', content: 'Accessibility and workflow framework', category: 'personal_os', parentPath: '/codex/personal_os', order: 1 },
  { title: 'Reflections Between Worlds', path: '/codex/personal_os/reflections_between_worlds.md', content: 'Reflections and transitions', category: 'personal_os', parentPath: '/codex/personal_os', order: 2 },

  { title: 'Convergence', path: '/codex/convergence', content: 'System integration and reflexivity', category: 'convergence', parentPath: '/codex', order: 8 },
  { title: 'Current Integration Status', path: '/codex/convergence/convergence_log_v16.md', content: 'Verified current integration status', category: 'convergence', parentPath: '/codex/convergence', order: 0 },
  { title: 'System Reflexivity', path: '/codex/convergence/system_reflexivity.md', content: 'Self-aware system design', category: 'convergence', parentPath: '/codex/convergence', order: 1 },
];

/** Explicit cross-domain bridges that make the graph feel like a real knowledge map. */
export const CORPUS_BRIDGES: CorpusLink[] = [
  { sourcePath: '/codex/root/identity.md', targetPath: '/codex/personal_os/personality_manual.md', linkType: 'bridges' },
  { sourcePath: '/codex/root/territory_mode.md', targetPath: '/codex/territory/territory_ledger.md', linkType: 'bridges' },
  { sourcePath: '/codex/root/reality_filter.md', targetPath: '/codex/personal_os/neurodivergent_os.md', linkType: 'bridges' },
  { sourcePath: '/codex/council/roles/architect.md', targetPath: '/codex/automation/multi_agent_orchestration.md', linkType: 'bridges' },
  { sourcePath: '/codex/council/roles/systems_architect.md', targetPath: '/codex/territory/version_schema.md', linkType: 'bridges' },
  { sourcePath: '/codex/council/roles/creative_agent.md', targetPath: '/codex/artistic_systems/artful_intelligence/ai_overview.md', linkType: 'bridges' },
  { sourcePath: '/codex/council/roles/cdaao.md', targetPath: '/codex/neuro/adaptive_ml_models.md', linkType: 'bridges' },
  { sourcePath: '/codex/council/protocols/swarm_layer.md', targetPath: '/codex/automation/multi_agent_orchestration.md', linkType: 'bridges' },
  { sourcePath: '/codex/council/protocols/7_phase_protocol.md', targetPath: '/codex/territory/boot_sequence.md', linkType: 'bridges' },
  { sourcePath: '/codex/artistic_systems/photography_ops/astro_ops.md', targetPath: '/codex/neuro/muse2_eeg_pipeline.md', linkType: 'related' },
  { sourcePath: '/codex/artistic_systems/artful_intelligence/photo_coach_mvp.md', targetPath: '/codex/automation/rag_photography.md', linkType: 'bridges' },
  { sourcePath: '/codex/artistic_systems/artful_intelligence/edition_manager.md', targetPath: '/codex/business/drop_model.md', linkType: 'bridges' },
  { sourcePath: '/codex/artistic_systems/artful_intelligence/6_figure_print_engine.md', targetPath: '/codex/business/money_os.md', linkType: 'bridges' },
  { sourcePath: '/codex/artistic_systems/artful_intelligence/creative_automations.md', targetPath: '/codex/automation/automation_pipelines.md', linkType: 'bridges' },
  { sourcePath: '/codex/artistic_systems/artful_intelligence/pwa_iphone16.md', targetPath: '/codex/personal_os/neurodivergent_os.md', linkType: 'related' },
  { sourcePath: '/codex/neuro/whoop_integration.md', targetPath: '/codex/personal_os/neurodivergent_os.md', linkType: 'bridges' },
  { sourcePath: '/codex/neuro/websocket_servers.md', targetPath: '/codex/automation/automation_pipelines.md', linkType: 'related' },
  { sourcePath: '/codex/neuro/bio_geometry_engine.md', targetPath: '/codex/artistic_systems/photography_ops/landscapes.md', linkType: 'related' },
  { sourcePath: '/codex/business/workshop_engines.md', targetPath: '/codex/artistic_systems/photography_ops', linkType: 'bridges' },
  { sourcePath: '/codex/convergence/system_reflexivity.md', targetPath: '/codex/council/protocols/transparent_reasoning.md', linkType: 'bridges' },
  { sourcePath: '/codex/convergence/convergence_log_v16.md', targetPath: '/codex/territory/update_protocol.md', linkType: 'related' },
  { sourcePath: '/codex/personal_os/reflections_between_worlds.md', targetPath: '/codex/convergence/system_reflexivity.md', linkType: 'bridges' },
];

export function corpusToDocuments(): CodexDocument[] {
  const byPath = new Map<string, string>();

  return CORPUS_DOCUMENTS.map((doc, index) => {
    const id = `corpus-${index}-${doc.path}`;
    const provenance = getCodexDocumentProvenance(doc.path);
    byPath.set(doc.path, id);
    return {
      id,
      title: doc.title,
      path: doc.path,
      content: getCodexDocumentBody(doc.path, doc.content),
      category: doc.category,
      parent_id: null,
      order: doc.order,
      created_at: '2025-12-04T00:00:00.000Z',
      updated_at: '2025-12-04T00:00:00.000Z',
      ...provenance,
      is_read_only: true,
    };
  }).map((doc) => {
    const parentPath = CORPUS_DOCUMENTS.find((item) => item.path === doc.path)?.parentPath ?? null;
    return {
      ...doc,
      parent_id: parentPath ? byPath.get(parentPath) ?? null : null,
    };
  });
}

export function isLeanDocumentSet(docs: CodexDocument[]): boolean {
  if (docs.length === 0) return true;
  if (docs.length < 20) return true;

  const categories = new Set(docs.map((doc) => doc.category));
  const hasHierarchy = docs.some((doc) => doc.parent_id);
  const hasCodexPaths = docs.some((doc) => doc.path.startsWith('/codex'));

  return !hasCodexPaths || (!hasHierarchy && categories.size <= 2);
}
