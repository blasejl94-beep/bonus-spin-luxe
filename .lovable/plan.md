

# Performance-First Refactor Plan

## Problem Summary
The page crashes mobile browsers due to: 40 continuously animated DOM particles, backdrop-filter blur on multiple elements, animated box-shadows, a canvas LED ring running rAF forever even when idle, and heavy CSS animations (filter: blur in keyframes, text-shadow pulses).

## Changes

### 1. Remove AmbientParticles entirely
**File:** `src/pages/Index.tsx` — remove `<AmbientParticles />` import and usage.
**Why:** 40 fixed-position DOM nodes each running a CSS animation with `radial-gradient` backgrounds. Major compositor overhead on mobile.

### 2. Replace `backdrop-filter: blur()` with solid backgrounds
**File:** `src/index.css` — change `.glass-card` and `.glass-card-strong` to use opaque `background` colors instead of `backdrop-filter: blur()`. Remove `-webkit-backdrop-filter` too.
**Why:** `backdrop-filter` is one of the most expensive CSS properties on mobile, forces re-rendering of layers behind the element.

### 3. Remove animated box-shadows
**File:** `src/index.css`:
- `.victory-card-glow` — remove animated box-shadow keyframes, use a static subtle border glow.
- `.pulse-glow` — remove animated box-shadow, use static shadow or remove.
- `.glow-text` — replace `text-shadow` + `filter: brightness()` animation with static `color` + simple opacity pulse.
- `.bonus-number-scale` keyframes — remove `filter: blur(12px)` from animation, use opacity-only reveal.
- `.bonus-reveal` — remove `filter: blur(10px)`.

**File:** `src/pages/Index.tsx`:
- Remove massive `shadow-[0_0_40px...]` and `hover:shadow-[0_0_60px...]` from claim buttons. Use a static, modest shadow.

### 4. Fix LedRingCanvas to pause when idle
**File:** `src/components/SpinWheel.tsx` — In the `LedRingCanvas` component, when `state === "idle"`, draw once and stop the rAF loop (or run at a very low rate like every 60th frame). Only run continuous rAF during `"spinning"` and `"won"` states. Stop the won animation after ~2 seconds.

### 5. Reduce LED count
**File:** `src/components/SpinWheel.tsx` — Change `NUM_LEDS` from 18 to 16. Minor but helps.

### 6. Simplify WinnerToast backdrop
**File:** `src/components/WinnerToast.tsx` — Remove `backdrop-blur` from the toast card. Use solid `bg-card` instead.

### 7. Clean up unused/heavy CSS animations
**File:** `src/index.css`:
- Remove `.ambient-particle` and `@keyframes float-up` (no longer needed after removing AmbientParticles).
- Remove `.confetti-piece`, `.confetti-burst`, `@keyframes confetti-fall/sway/burst` (confetti is canvas-based now, these are dead CSS).
- Simplify `.led-idle`, `.led-chase`, `.led-celebrate` (these are dead CSS too since LEDs moved to canvas).

### 8. Add `prefers-reduced-motion` global rule
**File:** `src/index.css` — Add a media query that disables or simplifies all custom animations:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 9. Reduce SocialProofTicker weight
**File:** `src/components/SocialProofTicker.tsx` — The ticker duplicates 20 items (40 DOM nodes) with `glass-card` (blur). Remove `glass-card` class from avatar circles; use simple solid background.

### Summary of expected impact
- **Biggest wins:** Removing AmbientParticles (40 animated nodes), removing all `backdrop-filter: blur()`, removing animated box-shadows/text-shadows, pausing idle rAF loop.
- **Visual impact:** Minimal — backgrounds become slightly more opaque instead of frosted glass. All layout, colors, and core animations preserved.

