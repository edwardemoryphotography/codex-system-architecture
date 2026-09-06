import type { GraphEdgeData, GraphNodeData } from './knowledgeGraph';
import { CATEGORY_ORDER, hashString, mulberry32, TAU, type SimNode } from './knowledgeGraphAtlas';

export function nodeRadius(node: GraphNodeData, isMobile: boolean): number {
  const base = isMobile ? 6.5 : 7.5;
  if (node.path === '/codex') return base + 7;
  if (node.isHub) return base + 3.5 + Math.min(node.childCount, 5) * 0.8;
  return base + Math.min(node.degree, 4) * 0.4;
}

export function placeSimNodes(
  nodes: GraphNodeData[],
  width: number,
  height: number,
  isMobile: boolean,
): SimNode[] {
  const categories = CATEGORY_ORDER.filter((c) => nodes.some((n) => n.category === c));
  const extra = [...new Set(nodes.map((n) => n.category))].filter((c) => !categories.includes(c));
  const ordered = [...categories, ...extra];
  const centerX = width / 2;
  const centerY = height / 2;
  const orbit = Math.min(width, height) * (isMobile ? 0.38 : 0.46);

  return nodes.map((node) => {
    const categoryIndex = Math.max(0, ordered.indexOf(node.category));
    const categoryAngle = (categoryIndex / Math.max(ordered.length, 1)) * TAU - Math.PI / 2;
    const depthFactor = Math.max(0.15, Math.min(1, node.depth / 4));
    const jitterSeed = mulberry32(hashString(node.id));
    const jitter = (jitterSeed() - 0.5) * 40;
    const radius = orbit * (0.18 + depthFactor) + jitter;
    return {
      ...node,
      x: centerX + Math.cos(categoryAngle) * radius + (jitterSeed() - 0.5) * 28,
      y: centerY + Math.sin(categoryAngle) * radius + (jitterSeed() - 0.5) * 28,
      vx: 0,
      vy: 0,
      radius: nodeRadius(node, isMobile),
      scale: 1,
      phase: jitterSeed() * TAU,
    };
  });
}

export interface SimulationStepInput {
  nodes: SimNode[];
  edges: GraphEdgeData[];
  byId: Map<string, SimNode>;
  width: number;
  height: number;
  dragging: SimNode | null;
  hoveredId: string | null;
  focusedId: string | null;
}

/** One force-simulation tick. Mutates node positions / velocities in place. */
export function stepSimulation({
  nodes,
  edges,
  byId,
  width,
  height,
  dragging,
  hoveredId,
  focusedId,
}: SimulationStepInput): void {
  if (nodes.length === 0) return;

  const centerX = width / 2;
  const centerY = height / 2;

  // category centroids for gentle cluster cohesion
  const centroid = new Map<string, { x: number; y: number; n: number }>();
  nodes.forEach((node) => {
    const entry = centroid.get(node.category) ?? { x: 0, y: 0, n: 0 };
    entry.x += node.x;
    entry.y += node.y;
    entry.n += 1;
    centroid.set(node.category, entry);
  });

  nodes.forEach((node) => {
    const dx = centerX - node.x;
    const dy = centerY - node.y;
    node.vx += dx * 0.00025;
    node.vy += dy * 0.00025;
    const c = centroid.get(node.category);
    if (c && c.n > 2) {
      node.vx += (c.x / c.n - node.x) * 0.0016;
      node.vy += (c.y / c.n - node.y) * 0.0016;
    }
  });

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const minDist = a.radius + b.radius + (a.isHub || b.isHub ? 72 : 42);
      if (dist < minDist) {
        const force = ((minDist - dist) / dist) * 0.12;
        a.vx -= dx * force;
        a.vy -= dy * force;
        b.vx += dx * force;
        b.vy += dy * force;
      } else if (dist < 260) {
        const force = 0.014 / dist;
        a.vx -= dx * force;
        a.vy -= dy * force;
        b.vx += dx * force;
        b.vy += dy * force;
      }
    }
  }

  edges.forEach((edge) => {
    const source = byId.get(edge.source);
    const target = byId.get(edge.target);
    if (!source || !target) return;
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const ideal =
      edge.kind === 'hierarchy' ? 100 : edge.kind === 'bridges' ? 165 : edge.kind === 'related' ? 148 : 85;
    const force = ((dist - ideal) / dist) * 0.012 * edge.weight;
    source.vx += dx * force;
    source.vy += dy * force;
    target.vx -= dx * force;
    target.vy -= dy * force;
  });

  nodes.forEach((node) => {
    if (node === dragging) return;
    node.vx *= 0.86;
    node.vy *= 0.86;
    node.x += node.vx;
    node.y += node.vy;
    node.x = Math.max(24, Math.min(width - 24, node.x));
    node.y = Math.max(24, Math.min(height - 24, node.y));

    const hovered = hoveredId === node.id || focusedId === node.id;
    const targetScale = hovered ? 1.18 : 1;
    node.scale += (targetScale - node.scale) * 0.22;
  });
}
