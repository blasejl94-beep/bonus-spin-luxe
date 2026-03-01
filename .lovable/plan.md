
1) Bloqueo inmediato de causas de crash en zona de rueda (hero)
- `src/pages/Index.tsx`: quitar `drop-shadow-[...]` del logo principal y reducir sombras/glows pesados en elementos visibles al cargar.
- `src/index.css`: recortar intensidad de `.gold-glow`, `.premium-shadow`, `.glass-card-strong`, `.victory-card-glow` para que queden estáticos y de bajo costo (sin filtros/sombras grandes).

2) Evitar trabajo continuo fuera de viewport
- `src/components/SocialProofTicker.tsx`: animar ticker solo cuando la sección está visible (IntersectionObserver); cuando no está visible, pausar animación (`animation-play-state: paused` o clase sin animación).
- Reducir nodos del ticker (lista base menor) y mantener duplicado mínimo para loop visual.
- `src/pages/Index.tsx`: aplicar `content-visibility: auto` + `contain-intrinsic-size` en secciones debajo del fold (social proof/footer) para aliviar scroll sobre hero.

3) Wheel 100% estable y liviana en idle
- `src/components/SpinWheel.tsx`: mantener giro solo con `transform: rotate()` + `will-change: transform` en el SVG rotante.
- Añadir `contain: layout paint size` al contenedor de rueda y asegurar `overflow-visible` con padding fijo para no recortes ni relayout.
- `LedRingCanvas`: en `idle` dibujar una sola vez y detener loop; en `spinning/won` usar rAF con tope de FPS (p. ej. 30) y cortar celebración a ~1.8–2.2s.

4) Eliminar re-renders/intervalos no críticos en navegación
- `src/components/WinnerToast.tsx`: pausar intervalos cuando pestaña no visible (`visibilitychange`) y desactivar en modo bajo rendimiento.
- `src/components/LiveCounter.tsx` y `src/components/ScarcityBar.tsx`: mantener intervalos lentos, sin animaciones extra; no actualizar si documento está oculto.
- Confirmar que no existan listeners globales de scroll con trabajo pesado (actualmente no hay; mantener así).

5) Modo “low-performance” automático
- Nuevo hook/util (ej. `src/hooks/use-performance-mode.ts`): activar degradación si `prefers-reduced-motion`, `deviceMemory` baja o `hardwareConcurrency` baja.
- En modo low-performance: desactivar ticker animado, bajar LEDs efectivos, desactivar efectos decorativos no esenciales del hero, mantener layout intacto.

6) Validación final enfocada en crash de scroll
- Probar end-to-end en móvil real: scroll repetido arriba/abajo sobre la rueda por 2–3 minutos.
- Verificar: sin cierres del navegador, scroll fluido, rueda centrada/grande/responsive, giro correcto, highlight correcto al detener.
- Verificar en modo reducido: animaciones minimizadas y sin regresiones visuales críticas.
