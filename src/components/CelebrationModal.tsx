import React, { useEffect, useState } from "react";

interface CelebrationModalProps {
  onComplete: () => void;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

  useEffect(() => {
    // Enter -> visible after mount
    const t1 = requestAnimationFrame(() => setPhase("visible"));

    // Start exit after 1.8s
    const t2 = setTimeout(() => setPhase("exit"), 1800);

    // Complete after exit animation (400ms)
    const t3 = setTimeout(() => onComplete(), 2200);

    return () => {
      cancelAnimationFrame(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{
        opacity: phase === "enter" ? 0 : phase === "exit" ? 0 : 1,
        transition: "opacity 400ms ease-out",
        willChange: "opacity",
        pointerEvents: "none",
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 glass-card-strong rounded-2xl px-8 py-10 text-center max-w-xs mx-4 border border-casino-gold/30 shadow-[0_0_60px_hsl(42,100%,50%,0.2)]"
        style={{
          transform:
            phase === "enter"
              ? "scale(0.9)"
              : phase === "exit"
                ? "scale(0.95)"
                : "scale(1)",
          transition: "transform 400ms ease-out",
          willChange: "transform",
        }}
      >
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-black gold-text mb-2">¡Felicidades!</h2>
        <p className="text-sm text-muted-foreground">Tu bono fue desbloqueado</p>
      </div>
    </div>
  );
};

export default CelebrationModal;
