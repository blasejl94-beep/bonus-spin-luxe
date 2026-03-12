

## Fix: GoldenArrowCue dismissed before it appears

### Root Cause
The component registers `pointerdown`, `scroll`, `touchstart` listeners immediately on mount. Any scroll event that fires during the first 2.8 seconds (before the arrow appears) permanently dismisses it. The page has entrance animations that likely cause minor scroll events.

### Solution

**File: `src/components/GoldenArrowCue.tsx`**

Only start listening for dismiss events **after the cue has appeared at least once**. Change the dismiss-listener `useEffect` to depend on `visible` — only register listeners when `visible` becomes `true`.

```tsx
useEffect(() => {
  if (dismissed || !visible) return; // ← add !visible check
  const events = ["pointerdown", "scroll", "touchstart"] as const;
  const handler = () => dismiss();
  events.forEach((e) => window.addEventListener(e, handler, { passive: true, once: true }));
  return () => events.forEach((e) => window.removeEventListener(e, handler));
}, [dismissed, dismiss, visible]); // ← add visible to deps
```

This ensures the arrow actually appears first, then any interaction dismisses it.

