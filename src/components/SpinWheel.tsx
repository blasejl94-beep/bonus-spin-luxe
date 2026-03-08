import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { playTick, playLandingClick, playSlotWin } from "@/lib/sounds";

const SEGMENTS = [
  { label: "50%", color: "hsl(0, 72%, 30%)", colorDark: "hsl(0, 72%, 22%)", weight: 1 },
  { label: "100%", color: "hsl(0, 60%, 20%)", colorDark: "hsl(0, 60%, 14%)", weight: 1 },
  { label: "75%", color: "hsl(0, 72%, 30%)", colorDark: "hsl(0, 72%, 22%)", weight: 1 },
  { label: "150%", color: "hsl(0, 60%, 20%)", colorDark: "hsl(0, 60%, 14%)", weight: 1 },
  { label: "350%", color: "hsl(45, 100%, 51%)", colorDark: "hsl(38, 85%, 38%)", weight: 1 },
  { label: "125%", color: "hsl(0, 72%, 30%)", colorDark: "hsl(0, 72%, 22%)", weight: 1 },
  { label: "175%", color: "hsl(0, 60%, 20%)", colorDark: "hsl(0, 60%, 14%)", weight: 1 },
  { label: "200%", color: "hsl(45, 100%, 51%)", colorDark: "hsl(38, 85%, 38%)", weight: 1.25 },
];

const ALLOWED_INDICES = [1, 3, 5, 6, 7];
const NUM_SEGMENTS = SEGMENTS.length;
const TOTAL_WEIGHT = SEGMENTS.reduce((sum, s) => sum + s.weight, 0);
// Precompute cumulative angles for variable-width segments
const SEGMENT_ANGLES: { start: number; end: number; mid: number }[] = [];
let _cumAngle = 0;
for (const seg of SEGMENTS) {
  const angle = (seg.weight / TOTAL_WEIGHT) * 360;
  SEGMENT_ANGLES.push({ start: _cumAngle, end: _cumAngle + angle, mid: _cumAngle + angle / 2 });
  _cumAngle += angle;
}
const NUM_LEDS = 32;

interface SpinWheelProps {
  onSpinComplete: (result: string) => void;
  disabled?: boolean;
}

type WheelState = "idle" | "spinning" | "celebrating" | "won";

/* ── LED Ring ── */
const LedRing: React.FC<{ state: WheelState }> = React.memo(({ state }) => {
  const leds = useMemo(() =>
    Array.from({ length: NUM_LEDS }, (_, i) => {
      const angle = (i / NUM_LEDS) * 360 - 90;
      const rad = (angle * Math.PI) / 180;
      const pctX = Math.round(46.5 * Math.cos(rad) * 10) / 10;
      const pctY = Math.round(46.5 * Math.sin(rad) * 10) / 10;
      return { pctX, pctY, idx: i };
    }), []
  );

  const stateClass =
    state === "spinning" ? "led-chase" :
    state === "celebrating" ? "led-celebrating" :
    state === "won" ? "led-celebrate" :
    "led-idle";

  const isActive = state === "won" || state === "celebrating";

  return (
    <div className="absolute inset-[4%] pointer-events-none" style={{ zIndex: 5, contain: "layout style" }}>
      {leds.map((led) => (
        <div
          key={led.idx}
          className={stateClass}
          style={{
            position: "absolute",
            left: `${50 + led.pctX}%`,
            top: `${50 + led.pctY}%`,
            width: 7,
            height: 7,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            transformOrigin: "center center",
            background: isActive ? "hsl(42, 100%, 75%)" : "hsl(42, 100%, 65%)",
            boxShadow: isActive
              ? "0 0 10px 3px hsl(42 100% 60% / 0.8)"
              : "0 0 6px 2px hsl(42 100% 55% / 0.6)",
            animationDelay: state === "spinning"
              ? `${(led.idx / NUM_LEDS) * 0.8}s`
              : state === "celebrating"
              ? `${(led.idx / NUM_LEDS) * 0.15}s`
              : state === "won"
              ? `${(led.idx / NUM_LEDS) * 0.3}s`
              : `${(led.idx / NUM_LEDS) * 3}s`,
          }}
        />
      ))}
    </div>
  );
});

/* ── Helpers ── */
function getSegmentUnderPointer(rotationDeg: number): number {
  const angleUnderPointer = ((270 - (rotationDeg % 360)) % 360 + 360) % 360;
  for (let i = 0; i < NUM_SEGMENTS; i++) {
    if (angleUnderPointer >= SEGMENT_ANGLES[i].start && angleUnderPointer < SEGMENT_ANGLES[i].end) return i;
  }
  return 0;
}

function getAngleForSegment(segIndex: number): number {
  return ((270 - SEGMENT_ANGLES[segIndex].mid) % 360 + 360) % 360;
}

function getSegmentAngleSize(index: number): number {
  return SEGMENT_ANGLES[index].end - SEGMENT_ANGLES[index].start;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ onSpinComplete, disabled }) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [phase, setPhase] = useState<"idle" | "spinning" | "bounce" | "celebrating">("idle");
  const [glowIntensity, setGlowIntensity] = useState(0.35);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [wheelState, setWheelState] = useState<WheelState>("idle");
  const [pointerFlick, setPointerFlick] = useState(false);
  const [muted, setMuted] = useState(false);
  const wheelRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTickSegmentRef = useRef<number>(-1);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const mutedRef = useRef(false);
  const isVisibleRef = useRef(true);

  // Keep ref in sync
  useEffect(() => { mutedRef.current = muted; }, [muted]);

  // IntersectionObserver to pause idle glow when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Idle breathing glow — only when visible
  useEffect(() => {
    if (spinning || disabled) return;
    let frame: number;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!isVisibleRef.current) {
        frame = requestAnimationFrame(animate);
        return;
      }
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      setGlowIntensity(0.35 + 0.25 * Math.sin(elapsed * 1.2));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [spinning, disabled]);

  // Tick sound + pointer flick tracker
  useEffect(() => {
    if (!spinning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }
    const checkTick = () => {
      const svg = wheelRef.current;
      if (!svg) { rafRef.current = requestAnimationFrame(checkTick); return; }
      const style = window.getComputedStyle(svg);
      const transform = style.transform;
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
            if (!mutedRef.current) playTick(0.9 + Math.random() * 0.2);
            setPointerFlick(true);
            setTimeout(() => setPointerFlick(false), 100);
          }
        }
      }
      rafRef.current = requestAnimationFrame(checkTick);
    };
    rafRef.current = requestAnimationFrame(checkTick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [spinning]);

  const spin = useCallback(() => {
    if (spinning || disabled) return;
    setSpinning(true);
    setPhase("spinning");
    setGlowIntensity(0.9);
    setHighlightIndex(-1);
    setWheelState("spinning");
    setPointerFlick(false);
    lastTickSegmentRef.current = -1;

    const targetIdx = ALLOWED_INDICES[Math.floor(Math.random() * ALLOWED_INDICES.length)];
    const targetBase = getAngleForSegment(targetIdx);
    const segAngleSize = getSegmentAngleSize(targetIdx);
    const jitter = (Math.random() - 0.5) * (segAngleSize * 0.7);
    const targetAngle = ((targetBase + jitter) % 360 + 360) % 360;

    const fullSpins = 7 + Math.floor(Math.random() * 3);
    const totalRotation = fullSpins * 360 + targetAngle;
    const newRotation = rotation + totalRotation;

    setRotation(newRotation);

    const spinDuration = 4800;
    setTimeout(() => {
      // Phase 1: Bounce (500ms)
      setPhase("bounce");
      setGlowIntensity(1);
      const winIdx = getSegmentUnderPointer(newRotation);
      setHighlightIndex(winIdx);
      if (!mutedRef.current) playLandingClick();

      setTimeout(() => {
        // Phase 2: Celebrating (2000ms)
        setPhase("celebrating");
        setWheelState("celebrating");
        if (!mutedRef.current) playSlotWin();

        setTimeout(() => {
          // Phase 3: Done — fire onSpinComplete
          setWheelState("won");
          setSpinning(false);
          setPhase("idle");
          const winIdx2 = getSegmentUnderPointer(newRotation);
          onSpinComplete(SEGMENTS[winIdx2].label);
        }, 2000);
      }, 500);
    }, spinDuration);
  }, [spinning, disabled, onSpinComplete, rotation]);

  const size = 310;
  const center = size / 2;
  const outerRadius = size / 2 - 2;
  const innerRadius = outerRadius - 8;

  const createSegmentPath = (index: number, r: number) => {
    const startAngle = (SEGMENT_ANGLES[index].start * Math.PI) / 180;
    const endAngle = (SEGMENT_ANGLES[index].end * Math.PI) / 180;
    const x1 = center + r * Math.cos(startAngle);
    const y1 = center + r * Math.sin(startAngle);
    const x2 = center + r * Math.cos(endAngle);
    const y2 = center + r * Math.sin(endAngle);
    const segSize = SEGMENT_ANGLES[index].end - SEGMENT_ANGLES[index].start;
    const largeArc = segSize > 180 ? 1 : 0;
    return `M ${center} ${center} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (index: number) => {
    const midAngle = (SEGMENT_ANGLES[index].mid * Math.PI) / 180;
    const textRadius = innerRadius * 0.62;
    return {
      x: center + textRadius * Math.cos(midAngle),
      y: center + textRadius * Math.sin(midAngle),
      angle: SEGMENT_ANGLES[index].mid,
    };
  };

  const getTransition = () => {
    if (phase === "spinning") return "transform 4.8s cubic-bezier(0.10, 0.58, 0.06, 0.98)";
    if (phase === "bounce") return "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
    return "none";
  };

  const rimNotches = useMemo(() => {
    return Array.from({ length: SEGMENTS.length }, (_, i) => {
      const angle = (SEGMENT_ANGLES[i].start * Math.PI) / 180;
      const r = outerRadius - 3;
      return { cx: center + r * Math.cos(angle), cy: center + r * Math.sin(angle) };
    });
  }, []);

  const isGoldSeg = (label: string) => label === "200%" || label === "350%";
  const isCelebrating = phase === "celebrating";

  return (
    <div ref={containerRef} className="relative flex flex-col items-center mx-auto w-full" style={{ maxWidth: 420, contain: "layout style" }}>
      {/* Mute toggle */}
      <button
        onClick={() => setMuted(m => !m)}
        className="absolute top-0 right-0 z-30 p-2 rounded-full glass-card text-muted-foreground hover:text-foreground transition-colors"
        aria-label={muted ? "Activar sonido" : "Silenciar"}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: "-8%", left: "-2%", right: "-2%",
          aspectRatio: "1/1",
          background: `radial-gradient(circle, hsl(42 100% 55% / ${glowIntensity * 0.18}) 30%, hsl(350 60% 30% / ${glowIntensity * 0.06}) 55%, transparent 70%)`,
          transition: "background 0.8s ease",
          willChange: "background",
        }}
      />

      {/* Wheel container */}
      <div className={`relative w-full overflow-visible mx-auto ${isCelebrating ? "wheel-celebrate-bounce" : ""} ${!spinning && !disabled ? "wheel-idle-wobble" : ""}`} style={{ aspectRatio: "1/1", padding: "4%", contain: "layout paint", willChange: spinning ? "transform" : "auto" }}>
        <LedRing state={wheelState} />

        {/* Soft shadow under wheel */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "2%", left: "calc(10% - 2px)", right: "10%", height: "8%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, hsl(0 0% 0% / 0.55) 0%, transparent 70%)",
            filter: "blur(12px)",
          }}
        />

        {/* Metallic gold outer rim */}
        <div
          className="absolute rounded-full wheel-rim-sheen"
          style={{
            top: "4%", bottom: "4%", left: "calc(4% - 2px)", right: "calc(4% + 2px)",
            padding: 4,
            background: `conic-gradient(from 0deg, hsl(42 100% 70%), hsl(38 80% 40%), hsl(42 100% 65%), hsl(38 85% 30%), hsl(42 100% 72%), hsl(38 80% 38%), hsl(42 100% 68%))`,
            boxShadow: `
              0 0 ${16 + glowIntensity * 30}px hsl(42 100% 55% / ${glowIntensity * 0.4}),
              0 0 ${50 + glowIntensity * 50}px hsl(42 100% 55% / ${glowIntensity * 0.12}),
              inset 0 2px 6px hsl(42 100% 80% / 0.35),
              inset 0 -2px 6px hsl(0 0% 0% / 0.3),
              0 10px 30px hsl(0 0% 0% / 0.5)
            `,
            transition: "box-shadow 0.6s ease",
          }}
        >
          <div
            className="rounded-full w-full h-full"
            style={{
              padding: 5,
              background: `linear-gradient(160deg, hsl(42 100% 62%), hsl(38 80% 32%), hsl(42 100% 48%))`,
              boxShadow: "inset 0 1px 4px hsl(42 100% 80% / 0.4), inset 0 -2px 4px hsl(0 0% 0% / 0.35)",
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
                willChange: spinning ? "transform" : "auto",
                aspectRatio: "1/1",
              }}
            >
              <defs>
                {SEGMENTS.map((seg, i) => {
                  const midAngle = SEGMENT_ANGLES[i].mid;
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
                <radialGradient id="topLight" cx="0.5" cy="0.15" r="0.6">
                  <stop offset="0%" stopColor="white" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="bottomShadow" cx="0.5" cy="0.85" r="0.6">
                  <stop offset="0%" stopColor="black" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="black" stopOpacity="0" />
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
                <filter id="winGlow">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="segGlow">
                  <feGaussianBlur stdDeviation="1" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="textShadow">
                  <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.5)" />
                </filter>
              </defs>

              <circle cx={center} cy={center} r={innerRadius} fill="hsl(0, 60%, 12%)" />

              {SEGMENTS.map((seg, i) => {
                const isHighlighted = i === highlightIndex;
                const gold = isGoldSeg(seg.label);
                const showHighlight = isHighlighted && (wheelState === "won" || wheelState === "celebrating");
                return (
                  <g key={i}>
                    <path
                      d={createSegmentPath(i, innerRadius)}
                      fill={gold ? "url(#winSegGrad)" : `url(#segGrad${i})`}
                      stroke="hsl(42, 100%, 55%)"
                      strokeWidth="1.2"
                    />
                    {showHighlight && (
                      <path
                        d={createSegmentPath(i, innerRadius)}
                        fill="hsl(45, 100%, 60%)"
                        opacity="0.3"
                        className={isCelebrating ? "segment-celebrate-pulse" : "animate-pulse"}
                        filter="url(#winGlow)"
                      />
                    )}
                    <path
                      d={createSegmentPath(i, innerRadius)}
                      fill="none"
                      stroke={gold ? "hsl(45, 100%, 80%)" : "hsl(0, 0%, 100%)"}
                      strokeWidth="0.6"
                      opacity={gold ? 0.5 : 0.06}
                    />
                    <text
                      x={getTextPosition(i).x} y={getTextPosition(i).y}
                      fill={gold ? "hsl(0, 0%, 5%)" : "hsl(0, 0%, 95%)"}
                      fontWeight="900" fontSize="14" fontFamily="'Space Grotesk', sans-serif"
                      textAnchor="middle" dominantBaseline="central"
                      transform={`rotate(${getTextPosition(i).angle}, ${getTextPosition(i).x}, ${getTextPosition(i).y})`}
                      filter="url(#textShadow)" style={{ letterSpacing: "0.5px" }}
                    >{seg.label}</text>
                  </g>
                );
              })}

              {rimNotches.map((notch, i) => (
                <circle key={`notch-${i}`} cx={notch.cx} cy={notch.cy} r="3.5" fill="url(#hubGrad)" stroke="hsl(38, 85%, 30%)" strokeWidth="0.5" />
              ))}

              <circle cx={center} cy={center} r={innerRadius} fill="url(#topLight)" />
              <circle cx={center} cy={center} r={innerRadius} fill="url(#bottomShadow)" />
              <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="hsl(42, 100%, 55%)" strokeWidth="2" opacity="0.3" />

              <circle cx={center} cy={center} r="30" fill="url(#hubGrad)" stroke="hsl(38, 85%, 25%)" strokeWidth="2" filter="url(#segGlow)" />
              <circle cx={center} cy={center} r="24" fill="url(#hubInner)" stroke="hsl(42, 100%, 50%)" strokeWidth="1.2" />
              <ellipse cx={center - 4} cy={center - 6} rx="10" ry="7" fill="white" opacity="0.08" />
              <text x={center} y={center} fill="hsl(42, 100%, 60%)" fontWeight="900" fontSize="10" fontFamily="'Space Grotesk', sans-serif" textAnchor="middle" dominantBaseline="central" style={{ letterSpacing: "1.5px" }}>BONUS</text>
            </svg>
          </div>
        </div>

        {/* 3D Pointer */}
        <div
          ref={pointerRef}
          className={`absolute z-20 ${!spinning && !disabled ? "wiggle-idle" : ""} ${phase === "bounce" ? "pointer-bounce" : ""} ${pointerFlick ? "pointer-flick" : ""}`}
          style={{ top: "3.5%", left: "calc(50% - 2px)", transform: "translateX(-50%)" }}
        >
          <svg width="36" height="44" viewBox="0 0 36 44">
            <defs>
              <linearGradient id="pointerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 90%, 55%)" />
                <stop offset="40%" stopColor="hsl(0, 85%, 45%)" />
                <stop offset="100%" stopColor="hsl(0, 80%, 30%)" />
              </linearGradient>
              <filter id="pointerShadow">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.6)" />
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="hsl(0, 85%, 45%)" floodOpacity="0.5" />
              </filter>
            </defs>
            <polygon points="18,40 6,4 18,10 30,4" fill="url(#pointerGrad)" stroke="hsl(0, 70%, 25%)" strokeWidth="1" filter="url(#pointerShadow)" />
            <polygon points="18,38 14,8 18,12" fill="hsl(0, 100%, 80%)" opacity="0.35" />
            <circle cx="18" cy="6" r="4" fill="url(#pointerGrad)" stroke="hsl(0,70%,25%)" strokeWidth="0.8" />
            <circle cx="17" cy="5" r="1.5" fill="hsl(0,100%,85%)" opacity="0.6" />
          </svg>
        </div>
      </div>


      {/* Spin button */}
      <button
        onClick={spin}
        disabled={spinning || disabled}
        className={`mt-4 px-12 py-4 rounded-full font-black text-lg tracking-wide gold-gradient text-primary-foreground pulse-glow disabled:opacity-50 disabled:animate-none transition-all spin-btn-hover uppercase ${!spinning && !disabled ? "bounce-cta" : ""}`}
        style={{
          boxShadow: spinning
            ? "0 4px 16px hsl(42 100% 55% / 0.3)"
            : "0 4px 24px hsl(42 100% 55% / 0.4), 0 0 40px hsl(42 100% 55% / 0.15), 0 8px 16px hsl(0 0% 0% / 0.3)",
        }}
      >
        {spinning ? "Girando..." : disabled ? "Ya giraste" : "🎰 GIRAR AHORA"}
      </button>
    </div>
  );
};

export default SpinWheel;
