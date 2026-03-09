

## Plan: 3 mejoras — CTA verde, bounce en card, vida al contador

### 1. CTA verde de WhatsApp: aparece solo cuando el CTA amarillo sale completamente del viewport

**Archivo:** `src/pages/Index.tsx`

El problema es que en el step `"hero"` (antes de girar), el CTA verde aparece arriba porque `waCtaReady` se activa a los 2.5s y no hay `claimBtnVisible` que lo bloquee. Además en `"result"`, el `threshold: 0.1` hace que desaparezca demasiado tarde.

Cambios:
- En step `"hero"`: aumentar el delay de `waCtaReady` a ~5s para que no aparezca mientras el usuario está viendo la rueda arriba
- En step `"result"`: cambiar el `rootMargin` del IntersectionObserver a `"-100px"` para que el CTA verde solo aparezca cuando el botón amarillo está bien fuera de pantalla, no apenas tocando el borde
- Cambiar la condición del portal: en `"hero"` solo mostrar si `waCtaReady`, en `"result"` solo si `!claimBtnVisible` (sin depender de `waCtaReady` para evitar flash inicial — pero inicializar `claimBtnVisible` a `true` para el result step)

### 2. Bounce sutil en la card del contador cuando pasa el reflejo

**Archivo:** `src/index.css`

La card del `LiveCounter` tiene clase `glass-card`. Para no afectar todas las glass-card, se necesita un wrapper o clase específica.

**Archivo:** `src/components/LiveCounter.tsx`

- Agregar una clase específica `live-counter-card` al div contenedor
- En CSS, crear un `@keyframes counter-bounce` que haga un `translateY(-2px)` y vuelva, muy sutil (~0.4s), sincronizado cada ~4s
- Aplicar la animación con un delay para que coincida con un ciclo natural

### 3. Darle vida al número del contador en reposo

**Archivo:** `src/components/LiveCounter.tsx`

Después de que la animación de conteo termina (cuando `displayCount === count`), el número queda estático. Agregar:

- Un efecto de **glow pulsante** sutil en el número: usar `text-shadow` con la color dorada del sitio que pulse suavemente
- Implementar con una clase CSS que se aplique siempre al span del número

**Archivo:** `src/index.css`

- Crear `@keyframes counter-number-glow` que alterne entre `text-shadow: 0 0 4px hsl(42,100%,50%,0.3)` y `text-shadow: 0 0 8px hsl(42,100%,50%,0.5)` cada ~2s
- Clase `.counter-number-glow` que aplique esta animación
- Usar `will-change: filter` para GPU acceleration

### Archivos a editar
- `src/pages/Index.tsx` — lógica de visibilidad del CTA verde
- `src/components/LiveCounter.tsx` — clase para card bounce + clase glow en número
- `src/index.css` — animaciones counter-bounce y counter-number-glow

