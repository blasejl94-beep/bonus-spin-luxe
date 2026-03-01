import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";

const SEGMENTS = [
  { label: "50%", color: "hsl(0, 72%, 30%)" },
  { label: "100%", color: "hsl(0, 60%, 20%)" },
  { label: "150%", color: "hsl(0, 72%, 30%)" },
  { label: "200%", color: "hsl(0, 60%, 20%)" },
  { label: "250%", color: "hsl(0, 72%, 30%)" },
  { label: "300%", color: "hsl(0, 60%, 20%)" },
  { label: "350%", color: "hsl(45, 100%, 51%)" },
];

const WINNING_INDEX = 6;
const SEGMENT_ANGLE = 360 / SEGMENTS.length;

interface SpinWheelProps {
  onSpinComplete: (result: string) => void;
  disabled?: boolean;
}

// Floating sparkle around the wheel
const WheelSparkles: React.FC = () => {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i / 12) * 360,
        distance: 155 + Math.random() * 25,
        size: 3 + Math.random() * 5,
        delay: Math.random() * 3,
        duration: 1.5 + Math.random() * 2,
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
            className="absolute sparkle"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              width: s.size,
              height: s.size,
              animation: `sparkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
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
  const wheelRef = useRef<SVGSVGElement>(null);

  // Idle breathing glow
  useEffect(() => {
    if (spinning || disabled) return;
    let frame: number;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      setGlowIntensity(0.3 + 0.2 * Math.sin(elapsed * 1.5));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [spinning, disabled]);

  const spin = useCallback(() => {
    if (spinning || disabled) return;
    setSpinning(true);
    setPhase("fast");
    setGlowIntensity(0.8);

    const segmentCenter = WINNING_INDEX * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const targetAngle = 270 - segmentCenter;
    const fullSpins = 6 + Math.floor(Math.random() * 3);
    const totalRotation = fullSpins * 360 + targetAngle + (Math.random() * 10 - 5);

    setRotation((prev) => prev + totalRotation);

    // Phase transitions for visual feedback
    setTimeout(() => setPhase("slow"), 2000);
    setTimeout(() => {
      setPhase("bounce");
      setGlowIntensity(1);
      // Play tick sound at landing
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch {}
    }, 4200);

    setTimeout(() => {
      setSpinning(false);
      setPhase("idle");
      onSpinComplete(SEGMENTS[WINNING_INDEX].label);
    }, 4800);
  }, [spinning, disabled, onSpinComplete]);

  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 4;

  const createSegmentPath = (index: number) => {
    const startAngle = (index * SEGMENT_ANGLE * Math.PI) / 180;
    const endAngle = ((index + 1) * SEGMENT_ANGLE * Math.PI) / 180;
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (index: number) => {
    const midAngle = ((index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2) * Math.PI) / 180;
    const textRadius = radius * 0.65;
    return {
      x: center + textRadius * Math.cos(midAngle),
      y: center + textRadius * Math.sin(midAngle),
      angle: index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2,
    };
  };

  // Dynamic transition based on phase
  const getTransition = () => {
    if (phase === "fast") return "transform 4.5s cubic-bezier(0.12, 0.6, 0.08, 0.99)";
    if (phase === "bounce") return "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
    return "none";
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Floating sparkles around wheel */}
      <WheelSparkles />

      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          top: -8,
          left: "50%",
          transform: "translateX(-50%)",
          width: size + 24,
          height: size + 24,
          background: `radial-gradient(circle, hsl(45 100% 51% / ${glowIntensity * 0.3}) 60%, transparent 70%)`,
          transition: "background 0.5s ease",
        }}
      />

      {/* Pointer */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 ${!spinning && !disabled ? "wiggle-idle" : ""}`}>
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderTop: "28px solid hsl(45, 100%, 51%)",
            filter: `drop-shadow(0 2px 6px rgba(0,0,0,0.5)) drop-shadow(0 0 ${spinning ? 12 : 4}px hsl(45 100% 51% / ${spinning ? 0.8 : 0.3}))`,
          }}
        />
      </div>

      {/* Wheel */}
      <div
        className={`gold-border rounded-full p-1 ${phase === "fast" ? "wheel-spin-pulse" : ""}`}
        style={{
          boxShadow: `0 0 ${20 + glowIntensity * 40}px hsl(45 100% 51% / ${glowIntensity * 0.5}), 0 0 ${60 + glowIntensity * 60}px hsl(45 100% 51% / ${glowIntensity * 0.2})`,
          transition: "box-shadow 0.5s ease",
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
          }}
        >
          <defs>
            {/* Glow filter for winning segment */}
            <filter id="winGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Segment edge glow */}
            <filter id="segGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {SEGMENTS.map((seg, i) => (
            <g key={i}>
              <path
                d={createSegmentPath(i)}
                fill={seg.color}
                stroke="hsl(45, 100%, 51%)"
                strokeWidth="1.5"
                filter={i === WINNING_INDEX ? "url(#winGlow)" : undefined}
              />
              {/* Inner highlight for depth */}
              <path
                d={createSegmentPath(i)}
                fill="none"
                stroke={i === WINNING_INDEX ? "hsl(45, 100%, 70%)" : "hsl(0, 0%, 100%)"}
                strokeWidth="0.5"
                opacity={i === WINNING_INDEX ? 0.6 : 0.08}
              />
              <text
                x={getTextPosition(i).x}
                y={getTextPosition(i).y}
                fill={i === WINNING_INDEX ? "hsl(0, 0%, 5%)" : "white"}
                fontWeight="800"
                fontSize="16"
                textAnchor="middle"
                dominantBaseline="central"
                transform={`rotate(${getTextPosition(i).angle}, ${getTextPosition(i).x}, ${getTextPosition(i).y})`}
                filter={i === WINNING_INDEX ? "url(#segGlow)" : undefined}
              >
                {seg.label}
              </text>
            </g>
          ))}

          {/* Center circle with glow */}
          <circle
            cx={center}
            cy={center}
            r="26"
            fill="hsl(0, 60%, 15%)"
            stroke="hsl(45, 100%, 51%)"
            strokeWidth="3"
            filter="url(#segGlow)"
          />
          <circle
            cx={center}
            cy={center}
            r="22"
            fill="hsl(0, 60%, 12%)"
            stroke="hsl(45, 100%, 51%)"
            strokeWidth="1"
          />
          <text
            x={center}
            y={center}
            fill="hsl(45, 100%, 51%)"
            fontWeight="900"
            fontSize="11"
            textAnchor="middle"
            dominantBaseline="central"
          >
            BONUS
          </text>
        </svg>
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={spinning || disabled}
        className={`mt-6 px-10 py-4 rounded-full font-extrabold text-lg tracking-wide gold-gradient text-primary-foreground pulse-glow disabled:opacity-50 disabled:animate-none transition-all active:scale-90 uppercase spin-btn-hover ${!spinning && !disabled ? "bounce-cta" : ""}`}
      >
        {spinning ? "Girando..." : disabled ? "Ya giraste" : "🎰 Girar ahora"}
      </button>
    </div>
  );
};

export default SpinWheel;
