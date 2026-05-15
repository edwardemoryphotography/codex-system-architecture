import { describe, expect, it } from 'vitest';

import {
  clampSlideIndex,
  getProgressPercent,
  getStateForSection,
} from './cognitionState';

describe('getStateForSection', () => {
  it('maps sections to visual states', () => {
    expect(getStateForSection('recognition')).toBe('signal');
    expect(getStateForSection('mismatch')).toBe('fragmentation');
    expect(getStateForSection('translation')).toBe('stabilization');
    expect(getStateForSection('invitation')).toBe('proof');
  });
});

describe('clampSlideIndex', () => {
  it('clamps slide indices within deck bounds', () => {
    expect(clampSlideIndex(-1, 16)).toBe(0);
    expect(clampSlideIndex(7, 16)).toBe(7);
    expect(clampSlideIndex(24, 16)).toBe(15);
  });

  it('returns 0 when total is invalid', () => {
    expect(clampSlideIndex(3, 0)).toBe(0);
    expect(clampSlideIndex(3, -4)).toBe(0);
  });
});

describe('getProgressPercent', () => {
  it('computes progress as a percentage', () => {
    expect(getProgressPercent(0, 16)).toBe(6.25);
    expect(getProgressPercent(7, 16)).toBe(50);
    expect(getProgressPercent(15, 16)).toBe(100);
  });

  it('returns 0 when total is invalid', () => {
    expect(getProgressPercent(3, 0)).toBe(0);
    expect(getProgressPercent(3, -4)).toBe(0);
  });
});
