

## Fix Confetti: Canvas-Based Full-Screen Overlay

**Root cause:** Confetti is rendered inside Index.tsx's `overflow-x-hidden` container. Despite `position: fixed`, some mobile browsers clip fixed children inside overflow-hidden parents. The DOM-based approach with 110 divs is also heavy.

### Solution: Rewrite `Confetti.tsx` as a lightweight canvas-based system rendered via React portal

**File: `src/components/Confetti.tsx`** — Full rewrite:
- Use `ReactDOM.createPortal` to render a `<canvas>` directly on `document.body`, escaping all parent overflow constraints.
- Canvas element styled with `position: fixed; inset: 0; width: 100vw; height: 100dvh; pointer-events: none; z-index: 9999`.
- Spawn ~40 particles with random color, position, velocity, rotation, and size.
- Animate via `requestAnimationFrame` loop: gravity + lateral drift + rotation + fade-out.
- Auto-cleanup after ~1.2s (all particles faded). Call `cancelAnimationFrame` on unmount.
- Keep particle count low (40) and duration short (~1s) for mobile performance.

No changes needed in `Index.tsx` or `index.css` — the existing `{showConfetti && <Confetti />}` mount/unmount pattern stays the same. The CSS classes `.confetti-piece` and `.confetti-burst` become unused and can be removed from `index.css` for cleanup.

