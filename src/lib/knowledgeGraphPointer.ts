import type { PointerState, SimNode } from './knowledgeGraphAtlas';

export const ATLAS_MIN_ZOOM = 0.3;
export const ATLAS_MAX_ZOOM = 3.4;

export function pointerDistance(a: PointerState, b: PointerState): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function clientToWorld(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number },
  width: number,
  height: number,
  zoom: number,
  offset: { x: number; y: number },
): { x: number; y: number } {
  return {
    x: (clientX - rect.left - offset.x - width / 2) / zoom + width / 2,
    y: (clientY - rect.top - offset.y - height / 2) / zoom + height / 2,
  };
}

export function hitTestNode(
  worldX: number,
  worldY: number,
  nodes: SimNode[],
  activeCategories: Set<string> | null,
): SimNode | null {
  let best: SimNode | null = null;
  let bestDist = Infinity;

  for (const node of nodes) {
    if (activeCategories && activeCategories.size > 0 && !activeCategories.has(node.category)) {
      continue;
    }
    const dist = Math.sqrt((worldX - node.x) ** 2 + (worldY - node.y) ** 2);
    if (dist < node.radius * 3 && dist < bestDist) {
      best = node;
      bestDist = dist;
    }
  }

  return best;
}

export function offsetForWorldPoint(
  worldX: number,
  worldY: number,
  zoom: number,
  screenX: number,
  screenY: number,
  width: number,
  height: number,
): { x: number; y: number } {
  return {
    x: screenX - (worldX - width / 2) * zoom - width / 2,
    y: screenY - (worldY - height / 2) * zoom - height / 2,
  };
}

/** Zoom toward a canvas-local cursor point; returns updated zoom + offset. */
export function zoomTowardCursor(
  cursorX: number,
  cursorY: number,
  width: number,
  height: number,
  oldZoom: number,
  offset: { x: number; y: number },
  zoomFactor: number,
  minZoom = ATLAS_MIN_ZOOM,
  maxZoom = ATLAS_MAX_ZOOM,
): { zoom: number; offset: { x: number; y: number } } {
  const newZoom = Math.max(minZoom, Math.min(maxZoom, oldZoom * zoomFactor));
  const worldX = (cursorX - offset.x - width / 2) / oldZoom + width / 2;
  const worldY = (cursorY - offset.y - height / 2) / oldZoom + height / 2;
  return {
    zoom: newZoom,
    offset: offsetForWorldPoint(worldX, worldY, newZoom, cursorX, cursorY, width, height),
  };
}

export function pinchZoomScale(
  currentDistance: number,
  startDistance: number,
  startZoom: number,
  minZoom = ATLAS_MIN_ZOOM,
  maxZoom = ATLAS_MAX_ZOOM,
): number {
  const scale = currentDistance / Math.max(startDistance, 1);
  return Math.max(minZoom, Math.min(maxZoom, startZoom * scale));
}
