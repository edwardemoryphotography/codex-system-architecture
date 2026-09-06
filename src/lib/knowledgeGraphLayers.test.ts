import { describe, expect, it } from 'vitest';

import type { GraphNodeData } from './knowledgeGraph';
import { placeSimNodes, stepSimulation } from './knowledgeGraphSimulation';
import {
  clientToWorld,
  hitTestNode,
  offsetForWorldPoint,
  pinchZoomScale,
  pointerDistance,
  zoomTowardCursor,
} from './knowledgeGraphPointer';
import type { SimNode } from './knowledgeGraphAtlas';

function stubNode(overrides: Partial<GraphNodeData> & Pick<GraphNodeData, 'id' | 'path' | 'category'>): GraphNodeData {
  return {
    title: overrides.title ?? overrides.id,
    parentId: null,
    depth: 1,
    childCount: 0,
    degree: 1,
    isHub: false,
    excerpt: '',
    outcome: '',
    nextAction: '',
    proof: '',
    lastReviewed: null,
    reviewState: 'current',
    ...overrides,
  };
}

describe('knowledgeGraphSimulation', () => {
  it('places nodes with finite coordinates and radii', () => {
    const nodes = placeSimNodes(
      [
        stubNode({ id: 'a', path: '/a', category: 'root' }),
        stubNode({ id: 'b', path: '/b', category: 'council', depth: 2 }),
      ],
      800,
      600,
      false,
    );
    expect(nodes).toHaveLength(2);
    for (const node of nodes) {
      expect(Number.isFinite(node.x)).toBe(true);
      expect(Number.isFinite(node.y)).toBe(true);
      expect(node.radius).toBeGreaterThan(0);
      expect(node.vx).toBe(0);
      expect(node.vy).toBe(0);
    }
  });

  it('steps forces without exploding positions', () => {
    const nodes = placeSimNodes(
      [
        stubNode({ id: 'a', path: '/a', category: 'root', isHub: true, childCount: 3 }),
        stubNode({ id: 'b', path: '/b', category: 'council' }),
      ],
      800,
      600,
      true,
    );
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const before = nodes.map((n) => ({ x: n.x, y: n.y }));
    stepSimulation({
      nodes,
      edges: [{ id: 'e1', source: 'a', target: 'b', kind: 'hierarchy', weight: 1, rationale: '' }],
      byId,
      width: 800,
      height: 600,
      dragging: null,
      hoveredId: null,
      focusedId: null,
    });
    nodes.forEach((node, i) => {
      expect(Math.abs(node.x - before[i].x)).toBeLessThan(50);
      expect(Math.abs(node.y - before[i].y)).toBeLessThan(50);
      expect(node.x).toBeGreaterThanOrEqual(24);
      expect(node.x).toBeLessThanOrEqual(800 - 24);
    });
  });
});

describe('knowledgeGraphPointer', () => {
  it('round-trips world point through offset helpers', () => {
    const width = 400;
    const height = 300;
    const zoom = 1.5;
    const world = { x: 120, y: 80 };
    const screen = { x: 200, y: 150 };
    const offset = offsetForWorldPoint(world.x, world.y, zoom, screen.x, screen.y, width, height);
    const back = clientToWorld(
      screen.x,
      screen.y,
      { left: 0, top: 0 },
      width,
      height,
      zoom,
      offset,
    );
    expect(back.x).toBeCloseTo(world.x, 5);
    expect(back.y).toBeCloseTo(world.y, 5);
  });

  it('hit-tests the nearest interactive node', () => {
    const nodes: SimNode[] = [
      {
        ...stubNode({ id: 'near', path: '/near', category: 'root' }),
        x: 10,
        y: 10,
        vx: 0,
        vy: 0,
        radius: 8,
        scale: 1,
        phase: 0,
      },
      {
        ...stubNode({ id: 'far', path: '/far', category: 'council' }),
        x: 100,
        y: 100,
        vx: 0,
        vy: 0,
        radius: 8,
        scale: 1,
        phase: 0,
      },
    ];
    expect(hitTestNode(12, 12, nodes, null)?.id).toBe('near');
    expect(hitTestNode(12, 12, nodes, new Set(['council']))).toBeNull();
  });

  it('clamps pinch and cursor zoom', () => {
    expect(pinchZoomScale(200, 100, 1)).toBe(2);
    expect(pinchZoomScale(1000, 100, 1)).toBe(3.4);
    expect(pointerDistance({ id: 1, x: 0, y: 0 }, { id: 2, x: 3, y: 4 })).toBe(5);
    const zoomed = zoomTowardCursor(100, 100, 400, 300, 1, { x: 0, y: 0 }, 0.5);
    expect(zoomed.zoom).toBe(0.5);
  });
});
