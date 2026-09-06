import type { GraphNodeData } from './knowledgeGraph';

/* ------------------------------------------------------------------ */
/* Design system — "System Atlas"                                      */
/* ------------------------------------------------------------------ */

export type NodeShape =
  | 'starburst'
  | 'hexagon'
  | 'diamond'
  | 'triangle'
  | 'pentagon'
  | 'square'
  | 'plus'
  | 'circle'
  | 'ring'
  | 'lens';

/** Every territory gets a glyph *and* a color — shape carries meaning even
 *  for color-blind users and at tiny radii. */
export const CATEGORY_SHAPES: Record<string, NodeShape> = {
  root: 'starburst',
  council: 'hexagon',
  territory: 'diamond',
  artistic_systems: 'triangle',
  neuro: 'pentagon',
  automation: 'square',
  business: 'plus',
  personal_os: 'circle',
  convergence: 'ring',
  onboarding: 'lens',
};

export const CATEGORY_ORDER = [
  'root',
  'council',
  'territory',
  'artistic_systems',
  'neuro',
  'automation',
  'business',
  'personal_os',
  'convergence',
  'onboarding',
];

interface CategoryPalette {
  dark: string;
  light: string;
}

export const CATEGORY_COLORS: Record<string, CategoryPalette> = {
  root: { dark: '#34d399', light: '#047857' },
  council: { dark: '#fbbf24', light: '#b45309' },
  territory: { dark: '#60a5fa', light: '#1d4ed8' },
  artistic_systems: { dark: '#fb7185', light: '#be123c' },
  neuro: { dark: '#a78bfa', light: '#6d28d9' },
  automation: { dark: '#22d3ee', light: '#0e7490' },
  business: { dark: '#fb923c', light: '#c2410c' },
  personal_os: { dark: '#2dd4bf', light: '#0f766e' },
  convergence: { dark: '#94a3b8', light: '#475569' },
  onboarding: { dark: '#c084fc', light: '#7e22ce' },
};

export function categoryColor(category: string, dark: boolean): string {
  const entry = CATEGORY_COLORS[category];
  if (entry) return dark ? entry.dark : entry.light;
  return dark ? '#94a3b8' : '#475569';
}

export function categoryShape(category: string): NodeShape {
  return CATEGORY_SHAPES[category] ?? 'circle';
}

export interface ModePalette {
  bgInner: string;
  bgOuter: string;
  speck: string;
  speckAlpha: number;
  grid: boolean;
  ink: string;
  inkSoft: string;
  edgeHierarchy: string;
  edgeBridges: string;
  edgeRelated: string;
  edgeSibling: string;
  edgeDim: string;
  clusterLabel: string;
  haloAlpha: number;
  crosshair: string;
  labelHalo: string;
}

export const DARK_PALETTE: ModePalette = {
  bgInner: '#0c1220',
  bgOuter: '#050810',
  speck: '#cdd9ee',
  speckAlpha: 0.5,
  grid: false,
  ink: '#e6edf7',
  inkSoft: 'rgba(148, 163, 184, 0.85)',
  edgeHierarchy: 'rgba(148, 163, 184, 0.42)',
  edgeBridges: 'rgba(96, 165, 250, 0.6)',
  edgeRelated: 'rgba(167, 139, 250, 0.45)',
  edgeSibling: 'rgba(100, 116, 139, 0.16)',
  edgeDim: 'rgba(55, 65, 81, 0.08)',
  clusterLabel: 'rgba(230, 237, 247, 0.34)',
  haloAlpha: 0.055,
  crosshair: 'rgba(230, 237, 247, 0.9)',
  labelHalo: 'rgba(5, 8, 16, 0.85)',
};

export const LIGHT_PALETTE: ModePalette = {
  bgInner: '#f5f6f2',
  bgOuter: '#eceee6',
  speck: '#9aa092',
  speckAlpha: 0.35,
  grid: true,
  ink: '#111111',
  inkSoft: 'rgba(17, 17, 17, 0.55)',
  edgeHierarchy: 'rgba(17, 17, 17, 0.28)',
  edgeBridges: 'rgba(29, 78, 216, 0.45)',
  edgeRelated: 'rgba(109, 40, 217, 0.35)',
  edgeSibling: 'rgba(17, 17, 17, 0.08)',
  edgeDim: 'rgba(17, 17, 17, 0.04)',
  clusterLabel: 'rgba(17, 17, 17, 0.3)',
  haloAlpha: 0.06,
  crosshair: 'rgba(17, 17, 17, 0.8)',
  labelHalo: 'rgba(245, 246, 242, 0.9)',
};

export const MONO_STACK = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
export const SANS_STACK = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

export const TAU = Math.PI * 2;
export const VISITED_STORAGE_KEY = 'codex-atlas-visited-v1';

export interface SimNode extends GraphNodeData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  scale: number;
  phase: number;
}

export interface PointerState {
  id: number;
  x: number;
  y: number;
}

export interface CameraAnim {
  start: number;
  duration: number;
  fromZoom: number;
  toZoom: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export interface AtlasSpeck {
  x: number;
  y: number;
  r: number;
  tw: number;
}

/* ------------------------------------------------------------------ */
/* Small deterministic helpers                                         */
/* ------------------------------------------------------------------ */

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function loadVisited(): Set<string> {
  try {
    const raw = window.localStorage.getItem(VISITED_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((v) => typeof v === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

export function persistVisited(visited: Set<string>) {
  try {
    window.localStorage.setItem(VISITED_STORAGE_KEY, JSON.stringify([...visited]));
  } catch {
    /* storage unavailable — visited state simply won't persist */
  }
}

export function formatCategory(category: string): string {
  return category.replace(/_/g, ' ');
}

export function createAtlasSpecks(seed = 20260807, count = 110): AtlasSpeck[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    x: rand(),
    y: rand(),
    r: 0.4 + rand() * 1.1,
    tw: rand() * TAU,
  }));
}
