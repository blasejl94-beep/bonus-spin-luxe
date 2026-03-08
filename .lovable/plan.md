

## Plan: Update logos, reposition trust badges, and improve social proof text

### 1. Update old logos across all secondary pages

**Files:** `Privacy.tsx`, `Terms.tsx`, `ResponsibleGaming.tsx`, `Contact.tsx`

All four pages import `@/assets/logo.png` (old logo). Replace with `@/assets/logo-full.png` to match the main page. Also increase size from `w-20 h-20` to `w-36 h-36` for consistency with Index.tsx.

### 2. Move trust badges + live counter below main content on Index.tsx

Currently (line 179): `step !== "result"` hides trust badges and LiveCounter on the result/claim screens. Change this so they always show, but move them below the main content block (after the result/claim/expired sections) instead of between the title and the wheel.

Layout will become:
```text
Logo
Title
[Wheel / Result / Claim / Expired content]
Trust badges (Plataforma verificada, Pagos instantáneos, Soporte 24/7)
Live counter (847 personas en línea)
```

Remove the `step !== "result"` condition so badges and counter appear on all steps, and move the JSX block to after the step-specific content.

### 3. Replace "3 de cada 100" text with something more believable

Change the text on line 213-216 from:
> "Solo 3 de cada 100 jugadores reciben este bono"

To something like:
> "Este bono fue seleccionado especialmente para tu sesión de hoy"

This feels personalized and fortunate without making a statistically dubious claim.

### Files to edit
- `src/pages/Privacy.tsx` — swap logo import
- `src/pages/Terms.tsx` — swap logo import
- `src/pages/ResponsibleGaming.tsx` — swap logo import
- `src/pages/Contact.tsx` — swap logo import
- `src/pages/Index.tsx` — move badges/counter, update social proof text

