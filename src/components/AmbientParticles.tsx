import React, { useMemo } from "react";

const AmbientParticles: React.FC = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        delay: Math.random() * 10,
        duration: Math.random() * 8 + 8,
        opacity: Math.random() * 0.3 + 0.05,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ contain: "strict" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="ambient-particle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default React.memo(AmbientParticles);
