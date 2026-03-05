

## Plan: Fix post-spin flow — eliminate redundant count-up, add "processing" modal

### Problem
The CelebrationModal currently does a full count-up animation (0→200%) and stays too long (~4s total). Then PrizeTicket on the result page does another count-up. This is redundant and the modal sometimes gets "stuck."

### Solution

**1. Rewrite CelebrationModal as a brief "processing" interstitial (~1800ms)**

Remove the count-up logic entirely. Replace the hero number with a premium "processing" UX:
- Keep: overlay blur, golden radial glow, panel scale-in animation, sparks
- Title: "¡Felicidades!" (gold text)
- Subtitle: "Bono desbloqueado"
- New: elegant golden loading spinner/dots + text "Aplicando bono…"
- Remove: trophy emoji, count-up number, bounce logic
- Timeline: overlay→glow→panel (450ms), visible for ~1200ms, then fade-out (300ms) → call `onComplete`
- Total: ~1800ms

**2. Ensure clean state transition in Index.tsx**

The current flow (`handleSpinComplete` → `setShowCelebration(true)` → `handleCelebrationDone` → `setShowCelebration(false)` + `setStep("result")`) is correct in structure. Just need to confirm the modal auto-closes reliably via the shortened timeline.

No changes needed to Index.tsx state management — the `showCelebration` boolean + `step` enum already form a clean state machine since `showCelebration` is only true during the hero→result transition.

**3. Keep PrizeTicket count-up as the single count-up**

PrizeTicket already has the count-up with sounds and effects. No changes needed there — it becomes the only place the number animates.

### Files to edit
- `src/components/CelebrationModal.tsx` — Simplify: remove count-up, add processing state, shorten timeline to ~1800ms

