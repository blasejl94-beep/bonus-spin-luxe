import { useMemo } from "react";

/**
 * Detects low-performance devices and returns a flag to degrade non-essential effects.
 * Checks: prefers-reduced-motion, deviceMemory, hardwareConcurrency.
 */
export function usePerformanceMode(): { lowPerf: boolean } {
  const lowPerf = useMemo(() => {
    if (typeof window === "undefined") return false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return true;

    const nav = navigator as any;
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return true;
    if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4) return true;

    return false;
  }, []);

  return { lowPerf };
}
