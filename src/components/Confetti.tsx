import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const COLORS = [
  "hsl(45, 100%, 51%)",
  "hsl(45, 100%, 70%)",
  "hsl(0, 72%, 50%)",
  "hsl(0, 0%, 100%)",
  "hsl(30, 100%, 50%)",
  "hsl(320, 70%, 55%)",
  "hsl(200, 80%, 55%)",
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  aspect: number;
}

const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.3 - h * 0.15,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 3 + 1.5,
      size: Math.random() * 10 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      opacity: 1,
      aspect: Math.random() > 0.5 ? 1.5 : 1,
    }));

    const start = performance.now();
    const DURATION = 2000;
    let raf: number;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION, 1);

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.vy += 0.15; // gravity
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - progress * 1.2);

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size * p.aspect / 2, p.size, p.size * p.aspect);
        ctx.restore();
      }

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);
  }, []);

  return ReactDOM.createPortal(
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />,
    document.body
  );
};

export default Confetti;
