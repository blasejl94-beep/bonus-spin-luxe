import React, { useEffect, useState, useRef } from "react";
import { playRewardTick, ensureRewardTickCtx, playFinalDing } from "@/lib/sounds";

interface PrizeTicketProps {
  result: string;
  onRevealComplete?: () => void;
  countdownText?: string;
  isUrgent?: boolean;
  onCountProgress?: (progress: number) => void;
}

const PrizeTicket: React.FC<PrizeTicketProps> = ({ result, onRevealComplete, countdownText, isUrgent, onCountProgress }) => {
  const [showShine, setShowShine] = useState(false);
  const [countValue, setCountValue] = useState(0);
  const [countDone, setCountDone] = useState(false);
  const [winPulse, setWinPulse] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [breathing, setBreathing] = useState(false);
  const [badgeScale, setBadgeScale] = useState(0.85);
  const rafRef = useRef<number>(0);

  const numericValue = parseInt(result.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = result.replace(/[0-9]/g, "");

  // Count-up animation with casino-style ticking sounds
  useEffect(() => {
    if (numericValue === 0) return;
    const duration = 1400; // ~1.4s count + 0.1s pause before ding
    const startTime = performance.now();
    let lastTickValue = -1;

    ensureRewardTickCtx();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(eased * numericValue);
      setCountValue(currentValue);
      onCountProgress?.(progress);
      setGlowIntensity(progress);

      // Play tick only when displayed number changes
      if (currentValue !== lastTickValue) {
        lastTickValue = currentValue;
        playRewardTick(progress);
      }

      // Badge scale: grows from 0.85 to 1.15 during count
      const scaleProgress = 0.85 + progress * 0.3;
      setBadgeScale(scaleProgress);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // 0.1s micro-pause before the final CLING
        setTimeout(() => {
          setCountDone(true);
          setWinPulse(true);
          playFinalDing();

          // Smooth bounce: overshoot from 1.15 → 1.2, then settle
          setBadgeScale(1.2);
          setTimeout(() => setBadgeScale(0.97), 200);
          setTimeout(() => setBadgeScale(1.04), 400);
          setTimeout(() => setBadgeScale(1), 550);

          setTimeout(() => setWinPulse(false), 600);
          setTimeout(() => {
            setGlowIntensity(0.3);
            setTimeout(() => setBreathing(true), 800);
          }, 600);
        }, 100);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [numericValue]);

  // Shine sweep after count finishes, then show countdown
  useEffect(() => {
    if (!countDone) return;
    const t = setTimeout(() => {
      setShowShine(true);
      setTimeout(() => setShowCountdown(true), 1800);
    }, 400);
    return () => clearTimeout(t);
  }, [countDone]);

  // Sparkle positions — fewer, appear gradually after count
  const [sparkles] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      top: 8 + ((i * 37 + 11) % 80),
      left: 5 + ((i * 53 + 5) % 85),
      size: 3 + ((i * 13) % 4),
      delay: 2.5 + i * 0.6, // start after count finishes
      dur: 2.2 + ((i * 7) % 12) / 10,
    }))
  );

  // Badge sparkle positions — fewer, staggered entrance after count
  const [badgeSparkles] = useState(() =>
    Array.from({ length: 10 }, (_, i) => {
      const angle = (i * (360 / 10)) * (Math.PI / 180);
      const radius = 26 + (i % 3) * 12;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: 2.5 + (i % 4),
        delay: 2.2 + i * 0.25, // appear after count
        dur: 1.5 + (i % 4) * 0.3,
      };
    })
  );

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

      {/* Floating gold sparkles — infinite */}
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
            animation: `sparkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* Gold Badge / Medallion */}
      <div className="relative z-10 flex justify-center mb-[-32px]">
        <div
          className={`relative ${countDone ? 'badge-alive' : ''}`}
          style={{
            transform: `scale(${badgeScale})`,
            transition: countDone ? 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.05s linear',
          }}
        >
          {/* Permanent sparkles around badge — infinite */}
          {badgeSparkles.map((s, i) => (
            <div
              key={`bs-${i}`}
              className="absolute pointer-events-none z-30 badge-sparkle-permanent"
              style={{
                left: `calc(50% + ${s.x}px - ${s.size / 2}px)`,
                top: `calc(50% + ${s.y}px - ${s.size / 2}px)`,
                width: s.size,
                height: s.size,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.dur}s`,
              }}
            />
          ))}
          <div className="prize-badge-v2">
            <div className="prize-badge-v2-rim" />
            <div className="prize-badge-v2-inner">
              <span className="text-xl leading-none">🏆</span>
            </div>
            <div className={`prize-badge-shine ${countDone ? 'prize-badge-shine-loop' : ''}`} />
          </div>
        </div>
      </div>

      {/* Card body — alive with subtle motion */}
      <div
        className={`prize-card-v3 relative z-[5] overflow-hidden ${breathing ? 'glow-breathing card-alive' : ''}`}
        style={{
          boxShadow: glowIntensity > 0
            ? `inset 0 0 ${10 + glowIntensity * 25}px ${3 + glowIntensity * 8}px hsl(42 100% 55% / ${glowIntensity * 0.18}), inset 0 0 ${20 + glowIntensity * 35}px ${6 + glowIntensity * 12}px hsl(42 100% 50% / ${glowIntensity * 0.08})`
            : undefined,
          transition: breathing ? undefined : 'box-shadow 0.2s ease-out',
        }}
      >
        {/* Border shine sweep — repeating subtle */}
        {showShine && (
          <div className="absolute inset-0 pointer-events-none z-20 prize-border-shine-loop" />
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
          <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-casino-gold/60 mb-2 stagger-1">
            PREMIO DESBLOQUEADO
          </p>

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
            <span
              className={`prize-hero-number-v2 ${winPulse ? 'win-number-pulse' : ''}`}
              style={{
                filter: glowIntensity > 0
                  ? `drop-shadow(0 0 ${glowIntensity * 20}px hsl(42 100% 60% / ${glowIntensity * 0.5})) drop-shadow(0 0 ${glowIntensity * 40}px hsl(42 100% 55% / ${glowIntensity * 0.2}))`
                  : undefined,
                transition: breathing ? 'filter 3s ease-in-out' : 'filter 0.15s ease-out',
              }}
            >
              {countValue}{suffix}
            </span>
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground mt-3 mb-4 stagger-3">
            BONO DE BIENVENIDA
          </p>

          {countdownText && (
            <div
              className="flex items-center justify-center gap-2 mt-5 transition-opacity duration-1000 ease-out"
              style={{ opacity: showCountdown ? 1 : 0 }}
            >
              <span className="inline-flex items-center gap-1.5 glass-card rounded-full px-3.5 py-1.5 text-[10px] text-muted-foreground/70">
                ⏳ Tu bono expira en
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
