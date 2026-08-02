"use client";

import { useEffect, useRef } from "react";
import { useScroll, useSpring } from "framer-motion";
import { useTheme } from "next-themes";

const FG_LIGHT = "18, 18, 16";
const FG_DARK = "245, 245, 242";
// Faint hero-only trace — this used to be a full-page layer at 0.4.
const LAYER_OPACITY = 0.16;
const ASSEMBLY_CYCLES = 4;
const MAX_DPR = 2;
const LINE_MAX_DIST = 85;
const LINE_BASE_ALPHA = 0.12;
const DRIFT_AMPLITUDE = 16;
const SPIN_SPEED = 0.05; // rad/s

type Particle = {
  homeX: number;
  homeY: number;
  driftPhaseX: number;
  driftPhaseY: number;
  driftSpeed: number;
  angle: number;
  radius: number;
  size: number;
  alpha: number;
  accent: boolean;
  x: number;
  y: number;
};

function particleCountFor(width: number) {
  if (width < 640) return 34;
  if (width < 1024) return 56;
  return 80;
}

function smoothstep(t: number) {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

function createParticles(width: number, height: number, count: number): Particle[] {
  const maxRadius = Math.min(Math.min(width, height) * 0.24, 280);
  const accentCount = Math.max(3, Math.round(count * 0.1));
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const homeX = Math.random() * width;
    const homeY = Math.random() * height;
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const radius = maxRadius * (0.35 + Math.random() * 0.65);
    const accent = i < accentCount;
    particles.push({
      homeX,
      homeY,
      driftPhaseX: Math.random() * Math.PI * 2,
      driftPhaseY: Math.random() * Math.PI * 2,
      driftSpeed: 0.12 + Math.random() * 0.18,
      angle,
      radius,
      size: accent ? 1.6 + Math.random() * 1.2 : 1 + Math.random() * 1.2,
      alpha: 0.5 + Math.random() * 0.45,
      accent,
      x: homeX,
      y: homeY,
    });
  }

  // Shuffle angles so accent particles aren't clustered on one arc of the ring.
  for (let i = particles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = particles[i].angle;
    particles[i].angle = particles[j].angle;
    particles[j].angle = tmp;
  }

  return particles;
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const dimsRef = useRef({ width: 0, height: 0 });
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const lastTimeRef = useRef<number | null>(null);
  const spinRef = useRef(0);
  const darkRef = useRef(true);
  const inViewRef = useRef(true);
  const reducedMotionRef = useRef(false);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 20,
    mass: 1,
  });

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    darkRef.current = resolvedTheme !== "light";
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = reducedMotionQuery.matches;

    const fgColor = () => (darkRef.current ? FG_DARK : FG_LIGHT);

    const drawStatic = () => {
      const { width, height } = dimsRef.current;
      ctx.clearRect(0, 0, width, height);
      const fg = fgColor();
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.homeX, p.homeY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${fg}, ${p.alpha})`;
        ctx.fill();
      }
    };

    const drawFrame = (now: number) => {
      const { width, height } = dimsRef.current;
      const last = lastTimeRef.current ?? now;
      const dt = Math.min(0.05, (now - last) / 1000);
      lastTimeRef.current = now;
      spinRef.current += SPIN_SPEED * dt;

      const wave =
        (Math.sin(smoothProgress.get() * Math.PI * 2 * ASSEMBLY_CYCLES - Math.PI / 2) + 1) / 2;
      const assembly = smoothstep(wave);

      const centerX = width / 2;
      const centerY = height / 2;
      const fg = fgColor();
      const t = now / 1000;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      for (const p of particles) {
        const driftX = Math.sin(t * p.driftSpeed + p.driftPhaseX) * DRIFT_AMPLITUDE;
        const driftY = Math.cos(t * p.driftSpeed * 0.85 + p.driftPhaseY) * DRIFT_AMPLITUDE;
        const scatterX = p.homeX + driftX;
        const scatterY = p.homeY + driftY;

        const targetAngle = p.angle + spinRef.current;
        const targetX = centerX + Math.cos(targetAngle) * p.radius;
        const targetY = centerY + Math.sin(targetAngle) * p.radius;

        p.x = scatterX + (targetX - scatterX) * assembly;
        p.y = scatterY + (targetY - scatterY) * assembly;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${fg}, ${p.alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINE_MAX_DIST) {
            const alpha = LINE_BASE_ALPHA * (1 - dist / LINE_MAX_DIST);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${fg}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      if (runningRef.current) {
        rafRef.current = requestAnimationFrame(drawFrame);
      }
    };

    const start = () => {
      if (reducedMotionRef.current || runningRef.current || !inViewRef.current) return;
      runningRef.current = true;
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(drawFrame);
    };

    const stop = () => {
      runningRef.current = false;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    // Sized to the hero container (its nearest positioned ancestor via
    // absolute inset-0), not the viewport — this field only ever covers
    // the hero, so it tracks that box instead of window dimensions.
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimsRef.current = { width, height };
      particlesRef.current = createParticles(width, height, particleCountFor(width));
      if (reducedMotionRef.current) drawStatic();
    };

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onReducedMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      if (e.matches) {
        stop();
        drawStatic();
      } else {
        start();
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    if (reducedMotionRef.current) {
      drawStatic();
    } else {
      start();
    }

    return () => {
      stop();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      observer.disconnect();
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [smoothProgress]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: LAYER_OPACITY }}
    />
  );
}
