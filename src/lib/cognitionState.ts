import type { CognitiveVisualState, CognitionSlide } from '../types/cognition';

export function getVisualStateForSlide(
  slide: CognitionSlide,
): CognitiveVisualState {
  return slide.visualState;
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
