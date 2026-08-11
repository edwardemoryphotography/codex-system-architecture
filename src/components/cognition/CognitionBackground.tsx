import { useEffect, useRef } from 'react';

import type { CognitiveVisualState } from '../../types/cognition';

interface CognitionBackgroundProps {
  state: CognitiveVisualState;
}

interface Point {
  x: number;
  y: number;
}

interface Palette {
  primary: string;
  secondary: string;
  accent: string;
}

const PALETTES: Record<CognitiveVisualState, Palette> = {
  coherence: {
    primary: '110, 212, 255',
    secondary: '151, 123, 255',
    accent: '241, 186, 109',
  },
  overload: {
    primary: '255, 124, 116',
    secondary: '241, 186, 109',
    accent: '110, 212, 255',
  },
  codex: {
    primary: '110, 212, 255',
    secondary: '151, 123, 255',
    accent: '220, 230, 242',
  },
  recursion: {
    primary: '151, 123, 255',
    secondary: '110, 212, 255',
    accent: '241, 186, 109',
  },
  reduction: {
    primary: '220, 230, 242',
    secondary: '110, 212, 255',
    accent: '151, 123, 255',
  },
};

function alpha(rgb: string, amount: number): string {
  return `rgba(${rgb}, ${amount})`;
}

function hash(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function getCanvasContext(
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D | null {
  if (/jsdom/i.test(window.navigator.userAgent)) {
    return null;
  }

  try {
    return canvas.getContext('2d');
  } catch {
    return null;
  }
}

function resizeCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
): { width: number; height: number } {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || window.innerWidth || 1280;
  const height = rect.height || window.innerHeight || 720;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { width, height };
}

function drawBackdrop(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: Palette,
  focusX: number,
  focusY: number,
) {
  const primaryGlow = context.createRadialGradient(
    focusX,
    focusY,
    0,
    focusX,
    focusY,
    width * 0.58,
  );
  primaryGlow.addColorStop(0, alpha(palette.primary, 0.18));
  primaryGlow.addColorStop(0.55, alpha(palette.secondary, 0.08));
  primaryGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

  context.fillStyle = primaryGlow;
  context.fillRect(0, 0, width, height);

  const edgeGlow = context.createRadialGradient(
    width * 0.82,
    height * 0.18,
    0,
    width * 0.82,
    height * 0.18,
    width * 0.4,
  );
  edgeGlow.addColorStop(0, alpha(palette.accent, 0.1));
  edgeGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

  context.fillStyle = edgeGlow;
  context.fillRect(0, 0, width, height);
}

function drawConnections(
  context: CanvasRenderingContext2D,
  points: Point[],
  maxDistance: number,
  stroke: string,
) {
  context.beginPath();

  for (let sourceIndex = 0; sourceIndex < points.length; sourceIndex += 1) {
    for (
      let targetIndex = sourceIndex + 1;
      targetIndex < points.length;
      targetIndex += 1
    ) {
      const source = points[sourceIndex];
      const target = points[targetIndex];
      const distance = Math.hypot(target.x - source.x, target.y - source.y);

      if (distance > maxDistance) {
        continue;
      }

      context.moveTo(source.x, source.y);
      context.lineTo(target.x, target.y);
    }
  }

  context.strokeStyle = stroke;
  context.lineWidth = 1;
  context.stroke();
}

function drawNodes(
  context: CanvasRenderingContext2D,
  points: Point[],
  fill: string,
  radius = 2,
) {
  for (const point of points) {
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.fillStyle = fill;
    context.fill();
  }
}

function drawSignal(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  palette: Palette,
) {
  const points = Array.from({ length: 15 }, (_, index) => {
    const baseX = width * (0.14 + hash(index + 1) * 0.72);
    const baseY = height * (0.18 + hash(index + 41) * 0.58);

    return {
      x: baseX + Math.sin(time * 0.28 + index * 1.3) * 18,
      y: baseY + Math.cos(time * 0.24 + index * 0.9) * 14,
    };
  });

  drawConnections(context, points, 180, alpha(palette.primary, 0.16));
  drawNodes(context, points, alpha(palette.secondary, 0.78), 1.75);
}

function drawThroughput(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  palette: Palette,
) {
  const bandHeight = height * 0.18;
  const bandGradient = context.createLinearGradient(0, height * 0.5, width, height * 0.5);
  bandGradient.addColorStop(0, alpha(palette.primary, 0));
  bandGradient.addColorStop(0.35, alpha(palette.primary, 0.08));
  bandGradient.addColorStop(0.5, alpha(palette.secondary, 0.14));
  bandGradient.addColorStop(0.65, alpha(palette.primary, 0.08));
  bandGradient.addColorStop(1, alpha(palette.primary, 0));
  context.fillStyle = bandGradient;
  context.fillRect(0, height * 0.5 - bandHeight, width, bandHeight * 2);

  const points = Array.from({ length: 18 }, (_, index) => ({
    x:
      width * (0.06 + (index / 17) * 0.88) +
      Math.sin(time * 0.44 + index * 0.65) * 24,
    y:
      height * 0.5 +
      Math.sin(time * 0.8 + index * 1.2) * (bandHeight * 0.32) +
      (hash(index + 7) - 0.5) * 14,
  }));

  drawConnections(context, points, 140, alpha(palette.secondary, 0.14));
  drawNodes(context, points, alpha(palette.primary, 0.74), 1.8);
}

function drawFragmentation(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  palette: Palette,
) {
  const fractureGradient = context.createLinearGradient(0, 0, width, height);
  fractureGradient.addColorStop(0, alpha(palette.secondary, 0.09));
  fractureGradient.addColorStop(0.45, alpha(palette.primary, 0.02));
  fractureGradient.addColorStop(1, alpha(palette.primary, 0.1));
  context.fillStyle = fractureGradient;
  context.fillRect(0, 0, width, height);

  const points = Array.from({ length: 16 }, (_, index) => {
    const cluster = index < 6 ? 0.24 : index < 11 ? 0.58 : 0.82;
    const verticalSeed = 0.18 + hash(index + 60) * 0.62;
    const jitter = 22 + hash(index + 90) * 18;

    return {
      x:
        width * cluster +
        Math.sin(time * 1.7 + index * 1.4) * jitter +
        (hash(index + 25) - 0.5) * 36,
      y:
        height * verticalSeed +
        Math.cos(time * 1.35 + index * 0.8) * jitter * 0.72,
    };
  });

  drawConnections(context, points, 150, alpha(palette.primary, 0.12));
  drawNodes(context, points, alpha(palette.secondary, 0.86), 1.95);

  context.strokeStyle = alpha(palette.primary, 0.18);
  context.lineWidth = 1.2;
  for (let index = 0; index < 3; index += 1) {
    const x = width * (0.24 + index * 0.2);
    context.beginPath();
    context.moveTo(x, height * 0.12);
    context.lineTo(
      x + Math.sin(time * 0.8 + index) * 26,
      height * 0.48,
    );
    context.lineTo(
      x - 16 + Math.cos(time * 0.9 + index * 0.6) * 18,
      height * 0.88,
    );
    context.stroke();
  }
}

function drawStabilization(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  palette: Palette,
) {
  const centerX = width * 0.5;
  const centerY = height * 0.52;
  const radii = [width * 0.1, width * 0.18, width * 0.28];

  for (const radius of radii) {
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.strokeStyle = alpha(palette.secondary, 0.12);
    context.lineWidth = 1;
    context.stroke();
  }

  const points: Point[] = [];

  radii.forEach((radius, ringIndex) => {
    const count = 5 + ringIndex * 2;
    for (let index = 0; index < count; index += 1) {
      const angle =
        time * (0.16 + ringIndex * 0.04) +
        (index / count) * Math.PI * 2 +
        ringIndex * 0.2;
      points.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius * 0.78,
      });
    }
  });

  drawConnections(context, points, width * 0.12, alpha(palette.primary, 0.14));
  drawNodes(context, points, alpha(palette.accent, 0.8), 1.9);

  context.beginPath();
  context.arc(centerX, centerY, 4, 0, Math.PI * 2);
  context.fillStyle = alpha(palette.primary, 0.85);
  context.fill();
}

function drawPolygon(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  sides: number,
  rotation: number,
) {
  context.beginPath();
  for (let index = 0; index <= sides; index += 1) {
    const angle = rotation + (index / sides) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius * 0.9;

    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }
}

function drawRecursion(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  palette: Palette,
) {
  const centerX = width * 0.52;
  const centerY = height * 0.5;
  const layers = [0.09, 0.16, 0.24, 0.32];

  layers.forEach((scale, index) => {
    const radius = width * scale;
    drawPolygon(context, centerX, centerY, radius, 6, time * 0.12 + index * 0.2);
    context.strokeStyle = alpha(
      index % 2 === 0 ? palette.primary : palette.secondary,
      0.18,
    );
    context.lineWidth = 1;
    context.stroke();
  });

  const points = Array.from({ length: 12 }, (_, index) => {
    const radius = width * (0.08 + (index % 4) * 0.07);
    const angle = time * 0.22 + index * 0.7;

    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle * 1.08) * radius * 0.88,
    };
  });

  drawConnections(context, points, width * 0.16, alpha(palette.accent, 0.12));
  drawNodes(context, points, alpha(palette.primary, 0.76), 1.85);
}

function drawProof(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  palette: Palette,
) {
  const step = Math.max(Math.min(width, height) / 9, 72);
  const offset = Math.sin(time * 0.12) * 4;

  context.strokeStyle = alpha(palette.secondary, 0.08);
  context.lineWidth = 1;

  for (let x = width * 0.1; x <= width * 0.9; x += step) {
    context.beginPath();
    context.moveTo(x + offset, height * 0.12);
    context.lineTo(x + offset, height * 0.88);
    context.stroke();
  }

  for (let y = height * 0.16; y <= height * 0.84; y += step) {
    context.beginPath();
    context.moveTo(width * 0.08, y);
    context.lineTo(width * 0.92, y);
    context.stroke();
  }

  const points: Point[] = [];
  for (let x = width * 0.16; x <= width * 0.84; x += step) {
    for (let y = height * 0.2; y <= height * 0.8; y += step) {
      points.push({ x, y });
    }
  }

  drawNodes(context, points, alpha(palette.primary, 0.34), 1.5);
}

function drawFrame(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: CognitiveVisualState,
  time: number,
) {
  const palette = PALETTES[state];
  const focusX =
    state === 'overload'
      ? width * 0.72
      : state === 'reduction'
        ? width * 0.5
        : width * 0.36;
  const focusY = state === 'codex' ? height * 0.5 : height * 0.28;

  context.clearRect(0, 0, width, height);
  drawBackdrop(context, width, height, palette, focusX, focusY);

  switch (state) {
    case 'coherence':
      drawSignal(context, width, height, time, palette);
      break;
    case 'overload':
      drawThroughput(context, width, height, time, palette);
      drawFragmentation(context, width, height, time, palette);
      break;
    case 'codex':
      drawStabilization(context, width, height, time, palette);
      break;
    case 'recursion':
      drawRecursion(context, width, height, time, palette);
      break;
    case 'reduction':
      drawProof(context, width, height, time, palette);
      break;
  }
}

export function CognitionBackground({ state }: CognitionBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = getCanvasContext(canvas);
    if (!context) {
      return;
    }

    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery?.matches ?? false;
    const motionMultiplier = state === 'reduction' ? 0.3 : 1;

    let frame = 0;
    let dimensions = resizeCanvas(canvas, context);

    const renderFrame = (time: number) => {
      drawFrame(
        context,
        dimensions.width,
        dimensions.height,
        state,
        time * motionMultiplier,
      );
    };

    const handleResize = () => {
      dimensions = resizeCanvas(canvas, context);
      if (prefersReducedMotion) {
        renderFrame(0);
      }
    };

    const render = (now: number) => {
      renderFrame(now / 1000);
      frame = window.requestAnimationFrame(render);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    if (prefersReducedMotion) {
      renderFrame(0);
    } else {
      frame = window.requestAnimationFrame(render);
    }

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [state]);

  return (
    <div aria-hidden="true" className="cognition-background">
      <canvas ref={canvasRef} className="cognition-background__canvas" />
    </div>
  );
}
