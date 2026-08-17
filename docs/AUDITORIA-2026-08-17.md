# Auditoría de bugs — TIBOX Connect (2026-08-17)

Auditoría de solo diagnóstico — este documento existe para decidir juntos el orden de corrección. Cubre portal público, panel de administrador, RLS/GRANTs de todas las tablas, consola del navegador en las rutas principales, y variables/rutas de deploy.

## Actualización — primer lote de correcciones aplicado (mismo día)

Los 2 hallazgos críticos y 3 importantes de cara al visitante real ya se corrigieron y se verificaron en vivo — quedan marcados **[CORREGIDO]** en su sección correspondiente más abajo (se deja el hallazgo original intacto para el registro histórico, no se borra):

1. **[CRÍTICO] Noticias sin `body`** — corregido: nuevo campo "Cuerpo completo del artículo" en el formulario, verificado que el `insert`/`update` a Supabase ahora incluye `body` (capturado el payload real en vivo).
2. **[CRÍTICO] `Infinity%` en Videos más vistos** — corregido: el guard ahora es `plays > 0` (no `completes > 0`), con `Math.min(100, ...)` adicional. Verificado con datos sintéticos que el caso `plays:0, completes:3` da `null` (se muestra "—") en vez de `Infinity`.
3. **[importante] CTA "Inscríbete" sin `href`** — corregido en `EventDetailModal` (Events.jsx) y `EventoDetailPage.jsx`: sin `registrationUrl`, se muestra "Inscripción próximamente" en vez de un botón roto.
4. **[importante] Confirmación de descarga que no reflejaba el resultado real** — corregido: `downloadImageWithFallback` ahora devuelve `{ ok, method }`, y el botón muestra "Descargando…" → "Descarga iniciada" o "No se pudo descargar" según el resultado real. Verificado en vivo (screenshot con el check de éxito real).
5. **[importante] Formulario de opinión sin validación** — corregido: `required` en nombre/email/opinión. Verificado en vivo: el navegador bloquea el envío vacío y enfoca el primer campo faltante.

Fuera de este lote (confirmado explícitamente con Braulio, quedan para una ronda aparte): el gap de `NOTIFY pgrst` en migraciones antiguas, el README desactualizado, la tabla huérfana `event_registrations`, "Duplicar evento" perdiendo logo/video, y los gaps de mobile.

## Resumen ejecutivo

| Área | Crítico | Importante | Menor |
|---|---|---|---|
| Portal público | 0 | 6 | 2 |
| Panel de administrador | 1 | 4 | 5 |
| RLS / GRANTs | 1 (histórico, ya corregido) | 2 | 2 |
| Consola del navegador | 0 | 0 | 1 |
| Deploy / build / docs | 0 | 2 | 2 |

**El hallazgo más urgente**: el formulario de Noticias del admin nunca guarda `content_items.body` — toda noticia creada o editada desde el panel pierde su cuerpo completo, la página pública `/tendencias/:slug` solo puede mostrar el resumen corto. Es la misma familia de bug que "Mi Perfil" tenía antes de conectarse (campo que la UI no expone, dato que nunca llega a Supabase).

**Confirmado**: el patrón "Infinity%" que mencionaste como ejemplo sigue vivo — en el ranking "Videos más vistos" de `/admin/analitica`, el guard actual (`completes > 0`) evita el caso `0/0` pero no el caso `plays === 0` con `completes > 0`, que sigue produciendo `Infinity%` en pantalla.

**GRANTs**: no quedó ninguna tabla con el hueco histórico de "falta GRANT con Automatically expose new tables desactivado" — pero sí se encontró un patrón hermano no cubierto antes: falta `NOTIFY pgrst, 'reload schema'` en la mayoría de migraciones previas a agosto, lo cual ya causó un bug real documentado (columna `gallery` invisible para PostgREST) y podría estar afectando también a `CREATE TABLE`, no solo `ALTER TABLE ADD COLUMN`.

---

## 1. Portal público

### [importante] [CORREGIDO] "Descarga iniciada" se muestra aunque la descarga falle
- **Ubicación**: `src/components/Media.jsx:315-319` (`InfografiaModal.startDownload`)
- **Problema**: `setJustDownloaded(true)` se ejecuta de forma síncrona, antes de que `downloadImageWithFallback(info.img, info.title)` (async) se resuelva o falle. El botón cambia a "Descarga iniciada" (check verde) sin esperar el resultado real. Si el `fetch` por blob falla (CORS, red) y el `window.open()` de respaldo es bloqueado por el navegador, el usuario ve una confirmación de éxito sin haber recibido nada.
- **Recomendación**: esperar la promesa de `downloadImageWithFallback` y solo marcar `justDownloaded` si efectivamente se disparó la descarga; en caso de fallo total, mostrar un mensaje de error distinto.

### [importante] [CORREGIDO] Botón "Inscríbete aquí" puede quedar sin `href` si el evento no tiene URL de inscripción
- **Ubicación**: `src/components/Events.jsx:73` (`EventDetailModal`) y `src/pages/EventoDetailPage.jsx:160`
- **Problema**: `registration_url` es opcional en el formulario admin (sin `required`) y se guarda como `null` si se deja vacío. Ambos componentes renderizan el CTA "Inscríbete aquí" para todo evento próximo sin comprobar si `event.registrationUrl` existe — con `href={null}`, React omite el atributo y el `<a>` deja de ser clicable, aunque visualmente parece un botón funcional.
- **Nota de contexto**: no existe ningún formulario de inscripción *interno* en la app — "inscribirse" siempre es un link externo (`registrationUrl`, típicamente Microsoft Teams/Zoom). La tabla `event_registrations` (con su propia migración, RLS y GRANT correctos) no tiene ningún `insert`/`select` en todo el código — está completamente huérfana (ver hallazgo en Deploy/build más abajo). Vale la pena decidir si el flujo de inscripción alguna vez fue pensado como formulario propio o si la tabla debería eliminarse.
- **Recomendación**: ocultar el CTA (o mostrarlo deshabilitado con "Inscripción próximamente") cuando `event.registrationUrl` esté vacío.

### [importante] Mensajes de error de Supabase expuestos sin traducir en el lead de infografía
- **Ubicación**: `src/components/Media.jsx:255-257` (`InfografiaLeadModal.submit`)
- **Problema**: `setError(err.message || '...')` muestra el `message` técnico crudo de Supabase/JS (a veces en inglés) en vez de un texto genérico en español. Inconsistente con `ContactFormSection` (`src/components/Services.jsx:189`) y `OpinionPanel` (`src/components/OpinionPanel.jsx:35`), que sí muestran siempre un mensaje genérico.
- **Recomendación**: mostrar siempre un mensaje genérico en español para el visitante, igual que en los otros dos formularios; reservar `err.message` para consola/logging.

### [importante] [CORREGIDO] Formulario "Tu Opinión" no valida ningún campo
- **Ubicación**: `src/components/OpinionPanel.jsx:101,108,116` (inputs `name`, `email`, `msg`)
- **Problema**: ninguno de los tres campos tiene `required`, y el email no tiene validación de formato forzada. El formulario puede enviarse completamente vacío e insertarse igual (`full_name: ''`, `email: ''`, `message: ''`). Contrasta con `ContactFormSection` e `InfografiaLeadModal`, que sí exigen los campos equivalentes.
- **Recomendación**: agregar `required` a nombre, email y opinión (más validación de formato de email), igual que los otros dos formularios.

### [importante] Bloque "Tendencias de la industria" (inicio) sin adaptación móvil
- **Ubicación**: `src/components/Events.jsx:504` (`NoticiasPanel`, grid inline `gridTemplateColumns:'1fr 1fr'`)
- **Problema**: a diferencia de todos los demás layouts multi-columna del portal (`.contact-grid`, `.category-grid`, `.videoteca-grid`, `.hero-grid`, todos con `@media` en `src/index.css`), este grid de dos columnas está en un `style` inline sin clase asociada — no colapsa a una columna en móvil. Además usa un `height` fijo en px calculado desde la columna derecha en escritorio (línea 507), que se aplica igual en pantallas angostas.
- **Recomendación**: añadir una clase (`.news-grid`) con `@media (max-width: 700px) { grid-template-columns: 1fr; height: auto; }`, siguiendo el mismo patrón del resto del sitio.

### [importante] Tarjetas de "Explora Videos y Webinars" pueden encogerse a un ancho ilegible en móvil
- **Ubicación**: `src/components/Media.jsx:82` (`VideoCard`, carrusel de `ExploraPanel`)
- **Problema**: `flex:'0 0 calc((100% - 3*16px)/4)', minWidth:0` fuerza 4 tarjetas por fila sin piso mínimo — en ~375px da tarjetas de ~80px, ilegibles. `InfoCard` (línea 366, la tarjeta equivalente de infografías) sí tiene `minWidth:180` para evitar exactamente esto.
- **Recomendación**: agregar `minWidth: 180` a `VideoCard`, igual que ya tiene `InfoCard`.

### [menor] HeroSlider colapsa carga, error y "sin slides" en el mismo spinner indefinido
- **Ubicación**: `src/components/Hero.jsx:65-71` (`HeroSlider`)
- **Problema**: el mismo `LoadingState label="Cargando…"` se muestra durante la carga real, si `getHeroSlides()` falla, o si no hay slides activos. Si la consulta falla, el hero queda en "Cargando…" para siempre, sin indicio de error.
- **Recomendación**: distinguir `status === 'error'` con un `ErrorState`, y el caso "sin slides" con un mensaje distinto.

### [menor] CategoryBlocks no muestra nada ante error de carga
- **Ubicación**: `src/components/Hero.jsx:221` (`CategoryBlocks`)
- **Problema**: `if (status !== 'success') return null;` — tanto en carga como en error, el usuario ve un hueco en blanco sin indicio de que algo falló.
- **Recomendación**: diferenciar el caso de error con un `ErrorState` breve en vez de `return null`.

*No se encontraron enlaces rotos hacia rutas inexistentes, ni división por cero/NaN/Infinity en el portal público (esa familia de bug apareció solo en el admin, ver sección 2), ni llamadas a Supabase sin chequeo de `error` — los 9 servicios del portal público verifican `error` de forma consistente.*

---

## 2. Panel de administrador

### [CRÍTICO] [CORREGIDO] El formulario de Noticias nunca puede editar el cuerpo completo del artículo
- **Ubicación**: `src/admin/AdminWidgets.jsx:672-687` (bloque `section === 'news'` de `NewContentModal`) y `src/services/adminContentService.js:63-70,79-90` (`createContentItem`/`updateContentItem`)
- **Problema**: `content_items.body` es el texto completo que consume `/tendencias/:slug` y el popup de noticias del home (`row.body || 'Sin descripción disponible.'`). El formulario de Noticias solo tiene un campo "Información" que se guarda como `summary` — no hay ningún campo para `body`, y `handleSubmit` nunca lo incluye en el objeto enviado a Supabase. Toda noticia creada o editada desde el panel queda con `body = null` para siempre; el público solo ve el resumen corto, nunca el artículo completo.
- **Recomendación**: agregar un campo (textarea grande) para `body` en la sección `news` de `NewContentModal`, inicializarlo desde `item?.body`, incluirlo en `fields.body` al guardar.

### [importante] [CORREGIDO] `Infinity%` en "Videos más vistos" si hay `video_complete` sin `video_play` correspondiente
- **Ubicación**: `src/services/analyticsService.js:118-135` (`getMostWatchedVideos`)
- **Problema**: `completionRate: v.completes > 0 ? Math.round((v.completes / v.plays) * 100) : null` — el guard solo cubre `completes === 0` (evita `0/0`), pero no `plays === 0` con `completes > 0`. Si por pérdida de eventos (red, adblocker) llega un `video_complete` sin su `video_play`, `plays` queda en 0 y el cálculo da `Infinity`, que se renderiza literalmente en la tabla de `/admin/analitica`.
- **Recomendación**: cambiar el guard a `v.plays > 0 ? Math.round(...) : null`, y considerar `Math.min(100, ...)` ya que `completes` podría teóricamente superar `plays`.

### [importante] `deleteContentImageIfUnused` no revisa `events.partner_logo_url` — puede borrar una imagen todavía en uso
- **Ubicación**: `src/services/storageService.js:37-51`, invocado desde `src/services/adminEventsService.js` para `thumbnail_url` y `partner_logo_url`
- **Problema**: la función de limpieza solo verifica `content_items.thumbnail_url` y `events.thumbnail_url` antes de borrar un archivo de Storage — nunca consulta `events.partner_logo_url`. Si dos eventos comparten el mismo logo de colaborador, editar/eliminar uno borra el archivo aunque el otro evento lo siga usando, dejándolo con una imagen rota.
- **Recomendación**: agregar la consulta faltante (`events.partner_logo_url = url`) antes de decidir si borrar.

### [importante] "Duplicar" en Eventos descarta silenciosamente el logo del colaborador y el video embebido
- **Ubicación**: `src/admin/AdminWidgets.jsx:992-999` (`handle('duplicate', row)` para eventos)
- **Problema**: el payload de duplicado copia título/resumen/descripción/modalidad/lugar/thumbnail/registro/colaborador/visibilidad/estado/fecha/galería — pero no `partner_logo_url` ni `video_url`. El evento duplicado pierde el logo y el video sin ningún aviso.
- **Recomendación**: incluir `partner_logo_url` y `video_url` en el objeto de duplicado.

### [importante] Miniatura de video puede quedar desincronizada del link real
- **Ubicación**: `src/admin/AdminWidgets.jsx:540-545` (`handleVideoUrlChange`)
- **Problema**: solo actualiza `thumbnailUrl` cuando el nuevo link produce una miniatura válida. Si el admin borra el campo o pega un link inválido, `thumbnailUrl` conserva el valor del video anterior — se guarda un `external_url` nuevo junto a la miniatura de otro video, sin aviso.
- **Recomendación**: cuando `getYouTubeThumbnailUrl` devuelve `null`, limpiar también `thumbnailUrl`.

### [menor] Código muerto: funciones y datos mock que ya nadie usa
- **Ubicación**: `src/services/adminService.js` (`getContentItems`, `getContentTypeCategories`), `src/data/seed/adminSeed.js` (`CONTENT_ITEMS`, `NOTIFICATIONS`, y verificar `DASHBOARD_STATS`)
- **Problema**: cero llamadores en toda la app (confirmado por grep) — quedaron huérfanos de fases anteriores (Dashboard/notificaciones ya migraron a datos reales).
- **Recomendación**: eliminarlos. `ICON_LIBRARY` sigue siendo legítimo (lo usa `PortadaWidgets.jsx`), no tocar ese.

### [menor] `adminServicesService.createService` sin forma de invocarse desde la UI
- **Ubicación**: `src/services/adminServicesService.js:32-36`; `src/admin/pages/ServiciosPage.jsx` (sin botón "Agregar")
- **Problema**: a diferencia de Portada/Eventos/Contenidos, `ServiciosPage.jsx` solo permite editar/eliminar filas existentes.
- **Recomendación**: decidir si el catálogo debe tener cardinalidad fija (y entonces borrar `createService` como código muerto) o si falta el botón "Agregar servicio".

### [menor] Lecturas previas a `update()` sin chequear `error` — solo afecta la limpieza de Storage, no corrompe datos
- **Ubicación**: `adminContentService.js:82`, `adminEventsService.js:81`, `adminPortadaService.js:46`
- **Problema**: el `select()` previo al `update()` (para saber si hay que limpiar una imagen anterior) no desestructura `error`. Si falla, la limpieza se salta en silencio — no rompe el update principal.
- **Recomendación**: loguear el error de esa lectura auxiliar para poder diagnosticar acumulación de archivos huérfanos.

### [menor] Formulario de Eventos no contempla estados legado `archived`/`completed`
- **Ubicación**: `src/admin/AdminWidgets.jsx:730-736` (`<select>` de Estado, solo `draft`/`published`) vs. `adminEventsService.js:10` (`STATUS_LABEL` sigue incluyendo ambos)
- **Problema**: si un evento tuviera alguno de esos estados, el `<select>` no tiene esa opción — se muestra en blanco al editar.
- **Recomendación**: quitar esos valores de `STATUS_LABEL` si ya no son alcanzables, o agregarlos al `<select>` si pueden aparecer.

### [menor] `InfographicLeadsPanel` no reajusta `page` si el total de filas se reduce
- **Ubicación**: `src/admin/AdminWidgets.jsx:1479-1543`
- **Problema**: a diferencia de `ContentTable` (que sí tiene un `useEffect` de clamping), este panel solo resetea `page` al cambiar la búsqueda. Hoy no hay acción de borrado en la UI así que no se dispara, pero quedaría descubierto si se agrega "Eliminar lead" más adelante.
- **Recomendación**: replicar el mismo guard de `ContentTable` por consistencia.

---

## 3. RLS y GRANTs (todas las migraciones)

| Tabla | RLS habilitado | Políticas OK | GRANT OK (estado final) | Veredicto |
|---|---|---|---|---|
| `profiles` | Sí | Sí | Sí | OK |
| `categories` | Sí | Sí | Sí | OK |
| `content_items` | Sí | Sí | Sí | OK |
| `hero_slides` | Sí | Sí | Sí | OK |
| `events` | Sí | Sí | Sí | OK |
| `event_registrations` | Sí | Sí | Sí | OK (pero tabla huérfana, ver sección 1 y 5) |
| `contact_messages` | Sí | Sí | Sí | OK |
| `feedback` | Sí | Sí | Sí | OK |
| `infographic_leads` | Sí | Sí | Sí | OK |
| `site_settings` | Sí | Sí | Sí (corregido) | OK ahora — fue el incidente histórico #1 |
| `services` | Sí | Sí | Sí (corregido) | OK ahora — mismo incidente #1 |
| `analytics_events` | Sí | Sí | Sí (incluido desde el inicio) | OK — buena práctica aplicada |
| `storage.objects` (bucket `content-images`) | Sí | Sí | N/A (API de Storage) | OK |

**Ninguna tabla queda con el hueco histórico de GRANT faltante.** El riesgo real ya se materializó y se corrigió (`site_settings`/`services`).

### [importante] Falta `NOTIFY pgrst, 'reload schema'` en la mayoría de migraciones — riesgo hermano, no solo de columnas nuevas
- **Ubicación**: prácticamente todas las migraciones anteriores a 2026-08-10, incluidas `20260731100200_site_settings.sql`, `20260731100300_services.sql`, `20260731100400_grants_site_settings_services.sql`, `20260728110000_grants_anon_authenticated.sql`. Solo las migraciones desde `20260810100000_events_gallery.sql` en adelante lo incluyen.
- **Problema**: el propio comentario de `20260810100000_events_gallery.sql` documenta que esto causó un bug real en producción ("Could not find the 'gallery' column... in the schema cache") hasta agregar el NOTIFY manual. Si PostgREST no recarga su caché automáticamente tras un DDL en este proyecto (confirmado empíricamente para `ALTER TABLE ADD COLUMN`), es razonable que el mismo riesgo aplique a `CREATE TABLE` — una tabla nueva podría quedar invisible para PostgREST hasta el próximo reload, con el mismo síntoma superficial (endpoint "no responde") que ya se vio dos veces.
- **Recomendación**: agregar `notify pgrst, 'reload schema';` de forma sistemática a toda migración que haga `create table`, `alter table ... add column`, o cambie `grant`/`revoke` — de aquí en adelante (no hace falta retroactivo si el esquema ya está desplegado y funcionando).

### [importante] `analytics_events_insert_anon` permite inserciones anónimas sin límite de tamaño/tasa
- **Ubicación**: `supabase/migrations/20260815100000_analytics_events.sql` (política `with check (true)`)
- **Problema**: correcto en principio (tracking anónimo necesita insert abierto), pero no hay restricción de tamaño sobre `metadata` (jsonb sin límite) ni de volumen por `session_id`/`anonymous_id` — un cliente sin autenticar podría inundar la tabla con payloads grandes.
- **Recomendación**: agregar un `check` de tamaño razonable sobre `metadata` (`pg_column_size(metadata) < N`) y/o limitar la tasa a nivel de aplicación.

### [menor] `enforce_single_featured_news()` no fija `search_path`, inconsistente con el resto de funciones
- **Ubicación**: `supabase/migrations/20260812110000_single_featured_news_trigger.sql`
- **Problema**: a diferencia de `handle_new_user`, `is_admin`, `promote_to_admin`, `list_admin_profiles` (todas `security definer` + `set search_path = public`), esta función no fija `search_path`. No es una escalación de privilegios real hoy, pero rompe la convención del proyecto.
- **Recomendación**: agregar `set search_path = public` por consistencia.

### [menor] Sin validación de formato de email a nivel de base de datos en tablas de insert público
- **Ubicación**: `contact_messages`, `feedback`, `infographic_leads`, `event_registrations`
- **Problema**: las políticas de insert público (`with check (true)`) no imponen formato sobre `email` — cualquiera con la `anon key` puede insertar directamente vía REST con datos basura, sin pasar por el frontend.
- **Recomendación**: considerar un `check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')` si se quiere reducir ruido.

**Confirmaciones sin hallazgo**: `avatar_url` en `profiles` no necesitaba GRANT nuevo (el `UPDATE` de tabla completa ya lo cubre — confirmado que no hay ningún GRANT column-restringido en el repo). Todas las funciones `SECURITY DEFINER` relevantes tienen `search_path` fijo. `list_admin_profiles()` y `promote_to_admin()` verifican permisos correctamente. El bucket `content-images` tiene lectura pública / escritura solo-admin como documentan sus comentarios.

---

## 4. Consola del navegador

Navegado en vivo: `/`, `/tendencias`, `/videoteca`, `/eventos`, `/infografias` (desktop y mobile 375px), y las 12 rutas de `/admin/*` (vía bypass temporal de `AdminRoute`, revertido). Sin sesión activa, los 401 esperados de RLS aparecen en todas las rutas admin — no son un hallazgo, es el comportamiento correcto (RLS rechazando sin sesión). No se encontró ningún error de React no capturado, ningún warning de "key" faltante, ni overflow horizontal en mobile (confirmado con `document.documentElement.scrollWidth === innerWidth`).

### [menor] React Router "Future Flag Warning" en toda ruta
- **Ubicación**: aparece en consola en cualquier página (portal y admin) — proviene de la configuración de `createBrowserRouter` en `src/routes/AppRouter.jsx`
- **Problema**: react-router-dom v6.28 avisa que v7 cambiará el comportamiento de `state updates` a `React.startTransition` — no rompe nada hoy, es una advertencia de compatibilidad futura.
- **Recomendación**: opt-in temprano con la future flag `v7_startTransition` (y revisar el resto de future flags de v7) cuando se planee la migración a react-router v7, o silenciarlo si no hay plan de actualizar pronto.

---

## 5. Deploy / build / documentación

### [importante] `README.md` describe un estado del proyecto varias fases desactualizado
- **Ubicación**: `README.md:7,13,14,17,101-106`
- **Problema**: el README dice textualmente que "mensajes de contacto, opiniones de clientes y leads de infografías... siguen simulados" y que "servicios TIBOX... sigue sin conectar" — ambas afirmaciones son falsas desde hace varias fases (`formService.js` inserta de verdad en `contact_messages`/`feedback`/`infographic_leads` desde Fase 6-7-8; Servicios TIBOX se conectó a Supabase en la tarea #71 de esta sesión). El README nunca se actualizó después de esos cambios, y tampoco refleja nada de lo construido en Fases 9 a 12 (analítica, tracking de video, campanita real, Mi Perfil real).
- **Recomendación**: reescribir la sección "Estado actual" y "Estructura" del README para reflejar el estado real — es el primer archivo que lee cualquiera (incluida una futura sesión de IA) para entender qué es real y qué no, y hoy induce a error activamente.

### [importante] `WP_UPLOAD_SECRET` (función serverless de subida de imágenes a WordPress) sin confirmar en producción
- **Ubicación**: `api/upload-event-image.js` (lee `process.env.WP_UPLOAD_SECRET`), documentado como pendiente en `docs/integrations/wordpress-image-upload.md`
- **Problema**: el propio documento de integración ya lista esto como "Qué falta para que funcione (acción de Braulio)" — configurar la variable en Vercel y pegar el snippet en WordPress. No hay forma de confirmar desde este entorno si ya se completó; si no, el botón "Subir imagen" en la galería de eventos falla en Vercel con un 500 explícito (el código sí maneja ese caso correctamente, no es un bug de código, es un ítem de checklist de deploy).
- **Recomendación**: confirmar en el dashboard de Vercel que `WP_UPLOAD_SECRET` está seteada (Production/Preview/Development) y que el snippet de WordPress está activo, siguiendo los 4 pasos ya documentados.

### [menor] CORS abierto (`Access-Control-Allow-Origin: '*'`) en la Edge Function `invite-admin`
- **Ubicación**: `supabase/functions/invite-admin/index.ts` (constante `corsHeaders`)
- **Problema**: ya autoflagged en el propio comentario del archivo como "mejora sugerida una vez exista un dominio de producción fijo". El riesgo real es acotado — la función verifica sesión de admin válida antes de hacer nada privilegiado — pero un origen específico sería más correcto una vez que el dominio final esté decidido.
- **Recomendación**: restringir a un origen específico cuando el dominio de producción del panel esté confirmado. (Nota: este archivo es parte del lote "invite-admin" que ha quedado sin commitear toda la sesión — este hallazgo aplica al código tal como está en el working tree, no implica tocarlo ahora.)

### [menor] Tabla `event_registrations` completamente huérfana — sin ningún `insert`/`select` en toda la app
- **Ubicación**: `supabase/migrations/20260727100600_event_registrations.sql` (tabla + RLS + GRANT, todos correctos) — cero referencias en `src/`
- **Problema**: la tabla existe, tiene RLS/GRANT bien configurados (confirmado en la sección 3), pero nunca se usa — el flujo de "inscripción a evento" en el portal es siempre un link externo (`registrationUrl`), nunca un formulario interno que inserte en esta tabla. Es mantenimiento de esquema para una funcionalidad que no existe en el código.
- **Recomendación**: decidir si el plan es implementar algún día un formulario de inscripción interno (y entonces dejar la tabla como está, documentando la intención) o si se prefiere eliminarla para no mantener RLS/políticas de algo sin uso.

---

## Próximos pasos

Este documento es solo diagnóstico. Cuando lo revisemos juntos, conviene priorizar en este orden sugerido (no vinculante):

1. **Crítico**: cuerpo de noticias no se guarda (afecta contenido real ya publicado con `body = null`).
2. **Importante, alto impacto de datos**: `Infinity%` en Videos más vistos, duplicar evento pierde campos, limpieza de Storage con falso negativo en `partner_logo_url`.
3. **Importante, UX del portal público**: validación de formularios, CTA sin `href`, feedback de descarga fallida, mobile de "Tendencias"/`VideoCard`.
4. **Importante, higiene de infraestructura**: `NOTIFY pgrst` sistemático, límite en `analytics_events`, README actualizado, confirmar `WP_UPLOAD_SECRET`.
5. **Menor**: el resto — código muerto, consistencia de convenciones, edge cases de paginación.
