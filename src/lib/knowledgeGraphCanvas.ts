import { getConnectedNodeIds, matchesGraphNodeQuery, type GraphEdgeData } from './knowledgeGraph';
import {
  categoryColor,
  categoryShape,
  DARK_PALETTE,
  easeOutExpo,
  formatCategory,
  LIGHT_PALETTE,
  MONO_STACK,
  SANS_STACK,
  TAU,
  type AtlasSpeck,
  type CameraAnim,
  type ModePalette,
  type NodeShape,
  type SimNode,
} from './knowledgeGraphAtlas';

export function tracePolygon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  sides: number,
  rotation: number,
) {
  for (let i = 0; i < sides; i += 1) {
    const angle = rotation + (i / sides) * TAU;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export function traceGlyph(
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

export interface AtlasDrawCamera {
  zoom: number;
  offset: { x: number; y: number };
  anim: CameraAnim | null;
}

export interface AtlasDrawInput {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  width: number;
  height: number;
  now: number;
  startTime: number;
  dark: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  nodes: SimNode[];
  edges: GraphEdgeData[];
  byId: Map<string, SimNode>;
  camera: AtlasDrawCamera;
  hovered: SimNode | null;
  focused: SimNode | null;
  spotlightCategory: string | null;
  searchQuery: string;
  activeCategories: Set<string> | null;
  visited: Set<string>;
  specks: AtlasSpeck[];
  devicePixelRatio: number;
}

export interface AtlasDrawResult {
  zoom: number;
  offset: { x: number; y: number };
  anim: CameraAnim | null;
}

function categoryDimmed(node: SimNode, activeCategories: Set<string> | null): boolean {
  return Boolean(activeCategories && activeCategories.size > 0 && !activeCategories.has(node.category));
}

/** Paint one atlas frame. Applies camera animation and returns the updated camera state. */
export function drawAtlasFrame(input: AtlasDrawInput): AtlasDrawResult {
  const {
    ctx,
    canvasWidth,
    canvasHeight,
    width,
    height,
    now,
    startTime,
    dark,
    isMobile,
    reducedMotion,
    nodes,
    edges,
    byId,
    hovered,
    focused,
    spotlightCategory,
    searchQuery,
    activeCategories,
    visited,
    specks,
    devicePixelRatio: dpr,
  } = input;

  let { zoom, offset, anim } = input.camera;

  if (anim) {
    const p = Math.min(1, (now - anim.start) / anim.duration);
    const eased = easeOutExpo(p);
    zoom = anim.fromZoom + (anim.toZoom - anim.fromZoom) * eased;
    offset = {
      x: anim.fromX + (anim.toX - anim.fromX) * eased,
      y: anim.fromY + (anim.toY - anim.fromY) * eased,
    };
    if (p >= 1) anim = null;
  }

  const palette: ModePalette = dark ? DARK_PALETTE : LIGHT_PALETTE;
  const t = reducedMotion ? 0 : (now - startTime) / 1000;
  const spotlight = spotlightCategory;
  const query = searchQuery.trim();
  const connected = focused
    ? getConnectedNodeIds(focused.id, edges)
    : hovered
      ? getConnectedNodeIds(hovered.id, edges)
      : null;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
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
  specks.forEach((speck) => {
    const px = (((speck.x * width + offset.x * 0.06) % width) + width) % width;
    const py = (((speck.y * height + offset.y * 0.06) % height) + height) % height;
    const twinkle = reducedMotion ? 0.7 : 0.45 + 0.3 * Math.sin(t * 1.3 + speck.tw);
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
    if (categoryDimmed(node, activeCategories)) alpha = 0.07;
    else if (query && !matchesGraphNodeQuery(node, query)) alpha = 0.1;
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
    if (!isMobile && labelAlpha > 0.03 && entry.n >= 2) {
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
    const isVisited = visited.has(node.path);
    const radius = node.radius * node.scale;
    const isNeighborOfActive = Boolean(
      connected && connected.has(node.id) && node.id !== focused?.id && node.id !== hovered?.id,
    );

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
    if (node.isHub && !reducedMotion && alpha > 0.5) {
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
      shape === 'starburst' ? node.phase + (reducedMotion ? 0 : t * 0.25) : node.phase * 0.3;
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
      (isMobile
        ? isHovered || isFocused || Boolean(query && matchesGraphNodeQuery(node, query)) || (!focused && node.depth <= 2)
        : isHovered ||
          isFocused ||
          isNeighborOfActive ||
          node.isHub ||
          zoom > 1.5 ||
          Boolean(query && matchesGraphNodeQuery(node, query)));

    if (showLabel) {
      const fontSize = Math.max(9, 11.5 / zoom);
      const label =
        node.title.length > 30 && !isHovered && !isFocused ? `${node.title.slice(0, 28)}…` : node.title;
      const labelY = node.y + radius + 7 / zoom;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.font = `${node.isHub ? 600 : 500} ${fontSize}px ${SANS_STACK}`;

      // text halo for legibility over edges
      const metrics =
        typeof ctx.measureText === 'function'
          ? ctx.measureText(label)
          : { width: label.length * fontSize * 0.6 };
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

  return { zoom, offset, anim };
}
