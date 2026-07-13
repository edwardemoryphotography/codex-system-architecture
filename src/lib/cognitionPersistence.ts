import type { CognitionSessionState, EnergyRoute } from '../types/cognition';

export const COGNITION_SESSION_KEY = 'codex:cognition:v2.1';

export const defaultCognitionSession: CognitionSessionState = {
  version: 1,
  currentIndex: 0,
  selectedNodeId: null,
  recoveryScore: 67,
};

export function routeEnergy(score: number): EnergyRoute {
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw new RangeError('Recovery score must be between 0 and 100.');
  }

  if (score >= 67) {
    return {
      mode: 'hyperfocus',
      sessionCapMin: 90,
      breakFrequencyMin: 25,
      guidance: 'Protect one deep build session and defer new branches.',
    };
  }

  if (score >= 34) {
    return {
      mode: 'maintenance',
      sessionCapMin: 45,
      breakFrequencyMin: 20,
      guidance: 'Choose bounded maintenance work with a visible stopping point.',
    };
  }

  return {
    mode: 'recovery',
    sessionCapMin: 20,
    breakFrequencyMin: 10,
    guidance: 'Preserve continuity with one small action, then recover.',
  };
}

export function loadCognitionSession(
  storage: Pick<Storage, 'getItem'> = window.localStorage,
): CognitionSessionState {
  try {
    const raw = storage.getItem(COGNITION_SESSION_KEY);
    if (!raw) return defaultCognitionSession;

    const parsed = JSON.parse(raw) as Partial<CognitionSessionState>;
    if (
      parsed.version !== 1 ||
      !Number.isInteger(parsed.currentIndex) ||
      typeof parsed.recoveryScore !== 'number' ||
      parsed.recoveryScore < 0 ||
      parsed.recoveryScore > 100 ||
      (parsed.selectedNodeId !== null && typeof parsed.selectedNodeId !== 'string')
    ) {
      return defaultCognitionSession;
    }

    return parsed as CognitionSessionState;
  } catch {
    return defaultCognitionSession;
  }
}

export function saveCognitionSession(
  state: CognitionSessionState,
  storage: Pick<Storage, 'setItem'> = window.localStorage,
) {
  storage.setItem(COGNITION_SESSION_KEY, JSON.stringify(state));
}
