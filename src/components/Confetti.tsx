import React, { useEffect, useRef } from "react";

const COLORS = [
  "hsl(45, 100%, 56%)",
  "hsl(45, 100%, 70%)",
  "hsl(0, 72%, 50%)",
  "hsl(0, 0%, 100%)",
  "hsl(30, 100%, 50%)",
  "hsl(200, 80%, 55%)",
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vr: number;
  color: string;
}

const PARTICLE_COUNT = 24;
const DURATION_MS = 900;

const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 650 : DURATION_MS;
    const particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };

    const initParticles = () => {
      particles.length = 0;
      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.36;

      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.4;
        const speed = (reducedMotion ? 2.6 : 3.3) + Math.random() * 2.8;

        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (reducedMotion ? 0.6 : 1.4),
          size: 4 + Math.random() * 4,
          rotation: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.24,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    };

    let rafId = 0;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const fade = 1 - progress;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += reducedMotion ? 0.05 : 0.08;
        p.rotation += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = fade;
        ctx.fillRect(-p.size * 0.5, -p.size * 0.35, p.size, p.size * 0.7);
        ctx.restore();
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    resize();
    initParticles();
    rafId = requestAnimationFrame(animate);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default Confetti;
