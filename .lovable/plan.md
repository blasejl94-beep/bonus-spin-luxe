

## Micro-mejoras de animaciones post-victoria

Analizé en detalle el flujo completo: CelebrationModal → PrizeTicket entrance → count-up → final ding → breathing state. Todo funciona bien, pero hay oportunidades de pulir la coordinación y agregar sutilezas que aumenten la sensación de recompensa.

### Cambios propuestos

**1. Entrada del PrizeTicket más cinematográfica**
- Actualmente la entrada es `scale(0.85) → scale(1)` en 0.6s. Cambiar a una entrada en dos fases: primero un "bloom" del glow de fondo (0→visible en 0.3s), luego la tarjeta sube con un spring más pronunciado `scale(0.8) translateY(32px)` en 0.7s. El glow llega antes que el contenido, creando anticipación visual.

**2. Card "respira" durante el conteo**
- Agregar un scale sutil al card (1.0 → 1.015) que crece junto con el progreso del conteo. Cuando el número sube, la tarjeta se expande imperceptiblemente, dando sensación de que el premio "crece". Se resetea después del bounce final.

**3. Badge bounce con spring physics más natural**  
- Los tiempos actuales (200ms, 400ms, 550ms) tienen gaps irregulares. Refinar a un spring más orgánico: `1.15 → 1.22 → 0.96 → 1.05 → 0.99 → 1.0` con tiempos `0, 150, 280, 380, 450ms` — más rápido al inicio, settling más suave.

**4. Screen flash mejorado (dos capas)**  
- Capa 1: Flash blanco central muy breve (150ms, opacity 0.15) que da el "punch" inicial
- Capa 2: Gold spread más lento (600ms, opacity 0.25) que se expande radialmente
- Resultado: sensación de impacto + resolución dorada más elegante

**5. Micro-shake en el número al finalizar**
- Agregar un shake sutil de 2px al número del premio durante 0.3s sincronizado con el ding final (translateX alternando ±1.5px). Simula vibración de impacto sin ser agresivo.

**6. Transición glow→breathing más suave**
- Actualmente el glow del conteo se corta a 0.3 y luego empieza el breathing con un delay. Agregar un ease-out intermedio de 800ms que baje el glow gradualmente antes de que el breathing tome control, eliminando el "salto" visual.

**7. Stagger timing refinado**
- Los staggers actuales (0.2, 0.4, 0.7, 1.0s) tienen un salto entre stagger-2 y stagger-3. Ajustar a (0.15, 0.35, 0.55, 0.85s) para un flujo más uniforme, tipo cascada natural.

**8. CTA button entrance con anticipation**
- El botón "RECLAMAR MI BONO" aparece con el stagger general. Agregar un scale anticipation (scale 0.95 → 1.03 → 1.0) que lo haga "brotar" con más energía, invitando al click.

### Archivos a modificar
- `src/components/PrizeTicket.tsx` — card scale durante conteo, badge spring refinado, micro-shake, glow transition suave
- `src/pages/Index.tsx` — screen flash de dos capas
- `src/index.css` — prize-entrance mejorada, stagger timing, micro-shake keyframes, CTA entrance, glow background bloom

### Lo que NO cambia
- Sonidos (ticks, ding, slot win)
- CelebrationModal (timing y diseño)
- Estructura del PrizeTicket
- Sparkles, badge shine loops, card-alive
- Bounce CTA infinite

