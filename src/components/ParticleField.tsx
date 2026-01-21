import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  connections: number[];
}

interface ParticleFieldProps {
  particleCount?: number;
  connectionDistance?: number;
  mouseRadius?: number;
  className?: string;
}

export function ParticleField({
  particleCount = 80,
  connectionDistance = 150,
  mouseRadius = 200,
  className = ''
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, isPressed: false });
  const animationRef = useRef<number>(0);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const colors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(14, 165, 233, 0.8)',
    'rgba(6, 182, 212, 0.8)',
    'rgba(20, 184, 166, 0.8)',
    'rgba(99, 102, 241, 0.6)',
  ];

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const baseRadius = Math.random() * 3 + 1;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: baseRadius,
        baseRadius,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.3,
        connections: []
      });
    }
    particlesRef.current = particles;
  }, [particleCount]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensionsRef.current;
    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle, i) => {
      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseRadius) {
        const force = (mouseRadius - distance) / mouseRadius;
        const angle = Math.atan2(dy, dx);

        if (mouse.isPressed) {
          particle.vx += Math.cos(angle) * force * 0.5;
          particle.vy += Math.sin(angle) * force * 0.5;
        } else {
          particle.vx -= Math.cos(angle) * force * 0.3;
          particle.vy -= Math.sin(angle) * force * 0.3;
        }

        particle.radius = particle.baseRadius + force * 4;
      } else {
        particle.radius += (particle.baseRadius - particle.radius) * 0.1;
      }

      particle.vx *= 0.98;
      particle.vy *= 0.98;

      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0) { particle.x = 0; particle.vx *= -0.5; }
      if (particle.x > width) { particle.x = width; particle.vx *= -0.5; }
      if (particle.y < 0) { particle.y = 0; particle.vy *= -0.5; }
      if (particle.y > height) { particle.y = height; particle.vy *= -0.5; }

      particle.connections = [];
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        const connDx = other.x - particle.x;
        const connDy = other.y - particle.y;
        const connDist = Math.sqrt(connDx * connDx + connDy * connDy);

        if (connDist < connectionDistance) {
          particle.connections.push(j);

          const opacity = (1 - connDist / connectionDistance) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);

          const gradient = ctx.createLinearGradient(particle.x, particle.y, other.x, other.y);
          gradient.addColorStop(0, particle.color.replace('0.8', String(opacity)));
          gradient.addColorStop(1, other.color.replace('0.8', String(opacity)));
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      const glow = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * 3
      );
      glow.addColorStop(0, particle.color);
      glow.addColorStop(0.5, particle.color.replace('0.8', '0.2'));
      glow.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [connectionDistance, mouseRadius]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      dimensionsRef.current = { width: rect.width, height: rect.height };

      if (particlesRef.current.length === 0) {
        initParticles(rect.width, rect.height);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseDown = () => { mouseRef.current.isPressed = true; };
    const handleMouseUp = () => { mouseRef.current.isPressed = false; };
    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      mouseRef.current.isPressed = false;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
}
