import React, { useEffect, useState } from "react";

interface PrizeTicketProps {
  result: string;
}

const PrizeTicket: React.FC<PrizeTicketProps> = ({ result }) => {
  const [showShine, setShowShine] = useState(false);
  const [ticketCode] = useState(() => {
    const code = Math.floor(1000 + Math.random() * 9000);
    return `SP-${code}`;
  });

  useEffect(() => {
    const t = setTimeout(() => setShowShine(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full max-w-sm">
      {/* Background spotlight */}
      <div
        className="absolute inset-0 -inset-y-12 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, hsl(42 100% 55% / 0.12) 0%, transparent 70%)",
        }}
      />

      {/* Sparkles - finite animation */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: `${5 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            background: "hsl(45 100% 70%)",
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            animation: `sparkle ${1.5 + Math.random()}s ease-in-out ${0.5 + i * 0.3}s both`,
            animationIterationCount: "3",
          }}
        />
      ))}

      {/* Gold Badge / Medallion */}
      <div className="relative z-10 flex justify-center mb-[-28px]">
        <div className="prize-badge">
          <div className="prize-badge-inner">
            <span className="text-lg">🏆</span>
          </div>
        </div>
      </div>

      {/* Ticket body */}
      <div className="prize-ticket relative z-[5] overflow-hidden">
        {/* Shine sweep */}
        {showShine && (
          <div className="absolute inset-0 pointer-events-none z-20 prize-shine" />
        )}

        {/* Notches */}
        <div className="prize-notch-left" />
        <div className="prize-notch-right" />

        {/* Inner content */}
        <div className="relative z-10 pt-10 pb-5 px-5 text-center">
          {/* Top label */}
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-casino-gold/70 mb-1 stagger-1">
            PREMIO DESBLOQUEADO
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 mb-4 stagger-1">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-casino-gold/40" />
            <div className="w-1.5 h-1.5 rotate-45 bg-casino-gold/50" />
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-casino-gold/40" />
          </div>

          {/* Hero number */}
          <div className="relative stagger-2">
            <span className="prize-hero-number">{result}</span>
          </div>

          {/* Subtitle */}
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground mt-3 mb-4 stagger-3">
            BONO DE BIENVENIDA
          </p>

          {/* Dashed separator */}
          <div className="border-t border-dashed border-casino-gold/20 mx-2 mb-3" />

          {/* Ticket details */}
          <div className="flex items-center justify-between text-[9px] text-muted-foreground/60 font-mono stagger-4">
            <span>Ticket #{ticketCode}</span>
            <span>Reservado: 05:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeTicket;
