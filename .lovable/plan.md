

## Plan: 4 targeted improvements

### 1. Improve the final ding sound (`playFinalDing`)

The current sound uses only two sine tones (G5 at 784Hz + D5 at 587Hz) which sounds dry and isolated after the warm counter ticks. Will redesign it as a resolved, warm bell chord consistent with the `playBonusConfirmed` style:

- Use a layered approach: warm fundamental (G4 392Hz) + major third (B4) + gentle octave shimmer (G5)
- Longer decays (1.0-1.2s) so it rings out elegantly instead of cutting off
- Add a subtle sub-bass warmth layer
- Keep volumes soft and consistent with the rest of the soundscape

**File:** `src/lib/sounds.ts` lines 99-111

### 2. Update favicon to use the new logo

The favicon currently points to `/favicon.png`. Will update `index.html` to use `/logo-full.png` (which already exists in `public/`) as the favicon, since that's the new brand logo.

**File:** `index.html` line 5

### 3. Simplify live counter — remove glow and bounce

Remove the `counter-number-glow` class from `LiveCounter.tsx` and remove the `live-counter-card` bounce animation class (or neutralize it in CSS). The green ping dot stays.

**Files:**
- `src/components/LiveCounter.tsx` — remove `counter-number-glow` class and `live-counter-card` class from the container
- `src/index.css` — can leave the CSS rules (unused code cleanup optional)

### 4. Add subtle breathing background to prize card

Add a CSS animation that slowly transitions the card's internal background from `#966e2500` (transparent) to `#966e2542` (warm gold tint) and back. Apply it as a pseudo-element or overlay div inside the card body. Do NOT animate the number after reveal, do NOT add scale to the card.

**Files:**
- `src/index.css` — add `@keyframes card-bg-breathe` animation
- `src/components/PrizeTicket.tsx` — add a background overlay div inside the card that uses this animation (only after `countDone`)

