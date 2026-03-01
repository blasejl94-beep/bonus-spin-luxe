import React, { useState, useRef, useCallback } from "react";

const SEGMENTS = [
  { label: "50%", color: "hsl(0, 72%, 30%)" },
  { label: "100%", color: "hsl(0, 60%, 20%)" },
  { label: "150%", color: "hsl(0, 72%, 30%)" },
  { label: "200%", color: "hsl(0, 60%, 20%)" },
  { label: "250%", color: "hsl(0, 72%, 30%)" },
  { label: "300%", color: "hsl(0, 60%, 20%)" },
  { label: "350%", color: "hsl(45, 100%, 51%)" },
];

const WINNING_INDEX = 6; // 350%
const SEGMENT_ANGLE = 360 / SEGMENTS.length;

interface SpinWheelProps {
  onSpinComplete: (result: string) => void;
  disabled?: boolean;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ onSpinComplete, disabled }) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const wheelRef = useRef<SVGSVGElement>(null);

  const spin = useCallback(() => {
    if (spinning || disabled) return;
    setSpinning(true);

    // Calculate target: land on 350% segment (index 6)
    // The pointer is at top (12 o'clock). Segment 0 starts at right (3 o'clock) in SVG.
    // We need the winning segment centered under the pointer.
    const segmentCenter = WINNING_INDEX * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    // Pointer is at top = 270° in standard coords, but our wheel 0° is at 3 o'clock
    // So we need to rotate so that segmentCenter aligns with 270° (top)
    const targetAngle = 270 - segmentCenter;
    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full spins
    const totalRotation = fullSpins * 360 + targetAngle + (Math.random() * 10 - 5); // slight randomness
    
    setRotation(prev => prev + totalRotation);

    setTimeout(() => {
      setSpinning(false);
      onSpinComplete(SEGMENTS[WINNING_INDEX].label);
    }, 4500);
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
      angle: (index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2),
    };
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderTop: "28px solid hsl(45, 100%, 51%)",
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
          }}
        />
      </div>

      {/* Wheel */}
      <div className="gold-border rounded-full p-1 gold-glow">
        <svg
          ref={wheelRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rounded-full"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? "transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
              : "none",
          }}
        >
          {SEGMENTS.map((seg, i) => (
            <g key={i}>
              <path d={createSegmentPath(i)} fill={seg.color} stroke="hsl(45, 100%, 51%)" strokeWidth="1.5" />
              <text
                x={getTextPosition(i).x}
                y={getTextPosition(i).y}
                fill={i === WINNING_INDEX ? "hsl(0, 0%, 5%)" : "white"}
                fontWeight="800"
                fontSize="16"
                textAnchor="middle"
                dominantBaseline="central"
                transform={`rotate(${getTextPosition(i).angle}, ${getTextPosition(i).x}, ${getTextPosition(i).y})`}
              >
                {seg.label}
              </text>
            </g>
          ))}
          {/* Center circle */}
          <circle cx={center} cy={center} r="22" fill="hsl(0, 60%, 15%)" stroke="hsl(45, 100%, 51%)" strokeWidth="3" />
          <text x={center} y={center} fill="hsl(45, 100%, 51%)" fontWeight="900" fontSize="11" textAnchor="middle" dominantBaseline="central">
            BONUS
          </text>
        </svg>
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={spinning || disabled}
        className="mt-6 px-10 py-4 rounded-full font-extrabold text-lg tracking-wide gold-gradient text-primary-foreground pulse-glow disabled:opacity-50 disabled:animate-none transition-all active:scale-95 uppercase"
      >
        {spinning ? "Girando..." : disabled ? "Ya giraste" : "🎰 Girar ahora"}
      </button>
    </div>
  );
};

export default SpinWheel;
