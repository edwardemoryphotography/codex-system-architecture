import type { CognitiveVisualState } from '../../types/cognition';

interface CognitionBackgroundProps {
  state: CognitiveVisualState;
}

// Temporary compile-through placeholder for Task 3 visuals.
export function CognitionBackground({ state }: CognitionBackgroundProps) {
  return <div aria-hidden="true" data-state={state} className="cognition-background" />;
}
