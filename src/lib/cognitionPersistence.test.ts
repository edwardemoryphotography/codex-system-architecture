import { describe, expect, it } from 'vitest';

import {
  COGNITION_SESSION_KEY,
  defaultCognitionSession,
  loadCognitionSession,
  routeEnergy,
  saveCognitionSession,
} from './cognitionPersistence';

describe('cognition persistence', () => {
  it('falls back when persisted state has a different version', () => {
    const storage = { getItem: () => JSON.stringify({ version: 99 }) };
    expect(loadCognitionSession(storage)).toEqual(defaultCognitionSession);
  });

  it('round trips a versioned session', () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };
    const state = { ...defaultCognitionSession, currentIndex: 4, recoveryScore: 42 };
    saveCognitionSession(state, storage);
    expect(values.has(COGNITION_SESSION_KEY)).toBe(true);
    expect(loadCognitionSession(storage)).toEqual(state);
  });
});

describe('energy routing', () => {
  it('uses the source thresholds at 67 and 34', () => {
    expect(routeEnergy(67).mode).toBe('hyperfocus');
    expect(routeEnergy(66).mode).toBe('maintenance');
    expect(routeEnergy(34).mode).toBe('maintenance');
    expect(routeEnergy(33).mode).toBe('recovery');
  });

  it('rejects values outside the recovery scale', () => {
    expect(() => routeEnergy(-1)).toThrow(RangeError);
    expect(() => routeEnergy(101)).toThrow(RangeError);
  });
});
