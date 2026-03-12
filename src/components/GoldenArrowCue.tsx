import React, { useState, useEffect, useCallback, useRef } from "react";

const IDLE_DELAY = 2800;
const ANIM_DURATION = 2200;
const PAUSE_BETWEEN = 3500;

const GoldenArrowCue: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const cycleRef = useRef(0);

  const dismiss = useCallback(() => {
    setDismissed(true);
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (dismissed) return;

    const schedule = () => {
      timerRef.current = setTimeout(() => {
        cycleRef.current++;
        if (cycleRef.current > 4) { dismiss(); return; }
        setVisible(true);
        timerRef.current = setTimeout(() => {
          setVisible(false);
          timerRef.current = setTimeout(schedule, PAUSE_BETWEEN);
        }, ANIM_DURATION);
      }, cycleRef.current === 0 ? IDLE_DELAY : 0);
    };

    schedule();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [dismissed, dismiss]);

  useEffect(() => {
    if (dismissed || !visible) return;
    const events = ["pointerdown", "scroll", "touchstart"] as const;
    const handler = () => dismiss();
    events.forEach((e) => window.addEventListener(e, handler, { passive: true, once: true }));
    return () => events.forEach((e) => window.removeEventListener(e, handler));
  }, [dismissed, dismiss, visible]);

  if (dismissed || !visible) return null;

  return (
    <div className="flex flex-col items-center pointer-events-none select-none golden-arrow-cue" aria-hidden="true">
      {/* Glow trail */}
      <div className="w-px h-8 golden-arrow-trail" />
      {/* Arrow */}
      <svg width="18" height="24" viewBox="0 0 18 24" fill="none" className="golden-arrow-head">
        <path
          d="M9 2 L9 20 M3 15 L9 22 L15 15"
          stroke="hsl(var(--casino-gold))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default GoldenArrowCue;
