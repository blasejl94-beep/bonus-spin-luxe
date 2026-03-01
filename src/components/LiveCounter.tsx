import React, { useEffect, useState } from "react";

const LiveCounter: React.FC = () => {
  const [count, setCount] = useState(847);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 7) - 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 text-xs text-foreground/70 mb-4">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <span>
        <span className="font-bold text-foreground">{count}</span> personas viendo esta página ahora
      </span>
    </div>
  );
};

export default LiveCounter;
