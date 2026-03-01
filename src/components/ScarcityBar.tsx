import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const ScarcityBar: React.FC = () => {
  const [bonos, setBonos] = useState(14);

  useEffect(() => {
    const interval = setInterval(() => {
      setBonos((b) => (b <= 3 ? 3 : b - 1));
    }, 15000 + Math.random() * 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xs mx-auto mt-4">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-foreground/70">🔥 Bonos disponibles hoy</span>
        <span className="font-bold text-casino-gold">{bonos} restantes</span>
      </div>
      <Progress value={(bonos / 50) * 100} className="h-2 bg-muted/50" />
    </div>
  );
};

export default ScarcityBar;
