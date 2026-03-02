import React, { useEffect, useState, useRef } from "react";
import { startCountUpSound, updateCountUpSound, stopCountUpSound, playFinalDing } from "@/lib/sounds";

interface PrizeTicketProps {
  result: string;
  onRevealComplete?: () => void;
  countdownText?: string;
  isUrgent?: boolean;
}

const PrizeTicket: React.FC<PrizeTicketProps> = ({ result, onRevealComplete, countdownText, isUrgent }) => {
  const [showShine, setShowShine] = useState(false);
  const [countValue, setCountValue] = useState(0);
  const [countDone, setCountDone] = useState(false);
  const [winPulse, setWinPulse] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const rafRef = useRef<number>(0);

  const numericValue = parseInt(result.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = result.replace(/[0-9]/g, "");

  // Count-up animation with synchronized sound
  useEffect(() => {
    if (numericValue === 0) return;
    const duration = 1200;
    const startTime = performance.now();

    startCountUpSound();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCountValue(Math.round(eased * numericValue));
      updateCountUpSound(progress);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        stopCountUpSound();
        setCountDone(true);
        setWinPulse(true);
        playFinalDing();
        setTimeout(() => setWinPulse(false), 600);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      stopCountUpSound();
    };
  }, [numericValue]);

  // Shine sweep after count finishes, then show countdown
  useEffect(() => {
    if (!countDone) return;
    const t = setTimeout(() => {
      setShowShine(true);
      // Show countdown after animations settle
      setTimeout(() => setShowCountdown(true), 1800);
    }, 400);
    return () => clearTimeout(t);
  }, [countDone]);

  // Stable sparkle positions
  const [sparkles] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      top: 8 + ((i * 37 + 13) % 75),
      left: 8 + ((i * 53 + 7) % 80),
      size: 3 + ((i * 17) % 4),
      delay: 0.6 + i * 0.25,
      dur: 1.5 + ((i * 11) % 10) / 10,
    }))
  );

  // Stable coin positions
  const [coins] = useState(() => [
    { top: 10, left: -6, delay: 0.8, dur: 3 },
    { top: 60, right: -8, delay: 1.2, dur: 3.5 },
    { top: 35, left: -10, delay: 1.6, dur: 4 },
  ]);

  return (
    <div className="relative w-full max-w-sm">
      {/* Background golden spotlight */}
      <div
        className="absolute -inset-x-12 -inset-y-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, hsl(42 100% 55% / 0.12) 0%, hsl(42 100% 55% / 0.05) 35%, transparent 70%)",
        }}
      />

      {/* Floating gold sparkles */}
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            background: "hsl(45 100% 70%)",
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            animation: `sparkle ${s.dur}s ease-in-out ${s.delay}s both`,
            animationIterationCount: "3",
          }}
        />
      ))}

      {/* Floating gold coins */}
      {coins.map((c, i) => (
        <div
          key={`coin-${i}`}
          className="absolute pointer-events-none z-20"
          style={{
            top: `${c.top}%`,
            left: c.left !== undefined ? `${c.left}%` : undefined,
            right: c.right !== undefined ? `${c.right}%` : undefined,
            animation: `coin-float ${c.dur}s ease-in-out ${c.delay}s both`,
            animationIterationCount: "1",
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: 22,
              height: 22,
              background: "linear-gradient(160deg, hsl(42 100% 78%), hsl(38 90% 50%), hsl(35 80% 38%))",
              boxShadow: "0 2px 6px hsl(42 100% 50% / 0.4), inset 0 1px 2px hsl(42 100% 90% / 0.4)",
              border: "1.5px solid hsl(42 100% 65% / 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 900,
              color: "hsl(35 80% 30%)",
            }}
          >
            $
          </div>
        </div>
      ))}

      {/* Gold Badge / Medallion */}
      <div className="relative z-10 flex justify-center mb-[-32px]">
        <div className="prize-badge-v2">
          <div className="prize-badge-v2-rim" />
          <div className="prize-badge-v2-inner">
            <span className="text-xl leading-none">🏆</span>
          </div>
          <div className="prize-badge-shine" />
        </div>
      </div>

      {/* Card body — clean premium, no ticket cutouts */}
      <div className="prize-card-v3 relative z-[5] overflow-hidden">
        {/* Border shine sweep */}
        {showShine && (
          <div className="absolute inset-0 pointer-events-none z-20 prize-border-shine" />
        )}

        {/* Inner golden glow */}
        <div
          className="absolute inset-0 pointer-events-none z-[1] rounded-[18px]"
          style={{
            boxShadow:
              "inset 0 0 40px hsl(42 100% 55% / 0.06), inset 0 0 80px hsl(42 100% 55% / 0.03)",
          }}
        />

        {/* Inner content */}
        <div className="relative z-10 pt-12 pb-6 px-6 text-center">
          {/* Top label */}
          <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-casino-gold/60 mb-2 stagger-1">
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
            <span className={`prize-hero-number-v2 ${countDone ? 'prize-number-glow' : ''} ${winPulse ? 'win-number-pulse' : ''}`}>
              {countValue}{suffix}
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground mt-3 mb-4 stagger-3">
            BONO DE BIENVENIDA
          </p>

          {/* Countdown inside card — centered pill, delayed */}
          {countdownText && showCountdown && (
            <div className="flex items-center justify-center gap-2 mt-5 animate-in fade-in-0 duration-700" style={{ animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <span className="inline-flex items-center gap-1.5 glass-card rounded-full px-3.5 py-1.5 text-[10px] text-muted-foreground/70">
                Tu bono expira en:
                <span className="font-mono font-bold text-xs text-destructive countdown-urgency-glow">{countdownText}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrizeTicket;
