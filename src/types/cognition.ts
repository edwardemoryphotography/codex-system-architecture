export type DeckSection =
  | 'recognition'
  | 'mismatch'
  | 'translation'
  | 'invitation';

export type CognitiveVisualState =
  | 'coherence'
  | 'overload'
  | 'recursion'
  | 'codex'
  | 'reduction';

export type StarMode = CognitiveVisualState;

export type ProofStatus = 'verified' | 'live' | 'local';

export interface ProofCardData {
  id: string;
  label: string;
  value: string;
  detail: string;
  status: ProofStatus;
}

export interface CodexGraphNode {
  id: string;
  label: string;
  summary: string;
  x: number;
  y: number;
  connections: string[];
}

export type EnergyMode = 'hyperfocus' | 'maintenance' | 'recovery';

export interface EnergyRoute {
  mode: EnergyMode;
  sessionCapMin: number;
  breakFrequencyMin: number;
  guidance: string;
}

export interface CognitionSessionState {
  version: 1;
  currentIndex: number;
  selectedNodeId: string | null;
  recoveryScore: number;
}

export type CognitionSlidePayload =
  | { kind: 'proof'; cards: ProofCardData[] }
  | { kind: 'graph'; nodes: CodexGraphNode[] }
  | { kind: 'memory'; echoes: string[] }
  | { kind: 'reality' }
  | { kind: 'collapse' };

export interface CognitionSlide {
  id: string;
  section: DeckSection;
  visualState: CognitiveVisualState;
  eyebrow: string;
  title: string;
  body: string;
  kicker?: string;
  payload?: CognitionSlidePayload;
}
