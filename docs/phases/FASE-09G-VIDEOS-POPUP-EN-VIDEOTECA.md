# Fase 9g — "Ver video" abre popup en /videoteca

Pedido de Braulio: en `/videoteca`, "Ver video" de un video real navegaba a `/videoteca/:slug` (reproductor + texto + "Mira también"). Ahora abre un popup con el reproductor sobre el mismo listado, para poder cerrar y pasar al siguiente video sin ida y vuelta de página. Los videos no llevan información textual ni galería — solo el reproductor.

## Alcance

**Solo videos reales** (`kind === 'video'`). Los eventos mezclados en el mismo listado **no cambian**:
- Eventos "PRÓXIMAMENTE" → siguen abriendo `EventDetailModal` (con "Inscríbete aquí").
- Eventos ya realizados → siguen navegando a `/videoteca/:slug`.

## Cambios

- **`src/components/Media.jsx`** — `VideoModal` pasa de función privada a exportada (`export function VideoModal`). Único cambio en el archivo. Se reutiliza el popup que ya usa el carrusel "Explora Videos y Webinars" del inicio: mismo diseño (reproductor de YouTube + título + duración/fecha), sin texto largo ni galería, que es exactamente lo pedido — no se creó un componente nuevo.
- **`src/pages/VideotecaPage.jsx`** — nuevo import de `VideoModal`, nuevo estado `openVideo`, `handleOpen` gana un primer caso (`if (item.kind === 'video') { setOpenVideo(item); return; }`) y se renderiza el popup al final.
  - Se le pasa `{ ...openVideo, slug: undefined }` a propósito: `VideoModal` solo muestra el botón "Ver Más" (que llevaría a `/videoteca/:slug`) si el video trae `slug`. Como los videos ya no tienen página de detalle con contenido propio, ese botón queda oculto acá — el popup queda solo con reproductor + duración/fecha, sin link de salida.

`normalizeVideo` (`videotecaService.js`) ya expone todos los campos que `VideoModal` lee (`cat`, `externalUrl`, `thumb`, `title`, `dur`, `date`, `slug`), así que la reutilización no necesitó tocar el servicio.

## `VideotecaDetailPage.jsx` no se tocó

Sigue existiendo y sirviendo a eventos realizados (`/videoteca/:slug` de un evento). La rama que renderiza un **video** en esa página (`isVideo === true`) deja de ser alcanzable desde la UI normal (ya ningún link apunta a un video con esa ruta), pero se dejó tal cual — eliminarla sería un cambio aparte. Nota: la URL directa de un video sigue funcionando si alguien la tiene guardada.

## Cómo se probó

1. `/videoteca` → "Ver video" de un video real → abre el popup con el reproductor. Verificado que la URL **no cambió** (`/videoteca`) y que hay **0 botones "Ver Más"** y **0 links a `/videoteca/…`** en el DOM del popup.
2. Cerrar el popup (X) → vuelve al mismo listado, con el filtro de categoría aún aplicado, sin recargar.
3. Evento "PRÓXIMAMENTE" → **no verificable con los datos actuales**: hoy (13 ago 2026) todos los eventos publicados son pasados (`isUpcoming: false`), así que esa rama no se pudo ejercitar en el navegador. El código de esa rama no se modificó (`if (item.kind === 'event' && item.isUpcoming)` quedó intacto, solo se le antepuso el caso de video).
4. Evento ya realizado ("IA y seguridad en la empresa") → navegó a `/videoteca/ia-y-seguridad-en-la-empresa-n8c25z` con su página de detalle. Sin cambios.
5. Carrusel "Explora Videos y Webinars" del inicio → abre el mismo popup y **sí** conserva su botón "Ver Más" (usa `VideoModal` directo, con el `slug` intacto). Sin cambios, como se esperaba.
6. Sin errores de consola en ninguno de los casos anteriores.

## Verificación técnica

- `npm run lint` — sin errores ni warnings nuevos.
- `npm run build` — build exitoso (aviso de chunk >500kB preexistente).
