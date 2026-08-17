# Fase 11 — Campanita de notificaciones real + Analítica 2 (tracking de video)

Dos entregas independientes, agrupadas en el mismo lote a pedido explícito, cada una verificable por su cuenta.

## 1. Campanita de notificaciones (real)

La campanita del header del admin (`AdminHeader.jsx`) mostraba notificaciones de ejemplo (`adminService.getNotifications()`, datos de `adminSeed.js`) sin relación con nada real del portal.

### Qué se hizo

- `adminService.getPendingNotifications()` (nueva): suma dos fuentes ya existentes, sin duplicar su lógica de conteo:
  - **Mensajes de contacto sin leer**: misma condición que la tarjeta "Mensajes de contacto sin leer" del Dashboard (`contact_messages.status === 'new'`, vía `adminMessagesService.listMessages()`).
  - **Opiniones recientes**: `feedback` no tiene un estado de "revisada" (a diferencia de `contact_messages`) y agregar uno implicaría una migración + wiring de "marcar como revisada" en `OpinionsPanel`, fuera del alcance de este ajuste. Se usa antigüedad reciente (últimos 7 días) como proxy de "pendiente de revisar" — la alternativa que el pedido explícitamente dejó abierta para este caso.
- El contador de la campanita suma ambos tipos.
- El desplegable muestra hasta 5 de cada tipo (nombre + fragmento del mensaje/calificación + fecha) y dos enlaces directos: "Mensajes de contacto" (`/admin/mensajes`) y "Opiniones de clientes" (`/admin/mensajes/opiniones`).
- Se quitó "Marcar todas como leídas": un mensaje ya se marca leído al abrirlo (`MessagesTable`, sin cambios) y una opinión no tiene un estado propio que marcar — mantener ese control habría sido un botón sin semántica real.
- `adminService.getNotifications()` y el seed `NOTIFICATIONS` quedan sin más llamadores tras este cambio (se eliminó la función; el seed queda huérfano, mismo tratamiento que otros datos de ejemplo ya sin uso en el proyecto).

### Verificación

- `npm run lint` y `npm run build` sin errores.
- Verificado en navegador vía una ruta temporal de desarrollo con `AdminLayout` completo (agregada y revertida en el mismo lote, confirmado con `git diff`): la campanita, su desplegable vacío y el enlace "Mensajes de contacto" funcionan — el clic navega a `/admin/mensajes`, que correctamente muestra "Acceso no autorizado" (la ruta real, protegida por `AdminRoute`, fuera del bypass de desarrollo).
- No fue posible confirmar visualmente el contador con datos reales (>0) — requiere una sesión de administrador real que este entorno no tiene. Pendiente que Braulio confirme logueado.

## 2. Analítica 2 — tracking de video

Sobre la base de la Fase Analítica 1 (`analytics_events`, `src/lib/analytics.js`), ya en producción.

### Qué se hizo

- `src/lib/analytics.js`: `trackVideoPlay(videoId, title)`, `trackVideoProgress(videoId, percent)`, `trackVideoComplete(videoId)`. `videoId` es el ID de YouTube (no el id interno de `content_items`) — estable, único por video, y ya disponible sin resolver a qué fila corresponde; `content_title` viaja denormalizado en cada evento para que el ranking de abajo no necesite un join. Las tres pasan por el mismo `logEvent()` que `trackPageView`, así que la exclusión de sesiones de administrador activas ya aplica sin código adicional (verificado, ver abajo).
- `src/components/shared/YouTubePlayer.jsx`: acepta `onPlay`/`onProgress`/`onComplete` opcionales.
  - `onPlay` se dispara al hacer clic en el botón de reproducir, sin depender de que cargue nada más — no debería fallar porque un adblocker bloquee un script externo.
  - `onProgress`/`onComplete` sí necesitan datos reales de reproducción (tiempo/duración de un iframe de otro origen), así que solo cuando alguno de los dos está presente se reemplaza el `<iframe>` crudo de siempre por la YouTube IFrame Player API real (`src/lib/youtube.js`, `loadYouTubeIframeAPI()` — carga perezosa y cacheada del script oficial, una sola vez por sesión). Sin esos callbacks (la página de detalle `VideotecaDetailPage.jsx`, que no los pasa) el reproductor sigue exactamente igual que antes: mismo iframe crudo, sin la IFrame API, sin petición de red adicional.
  - El progreso se reporta en milestones de 25/50/75% (poll cada 5s mientras reproduce), no como porcentaje continuo — "tasa de finalización aproximada", consistente con lo pedido.
- `src/components/Media.jsx` (`VideoModal`): pasa los tres callbacks a `YouTubePlayer` — único punto de instrumentación, tal como pide el alcance (mismo popup que abren el inicio y `/videoteca`).
- `src/services/analyticsService.js`: `getMostWatchedVideos({ days, limit })` agrupa `video_play`/`video_complete` por `content_id`, ordena por reproducciones descendente, y calcula finalización aproximada (`completes / plays`) — `null` cuando no hay ninguna reproducción completada todavía, para no mostrar "0%" como si fuera un dato real.
- `src/admin/pages/AnaliticaPage.jsx`: nuevo bloque "Videos más vistos" (tabla: #, video, reproducciones, finalización aprox.), respeta el mismo selector de rango (7/30/90 días) que el resto de la página.

### Verificación

- `npm run lint` y `npm run build` sin errores.
- Reproducido un video real en `/videoteca` (filtro "Webinars"): confirmado por `performance.getEntriesByType('resource')` que se dispararon 2 requests a `analytics_events` (`page_view` de la navegación + `video_play` del clic en reproducir) y que se cargó `https://www.youtube.com/iframe_api` — la ruta con tracking real quedó activa, sin errores de consola.
- `trackVideoProgress`/`trackVideoComplete` verificados con una llamada directa (esperar minutos de reproducción real de un video de 14-33 min para alcanzar un milestone no era práctico en esta sesión): ambos insertan sin error contra la tabla real en producción.
- Exclusión de administradores logueados verificada con una sesión de Supabase Auth simulada (mismo mecanismo que la Fase 1): con sesión activa, ninguno de los tres eventos nuevos generó una request a `analytics_events`; sin sesión, sí.
- "Videos más vistos" verificado por render (ruta temporal revertida, mismo mecanismo que el resto de `/admin/analitica`): la tabla, sus tres estados (`loading`/`error`/`success`) y el layout están correctos. Mostrar el ranking con datos reales requiere reproducir un video como visitante público (los eventos de un admin logueado se excluyen a propósito) y confirmar el resultado en `/admin/analitica` con sesión de administrador.

## Pendiente para Braulio

- Confirmar logueado como admin que la campanita muestra el número real de pendientes (mensajes sin leer + opiniones recientes) y que el desplegable lista los correctos.
- Reproducir un video público hasta el final (o varios) y confirmar que "Videos más vistos" en `/admin/analitica` refleja las reproducciones y, si corresponde, una finalización aproximada.
