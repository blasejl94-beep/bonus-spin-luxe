import React, { useEffect, useState, useRef } from "react";

const LiveCounter: React.FC = React.memo(() => {
  const [count, setCount] = useState(847);
  const [displayCount, setDisplayCount] = useState(847);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 7) - 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animate displayed number toward target
  useEffect(() => {
    const start = displayCount;
    const diff = count - start;
    if (diff === 0) return;
    const duration = 600;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.round(start + diff * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [count]);

  return (
    <div className="flex items-center justify-center gap-2.5 text-xs text-muted-foreground mb-5 glass-card rounded-full px-4 py-2 premium-shadow">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(142,70%,50%)] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(142,70%,45%)]" />
      </span>
      <span>
        <span className="font-bold text-foreground tabular-nums">{displayCount.toLocaleString("es-UY")}</span> personas en línea ahora
      </span>
    </div>
  );
});

LiveCounter.displayName = "LiveCounter";
export default LiveCounter;
