

## Plan: Multiple UI/UX Improvements

### 1. Game Icons — Remove text labels (Index.tsx)
Remove the `<span>` text labels from the GAMES section, keeping only emoji icons. Also rename "Ruleta" to "Rueda" in the GAMES array.

### 2. Payment Methods — Replace with Uruguayan providers (Index.tsx)
Replace `["💳 Visa", "💳 Mastercard", "📱 MercadoPago", "🏦 Transferencia"]` with: Abitab, Redpagos, MercadoPago, Prex, MiDinero, Santander Rio, eBrou. Since we cannot use real logos (no image files), we will use styled text badges with appropriate icons/emojis and a clean glass-card design that integrates well.

### 3. Wheel Pointer — Improved physics & contrast (SpinWheel.tsx + index.css)
- Change pointer color from gold to a high-contrast **red/crimson** with white highlight so it stands out against the gold rim.
- Add a reactive "flick" animation: the pointer tilts when a segment boundary passes underneath it (triggered by the same tick-detection logic), creating a realistic physical response. Use a CSS class toggle on each tick to trigger a brief rotation animation.

### 4. Rename "Ruleta" → "Rueda" (Index.tsx)
Update any references to "Ruleta" in the page text (headline, GAMES array).

### 5. Fix Wheel Sizing — LEDs & pointer inside the wheel boundary (SpinWheel.tsx)
The LED ring at `50 + 50 * Math.cos(rad)` places LEDs at the very edge (0%-100%), causing them to overflow. Fix by reducing the LED radius to ~46% so they sit inside the rim. Adjust pointer position from `top: 3%` to align with the inner wheel area. Reduce the outer padding from 8% to ~4% so the wheel itself is larger relative to its container.

### 6. Wheel Segments — Show 350% but limit actual wins to 100-200% (SpinWheel.tsx)
- Add a "350%" gold segment to the wheel display (8 segments total).
- Rig the spin so the random angle only lands on segments 100%, 125%, 150%, 175%, or 200%. The 50%, 75%, and 350% segments are visible but the landing angle is constrained to avoid them. This is done by picking a random target from the allowed segments and computing the corresponding angle range.

### 7. WhatsApp Messages — Update both messages (Index.tsx)
- **After spinning (claim form submit):** Multi-line message with bonus result interpolated.
- **Sticky button (no spin):** Generic inquiry message without bonus.
- Use different messages depending on whether the user has a result or not.

### Files to modify
- `src/pages/Index.tsx` — items 1, 2, 4, 7
- `src/components/SpinWheel.tsx` — items 3, 5, 6
- `src/index.css` — item 3 (pointer flick animation)

