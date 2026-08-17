# Subida de imágenes del portal a comunidad.tiboxlab.cl

Mecanismo único de subida de imágenes para todo el contenido del admin: Noticias, Videos y Webinars (donde exista un campo de imagen manual), Infografías, Portada, y galería/banner/logo de Eventos. Reemplaza la subida directa a Supabase Storage que usaban Noticias/Infografías/Portada — un solo destino administrado por Braulio, sin gastar cuota de Storage del proyecto Supabase.

Origen: nació en la Fase 6-7-8 como una pieza exclusiva de la galería de fotos de eventos (`events.gallery`) — ver `docs/phases/FASE-06-07-08-CONTENIDO-REAL.md`. Se generalizó después (ver `docs/phases/` la fase que agrega este documento) para servir a cualquier imagen de contenido del admin, no solo eventos.

Se descartó Application Passwords de WordPress (problemas para activarlas en el sitio). En su lugar: un endpoint REST propio, autenticado con una clave secreta fija — no ligada a ningún usuario.

## Arquitectura (tres piezas)

```
Admin (navegador)  →  /api/upload-image  →  comunidad.tiboxlab.cl/upload-image.php  →  imagenes-portal/
   (React)             (Vercel Serverless Fn)
```

1. **Endpoint en comunidad.tiboxlab.cl** — `POST https://comunidad.tiboxlab.cl/upload-image.php`, valida el header `X-Tibox-Secret` contra la misma clave que `WP_UPLOAD_SECRET` en Vercel, y si coincide guarda el archivo en `imagenes-portal/` y devuelve `{ "url": "https://comunidad.tiboxlab.cl/imagenes-portal/..." }`. Este script vive fuera de este repositorio (lo administra Braulio en ese subdominio) — no hay código fuente propio que versionar acá.
   - **Nota de discrepancia con `wordpress-upload-image-snippet.php`**: ese archivo (que sigue en este directorio) documenta una arquitectura anterior — un snippet de WordPress en `tibox.cl` exponiendo `wp-json/tibox/v1/upload-image`. El endpoint real en producción (confirmado en vivo, ver abajo) es `comunidad.tiboxlab.cl/upload-image.php`, no ese. El snippet queda de referencia histórica; si `comunidad.tiboxlab.cl` corre sobre ese mismo snippet migrado a un subdominio distinto o es un script nuevo, no hay forma de confirmarlo desde este repo — Braulio es quien sabe qué corre ahí.
2. **Endpoint intermedio** (`api/upload-image.js`, Vercel Serverless Function — renombrado desde `api/upload-event-image.js`) — recibe el archivo del formulario, arma el `multipart/form-data` que ese endpoint espera, agrega la clave secreta (leída de la variable de entorno `WP_UPLOAD_SECRET`, nunca expuesta al navegador) y reenvía la respuesta al frontend.
3. **Frontend** (`src/services/portalImageUploadService.js`, renombrado desde `wordpressUploadService.js`) — valida tipo (JPG/PNG/WEBP) y tamaño (máx. 8MB) antes de subir. Dos puntos de uso:
   - `ImageUploadInner` (`src/admin/AdminWidgets.jsx`) — pieza compartida por `ImageUploadField` (banner de evento, logo de colaborador) y `ImageUploadOrUrlField` (Noticias, Infografías — mantiene la alternativa de pegar una URL a mano).
   - `ImageUploadField` propio de `src/admin/PortadaWidgets.jsx` (imagen de fondo de cada slide del hero) — solo subida, sin alternativa de URL (no la tenía antes de este ajuste, no se agregó).
   - `GalleryLinksField` (`src/admin/AdminWidgets.jsx`) — galería de fotos de eventos, botón "Subir imagen" junto a los enlaces pegados a mano (sin cambios respecto al mecanismo original).

**Videos y Webinars** no tiene un campo de imagen manual — la miniatura se obtiene automáticamente del link de YouTube (`getYouTubeThumbnailUrl`), no hay nada que migrar ahí. **Servicios TIBOX** (`/admin/contenidos/servicios`) tampoco: su logo es un campo de solo texto ("URL del logo"), sin mecanismo de subida propio desde el que migrar — fuera de alcance de este ajuste.

## Qué falta para que funcione (acción de Braulio)

Ya confirmado funcionando en producción (ver "Verificado en vivo" abajo) — estos pasos ya están completos, se dejan documentados por si hay que repetirlos en otro entorno:

1. **Configurar el endpoint** en `comunidad.tiboxlab.cl/upload-image.php` con una clave secreta propia.
2. **Copiar esa misma clave** a Vercel: Project Settings → Environment Variables → `WP_UPLOAD_SECRET` (Production, Preview, Development si corresponde).
3. **Redesplegar** tras cualquier cambio de la variable de entorno — no se aplica a deploys ya existentes.

## Límites y validaciones

- Tipos permitidos: JPG, PNG, WEBP (validado en el frontend y en el endpoint intermedio).
- Tamaño máximo: 8MB.
- Máximo 10 imágenes en la galería de eventos en total, combinando enlaces pegados a mano y subidas.
- Errores (clave inválida, servidor caído, archivo muy grande, tipo no permitido) se muestran como mensaje en rojo dentro del formulario, sin bloquear el resto del formulario.

## Verificado en vivo (fecha de este ajuste)

Subida de prueba real contra el endpoint ya desplegado en producción (`tibox-connect.vercel.app`, antes de que el rename a `/api/upload-image` estuviera desplegado — se probó `/api/upload-event-image`, mismo handler):

- `POST /api/upload-event-image` con una imagen PNG 1×1 → `200 { "url": "https://comunidad.tiboxlab.cl/imagenes-portal/<hash>.png" }`.
- La URL resultante se cargó directamente en el navegador y sirvió la imagen real (sin problema de hotlinking) — confirma que `WP_UPLOAD_SECRET` está configurada en Vercel y que el endpoint de `comunidad.tiboxlab.cl` está activo y guardando en `imagenes-portal/`, tal como se pedía.

Wiring de Noticias e Infografías verificado localmente (interceptando `fetch`): el botón "Subir archivo" de ambos formularios llama a `/api/upload-image` con el `Content-Type` y `X-Filename` correctos — no se pudo probar el flujo completo (subir → guardar → ver publicado) en local porque Vite no sirve rutas `/api/*`; requiere probarse contra un deploy real (ver "Cómo probar de punta a punta").

## Cómo probar de punta a punta

1. Ir a `/admin/contenidos/noticias` (o `/admin/contenidos/infografias`, o `/admin/portada`) → editar o crear un ítem.
2. En el campo de imagen, clic en "Subir archivo" (o el botón de subida en Portada) y elegir un archivo JPG/PNG/WEBP.
3. Confirmar que aparece "Subiendo…" y luego la vista previa con la URL de `comunidad.tiboxlab.cl/imagenes-portal/...`.
4. Guardar y confirmar en la página pública correspondiente que la imagen aparece.

Si el paso 2 muestra un error, revisar primero que la clave en `comunidad.tiboxlab.cl` y en `WP_UPLOAD_SECRET` (Vercel) sean idénticas.
