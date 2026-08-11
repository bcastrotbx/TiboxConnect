# Subida de imágenes de galería de eventos a WordPress

Pedido de Braulio (ver `docs/phases/FASE-06-07-08-CONTENIDO-REAL.md`): la galería de fotos de un evento (`events.gallery`) dejó de subir archivos a Supabase Storage y pasó a aceptar enlaces pegados a mano — esta pieza agrega, además, un botón "Subir imagen" que sube el archivo directo a la Biblioteca de Medios de WordPress (tibox.cl) y pega la URL resultante automáticamente.

Se descartó Application Passwords de WordPress (problemas para activarlas en el sitio). En su lugar: un endpoint REST propio en WordPress, autenticado con una clave secreta fija — no ligada a ningún usuario.

## Arquitectura (tres piezas)

```
Admin (navegador)  →  /api/upload-event-image  →  wp-json/tibox/v1/upload-image  →  Biblioteca de Medios
   (React)             (Vercel Serverless Fn)         (snippet en Code Snippets)
```

1. **Snippet de WordPress** (`docs/integrations/wordpress-upload-image-snippet.php`) — se pega en el plugin Code Snippets de tibox.cl. Expone `POST /wp-json/tibox/v1/upload-image`, valida el header `X-Tibox-Secret` contra una clave fija definida en el propio snippet, y si coincide sube el archivo con `media_handle_upload()` y devuelve `{ "url": "..." }`.
2. **Endpoint intermedio** (`api/upload-event-image.js`, Vercel Serverless Function) — recibe el archivo del formulario, arma el `multipart/form-data` que WordPress espera, agrega la clave secreta (leída de una variable de entorno, nunca expuesta al navegador) y reenvía la respuesta al frontend.
3. **Frontend** (`src/services/wordpressUploadService.js` + botón "Subir imagen" en `GalleryLinksField`, `src/admin/AdminWidgets.jsx`) — valida tipo (JPG/PNG/WEBP) y tamaño (máx. 8MB) antes de subir, y agrega la URL resultante como una fila más del arreglo de enlaces (máximo 10 en total, junto con los pegados a mano).

## Qué falta para que funcione (acción de Braulio)

1. **Pegar el snippet** en WordPress → Code Snippets → Add New → pegar el contenido completo de `docs/integrations/wordpress-upload-image-snippet.php` → guardar como "Solo funciones" → activar con "Run snippet everywhere".
2. **Elegir una clave secreta propia** (larga y aleatoria, ej. 40+ caracteres) y reemplazar el valor de ejemplo en la línea `$expected_secret = '...'` del snippet, antes de guardarlo.
3. **Copiar esa misma clave** a Vercel: Project Settings → Environment Variables → agregar `WP_UPLOAD_SECRET` con exactamente el mismo valor (en los tres entornos: Production, Preview, Development, si se va a probar en preview deploys también).
4. **Redesplegar** (un nuevo deploy en Vercel, para que la función lea la variable de entorno nueva — las variables de entorno no se aplican a deploys ya existentes).

## Límites y validaciones

- Tipos permitidos: JPG, PNG, WEBP (validado en el frontend, en el endpoint intermedio y en el snippet de WordPress — las tres capas, no solo una).
- Tamaño máximo: 8MB (mismo criterio en las tres capas).
- Máximo 10 imágenes en la galería en total, combinando enlaces pegados a mano y subidas — mismo límite que ya tenía la galería de solo-enlaces.
- Errores (clave inválida, WordPress caído, archivo muy grande, tipo no permitido) se muestran como mensaje en rojo dentro del formulario, sin bloquear el resto del formulario.

## Cómo probar de punta a punta

Una vez completados los 4 pasos de arriba:

1. Ir a `/admin/eventos` → editar o crear un evento.
2. En "Galería de fotos (enlaces)", clic en "Subir imagen" y elegir un archivo JPG/PNG/WEBP.
3. Confirmar que aparece "Subiendo…" y luego la URL de `tibox.cl/wp-content/uploads/...` como una fila nueva.
4. Guardar el evento y confirmar en la página pública (`/eventos/:slug`) que la foto aparece en "Galería del evento".

Si el paso 2 muestra un error, revisar primero que la clave en el snippet y en `WP_UPLOAD_SECRET` sean idénticas (un espacio de más o una comilla distinta ya lo rompe) y que el snippet esté activo.
