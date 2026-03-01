import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";

const SEGMENTS = [
  { label: "50%", color: "hsl(0, 72%, 30%)", colorDark: "hsl(0, 72%, 22%)" },
  { label: "100%", color: "hsl(0, 60%, 20%)", colorDark: "hsl(0, 60%, 14%)" },
  { label: "150%", color: "hsl(0, 72%, 30%)", colorDark: "hsl(0, 72%, 22%)" },
  { label: "200%", color: "hsl(0, 60%, 20%)", colorDark: "hsl(0, 60%, 14%)" },
  { label: "250%", color: "hsl(0, 72%, 30%)", colorDark: "hsl(0, 72%, 22%)" },
  { label: "300%", color: "hsl(0, 60%, 20%)", colorDark: "hsl(0, 60%, 14%)" },
  { label: "350%", color: "hsl(45, 100%, 51%)", colorDark: "hsl(38, 85%, 38%)" },
];

const WINNING_INDEX = 6;
const SEGMENT_ANGLE = 360 / SEGMENTS.length;

interface SpinWheelProps {
  onSpinComplete: (result: string) => void;
  disabled?: boolean;
}

const WheelSparkles: React.FC<{ spinning: boolean }> = ({ spinning }) => {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        angle: (i / 16) * 360,
        distance: 168 + Math.random() * 20,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 2,
      })),
    []
  );

  return (
    <>
      {sparkles.map((s) => {
        const rad = (s.angle * Math.PI) / 180;
        const x = Math.cos(rad) * s.distance;
        const y = Math.sin(rad) * s.distance;
        return (
          <div
            key={s.id}
            className="absolute sparkle pointer-events-none"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              width: s.size,
              height: s.size,
              animation: `sparkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
              opacity: spinning ? 0.3 : 1,
              transition: "opacity 0.5s",
            }}
          />
        );
      })}
    </>
  );
};

const SpinWheel: React.FC<SpinWheelProps> = ({ onSpinComplete, disabled }) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [phase, setPhase] = useState<"idle" | "fast" | "slow" | "bounce">("idle");
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [winHighlight, setWinHighlight] = useState(false);
  const wheelRef = useRef<SVGSVGElement>(null);

  // Idle breathing glow
  useEffect(() => {
    if (spinning || disabled) return;
    let frame: number;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      setGlowIntensity(0.35 + 0.25 * Math.sin(elapsed * 1.2));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [spinning, disabled]);

  const spin = useCallback(() => {
    if (spinning || disabled) return;
    setSpinning(true);
    setPhase("fast");
    setGlowIntensity(0.9);
    setWinHighlight(false);

    const segmentCenter = WINNING_INDEX * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const targetAngle = 270 - segmentCenter;
    const fullSpins = 7 + Math.floor(Math.random() * 3);
    const totalRotation = fullSpins * 360 + targetAngle + (Math.random() * 10 - 5);

    setRotation((prev) => prev + totalRotation);

    setTimeout(() => setPhase("slow"), 2200);
    setTimeout(() => {
      setPhase("bounce");
      setGlowIntensity(1);
      setWinHighlight(true);
      // Landing click sound
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 1200;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch {}
    }, 4400);

    setTimeout(() => {
      setSpinning(false);
      setPhase("idle");
      onSpinComplete(SEGMENTS[WINNING_INDEX].label);
    }, 5000);
  }, [spinning, disabled, onSpinComplete]);

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
    if (phase === "fast") return "transform 4.8s cubic-bezier(0.10, 0.58, 0.06, 0.98)";
    if (phase === "bounce") return "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
    return "none";
  };

  // Rim notch positions (like real casino wheel pegs)
  const rimNotches = useMemo(() => {
    return Array.from({ length: SEGMENTS.length }, (_, i) => {
      const angle = (i * SEGMENT_ANGLE * Math.PI) / 180;
      const r = outerRadius - 3;
      return {
        cx: center + r * Math.cos(angle),
        cy: center + r * Math.sin(angle),
      };
    });
  }, []);

  // Decorative dots on rim
  const rimDots = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => {
      const angle = ((i / 28) * 360 * Math.PI) / 180;
      const r = outerRadius + 4;
      return {
        cx: center + r * Math.cos(angle),
        cy: center + r * Math.sin(angle),
      };
    });
  }, []);

  return (
    <div className="relative flex flex-col items-center" style={{ minHeight: 420 }}>
      {/* Floating sparkles */}
      <WheelSparkles spinning={spinning} />

      {/* Drop shadow beneath wheel */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: 52,
          left: "50%",
          transform: "translateX(-50%)",
          width: size + 40,
          height: 30,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, hsl(0 0% 0% / 0.5) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* Outer ambient glow */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: -20,
          left: "50%",
          transform: "translateX(-50%)",
          width: size + 60,
          height: size + 60,
          background: `radial-gradient(circle, hsl(42 100% 55% / ${glowIntensity * 0.2}) 40%, hsl(350 60% 30% / ${glowIntensity * 0.08}) 60%, transparent 70%)`,
          transition: "background 0.6s ease",
        }}
      />

      {/* 3D Pointer */}
      <div
        className={`absolute z-20 ${!spinning && !disabled ? "wiggle-idle" : ""} ${phase === "bounce" ? "pointer-bounce" : ""}`}
        style={{ top: -6, left: "50%", transform: "translateX(-50%)" }}
      >
        <svg width="36" height="44" viewBox="0 0 36 44">
          <defs>
            <linearGradient id="pointerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(42, 100%, 70%)" />
              <stop offset="40%" stopColor="hsl(42, 100%, 51%)" />
              <stop offset="100%" stopColor="hsl(38, 85%, 35%)" />
            </linearGradient>
            <filter id="pointerShadow">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.6)" />
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="hsl(42, 100%, 51%)" floodOpacity="0.4" />
            </filter>
          </defs>
          <polygon
            points="18,40 6,4 18,10 30,4"
            fill="url(#pointerGrad)"
            stroke="hsl(38, 85%, 30%)"
            strokeWidth="1"
            filter="url(#pointerShadow)"
          />
          {/* Highlight stripe */}
          <polygon points="18,38 14,8 18,12" fill="hsl(42, 100%, 75%)" opacity="0.3" />
          {/* Top circle */}
          <circle cx="18" cy="6" r="4" fill="url(#pointerGrad)" stroke="hsl(38,85%,30%)" strokeWidth="0.8" />
          <circle cx="17" cy="5" r="1.5" fill="hsl(42,100%,80%)" opacity="0.6" />
        </svg>
      </div>

      {/* Main wheel container */}
      <div
        className={`rounded-full ${phase === "fast" ? "wheel-spin-pulse" : ""}`}
        style={{
          padding: 3,
          background: `linear-gradient(145deg, hsl(42 100% 70%), hsl(42 100% 50%), hsl(38 85% 30%), hsl(42 100% 55%))`,
          boxShadow: `
            0 0 ${16 + glowIntensity * 30}px hsl(42 100% 55% / ${glowIntensity * 0.45}),
            0 0 ${50 + glowIntensity * 50}px hsl(42 100% 55% / ${glowIntensity * 0.15}),
            inset 0 2px 4px hsl(42 100% 80% / 0.3),
            0 8px 24px hsl(0 0% 0% / 0.5)
          `,
          transition: "box-shadow 0.6s ease",
        }}
      >
        {/* Inner metallic rim */}
        <div
          className="rounded-full"
          style={{
            padding: 5,
            background: `linear-gradient(160deg, hsl(42 100% 65%), hsl(38 80% 35%), hsl(42 100% 50%))`,
            boxShadow: "inset 0 1px 3px hsl(42 100% 80% / 0.4), inset 0 -2px 4px hsl(0 0% 0% / 0.3)",
          }}
        >
          <svg
            ref={wheelRef}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="rounded-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: getTransition(),
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
            }}
          >
            <defs>
              {/* 3D segment gradient for red segments */}
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

              {/* Winning segment animated glow */}
              <radialGradient id="winSegGrad" cx="0.5" cy="0.5" r="0.8">
                <stop offset="0%" stopColor="hsl(45, 100%, 65%)" />
                <stop offset="50%" stopColor="hsl(42, 100%, 48%)" />
                <stop offset="100%" stopColor="hsl(38, 85%, 32%)" />
              </radialGradient>

              {/* Top light reflection overlay */}
              <radialGradient id="topLight" cx="0.5" cy="0.15" r="0.6">
                <stop offset="0%" stopColor="white" stopOpacity="0.12" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>

              {/* Bottom shadow */}
              <radialGradient id="bottomShadow" cx="0.5" cy="0.85" r="0.6">
                <stop offset="0%" stopColor="black" stopOpacity="0.15" />
                <stop offset="100%" stopColor="black" stopOpacity="0" />
              </radialGradient>

              {/* Center hub gradient */}
              <radialGradient id="hubGrad" cx="0.4" cy="0.35" r="0.7">
                <stop offset="0%" stopColor="hsl(42, 100%, 70%)" />
                <stop offset="50%" stopColor="hsl(42, 100%, 50%)" />
                <stop offset="100%" stopColor="hsl(38, 85%, 30%)" />
              </radialGradient>

              <radialGradient id="hubInner" cx="0.4" cy="0.35" r="0.6">
                <stop offset="0%" stopColor="hsl(0, 60%, 22%)" />
                <stop offset="100%" stopColor="hsl(0, 60%, 10%)" />
              </radialGradient>

              {/* Glow filters */}
              <filter id="winGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="segGlow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="textShadow">
                <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.5)" />
              </filter>
            </defs>

            {/* Background circle */}
            <circle cx={center} cy={center} r={innerRadius} fill="hsl(0, 60%, 12%)" />

            {/* Segments with 3D gradients */}
            {SEGMENTS.map((seg, i) => (
              <g key={i}>
                {/* Main segment fill */}
                <path
                  d={createSegmentPath(i, innerRadius)}
                  fill={i === WINNING_INDEX ? "url(#winSegGrad)" : `url(#segGrad${i})`}
                  stroke="hsl(42, 100%, 55%)"
                  strokeWidth="1.2"
                />
                {/* Bevel highlight (top edge of segment) */}
                <path
                  d={createSegmentPath(i, innerRadius)}
                  fill="none"
                  stroke={i === WINNING_INDEX ? "hsl(45, 100%, 80%)" : "hsl(0, 0%, 100%)"}
                  strokeWidth="0.6"
                  opacity={i === WINNING_INDEX ? 0.5 : 0.06}
                />
                {/* Win highlight pulse */}
                {i === WINNING_INDEX && winHighlight && (
                  <path
                    d={createSegmentPath(i, innerRadius)}
                    fill="hsl(45, 100%, 60%)"
                    opacity="0.25"
                    className="animate-pulse"
                  />
                )}
                {/* Segment text */}
                <text
                  x={getTextPosition(i).x}
                  y={getTextPosition(i).y}
                  fill={i === WINNING_INDEX ? "hsl(0, 0%, 5%)" : "hsl(0, 0%, 95%)"}
                  fontWeight="900"
                  fontSize="15"
                  fontFamily="'Space Grotesk', sans-serif"
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`rotate(${getTextPosition(i).angle}, ${getTextPosition(i).x}, ${getTextPosition(i).y})`}
                  filter="url(#textShadow)"
                  style={{ letterSpacing: "0.5px" }}
                >
                  {seg.label}
                </text>
              </g>
            ))}

            {/* Divider lines between segments (gold pegs) */}
            {rimNotches.map((notch, i) => (
              <circle
                key={`notch-${i}`}
                cx={notch.cx}
                cy={notch.cy}
                r="3.5"
                fill="url(#hubGrad)"
                stroke="hsl(38, 85%, 30%)"
                strokeWidth="0.5"
              />
            ))}

            {/* Top light reflection overlay */}
            <circle cx={center} cy={center} r={innerRadius} fill="url(#topLight)" />
            {/* Bottom shadow overlay */}
            <circle cx={center} cy={center} r={innerRadius} fill="url(#bottomShadow)" />

            {/* Outer ring inside the wheel */}
            <circle
              cx={center}
              cy={center}
              r={innerRadius}
              fill="none"
              stroke="hsl(42, 100%, 55%)"
              strokeWidth="2"
              opacity="0.3"
            />

            {/* Center hub - outer metallic ring */}
            <circle
              cx={center}
              cy={center}
              r="30"
              fill="url(#hubGrad)"
              stroke="hsl(38, 85%, 25%)"
              strokeWidth="2"
              filter="url(#segGlow)"
            />
            {/* Center hub - inner dark circle */}
            <circle
              cx={center}
              cy={center}
              r="24"
              fill="url(#hubInner)"
              stroke="hsl(42, 100%, 50%)"
              strokeWidth="1.2"
            />
            {/* Hub highlight */}
            <ellipse
              cx={center - 4}
              cy={center - 6}
              rx="10"
              ry="7"
              fill="white"
              opacity="0.08"
            />
            {/* BONUS text */}
            <text
              x={center}
              y={center}
              fill="hsl(42, 100%, 60%)"
              fontWeight="900"
              fontSize="10"
              fontFamily="'Space Grotesk', sans-serif"
              textAnchor="middle"
              dominantBaseline="central"
              style={{ letterSpacing: "1.5px" }}
            >
              BONUS
            </text>
          </svg>
        </div>
      </div>

      {/* Urgency indicator */}
      <div className="mt-5 flex items-center gap-2 glass-card rounded-full px-4 py-2 text-xs">
        <span>🔥</span>
        <span className="text-muted-foreground">Bonos disponibles hoy:</span>
        <span className="font-bold text-casino-gold">12 restantes</span>
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
        {spinning ? "Girando..." : disabled ? "Ya giraste" : "🎰 Girar ahora"}
      </button>
    </div>
  );
};

export default SpinWheel;
