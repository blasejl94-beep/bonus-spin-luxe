import React, { useEffect, useState } from "react";

interface SuspenseOverlayProps {
  onComplete: () => void;
}

const MESSAGES = [
  "Calculando tu bono...",
  "Verificando disponibilidad...",
  "¡Bono encontrado!",
];

const SuspenseOverlay: React.FC<SuspenseOverlayProps> = ({ onComplete }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [dots, setDots] = useState("");
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    // Dot animation
    const dotInterval = setInterval(() => {
      setDots(d => d.length >= 3 ? "" : d + ".");
    }, 350);

    // Message progression
    const t1 = setTimeout(() => { setMsgIndex(1); setBarWidth(50); }, 900);
    const t2 = setTimeout(() => { setMsgIndex(2); setBarWidth(100); }, 1800);
    const t3 = setTimeout(onComplete, 2400);

    // Progress bar smooth start
    requestAnimationFrame(() => setBarWidth(20));

    return () => {
      clearInterval(dotInterval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 animate-in fade-in-0 duration-300">
        {/* Spinning wheel icon */}
        <div className="text-6xl suspense-spin">🎰</div>

        <p className="text-xl font-bold text-foreground tracking-wide">
          {MESSAGES[msgIndex]}{msgIndex < 2 ? dots : ""}
        </p>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gold-gradient rounded-full transition-all duration-700 ease-out"
            style={{ width: `${barWidth}%` }}
          />
        </div>

        {msgIndex === 2 && (
          <p className="text-sm text-casino-gold font-semibold animate-in fade-in-0 duration-300">
            🎉 ¡Tenemos un ganador!
          </p>
        )}
      </div>
    </div>
  );
};

export default SuspenseOverlay;
