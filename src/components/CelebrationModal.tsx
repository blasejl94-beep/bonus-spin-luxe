import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface CelebrationModalProps {
  onComplete: () => void;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

  useEffect(() => {
    // Enter → visible
    const t1 = requestAnimationFrame(() => setPhase("visible"));
    // Start exit after ~1.9s
    const t2 = setTimeout(() => setPhase("exit"), 1900);
    // Complete after fade-out (300ms)
    const t3 = setTimeout(onComplete, 2200);

    return () => {
      cancelAnimationFrame(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  const overlayOpacity = phase === "enter" ? "opacity-0" : phase === "visible" ? "opacity-100" : "opacity-0";
  const cardTransform =
    phase === "enter"
      ? "scale-95 opacity-0"
      : phase === "visible"
        ? "scale-100 opacity-100"
        : "scale-95 opacity-0";

  return createPortal(
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-300 will-change-[opacity] ${overlayOpacity}`}
      style={{
        backgroundColor: "hsl(var(--background) / 0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        className={`flex flex-col items-center gap-3 px-8 py-10 rounded-2xl border border-[hsl(var(--casino-gold)/0.3)] max-w-xs w-full mx-4 transition-all duration-300 will-change-transform ${cardTransform}`}
        style={{
          background: "linear-gradient(145deg, hsl(var(--card)), hsl(var(--background)))",
          boxShadow:
            "0 0 40px hsl(var(--casino-gold) / 0.15), 0 0 80px hsl(var(--casino-gold) / 0.08), 0 20px 60px hsl(0 0% 0% / 0.5)",
        }}
      >
        <span className="text-5xl" role="img" aria-label="celebration">
          🎉
        </span>
        <h2 className="text-2xl font-black text-foreground tracking-tight text-center">
          ¡Felicidades!
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          Tu bono fue desbloqueado
        </p>
        <div
          className="w-12 h-1 rounded-full mt-1"
          style={{
            background: "linear-gradient(90deg, hsl(var(--casino-gold)), hsl(var(--casino-gold-light)))",
          }}
        />
      </div>
    </div>,
    document.body,
  );
};

export default CelebrationModal;
