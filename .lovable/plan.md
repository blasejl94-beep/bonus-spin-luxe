

## Plan: Reflejo en badge del trofeo + Optimización de logos

### 1. Revertir reflejo del WinnerToast

**Archivo:** `src/components/WinnerToast.tsx`
- Eliminar el `<span>` con efecto shimmer (línea 34)
- Quitar `relative overflow-hidden` del contenedor si se agregaron solo para el shimmer

### 2. Agregar efecto de reflejo al badge del trofeo (círculo dorado con 🏆)

**Archivo:** `src/index.css`
- Agregar un pseudo-elemento `::after` al `.prize-badge-v2` con un gradiente diagonal blanco/transparente que se mueva periódicamente de izquierda a derecha, similar al shimmer pero adaptado a la forma circular
- Usar la animación existente `badge-shine-loop` o crear una variante que corra de forma continua con un intervalo más frecuente (cada ~3s)

El efecto se aplicará al **círculo dorado que contiene el emoji 🏆**, ubicado arriba de la card de premio en `PrizeTicket.tsx`.

### 3. Optimizar carga de logos en todo el sitio

**Problema:** Los logos se importan como assets de Vite (`import logo from "@/assets/logo-full.png"`) en las páginas secundarias (Terms, Privacy, ResponsibleGaming, Contact), lo que los procesa como módulos JS. Además `logo-icon.png` en el footer no tiene optimización.

**Archivos:** `src/pages/Terms.tsx`, `src/pages/Privacy.tsx`, `src/pages/ResponsibleGaming.tsx`, `src/pages/Contact.tsx`, `src/pages/Index.tsx`

Cambios:
- Todas las páginas usarán la ruta pública `/logo-full.png` en vez de `import from @/assets/`, alineándose con Index.tsx que ya lo hace
- Agregar `width`, `height`, `loading="eager"`, `fetchPriority="high"` y `decoding="async"` al logo principal en cada página
- Para `logo-icon.png` del footer: agregar `loading="lazy"` ya que está fuera de pantalla

**Archivo:** `index.html`
- Verificar que el preload existente apunte correctamente a `/logo-full.png`

