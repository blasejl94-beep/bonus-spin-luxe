

## Plan: CTA visibility inteligente + Optimización de performance móvil

### 1. WhatsApp CTA solo visible cuando el botón amarillo sale del viewport

**Archivo:** `src/pages/Index.tsx`

En `step === "result"`, el CTA verde de WhatsApp (portal fijo en `bottom-4`) compite con el botón dorado "RECLAMAR MI BONO". Solución:

- Agregar un `ref` al botón dorado "RECLAMAR MI BONO"
- Usar `IntersectionObserver` para detectar cuándo ese botón sale del viewport (scroll down)
- Crear estado `claimBtnVisible` (inicialmente `true`)
- Modificar la condición del portal de WhatsApp: mostrar solo cuando `step === "result" && !claimBtnVisible` (es decir, el usuario scrolleó y ya no ve el CTA amarillo), o en `step === "hero"`
- En los otros steps (`claim`, `expired`) sigue oculto como está ahora

### 2. Optimización de performance para scroll fluido en móviles

**Archivo:** `src/pages/Index.tsx`
- Agregar `will-change: transform` al CTA dorado para evitar traba al hacer scroll (el navegador lo promueve a su propia capa compositing y no repinta la capa principal)
- Envolver componentes pesados con `React.memo` donde no se haga ya: `ScarcityBar`, `SocialProofTicker`
- Aplicar `contain: content` al contenedor principal de la sección hero para aislar repaints

**Archivo:** `src/components/ScarcityBar.tsx`
- Envolver en `React.memo`

**Archivo:** `src/components/SocialProofTicker.tsx`
- Envolver en `React.memo`
- Mover `generateWinners()` dentro de `useMemo` para evitar regenerar en cada render del módulo

**Archivo:** `src/components/WinnerToast.tsx`
- Envolver en `React.memo`

**Archivo:** `src/components/LiveCounter.tsx`
- Ya tiene buena lógica, envolver en `React.memo`

**Archivo:** `src/index.css`
- Agregar `will-change: transform` y `transform: translateZ(0)` al CTA dorado (`.cta-sprout-entrance`) para que el scroll no lo trabe al pasar por él
- Asegurar que las animaciones infinitas usen `will-change: opacity` o `will-change: transform` según corresponda, y no propiedades que fuerzan repaint como `box-shadow`

### 3. CTA dorado sin trabas al scrollear

El botón dorado "RECLAMAR MI BONO" no es fixed, es inline. La traba viene de que tiene animaciones (`shimmer`) y `box-shadow` pesados que causan repaint durante el scroll. Solución:

**Archivo:** `src/index.css`
- Promover el botón a su propia capa de compositing con `transform: translateZ(0)` en la clase del CTA para que las animaciones de shimmer no bloqueen el hilo principal durante scroll

