import { useEffect, useRef, useState, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RefreshCw, Loader2 } from 'lucide-react';
import { getDocuments } from '../lib/supabase';
import { CodexDocument } from '../types';

interface KnowledgeGraphProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument: (path: string) => void;
  isDarkMode: boolean;
}

interface GraphNode {
  id: string;
  title: string;
  path: string;
  category: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  parentId: string | null;
}

interface GraphEdge {
  source: string;
  target: string;
}

const categoryColors: Record<string, string> = {
  root: '#10b981',
  council: '#f59e0b',
  territory: '#3b82f6',
  artistic_systems: '#f43f5e',
  neuro: '#8b5cf6',
  automation: '#06b6d4',
  business: '#f97316',
  personal_os: '#14b8a6',
  convergence: '#64748b',
};

export function KnowledgeGraph({ isOpen, onClose, onSelectDocument, isDarkMode }: KnowledgeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);
  const zoomRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const hoveredNodeRef = useRef<GraphNode | null>(null);
  const selectedNodeRef = useRef<GraphNode | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const isDarkModeRef = useRef(isDarkMode);

  const [isLoading, setIsLoading] = useState(true);
  const [nodeCount, setNodeCount] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);

  isDarkModeRef.current = isDarkMode;

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let mounted = true;

    const initCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      dimensionsRef.current = { width: rect.width, height: rect.height };
    };

    const loadData = async () => {
      initCanvas();
      setIsLoading(true);

      try {
        const docs = await getDocuments();
        if (!mounted || !docs || docs.length === 0) {
          setIsLoading(false);
          return;
        }

        const { width, height } = dimensionsRef.current;
        const centerX = width / 2;
        const centerY = height / 2;

        const graphNodes: GraphNode[] = docs.map((doc: CodexDocument, i: number) => {
          const angle = (i / docs.length) * Math.PI * 2;
          const radius = 120 + Math.random() * 80;
          return {
            id: doc.id,
            title: doc.title,
            path: doc.path,
            category: doc.category,
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: doc.parent_id ? 5 : 8,
            parentId: doc.parent_id
          };
        });

        const graphEdges: GraphEdge[] = [];
        docs.forEach((doc: CodexDocument) => {
          if (doc.parent_id) {
            graphEdges.push({ source: doc.parent_id, target: doc.id });
          }
        });

        const categoryGroups = docs.reduce((acc: Record<string, CodexDocument[]>, doc: CodexDocument) => {
          if (!acc[doc.category]) acc[doc.category] = [];
          acc[doc.category].push(doc);
          return acc;
        }, {});

        Object.values(categoryGroups).forEach((group) => {
          for (let i = 0; i < group.length - 1; i++) {
            if (Math.random() > 0.5) {
              graphEdges.push({ source: group[i].id, target: group[i + 1].id });
            }
          }
        });

        nodesRef.current = graphNodes;
        edgesRef.current = graphEdges;
        setNodeCount(graphNodes.length);
        setIsLoading(false);

        startAnimation();
      } catch (error) {
        console.error('Failed to load graph:', error);
        setIsLoading(false);
      }
    };

    const simulate = () => {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      if (nodes.length === 0) return;

      const { width, height } = dimensionsRef.current;
      const centerX = width / 2;
      const centerY = height / 2;

      nodes.forEach(node => {
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          node.vx += (dx / dist) * 0.015;
          node.vy += (dy / dist) * 0.015;
        }
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = 40;

          if (dist < minDist) {
            const force = (minDist - dist) / dist * 0.2;
            nodes[i].vx -= dx * force;
            nodes[i].vy -= dy * force;
            nodes[j].vx += dx * force;
            nodes[j].vy += dy * force;
          }
        }
      }

      edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 70;
          const force = (dist - targetDist) * 0.003;

          source.vx += (dx / dist) * force;
          source.vy += (dy / dist) * force;
          target.vx -= (dx / dist) * force;
          target.vy -= (dy / dist) * force;
        }
      });

      const selected = selectedNodeRef.current;
      nodes.forEach(node => {
        if (node !== selected) {
          node.vx *= 0.95;
          node.vy *= 0.95;
          node.x += node.vx;
          node.y += node.vy;

          const margin = 20;
          node.x = Math.max(margin, Math.min(width - margin, node.x));
          node.y = Math.max(margin, Math.min(height - margin, node.y));
        }
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
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.translate(currentOffset.x + width / 2, currentOffset.y + height / 2);
      ctx.scale(currentZoom, currentZoom);
      ctx.translate(-width / 2, -height / 2);

      edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = darkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(156, 163, 175, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      const hovered = hoveredNodeRef.current;
      const selected = selectedNodeRef.current;

      nodes.forEach(node => {
        const color = categoryColors[node.category] || '#64748b';
        const isHovered = hovered?.id === node.id;
        const isSelected = selected?.id === node.id;
        const radius = node.radius * (isHovered || isSelected ? 1.6 : 1);

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 2.5, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2.5);
        glow.addColorStop(0, color + '60');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        if (isHovered || isSelected) {
          ctx.strokeStyle = darkMode ? '#ffffff' : '#000000';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        if (isHovered || isSelected || currentZoom > 0.6) {
          ctx.font = `${Math.max(9, 11 / currentZoom)}px -apple-system, BlinkMacSystemFont, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = darkMode ? '#ffffff' : '#1f2937';
          ctx.fillText(node.title, node.x, node.y + radius + 4);
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

    window.addEventListener('resize', handleResize);

    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isOpen]);

  const getNodeAtPosition = useCallback((clientX: number, clientY: number): GraphNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const { width, height } = dimensionsRef.current;
    const currentZoom = zoomRef.current;
    const currentOffset = offsetRef.current;

    const x = ((clientX - rect.left - currentOffset.x - width / 2) / currentZoom) + width / 2;
    const y = ((clientY - rect.top - currentOffset.y - height / 2) / currentZoom) + height / 2;

    for (const node of nodesRef.current) {
      const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      if (dist < node.radius * 3) {
        return node;
      }
    }
    return null;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const selected = selectedNodeRef.current;
    if (isDraggingRef.current && !selected) {
      offsetRef.current = {
        x: offsetRef.current.x + (e.clientX - dragStartRef.current.x),
        y: offsetRef.current.y + (e.clientY - dragStartRef.current.y)
      };
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    } else if (selected) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const { width, height } = dimensionsRef.current;
      const currentZoom = zoomRef.current;
      const currentOffset = offsetRef.current;
      const x = ((e.clientX - rect.left - currentOffset.x - width / 2) / currentZoom) + width / 2;
      const y = ((e.clientY - rect.top - currentOffset.y - height / 2) / currentZoom) + height / 2;
      selected.x = x;
      selected.y = y;
      selected.vx = 0;
      selected.vy = 0;
    } else {
      const node = getNodeAtPosition(e.clientX, e.clientY);
      hoveredNodeRef.current = node;
      setHoveredNode(node);
    }
  }, [getNodeAtPosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const node = getNodeAtPosition(e.clientX, e.clientY);
    if (node) {
      selectedNodeRef.current = node;
    } else {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }
  }, [getNodeAtPosition]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    selectedNodeRef.current = null;
  }, []);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    const node = getNodeAtPosition(e.clientX, e.clientY);
    if (node) {
      onSelectDocument(node.path);
      onClose();
    }
  }, [getNodeAtPosition, onSelectDocument, onClose]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    zoomRef.current = Math.max(0.3, Math.min(3, zoomRef.current * delta));
    setZoom(zoomRef.current);
  }, []);

  const handleZoomIn = useCallback(() => {
    zoomRef.current = Math.min(3, zoomRef.current * 1.2);
    setZoom(zoomRef.current);
  }, []);

  const handleZoomOut = useCallback(() => {
    zoomRef.current = Math.max(0.3, zoomRef.current * 0.8);
    setZoom(zoomRef.current);
  }, []);

  const resetView = useCallback(() => {
    zoomRef.current = 1;
    offsetRef.current = { x: 0, y: 0 };
    setZoom(1);
  }, []);

  if (!isOpen) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-50">
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`} />

      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <button
          onClick={onClose}
          className={`p-3 rounded-2xl backdrop-blur-xl transition-all border ${
            isDarkMode
              ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
              : 'bg-white/80 hover:bg-white text-gray-900 border-gray-200/50 shadow-lg'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
        <div className={`px-4 py-2 rounded-2xl backdrop-blur-xl border ${
          isDarkMode ? 'bg-white/10 border-white/10' : 'bg-white/80 border-gray-200/50 shadow-lg'
        }`}>
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Knowledge Graph
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {nodeCount} documents
          </p>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={handleZoomIn}
          className={`p-3 rounded-2xl backdrop-blur-xl transition-all border ${
            isDarkMode
              ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
              : 'bg-white/80 hover:bg-white text-gray-900 border-gray-200/50 shadow-lg'
          }`}
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className={`p-3 rounded-2xl backdrop-blur-xl transition-all border ${
            isDarkMode
              ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
              : 'bg-white/80 hover:bg-white text-gray-900 border-gray-200/50 shadow-lg'
          }`}
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={resetView}
          className={`p-3 rounded-2xl backdrop-blur-xl transition-all border ${
            isDarkMode
              ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
              : 'bg-white/80 hover:bg-white text-gray-900 border-gray-200/50 shadow-lg'
          }`}
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {hoveredNode && (
        <div
          className={`absolute bottom-4 left-4 z-10 p-4 rounded-2xl max-w-sm backdrop-blur-xl border ${
            isDarkMode ? 'bg-white/10 border-white/10 text-white' : 'bg-white/90 border-gray-200/50 text-gray-900 shadow-xl'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: categoryColors[hoveredNode.category] }}
            />
            <span className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {hoveredNode.category.replace(/_/g, ' ')}
            </span>
          </div>
          <h3 className="font-bold text-lg">{hoveredNode.title}</h3>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {hoveredNode.path}
          </p>
          <p className={`text-xs mt-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Double-click to open
          </p>
        </div>
      )}

      <div className={`absolute bottom-4 right-4 z-10 p-4 rounded-2xl backdrop-blur-xl border ${
        isDarkMode ? 'bg-white/10 border-white/10' : 'bg-white/90 border-gray-200/50 shadow-lg'
      }`}>
        <p className={`text-xs font-medium mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Categories
        </p>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {category.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className={`flex flex-col items-center gap-4 p-8 rounded-3xl backdrop-blur-xl border ${
            isDarkMode ? 'bg-white/10 border-white/10' : 'bg-white/90 border-gray-200/50 shadow-xl'
          }`}>
            <Loader2 className={`w-8 h-8 animate-spin ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>Loading knowledge graph...</p>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500 cursor-grab active:cursor-grabbing`}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      />
    </div>
  );
}
