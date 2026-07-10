import type { CodexDocument } from '../types';
import { CORPUS_BRIDGES, CORPUS_DOCUMENTS, corpusToDocuments, isLeanDocumentSet } from '../content/codexCorpus';

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
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  kind: GraphEdgeKind;
  weight: number;
}

export interface KnowledgeGraphData {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  source: 'live' | 'corpus';
  categories: string[];
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

function excerptFor(doc: CodexDocument): string {
  const lines = doc.content
    .split('\n')
    .map((line) => line.trim())
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

  const text = doc.content.replace(/\s+/g, ' ').trim();
  if (text.length <= 120) return text;
  return `${text.slice(0, 117)}…`;
}

export function resolveGraphDocuments(liveDocs: CodexDocument[]): {
  documents: CodexDocument[];
  source: 'live' | 'corpus';
} {
  if (isLeanDocumentSet(liveDocs)) {
    return { documents: corpusToDocuments(), source: 'corpus' };
  }
  return { documents: liveDocs, source: 'live' };
}

export function buildKnowledgeGraph(
  liveDocs: CodexDocument[],
  liveLinks: Array<{ source_document_id: string; target_document_id: string; link_type?: string }> = [],
): KnowledgeGraphData {
  const { documents, source } = resolveGraphDocuments(liveDocs);
  const byId = new Map(documents.map((doc) => [doc.id, doc]));
  const byPath = new Map(documents.map((doc) => [doc.path, doc]));

  const edgeMap = new Map<string, GraphEdgeData>();

  const addEdge = (sourceId: string, targetId: string, kind: GraphEdgeKind, weight = 1) => {
    if (!byId.has(sourceId) || !byId.has(targetId) || sourceId === targetId) return;
    const key = edgeKey(sourceId, targetId);
    const existing = edgeMap.get(key);
    if (existing) {
      existing.weight = Math.max(existing.weight, weight);
      if (kind === 'hierarchy' || (kind === 'bridges' && existing.kind === 'sibling')) {
        existing.kind = kind;
      }
      return;
    }
    edgeMap.set(key, {
      id: key,
      source: sourceId,
      target: targetId,
      kind,
      weight,
    });
  };

  documents.forEach((doc) => {
    if (doc.parent_id && byId.has(doc.parent_id)) {
      addEdge(doc.parent_id, doc.id, 'hierarchy', 1.4);
    }
  });

  liveLinks.forEach((link) => {
    addEdge(link.source_document_id, link.target_document_id, 'related', 1.1);
  });

  if (source === 'corpus') {
    CORPUS_BRIDGES.forEach((bridge) => {
      const sourceDoc = byPath.get(bridge.sourcePath);
      const targetDoc = byPath.get(bridge.targetPath);
      if (sourceDoc && targetDoc) {
        addEdge(sourceDoc.id, targetDoc.id, bridge.linkType, bridge.linkType === 'bridges' ? 1.25 : 1);
      }
    });
  }

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
      addEdge(ordered[i].id, ordered[i + 1].id, 'sibling', 0.55);
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
      excerpt: excerptFor(doc),
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
