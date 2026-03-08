

## Plan: Fix LED Ring Alignment on Published Mobile

### Root Cause

The LED ring container uses `absolute inset-0` (line 57), meaning LEDs are positioned relative to the **full wheel container** which includes `padding: 4%` (line 309). The wheel rim, however, uses `absolute inset-[4%]` (line 325), creating a different coordinate space. The LED radius constant of `44.5%` was visually tuned in preview but doesn't account for the padding offset consistently across mobile browsers, causing the ring to appear shifted outward on production mobile.

### Fix

**File: `src/components/SpinWheel.tsx`**

1. Change the LED ring container from `absolute inset-0` to `absolute inset-[4%]` — this makes LEDs share the exact same coordinate box as the wheel rim.

2. Increase the LED radius constant from `44.5` to `46.5` to compensate for the now-smaller reference box (LEDs need to sit at the outer edge of the rim within its own coordinate space).

This is a two-line change: one in the `LedRing` component (line 57, the container class), and one constant (line 42, the `44.5` multiplier).

### Why This Works

By anchoring the LED ring to the same `inset-[4%]` box as the wheel rim, both layers share identical origin and dimensions regardless of how the browser resolves the outer container's padding. Subpixel rounding on the 4% padding no longer causes a mismatch because both layers are affected equally.

