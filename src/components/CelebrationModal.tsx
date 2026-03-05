import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";

interface CelebrationModalProps {
  onComplete: () => void;
  result: string;
}

interface Spark {
  id: number;
  angle: number;
  radius: number;
  size: number;
  delay: number;
  duration: number;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<"overlay" | "glow" | "panel" | "visible" | "exit">("overlay");

  const sparks: Spark[] = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      angle: (i * 36 + (i % 3) * 8) % 360,
      radius: 70 + (i % 4) * 25,
      size: 2 + (i % 3) * 1.2,
      delay: 0.6 + i * 0.1,
      duration: 2 + (i % 3) * 0.5,
    })),
    [],
  );

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("glow"), 100),
      setTimeout(() => setPhase("panel"), 350),
      setTimeout(() => setPhase("visible"), 500),
      setTimeout(() => setPhase("exit"), 1500),
      setTimeout(onComplete, 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const showGlow = phase !== "overlay";
  const showPanel = phase !== "overlay" && phase !== "glow";
  const showSparks = phase === "visible" || phase === "exit";
  const isExiting = phase === "exit";

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{
        opacity: isExiting ? 0 : 1,
        transition: "opacity 300ms ease-out",
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
          transition: "opacity 300ms ease-out",
        }}
      />

      {/* Golden radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(42 100% 55% / 0.22) 0%, hsl(42 100% 50% / 0.07) 40%, transparent 70%)",
          opacity: showGlow ? (isExiting ? 0 : 1) : 0,
          transform: showGlow ? "scale(1)" : "scale(0.3)",
          transition: "opacity 400ms ease-out, transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* Sparks */}
      {showSparks &&
        sparks.map((s) => {
          const rad = (s.angle * Math.PI) / 180;
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
                transform: `translate(${Math.cos(rad) * s.radius}px, ${Math.sin(rad) * s.radius}px)`,
                animation: `celebration-spark ${s.duration}s ease-in-out ${s.delay}s infinite`,
                transition: "opacity 300ms ease-out",
              }}
            />
          );
        })}

      {/* Panel */}
      <div
        className="relative z-10 flex flex-col items-center gap-3 px-10 py-10 rounded-2xl max-w-xs w-full mx-5"
        style={{
          background: "linear-gradient(155deg, hsl(240 8% 12%), hsl(240 10% 8%))",
          border: "1px solid hsl(42 100% 55% / 0.2)",
          boxShadow:
            "0 0 60px hsl(42 100% 55% / 0.1), 0 24px 64px hsl(0 0% 0% / 0.6), inset 0 1px 0 hsl(42 100% 55% / 0.1)",
          opacity: showPanel ? 1 : 0,
          transform: showPanel
            ? isExiting ? "scale(0.95)" : "scale(1)"
            : "scale(0.85)",
          transition: "opacity 350ms ease-out, transform 450ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform, opacity",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, hsl(42 100% 55% / 0.5), transparent)" }}
        />

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

        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-semibold">
          Bono desbloqueado
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-casino-gold/30" />
          <div className="w-1.5 h-1.5 rotate-45 bg-casino-gold/50" />
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-casino-gold/30" />
        </div>

        {/* Processing state */}
        <div className="flex flex-col items-center gap-3 mt-1">
          {/* Golden loading dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background: "hsl(42 100% 65%)",
                  boxShadow: "0 0 6px hsl(42 100% 55% / 0.4)",
                  animation: `celebration-loading-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <p
            className="text-sm font-medium"
            style={{ color: "hsl(42 20% 60%)" }}
          >
            Aplicando bono…
          </p>
        </div>

        {/* Bottom accent */}
        <div
          className="w-14 h-0.5 rounded-full mt-1"
          style={{ background: "linear-gradient(90deg, hsl(42 100% 55% / 0.6), hsl(42 100% 72% / 0.4))" }}
        />
      </div>
    </div>,
    document.body,
  );
};

export default CelebrationModal;
