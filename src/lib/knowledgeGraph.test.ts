import { afterEach, describe, expect, it, vi } from 'vitest';

import { CORPUS_DOCUMENTS, corpusToDocuments } from '../content/codexCorpus';
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
  afterEach(() => vi.useRealTimers());

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
    expect(root?.outcome).toMatch(/trustworthy map/i);
    expect(root?.nextAction).toMatch(/territory/i);
    expect(root?.reviewState).toBe('current');
    expect(graph.edges.every((edge) => edge.rationale.length > 0)).toBe(true);
  });

  it('preserves canonical cross-domain intelligence in live database mode', () => {
    const corpus = corpusToDocuments();
    const liveIdByCorpusId = new Map(
      corpus.map((document, index) => [document.id, `live-document-${index}`]),
    );
    const liveDocuments = corpus.map((document) => ({
      ...document,
      id: liveIdByCorpusId.get(document.id)!,
      parent_id: document.parent_id
        ? liveIdByCorpusId.get(document.parent_id) ?? null
        : null,
      is_read_only: false,
    }));
    const identityId = liveDocuments.find(
      (document) => document.path === '/codex/root/identity.md',
    )!.id;
    const personalityId = liveDocuments.find(
      (document) => document.path === '/codex/personal_os/personality_manual.md',
    )!.id;
    const graph = buildKnowledgeGraph(liveDocuments, [
      {
        source_document_id: identityId,
        target_document_id: personalityId,
        link_type: 'related',
        rationale: 'Generic live relationship.',
      },
    ]);

    expect(graph.source).toBe('live');
    expect(graph.edges.filter((edge) => edge.kind === 'bridges').length).toBeGreaterThan(15);
    expect(
      graph.edges.some((edge) => edge.rationale.includes('authors') || edge.rationale.includes('authorship')),
    ).toBe(true);
    const reviewedIdentityBridge = graph.edges.find(
      (edge) =>
        new Set([edge.source, edge.target]).has(identityId) &&
        new Set([edge.source, edge.target]).has(personalityId),
    );
    expect(reviewedIdentityBridge?.kind).toBe('bridges');
    expect(reviewedIdentityBridge?.rationale).toMatch(/confirmed identity informs collaboration/i);
  });

  it('uses category cadence for complete live-only documents', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-24T12:00:00.000Z'));
    const corpus = corpusToDocuments();
    const liveIdByCorpusId = new Map(
      corpus.map((document, index) => [document.id, `live-cadence-${index}`]),
    );
    const liveDocuments = corpus.map((document) => ({
      ...document,
      id: liveIdByCorpusId.get(document.id)!,
      parent_id: document.parent_id
        ? liveIdByCorpusId.get(document.parent_id) ?? null
        : null,
      is_read_only: false,
    }));
    liveDocuments.push({
      ...liveDocuments[0],
      id: 'live-automation-only',
      title: 'Live Automation Only',
      path: '/codex/automation/live-only.md',
      category: 'automation',
      parent_id: liveDocuments.find((document) => document.path === '/codex/automation')!.id,
      last_reviewed: '2026-07-10',
    });

    const graph = buildKnowledgeGraph(liveDocuments);
    expect(
      graph.nodes.find((node) => node.path === '/codex/automation/live-only.md')?.reviewState,
    ).toBe('due');
  });
});
