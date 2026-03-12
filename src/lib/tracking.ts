/**
 * Centralized tracking layer.
 *
 * Internal event names are decoupled from any analytics provider.
 * To integrate Meta Pixel, GA4, or any other SDK, add the provider
 * call inside `dispatchToProviders` — the rest of the app stays untouched.
 */

export const TrackingEvents = {
  LandingViewed: "LandingViewed",
  SpinStarted: "SpinStarted",
  PrizeUnlocked: "PrizeUnlocked",
  WhatsAppClicked: "WhatsAppClicked",
  FirstDepositConfirmed: "FirstDepositConfirmed",
  RepeatDepositConfirmed: "RepeatDepositConfirmed",
} as const;

export type TrackingEvent = keyof typeof TrackingEvents;

export type TrackingParams = Record<string, string | number | boolean | undefined>;

/* ------------------------------------------------------------------ */
/*  Provider mapping                                                   */
/*                                                                     */
/*  Map internal events → provider-specific names here.                */
/*  Example for Meta Pixel:                                            */
/*    LandingViewed   → "ViewContent"                                  */
/*    PrizeUnlocked   → "Lead"                                        */
/*    FirstDepositConfirmed → "Purchase"                               */
/*                                                                     */
/*  This keeps the mapping in one place and the rest of the app clean. */
/* ------------------------------------------------------------------ */

const META_PIXEL_MAP: Partial<Record<TrackingEvent, string>> = {
  // LandingViewed: "ViewContent",
  // SpinStarted: "InitiateCheckout",
  // PrizeUnlocked: "Lead",
  // WhatsAppClicked: "Contact",
  // FirstDepositConfirmed: "Purchase",
  // RepeatDepositConfirmed: "Purchase",
};

/**
 * Dispatch to all configured analytics providers.
 * Uncomment / add providers as needed.
 */
function dispatchToProviders(event: TrackingEvent, params?: TrackingParams) {
  // --- Meta Pixel ---
  // const fbqEvent = META_PIXEL_MAP[event] ?? event;
  // if (typeof window !== "undefined" && (window as any).fbq) {
  //   (window as any).fbq("track", fbqEvent, params);
  // }

  // --- Google Analytics 4 ---
  // if (typeof window !== "undefined" && (window as any).gtag) {
  //   (window as any).gtag("event", event, params);
  // }

  // --- Custom endpoint ---
  // navigator.sendBeacon?.("/api/track", JSON.stringify({ event, params, ts: Date.now() }));
}

/**
 * Main track function used across the app.
 */
export function track(event: TrackingEvent, params?: TrackingParams) {
  if (import.meta.env.DEV) {
    console.log(`[tracking] ${event}`, params ?? "");
  }
  dispatchToProviders(event, params);
}
