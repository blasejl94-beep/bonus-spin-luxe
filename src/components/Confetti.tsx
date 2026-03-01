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

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<Array<{ id: number; left: number; color: string; delay: number; size: number }>>([]);

  useEffect(() => {
    const items = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 1.5,
      size: Math.random() * 10 + 4,
    }));
    setPieces(items);
  }, []);

  return (
    <>
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.5,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
    </>
  );
};

export default Confetti;
