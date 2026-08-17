# Fase 13 — Unificar subida de imágenes en comunidad.tiboxlab.cl

Decisión de Braulio: toda imagen de contenido del portal (Noticias, Videos y Webinars, Infografías, Portada, y cualquier otro lugar del admin donde se suba o pegue una URL de imagen) debe usar el mismo destino que ya usaba la galería de fotos de eventos — `comunidad.tiboxlab.cl/imagenes-portal/`, vía el mismo mecanismo ya en producción (endpoint intermedio Vercel + `WP_UPLOAD_SECRET`) — en vez de Supabase Storage.

## Auditoría previa (cómo estaba cada sección)

| Sección | Mecanismo antes | Destino |
|---|---|---|
| Noticias | Subir archivo / pegar URL (`ImageUploadOrUrlField`) | Supabase Storage (`content-images`) |
| Infografías | Subir archivo / pegar URL (`ImageUploadOrUrlField`) | Supabase Storage (`content-images`) |
| Videos y Webinars | Sin campo de imagen manual — miniatura automática desde el link de YouTube | N/A, nada que migrar |
| Portada (hero slides) | Solo subir archivo (`ImageUploadField` propio de `PortadaWidgets.jsx`), sin alternativa de URL | Supabase Storage (`content-images`) |
| Eventos — banner / logo de colaborador | Solo subir archivo (`ImageUploadField` de `AdminWidgets.jsx`) | Supabase Storage (`content-images`) |
| Eventos — galería de fotos | Pegar enlace a mano, o "Subir imagen" (`GalleryLinksField`) | `comunidad.tiboxlab.cl/imagenes-portal/` (ya migrado en Fase 6-7-8) |
| Servicios TIBOX | Solo campo de texto "URL del logo", sin mecanismo de subida propio | N/A, nada que migrar |

Es decir: dentro del propio formulario de Eventos ya convivían dos destinos distintos (banner/logo en Supabase Storage, galería en `comunidad.tiboxlab.cl`) — inconsistencia que también quedó resuelta con este ajuste.

## Qué se hizo

- **`src/services/wordpressUploadService.js` → `src/services/portalImageUploadService.js`**: renombrado y generalizado. `uploadEventImageToWordpress(file)` → `uploadPortalImage(file)` — mismo contrato (valida tipo/tamaño, sube, devuelve la URL), sin nada específico de eventos en el nombre ni en la lógica.
- **`api/upload-event-image.js` → `api/upload-image.js`**: mismo handler (Vercel Serverless Function), renombrado para reflejar que ya no es exclusivo de eventos. Se limpiaron los mensajes de error que mencionaban "WordPress" explícitamente (más genéricos) y un comentario TODO suelto ("Cambiar destino de subida de imágenes a comunidad.tiboxlab.cl") que ya estaba resuelto.
- **`ImageUploadInner`** (`src/admin/AdminWidgets.jsx`, la pieza compartida por `ImageUploadField` y `ImageUploadOrUrlField`): su única línea de subida pasa de `storageService.uploadContentImage(file)` a `portalImageUploadService.uploadPortalImage(file)`. Este es el único cambio de código necesario para migrar **Noticias, Infografías, y el banner/logo de eventos a la vez** — los tres ya compartían este componente.
- **`GalleryLinksField`** (galería de eventos): actualizado el import/llamada al servicio renombrado — mismo comportamiento, sin cambios funcionales.
- **`PortadaWidgets.jsx`**: su propio componente `ImageUploadField` (no compartido con `AdminWidgets.jsx`, tiene su propia UI más simple) cambia la misma línea de subida al nuevo servicio.
- **`PerfilPage.jsx` (foto de perfil del administrador) — sin tocar, a propósito**: sigue usando `storageService.uploadContentImage` (Supabase Storage). No es "contenido general del portal", es la foto personal de una cuenta de administrador — categoría distinta, no estaba en la lista pedida.
- **Se mantiene la opción de pegar URL** donde ya existía (Noticias, Infografías) — no se agregó donde no existía (Portada, banner/logo de eventos), tal como se pidió.
- **Videos y Webinars / Servicios TIBOX**: no tenían mecanismo de subida propio, nada que migrar (ver tabla de auditoría arriba).

## Verificación

- `npm run lint` y `npm run build` sin errores.
- **Wiring local (Noticias e Infografías)**: interceptando `fetch` en el navegador (ruta temporal revertida, `git diff` limpio), se confirmó que el botón "Subir archivo" de ambos formularios llama a `/api/upload-image` con `Content-Type` y `X-Filename` correctos. No se pudo probar el flujo completo en local porque Vite no sirve rutas `/api/*` (mismo límite que ya tenía la subida de eventos, ver `docs/integrations/wordpress-image-upload.md`).
- **Infraestructura real, en producción** (`tibox-connect.vercel.app`, antes del deploy de este cambio — se probó el endpoint `/api/upload-event-image` ya desplegado, mismo handler que se está renombrando): se subió una imagen PNG 1×1 de prueba directamente contra el endpoint desplegado. Respuesta: `200 { "url": "https://comunidad.tiboxlab.cl/imagenes-portal/<hash>.png" }` — coincide exactamente con el destino pedido. Se cargó esa URL directo en el navegador y sirvió la imagen real, sin problema de hotlinking.
- No fue posible probar el flujo completo "subir desde Noticias → guardar → ver publicado en `/tendencias/:slug`" contra producción por no tener credenciales de administrador real en este entorno — la prueba de infraestructura de arriba, junto con el wiring local verificado, cubre ambos extremos del mismo camino.

## Pendiente para Braulio

- Una vez desplegado este cambio (deploy en Vercel), confirmar de punta a punta desde `/admin/contenidos/noticias`, `/admin/contenidos/infografias` y `/admin/portada`: subir una imagen real, confirmar que la URL resultante es de `comunidad.tiboxlab.cl/imagenes-portal/`, guardar, y verificar que se ve correctamente en el portal público.
- `docs/integrations/wordpress-upload-image-snippet.php` describe una arquitectura anterior (snippet de WordPress en `tibox.cl`, endpoint `wp-json/tibox/v1/upload-image`) que ya no coincide con el endpoint real confirmado en producción (`comunidad.tiboxlab.cl/upload-image.php`). Se dejó una nota de esta discrepancia en `docs/integrations/wordpress-image-upload.md` — si hace sentido, valdría actualizar o retirar ese snippet.
