# Fase 06-07-08 (combinada y acotada) — Contenido real para el evento de agosto

**Estado:** Completa en el código; verificación con datos reales confirmada en el portal público (ver [Pruebas](#pruebas-realizadas)). El flujo de creación/edición desde el panel admin no se pudo probar con una sesión de administrador real desde este entorno de trabajo (sin credenciales) — ver [Pendiente](#pendiente).
**Fecha:** 2026-07-29
**Rama de trabajo:** `feat/react-vite-migration` (misma de las fases anteriores)
**Repositorio:** https://github.com/bcastrotbx/TiboxConnect

## Objetivo

Esta fase combina, de forma acotada y acelerada, partes de las Fases 6, 7 y 8 del plan maestro original, por una urgencia de negocio real: **hay un evento la primera semana de agosto de 2026** y se necesita poder cargar contenido de verdad (noticias, infografías, videos/webinars con link, y el evento mismo) antes de esa fecha. Se conecta la lectura pública del portal a Supabase, se agrega Supabase Storage para imágenes, y se conecta el panel admin para estos 4 tipos de contenido — **sin** tocar `resources` genéricos, galería de eventos, invitación de administradores adicionales (ya resuelta en la Fase 5) ni el guardado real de leads de infografías (sigue simulado con `sessionStorage` hasta la Fase 9).

## Alcance realizado

### Parte A — Lectura pública del portal conectada a Supabase

1. **`src/services/contentService.js`, `src/services/newsService.js`, `src/services/eventService.js`, `src/services/homeService.js`** ya no leen de `src/data/seed/*.js` — consultan `content_items`/`events`/`hero_slides` reales, filtrando explícitamente `status='published'` y `visibility='public'` en la propia consulta (no "traer todo y filtrar en el cliente"), aunque RLS ya lo exigiría de todas formas.
2. **`src/services/categoryService.js`** (nuevo): categorías reales de la tabla `categories`, compartidas por videos, infografías y noticias — ver la decisión de unificación de taxonomías más abajo.
3. **Manejo de error real:** todos los servicios re-lanzan el error de Supabase (`throw error`), que `useAsyncData` ya captura desde la Fase 2 y convierte en el estado `error` que los componentes ya sabían mostrar (`ErrorState`) — no se inventó ningún manejo nuevo de errores en los componentes.
4. **Categoría "Webinars"** agregada como fila real (`supabase/migrations/20260729100000_webinars_category.sql`), pedido explícito de Braulio.
5. **`src/data/seed/*.js` se dejó intacto** como referencia — ningún componente ni servicio lee de ahí ya.

### Parte B — Supabase Storage para imágenes

6. **`supabase/migrations/20260729100200_storage_content_images.sql`**: bucket `content-images` (público) + políticas RLS sobre `storage.objects` (lectura pública, escritura solo administradores vía `is_admin()`).
7. **`src/services/storageService.js`** (nuevo): `uploadContentImage(file)` valida tipo (jpg/png/webp) y tamaño (máx. 5MB) antes de subir, devuelve la URL pública.

### Parte C — Panel admin real

8. **`src/services/adminContentService.js`** y **`src/services/adminEventsService.js`** (nuevos): CRUD real (crear, editar, eliminar, cambiar estado) contra `content_items`/`events`.
9. **`NewContentModal`** (`src/admin/AdminWidgets.jsx`) reescrito por completo — antes era un formulario decorativo (el botón "Guardar" solo cerraba el modal sin leer ningún campo). Ahora:
   - **Infografías y noticias:** suben una imagen real (`storageService`) y guardan la URL en `thumbnail_url`.
   - **Videos:** al pegar un link de YouTube, se extrae automáticamente el ID y se arma la miniatura (`https://img.youtube.com/vi/ID/hqdefault.jpg`) sin intervención manual. Si el link no es de YouTube, el campo de miniatura queda vacío y el formulario no se rompe (otras plataformas quedan para una fase futura).
   - **Todos los tipos** (video/infografía/noticia): guardar como borrador, publicar, archivar, editar, eliminar con confirmación, marcar como destacado.
   - **Eventos:** título, fecha/hora de inicio y término, modalidad, ubicación, banner (misma subida de imagen), enlace de inscripción, colaborador (texto), visibilidad, estado (incluyendo `completed` para eventos realizados).
10. **`ContentTable`/`RowMenu`** reescritos: listan datos reales y ofrecen acciones rápidas (Publicar/Archivar/Volver a borrador/Marcar como realizado/Destacar) según el estado real de cada fila, todas contra Supabase.
11. **Protección real, no solo de ruta:** cada llamada a Supabase corre con la sesión del navegador — si no hay sesión de admin activa, RLS rechaza la operación en el servidor (probado indirectamente: es el mismo mecanismo ya verificado en la Fase 5 para `profiles`; no se agregó ninguna ruta ni función que reciba una clave con privilegios elevados en el frontend).

## Explícitamente fuera de alcance de esta fase

- **`resources` genéricos** (`content_items.type='resource'`): el modelo de datos ya lo soporta (Fase 4), pero no hay UI de portal ni de admin para este tipo todavía.
- **Galería de eventos realizados** (`event.gallery`): la Fase 01B ya la tenía en el diseño visual, pero no hay columna en `events` para esto ni se agregó — `VistaModal` ahora oculta la sección de galería si no hay datos, en vez de crashear (ver "Problemas encontrados y corregidos").
- **Invitar administradores adicionales:** ya resuelto en la Fase 5 (`/admin/usuarios`), no se tocó en esta fase.
- **Guardado real de leads de infografías:** `InfografiaLeadModal` sigue simulando el envío y recordando el estado en `sessionStorage` (ver Fase 01B) — persistirlo en la tabla `infographic_leads` (ya existe desde la Fase 4) queda para la Fase 9.
- **Edición de la portada/hero desde el admin:** `homeService.getHeroSlides()` ya lee de Supabase (Parte A), pero no hay UI en `/admin/portada` para crear/editar slides — se sembraron los 4 slides existentes vía migración para que el hero no quede vacío (ver decisión 3).

## Archivos creados/modificados

```
src/lib/formatters.js                   (nuevo — fechas, duración, tiempo de lectura, modalidad)
src/lib/slugify.js                      (nuevo — slugs únicos para content_items/events)
src/lib/youtube.js                      (nuevo — extracción de ID y miniatura de YouTube)
src/services/categoryService.js         (nuevo — categorías reales compartidas)
src/services/storageService.js          (nuevo — subida de imágenes a content-images)
src/services/adminContentService.js     (nuevo — CRUD real de content_items)
src/services/adminEventsService.js      (nuevo — CRUD real de events)

src/services/contentService.js          (conectado a Supabase)
src/services/newsService.js             (conectado a Supabase)
src/services/eventService.js            (conectado a Supabase)
src/services/homeService.js             (hero_slides conectado a Supabase)
src/admin/AdminWidgets.jsx              (NewContentModal/ContentTable/RowMenu reescritos)
src/components/Events.jsx               (año real en fechas, galería opcional, logo de colaborador con fallback)
src/components/Hero.jsx                 (separador de "tag" oculto si no hay valor)

supabase/migrations/20260729100000_webinars_category.sql    (nuevo)
supabase/migrations/20260729100100_hero_slides_seed.sql      (nuevo)
supabase/migrations/20260729100200_storage_content_images.sql (nuevo)
```

No se modificó `src/data/seed/*.js` (se deja como referencia) ni la Edge Function/flujo de invitación de administradores de la Fase 5.

## Comandos ejecutados

```bash
npm run lint
npm run build
```

## Pruebas realizadas

### `npm run lint`
```
✖ 0 problems
```
0 errores, 0 warnings — la reescritura de `RowMenu` de paso eliminó el único warning preexistente desde la Fase 1 (`ix` sin usar), al dejar de necesitar ese índice.

### `npm run build`
```
vite v6.4.3 building for production...
✓ 1682 modules transformed.
dist/index.html                     1.12 kB │ gzip:   0.41 kB
dist/assets/index-*.css             6.16 kB │ gzip:   1.70 kB
dist/assets/index-*.js          1,421.92 kB │ gzip: 304.21 kB
✓ built in 1.52s
```
0 errores. Mismo problema estructural de bundle único ya documentado desde la Fase 2.

### Verificación manual en el navegador — portal público con datos reales

Se levantó el servidor de desarrollo (`http://localhost:5173`) y se confirmó, **contra el proyecto Supabase real** (con las migraciones y el `seed.sql` de la Fase 4 ya ejecutados por Braulio):

1. **Videoteca:** el video de ejemplo "Cómo proteger a tu pyme de ataques de phishing" aparece con su categoría real ("Ciberseguridad"), duración ("12 min") y fecha ("27 Jul 2026"). 0 errores de consola.
2. **Infografías:** los chips de categoría muestran las categorías reales ("Todas", "Ciberseguridad", "Cloud & Infraestructura", "Transformación Digital") y la infografía de ejemplo carga su imagen.
3. **Noticias:** "Tendencias de la industria" muestra la noticia de ejemplo con categoría, fuente ("TIBOX") y fecha reales.
4. **Próximos eventos:** el evento de ejemplo aparece con día/mes correctos, y el logo de Microsoft como colaborador (el emparejamiento de `partner_name` contra el set curado de logos funcionó). Se abrió el modal de detalle y se confirmó la fecha con el **año correcto** ("10 Ago 2026" — antes hardcodeado a "2026" sin importar el año real, ver "Problemas encontrados y corregidos").
5. **Eventos realizados:** "Todavía no hay eventos realizados" se muestra correctamente (estado vacío, no un error) — el proyecto real no tiene ningún evento con `status='completed'` todavía.
6. **Hero (portada):** se confirmó que `getHeroSlides()` responde `[]` sin error — es correcto, porque la migración de seed de `hero_slides` (parte de esta misma fase) todavía no se ha ejecutado contra el proyecto real (queda para que Braulio la corra, ver Pendiente). El slider muestra su estado de placeholder ("Cargando…") en vez de un slide real mientras tanto — ver nota en "Problemas conocidos".

Se usó la consola del navegador para invocar directamente `contentService.getVideos()`, `eventService.getUpcomingEvents()/getPastEvents()`, `newsService.getNews()` y `homeService.getHeroSlides()` y confirmar que cada uno responde con los datos reales esperados (o un array vacío, sin lanzar error) — no se asumió que "compiló" significa que "funciona contra la base real".

### Lo que no se pudo probar desde este entorno

- **Crear/editar/publicar/archivar contenido desde el panel admin real**, ni la subida de imágenes, ni la extracción automática de miniatura de YouTube desde la UI — todo esto requiere una sesión de administrador real, y este entorno de trabajo no tiene credenciales (mismo motivo documentado en la Fase 5 para el login). El código se revisó manualmente y se validó que usa los mismos servicios (`contentService`/`eventService`/`categoryService`) ya probados exitosamente contra el proyecto real en la lectura pública — no es código nuevo sin ningún tipo de validación contra la base real, pero la ruta de escritura específicamente queda pendiente de que Braulio la ejercite.
- **El bucket `content-images`** no se pudo crear ni probar desde aquí (sin acceso al panel de Supabase).

## Decisiones tomadas

1. **Unificación de las 4 taxonomías de categorías del prototipo original** (`VIDEO_CATS`, `LIB_CATS`, `INFO_CATS`, `NEWS_CATS`, cada una con IDs y colores propios y sin relación entre sí) **en una sola tabla real `categories`**, ya diseñada así desde la Fase 4 (una tabla, compartida por todos los tipos de `content_items`). Se optó por esto en vez de inventar 4 tablas de categorías separadas (no pedido, y contradice el modelo ya versionado) o mantener las categorías como listas hardcodeadas (contradice "conectar a Supabase"). Consecuencia visible: los chips de categoría ahora muestran "Ciberseguridad", "Cloud & Infraestructura", "Transformación Digital", "Webinars" en vez de las categorías más granulares del prototipo original (p. ej. "Microsoft Copilot", "Zero Trust").
2. **La videoteca rápida (`getVideoCategories`) y la biblioteca completa (`getVideoLibraryCategories`) devuelven exactamente la misma lista de categorías reales.** El prototipo original tenía dos taxonomías separadas (`cat` vs `libCat`) sin relación entre sí; se unificaron en una sola, evitando así tocar el filtrado de `VideoLibraryModal` en `Media.jsx` (que ya comparaba `v.libCat === filter`) — el servicio simplemente pone el mismo valor en ambos campos.
3. **Se sembró `hero_slides` con los 4 slides ya existentes** (`20260729100100_hero_slides_seed.sql`), aunque no estaba pedido explícitamente: la Fase 4 nunca sembró esta tabla, y conectar `homeService.getHeroSlides()` (pedido explícito de esta fase) sin datos habría dejado el hero del portal vacío justo antes del evento de negocio — una regresión visual evitable. La edición de slides desde el admin queda fuera de alcance (no pedida).
4. **`getModalidadConfig()`, `getPartners()` y `getCategoryBlocks()` se mantienen estáticos** (no conectados a Supabase): son configuración visual/de navegación (colores de modalidad, logos de un set curado de partners, bloques de navegación de la portada), no contenido editable, y no existe (ni se pidió crear) una tabla para esto.
5. **`events.partner_name` es texto libre, no una referencia a los 4 logos curados** (`PARTNERS`): se intenta emparejar por nombre (case-insensitive); si no hay coincidencia, `EventCard` muestra el nombre en texto en vez de un logo roto. Esto requirió un ajuste mínimo en `Events.jsx` (antes mostraba un `<img>` con `src=""` si no había partner, lo que renderiza un ícono de imagen rota).
6. **"Colaborador" en el formulario de eventos es un campo de texto (`partner_name`), no una subida de logo:** el mock original tenía un uploader de "Logo del partner", pero `events` no tiene ninguna columna para guardar un logo — agregar una habría sido una ampliación del modelo de datos no pedida. Se reemplazó por un input de texto que coincide exactamente con la columna real.
7. **Se agregaron campos no presentes en el mock original pero necesarios para que las funciones ya existentes tuvieran sentido:** "Fuente" en noticias (sin esto, `source_name` quedaría siempre vacío y `NoticiasPanel` ya muestra ese dato), "Resumen" en infografías (sin esto, `InfografiaModal` ya muestra `summary` y quedaría siempre vacío), y "Reseña completa" en eventos (el modal de detalle ya prioriza `description` sobre `summary`). Ninguno es una funcionalidad nueva — son los campos que las pantallas públicas ya construidas necesitan para no mostrarse vacías.
8. **Recarga completa de la página (`window.location.reload()`) tras guardar/duplicar/eliminar/cambiar estado**, en vez de propagar el cambio en memoria entre componentes: el botón "Nuevo" vive en `AdminLayout` (fuera de la página de la ruta) y `ContentTable` vive dentro de la página — hoy no comparten estado. Se documenta como una simplificación deliberada para esta fase, no como el diseño final (ver Pendiente).
9. **Slug de `content_items`/`events` generado automáticamente** (`makeSlug()`, título + sufijo aleatorio) y no expuesto como campo editable — es un identificador interno para la columna `unique not null`, no un dato que el administrador necesite decidir en esta fase.
10. **La categoría de un evento no existe** (el modelo de la Fase 4 no le dio `category_id` a `events`) — la columna "Categoría" de la tabla compartida del admin (`ContentTable`) muestra la modalidad (Online/Presencial/Híbrida) para eventos, reutilizando la misma columna visual en vez de rediseñar la tabla solo para este caso.
11. **`adminUsersService.js` (Fase 5) sigue siendo, junto con los nuevos `adminContentService.js`/`adminEventsService.js`, los únicos servicios "de escritura" conectados a Supabase de verdad** — el resto de `src/services/*` (`formService.js`, por ejemplo) permanece simulado, ya que el guardado real de mensajes/opiniones/leads de infografías está fuera de alcance de esta fase (Fase 9).

## Problemas encontrados y corregidos durante la verificación

- **Fecha de evento con año hardcodeado a "2026":** `EventDetailModal` y `VistaModal` (`src/components/Events.jsx`) mostraban `${event.day} ${event.month} 2026` literalmente, sin usar ningún dato real de año. Con datos de ejemplo esto pasaba desapercibido (todos eran de 2026), pero con contenido real de cualquier año sería incorrecto. Se agregó `year` al mapeo de `eventService.js` y se corrigieron ambos componentes para usar `event.year`.
- **`event.gallery.map(...)` sin guarda:** `VistaModal` asumía que todo evento realizado trae una galería de fotos. Como la galería está fuera de alcance de esta fase, un evento real sin ese campo habría hecho crashear el modal al abrirlo. Se agregó `const gallery = event.gallery || []` y la sección de galería ahora solo se renderiza si hay fotos.
- **Logo de colaborador roto cuando `partner_name` no coincide con el set curado:** `EventCard` renderizaba `<img src={partner.logo}>` con `src=""` si no había coincidencia, mostrando el ícono de imagen rota del navegador. Se agregó un fallback a mostrar el nombre del colaborador en texto, y a ocultar la fila "Colaborador" por completo si no hay ni logo ni nombre.

## Problemas conocidos

- **El hero del portal queda vacío ("Cargando…") hasta que Braulio ejecute la migración `20260729100100_hero_slides_seed.sql`** — comportamiento esperado, no un bug (ver decisión 3 y Pendiente).
- **`Hero.jsx` muestra la etiqueta "Cargando…" tanto mientras carga como cuando la lista de slides está legítimamente vacía** — es un comportamiento heredado de la Fase 2 (no introducido en esta fase), que se hizo visible recién ahora que `hero_slides` puede estar vacío de verdad contra un proyecto real. No se corrigió en esta fase por no ser parte del alcance pedido (se documenta como mejora sugerida).
- **Sin refetch en memoria tras las acciones del admin** (ver decisión 8) — cada acción recarga la página completa. Funciona y es seguro, pero no es la experiencia más fluida.
- **No se pudo verificar la creación del bucket `content-images` por SQL contra un proyecto real** — la migración incluye el paso manual alternativo por si el `INSERT` sobre `storage.buckets` no tiene permisos suficientes en el proyecto de Braulio (ver el comentario dentro de `supabase/migrations/20260729100200_storage_content_images.sql`).
- **Bundle único de Vite** sigue siendo el mismo problema estructural documentado desde la Fase 2.

## Ajuste posterior — popup de noticias en vez de salir a una URL externa

Ajuste acotado pedido por Braulio, dentro del mismo alcance de esta fase (no requirió tocar el modelo de datos ni migraciones nuevas):

- **Antes:** al hacer clic en una tarjeta de noticia de la lista, o en "Ver publicación" de la noticia destacada, se navegaba a `content_items.external_url` en una pestaña nueva.
- **Ahora:** ambos abren un popup (`NoticiaModal`, en `src/components/Events.jsx`), con el mismo patrón de `ModalShell` que ya usan `InfografiaModal` y `EventDetailModal` — imagen (`thumbnail_url`), categoría, título y el texto completo (`body`). Si `body` está vacío (p. ej. contenido migrado antes de tener este campo), se usa `summary` como respaldo, para que el popup nunca quede en blanco — resuelto en el propio `newsService.mapNewsRow()`/`getFeaturedNews()`, no en el componente.
- Esto aplica **solo a noticias**: videos, infografías y eventos conservan su interacción actual, sin cambios.
- `external_url` se sigue leyendo y guardando (no se tocó el modelo de datos ni el formulario del admin), simplemente ya no se usa para navegar desde el portal — queda disponible por si se reactiva un enlace "ver publicación original" más adelante.
- De paso, se hizo explícito el orden de la lista de noticias: `getNews()`/`getFeaturedNews()` ya ordenaban por `published_at` descendente desde que se conectó esta fase a Supabase, pero se agregó `nullsFirst: false` explícito en el `.order()` — Postgres ordena `NULLS FIRST` por defecto en un orden descendente, así que sin esto una noticia sin `published_at` habría aparecido primera en vez de al final. Aplica solo a noticias; videos, infografías y eventos siguen con su orden actual, sin cambios.

**Verificado en el navegador**, directamente en el portal público (`/`, sin necesitar sesión — esta parte no vive detrás de `/admin/*`): clic en una tarjeta de la lista abre el popup con imagen/categoría/título/texto completo; "Ver publicación" de la noticia destacada abre el mismo popup; la "X" cierra correctamente. 0 errores de consola en los tres casos. De paso se confirmó que el orden de la lista ya reflejaba contenido real recién publicado por Braulio apareciendo primero.

## Pendiente

- **Braulio debe ejecutar, en este orden, las 3 migraciones nuevas de esta fase** (`20260729100000_webinars_category.sql`, `20260729100100_hero_slides_seed.sql`, `20260729100200_storage_content_images.sql`) en el SQL Editor de Supabase, después de las ya ejecutadas de las Fases 4 y 5.
- **Si el `INSERT` sobre `storage.buckets` de la migración de Storage falla**, crear el bucket manualmente: Supabase Dashboard → Storage → New bucket → nombre `content-images` → Public bucket activado. Luego ejecutar el resto del archivo (las políticas RLS) igual.
- **Probar el flujo completo de creación de contenido desde el panel admin** (login real, crear/publicar una noticia con imagen, una infografía con imagen, un video de YouTube, un evento con banner y enlace de inscripción) — ver los pasos exactos en el mensaje de cierre de esta fase.
- Conectar el guardado real de leads de infografías (`InfografiaLeadModal` → tabla `infographic_leads`) — Fase 9.
- Agregar `resources` genéricos y galería de eventos, si el negocio los sigue necesitando después del evento de agosto.
- Mejorar el refetch tras acciones del admin sin recargar la página completa (ver decisión 8).
- Evaluar restringir el CORS de Storage/Edge Functions a un dominio fijo una vez exista uno de producción (heredado de la Fase 5).

## Próxima fase recomendada

Fase 9 (o la que Braulio priorice después del evento de agosto) — guardado real de leads de infografías, mensajes de contacto y opiniones (conectar `formService.js` a Supabase), y evaluar `resources`/galería de eventos si siguen siendo necesarios. **No se avanza sin confirmación explícita de Braulio**, y sin que primero se hayan ejecutado las migraciones de esta fase y probado la creación de contenido real desde el panel admin.
