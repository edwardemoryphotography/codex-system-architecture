import type { CognitiveVisualState, DeckSection } from '../types/cognition';

const SECTION_STATE_MAP: Record<DeckSection, CognitiveVisualState> = {
  recognition: 'signal',
  mismatch: 'fragmentation',
  translation: 'stabilization',
  invitation: 'proof',
};

export function getStateForSection(
  section: DeckSection,
): CognitiveVisualState {
  return SECTION_STATE_MAP[section];
}

export function clampSlideIndex(index: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), total - 1);
}

export function getProgressPercent(index: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return Number((((index + 1) / total) * 100).toFixed(2));
}
