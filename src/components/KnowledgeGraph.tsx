import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Filter,
  Loader2,
  Maximize2,
  RefreshCw,
  Search,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

import { useIsMobileLayout } from '../hooks/useMediaQuery';
import {
  GRAPH_CATEGORY_COLORS,
  buildKnowledgeGraph,
  getConnectedNodeIds,
  type GraphEdgeData,
  type GraphNodeData,
  type KnowledgeGraphData,
} from '../lib/knowledgeGraph';
import { getDocumentLinks, getDocuments } from '../lib/supabase';

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
}

interface PointerState {
  id: number;
  x: number;
  y: number;
}

function nodeRadius(node: GraphNodeData, isMobile: boolean): number {
  const base = isMobile ? 7 : 8;
  if (node.path === '/codex') return base + 8;
  if (node.isHub) return base + 4 + Math.min(node.childCount, 5);
  return base + Math.min(node.degree, 4) * 0.45;
}

function edgeStyle(
  kind: GraphEdgeData['kind'],
  darkMode: boolean,
): { color: string; width: number; dash?: number[] } {
  if (kind === 'hierarchy') {
    return {
      color: darkMode ? 'rgba(148, 163, 184, 0.55)' : 'rgba(100, 116, 139, 0.45)',
      width: 1.6,
    };
  }
  if (kind === 'bridges') {
    return {
      color: darkMode ? 'rgba(96, 165, 250, 0.55)' : 'rgba(37, 99, 235, 0.4)',
      width: 1.4,
      dash: [6, 5],
    };
  }
  if (kind === 'related') {
    return {
      color: darkMode ? 'rgba(167, 139, 250, 0.45)' : 'rgba(124, 58, 237, 0.35)',
      width: 1.2,
      dash: [3, 4],
    };
  }
  return {
    color: darkMode ? 'rgba(75, 85, 99, 0.35)' : 'rgba(156, 163, 175, 0.35)',
    width: 1,
  };
}

export function KnowledgeGraph({
  isOpen,
  onClose,
  onSelectDocument,
  isDarkMode,
}: KnowledgeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const edgesRef = useRef<GraphEdgeData[]>([]);
  const zoomRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
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
  const [showFilters, setShowFilters] = useState(false);

  isDarkModeRef.current = isDarkMode;
  isMobileRef.current = isMobile;
  activeCategoriesRef.current = activeCategories;
  searchQueryRef.current = searchQuery;

  const categoryList = useMemo(() => graphMeta.categories, [graphMeta.categories]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    let mounted = true;

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
      const categories = [...new Set(nodes.map((node) => node.category))];
      const centerX = width / 2;
      const centerY = height / 2;
      const orbit = Math.min(width, height) * (isMobileRef.current ? 0.28 : 0.34);

      return nodes.map((node) => {
        const categoryIndex = Math.max(0, categories.indexOf(node.category));
        const categoryAngle = (categoryIndex / Math.max(categories.length, 1)) * Math.PI * 2;
        const depthFactor = Math.max(0.2, Math.min(1, node.depth / 4));
        const jitter = (Math.random() - 0.5) * 36;
        const radius = orbit * (0.25 + depthFactor) + jitter;
        return {
          ...node,
          x: centerX + Math.cos(categoryAngle) * radius + (Math.random() - 0.5) * 24,
          y: centerY + Math.sin(categoryAngle) * radius + (Math.random() - 0.5) * 24,
          vx: 0,
          vy: 0,
          radius: nodeRadius(node, isMobileRef.current),
        };
      });
    };

    const loadData = async () => {
      initCanvas();
      setIsLoading(true);

      try {
        const [docs, links] = await Promise.all([getDocuments(), getDocumentLinks()]);
        if (!mounted) return;

        const graph = buildKnowledgeGraph(docs, links ?? []);
        const { width, height } = dimensionsRef.current;
        nodesRef.current = placeNodes(graph.nodes, width, height);
        edgesRef.current = graph.edges;
        setNodeCount(graph.nodes.length);
        setEdgeCount(graph.edges.length);
        setGraphMeta({ source: graph.source, categories: graph.categories });
        setActiveCategories(null);
        setFocusedNode(null);
        focusedNodeRef.current = null;
        zoomRef.current = isMobileRef.current ? 0.85 : 1;
        offsetRef.current = { x: 0, y: 0 };
        setIsLoading(false);
        startAnimation();
      } catch (error) {
        console.error('Failed to load graph:', error);
        if (!mounted) return;
        const graph = buildKnowledgeGraph([]);
        const { width, height } = dimensionsRef.current;
        nodesRef.current = placeNodes(graph.nodes, width, height);
        edgesRef.current = graph.edges;
        setNodeCount(graph.nodes.length);
        setEdgeCount(graph.edges.length);
        setGraphMeta({ source: graph.source, categories: graph.categories });
        setIsLoading(false);
        startAnimation();
      }
    };

    const isNodeVisible = (node: SimNode) => {
      const categories = activeCategoriesRef.current;
      if (categories && categories.size > 0 && !categories.has(node.category)) {
        return false;
      }
      const query = searchQueryRef.current.trim().toLowerCase();
      if (!query) return true;
      return (
        node.title.toLowerCase().includes(query) ||
        node.path.toLowerCase().includes(query) ||
        node.category.toLowerCase().includes(query)
      );
    };

    const simulate = () => {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      if (nodes.length === 0) return;

      const { width, height } = dimensionsRef.current;
      const centerX = width / 2;
      const centerY = height / 2;
      const visible = nodes.filter(isNodeVisible);
      const visibleIds = new Set(visible.map((node) => node.id));

      visible.forEach((node) => {
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        node.vx += dx * 0.0008;
        node.vy += dy * 0.0008;
      });

      for (let i = 0; i < visible.length; i += 1) {
        for (let j = i + 1; j < visible.length; j += 1) {
          const a = visible[i];
          const b = visible[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = a.radius + b.radius + (a.isHub || b.isHub ? 42 : 28);
          if (dist < minDist) {
            const force = ((minDist - dist) / dist) * 0.12;
            a.vx -= dx * force;
            a.vy -= dy * force;
            b.vx += dx * force;
            b.vy += dy * force;
          } else if (dist < 180) {
            const force = 0.01 / dist;
            a.vx -= dx * force;
            a.vy -= dy * force;
            b.vx += dx * force;
            b.vy += dy * force;
          }
        }
      }

      edges.forEach((edge) => {
        if (!visibleIds.has(edge.source) || !visibleIds.has(edge.target)) return;
        const source = nodes.find((node) => node.id === edge.source);
        const target = nodes.find((node) => node.id === edge.target);
        if (!source || !target) return;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const ideal =
          edge.kind === 'hierarchy' ? 78 : edge.kind === 'bridges' ? 120 : edge.kind === 'related' ? 110 : 64;
        const force = ((dist - ideal) / dist) * 0.012 * edge.weight;
        source.vx += dx * force;
        source.vy += dy * force;
        target.vx -= dx * force;
        target.vy -= dy * force;
      });

      const dragging = draggingNodeRef.current;
      nodes.forEach((node) => {
        if (node === dragging || !visibleIds.has(node.id)) return;
        node.vx *= 0.86;
        node.vy *= 0.86;
        node.x += node.vx;
        node.y += node.vy;
        node.x = Math.max(24, Math.min(width - 24, node.x));
        node.y = Math.max(24, Math.min(height - 24, node.y));
      });
    };

    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const { width, height } = dimensionsRef.current;
      const currentZoom = zoomRef.current;
      const currentOffset = offsetRef.current;
      const darkMode = isDarkModeRef.current;
      const dpr = window.devicePixelRatio || 1;
      const hovered = hoveredNodeRef.current;
      const focused = focusedNodeRef.current;
      const connected = focused ? getConnectedNodeIds(focused.id, edges) : null;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        20,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.7,
      );
      gradient.addColorStop(0, darkMode ? 'rgba(30, 41, 59, 0.55)' : 'rgba(226, 232, 240, 0.7)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.translate(currentOffset.x + width / 2, currentOffset.y + height / 2);
      ctx.scale(currentZoom, currentZoom);
      ctx.translate(-width / 2, -height / 2);

      const visibleNodes = nodes.filter(isNodeVisible);
      const visibleIds = new Set(visibleNodes.map((node) => node.id));

      edges.forEach((edge) => {
        if (!visibleIds.has(edge.source) || !visibleIds.has(edge.target)) return;
        const source = nodes.find((node) => node.id === edge.source);
        const target = nodes.find((node) => node.id === edge.target);
        if (!source || !target) return;

        const isHot =
          !connected ||
          (connected.has(edge.source) && connected.has(edge.target));
        const style = edgeStyle(edge.kind, darkMode);

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = isHot ? style.color : darkMode ? 'rgba(55,65,81,0.12)' : 'rgba(148,163,184,0.12)';
        ctx.lineWidth = style.width;
        ctx.setLineDash(style.dash ?? []);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      visibleNodes.forEach((node) => {
        const color = GRAPH_CATEGORY_COLORS[node.category] || '#64748b';
        const isHovered = hovered?.id === node.id;
        const isFocused = focused?.id === node.id;
        const isDimmed = Boolean(connected && !connected.has(node.id));
        const radius = node.radius * (isHovered || isFocused ? 1.45 : 1);

        ctx.globalAlpha = isDimmed ? 0.18 : 1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 2.8, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2.8);
        glow.addColorStop(0, `${color}55`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        if (isHovered || isFocused || node.isHub) {
          ctx.strokeStyle = darkMode ? '#f8fafc' : '#0f172a';
          ctx.lineWidth = isFocused ? 2.4 : 1.5;
          ctx.stroke();
        }

        const showLabel =
          isHovered ||
          isFocused ||
          node.isHub ||
          currentZoom > (isMobileRef.current ? 0.95 : 0.75) ||
          Boolean(searchQueryRef.current.trim());

        if (showLabel && !isDimmed) {
          const fontSize = Math.max(10, (isMobileRef.current ? 11 : 12) / currentZoom);
          ctx.font = `${node.isHub ? 600 : 500} ${fontSize}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = darkMode ? '#f8fafc' : '#0f172a';
          const label =
            node.title.length > 28 && !isHovered && !isFocused
              ? `${node.title.slice(0, 26)}…`
              : node.title;
          ctx.fillText(label, node.x, node.y + radius + 5);
        }

        ctx.globalAlpha = 1;
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

    window.addEventListener('resize', handleResize);

    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isOpen]);

  const getNodeAtPosition = useCallback((clientX: number, clientY: number): SimNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const { width, height } = dimensionsRef.current;
    const currentZoom = zoomRef.current;
    const currentOffset = offsetRef.current;
    const x = (clientX - rect.left - currentOffset.x - width / 2) / currentZoom + width / 2;
    const y = (clientY - rect.top - currentOffset.y - height / 2) / currentZoom + height / 2;

    let best: SimNode | null = null;
    let bestDist = Infinity;

    for (const node of nodesRef.current) {
      const categories = activeCategoriesRef.current;
      if (categories && categories.size > 0 && !categories.has(node.category)) continue;
      const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      if (dist < node.radius * 3.2 && dist < bestDist) {
        best = node;
        bestDist = dist;
      }
    }

    return best;
  }, []);

  const updatePointerWorld = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const { width, height } = dimensionsRef.current;
    const currentZoom = zoomRef.current;
    const currentOffset = offsetRef.current;
    return {
      x: (clientX - rect.left - currentOffset.x - width / 2) / currentZoom + width / 2,
      y: (clientY - rect.top - currentOffset.y - height / 2) / currentZoom + height / 2,
    };
  }, []);

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
        focusedNodeRef.current = node;
        setFocusedNode(node);
        hoveredNodeRef.current = node;
        setHoveredNode(node);
      } else {
        isPanningRef.current = true;
        panStartRef.current = { x: event.clientX, y: event.clientY };
      }
    },
    [getNodeAtPosition],
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
        zoomRef.current = Math.max(0.35, Math.min(3.2, pinchStartRef.current.zoom * scale));
        return;
      }

      const dragging = draggingNodeRef.current;
      if (dragging) {
        const world = updatePointerWorld(event.clientX, event.clientY);
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
    [getNodeAtPosition, updatePointerWorld],
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
      if (node) {
        onSelectDocument(node.path);
        onClose();
      }
    },
    [getNodeAtPosition, onClose, onSelectDocument],
  );

  const handleWheel = useCallback((event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    zoomRef.current = Math.max(0.35, Math.min(3.2, zoomRef.current * delta));
  }, []);

  const handleZoomIn = useCallback(() => {
    zoomRef.current = Math.min(3.2, zoomRef.current * 1.2);
  }, []);

  const handleZoomOut = useCallback(() => {
    zoomRef.current = Math.max(0.35, zoomRef.current * 0.8);
  }, []);

  const resetView = useCallback(() => {
    zoomRef.current = isMobile ? 0.85 : 1;
    offsetRef.current = { x: 0, y: 0 };
    focusedNodeRef.current = null;
    setFocusedNode(null);
  }, [isMobile]);

  const openFocused = useCallback(() => {
    if (!focusedNode) return;
    onSelectDocument(focusedNode.path);
    onClose();
  }, [focusedNode, onClose, onSelectDocument]);

  const toggleCategory = useCallback((category: string) => {
    setActiveCategories((current) => {
      if (!current) {
        return new Set([category]);
      }
      const next = new Set(current);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next.size === 0 ? null : next;
    });
  }, []);

  if (!isOpen) return null;

  const detailNode = focusedNode ?? hoveredNode;
  const sourceLabel = graphMeta.source === 'corpus' ? 'Full Codex map' : 'Live database';

  return (
    <div ref={containerRef} className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 ${
          isDarkMode
            ? 'bg-[radial-gradient(ellipse_at_top,#1e293b_0%,#020617_55%)]'
            : 'bg-[radial-gradient(ellipse_at_top,#e2e8f0_0%,#f8fafc_55%)]'
        }`}
      />

      <div className="absolute top-0 inset-x-0 z-20 pointer-events-none">
        <div className="flex items-start justify-between gap-3 p-3 sm:p-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              aria-label="Close knowledge graph"
              onClick={onClose}
              className={`p-2.5 sm:p-3 rounded-2xl backdrop-blur-xl transition-all border ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                  : 'bg-white/80 hover:bg-white text-gray-900 border-gray-200/50 shadow-lg'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
            <div
              className={`min-w-0 px-3 py-2 sm:px-4 rounded-2xl backdrop-blur-xl border ${
                isDarkMode ? 'bg-white/10 border-white/10' : 'bg-white/80 border-gray-200/50 shadow-lg'
              }`}
            >
              <h2 className={`text-base sm:text-lg font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Knowledge Graph
              </h2>
              <p className={`text-[11px] sm:text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {nodeCount} nodes · {edgeCount} links · {sourceLabel}
              </p>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              aria-label="Toggle filters"
              onClick={() => setShowFilters((value) => !value)}
              className={`p-2.5 sm:p-3 rounded-2xl backdrop-blur-xl transition-all border ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                  : 'bg-white/80 hover:bg-white text-gray-900 border-gray-200/50 shadow-lg'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              onClick={handleZoomIn}
              className={`p-2.5 sm:p-3 rounded-2xl backdrop-blur-xl transition-all border ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                  : 'bg-white/80 hover:bg-white text-gray-900 border-gray-200/50 shadow-lg'
              }`}
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Zoom out"
              onClick={handleZoomOut}
              className={`hidden xs:inline-flex p-2.5 sm:p-3 rounded-2xl backdrop-blur-xl transition-all border sm:inline-flex ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                  : 'bg-white/80 hover:bg-white text-gray-900 border-gray-200/50 shadow-lg'
              }`}
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Reset view"
              onClick={resetView}
              className={`p-2.5 sm:p-3 rounded-2xl backdrop-blur-xl transition-all border ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                  : 'bg-white/80 hover:bg-white text-gray-900 border-gray-200/50 shadow-lg'
              }`}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div
          className={`absolute z-30 left-3 right-3 sm:left-4 sm:right-auto sm:w-[22rem] top-[5.5rem] sm:top-24 rounded-2xl backdrop-blur-xl border p-3 sm:p-4 ${
            isDarkMode ? 'bg-slate-950/90 border-white/10 text-white' : 'bg-white/95 border-gray-200 text-gray-900 shadow-xl'
          }`}
        >
          <div className={`flex items-center gap-2 rounded-xl px-3 py-2 border ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
            <Search className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search nodes…"
              className={`w-full bg-transparent outline-none text-sm ${isDarkMode ? 'placeholder:text-gray-500' : 'placeholder:text-gray-400'}`}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategories(null)}
              className={`px-2.5 py-1.5 rounded-full text-xs border ${
                activeCategories === null
                  ? isDarkMode
                    ? 'bg-white text-slate-900 border-white'
                    : 'bg-slate-900 text-white border-slate-900'
                  : isDarkMode
                    ? 'border-white/10 text-gray-300'
                    : 'border-gray-200 text-gray-600'
              }`}
            >
              All territories
            </button>
            {categoryList.map((category) => {
              const active = activeCategories?.has(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-2.5 py-1.5 rounded-full text-xs border inline-flex items-center gap-1.5 ${
                    active
                      ? isDarkMode
                        ? 'bg-white/15 border-white/20 text-white'
                        : 'bg-slate-900/5 border-slate-300 text-slate-900'
                      : isDarkMode
                        ? 'border-white/10 text-gray-300'
                        : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: GRAPH_CATEGORY_COLORS[category] || '#64748b' }}
                  />
                  {category.replace(/_/g, ' ')}
                </button>
              );
            })}
          </div>
          <p className={`mt-3 text-[11px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Solid = hierarchy · Dashed blue = bridges · Purple = related
          </p>
        </div>
      )}

      {detailNode && (
        <div
          className={`absolute z-20 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-sm bottom-[max(1rem,env(safe-area-inset-bottom))] rounded-2xl backdrop-blur-xl border p-4 ${
            isDarkMode ? 'bg-slate-950/90 border-white/10 text-white' : 'bg-white/95 border-gray-200 text-gray-900 shadow-xl'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: GRAPH_CATEGORY_COLORS[detailNode.category] || '#64748b' }}
            />
            <span className={`text-[11px] uppercase tracking-[0.14em] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {detailNode.category.replace(/_/g, ' ')}
            </span>
            {detailNode.isHub && (
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                hub
              </span>
            )}
          </div>
          <h3 className="font-semibold text-lg leading-tight">{detailNode.title}</h3>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{detailNode.path}</p>
          <p className={`text-sm mt-3 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {detailNode.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={openFocused}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
                isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
              Open document
            </button>
            {focusedNode && (
              <button
                type="button"
                onClick={() => {
                  focusedNodeRef.current = null;
                  setFocusedNode(null);
                }}
                className={`px-3 py-2.5 rounded-xl text-sm border ${
                  isDarkMode ? 'border-white/10 text-gray-300' : 'border-gray-200 text-gray-600'
                }`}
              >
                Clear
              </button>
            )}
          </div>
          <p className={`mt-2 text-[11px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {isMobile ? 'Pinch to zoom · drag to pan · tap a node to focus' : 'Scroll to zoom · drag to pan · double-click to open'}
          </p>
        </div>
      )}

      {!detailNode && !showFilters && (
        <div
          className={`absolute z-10 left-3 right-3 sm:left-auto sm:right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-4 rounded-2xl backdrop-blur-xl border p-3 sm:p-4 ${
            isDarkMode ? 'bg-white/10 border-white/10' : 'bg-white/90 border-gray-200/50 shadow-lg'
          }`}
        >
          <p className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Territories
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible">
            {categoryList.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs border ${
                  isDarkMode ? 'border-white/10 text-gray-300' : 'border-gray-200 text-gray-600'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: GRAPH_CATEGORY_COLORS[category] || '#64748b' }}
                />
                {category.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div
            className={`flex flex-col items-center gap-4 p-8 rounded-3xl backdrop-blur-xl border ${
              isDarkMode ? 'bg-white/10 border-white/10' : 'bg-white/90 border-gray-200/50 shadow-xl'
            }`}
          >
            <Loader2 className={`w-8 h-8 animate-spin ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>Mapping the Codex…</p>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 touch-none ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500 cursor-grab active:cursor-grabbing`}
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
