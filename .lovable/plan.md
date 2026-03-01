

## Enhanced Win Celebration Sequence

### Current Flow (problem)
Wheel stops → immediately calls `onSpinComplete` → SuspenseOverlay (fake loading) → bonus screen + confetti all at once. No real "celebration moment" on the wheel itself.

### New Flow
```text
0.0s  Wheel stops on segment
      → pointer click sound + small wheel bounce (existing)
      → LED ring switches to NEW "celebrating" state
      → Winning segment pulses with golden glow (2 pulses)
      → Wheel + hub do a gentle scale-up bounce (CSS)
      → Play slot-machine win sound (new sound function)

2.5s  Celebration ends
      → onSpinComplete fires
      → Index removes SuspenseOverlay entirely
      → Bonus screen fades/slides in immediately
      → playWinSound (fanfare)

2.8s  Confetti triggers (300ms after bonus screen)
      → Full-screen canvas confetti (existing component)
      → Duration ~1.2s
```

### Files to modify

**1. `src/components/SpinWheel.tsx`**
- Add a new phase `"celebrating"` between `"bounce"` and calling `onSpinComplete`.
- After spin timer (4.8s), enter `"bounce"` for 500ms, then `"celebrating"` for 2000ms.
- During celebrating: `wheelState = "celebrating"`, add CSS class `wheel-celebrate-bounce` to the SVG container for a gentle scale-up/down pulse.
- Winning segment highlight pulses only during celebrating phase (use `animate-pulse` or dedicated keyframe).
- Remove `showWinConfetti` state and `<Confetti />` from SpinWheel — confetti will only come from Index.
- After celebrating phase ends, call `onSpinComplete` and reset to idle.
- Add a mute toggle button (small speaker icon, top-right of wheel container) that sets a ref/state to skip all `play*` calls.

**2. `src/lib/sounds.ts`**
- Add `playSlotWin()`: a short (0.8s) slot-machine celebration sound — rapid ascending chimes with a final "ding" at the peak. Uses triangle + sine oscillators with quick decay.

**3. `src/index.css`**
- Add `@keyframes led-celebrating`: faster chase with golden pulse flashes (3 quick bright flashes over 1s, using opacity + scale, transform-only).
- Add `.led-celebrating` class.
- Add `@keyframes wheel-celebrate-bounce`: gentle `scale(1) → scale(1.04) → scale(1)` over 0.6s, repeated 2x.
- Add `.wheel-celebrate-bounce` class.

**4. `src/pages/Index.tsx`**
- Remove `SuspenseOverlay` import and usage entirely — the celebration now happens on the wheel.
- Remove `showSuspense`, `pendingPrize` state.
- `handleSpinComplete` now directly: saves result, plays win sound, sets step to `"result"`, then after 300ms triggers confetti.
- Remove drumroll call (replaced by slot win sound in the wheel).
- Screen flash + shake trigger on `handleSpinComplete` as before.

### Performance
- All new animations use only `transform` and `opacity`.
- LED celebrating animation is CSS-only, no JS re-renders.
- Wheel bounce is a single CSS class toggle.
- Mute toggle is a single boolean ref, no re-renders needed for sound gating.

