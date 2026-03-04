import React, { useEffect, useState, useRef, useMemo } from "react";
import { createPortal } from "react-dom";

interface CelebrationModalProps {
  onComplete: () => void;
  result: string;
}

/* ── Spark particle type ── */
interface Spark {
  id: number;
  angle: number;
  radius: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({ onComplete, result }) => {
  const [phase, setPhase] = useState<"overlay" | "glow" | "panel" | "counting" | "done" | "exit">("overlay");
  const [countValue, setCountValue] = useState(0);
  const [bounce, setBounce] = useState(false);
  const rafRef = useRef<number>(0);

  const numericValue = parseInt(result.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = result.replace(/[0-9]/g, "");

  // Golden spark particles — elegant, few
  const sparks: Spark[] = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      angle: (i * (360 / 14) + (i % 3) * 8) % 360,
      radius: 80 + (i % 4) * 30,
      size: 2 + (i % 3) * 1.5,
      delay: 0.8 + i * 0.12,
      duration: 2 + (i % 3) * 0.6,
      drift: (i % 2 === 0 ? 1 : -1) * (10 + (i % 5) * 4),
    })),
    [],
  );

  // Orchestrated timeline
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 1: overlay fades in (already rendering)
    // Phase 2: golden radial glow (300ms)
    timers.push(setTimeout(() => setPhase("glow"), 150));
    // Phase 3: panel scales in (500ms)
    timers.push(setTimeout(() => setPhase("panel"), 450));
    // Phase 4: count-up starts (800ms)
    timers.push(setTimeout(() => setPhase("counting"), 800));

    return () => timers.forEach(clearTimeout);
  }, []);

  // Count-up animation
  useEffect(() => {
    if (phase !== "counting" || numericValue === 0) return;

    const duration = 1200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCountValue(Math.round(eased * numericValue));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Bounce on final number
        setBounce(true);
        setTimeout(() => setBounce(false), 500);
        setPhase("done");
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, numericValue]);

  // After done, wait then exit
  useEffect(() => {
    if (phase !== "done") return;
    const t1 = setTimeout(() => setPhase("exit"), 1600);
    const t2 = setTimeout(onComplete, 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase, onComplete]);

  const showGlow = phase !== "overlay";
  const showPanel = phase !== "overlay" && phase !== "glow";
  const showSparks = phase === "counting" || phase === "done" || phase === "exit";
  const isExiting = phase === "exit";

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{
        opacity: isExiting ? 0 : 1,
        transition: "opacity 400ms ease-out",
        willChange: "opacity",
      }}
    >
      {/* Dark overlay + blur */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "hsl(240 10% 4% / 0.88)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          opacity: phase === "overlay" ? 0 : 1,
          transition: "opacity 350ms ease-out",
        }}
      />

      {/* Golden radial glow flash */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(42 100% 55% / 0.25) 0%, hsl(42 100% 50% / 0.08) 40%, transparent 70%)",
          opacity: showGlow ? (isExiting ? 0 : 1) : 0,
          transform: showGlow ? "scale(1)" : "scale(0.3)",
          transition: "opacity 500ms ease-out, transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform, opacity",
        }}
      />

      {/* Golden spark particles */}
      {showSparks &&
        sparks.map((s) => {
          const rad = (s.angle * Math.PI) / 180;
          const x = Math.cos(rad) * s.radius;
          const y = Math.sin(rad) * s.radius;
          return (
            <div
              key={s.id}
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "50%",
                width: s.size,
                height: s.size,
                background: "hsl(42 100% 72%)",
                borderRadius: "50%",
                boxShadow: `0 0 ${s.size * 3}px hsl(42 100% 60% / 0.6)`,
                opacity: isExiting ? 0 : undefined,
                transform: `translate(${x}px, ${y}px)`,
                animation: `celebration-spark ${s.duration}s ease-in-out ${s.delay}s infinite`,
                transition: "opacity 400ms ease-out",
                willChange: "transform, opacity",
              }}
            />
          );
        })}

      {/* Premium panel */}
      <div
        className="relative z-10 flex flex-col items-center gap-2 px-10 py-10 rounded-2xl max-w-sm w-full mx-5"
        style={{
          background: "linear-gradient(155deg, hsl(240 8% 12%), hsl(240 10% 8%))",
          border: "1px solid hsl(42 100% 55% / 0.2)",
          boxShadow:
            "0 0 60px hsl(42 100% 55% / 0.12), 0 0 120px hsl(42 100% 55% / 0.06), 0 24px 64px hsl(0 0% 0% / 0.6), inset 0 1px 0 hsl(42 100% 55% / 0.1)",
          opacity: showPanel ? 1 : 0,
          transform: showPanel
            ? isExiting
              ? "scale(0.95)"
              : bounce
                ? "scale(1.02)"
                : "scale(1)"
            : "scale(0.85)",
          transition: isExiting
            ? "opacity 400ms ease-out, transform 400ms ease-out"
            : bounce
              ? "transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)"
              : "opacity 400ms ease-out, transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform, opacity",
        }}
      >
        {/* Subtle golden line at top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(42 100% 55% / 0.5), transparent)",
          }}
        />

        {/* Trophy */}
        <span className="text-4xl mb-1" role="img" aria-label="trophy">
          🏆
        </span>

        {/* Title */}
        <h2
          className="text-2xl sm:text-3xl font-black tracking-tight text-center"
          style={{
            background: "linear-gradient(135deg, hsl(42 100% 78%), hsl(42 100% 58%), hsl(38 85% 45%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ¡Felicidades!
        </h2>

        {/* Subtitle */}
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-semibold">
          Bono desbloqueado
        </p>

        {/* Decorative divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-casino-gold/30" />
          <div className="w-1.5 h-1.5 rotate-45 bg-casino-gold/50" />
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-casino-gold/30" />
        </div>

        {/* Hero number with count-up */}
        <div
          className="relative"
          style={{
            transform: bounce ? "scale(1.12)" : "scale(1)",
            transition: bounce
              ? "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)"
              : "transform 200ms ease-out",
          }}
        >
          <span
            className="block text-6xl sm:text-7xl font-black leading-none"
            style={{
              background: "linear-gradient(160deg, hsl(42 100% 82%), hsl(42 100% 60%), hsl(38 85% 44%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter:
                phase === "done" || phase === "exit"
                  ? "drop-shadow(0 0 18px hsl(42 100% 60% / 0.5)) drop-shadow(0 0 36px hsl(42 100% 55% / 0.2))"
                  : "none",
              transition: "filter 600ms ease-out",
            }}
          >
            {countValue}{suffix}
          </span>
        </div>

        {/* Bottom accent line */}
        <div
          className="w-14 h-0.5 rounded-full mt-2"
          style={{
            background: "linear-gradient(90deg, hsl(42 100% 55% / 0.6), hsl(42 100% 72% / 0.4))",
          }}
        />
      </div>
    </div>,
    document.body,
  );
};

export default CelebrationModal;
