import React, { useCallback, useEffect, useRef, useState } from "react";
import { playTick, playLandingClick } from "@/lib/sounds";
import Confetti from "@/components/Confetti";

const SEGMENTS = [
  { label: "50%", color: "hsl(0, 72%, 30%)", colorDark: "hsl(0, 72%, 22%)" },
  { label: "75%", color: "hsl(0, 60%, 20%)", colorDark: "hsl(0, 60%, 14%)" },
  { label: "100%", color: "hsl(0, 72%, 30%)", colorDark: "hsl(0, 72%, 22%)" },
  { label: "125%", color: "hsl(0, 60%, 20%)", colorDark: "hsl(0, 60%, 14%)" },
  { label: "150%", color: "hsl(0, 72%, 30%)", colorDark: "hsl(0, 72%, 22%)" },
  { label: "175%", color: "hsl(0, 60%, 20%)", colorDark: "hsl(0, 60%, 14%)" },
  { label: "200%", color: "hsl(45, 100%, 51%)", colorDark: "hsl(38, 85%, 38%)" },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length;
const NUM_SEGMENTS = SEGMENTS.length;
const NUM_LEDS = 16;

interface SpinWheelProps {
  onSpinComplete: (result: string) => void;
  disabled?: boolean;
}

type WheelState = "idle" | "spinning" | "won";

function getSegmentUnderPointer(rotationDeg: number): number {
  const angleUnderPointer = ((270 - (rotationDeg % 360)) % 360 + 360) % 360;
  return Math.floor(angleUnderPointer / SEGMENT_ANGLE) % NUM_SEGMENTS;
}

const LedRingCanvas: React.FC<{ state: WheelState }> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let rafId = 0;
    let lastW = 0;
    let lastH = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextW = Math.max(1, Math.floor(rect.width * dpr));
      const nextH = Math.max(1, Math.floor(rect.height * dpr));

      if (nextW !== lastW || nextH !== lastH) {
        canvas.width = nextW;
        canvas.height = nextH;
        lastW = nextW;
        lastH = nextH;
      }
    };

    let wonStart = 0;

    const draw = () => {
      frame += 1;
      if (frame % 12 === 0) resize();

      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const radius = Math.min(w, h) * 0.42;
      const dotRadius = Math.max(2, Math.min(w, h) * 0.0085);
      const time = performance.now();

      ctx.clearRect(0, 0, w, h);

      const chaseHead = (time * 0.02) % NUM_LEDS;

      for (let i = 0; i < NUM_LEDS; i += 1) {
        const angle = -Math.PI / 2 + (i / NUM_LEDS) * Math.PI * 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);

        let alpha = 0.22;

        if (state === "spinning") {
          const distance = (i - chaseHead + NUM_LEDS) % NUM_LEDS;
          alpha = distance < 4 ? 0.2 + (4 - distance) * 0.16 : 0.1;
        } else if (state === "won") {
          if (!wonStart) wonStart = time;
          alpha = reducedMotion ? 0.58 : 0.45 + 0.38 * Math.sin(time * 0.03 - i * 0.5);
        } else {
          // idle: static draw
          alpha = 0.24;
        }

        const clampedAlpha = Math.max(0.08, Math.min(alpha, 0.86));

        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(42 100% 62% / ${clampedAlpha})`;
        ctx.fill();
      }

      // Only continue rAF loop when spinning or won (for max 2.5s)
      if (state === "spinning") {
        rafId = requestAnimationFrame(draw);
      } else if (state === "won" && wonStart && (performance.now() - wonStart < 2500)) {
        rafId = requestAnimationFrame(draw);
      }
      // idle: no loop — drawn once
    };

    resize();
    rafId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [state]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />;
};

const SpinWheel: React.FC<SpinWheelProps> = ({ onSpinComplete, disabled }) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [phase, setPhase] = useState<"idle" | "spinning" | "bounce">("idle");
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [wheelState, setWheelState] = useState<WheelState>("idle");
  const [showWinConfetti, setShowWinConfetti] = useState(false);
  const wheelRef = useRef<SVGSVGElement>(null);
  const lastTickSegmentRef = useRef<number>(-1);
  const rafRef = useRef<number | null>(null);
  const timeoutIdsRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutIdsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [clearTimers]);

  useEffect(() => {
    if (!spinning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    const checkTick = () => {
      const svg = wheelRef.current;
      if (!svg) {
        rafRef.current = requestAnimationFrame(checkTick);
        return;
      }

      const transform = window.getComputedStyle(svg).transform;
      if (transform && transform !== "none") {
        const values = transform.match(/matrix\((.+)\)/);
        if (values) {
          const parts = values[1].split(", ");
          const a = parseFloat(parts[0]);
          const b = parseFloat(parts[1]);
          const angle = Math.atan2(b, a) * (180 / Math.PI);
          const normalizedAngle = ((angle % 360) + 360) % 360;
          const currentSegment = getSegmentUnderPointer(normalizedAngle);

          if (currentSegment !== lastTickSegmentRef.current) {
            lastTickSegmentRef.current = currentSegment;
            playTick(0.95 + Math.random() * 0.1);
          }
        }
      }

      rafRef.current = requestAnimationFrame(checkTick);
    };

    rafRef.current = requestAnimationFrame(checkTick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [spinning]);

  const spin = useCallback(() => {
    if (spinning || disabled) return;

    clearTimers();
    setSpinning(true);
    setPhase("spinning");
    setHighlightIndex(-1);
    setWheelState("spinning");
    setShowWinConfetti(false);
    lastTickSegmentRef.current = -1;

    const randomAngle = Math.random() * 360;
    const fullSpins = 7 + Math.floor(Math.random() * 2);
    const totalRotation = fullSpins * 360 + randomAngle;
    const finalRotation = rotation + totalRotation;

    setRotation(finalRotation);

    const spinDuration = 4200;

    const stopSpinId = window.setTimeout(() => {
      setPhase("bounce");
      setRotation(finalRotation + 4);

      const settleBackId = window.setTimeout(() => {
        setRotation(finalRotation);

        const winIdx = getSegmentUnderPointer(finalRotation);
        setHighlightIndex(winIdx);
        setWheelState("won");
        setShowWinConfetti(true);
        playLandingClick();

        const completeId = window.setTimeout(() => {
          setSpinning(false);
          setPhase("idle");
          onSpinComplete(SEGMENTS[winIdx].label);

          const hideConfettiId = window.setTimeout(() => {
            setShowWinConfetti(false);
          }, 900);

          timeoutIdsRef.current.push(hideConfettiId);
        }, 320);

        timeoutIdsRef.current.push(completeId);
      }, 140);

      timeoutIdsRef.current.push(settleBackId);
    }, spinDuration);

    timeoutIdsRef.current.push(stopSpinId);
  }, [spinning, disabled, rotation, clearTimers, onSpinComplete]);

  const size = 310;
  const center = size / 2;
  const outerRadius = size / 2 - 2;
  const innerRadius = outerRadius - 8;

  const createSegmentPath = (index: number, r: number) => {
    const startAngle = (index * SEGMENT_ANGLE * Math.PI) / 180;
    const endAngle = ((index + 1) * SEGMENT_ANGLE * Math.PI) / 180;
    const x1 = center + r * Math.cos(startAngle);
    const y1 = center + r * Math.sin(startAngle);
    const x2 = center + r * Math.cos(endAngle);
    const y2 = center + r * Math.sin(endAngle);
    const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;

    return `M ${center} ${center} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (index: number) => {
    const midAngle = ((index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2) * Math.PI) / 180;
    const textRadius = innerRadius * 0.62;

    return {
      x: center + textRadius * Math.cos(midAngle),
      y: center + textRadius * Math.sin(midAngle),
      angle: index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2,
    };
  };

  const getTransition = () => {
    if (phase === "spinning") return "transform 4.2s cubic-bezier(0.12, 0.78, 0.12, 1)";
    if (phase === "bounce") return "transform 0.16s cubic-bezier(0.22, 1.25, 0.36, 1)";
    return "none";
  };

  const rimNotches = Array.from({ length: SEGMENTS.length }, (_, i) => {
    const angle = (i * SEGMENT_ANGLE * Math.PI) / 180;
    const r = outerRadius - 3;

    return {
      cx: center + r * Math.cos(angle),
      cy: center + r * Math.sin(angle),
    };
  });

  return (
    <div className="relative flex flex-col items-center" style={{ width: "min(92vw, 420px)", contain: "layout paint" }}>
      {showWinConfetti && <Confetti />}

      <div
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{
          opacity: wheelState === "won" ? 0.55 : 0.34,
          background:
            "radial-gradient(circle, hsl(42 100% 55% / 0.28) 28%, hsl(42 100% 55% / 0.12) 55%, transparent 74%)",
          transition: "opacity 220ms ease",
        }}
      />

      <div className="relative w-full overflow-visible" style={{ aspectRatio: "1/1", padding: "10%" }}>
        <LedRingCanvas state={wheelState} />

        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "3%",
            left: "14%",
            right: "14%",
            height: "7%",
            borderRadius: "9999px",
            background: "radial-gradient(ellipse, hsl(0 0% 0% / 0.38) 0%, transparent 72%)",
          }}
        />

        <div
          className="absolute inset-[9%] rounded-full"
          style={{
            padding: 4,
            background:
              "conic-gradient(from 0deg, hsl(42 100% 70%), hsl(38 80% 44%), hsl(42 100% 65%), hsl(38 85% 35%), hsl(42 100% 72%), hsl(38 80% 42%), hsl(42 100% 68%))",
            boxShadow: "0 10px 24px hsl(0 0% 0% / 0.34)",
          }}
        >
          <div
            className="rounded-full w-full h-full"
            style={{
              padding: 5,
              background: "linear-gradient(160deg, hsl(42 100% 62%), hsl(38 80% 32%), hsl(42 100% 48%))",
            }}
          >
            <svg
              ref={wheelRef}
              width="100%"
              height="100%"
              viewBox={`0 0 ${size} ${size}`}
              className="rounded-full block"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: getTransition(),
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
            >
              <defs>
                {SEGMENTS.map((seg, i) => {
                  const midAngle = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
                  const rad = (midAngle * Math.PI) / 180;
                  const gx1 = 0.5 + 0.3 * Math.cos(rad);
                  const gy1 = 0.5 + 0.3 * Math.sin(rad);

                  return (
                    <radialGradient key={`segGrad${i}`} id={`segGrad${i}`} cx={gx1} cy={gy1} r="0.7">
                      <stop offset="0%" stopColor={seg.color} />
                      <stop offset="70%" stopColor={seg.colorDark} />
                      <stop offset="100%" stopColor={seg.colorDark} />
                    </radialGradient>
                  );
                })}
                <radialGradient id="winSegGrad" cx="0.5" cy="0.5" r="0.8">
                  <stop offset="0%" stopColor="hsl(45, 100%, 65%)" />
                  <stop offset="50%" stopColor="hsl(42, 100%, 48%)" />
                  <stop offset="100%" stopColor="hsl(38, 85%, 32%)" />
                </radialGradient>
                <radialGradient id="hubGrad" cx="0.4" cy="0.35" r="0.7">
                  <stop offset="0%" stopColor="hsl(42, 100%, 70%)" />
                  <stop offset="50%" stopColor="hsl(42, 100%, 50%)" />
                  <stop offset="100%" stopColor="hsl(38, 85%, 30%)" />
                </radialGradient>
                <radialGradient id="hubInner" cx="0.4" cy="0.35" r="0.6">
                  <stop offset="0%" stopColor="hsl(0, 60%, 22%)" />
                  <stop offset="100%" stopColor="hsl(0, 60%, 10%)" />
                </radialGradient>
              </defs>

              <circle cx={center} cy={center} r={innerRadius} fill="hsl(0, 60%, 12%)" />

              {SEGMENTS.map((seg, i) => {
                const isHighlighted = i === highlightIndex;
                const isGoldSeg = seg.label === "200%";
                const textPos = getTextPosition(i);

                return (
                  <g key={i}>
                    <path
                      d={createSegmentPath(i, innerRadius)}
                      fill={isGoldSeg ? "url(#winSegGrad)" : `url(#segGrad${i})`}
                      stroke="hsl(42, 100%, 55%)"
                      strokeWidth="1.2"
                    />

                    {isHighlighted && wheelState === "won" && (
                      <path
                        d={createSegmentPath(i, innerRadius)}
                        fill="hsl(45, 100%, 62%)"
                        opacity="0.34"
                        className="animate-pulse"
                      />
                    )}

                    <path
                      d={createSegmentPath(i, innerRadius)}
                      fill="none"
                      stroke={isGoldSeg ? "hsl(45, 100%, 80%)" : "hsl(0, 0%, 100%)"}
                      strokeWidth="0.6"
                      opacity={isGoldSeg ? 0.5 : 0.06}
                    />

                    <text
                      x={textPos.x}
                      y={textPos.y}
                      fill={isGoldSeg ? "hsl(0, 0%, 5%)" : "hsl(0, 0%, 95%)"}
                      fontWeight="900"
                      fontSize="14"
                      fontFamily="'Space Grotesk', sans-serif"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${textPos.angle}, ${textPos.x}, ${textPos.y})`}
                      style={{ letterSpacing: "0.45px" }}
                    >
                      {seg.label}
                    </text>
                  </g>
                );
              })}

              {rimNotches.map((notch, i) => (
                <circle
                  key={`notch-${i}`}
                  cx={notch.cx}
                  cy={notch.cy}
                  r="3.2"
                  fill="url(#hubGrad)"
                  stroke="hsl(38, 85%, 30%)"
                  strokeWidth="0.4"
                />
              ))}

              <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="hsl(42, 100%, 55%)" strokeWidth="1.6" opacity="0.25" />
              <circle cx={center} cy={center} r="30" fill="url(#hubGrad)" stroke="hsl(38, 85%, 25%)" strokeWidth="1.6" />
              <circle cx={center} cy={center} r="24" fill="url(#hubInner)" stroke="hsl(42, 100%, 50%)" strokeWidth="1" />
              <text
                x={center}
                y={center}
                fill="hsl(42, 100%, 60%)"
                fontWeight="900"
                fontSize="10"
                fontFamily="'Space Grotesk', sans-serif"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ letterSpacing: "1.4px" }}
              >
                BONUS
              </text>
            </svg>
          </div>
        </div>

        <div
          className={`absolute z-20 ${phase === "bounce" ? "pointer-bounce" : ""}`}
          style={{ top: "3%", left: "50%", transform: "translateX(-50%)" }}
        >
          <svg width="36" height="44" viewBox="0 0 36 44">
            <defs>
              <linearGradient id="pointerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(42, 100%, 70%)" />
                <stop offset="40%" stopColor="hsl(42, 100%, 51%)" />
                <stop offset="100%" stopColor="hsl(38, 85%, 35%)" />
              </linearGradient>
            </defs>
            <polygon points="18,40 6,4 18,10 30,4" fill="url(#pointerGrad)" stroke="hsl(38, 85%, 30%)" strokeWidth="1" />
            <polygon points="18,38 14,8 18,12" fill="hsl(42, 100%, 75%)" opacity="0.3" />
            <circle cx="18" cy="6" r="4" fill="url(#pointerGrad)" stroke="hsl(38,85%,30%)" strokeWidth="0.8" />
            <circle cx="17" cy="5" r="1.5" fill="hsl(42,100%,80%)" opacity="0.6" />
          </svg>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 glass-card rounded-full px-4 py-2 text-xs">
        <span>🔥</span>
        <span className="text-muted-foreground">Bonos disponibles hoy:</span>
        <span className="font-bold text-casino-gold">12 restantes</span>
      </div>

      <button
        onClick={spin}
        disabled={spinning || disabled}
        className="mt-4 px-12 py-4 rounded-full font-black text-lg tracking-wide gold-gradient text-primary-foreground disabled:opacity-50 transition-transform active:scale-[0.98] uppercase"
      >
        {spinning ? "Girando..." : disabled ? "Ya giraste" : "🎰 Girar ahora"}
      </button>
    </div>
  );
};

export default SpinWheel;
