import { describe, expect, it } from 'vitest';

import { mergeCanonicalDocument, normalizeDocument, normalizeSupabaseUrl } from './supabase';

describe('normalizeSupabaseUrl', () => {
  it('converts dashboard URLs into API URLs', () => {
    expect(
      normalizeSupabaseUrl('https://supabase.com/dashboard/project/pkydkbuodikttfeawqsw'),
    ).toBe('https://pkydkbuodikttfeawqsw.supabase.co');
  });

  it('leaves API URLs unchanged', () => {
    expect(normalizeSupabaseUrl('https://pkydkbuodikttfeawqsw.supabase.co')).toBe(
      'https://pkydkbuodikttfeawqsw.supabase.co',
    );
  });
});

describe('normalizeDocument', () => {
  it('synthesizes path and parent_id for lean schemas', () => {
    const doc = normalizeDocument({
      id: '60063935-18dd-445e-b2be-5a3c4d9bc450',
      title: 'Define onboarding goal',
      content: 'What is the primary outcome?',
      category: 'onboarding',
      order: 1,
      created_at: '2026-06-15T08:23:16.615301+00:00',
      updated_at: '2026-06-15T08:23:16.615301+00:00',
    });

    expect(doc.path).toBe('/onboarding/define-onboarding-goal');
    expect(doc.parent_id).toBeNull();
    expect(doc.title).toBe('Define onboarding goal');
  });

  it('preserves an existing path', () => {
    const doc = normalizeDocument({
      id: 'abc',
      title: 'Root',
      path: '/codex/root',
      content: '',
      category: 'root',
      parent_id: null,
      order: 0,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    });

    expect(doc.path).toBe('/codex/root');
  });
});

describe('mergeCanonicalDocument', () => {
  it('preserves live row identity while replacing stale personal content', () => {
    const live = normalizeDocument({
      id: 'live-gear-row',
      title: 'Gear Specs',
      path: '/codex/artistic_systems/photography_ops/gear_specs.md',
      content: 'Primary camera: Sony A7R IV',
      category: 'artistic_systems',
      parent_id: 'live-photography-parent',
      order: 3,
      created_at: '2025-12-04T00:00:00.000Z',
      updated_at: '2025-12-30T00:00:00.000Z',
    });
    const canonical = {
      ...live,
      id: 'corpus-gear-row',
      title: 'Verified Gear Inventory',
      content: 'Primary camera: Sony A7 III',
      updated_at: '2026-07-14T00:00:00.000Z',
    };

    expect(mergeCanonicalDocument(live, canonical)).toEqual({
      ...live,
      title: 'Verified Gear Inventory',
      content: 'Primary camera: Sony A7 III',
      category: canonical.category,
      order: canonical.order,
    });
  });
});
