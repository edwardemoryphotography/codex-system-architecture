import type { CodexGraphNode, ProofCardData } from '../types/cognition';

export const cognitionProofCards: ProofCardData[] = [
  {
    id: 'state',
    label: 'State continuity',
    value: 'Versioned local resume',
    detail: 'Slide, graph focus, and recovery input survive a return without pretending a cloud memory service is connected.',
    status: 'local',
  },
  {
    id: 'energy',
    label: 'Energy routing',
    value: '3 deterministic modes',
    detail: 'Recovery 0–33, maintenance 34–66, and hyperfocus 67–100 mirror the supplied Python source.',
    status: 'verified',
  },
  {
    id: 'reality',
    label: 'Reality contact',
    value: 'Lived constraints',
    detail: 'Trader Joe’s shifts, astrophotography nights, recovery, and build sessions remain visible inputs to the system.',
    status: 'live',
  },
];

export const codexGraphNodes: CodexGraphNode[] = [
  { id: 'memory', label: 'Memory', summary: 'Preserves orientation across interrupted sessions.', x: 16, y: 20, connections: ['routing', 'proof-loop', 'legacy-codex'] },
  { id: 'routing', label: 'Routing', summary: 'Matches the next action to energy and context.', x: 42, y: 14, connections: ['inhibition', 'execution-bottleneck'] },
  { id: 'inhibition', label: 'Inhibition', summary: 'Protects attention by naming what not to start.', x: 72, y: 22, connections: ['proof-loop', 'muse-whoop'] },
  { id: 'proof-loop', label: 'Proof Loop', summary: 'Turns claims into visible, testable evidence.', x: 52, y: 42, connections: ['artful-intelligence', 'photography-business'] },
  { id: 'execution-bottleneck', label: 'Execution Bottleneck', summary: 'Locates the constraint between knowing and shipping.', x: 20, y: 50, connections: ['legacy-codex', 'artful-intelligence'] },
  { id: 'artful-intelligence', label: 'Artful Intelligence', summary: 'Connects machine capability to human meaning and craft.', x: 78, y: 54, connections: ['photography-business'] },
  { id: 'photography-business', label: 'Photography Business', summary: 'Provides a real market where the system must earn its keep.', x: 62, y: 76, connections: ['muse-whoop', 'legacy-codex'] },
  { id: 'muse-whoop', label: 'Muse/WHOOP', summary: 'Represents embodied signal without claiming a live token.', x: 88, y: 80, connections: ['routing'] },
  { id: 'legacy-codex', label: 'Legacy Codex', summary: 'The execution framework that receives distilled state.', x: 28, y: 80, connections: ['memory'] },
];

export const memoryEchoes = [
  'Return to the proof loop before opening another branch.',
  'A 2–10 PM shift changes what a viable build session looks like.',
  'Astrophotography rewards long exposure; cognition also needs continuity across darkness.',
  'Recovery is an operating input, not a character judgment.',
];
