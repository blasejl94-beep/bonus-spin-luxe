

## Plan: Green CTA — never visible until well past the primary CTA

### Problem
The `IntersectionObserver` with `rootMargin: "-100px"` triggers too early. The `heroCtaRef` covers the entire wheel section, but once you scroll just a bit past it, the green button appears — sometimes even while the LiveCounter entrance animation finishes and shifts layout.

### Solution

**File: `src/pages/Index.tsx`**

Two changes:

1. **Much larger rootMargin** — Change from `"-100px"` to `"0px 0px -300px 0px"` (only shrink from the bottom). This means the observed element must scroll 300px above the bottom of the viewport before it's considered "not intersecting." This ensures the user has scrolled well past the primary CTA.

2. **Add a minimum scroll guard** — In addition to the observer, add a simple `scroll` listener that tracks whether `window.scrollY > 400`. The green CTA only shows when BOTH conditions are met: the primary CTA is out of the observer zone AND the user has scrolled at least 400px. This prevents any edge case where the observer fires prematurely during entrance animations or layout shifts.

The portal visibility condition becomes:
```
!primaryCtaVisible && hasScrolledEnough
```

Where `hasScrolledEnough` is a state that turns true only after `scrollY > 400` (with a passive scroll listener, throttled via `requestAnimationFrame`).

### Files to edit
- `src/pages/Index.tsx` — rootMargin change + scroll guard

