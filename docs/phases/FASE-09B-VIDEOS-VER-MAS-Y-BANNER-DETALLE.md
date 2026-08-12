# Fase 9b — CTA "Ver Más" en Videos y altura del banner en páginas de artículo

Continuación de la Fase 9 ([FASE-09-NOTICIAS-DETALLE-Y-ADMIN.md](FASE-09-NOTICIAS-DETALLE-Y-ADMIN.md)), ya revisada y funcionando. Dos ajustes independientes en un solo lote.

## 1. CTA "Ver Más" en el popup de Videos (home)

Mismo patrón ya usado para Noticias en la Fase 9 (`NoticiaModal`), replicado para `VideoModal`:

- **`src/components/Media.jsx`** — `VideoModal` gana un `CtaLink` "Ver Más" al final del cuerpo, que navega a `/videoteca/${video.slug}` (solo si el video trae `slug` — `contentService.mapContentRow()` ya lo expone desde antes, no fue necesario tocar el servicio). El popup no cambió nada más de su comportamiento.
- **`src/pages/VideotecaDetailPage.jsx`** ya existía (Fase 6-7-8) y ya manejaba el slug de un video real vía `videotecaService.getVideotecaDetailBySlug()` — no se creó una página nueva, solo se ajustó su "Mira también" (ver abajo).
- **"Mira también" ahora depende de qué se está viendo:**
  - Si es un **video/webinar** (`detail.kind === 'video'`): se agregó `contentService.getVideos({})` y se filtran/recomiendan hasta 6 videos distintos al actual, cada uno como `<Link to="/videoteca/:slug">` con badge de fecha (día/mes vía `formatDayMonth(v.dateRaw)`) + título recortado a 2 líneas — mismo componente visual que "Eventos recomendados"/"Mira también" de Eventos/Noticias. "Webinars" es una categoría dentro de `content_items` tipo `video`, no un tipo de contenido aparte, así que `getVideos({})` ya las incluye sin filtro adicional.
  - Si es un **evento ya realizado** (mismo route, otro `kind`): **sin cambios** — se mantiene tal cual el comportamiento aprobado en la tarea #74 (próximos eventos publicados, abre `EventDetailModal` al hacer clic). No se tocó esa rama.

## 2. Altura del banner en páginas de detalle

**Diagnóstico:** las 3 plantillas de detalle que ya existen (Noticia, Video, Evento — Infografías no tiene página de detalle propia todavía, solo popup con `object-fit: contain` que no recorta) tenían cada una su propio banner con altura fija baja: `EventoDetailPage.jsx`/`NoticiaDetailPage.jsx` usaban `height: 260` inline sobre una imagen `object-fit: cover`, y `VideotecaDetailPage.jsx` usaba el componente compartido `YouTubePlayer` con `aspect-ratio: 16/9` (más bajo aún en pantallas anchas). Con fotos verticales o de personas de pie, `cover` a esa altura recortaba cabezas/pies.

**Fix — una sola clase compartida, no 3 ajustes sueltos:**
- **`src/index.css`** — nueva clase `.detail-banner-image { height: 380px; }`, con `@media (max-width: 700px) { height: 260px; }` (mismo punto de quiebre que ya usa `.hero-shell`). Sigue siendo rectangular, no cuadrado ni panorámico extremo — solo más alta.
- **`src/pages/EventoDetailPage.jsx`** / **`src/pages/NoticiaDetailPage.jsx`** — el `div` de la imagen destacada cambia de `style={{ height: 260, ... }}` a `className="detail-banner-image" style={{ ...sin height... }}`. El `object-fit: cover` de la imagen no cambió (sigue siendo el criterio correcto para un banner con texto/badges superpuestos — solo hacía falta más alto, no otro tipo de recorte).
- **`src/components/shared/YouTubePlayer.jsx`** — nuevo prop opcional `className`. Sin él, se comporta exactamente igual que antes (`aspect-ratio: 16/9`, usado por el popup `VideoModal` en el home, que se mantiene compacto). Con él (`VideotecaDetailPage.jsx` pasa `className="detail-banner-image"`), la altura fija reemplaza al aspect-ratio, igualando la altura de Noticias/Eventos.

No se tocaron los badges de categoría/estado ni el título superpuesto (siguen posicionados de forma absoluta sobre el banner, con `padding`/`bottom` relativos al contenedor) — solo creció el contenedor.

## Archivos modificados

- `src/components/Media.jsx` — CTA "Ver Más" en `VideoModal`.
- `src/pages/VideotecaDetailPage.jsx` — "Mira también" condicional (videos vs. eventos) + banner más alto.
- `src/components/shared/YouTubePlayer.jsx` — prop `className` opcional.
- `src/pages/EventoDetailPage.jsx`, `src/pages/NoticiaDetailPage.jsx` — banner con la clase compartida.
- `src/index.css` — clase `.detail-banner-image`.

## Cómo probar cada punto manualmente

**1 — CTA "Ver Más" en Videos:**
1. En el inicio, sección "Explora Videos y Webinars", clic en cualquier video → se abre el popup de siempre (reproductor + título + duración/fecha).
2. Clic en "Ver Más" → navega a `/videoteca/<slug-real>` con el video completo.
3. En esa página, "Mira también" (columna derecha) debe mostrar **otros videos/webinars** (no noticias, no eventos), cada uno navegable a su propia página.
4. Para contraste, entrar a un evento ya realizado vía `/videoteca` (listado combinado) — su "Mira también" debe seguir mostrando próximos eventos, sin cambios.

**2 — Altura del banner:**
1. Abrir cualquier página de detalle (`/tendencias/:slug`, `/videoteca/:slug` de un video, `/eventos/:slug`) y confirmar que el banner es visiblemente más alto que antes y que la imagen no se ve cortada de forma extraña.
2. Probado en este lote con una foto vertical/de personas de pie (`/tendencias/primera-noticia-de-prueba-t6l4y0` — dos personas ahora se ven completas, antes se cortaban) y una foto apaisada de grupo (`/eventos/ia-y-seguridad-en-la-empresa-n8c25z` — 4 personas, se ve bien tanto en desktop como en mobile).
3. Probar en mobile (viewport angosto): el banner baja a 260px, título/badges siguen legibles, no se rompe el resto de la página.

## Verificación técnica

- `npm run lint` — sin errores ni warnings nuevos.
- `npm run build` — build exitoso (el aviso de chunk >500kB es preexistente).
- Pruebas manuales en navegador de desarrollo: popup de video con "Ver Más" funcionando, "Mira también" de video mostrando otros videos/webinars, banner más alto verificado en Noticias/Eventos/Videos con una imagen apaisada y una vertical/de personas, en desktop y mobile, sin errores de consola.
- No se modificó nada de lo ya aprobado en la Fase 9 (sidebar admin, listado de administradores, CTAs de Tendencias/Noticias) — cambios acotados a los archivos listados arriba.
