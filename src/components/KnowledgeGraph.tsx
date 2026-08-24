import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Layers,
  RotateCcw,
  Scan,
  Search,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

import { useIsMobileLayout } from '../hooks/useMediaQuery';
import {
  buildKnowledgeGraph,
  getConnectedNodeIds,
  matchesGraphNodeQuery,
  type GraphEdgeData,
  type GraphNodeData,
  type KnowledgeGraphData,
} from '../lib/knowledgeGraph';
import { getDocumentLinks, getDocuments } from '../lib/supabase';

/* ------------------------------------------------------------------ */
/* Design system — "System Atlas"                                      */
/* ------------------------------------------------------------------ */

type NodeShape =
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
const CATEGORY_SHAPES: Record<string, NodeShape> = {
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

const CATEGORY_ORDER = [
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

const CATEGORY_COLORS: Record<string, CategoryPalette> = {
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

function categoryColor(category: string, dark: boolean): string {
  const entry = CATEGORY_COLORS[category];
  if (entry) return dark ? entry.dark : entry.light;
  return dark ? '#94a3b8' : '#475569';
}

function categoryShape(category: string): NodeShape {
  return CATEGORY_SHAPES[category] ?? 'circle';
}

interface ModePalette {
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

const DARK_PALETTE: ModePalette = {
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

const LIGHT_PALETTE: ModePalette = {
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

const MONO_STACK = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
const SANS_STACK = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

const TAU = Math.PI * 2;
const VISITED_STORAGE_KEY = 'codex-atlas-visited-v1';

/* ------------------------------------------------------------------ */
/* Small deterministic helpers                                         */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function loadVisited(): Set<string> {
  try {
    const raw = window.localStorage.getItem(VISITED_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((v) => typeof v === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

function persistVisited(visited: Set<string>) {
  try {
    window.localStorage.setItem(VISITED_STORAGE_KEY, JSON.stringify([...visited]));
  } catch {
    /* storage unavailable — visited state simply won't persist */
  }
}

function formatCategory(category: string): string {
  return category.replace(/_/g, ' ');
}

/* ------------------------------------------------------------------ */
/* Canvas glyph drawing                                                */
/* ------------------------------------------------------------------ */

function tracePolygon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, sides: number, rotation: number) {
  for (let i = 0; i < sides; i += 1) {
    const angle = rotation + (i / sides) * TAU;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function traceGlyph(
  ctx: CanvasRenderingContext2D,
  shape: NodeShape,
  x: number,
  y: number,
  r: number,
  rotation: number,
) {
  ctx.beginPath();
  switch (shape) {
    case 'circle':
      ctx.arc(x, y, r, 0, TAU);
      break;
    case 'ring':
      ctx.arc(x, y, r * 0.7, 0, TAU);
      break;
    case 'square':
      ctx.rect(x - r * 0.8, y - r * 0.8, r * 1.6, r * 1.6);
      break;
    case 'diamond':
      tracePolygon(ctx, x, y, r * 1.05, 4, rotation - Math.PI / 2);
      break;
    case 'triangle':
      tracePolygon(ctx, x, y, r * 1.12, 3, rotation - Math.PI / 2);
      break;
    case 'pentagon':
      tracePolygon(ctx, x, y, r * 1.05, 5, rotation - Math.PI / 2);
      break;
    case 'hexagon':
      tracePolygon(ctx, x, y, r, 6, rotation);
      break;
    case 'plus':
      ctx.rect(x - r * 0.28, y - r * 0.95, r * 0.56, r * 1.9);
      ctx.rect(x - r * 0.95, y - r * 0.28, r * 1.9, r * 0.56);
      break;
    case 'lens':
      ctx.arc(x, y, r, rotation + Math.PI * 0.15, rotation + Math.PI * 1.85);
      break;
    case 'starburst': {
      const spikes = 8;
      for (let i = 0; i < spikes * 2; i += 1) {
        const radius = i % 2 === 0 ? r * 1.35 : r * 0.5;
        const angle = rotation + (i / (spikes * 2)) * TAU;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }
    default:
      ctx.arc(x, y, r, 0, TAU);
  }
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface KnowledgeGraphProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument: (path: string) => void;
  isDarkMode: boolean;
}

interface SimNode extends GraphNodeData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  scale: number;
  phase: number;
}

interface PointerState {
  id: number;
  x: number;
  y: number;
}

interface CameraAnim {
  start: number;
  duration: number;
  fromZoom: number;
  toZoom: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

function nodeRadius(node: GraphNodeData, isMobile: boolean): number {
  const base = isMobile ? 6.5 : 7.5;
  if (node.path === '/codex') return base + 7;
  if (node.isHub) return base + 3.5 + Math.min(node.childCount, 5) * 0.8;
  return base + Math.min(node.degree, 4) * 0.4;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function KnowledgeGraph({
  isOpen,
  onClose,
  onSelectDocument,
  isDarkMode,
}: KnowledgeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const nodesRef = useRef<SimNode[]>([]);
  const nodeByIdRef = useRef<Map<string, SimNode>>(new Map());
  const edgesRef = useRef<GraphEdgeData[]>([]);
  const adjacencyRef = useRef<Map<string, GraphEdgeData[]>>(new Map());
  const zoomRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const cameraAnimRef = useRef<CameraAnim | null>(null);
  const hoveredNodeRef = useRef<SimNode | null>(null);
  const focusedNodeRef = useRef<SimNode | null>(null);
  const draggingNodeRef = useRef<SimNode | null>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const pointersRef = useRef<Map<number, PointerState>>(new Map());
  const pinchStartRef = useRef<{ distance: number; zoom: number } | null>(null);
  const animationRef = useRef(0);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const isDarkModeRef = useRef(isDarkMode);
  const isMobileRef = useRef(false);
  const activeCategoriesRef = useRef<Set<string> | null>(null);
  const searchQueryRef = useRef('');
  const spotlightCategoryRef = useRef<string | null>(null);
  const visitedRef = useRef<Set<string>>(new Set());
  const reducedMotionRef = useRef(false);
  const specksRef = useRef<Array<{ x: number; y: number; r: number; tw: number }>>([]);
  const startTimeRef = useRef(0);

  const isMobile = useIsMobileLayout();
  const [isLoading, setIsLoading] = useState(true);
  const [graphMeta, setGraphMeta] = useState<Pick<KnowledgeGraphData, 'source' | 'categories'>>({
    source: 'corpus',
    categories: [],
  });
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);
  const [focusedNode, setFocusedNode] = useState<SimNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<string> | null>(null);
  const [showIndex, setShowIndex] = useState(false);
  const [connectionsExpanded, setConnectionsExpanded] = useState(false);
  const [searchActiveIndex, setSearchActiveIndex] = useState(0);
  const [visitedVersion, setVisitedVersion] = useState(0);

  isDarkModeRef.current = isDarkMode;
  isMobileRef.current = isMobile;
  activeCategoriesRef.current = activeCategories;
  searchQueryRef.current = searchQuery;

  const categoryList = useMemo(() => graphMeta.categories, [graphMeta.categories]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    nodesRef.current.forEach((node) => {
      counts.set(node.category, (counts.get(node.category) ?? 0) + 1);
    });
    return counts;
    // nodeCount changes exactly when the node set is (re)built
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeCount]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return nodesRef.current
      .filter((node) => matchesGraphNodeQuery(node, query))
      .slice(0, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, nodeCount]);

  useEffect(() => {
    setSearchActiveIndex(0);
  }, [searchQuery]);

  const isDesktopIndexVisible = !isMobile || showIndex;

  /* ------------------------------------------------------------ */
  /* Camera                                                        */
  /* ------------------------------------------------------------ */

  const cancelCameraAnim = useCallback(() => {
    cameraAnimRef.current = null;
  }, []);

  const animateCameraTo = useCallback(
    (toZoom: number, toX: number, toY: number, duration = 650) => {
      if (reducedMotionRef.current || duration <= 0) {
        zoomRef.current = toZoom;
        offsetRef.current = { x: toX, y: toY };
        cameraAnimRef.current = null;
        return;
      }
      cameraAnimRef.current = {
        start: performance.now(),
        duration,
        fromZoom: zoomRef.current,
        toZoom,
        fromX: offsetRef.current.x,
        fromY: offsetRef.current.y,
        toX,
        toY,
      };
    },
    [],
  );

  const offsetFor = useCallback((worldX: number, worldY: number, zoom: number, screenX: number, screenY: number) => {
    const { width, height } = dimensionsRef.current;
    return {
      x: screenX - (worldX - width / 2) * zoom - width / 2,
      y: screenY - (worldY - height / 2) * zoom - height / 2,
    };
  }, []);

  const focusNodeCamera = useCallback(
    (node: SimNode) => {
      const { width, height } = dimensionsRef.current;
      const zoom = Math.min(2.1, Math.max(zoomRef.current, isMobileRef.current ? 1.25 : 1.45));
      // keep the node clear of the territory index (desktop left) and the detail card
      const targetX = width * (isMobileRef.current ? 0.5 : 0.68);
      const targetY = height * (isMobileRef.current ? 0.24 : 0.4);
      const offset = offsetFor(node.x, node.y, zoom, targetX, targetY);
      animateCameraTo(zoom, offset.x, offset.y);
    },
    [animateCameraTo, offsetFor],
  );

  const fitToView = useCallback(() => {
    const nodes = nodesRef.current;
    if (nodes.length === 0) return;
    const { width, height } = dimensionsRef.current;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    nodes.forEach((node) => {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x);
      maxY = Math.max(maxY, node.y);
    });
    const pad = isMobileRef.current ? 60 : 110;
    const spanX = Math.max(maxX - minX, 1);
    const spanY = Math.max(maxY - minY, 1);
    const zoom = Math.max(
      0.3,
      Math.min(1.5, Math.min((width - pad * 2) / spanX, (height - pad * 2) / spanY)),
    );
    const offset = offsetFor((minX + maxX) / 2, (minY + maxY) / 2, zoom, width / 2, height / 2);
    animateCameraTo(zoom, offset.x, offset.y);
  }, [animateCameraTo, offsetFor]);

  /* ------------------------------------------------------------ */
  /* Canvas lifecycle                                              */
  /* ------------------------------------------------------------ */

  useEffect(() => {
    if (!isOpen) return undefined;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    let mounted = true;
    visitedRef.current = loadVisited();
    reducedMotionRef.current =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    startTimeRef.current = performance.now();

    const rand = mulberry32(20260807);
    specksRef.current = Array.from({ length: 110 }, () => ({
      x: rand(),
      y: rand(),
      r: 0.4 + rand() * 1.1,
      tw: rand() * TAU,
    }));

    const initCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      dimensionsRef.current = { width: rect.width, height: rect.height };
    };

    const placeNodes = (nodes: GraphNodeData[], width: number, height: number): SimNode[] => {
      const categories = CATEGORY_ORDER.filter((c) => nodes.some((n) => n.category === c));
      const extra = [...new Set(nodes.map((n) => n.category))].filter((c) => !categories.includes(c));
      const ordered = [...categories, ...extra];
      const centerX = width / 2;
      const centerY = height / 2;
      const orbit = Math.min(width, height) * (isMobileRef.current ? 0.38 : 0.46);

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
          radius: nodeRadius(node, isMobileRef.current),
          scale: 1,
          phase: jitterSeed() * TAU,
        };
      });
    };

    const rebuildAdjacency = () => {
      const adjacency = new Map<string, GraphEdgeData[]>();
      edgesRef.current.forEach((edge) => {
        const list = adjacency.get(edge.source) ?? [];
        list.push(edge);
        adjacency.set(edge.source, list);
        const listB = adjacency.get(edge.target) ?? [];
        listB.push(edge);
        adjacency.set(edge.target, listB);
      });
      adjacencyRef.current = adjacency;
    };

    const applyGraph = (graph: KnowledgeGraphData) => {
      const { width, height } = dimensionsRef.current;
      const simNodes = placeNodes(graph.nodes, width, height);
      nodesRef.current = simNodes;
      nodeByIdRef.current = new Map(simNodes.map((node) => [node.id, node]));
      edgesRef.current = graph.edges;
      rebuildAdjacency();
      setNodeCount(graph.nodes.length);
      setEdgeCount(graph.edges.length);
      setGraphMeta({ source: graph.source, categories: graph.categories });
    };

    const loadData = async () => {
      initCanvas();
      setActiveCategories(null);
      setSearchQuery('');
      searchQueryRef.current = '';
      setShowIndex(false);
      setConnectionsExpanded(false);
      setFocusedNode(null);
      focusedNodeRef.current = null;
      setHoveredNode(null);
      hoveredNodeRef.current = null;
      zoomRef.current = isMobileRef.current ? 0.85 : 1;
      offsetRef.current = { x: 0, y: 0 };
      setIsLoading(true);
      try {
        const [docs, links] = await Promise.all([getDocuments(), getDocumentLinks()]);
        if (!mounted) return;
        applyGraph(buildKnowledgeGraph(docs, links ?? []));
      } catch (error) {
        console.error('Failed to load graph:', error);
        if (!mounted) return;
        applyGraph(buildKnowledgeGraph([]));
      }
      setIsLoading(false);
      startAnimation();
    };

    /* ---------------- visibility model ---------------- */

    const categoryDimmed = (node: SimNode) => {
      const categories = activeCategoriesRef.current;
      return Boolean(categories && categories.size > 0 && !categories.has(node.category));
    };

    const matchesQuery = (node: SimNode) => {
      return matchesGraphNodeQuery(node, searchQueryRef.current);
    };

    /* ---------------- simulation ---------------- */

    const simulate = () => {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const byId = nodeByIdRef.current;
      if (nodes.length === 0) return;

      const { width, height } = dimensionsRef.current;
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

      const dragging = draggingNodeRef.current;
      nodes.forEach((node) => {
        if (node === dragging) return;
        node.vx *= 0.86;
        node.vy *= 0.86;
        node.x += node.vx;
        node.y += node.vy;
        node.x = Math.max(24, Math.min(width - 24, node.x));
        node.y = Math.max(24, Math.min(height - 24, node.y));

        const hovered = hoveredNodeRef.current?.id === node.id || focusedNodeRef.current?.id === node.id;
        const targetScale = hovered ? 1.18 : 1;
        node.scale += (targetScale - node.scale) * 0.22;
      });
    };

    /* ---------------- drawing ---------------- */

    const draw = (now: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // camera animation
      const anim = cameraAnimRef.current;
      if (anim) {
        const p = Math.min(1, (now - anim.start) / anim.duration);
        const eased = easeOutExpo(p);
        zoomRef.current = anim.fromZoom + (anim.toZoom - anim.fromZoom) * eased;
        offsetRef.current = {
          x: anim.fromX + (anim.toX - anim.fromX) * eased,
          y: anim.fromY + (anim.toY - anim.fromY) * eased,
        };
        if (p >= 1) cameraAnimRef.current = null;
      }

      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const byId = nodeByIdRef.current;
      const { width, height } = dimensionsRef.current;
      const zoom = zoomRef.current;
      const offset = offsetRef.current;
      const dark = isDarkModeRef.current;
      const palette = dark ? DARK_PALETTE : LIGHT_PALETTE;
      const dpr = window.devicePixelRatio || 1;
      const t = reducedMotionRef.current ? 0 : (now - startTimeRef.current) / 1000;
      const hovered = hoveredNodeRef.current;
      const focused = focusedNodeRef.current;
      const spotlight = spotlightCategoryRef.current;
      const query = searchQueryRef.current.trim();
      const connected = focused ? getConnectedNodeIds(focused.id, edges) : hovered ? getConnectedNodeIds(hovered.id, edges) : null;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // background wash
      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        24,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75,
      );
      gradient.addColorStop(0, palette.bgInner);
      gradient.addColorStop(1, palette.bgOuter);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // star specks (dark) / graph-paper dots (light), with slight parallax
      ctx.save();
      specksRef.current.forEach((speck) => {
        const px = (((speck.x * width + offset.x * 0.06) % width) + width) % width;
        const py = (((speck.y * height + offset.y * 0.06) % height) + height) % height;
        const twinkle = reducedMotionRef.current ? 0.7 : 0.45 + 0.3 * Math.sin(t * 1.3 + speck.tw);
        ctx.globalAlpha = palette.speckAlpha * twinkle * (palette.grid ? 0.55 : 1);
        ctx.fillStyle = palette.speck;
        ctx.beginPath();
        ctx.arc(px, py, palette.grid ? 0.7 : speck.r, 0, TAU);
        ctx.fill();
      });
      ctx.restore();

      ctx.translate(offset.x + width / 2, offset.y + height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-width / 2, -height / 2);

      const nodeState = (node: SimNode) => {
        let alpha = 1;
        if (categoryDimmed(node)) alpha = 0.07;
        else if (query && !matchesQuery(node)) alpha = 0.1;
        else if (spotlight && node.category !== spotlight) alpha = 0.12;
        else if (connected && !connected.has(node.id)) alpha = 0.16;
        const interactive = alpha > 0.08;
        return { alpha, interactive };
      };

      // cluster halos + territory labels at bird's-eye zoom
      const clusters = new Map<string, { x: number; y: number; n: number; spread: number }>();
      nodes.forEach((node) => {
        const entry = clusters.get(node.category) ?? { x: 0, y: 0, n: 0, spread: 0 };
        entry.x += node.x;
        entry.y += node.y;
        entry.n += 1;
        clusters.set(node.category, entry);
      });
      clusters.forEach((entry) => {
        entry.x /= entry.n;
        entry.y /= entry.n;
      });
      nodes.forEach((node) => {
        const entry = clusters.get(node.category);
        if (!entry) return;
        const d = Math.hypot(node.x - entry.x, node.y - entry.y);
        entry.spread = Math.max(entry.spread, d);
      });

      clusters.forEach((entry, category) => {
        if (entry.n < 2) return;
        const color = categoryColor(category, dark);
        const haloRadius = entry.spread + 90;
        const halo = ctx.createRadialGradient(entry.x, entry.y, 0, entry.x, entry.y, haloRadius);
        halo.addColorStop(0, `${color}${Math.round(palette.haloAlpha * 255).toString(16).padStart(2, '0')}`);
        halo.addColorStop(1, 'transparent');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(entry.x, entry.y, haloRadius, 0, TAU);
        ctx.fill();

        // territory name, only readable at low zoom — the map's legend in place
        const labelAlpha = Math.max(0, Math.min(1, (1.12 - zoom) / 0.5));
        if (!isMobileRef.current && labelAlpha > 0.03 && entry.n >= 2) {
          const fontSize = 12 / zoom;
          ctx.font = `600 ${fontSize}px ${MONO_STACK}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.globalAlpha = labelAlpha * (spotlight && spotlight !== category ? 0.25 : 1);
          ctx.fillStyle = color;
          const labelY = entry.y - entry.spread - 34 / zoom;
          ctx.fillText(formatCategory(category).toUpperCase().split('').join(' '), entry.x, labelY);
          ctx.globalAlpha = 1;
        }
      });

      // edges
      edges.forEach((edge) => {
        const source = byId.get(edge.source);
        const target = byId.get(edge.target);
        if (!source || !target) return;
        const sa = nodeState(source).alpha;
        const ta = nodeState(target).alpha;
        const edgeAlpha = Math.min(sa, ta);
        if (edgeAlpha < 0.05) return;

        const isHot = !connected || (connected.has(edge.source) && connected.has(edge.target));
        let color: string;
        let widthPx: number;
        let dash: number[] = [];
        let flow = 0;

        if (edge.kind === 'hierarchy') {
          color = palette.edgeHierarchy;
          widthPx = 1.4;
        } else if (edge.kind === 'bridges') {
          color = palette.edgeBridges;
          widthPx = 1.4;
          dash = [9, 7];
          flow = 26;
        } else if (edge.kind === 'related') {
          color = palette.edgeRelated;
          widthPx = 1.1;
          dash = [2.5, 5.5];
          flow = 12;
        } else {
          color = palette.edgeSibling;
          widthPx = 1;
        }

        const hotBoost = connected && isHot ? 1.9 : 1;
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = isHot ? color : palette.edgeDim;
        ctx.globalAlpha = edgeAlpha * (connected && isHot ? 1 : 0.9);
        ctx.lineWidth = widthPx * hotBoost;
        ctx.setLineDash(dash);
        if (dash.length > 0 && flow > 0) {
          ctx.lineDashOffset = -((t * flow) % (dash[0] + dash[1]));
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      });

      // nodes
      nodes.forEach((node) => {
        const { alpha } = nodeState(node);
        if (alpha < 0.04) return;
        const color = categoryColor(node.category, dark);
        const shape = categoryShape(node.category);
        const isHovered = hovered?.id === node.id;
        const isFocused = focused?.id === node.id;
        const isVisited = visitedRef.current.has(node.path);
        const radius = node.radius * node.scale;
        const isNeighborOfActive = Boolean(connected && connected.has(node.id) && node.id !== focused?.id && node.id !== hovered?.id);

        ctx.globalAlpha = alpha * (isVisited && !isHovered && !isFocused ? 0.5 : 1);

        // halo glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 3, 0, TAU);
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 3);
        glow.addColorStop(0, `${color}3d`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fill();

        // hub pulse ring
        if (node.isHub && !reducedMotionRef.current && alpha > 0.5) {
          const pulse = (Math.sin(t * (TAU / 1.5) + node.phase) + 1) / 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * (1.5 + pulse * 0.9), 0, TAU);
          ctx.strokeStyle = color;
          ctx.globalAlpha = alpha * (0.34 - pulse * 0.3);
          ctx.lineWidth = 1.1 / zoom;
          ctx.stroke();
          ctx.globalAlpha = alpha * (isVisited && !isHovered && !isFocused ? 0.5 : 1);
        }

        // glyph
        const rotation =
          shape === 'starburst'
            ? node.phase + (reducedMotionRef.current ? 0 : t * 0.25)
            : node.phase * 0.3;
        traceGlyph(ctx, shape, node.x, node.y, radius, rotation);
        if (shape === 'ring') {
          ctx.strokeStyle = color;
          ctx.lineWidth = radius * 0.5;
          ctx.stroke();
        } else {
          ctx.fillStyle = color;
          ctx.fill();
        }

        // ink rim on hover / focus / hub
        if (isHovered || isFocused || node.isHub) {
          traceGlyph(ctx, shape, node.x, node.y, radius, rotation);
          ctx.strokeStyle = dark ? '#f8fafc' : '#111111';
          ctx.lineWidth = (isFocused ? 2 : 1.3) / Math.sqrt(zoom);
          ctx.stroke();
        }

        // crosshair reticle on hover / focus
        if (isHovered || isFocused) {
          const rr = radius * 2.15;
          const tick = radius * 0.55;
          ctx.beginPath();
          ctx.arc(node.x, node.y, rr, 0, TAU);
          [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach((angle) => {
            ctx.moveTo(node.x + Math.cos(angle) * rr, node.y + Math.sin(angle) * rr);
            ctx.lineTo(node.x + Math.cos(angle) * (rr + tick), node.y + Math.sin(angle) * (rr + tick));
          });
          ctx.strokeStyle = palette.crosshair;
          ctx.lineWidth = 1 / zoom;
          ctx.globalAlpha = alpha * 0.85;
          ctx.stroke();
          ctx.globalAlpha = alpha;
        }

        // labels — title always for hubs and at close zoom; category only on hover
        const showLabel =
          alpha > 0.4 &&
          (isMobileRef.current
            ? isHovered ||
              isFocused ||
              Boolean(query && matchesQuery(node)) ||
              (!focused && node.depth <= 2)
            : isHovered ||
              isFocused ||
              isNeighborOfActive ||
              node.isHub ||
              zoom > 1.5 ||
              Boolean(query && matchesQuery(node)));

        if (showLabel) {
          const fontSize = Math.max(9, 11.5 / zoom);
          const label =
            node.title.length > 30 && !isHovered && !isFocused
              ? `${node.title.slice(0, 28)}…`
              : node.title;
          const labelY = node.y + radius + 7 / zoom;

          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.font = `${node.isHub ? 600 : 500} ${fontSize}px ${SANS_STACK}`;

          // text halo for legibility over edges
          const metrics = typeof ctx.measureText === 'function' ? ctx.measureText(label) : { width: label.length * fontSize * 0.6 };
          const padX = 4 / zoom;
          const padY = 2.5 / zoom;
          ctx.fillStyle = palette.labelHalo;
          ctx.globalAlpha = alpha * 0.82;
          ctx.fillRect(
            node.x - metrics.width / 2 - padX,
            labelY - padY,
            metrics.width + padX * 2,
            fontSize * 1.25 + padY * 2,
          );

          ctx.globalAlpha = alpha;
          ctx.fillStyle = palette.ink;
          ctx.fillText(label, node.x, labelY);

          // visited strikethrough
          if (isVisited && !isHovered && !isFocused) {
            ctx.beginPath();
            ctx.moveTo(node.x - metrics.width / 2, labelY + fontSize * 0.55);
            ctx.lineTo(node.x + metrics.width / 2, labelY + fontSize * 0.55);
            ctx.strokeStyle = palette.inkSoft;
            ctx.lineWidth = 1 / zoom;
            ctx.stroke();
          }

          // category subtitle only on hover / focus (progressive disclosure)
          if (isHovered || isFocused) {
            ctx.font = `500 ${Math.max(8, 9 / zoom)}px ${MONO_STACK}`;
            ctx.fillStyle = color;
            ctx.globalAlpha = alpha * 0.95;
            ctx.fillText(formatCategory(node.category).toUpperCase(), node.x, labelY + fontSize * 1.45);
          }
          ctx.globalAlpha = 1;
        } else {
          ctx.globalAlpha = 1;
        }
      });

      simulate();
      animationRef.current = requestAnimationFrame(draw);
    };

    const startAnimation = () => {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(draw);
    };

    loadData();

    const handleResize = () => {
      initCanvas();
    };

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null;
    resizeObserver?.observe(container);
    window.addEventListener('resize', handleResize);

    return () => {
      mounted = false;
      resizeObserver?.disconnect();
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isOpen]);

  /* ------------------------------------------------------------ */
  /* Pointer + keyboard                                            */
  /* ------------------------------------------------------------ */

  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const { width, height } = dimensionsRef.current;
    const zoom = zoomRef.current;
    const offset = offsetRef.current;
    return {
      x: (clientX - rect.left - offset.x - width / 2) / zoom + width / 2,
      y: (clientY - rect.top - offset.y - height / 2) / zoom + height / 2,
    };
  }, []);

  const getNodeAtPosition = useCallback((clientX: number, clientY: number): SimNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const { width, height } = dimensionsRef.current;
    const zoom = zoomRef.current;
    const offset = offsetRef.current;
    const x = (clientX - rect.left - offset.x - width / 2) / zoom + width / 2;
    const y = (clientY - rect.top - offset.y - height / 2) / zoom + height / 2;

    let best: SimNode | null = null;
    let bestDist = Infinity;

    for (const node of nodesRef.current) {
      const categories = activeCategoriesRef.current;
      if (categories && categories.size > 0 && !categories.has(node.category)) continue;
      const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      if (dist < node.radius * 3 && dist < bestDist) {
        best = node;
        bestDist = dist;
      }
    }

    return best;
  }, []);

  const selectNode = useCallback(
    (node: SimNode, moveCamera: boolean) => {
      focusedNodeRef.current = node;
      setFocusedNode(node);
      hoveredNodeRef.current = node;
      setHoveredNode(node);
      setConnectionsExpanded(false);
      if (moveCamera) focusNodeCamera(node);
    },
    [focusNodeCamera],
  );

  const markVisited = useCallback((path: string) => {
    if (visitedRef.current.has(path)) return;
    visitedRef.current = new Set([...visitedRef.current, path]);
    persistVisited(visitedRef.current);
    setVisitedVersion((v) => v + 1);
  }, []);

  const openNode = useCallback(
    (node: SimNode) => {
      markVisited(node.path);
      onSelectDocument(node.path);
      onClose();
    },
    [markVisited, onClose, onSelectDocument],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.setPointerCapture(event.pointerId);
      pointersRef.current.set(event.pointerId, {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      });
      cancelCameraAnim();

      if (pointersRef.current.size === 2) {
        const points = [...pointersRef.current.values()];
        const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
        pinchStartRef.current = { distance, zoom: zoomRef.current };
        isPanningRef.current = false;
        draggingNodeRef.current = null;
        return;
      }

      const node = getNodeAtPosition(event.clientX, event.clientY);
      if (node) {
        draggingNodeRef.current = node;
        selectNode(node, false);
      } else {
        isPanningRef.current = true;
        panStartRef.current = { x: event.clientX, y: event.clientY };
      }
    },
    [cancelCameraAnim, getNodeAtPosition, selectNode],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (pointersRef.current.has(event.pointerId)) {
        pointersRef.current.set(event.pointerId, {
          id: event.pointerId,
          x: event.clientX,
          y: event.clientY,
        });
      }

      if (pointersRef.current.size === 2 && pinchStartRef.current) {
        const points = [...pointersRef.current.values()];
        const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
        const scale = distance / Math.max(pinchStartRef.current.distance, 1);
        zoomRef.current = Math.max(0.3, Math.min(3.4, pinchStartRef.current.zoom * scale));
        return;
      }

      const dragging = draggingNodeRef.current;
      if (dragging) {
        const world = screenToWorld(event.clientX, event.clientY);
        dragging.x = world.x;
        dragging.y = world.y;
        dragging.vx = 0;
        dragging.vy = 0;
        return;
      }

      if (isPanningRef.current) {
        offsetRef.current = {
          x: offsetRef.current.x + (event.clientX - panStartRef.current.x),
          y: offsetRef.current.y + (event.clientY - panStartRef.current.y),
        };
        panStartRef.current = { x: event.clientX, y: event.clientY };
        return;
      }

      const node = getNodeAtPosition(event.clientX, event.clientY);
      hoveredNodeRef.current = node;
      setHoveredNode(node);
    },
    [getNodeAtPosition, screenToWorld],
  );

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size < 2) {
      pinchStartRef.current = null;
    }
    isPanningRef.current = false;
    draggingNodeRef.current = null;
  }, []);

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const node = getNodeAtPosition(event.clientX, event.clientY);
      if (node) openNode(node);
    },
    [getNodeAtPosition, openNode],
  );

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLCanvasElement>) => {
      event.preventDefault();
      cancelCameraAnim();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const { width, height } = dimensionsRef.current;
      const cursorX = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;
      const oldZoom = zoomRef.current;
      const delta = event.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.3, Math.min(3.4, oldZoom * delta));

      // zoom toward the cursor: keep the world point under the cursor fixed
      const worldX = (cursorX - offsetRef.current.x - width / 2) / oldZoom + width / 2;
      const worldY = (cursorY - offsetRef.current.y - height / 2) / oldZoom + height / 2;
      zoomRef.current = newZoom;
      offsetRef.current = {
        x: cursorX - (worldX - width / 2) * newZoom - width / 2,
        y: cursorY - (worldY - height / 2) * newZoom - height / 2,
      };
    },
    [cancelCameraAnim],
  );

  const handleZoomIn = useCallback(() => {
    cancelCameraAnim();
    const { width, height } = dimensionsRef.current;
    const newZoom = Math.min(3.4, zoomRef.current * 1.25);
    const offset = offsetFor(
      (width / 2 - offsetRef.current.x - width / 2) / zoomRef.current + width / 2,
      (height / 2 - offsetRef.current.y - height / 2) / zoomRef.current + height / 2,
      newZoom,
      width / 2,
      height / 2,
    );
    animateCameraTo(newZoom, offset.x, offset.y, 220);
  }, [animateCameraTo, cancelCameraAnim, offsetFor]);

  const handleZoomOut = useCallback(() => {
    cancelCameraAnim();
    const { width, height } = dimensionsRef.current;
    const newZoom = Math.max(0.3, zoomRef.current * 0.8);
    const offset = offsetFor(
      (width / 2 - offsetRef.current.x - width / 2) / zoomRef.current + width / 2,
      (height / 2 - offsetRef.current.y - height / 2) / zoomRef.current + height / 2,
      newZoom,
      width / 2,
      height / 2,
    );
    animateCameraTo(newZoom, offset.x, offset.y, 220);
  }, [animateCameraTo, cancelCameraAnim, offsetFor]);

  const resetView = useCallback(() => {
    animateCameraTo(isMobile ? 0.85 : 1, 0, 0, 450);
    focusedNodeRef.current = null;
    setFocusedNode(null);
    setSearchQuery('');
    setActiveCategories(null);
  }, [animateCameraTo, isMobile]);

  const clearFocus = useCallback(() => {
    focusedNodeRef.current = null;
    setFocusedNode(null);
    hoveredNodeRef.current = null;
    setHoveredNode(null);
    setConnectionsExpanded(false);
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setActiveCategories((current) => {
      if (!current) return new Set([category]);
      const next = new Set(current);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next.size === 0 ? null : next;
    });
  }, []);

  const openMobileSearch = useCallback(() => {
    setShowIndex(true);
    window.requestAnimationFrame(() => searchInputRef.current?.focus());
  }, []);

  const focusSearchResult = useCallback(
    (index: number) => {
      const node = searchResults[index];
      if (!node) return;
      selectNode(node, true);
      if (isMobile) setShowIndex(false);
    },
    [isMobile, searchResults, selectNode],
  );

  const handleSearchKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSearchActiveIndex((i) => Math.min(searchResults.length - 1, i + 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSearchActiveIndex((i) => Math.max(0, i - 1));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (searchResults.length > 0) focusSearchResult(searchActiveIndex);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    },
    [focusSearchResult, searchActiveIndex, searchResults.length],
  );

  // global shortcuts while the atlas is open
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && document.activeElement !== searchInputRef.current) {
        onClose();
      }
      if (event.key === '/' && document.activeElement !== searchInputRef.current) {
        event.preventDefault();
        if (isMobileRef.current) setShowIndex(true);
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  /* ------------------------------------------------------------ */
  /* Derived UI state                                              */
  /* ------------------------------------------------------------ */

  const detailNode = focusedNode ?? hoveredNode;
  const dark = isDarkMode;
  const query = searchQuery.trim();
  const matchCount = query ? searchResults.length : 0;

  const detailConnections = detailNode
    ? (adjacencyRef.current.get(detailNode.id) ?? [])
        .slice()
        .sort((a, b) => b.weight - a.weight)
        .slice(0, isMobile ? 8 : 5)
        .map((edge) => {
          const otherId = edge.source === detailNode.id ? edge.target : edge.source;
          const other = nodeByIdRef.current.get(otherId);
          return other ? { node: other, kind: edge.kind, rationale: edge.rationale } : null;
        })
        .filter(
          (entry): entry is {
            node: SimNode;
            kind: GraphEdgeData['kind'];
            rationale: string;
          } => Boolean(entry),
        )
    : [];

  const visitedCount = nodesRef.current.filter((node) => visitedRef.current.has(node.path)).length;
  const reviewDueCount = nodesRef.current.filter(
    (node) => node.reviewState === 'due' || node.reviewState === 'stale' || node.reviewState === 'unknown',
  ).length;
  void visitedVersion;

  /* ------------------------------------------------------------ */
  /* Style tokens                                                  */
  /* ------------------------------------------------------------ */

  const chrome = dark
    ? {
        panel: 'bg-[#0c1220]/92 border-[#1a2540]',
        panelStrong: 'bg-[#0c1220]/96 border-[#22304f]',
        btn: 'border-[#1a2540] bg-[#0c1220]/90 text-slate-300 hover:text-white hover:border-[#31436b] hover:bg-[#111a2b]',
        btnActive: 'border-cyan-400/60 bg-cyan-400/10 text-cyan-300',
        text: 'text-slate-100',
        sub: 'text-slate-400',
        faint: 'text-slate-500',
        rule: 'border-[#1a2540]',
        input: 'border-[#1a2540] bg-[#0a0f1c] text-slate-100 placeholder:text-slate-600',
        rowHover: 'hover:bg-white/[0.04]',
      }
    : {
        panel: 'bg-white/92 border-[#d9dbd2]',
        panelStrong: 'bg-white/96 border-[#c8cabf]',
        btn: 'border-[#d9dbd2] bg-white/90 text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 hover:bg-white',
        btnActive: 'border-neutral-900 bg-neutral-900/5 text-neutral-900',
        text: 'text-neutral-900',
        sub: 'text-neutral-500',
        faint: 'text-neutral-400',
        rule: 'border-[#e3e4dc]',
        input: 'border-[#d9dbd2] bg-[#f5f6f2] text-neutral-900 placeholder:text-neutral-400',
        rowHover: 'hover:bg-black/[0.03]',
      };

  const monoClass = 'kg-mono';

  /* ------------------------------------------------------------ */
  /* Render                                                        */
  /* ------------------------------------------------------------ */

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 overflow-hidden">
      {/* backdrop — canvas paints over this */}
      <div className={`absolute inset-0 ${dark ? 'bg-[#050810]' : 'bg-[#f5f6f2]'}`} />
      {dark && <div className="kg-scanlines absolute inset-0 pointer-events-none" aria-hidden />}

      {/* ------------ header ------------ */}
      <header className="absolute top-0 inset-x-0 z-20 pointer-events-none">
        {isMobile ? (
          <div className="pointer-events-none flex items-center justify-between gap-3 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <div className={`min-w-0 rounded-xl border px-4 py-3 backdrop-blur-md ${chrome.panel}`}>
              <h2 className={`text-[19px] font-semibold leading-tight ${chrome.text}`}>Knowledge Graph</h2>
              <p className={`mt-1 flex items-center gap-2 text-[11px] tabular-nums ${chrome.sub}`}>
                <span>{nodeCount} nodes · {edgeCount} links</span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      reviewDueCount === 0 ? 'bg-cyan-400' : 'bg-amber-400'
                    }`}
                  />
                  {reviewDueCount === 0 ? 'Current' : `${reviewDueCount} due`}
                </span>
              </p>
            </div>
            <button
              type="button"
              aria-label="Close knowledge graph"
              onClick={onClose}
              className={`pointer-events-auto inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-[13px] font-medium backdrop-blur-md ${chrome.btn}`}
            >
              <X className="h-[18px] w-[18px]" aria-hidden />
              Close
            </button>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-3 p-4 pt-[max(1rem,env(safe-area-inset-top))]">
            <div className={`pointer-events-auto border backdrop-blur-md px-4 py-3 ${chrome.panel} rounded-md`}>
              <p className={`${monoClass} text-[9px] tracking-[0.28em] ${chrome.faint}`}>
                CODEX / SYSTEM ATLAS
              </p>
              <h2 className={`mt-1 text-lg font-semibold leading-none ${chrome.text}`}>
                Knowledge Graph
              </h2>
              <p className={`mt-1.5 ${monoClass} text-[10px] tracking-[0.08em] tabular-nums ${chrome.sub}`}>
                {String(nodeCount).padStart(3, '0')} NODES · {String(edgeCount).padStart(3, '0')} EDGES
                {visitedCount > 0 && ` · ${visitedCount} READ`}
              </p>
              <p className={`mt-1 flex items-center gap-1.5 ${monoClass} text-[9px] tracking-[0.18em] ${chrome.faint}`}>
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    graphMeta.source === 'corpus' ? 'bg-emerald-400' : 'bg-cyan-400'
                  } ${reducedMotionRef.current ? '' : 'animate-pulse'}`}
                />
                {graphMeta.source === 'corpus' ? 'CORPUS MAP' : 'LIVE DB'}
                <span aria-hidden>·</span>
                {reviewDueCount === 0 ? 'REVIEWS CURRENT' : `${reviewDueCount} REVIEWS DUE`}
              </p>
            </div>

            <nav className="pointer-events-auto flex flex-col gap-1.5" aria-label="Atlas controls">
            <button
              type="button"
              aria-label="Close knowledge graph"
              title="Close (Esc)"
              onClick={onClose}
              className={`kg-btn border backdrop-blur-md rounded-md ${chrome.btn}`}
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Toggle territory index"
              title="Territory index"
              onClick={() => setShowIndex((v) => !v)}
              className={`kg-btn border backdrop-blur-md rounded-md ${
                showIndex || (!isMobile && showIndex) ? chrome.btnActive : chrome.btn
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              title="Zoom in"
              onClick={handleZoomIn}
              className={`kg-btn border backdrop-blur-md rounded-md ${chrome.btn}`}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Zoom out"
              title="Zoom out"
              onClick={handleZoomOut}
              className={`hidden sm:inline-flex kg-btn border backdrop-blur-md rounded-md ${chrome.btn}`}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Fit graph to view"
              title="Fit to view"
              onClick={fitToView}
              className={`hidden sm:inline-flex kg-btn border backdrop-blur-md rounded-md ${chrome.btn}`}
            >
              <Scan className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Reset view"
              title="Reset view"
              onClick={resetView}
              className={`kg-btn border backdrop-blur-md rounded-md ${chrome.btn}`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            </nav>
          </div>
        )}
      </header>

      {/* ------------ territory index ------------ */}
      {isDesktopIndexVisible && (
        <aside
          aria-label={isMobile ? 'Explore knowledge graph' : 'Territory index'}
          className={`absolute z-30 flex flex-col border backdrop-blur-md ${chrome.panelStrong} ${
            isMobile
              ? 'inset-x-3 bottom-[calc(1rem+env(safe-area-inset-bottom))] top-[6.5rem] overflow-hidden rounded-2xl'
              : 'left-4 top-[7.5rem] w-[19rem] max-h-[calc(100%-10rem)] rounded-md'
          }`}
        >
          {isMobile && (
            <div className={`flex min-h-14 items-center justify-between border-b px-4 ${chrome.rule}`}>
              <div>
                <h3 className={`text-[16px] font-semibold ${chrome.text}`}>Explore graph</h3>
                <p className={`text-[11px] ${chrome.sub}`}>Search documents or filter a territory.</p>
              </div>
              <button
                type="button"
                aria-label="Close graph explorer"
                onClick={() => setShowIndex(false)}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${chrome.btn}`}
              >
                <X className="h-[18px] w-[18px]" aria-hidden />
              </button>
            </div>
          )}
          {/* search */}
          <div className={`p-3 border-b ${chrome.rule}`}>
            <div className={`flex min-h-12 items-center gap-2.5 rounded-xl border px-3 ${chrome.input}`}>
              <Search className={`h-4 w-4 shrink-0 ${chrome.faint}`} />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search the codex…"
                aria-label="Search nodes"
                className={`w-full bg-transparent outline-none text-[13px] ${monoClass} tracking-[0.02em]`}
              />
              {query && (
                <span className={`${monoClass} text-[9px] tabular-nums shrink-0 ${chrome.faint}`}>
                  {matchCount}
                </span>
              )}
            </div>

            {query && (
              <ul className="mt-2 max-h-44 overflow-y-auto kg-scroll" role="listbox" aria-label="Search results">
                {searchResults.length === 0 && (
                  <li className={`px-2 py-2 text-xs ${chrome.faint}`}>No matches in the codex.</li>
                )}
                {searchResults.map((node, index) => (
                  <li key={node.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={index === searchActiveIndex}
                      onMouseEnter={() => setSearchActiveIndex(index)}
                      onClick={() => {
                        selectNode(node, true);
                        if (isMobile) setShowIndex(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2 rounded text-left ${isMobile ? 'min-h-11' : 'py-1.5'} ${
                        index === searchActiveIndex ? (dark ? 'bg-white/[0.07]' : 'bg-black/[0.06]') : ''
                      }`}
                    >
                      <GlyphSwatch category={node.category} dark={dark} />
                      <span className={`min-w-0 flex-1 truncate text-[12px] ${chrome.text}`}>
                        {node.title}
                      </span>
                      <span className={`${monoClass} text-[8px] tracking-[0.14em] uppercase shrink-0 ${chrome.faint}`}>
                        {formatCategory(node.category)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* territories */}
          <div className="flex-1 overflow-y-auto kg-scroll py-1" onMouseLeave={() => { spotlightCategoryRef.current = null; }}>
            <p className={`px-3 pt-2 pb-1 ${monoClass} text-[9px] tracking-[0.24em] ${chrome.faint}`}>
              TERRITORIES
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategories(null);
                if (isMobile) setShowIndex(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 text-left border-l-2 ${isMobile ? 'min-h-11' : 'py-2'} ${
                activeCategories === null
                  ? dark
                    ? 'border-cyan-400 bg-white/[0.05]'
                    : 'border-neutral-900 bg-black/[0.04]'
                  : 'border-transparent'
              } ${chrome.rowHover}`}
            >
              <span className={`${monoClass} text-[10px] tracking-[0.06em] flex-1 ${chrome.text}`}>
                All territories
              </span>
              <span className={`${monoClass} text-[9px] tabular-nums ${chrome.faint}`}>{nodeCount}</span>
            </button>
            {categoryList.map((category) => {
              const active = activeCategories?.has(category) ?? false;
              const dimmed = activeCategories !== null && !active;
              const color = categoryColor(category, dark);
              const count = categoryCounts.get(category) ?? 0;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    toggleCategory(category);
                    if (isMobile) setShowIndex(false);
                  }}
                  onMouseEnter={() => { spotlightCategoryRef.current = category; }}
                  className={`w-full flex items-center gap-2.5 px-3 text-left border-l-2 ${isMobile ? 'min-h-11' : 'py-2'} ${chrome.rowHover} ${
                    active ? '' : 'border-transparent'
                  } ${dimmed ? 'opacity-40' : ''}`}
                  style={active ? { borderLeftColor: color, background: `${color}14` } : undefined}
                >
                  <GlyphSwatch category={category} dark={dark} />
                  <span className={`${monoClass} text-[10px] tracking-[0.06em] flex-1 truncate ${chrome.text}`}>
                    {formatCategory(category)}
                  </span>
                  <span className={`${monoClass} text-[9px] tabular-nums ${chrome.faint}`}>
                    {String(count).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* legend */}
          <div className={`${isMobile ? 'hidden' : 'block'} border-t ${chrome.rule} px-3 py-2`}>
            <p className={`${monoClass} text-[8.5px] leading-relaxed tracking-[0.08em] ${chrome.faint}`}>
              SOLID — HIERARCHY · FLOWING — BRIDGES · DOTTED — RELATED
            </p>
          </div>
        </aside>
      )}

      {/* ------------ detail card ------------ */}
      {detailNode && (
        <section
          aria-label="Node details"
          role={isMobile ? 'dialog' : undefined}
          className={`absolute overflow-y-auto kg-scroll border backdrop-blur-md ${chrome.panelStrong} ${
            isMobile
              ? 'inset-x-0 bottom-0 z-40 max-h-[64dvh] rounded-t-[1.5rem] border-b-0 shadow-[0_-24px_80px_rgba(0,0,0,0.38)]'
              : 'z-20 left-[21.5rem] bottom-[max(1rem,env(safe-area-inset-bottom))] w-[22rem] max-h-[calc(100%-8rem)] rounded-md'
          }`}
        >
          <div
            className="h-[3px] w-full"
            style={{ backgroundColor: categoryColor(detailNode.category, dark) }}
          />
          {isMobile && <div className={`mx-auto mt-2 h-1 w-10 rounded-full ${dark ? 'bg-slate-600' : 'bg-neutral-300'}`} aria-hidden />}
          <div className={isMobile ? 'px-4 pb-0 pt-3' : 'p-4'}>
            <div className="flex items-center gap-2">
              <GlyphSwatch category={detailNode.category} dark={dark} />
              <span className={`${monoClass} text-[9px] tracking-[0.22em] uppercase ${chrome.sub}`}>
                {formatCategory(detailNode.category)}
              </span>
              {detailNode.isHub && (
                <span
                  className={`${monoClass} text-[8px] tracking-[0.16em] px-1.5 py-0.5 border rounded-sm ${
                    dark ? 'border-[#2a3a5f] text-slate-400' : 'border-neutral-300 text-neutral-500'
                  }`}
                >
                  HUB
                </span>
              )}
              <span
                className={`${monoClass} text-[8px] tracking-[0.16em] px-1.5 py-0.5 border rounded-sm ${
                  detailNode.reviewState === 'current'
                    ? dark
                      ? 'border-emerald-400/40 text-emerald-300'
                      : 'border-emerald-600/30 text-emerald-700'
                    : detailNode.reviewState === 'due'
                      ? dark
                        ? 'border-amber-400/40 text-amber-300'
                        : 'border-amber-600/30 text-amber-700'
                      : dark
                        ? 'border-rose-400/40 text-rose-300'
                        : 'border-rose-600/30 text-rose-700'
                }`}
              >
                {detailNode.reviewState.toUpperCase()}
              </span>
              {!isMobile && (
                <span className={`ml-auto ${monoClass} text-[9px] tabular-nums ${chrome.faint}`}>
                  {String(detailNode.degree).padStart(2, '0')} LINKS
                </span>
              )}
              {isMobile && (
                <button
                  type="button"
                  aria-label="Close document details"
                  onClick={clearFocus}
                  className={`ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${chrome.btn}`}
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              )}
            </div>

            <h3 className={`mt-2.5 font-semibold leading-tight ${isMobile ? 'text-[22px]' : 'text-lg'} ${chrome.text}`}>
              {detailNode.title}
            </h3>
            <p className={`mt-1 ${monoClass} ${isMobile ? 'text-[11px]' : 'text-[10px]'} tracking-[0.04em] truncate ${chrome.faint}`}>
              {detailNode.path}
            </p>
            <div className="mt-3">
              <p className={`${monoClass} ${isMobile ? 'text-[10px]' : 'text-[8.5px]'} tracking-[0.2em] ${chrome.faint}`}>OUTCOME</p>
              <p className={`mt-1.5 leading-relaxed ${isMobile ? 'text-[14px]' : 'text-[13px]'} ${chrome.sub}`}>{detailNode.outcome}</p>
            </div>

            <div className={`mt-3 pt-3 border-t ${chrome.rule}`}>
              <p className={`${monoClass} ${isMobile ? 'text-[10px]' : 'text-[8.5px]'} tracking-[0.2em] ${chrome.faint}`}>NEXT MOVE</p>
              <p className={`mt-1.5 leading-relaxed ${isMobile ? 'text-[14px]' : 'text-[12px]'} ${chrome.text}`}>{detailNode.nextAction}</p>
              <p className={`mt-2 ${monoClass} ${isMobile ? 'text-[10px]' : 'text-[8.5px]'} tracking-[0.2em] ${chrome.faint}`}>
                PROOF
              </p>
              <p className={`mt-1 leading-relaxed ${isMobile ? 'text-[12px]' : 'text-[10.5px]'} ${chrome.sub}`}>{detailNode.proof}</p>
            </div>

            {detailConnections.length > 0 && (!isMobile || connectionsExpanded) && (
              <div className={`mt-3 border-t pt-3 ${chrome.rule}`}>
                {!isMobile && (
                  <p className={`${monoClass} text-[8.5px] tracking-[0.24em] ${chrome.faint}`}>CONNECTIONS</p>
                )}
                {(!isMobile || connectionsExpanded) && (
                  <ul className="mt-1.5">
                    {detailConnections.map(({ node, kind, rationale }) => (
                      <li key={node.id}>
                        <button
                          type="button"
                          onClick={() => selectNode(node, true)}
                          className={`group grid min-h-11 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2 gap-y-0.5 rounded px-1.5 py-1.5 text-left ${chrome.rowHover}`}
                        >
                          <GlyphSwatch category={node.category} dark={dark} small />
                          <span className={`min-w-0 flex-1 truncate text-[12px] ${chrome.text} ${visitedRef.current.has(node.path) ? 'line-through opacity-50' : ''}`}>
                            {node.title}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className={`${monoClass} text-[8px] tracking-[0.12em] uppercase shrink-0 ${chrome.faint}`}>
                              {kind}
                            </span>
                            <ArrowUpRight className={`w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${chrome.faint}`} />
                          </span>
                          <span className={`col-start-2 col-span-2 line-clamp-2 text-[10px] leading-snug ${chrome.faint}`}>
                            {rationale}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className={`${isMobile ? `sticky bottom-0 -mx-4 mt-3 border-t px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 ${chrome.rule} ${dark ? 'bg-[#0c1220]' : 'bg-white'}` : 'mt-4 flex items-center gap-2'}`}>
              {isMobile && detailConnections.length > 0 && (
                <button
                  type="button"
                  aria-expanded={connectionsExpanded}
                  onClick={() => setConnectionsExpanded((expanded) => !expanded)}
                  className={`mb-2 flex min-h-11 w-full items-center gap-3 rounded-xl px-1 text-left ${chrome.rowHover}`}
                >
                  <Layers className={`h-[18px] w-[18px] ${chrome.sub}`} aria-hidden />
                  <span className={`flex-1 text-[14px] font-medium ${chrome.text}`}>
                    {detailConnections.length} connections
                  </span>
                  {connectionsExpanded ? (
                    <ChevronUp className={`h-5 w-5 ${chrome.sub}`} aria-hidden />
                  ) : (
                    <ChevronDown className={`h-5 w-5 ${chrome.sub}`} aria-hidden />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => openNode(detailNode)}
                className={`group inline-flex min-h-12 w-full flex-1 items-center justify-center gap-2 rounded-xl px-3 text-[14px] font-semibold transition-colors ${
                  dark
                    ? 'bg-slate-100 text-[#0c1220] hover:bg-white'
                    : 'bg-neutral-900 text-white hover:bg-black'
                }`}
              >
                {isMobile ? 'Open full document' : 'Open document'}
                <span className="relative w-4 h-4 overflow-hidden" aria-hidden>
                  <ArrowRight className="absolute inset-0 w-4 h-4 transition-transform duration-200 group-hover:translate-x-4" />
                  <ArrowRight className="absolute inset-0 w-4 h-4 -translate-x-4 transition-transform duration-200 group-hover:translate-x-0" />
                </span>
              </button>
              {!isMobile && focusedNode && (
                <button
                  type="button"
                  onClick={clearFocus}
                  className={`kg-btn border rounded-md px-3 text-[13px] ${chrome.btn}`}
                >
                  Clear
                </button>
              )}
            </div>

            {!isMobile && (
              <p className={`mt-3 ${monoClass} text-[8.5px] tracking-[0.1em] ${chrome.faint}`}>
                SCROLL ZOOM · DRAG PAN · DOUBLE-CLICK TO OPEN · / TO SEARCH
              </p>
            )}
          </div>
        </section>
      )}

      {isMobile && !detailNode && !showIndex && !isLoading && (
        <nav
          aria-label="Mobile graph controls"
          className={`absolute inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 grid grid-cols-3 overflow-hidden rounded-2xl border backdrop-blur-md ${chrome.panelStrong}`}
        >
          <button
            type="button"
            onClick={openMobileSearch}
            className={`flex min-h-[58px] flex-col items-center justify-center gap-1 text-[11px] font-medium ${chrome.text} ${chrome.rowHover}`}
          >
            <Search className="h-5 w-5 text-cyan-400" aria-hidden />
            Search
          </button>
          <button
            type="button"
            onClick={fitToView}
            className={`flex min-h-[58px] flex-col items-center justify-center gap-1 border-x text-[11px] font-medium ${chrome.rule} ${chrome.text} ${chrome.rowHover}`}
          >
            <Scan className="h-5 w-5 text-cyan-400" aria-hidden />
            Recenter
          </button>
          <button
            type="button"
            onClick={() => setShowIndex(true)}
            className={`flex min-h-[58px] flex-col items-center justify-center gap-1 text-[11px] font-medium ${chrome.text} ${chrome.rowHover}`}
          >
            <Layers className="h-5 w-5 text-cyan-400" aria-hidden />
            Territories
          </button>
        </nav>
      )}

      {/* ------------ hint when idle ------------ */}
      {!isMobile && !detailNode && !isDesktopIndexVisible && !isLoading && (
        <div
          className={`absolute z-10 left-3 right-3 sm:left-auto sm:right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] border backdrop-blur-md rounded-md px-3.5 py-2.5 ${chrome.panel}`}
        >
          <p className={`${monoClass} text-[9px] tracking-[0.14em] ${chrome.faint}`}>
            HOVER A NODE TO INSPECT · / TO SEARCH
          </p>
        </div>
      )}

      {/* ------------ loading ------------ */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className={`flex flex-col items-center gap-5 p-8 border backdrop-blur-md rounded-md ${chrome.panelStrong}`}>
            <div className="kg-radar" aria-hidden />
            <div className="text-center">
              <p className={`${monoClass} text-[10px] tracking-[0.3em] ${chrome.sub}`}>CHARTING THE CODEX</p>
              <p className={`mt-1.5 ${monoClass} text-[8.5px] tracking-[0.16em] ${chrome.faint}`}>
                RESOLVING TERRITORIES…
              </p>
            </div>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        aria-label="Knowledge graph canvas"
        className={`absolute inset-0 touch-none ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700 cursor-grab active:cursor-grabbing`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Glyph swatch — canvas shapes echoed in the DOM chrome               */
/* ------------------------------------------------------------------ */

function GlyphSwatch({ category, dark, small = false }: { category: string; dark: boolean; small?: boolean }) {
  const color = categoryColor(category, dark);
  const shape = categoryShape(category);
  const size = small ? 10 : 12;
  const c = size / 2;
  const r = size / 2 - 1;

  const polygon = (sides: number, rotation: number) =>
    Array.from({ length: sides }, (_, i) => {
      const angle = rotation + (i / sides) * TAU;
      return `${c + Math.cos(angle) * r},${c + Math.sin(angle) * r}`;
    }).join(' ');

  let element: React.ReactNode;
  switch (shape) {
    case 'starburst':
      element = (
        <polygon
          points={Array.from({ length: 16 }, (_, i) => {
            const radius = i % 2 === 0 ? r : r * 0.45;
            const angle = (i / 16) * TAU - Math.PI / 2;
            return `${c + Math.cos(angle) * radius},${c + Math.sin(angle) * radius}`;
          }).join(' ')}
          fill={color}
        />
      );
      break;
    case 'hexagon':
      element = <polygon points={polygon(6, 0)} fill={color} />;
      break;
    case 'diamond':
      element = <polygon points={polygon(4, -Math.PI / 2)} fill={color} />;
      break;
    case 'triangle':
      element = <polygon points={polygon(3, -Math.PI / 2)} fill={color} />;
      break;
    case 'pentagon':
      element = <polygon points={polygon(5, -Math.PI / 2)} fill={color} />;
      break;
    case 'square':
      element = <rect x={c - r * 0.8} y={c - r * 0.8} width={r * 1.6} height={r * 1.6} fill={color} />;
      break;
    case 'plus':
      element = (
        <g fill={color}>
          <rect x={c - r * 0.28} y={c - r * 0.95} width={r * 0.56} height={r * 1.9} />
          <rect x={c - r * 0.95} y={c - r * 0.28} width={r * 1.9} height={r * 0.56} />
        </g>
      );
      break;
    case 'ring':
      element = <circle cx={c} cy={c} r={r * 0.7} fill="none" stroke={color} strokeWidth={r * 0.55} />;
      break;
    case 'lens':
      element = (
        <path
          d={`M ${c + Math.cos(0.15 * Math.PI) * r} ${c + Math.sin(0.15 * Math.PI) * r} A ${r} ${r} 0 1 1 ${c + Math.cos(-0.15 * Math.PI) * r} ${c + Math.sin(-0.15 * Math.PI) * r} Z`}
          fill={color}
          transform={`rotate(-90 ${c} ${c})`}
        />
      );
      break;
    default:
      element = <circle cx={c} cy={c} r={r} fill={color} />;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" aria-hidden>
      {element}
    </svg>
  );
}
