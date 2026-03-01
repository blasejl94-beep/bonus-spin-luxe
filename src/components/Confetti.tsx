import React, { useEffect, useState } from "react";

const COLORS = [
  "hsl(45, 100%, 51%)",
  "hsl(45, 100%, 70%)",
  "hsl(0, 72%, 50%)",
  "hsl(0, 0%, 100%)",
  "hsl(30, 100%, 50%)",
  "hsl(320, 70%, 55%)",
  "hsl(200, 80%, 55%)",
];

interface Piece {
  id: number;
  left: number;
  top: number;
  color: string;
  delay: number;
  size: number;
  type: "fall" | "burst";
  burstX: number;
  burstY: number;
}

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    const falling: Piece[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 1.2,
      size: Math.random() * 10 + 4,
      type: "fall",
      burstX: 0,
      burstY: 0,
    }));

    const burst: Piece[] = Array.from({ length: 50 }, (_, i) => ({
      id: 100 + i,
      left: 45 + Math.random() * 10,
      top: 35 + Math.random() * 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.3,
      size: Math.random() * 12 + 5,
      type: "burst",
      burstX: (Math.random() - 0.5) * 500,
      burstY: (Math.random() - 0.5) * 500,
    }));

    setPieces([...falling, ...burst]);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className={p.type === "burst" ? "confetti-burst" : "confetti-piece"}
          style={{
            left: `${p.left}%`,
            top: p.type === "burst" ? `${p.top}%` : undefined,
            width: p.size,
            height: p.size * 1.5,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            ...(p.type === "burst" ? {
              "--burst-x": `${p.burstX}px`,
              "--burst-y": `${p.burstY}px`,
            } as React.CSSProperties : {}),
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
