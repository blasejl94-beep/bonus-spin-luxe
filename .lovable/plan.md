
Objetivo: corregir que el botón “🎁 RECLAMAR MI BONO” vuelva a verse en el estado `result`, sin cambiar diseño ni layout.

Diagnóstico (causa raíz)
- En `src/pages/Index.tsx` el botón tiene ambas clases: `cta-sprout-entrance cta-alive`.
- En `src/index.css`:
  - `.cta-sprout-entrance` define `opacity: 0` y animación combinada (sprout + alive).
  - `.cta-alive` vuelve a definir `animation: cta-alive ...`.
- Al coexistir ambas clases, la regla `.cta-alive` sobreescribe la animación combinada y nunca se ejecuta correctamente el tramo que lleva opacidad a visible, dejando el botón invisible.

Plan de implementación
1) Corregir conflicto de animaciones del CTA
- Archivo: `src/pages/Index.tsx`
- Quitar la clase `cta-alive` del botón “RECLAMAR MI BONO”.
- Dejar únicamente `cta-sprout-entrance` (que ya incluye la entrada + estado vivo en la animación compuesta).

2) Blindar CSS para evitar regresiones
- Archivo: `src/index.css`
- Mantener `.cta-sprout-entrance` como clase única responsable del ciclo completo (aparición + breathing).
- Limitar `.cta-alive` para uso opcional en otros elementos (o documentar que no debe combinarse con `cta-sprout-entrance`).
- (Opcional técnico mínimo) añadir comentario encima de ambas clases para evitar volver a aplicar ambas en el mismo nodo.

3) Verificación funcional visual
- Flujo: girar rueda → llegar a `result`.
- Confirmar:
  - El botón aparece (opacity visible) tras su delay.
  - Conserva el “sprout” inicial y luego el efecto “alive”.
  - Sigue clickeable y lleva al paso `claim`.
- Validar en mobile y desktop que no haya parpadeo ni desaparición tras re-render.

Criterio de aceptación
- El CTA de reclamo se ve siempre en `step === "result"`.
- Mantiene animación de entrada + respiración sin romper visibilidad.
- No se altera tamaño, ubicación, copy ni estilo base del botón.
