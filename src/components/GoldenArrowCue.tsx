import React, { useState, useEffect, useCallback, useRef } from "react";

const IDLE_DELAY = 2800;
const ANIM_DURATION = 2200;
const PAUSE_BETWEEN = 3500;
const SCROLL_DISMISS_DELTA = 24;

const GoldenArrowCue = React.forwardRef<HTMLDivElement>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleRef = useRef(0);
  const visibleStartScrollYRef = useRef(0);

  const dismiss = useCallback(() => {
    setDismissed(true);
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (dismissed) return;

    const schedule = () => {
      timerRef.current = setTimeout(() => {
        cycleRef.current += 1;
        if (cycleRef.current > 4) {
          dismiss();
          return;
        }

        visibleStartScrollYRef.current = window.scrollY;
        setVisible(true);

        timerRef.current = setTimeout(() => {
          setVisible(false);
          timerRef.current = setTimeout(schedule, PAUSE_BETWEEN);
        }, ANIM_DURATION);
      }, cycleRef.current === 0 ? IDLE_DELAY : 0);
    };

    schedule();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dismissed, dismiss]);

  useEffect(() => {
    if (dismissed || !visible) return;

    const handleImmediateDismiss = () => dismiss();
    const handleScrollDismiss = () => {
      if (Math.abs(window.scrollY - visibleStartScrollYRef.current) > SCROLL_DISMISS_DELTA) {
        dismiss();
      }
    };

    window.addEventListener("pointerdown", handleImmediateDismiss, { passive: true });
    window.addEventListener("touchstart", handleImmediateDismiss, { passive: true });
    window.addEventListener("wheel", handleImmediateDismiss, { passive: true });
    window.addEventListener("scroll", handleScrollDismiss, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleImmediateDismiss);
      window.removeEventListener("touchstart", handleImmediateDismiss);
      window.removeEventListener("wheel", handleImmediateDismiss);
      window.removeEventListener("scroll", handleScrollDismiss);
    };
  }, [dismissed, dismiss, visible]);

  if (dismissed || !visible) return null;

  return (
    <div
      ref={ref}
      className="flex flex-col items-center pointer-events-none select-none golden-arrow-cue"
      aria-hidden="true"
    >
      <div className="w-px h-8 golden-arrow-trail" />
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
});

GoldenArrowCue.displayName = "GoldenArrowCue";

export default GoldenArrowCue;
