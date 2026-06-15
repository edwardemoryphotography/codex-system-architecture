export type DeckSection =
  | 'recognition'
  | 'mismatch'
  | 'translation'
  | 'invitation';

export type CognitiveVisualState =
  | 'signal'
  | 'throughput'
  | 'fragmentation'
  | 'stabilization'
  | 'recursion'
  | 'proof';

export interface CognitionSlide {
  id: string;
  section: DeckSection;
  visualState: CognitiveVisualState;
  eyebrow: string;
  title: string;
  body: string;
  kicker?: string;
}
