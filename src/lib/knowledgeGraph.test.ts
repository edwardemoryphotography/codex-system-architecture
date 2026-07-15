import { describe, expect, it } from 'vitest';

import { CORPUS_DOCUMENTS } from '../content/codexCorpus';
import { buildKnowledgeGraph, resolveGraphDocuments } from './knowledgeGraph';
import type { CodexDocument } from '../types';

const leanDocs: CodexDocument[] = [
  {
    id: '1',
    title: 'Define onboarding goal',
    path: '/onboarding/define-onboarding-goal',
    content: 'What is the primary outcome?',
    category: 'onboarding',
    parent_id: null,
    order: 1,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    provenance_status: ['repository_evidence'],
    evidence_basis: 'Repository test fixture for graph structure only.',
    last_reviewed: '2026-07-15',
    is_read_only: true,
  },
  {
    id: '2',
    title: 'Map user journey',
    path: '/onboarding/map-user-journey',
    content: 'Sketch the flow',
    category: 'onboarding',
    parent_id: null,
    order: 2,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    provenance_status: ['repository_evidence'],
    evidence_basis: 'Repository test fixture for graph structure only.',
    last_reviewed: '2026-07-15',
    is_read_only: true,
  },
];

describe('knowledgeGraph', () => {
  it('falls back to the full corpus when live data is lean', () => {
    const resolved = resolveGraphDocuments(leanDocs);
    expect(resolved.source).toBe('corpus');
    expect(resolved.documents.length).toBe(CORPUS_DOCUMENTS.length);
  });

  it('builds hierarchy, sibling, and bridge edges for the corpus', () => {
    const graph = buildKnowledgeGraph(leanDocs);

    expect(graph.nodes.length).toBe(CORPUS_DOCUMENTS.length);
    expect(graph.edges.length).toBeGreaterThan(70);
    expect(graph.categories).toContain('artistic_systems');
    expect(graph.categories).toContain('neuro');

    const hierarchy = graph.edges.filter((edge) => edge.kind === 'hierarchy');
    const bridges = graph.edges.filter((edge) => edge.kind === 'bridges');
    expect(hierarchy.length).toBeGreaterThan(40);
    expect(bridges.length).toBeGreaterThan(10);

    const root = graph.nodes.find((node) => node.path === '/codex');
    expect(root?.isHub).toBe(true);
  });
});
