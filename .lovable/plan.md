

## Casino Promotion Landing Page - Implementation Plan

### Page Structure (Single-page, mobile-first)

**1. Hero Section (Above the fold)**
- Deep red gradient background with gold accents
- Headline: "Girá la ruleta y desbloqueá tu bono de bienvenida"
- Subheadline with player count social proof
- Three trust badges (verified, fast payments, 24/7 support)
- Large interactive spin wheel with 7 segments (50%-350% bonuses)
- "Tenés 1 giro disponible" text + "Girar ahora" CTA button

**2. Spin Wheel Interaction**
- CSS-animated wheel with realistic spin physics and suspense delay
- Result always lands on a high bonus (e.g., 350%)
- Confetti animation on result reveal
- Prize modal: "🎉 ¡Felicitaciones! Ganaste 350% de bono"
- "Reclamar mi bono" CTA button
- Store spin in localStorage to prevent re-spins

**3. Bonus Claim Form**
- Slides in after clicking "Reclamar mi bono"
- "Activá tu bono en 10 segundos" header
- Countdown timer (5 minutes) for urgency
- Phone number (required) + Name (optional) fields
- "Activar bono ahora" CTA button
- On submit → redirects to WhatsApp with prefilled message

**4. Social Proof Section**
- Auto-scrolling ticker of recent winners with randomized names/amounts
- Small casino game thumbnails (slots, roulette, blackjack) using icons/emojis

**5. Sticky WhatsApp CTA**
- Fixed bottom floating button: "Hablar con un asesor por WhatsApp"
- Opens WhatsApp with prefilled message

### Design System
- Background: deep red-to-dark gradient
- Accents: gold/amber tones
- Text: white, high contrast
- Large touch targets, smooth transitions
- Confetti effect using CSS animations

### Technical Notes
- All frontend, no backend needed
- Single Index page with state management for the funnel steps
- localStorage for one-spin-per-session logic

