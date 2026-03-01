import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { usePageVisible } from "@/hooks/use-page-visible";

const ScarcityBar: React.FC = () => {
  const [bonos, setBonos] = useState(14);
  const pageVisible = usePageVisible();

  useEffect(() => {
    if (!pageVisible) return;
    const interval = setInterval(() => {
      setBonos((b) => (b <= 3 ? 3 : b - 1));
    }, 15000 + Math.random() * 10000);
    return () => clearInterval(interval);
  }, [pageVisible]);

  return (
    <div className="w-full max-w-xs mx-auto mt-5 glass-card rounded-xl px-4 py-3 premium-shadow">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="text-muted-foreground">🔥 Bonos disponibles hoy</span>
        <span className="font-bold text-casino-gold">{bonos} restantes</span>
      </div>
      <Progress value={(bonos / 50) * 100} className="h-1.5 bg-muted/40" />
    </div>
  );
};

export default ScarcityBar;
