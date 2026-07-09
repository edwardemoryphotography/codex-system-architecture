import { describe, expect, it } from 'vitest';

import { normalizeDocument, normalizeSupabaseUrl } from './supabase';

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
