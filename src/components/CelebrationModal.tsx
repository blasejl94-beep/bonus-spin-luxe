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

type Phase =
  | "overlay"
  | "glow"
  | "panel"
  | "visible"
  | "to-confirmed"
  | "confirmed"
  | "exit";

const CelebrationModal: React.FC<CelebrationModalProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<Phase>("overlay");

  const sparks: Spark[] = useMemo(
    () =>
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
      // After "Aplicando bono..." plays, transition to confirmation
      setTimeout(() => setPhase("to-confirmed"), 1500),
      setTimeout(() => setPhase("confirmed"), 1700),
      // Hold confirmation briefly, then exit
      setTimeout(() => setPhase("exit"), 3000),
      setTimeout(onComplete, 3300),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const isApplying = phase === "overlay" || phase === "glow" || phase === "panel" || phase === "visible";
  const isTransitioning = phase === "to-confirmed";
  const isConfirmed = phase === "confirmed";
  const isExiting = phase === "exit";

  const showGlow = phase !== "overlay";
  const showPanel = phase !== "overlay" && phase !== "glow";
  const showSparks = !isApplying || phase === "visible";

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{
        opacity: isExiting ? 0 : 1,
        transition: "opacity 300ms ease-out",
        willChange: "opacity",
      }}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "hsl(240 10% 4% / 0.92)",
          opacity: phase === "overlay" ? 0 : 1,
          transition: "opacity 300ms ease-out",
        }}
      />

      {/* Golden radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: isConfirmed || isExiting ? 440 : 360,
          height: isConfirmed || isExiting ? 440 : 360,
          borderRadius: "50%",
          background:
            isConfirmed || isExiting
              ? "radial-gradient(circle, hsl(42 100% 55% / 0.28) 0%, hsl(42 100% 50% / 0.1) 40%, transparent 70%)"
              : "radial-gradient(circle, hsl(42 100% 55% / 0.22) 0%, hsl(42 100% 50% / 0.07) 40%, transparent 70%)",
          opacity: showGlow ? (isExiting ? 0 : 1) : 0,
          transform: showGlow ? "scale(1)" : "scale(0.3)",
          transition:
            "opacity 400ms ease-out, transform 500ms cubic-bezier(0.16, 1, 0.3, 1), width 500ms ease, height 500ms ease, background 400ms ease",
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

      {/* Panel — "Aplicando bono…" phase */}
      <div
        className="absolute z-10 flex flex-col items-center gap-3 px-10 py-10 rounded-2xl max-w-xs w-full mx-5"
        style={{
          background: "linear-gradient(155deg, hsl(240 8% 12%), hsl(240 10% 8%))",
          border: "1px solid hsl(42 100% 55% / 0.2)",
          boxShadow:
            "0 0 60px hsl(42 100% 55% / 0.1), 0 24px 64px hsl(0 0% 0% / 0.6), inset 0 1px 0 hsl(42 100% 55% / 0.1)",
          opacity: isApplying && showPanel ? 1 : 0,
          transform:
            isApplying && showPanel
              ? "scale(1)"
              : isTransitioning || isConfirmed || isExiting
                ? "scale(0.92)"
                : "scale(0.85)",
          transition:
            "opacity 350ms ease-out, transform 450ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform, opacity",
          pointerEvents: isApplying ? "auto" : "none",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(42 100% 55% / 0.5), transparent)",
          }}
        />

        <h2
          className="text-2xl sm:text-3xl font-black tracking-tight text-center"
          style={{
            background:
              "linear-gradient(135deg, hsl(42 100% 78%), hsl(42 100% 58%), hsl(38 85% 45%))",
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

        <div className="flex items-center gap-3 my-1">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-casino-gold/30" />
          <div className="w-1.5 h-1.5 rotate-45 bg-casino-gold/50" />
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-casino-gold/30" />
        </div>

        <div className="flex flex-col items-center gap-3 mt-1">
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
          <p className="text-sm font-medium" style={{ color: "hsl(42 20% 60%)" }}>
            Aplicando bono…
          </p>
        </div>

        <div
          className="w-14 h-0.5 rounded-full mt-1"
          style={{
            background:
              "linear-gradient(90deg, hsl(42 100% 55% / 0.6), hsl(42 100% 72% / 0.4))",
          }}
        />
      </div>

      {/* Confirmation panel — "Bono desbloqueado" */}
      <div
        className="absolute z-10 flex flex-col items-center gap-4 px-12 py-12 rounded-2xl max-w-sm w-full mx-5"
        style={{
          background: "linear-gradient(155deg, hsl(240 8% 12%), hsl(240 10% 7%))",
          border: "1px solid hsl(42 100% 55% / 0.25)",
          boxShadow:
            "0 0 80px hsl(42 100% 55% / 0.15), 0 32px 80px hsl(0 0% 0% / 0.6), inset 0 1px 0 hsl(42 100% 70% / 0.12)",
          opacity: isConfirmed ? 1 : 0,
          transform: isConfirmed
            ? "scale(1)"
            : isExiting
              ? "scale(0.95)"
              : "scale(1.06)",
          transition:
            "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform, opacity",
          pointerEvents: isConfirmed ? "auto" : "none",
        }}
      >
        {/* Top gold line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-4/5 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(42 100% 60% / 0.6), transparent)",
          }}
        />

        {/* Checkmark icon */}
        <div
          className="flex items-center justify-center"
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, hsl(42 100% 52%), hsl(38 85% 40%))",
            boxShadow:
              "0 0 30px hsl(42 100% 55% / 0.35), 0 0 60px hsl(42 100% 55% / 0.12)",
            animation: isConfirmed
              ? "celebration-confirm-scale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
              : undefined,
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="hsl(240 10% 6%)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h2
          className="text-2xl sm:text-3xl font-black tracking-tight text-center leading-tight"
          style={{
            background:
              "linear-gradient(135deg, hsl(42 100% 82%), hsl(42 100% 62%), hsl(38 85% 48%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Bono desbloqueado
        </h2>

        <p
          className="text-xs uppercase tracking-[0.25em] font-medium text-center"
          style={{ color: "hsl(42 20% 55%)" }}
        >
          Tu bono de bienvenida está listo
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-casino-gold/30" />
          <div
            className="w-1.5 h-1.5 rotate-45"
            style={{
              background: "hsl(42 100% 60%)",
              boxShadow: "0 0 8px hsl(42 100% 55% / 0.5)",
            }}
          />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-casino-gold/30" />
        </div>

        {/* Bottom accent */}
        <div
          className="w-16 h-0.5 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, hsl(42 100% 55% / 0.5), hsl(42 100% 72% / 0.6), hsl(42 100% 55% / 0.5))",
          }}
        />
      </div>
    </div>,
    document.body,
  );
};

export default CelebrationModal;
