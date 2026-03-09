

## Plan: CTA verde — nunca visible arriba, solo tras scroll significativo

### Problema actual
En el step `"hero"`, el CTA verde aparece tras 5s con un timer (`waCtaReady`), pero el usuario aún está viendo la rueda y el botón "GIRAR AHORA" arriba. No tiene sentido mostrarlo ahí. Además, cuando aparece/desaparece puede sentirse abrupto.

### Solución

**Archivo:** `src/pages/Index.tsx`

1. **Usar IntersectionObserver también en el step `"hero"`** — observar la sección de la rueda/botón GIRAR. En lugar de un timer arbitrario de 5s, usar un observer en el contenedor `hero-wheel-entrance` (o en el SpinWheel) para saber cuándo el usuario scrolleó lo suficiente para que esa zona ya no sea visible. Solo entonces mostrar el CTA verde.

2. **Unificar la lógica de visibilidad** — Crear un solo ref (`mainCtaRef`) que apunte al elemento principal de cada step:
   - En `"hero"` → el div que contiene la rueda y el botón GIRAR
   - En `"result"` → el botón "RECLAMAR MI BONO" (ya tiene `claimBtnRef`)
   
   Simplificar: usar un solo estado `mainCtaVisible` que el observer actualice. El CTA verde solo se muestra cuando `!mainCtaVisible`.

3. **Eliminar `waCtaReady` y el timer de 5s** — ya no es necesario. El observer se encarga de todo.

4. **Mantener `rootMargin: "-100px"`** para que el CTA verde solo aparezca cuando el elemento principal está bien fuera de pantalla, no apenas tocando el borde.

5. **Transición suave ya existente** en CSS (`wa-cta-float` con `transition: transform 0.45s, opacity 0.45s`) — esto ya maneja la entrada/salida suave. Solo hay que asegurarse de que no haya mount/unmount abrupto (el portal siempre se renderiza, solo cambia la clase).

### Cambios concretos

**`src/pages/Index.tsx`:**
- Agregar un `heroCtaRef` al div contenedor del `SpinWheel` en step `"hero"`
- Refactorizar el `useEffect` del observer para que funcione en ambos steps (`"hero"` y `"result"`), observando el ref correspondiente
- Eliminar `waCtaReady`, el `useState` y el `useEffect` del timer de 5s
- Condición del portal: `step !== "claim" && step !== "expired"` (siempre renderiza), clase visible solo cuando `!claimBtnVisible` (renombrar a algo genérico como `primaryCtaVisible`)

