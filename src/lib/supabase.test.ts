import { describe, expect, it } from 'vitest';

import {
  isPersistableDocumentId,
  mergeCanonicalDocument,
  mergeEmbeddedCanonicalDocument,
  mergeLiveDocumentsWithCorpus,
  normalizeDocument,
  normalizeSupabaseUrl,
} from './supabase';

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
      provenance_status: canonical.provenance_status,
      evidence_basis: canonical.evidence_basis,
      last_reviewed: canonical.last_reviewed,
      is_read_only: false,
    });
  });
});

describe('canonical live-document protection', () => {
  it('resolves canonical hierarchy references to live parent UUIDs', () => {
    const liveParent = normalizeDocument({
      id: '11111111-1111-4111-8111-111111111111',
      title: 'Stale root',
      path: '/codex',
      content: 'stale',
      category: 'root',
      parent_id: null,
      order: 0,
    });

    const merged = mergeLiveDocumentsWithCorpus([liveParent]);
    const root = merged.find((document) => document.path === '/codex/root');

    expect(root?.parent_id).toBe(liveParent.id);
    expect(root?.is_read_only).toBe(true);
  });

  it('replaces stale embedded bookmark and recent-document copy', () => {
    const embedded = mergeEmbeddedCanonicalDocument({
      id: '22222222-2222-4222-8222-222222222222',
      title: '6 Figure Print Engine',
      path: '/codex/artistic_systems/artful_intelligence/6_figure_print_engine.md',
      content: 'Jan: Revenue ████████ $14K',
      category: 'artistic_systems',
      parent_id: null,
      order: 3,
    });

    expect(embedded.title).toBe('Print Revenue Engine');
    expect(embedded.content).not.toContain('$14K');
    expect(embedded.provenance_status.length).toBeGreaterThan(0);
  });

  it('allows persistence only for live UUID document IDs', () => {
    expect(isPersistableDocumentId('33333333-3333-4333-8333-333333333333')).toBe(true);
    expect(isPersistableDocumentId('corpus-4-/codex/root')).toBe(false);
    expect(isPersistableDocumentId('live-gear-row')).toBe(false);
  });
});
