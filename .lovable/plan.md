

## Plan: Shift wheel rim + pointer left to align with LED ring

### What
The wheel face (gold rim + SVG) and the pointer are slightly offset to the right relative to the LED ring on mobile. Instead of moving LEDs, we'll nudge the wheel rim and pointer a few pixels to the left.

### Changes (file: `src/components/SpinWheel.tsx`)

1. **Wheel rim** (line 325): Change `absolute inset-[4%]` to add a small left offset. Use inline style to subtract ~2px from the left position:
   - Change from `className="absolute inset-[4%] rounded-full wheel-rim-sheen"` 
   - To: `className="absolute rounded-full wheel-rim-sheen"` with `style` adding `top: "4%", bottom: "4%", left: "calc(4% - 2px)", right: "calc(4% + 2px)"` (merged into existing style object)

2. **Pointer** (around line 466): Adjust the pointer's `left` from `50%` to `calc(50% - 2px)` to keep it aligned with the shifted wheel face.

3. **Shadow under wheel** (line 316): Also shift slightly left to match: adjust `left: "10%"` → `left: "calc(10% - 2px)"`.

### What stays unchanged
- LED ring position and radius (inset-[4%], 46.5 constant)
- SVG segments, colors, animations, sizes
- Container structure and layout
- All other components

This is a 2-3px nudge — easy to adjust further if needed.

