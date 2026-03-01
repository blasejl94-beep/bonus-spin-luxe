import React, { useEffect, useState } from "react";
import { usePageVisible } from "@/hooks/use-page-visible";

const LiveCounter: React.FC = () => {
  const [count, setCount] = useState(847);
  const pageVisible = usePageVisible();

  useEffect(() => {
    if (!pageVisible) return;
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 7) - 3);
    }, 3000);
    return () => clearInterval(interval);
  }, [pageVisible]);

  return (
    <div className="flex items-center justify-center gap-2.5 text-xs text-muted-foreground mb-5 glass-card rounded-full px-4 py-2 premium-shadow">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(142,70%,50%)] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(142,70%,45%)]" />
      </span>
      <span>
        <span className="font-bold text-foreground">{count}</span> personas en línea ahora
      </span>
    </div>
  );
};

export default LiveCounter;
