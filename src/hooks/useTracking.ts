import { useEffect, useRef, useCallback } from "react";
import { track, type TrackingEvent, type TrackingParams } from "@/lib/tracking";

/**
 * React hook that exposes the `track` function.
 */
export function useTracking() {
  const trackEvent = useCallback(
    (event: TrackingEvent, params?: TrackingParams) => track(event, params),
    [],
  );
  return { track: trackEvent };
}

/**
 * Fire a tracking event once on mount.
 */
export function useTrackOnMount(event: TrackingEvent, params?: TrackingParams) {
  const fired = useRef(false);
  useEffect(() => {
    if (!fired.current) {
      fired.current = true;
      track(event, params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
