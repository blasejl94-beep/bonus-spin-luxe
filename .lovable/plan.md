

## Plan: Create Legal & Contact Pages

### Overview
Create 4 new pages (Terms, Privacy, Responsible Gaming, Contact) with careful language to avoid META ADS-sensitive terms. Use entertainment/gaming-friendly vocabulary instead of gambling/betting terminology. Contact page redirects to WhatsApp.

### Language Strategy (META ADS safe)
- Replace "apuestas" → "entretenimiento digital", "juegos de azar" → "experiencias de juego"
- Replace "casino" → "plataforma de entretenimiento"
- Replace "apostar" → "participar", "jugar"
- Replace "dinero real" → "créditos", "saldo"
- Use "bonificaciones" instead of "bonos de apuesta"
- Frame everything as "entertainment platform" language

### Files to Create

1. **`src/pages/Terms.tsx`** — Términos y condiciones
   - Standard legal page structure with sections: acceptance, eligibility (18+), account usage, bonuses/promotions, intellectual property, limitation of liability, modifications
   - Dark themed, matching site style with `casino-gradient` background
   - Back link to home

2. **`src/pages/Privacy.tsx`** — Política de privacidad
   - Data collection, usage, sharing, cookies, user rights, security, contact
   - Same styling

3. **`src/pages/ResponsibleGaming.tsx`** — Juego responsable
   - Self-assessment, limits, resources, support contacts
   - Frame as "responsible entertainment" / "uso responsable"

4. **`src/pages/Contact.tsx`** — Contacto
   - Simple page that auto-redirects to WhatsApp (`wa.me/59894619935`)
   - Also show a brief contact card with WhatsApp button as fallback

### Files to Modify

5. **`src/App.tsx`** — Add 4 routes: `/terminos`, `/privacidad`, `/juego-responsable`, `/contacto`

6. **`src/pages/Index.tsx`** — Update footer links from `href="#"` to proper `<Link>` components pointing to the new routes. Contact link opens WhatsApp directly.

### Page Template Pattern
Each legal page will share a consistent layout:
- Logo at top (linking home)
- Page title
- Scrollable content sections with headings
- Footer with back-to-home link
- Same dark `casino-gradient` background

