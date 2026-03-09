

## Plan de Mejoras (5 cambios)

### 1. CTA "RECLAMAR MI BONO" — Entrada con anticipation + estado vivo

**Archivo:** `src/index.css`
- Crear nuevo keyframe `cta-sprout` con scale anticipation: `0.95 → 1.03 → 1.0`
- Crear clase `.cta-sprout-entrance` con delay acorde al stagger (~1.0s)
- Crear keyframe `cta-alive` que combine un breathing scale sutil (0.98 → 1.02) con un glow pulsante, para mantener el botón vivo tras la entrada

**Archivo:** `src/pages/Index.tsx`
- Aplicar `cta-sprout-entrance` y `cta-alive` al botón "RECLAMAR MI BONO" en el step `result`

### 2. Glow cortado al girar la rueda

**Archivo:** `src/components/SpinWheel.tsx` (línea 309)
- El wheel container tiene `contain: "layout paint"` que recorta el glow/sombras que salen del contenedor
- Cambiar a `contain: "layout style"` (sin `paint`) para permitir que el glow se dibuje completo sin recortes

### 3 y 3.1. Bounce suave del badge y card al terminar el contador

**Archivo:** `src/components/PrizeTicket.tsx`
- Reemplazar la secuencia actual de `setBadgeScale` con setTimeout's encadenados (líneas 65-68) por una transición CSS más suave usando un keyframe `badge-final-bounce` con curva elastic/spring
- Aplicar la misma animación bounce a la card completa (`.prize-card-v3`) al terminar el conteo: agregar una clase `card-bounce` que se active con `countDone`

**Archivo:** `src/index.css`
- Crear `@keyframes badge-final-bounce`: escala 1.15 → 1.22 → 0.96 → 1.03 → 1.0 con curva suave (~0.6s)
- Crear `@keyframes card-final-bounce`: escala más sutil 1.0 → 1.025 → 0.99 → 1.0 (~0.5s) aplicada a toda la card

### 4. Sparkles: aparecen solo después del contador

**Archivo:** `src/components/PrizeTicket.tsx`
- Envolver los sparkles (tanto los floating sparkles como los badge sparkles) en un condicional `countDone` para que solo se rendericen cuando el conteo haya terminado
- Los delays internos de cada sparkle empezarán desde 0 (ya no necesitan el offset de 2.2s)

### 5. Cambiar texto del badge de tiempo

**Archivo:** `src/pages/Index.tsx`
- En el step `result`, cambiar el texto "⏳ Bono disponible por tiempo limitado" a "⭐ Desbloqueaste tu bono de bienvenida"

