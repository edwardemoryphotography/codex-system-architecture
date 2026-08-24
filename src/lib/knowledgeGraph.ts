import type { CodexDocument } from '../types';
import { CORPUS_DOCUMENTS, corpusToDocuments, isLeanDocumentSet } from '../content/codexCorpus';
import {
  DOCUMENT_RELATIONSHIPS,
  getDocumentIntelligence,
  getReviewCadenceDays,
  getReviewState,
  type ReviewState,
} from '../content/documentIntelligence';

export type GraphEdgeKind = 'hierarchy' | 'related' | 'bridges' | 'sibling';

export interface GraphNodeData {
  id: string;
  title: string;
  path: string;
  category: string;
  parentId: string | null;
  depth: number;
  childCount: number;
  degree: number;
  isHub: boolean;
  excerpt: string;
  outcome: string;
  nextAction: string;
  proof: string;
  lastReviewed: string | null;
  reviewState: ReviewState;
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  kind: GraphEdgeKind;
  weight: number;
  rationale: string;
}

export interface KnowledgeGraphData {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  source: 'live' | 'corpus';
  categories: string[];
}

export function matchesGraphNodeQuery(node: GraphNodeData, rawQuery: string): boolean {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return true;
  return (
    node.title.toLowerCase().includes(query) ||
    node.path.toLowerCase().includes(query) ||
    node.category.toLowerCase().includes(query) ||
    node.outcome.toLowerCase().includes(query) ||
    node.nextAction.toLowerCase().includes(query)
  );
}

export const GRAPH_CATEGORY_COLORS: Record<string, string> = {
  root: '#10b981',
  council: '#f59e0b',
  territory: '#3b82f6',
  artistic_systems: '#f43f5e',
  neuro: '#8b5cf6',
  automation: '#06b6d4',
  business: '#f97316',
  personal_os: '#14b8a6',
  convergence: '#64748b',
  onboarding: '#a78bfa',
};

function edgeKey(a: string, b: string): string {
  return a < b ? `${a}::${b}` : `${b}::${a}`;
}

function depthFromPath(path: string): number {
  return path.split('/').filter(Boolean).length;
}

function stripMarkdown(line: string): string {
  return line
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .trim();
}

function excerptFor(doc: CodexDocument): string {
  const lines = doc.content
    .split('\n')
    .map((line) => stripMarkdown(line.trim()))
    .filter(Boolean);

  for (const line of lines) {
    if (
      line.startsWith('#') ||
      line.startsWith('```') ||
      line.startsWith('|') ||
      line.startsWith('-') ||
      line.startsWith('>') ||
      line.startsWith('┌') ||
      line.startsWith('│') ||
      line.startsWith('└') ||
      line.startsWith('├')
    ) {
      continue;
    }
    if (line.length < 24) continue;
    return line.length <= 140 ? line : `${line.slice(0, 137)}…`;
  }

  const text = stripMarkdown(doc.content.replace(/\s+/g, ' ').trim());
  if (text.length <= 120) return text;
  return `${text.slice(0, 117)}…`;
}

export function resolveGraphDocuments(liveDocs: CodexDocument[]): {
  documents: CodexDocument[];
  source: 'live' | 'corpus';
} {
  const isEmbeddedCorpus =
    liveDocs.length > 0 && liveDocs.every((document) => document.id.startsWith('corpus-'));
  if (isLeanDocumentSet(liveDocs) || isEmbeddedCorpus) {
    return { documents: corpusToDocuments(), source: 'corpus' };
  }
  return { documents: liveDocs, source: 'live' };
}

export function buildKnowledgeGraph(
  liveDocs: CodexDocument[],
  liveLinks: Array<{
    source_document_id: string;
    target_document_id: string;
    link_type?: string;
    rationale?: string;
  }> = [],
): KnowledgeGraphData {
  const { documents, source } = resolveGraphDocuments(liveDocs);
  const byId = new Map(documents.map((doc) => [doc.id, doc]));
  const byPath = new Map(documents.map((doc) => [doc.path, doc]));

  const edgeMap = new Map<string, GraphEdgeData>();

  const addEdge = (
    sourceId: string,
    targetId: string,
    kind: GraphEdgeKind,
    weight = 1,
    rationale = 'Connected in the knowledge system.',
    authoritative = false,
  ) => {
    if (!byId.has(sourceId) || !byId.has(targetId) || sourceId === targetId) return;
    const key = edgeKey(sourceId, targetId);
    const existing = edgeMap.get(key);
    if (existing) {
      existing.weight = Math.max(existing.weight, weight);
      const kindPriority: Record<GraphEdgeKind, number> = {
        sibling: 1,
        related: 2,
        bridges: 3,
        hierarchy: 4,
      };
      const incomingWins = kindPriority[kind] >= kindPriority[existing.kind];
      if (kindPriority[kind] > kindPriority[existing.kind]) {
        existing.kind = kind;
      }
      if (
        (authoritative && incomingWins) ||
        existing.rationale === 'Connected in the knowledge system.'
      ) {
        existing.rationale = rationale;
      }
      return;
    }
    edgeMap.set(key, {
      id: key,
      source: sourceId,
      target: targetId,
      kind,
      weight,
      rationale,
    });
  };

  documents.forEach((doc) => {
    if (doc.parent_id && byId.has(doc.parent_id)) {
      const parent = byId.get(doc.parent_id);
      addEdge(
        doc.parent_id,
        doc.id,
        'hierarchy',
        1.4,
        `${parent?.title ?? 'Parent'} contains ${doc.title} in the canonical hierarchy.`,
      );
    }
  });

  liveLinks.forEach((link) => {
    const kind: GraphEdgeKind = link.link_type === 'bridges' ? 'bridges' : 'related';
    addEdge(
      link.source_document_id,
      link.target_document_id,
      kind,
      kind === 'bridges' ? 1.25 : 1.1,
      link.rationale ?? 'Relationship loaded from the live knowledge database.',
    );
  });

  // Canonical relationship intelligence must remain present when live rows
  // replace corpus ids. Previously these edges disappeared in "LIVE DB" mode.
  DOCUMENT_RELATIONSHIPS.forEach((relationship) => {
    const sourceDoc = byPath.get(relationship.sourcePath);
    const targetDoc = byPath.get(relationship.targetPath);
    if (sourceDoc && targetDoc) {
      addEdge(
        sourceDoc.id,
        targetDoc.id,
        relationship.kind,
        relationship.kind === 'bridges' ? 1.25 : 1,
        relationship.rationale,
        true,
      );
    }
  });

  const childrenByParent = new Map<string, CodexDocument[]>();
  documents.forEach((doc) => {
    if (!doc.parent_id) return;
    const list = childrenByParent.get(doc.parent_id) ?? [];
    list.push(doc);
    childrenByParent.set(doc.parent_id, list);
  });

  childrenByParent.forEach((children) => {
    const ordered = [...children].sort((a, b) => a.order - b.order);
    for (let i = 0; i < ordered.length - 1; i += 1) {
      addEdge(
        ordered[i].id,
        ordered[i + 1].id,
        'sibling',
        0.55,
        `${ordered[i].title} and ${ordered[i + 1].title} are adjacent parts of the same territory.`,
      );
    }
  });

  const degree = new Map<string, number>();
  edgeMap.forEach((edge) => {
    degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1);
    degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1);
  });

  const nodes: GraphNodeData[] = documents.map((doc) => {
    const childCount = childrenByParent.get(doc.id)?.length ?? 0;
    const nodeDegree = degree.get(doc.id) ?? 0;
    const intelligence = getDocumentIntelligence(doc.path);
    const excerpt = excerptFor(doc);
    const cadence = intelligence ? getReviewCadenceDays(doc.path) : 90;
    return {
      id: doc.id,
      title: doc.title,
      path: doc.path,
      category: doc.category,
      parentId: doc.parent_id,
      depth: depthFromPath(doc.path),
      childCount,
      degree: nodeDegree,
      isHub: childCount > 0 || doc.path === '/codex' || nodeDegree >= 4,
      excerpt,
      outcome: intelligence?.outcome ?? excerpt,
      nextAction:
        intelligence?.nextAction ??
        'Open this live document, verify its current purpose, and define the next outcome-producing move.',
      proof:
        intelligence?.proof ??
        'The live document has a current owner, explicit outcome, and dated evidence.',
      lastReviewed: doc.last_reviewed,
      reviewState: getReviewState(doc.last_reviewed, cadence),
    };
  });

  const categories = [...new Set(nodes.map((node) => node.category))].sort((a, b) => {
    const orderA = CORPUS_DOCUMENTS.find((doc) => doc.category === a)?.order ?? 99;
    const orderB = CORPUS_DOCUMENTS.find((doc) => doc.category === b)?.order ?? 99;
    if (a === 'root') return -1;
    if (b === 'root') return 1;
    return orderA - orderB || a.localeCompare(b);
  });

  return {
    nodes,
    edges: [...edgeMap.values()],
    source,
    categories,
  };
}

export function getConnectedNodeIds(
  nodeId: string,
  edges: GraphEdgeData[],
): Set<string> {
  const connected = new Set<string>([nodeId]);
  edges.forEach((edge) => {
    if (edge.source === nodeId) connected.add(edge.target);
    if (edge.target === nodeId) connected.add(edge.source);
  });
  return connected;
}
