

## Fix: Align LEDs and Pointer with Wheel Rim

The LEDs and pointer are still slightly outside the gold rim border. Two small adjustments:

### 1. LEDs — pull inward (`SpinWheel.tsx`, line 34)
- Change LED radius from `46` to `43.5` so they sit on top of the gold rim instead of outside it.

### 2. Pointer — move down (`SpinWheel.tsx`, line 434)
- Change pointer `top: "1%"` to `top: "3.5%"` so the tip aligns with the inner edge of the rim.

Both are single-value changes, no structural modifications needed.

