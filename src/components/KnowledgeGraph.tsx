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
  matchesGraphNodeQuery,
  type GraphEdgeData,
  type KnowledgeGraphData,
} from '../lib/knowledgeGraph';
import {
  categoryColor,
  categoryShape,
  createAtlasSpecks,
  formatCategory,
  loadVisited,
  persistVisited,
  TAU,
  type AtlasSpeck,
  type CameraAnim,
  type PointerState,
  type SimNode,
} from '../lib/knowledgeGraphAtlas';
import { drawAtlasFrame } from '../lib/knowledgeGraphCanvas';
import {
  ATLAS_MAX_ZOOM,
  ATLAS_MIN_ZOOM,
  clientToWorld,
  hitTestNode,
  offsetForWorldPoint,
  pinchZoomScale,
  pointerDistance,
  zoomTowardCursor,
} from '../lib/knowledgeGraphPointer';
import { placeSimNodes, stepSimulation } from '../lib/knowledgeGraphSimulation';
import { getDocumentLinks, getDocuments } from '../lib/supabase';
import { useToast } from '../hooks/useToast';

interface KnowledgeGraphProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument: (path: string) => void;
  isDarkMode: boolean;
}

export function KnowledgeGraph({
  isOpen,
  onClose,
  onSelectDocument,
  isDarkMode,
}: KnowledgeGraphProps) {
  const { error: toastError } = useToast();
  const toastErrorRef = useRef(toastError);
  toastErrorRef.current = toastError;
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
  const specksRef = useRef<AtlasSpeck[]>([]);
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
    return offsetForWorldPoint(worldX, worldY, zoom, screenX, screenY, width, height);
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
      ATLAS_MIN_ZOOM,
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

    specksRef.current = createAtlasSpecks();

    const initCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      dimensionsRef.current = { width: rect.width, height: rect.height };
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
      const simNodes = placeSimNodes(graph.nodes, width, height, isMobileRef.current);
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
      } catch {
        if (!mounted) return;
        toastErrorRef.current('Could not load graph', 'Showing an empty atlas.');
        applyGraph(buildKnowledgeGraph([]));
      }
      setIsLoading(false);
      startAnimation();
    };

    /* ---------------- simulation + drawing ---------------- */

    const simulate = () => {
      const { width, height } = dimensionsRef.current;
      stepSimulation({
        nodes: nodesRef.current,
        edges: edgesRef.current,
        byId: nodeByIdRef.current,
        width,
        height,
        dragging: draggingNodeRef.current,
        hoveredId: hoveredNodeRef.current?.id ?? null,
        focusedId: focusedNodeRef.current?.id ?? null,
      });
    };

    const draw = (now: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = dimensionsRef.current;
      const camera = drawAtlasFrame({
        ctx,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        width,
        height,
        now,
        startTime: startTimeRef.current,
        dark: isDarkModeRef.current,
        isMobile: isMobileRef.current,
        reducedMotion: reducedMotionRef.current,
        nodes: nodesRef.current,
        edges: edgesRef.current,
        byId: nodeByIdRef.current,
        camera: {
          zoom: zoomRef.current,
          offset: offsetRef.current,
          anim: cameraAnimRef.current,
        },
        hovered: hoveredNodeRef.current,
        focused: focusedNodeRef.current,
        spotlightCategory: spotlightCategoryRef.current,
        searchQuery: searchQueryRef.current,
        activeCategories: activeCategoriesRef.current,
        visited: visitedRef.current,
        specks: specksRef.current,
        devicePixelRatio: window.devicePixelRatio || 1,
      });
      zoomRef.current = camera.zoom;
      offsetRef.current = camera.offset;
      cameraAnimRef.current = camera.anim;

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
    return clientToWorld(clientX, clientY, rect, width, height, zoomRef.current, offsetRef.current);
  }, []);

  const getNodeAtPosition = useCallback((clientX: number, clientY: number): SimNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const { width, height } = dimensionsRef.current;
    const world = clientToWorld(
      clientX,
      clientY,
      rect,
      width,
      height,
      zoomRef.current,
      offsetRef.current,
    );
    return hitTestNode(world.x, world.y, nodesRef.current, activeCategoriesRef.current);
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
        const distance = pointerDistance(points[0], points[1]);
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
        const distance = pointerDistance(points[0], points[1]);
        zoomRef.current = pinchZoomScale(
          distance,
          pinchStartRef.current.distance,
          pinchStartRef.current.zoom,
        );
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
      const next = zoomTowardCursor(
        cursorX,
        cursorY,
        width,
        height,
        zoomRef.current,
        offsetRef.current,
        event.deltaY > 0 ? 0.9 : 1.1,
      );
      zoomRef.current = next.zoom;
      offsetRef.current = next.offset;
    },
    [cancelCameraAnim],
  );

  const handleZoomIn = useCallback(() => {
    cancelCameraAnim();
    const { width, height } = dimensionsRef.current;
    const newZoom = Math.min(ATLAS_MAX_ZOOM, zoomRef.current * 1.25);
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
    const newZoom = Math.max(ATLAS_MIN_ZOOM, zoomRef.current * 0.8);
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
