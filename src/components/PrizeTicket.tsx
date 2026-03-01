import React, { useEffect, useState, useRef } from "react";

interface PrizeTicketProps {
  result: string;
}

const PrizeTicket: React.FC<PrizeTicketProps> = ({ result }) => {
  const [showShine, setShowShine] = useState(false);
  const [countValue, setCountValue] = useState(0);
  const [countDone, setCountDone] = useState(false);
  const [ticketCode] = useState(() => {
    const code = Math.floor(1000 + Math.random() * 9000);
    return `SP-${code}`;
  });
  const rafRef = useRef<number>(0);

  // Parse numeric value from result (e.g. "200%" -> 200)
  const numericValue = parseInt(result.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = result.replace(/[0-9]/g, "");

  // Count-up animation
  useEffect(() => {
    if (numericValue === 0) return;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCountValue(Math.round(eased * numericValue));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCountDone(true);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [numericValue]);

  useEffect(() => {
    const t = setTimeout(() => setShowShine(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full max-w-sm">
      {/* Background spotlight */}
      <div
        className="absolute -inset-x-8 -inset-y-16 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, hsl(42 100% 55% / 0.1) 0%, hsl(42 100% 55% / 0.04) 40%, transparent 70%)",
        }}
      />

      {/* Sparkles - finite animation */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: `${5 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
            width: 3 + Math.random() * 5,
            height: 3 + Math.random() * 5,
            background: "hsl(45 100% 70%)",
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            animation: `sparkle ${1.5 + Math.random()}s ease-in-out ${0.5 + i * 0.25}s both`,
            animationIterationCount: "3",
          }}
        />
      ))}

      {/* Gold Badge / Medallion */}
      <div className="relative z-10 flex justify-center mb-[-32px]">
        <div className="prize-badge-v2">
          <div className="prize-badge-v2-rim" />
          <div className="prize-badge-v2-inner">
            <span className="text-xl leading-none">🏆</span>
          </div>
          {/* Badge shine */}
          <div className="prize-badge-shine" />
        </div>
      </div>

      {/* Ticket body */}
      <div className="prize-ticket-v2 relative z-[5] overflow-hidden">
        {/* Border shine sweep */}
        {showShine && (
          <div className="absolute inset-0 pointer-events-none z-20 prize-border-shine" />
        )}

        {/* Dashed tear line instead of notches */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-[15] flex items-center px-0">
          <div className="prize-tear-notch-left" />
          <div className="flex-1 border-t border-dashed border-casino-gold/15 mx-1" />
          <div className="prize-tear-notch-right" />
        </div>

        {/* Inner content */}
        <div className="relative z-10 pt-12 pb-6 px-6 text-center">
          {/* Top label */}
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-casino-gold/60 mb-2 stagger-1">
            PREMIO DESBLOQUEADO
          </p>

          {/* Decorative separators */}
          <div className="flex items-center justify-center gap-3 mb-5 stagger-1">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-casino-gold/30" />
            <div className="flex gap-1.5">
              <div className="w-1 h-1 rotate-45 bg-casino-gold/40" />
              <div className="w-1.5 h-1.5 rotate-45 bg-casino-gold/60" />
              <div className="w-1 h-1 rotate-45 bg-casino-gold/40" />
            </div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-casino-gold/30" />
          </div>

          {/* Hero number with count-up */}
          <div className="relative stagger-2">
            <span className={`prize-hero-number-v2 ${countDone ? 'prize-number-glow' : ''}`}>
              {countValue}{suffix}
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground mt-3 mb-1 stagger-3">
            BONO DE BIENVENIDA
          </p>

          {/* Status badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-casino-gold/10 border border-casino-gold/20 mt-2 mb-4 stagger-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(142 70% 50%)', boxShadow: '0 0 4px hsl(142 70% 50% / 0.6)' }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-casino-gold/80">
              Bono Activado
            </span>
          </div>

          {/* Dashed separator */}
          <div className="border-t border-dashed border-casino-gold/15 mx-4 mb-3" />

          {/* Ticket details */}
          <div className="flex items-center justify-between text-[9px] text-muted-foreground/50 font-mono stagger-4">
            <span>Ticket #{ticketCode}</span>
            <span>Reservado: 05:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeTicket;
