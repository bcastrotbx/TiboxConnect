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

## Ajuste posterior — URL de imagen como alternativa a subir archivo (noticias/infografías)

Ajuste urgente pedido por Braulio para la demo, dentro del mismo alcance de esta fase:

- **Antes:** en "Nueva noticia" y "Nueva infografía", la única forma de poner una imagen era subir un archivo a `content-images` (Supabase Storage).
- **Ahora:** un selector de pestañas ("Subir archivo" / "o pega una URL") sobre el mismo campo `Imagen` deja elegir entre subir un archivo (como ya funcionaba) o pegar directamente el link de una imagen ya alojada en otro lugar. Implementado en `src/admin/AdminWidgets.jsx`: `ImageUploadInner` (subida, sin cambios de comportamiento) y `ImageUrlInner` (nuevo) son las dos piezas intercambiables dentro de `ImageUploadOrUrlField` (nuevo). `ImageUploadField` (subida-solamente) se mantiene intacta para el banner de eventos, que no pidió esta alternativa.
- Si se pega una URL, se muestra una vista previa dentro del formulario apenas termina de cargar (`<img onLoad>`); si la imagen no carga (`onError`), se muestra un mensaje de error claro sin bloquear ni romper el formulario — se puede guardar igual, con una advertencia de que probablemente tampoco se vea en el portal.
- Al guardar, `thumbnail_url` queda exactamente con el link pegado — esa vía **no pasa por Supabase Storage en ningún momento** (no hay llamada a `storageService.uploadContentImage`).
- Aplica **solo a noticias e infografías**, tal como se pidió. Videos (miniatura automática de YouTube) y eventos (banner solo por subida) no cambian.

**Verificado en el navegador** (mismo método cuidadoso que en el fix anterior del selector de imágenes: sin sesión de admin real disponible en este entorno, se montó el `NewContentModal` real de "noticias" en una ruta temporal fuera de `/admin/*`, se probó, y se revirtió todo — la ruta temporal y el archivo de prueba no quedaron en el repositorio):
- Pestaña "o pega una URL" cambia correctamente el campo.
- Una URL de imagen inválida (bloqueada por hotlinking) mostró el mensaje de error esperado, sin romper el formulario.
- Una URL de imagen pública válida (`https://picsum.photos/400/300`) mostró la vista previa correctamente.
- Al enviar el formulario con la URL puesta, se confirmó vía `performance.getEntriesByType('resource')` que la única llamada de red a Supabase fue un `POST` directo a `rest/v1/content_items` — **cero llamadas a `storage/v1/object/...`** — confirmando que `thumbnail_url` viajó tal cual, sin pasar por Storage. La operación fue rechazada por RLS (`permission denied for table content_items`, esperado sin sesión de admin real) y el error se mostró correctamente en el formulario, sin crashear.

## Ajuste posterior — más contenido de ejemplo para la demo

Migración `supabase/migrations/20260730100000_demo_content_agosto.sql` (mismo patrón idempotente que `seed.sql` y las migraciones anteriores — `ON CONFLICT` sobre `slug`): agrega 2 videos, 2 infografías, 2 noticias (con `body` completo, no solo `summary`) y 3 eventos (2 próximos con `registration_url` de ejemplo + 1 realizado), todos `status='published'`/`visibility='public'`, usando las categorías ya existentes. No reemplaza `supabase/seed.sql` — es contenido adicional para que el portal no se vea vacío en la demo. Ver el contenido completo del archivo en el mensaje de cierre de esta fase, entregado a Braulio para ejecutar en el SQL Editor.

## Ajuste posterior — colores distintos en los bloques de navegación bajo el hero

Los 4 bloques ("Explora", "Noticias", "Eventos", "Tu Opinión") usaban el mismo degradado azul (`CAT_BLUE`) y no se distinguían entre sí. Se agregó `CAT_GRADIENTS` en `src/components/Hero.jsx`, un color por bloque, tomado de la misma paleta que ya usan las categorías reales (no colores inventados):
- **Explora** (Videos y Webinars) → morado, el mismo tono que la categoría "Webinars" (`#6a3ed0`).
- **Noticias** → azul, el mismo tono que "Cloud & Infraestructura" (`#2D6CF2`) — es también el color que ya tenía el bloque original, así que queda como referencia visual.
- **Eventos** → verde, el mismo tono que "Transformación Digital" (`#2DBE60`).
- **Tu Opinión** → naranja/rojo, el mismo tono que "Ciberseguridad" (`#F2542D`).

Cada uno es una variante oscuro→color→claro del mismo hex de la categoría, manteniendo el estilo diagonal ya usado (no es un rediseño, solo variar el color de fondo). **Verificado en el navegador:** los 4 bloques se ven claramente distintos, 0 errores de consola.

## Ajuste posterior — descripción completa en el popup de evento próximo (sin cambios de código)

Se confirmó que `EventDetailModal` (popup de "Ver detalles" de un evento próximo, en `src/components/Events.jsx`) ya muestra el campo completo: `event.resena` se arma en `eventService.mapEventRow()` como `row.description || row.summary || ''` — prioriza `description` (el campo largo) sobre `summary`. El párrafo que lo renderiza no tiene `WebkitLineClamp`, ni `maxHeight`+`overflow:hidden`, ni ningún otro recorte — el único límite es que `ModalShell` hace scroll (`overflow-y:auto`) si el modal completo crece mucho, lo cual no trunca contenido, solo agrega una barra de scroll. **No se modificó código para este bloque**, tal como se pidió — el contenido más largo lo agrega Braulio vía datos.

## Ajuste posterior — "Ver eventos realizados" con lista y detalle

El badge que mostraba "`{N}` eventos" en el panel "Eventos Realizados" (`src/components/Events.jsx`) se reemplazó por un botón **"Ver eventos realizados"**, mismo estilo que el botón "Ver calendario" del panel de próximos eventos. Al hacer clic, abre `PastEventsListModal` (nuevo, mismo patrón visual que `CalendarModal`: header oscuro + filas blancas) con **todos** los eventos `status='completed'` (no solo los 2 visibles en la vista paginada, que se mantiene sin cambios). Al elegir uno de la lista, se cierra y abre el `VistaModal` **ya existente** (no se creó un segundo componente de detalle) — título, fecha, hora, lugar y reseña (`description`/`summary`), sin galería (fuera de alcance, ya documentado arriba).

**Verificado en el navegador:** como la base real todavía no tiene ningún evento `completed` (la migración con el evento de ejemplo, `20260730100000_demo_content_agosto.sql`, sigue pendiente de que Braulio la ejecute — ver Pendiente), se verificó con 2 eventos mock temporales inyectados directamente en `eventService.getPastEvents()` (revertido antes de terminar, no llegó a versionarse): el botón abre la lista con ambos eventos, título/fecha/lugar visibles; al hacer clic en uno, la lista se cierra y se abre el detalle correcto (fecha, hora, lugar y la reseña completa, sin recorte); 0 errores de consola en todo el flujo.

## Ajuste posterior — header del portal y densidad de la grilla de infografías

Tres cambios visuales pedidos por Braulio antes de una presentación, revisados primero en local con `npm run dev` (no se pusheó de inmediato, a pedido explícito):

1. **"Mis Tickets" → "Crear Tickets"** en `src/components/Header.jsx` — mismo botón, mismo estilo, solo cambió el texto.
2. **Se eliminó por completo el botón "Contacta a tu KAM"** (azul) del header. Como consecuencia, `onScrollContact` (la prop que `PortalLayout.jsx` le pasaba a `Header` solo para ese botón) quedó sin ningún consumidor — se quitó de ambos archivos en vez de dejarla declarada sin uso. `scrollToSection` en sí (usado por el Sidebar, `window.scrollToSection` y `CategoryBlocks`) no se tocó.
3. **Investigación de "solo se ven 3 infografías":** no había ningún `slice`/límite en el código (`contentService.getInfographics()` no recorta nada) — se confirmó en el navegador que la consulta ya devuelve las 6 infografías publicadas, incluida "Guía rápida: cómo aprovechar al máximo un webinar TIBOX". La causa real era puramente visual: `InfoCard` (`src/components/Media.jsx`) tenía el ancho fijo en `flex:'0 0 calc((100% - 36px) / 3)'`, es decir, el carrusel estaba dimensionado a propósito para mostrar exactamente 3 tarjetas por pantalla (la 4ª ya estaba en el DOM, solo había que hacer scroll o tocar la flecha). Se cambió a `calc((100% - 54px) / 4)` para que se vean 4 a la vez. De paso, se redujo la altura de la imagen de cada tarjeta (de `aspectRatio:'1/1'`, cuadrada, a `4/3`) sin tocar el ancho, como se pidió.

**Verificado en el navegador:** header muestra "Crear Tickets" y ya no muestra el botón azul, 0 errores de consola. La grilla de infografías muestra 4 tarjetas visibles (incluida la de Webinars) con imágenes más compactas, y la flecha permite llegar a las 2 restantes; 0 errores de consola.

**Este commit se dejó en local, sin `git push`**, a la espera de que Braulio lo revise con `npm run dev` antes de la presentación.

## Ajuste posterior — reproductor real de YouTube en el popup de video

Bug crítico encontrado por Braulio antes de la demo: `VideoModal` (`src/components/Media.jsx`) todavía usaba el reproductor decorativo heredado del prototipo original — barra de progreso falsa, "06:32" fijo, y el texto "Reproducción de demostración. En el portal real, este contenido se transmite desde la videoteca de TIBOX Connect con calidad adaptativa." El botón Play no reproducía nada real.

**Ahora:** el popup arranca en estado "poster" (miniatura + botón Play, igual que antes visualmente) y, al hacer clic en Play, embebe un iframe real de YouTube (`https://www.youtube.com/embed/ID`) usando el ID extraído de `content_items.external_url` con `extractYouTubeVideoId()` (`src/lib/youtube.js`, ya existente desde la Fase 6/7/8 — reutilizado, no se duplicó la lógica). Se decidió no reproducir automáticamente al abrir el popup, para no autoreproducir con sonido justo al hacer clic en una tarjeta — el clic en Play es una acción explícita, más apropiado para una demo en vivo. Se eliminó por completo la barra de progreso falsa y el texto de "demostración".

Si `external_url` no es un link de YouTube válido, no se finge un reproductor: se muestra un botón "Ver contenido" que abre `external_url` en una pestaña nueva; si tampoco hay `external_url`, se muestra "Sin video disponible" — en ningún caso rompe el popup.

**Verificado en el navegador:** se abrió el video "Copilot Studio: crea tu propio agente de IA" (el que usa el link de YouTube corregido en una fase anterior) — el popup abre en estado poster sin texto de "demostración"; al hacer clic en Play, se embebe y reproduce de verdad el video real de YouTube (controles, marca y subtítulos de YouTube visibles, tiempo avanzando); la X cierra correctamente en cualquier estado. 0 errores de consola en todo el flujo.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo confirme antes de publicarlo.

## Ajuste posterior — reordenar manualmente y ordenar por columna en el panel admin

Mejora pedida por Braulio para las 4 secciones del panel de contenidos (`src/admin/AdminWidgets.jsx`, componente `ContentTable`): reordenar publicaciones manualmente y ordenar la vista de la tabla haciendo clic en los encabezados de columna.

**Parte 1 — Reordenar manualmente (Videos, Infografías y Eventos; Noticias excluida).** Se agregó una columna de flechas ↑/↓ a la izquierda de la tabla, visible solo en `videos`/`infographics`/`events` — nunca en `news`, ya que esa sección se ordena automáticamente por `published_at` descendente (ver ajuste anterior en este mismo documento) y unas flechas ahí serían contradictorias con ese comportamiento. Cada clic renumera secuencialmente el `sort_order` de todo el subconjunto reordenable según la nueva posición visual (no solo intercambia los dos valores) y persiste el cambio de inmediato contra Supabase (`updateContentItem`/`updateEvent`), protegido por las políticas RLS ya existentes (solo admins pueden escribir). `content_items` ya tenía `sort_order` desde la Fase 4; `events` no lo tenía — se agregó en la migración nueva `supabase/migrations/20260731100000_events_sort_order.sql` (columna `integer not null default 0` + índice), pendiente de que Braulio la ejecute en el SQL Editor de Supabase.

Los servicios públicos (`contentService.js` para video/infographic, `eventService.js` para `getUpcomingEvents()`) ahora ordenan por `sort_order` ascendente (con la fecha como desempate), así el orden del panel admin coincide exactamente con lo que ve el portal. `getPastEvents()` (eventos realizados) **no se tocó** — Braulio no pidió reordenar manualmente los eventos ya realizados, así que siguen con su propio orden por fecha descendente; se dejó como decisión explícita, documentada aquí.

**Parte 2 — Ordenar por columna (las 4 secciones).** Los encabezados Título, Categoría/Modalidad, Estado, Destacado (no aplica a eventos) y Fecha son ahora clickeables: alternan orden ascendente/descendente sobre una copia en memoria de las filas (`displayRows`), sin tocar `sort_order` ni las fechas reales — es solo una ayuda de vista para el administrador. La columna Fecha ordena por el timestamp real (`dateRaw`, agregado a `mapAdminRow()` en ambos servicios admin), no por el string ya formateado que se muestra en pantalla, para que el orden cronológico sea correcto.

**Conflicto de diseño resuelto:** mientras haya un orden de columna activo, las flechas de reordenar se deshabilitan (visualmente atenuadas y sin efecto al hacer clic) — el orden visual ya no refleja `sort_order`, así que reordenar en ese estado no tendría sentido. Aparece un botón "Volver al orden de publicación" junto al contador de elementos que limpia el orden de columna y restaura la vista por `sort_order`/fecha real, reactivando las flechas.

**Verificado en el navegador** (ruta temporal `/dev-test-upload`, sin sesión de admin real — revertida por completo antes de terminar, `git status`/`git diff` confirmaron cero cambios residuales): en Videos, las flechas reordenan las filas correctamente en memoria y disparan una escritura real contra Supabase (confirmado vía `performance.getEntriesByType('resource')`, que mostró la llamada a `content_items`); como no había sesión de admin autenticada en esta ruta de prueba, Supabase respondió `permission denied for table content_items` — el comportamiento esperado de RLS protegiendo la escritura en el servidor, y el error se mostró correctamente en el banner de la tabla sin romper la UI. Se ordenó la columna Categoría (ascendente/descendente, indicador de flecha correcto) y las filas de flechas de reordenar quedaron deshabilitadas mientras el orden de columna estaba activo; "Volver al orden de publicación" restauró el orden original y reactivó las flechas. En Noticias se confirmó que no aparece ninguna columna de flechas. La sección Eventos no pudo probarse end-to-end todavía: la migración `20260731100000_events_sort_order.sql` (columna `sort_order` en `events`) sigue pendiente de que Braulio la ejecute en Supabase — mientras tanto, `listEvents()`/`getUpcomingEvents()` fallan con "no pudimos cargar las publicaciones" porque la columna no existe aún en la base real (comportamiento esperado, no un bug del código).

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise, como en los ajustes anteriores.

## Ajuste posterior — arrastrar y soltar + confirmación explícita al reordenar

Mejora sobre el reordenamiento manual del ajuste anterior, pedida por Braulio para Videos y Webinars, Infografías y Eventos (Noticias sigue excluida, sin cambios).

**Arrastrar y soltar.** Cada fila reordenable de `ContentTable` ahora es `draggable`, con un ícono de agarre (`grip-vertical`) junto a las flechas ↑/↓ — se mantuvieron ambas formas de reordenar (arrastre y flechas) en vez de reemplazar una por la otra, porque las flechas ya eran accesibles por teclado (son botones enfocables, operables con Enter/Espacio) y quitarlas habría sido un paso atrás en accesibilidad sin necesidad. El arrastre usa eventos HTML5 nativos (`dragstart`/`dragenter`/`dragover`/`drop`) sin ninguna librería nueva: al arrastrar una fila sobre otra, se reordena en vivo dentro del arreglo en memoria (`moveToPosition`, mueve el elemento arrastrado a la posición de la fila sobre la que se suelta). Tanto el arrastre como las flechas ahora **solo actualizan la vista local** — dejaron de escribir en Supabase en cada movimiento.

**Confirmación explícita ("Guardar cambios").** Se agregó un estado `baselineIds` (el último orden efectivamente guardado) que se compara contra el orden actual de la vista para saber si hay cambios pendientes (`orderDirty`). Mientras haya cambios sin guardar, aparecen dos botones junto al contador de elementos: **"Guardar cambios"** (persiste de una sola vez, con `Promise.all`, el `sort_order` de todo el subconjunto reordenable según su posición actual, y solo entonces actualiza `baselineIds`) y **"Descartar cambios"** (restaura la vista al último dato recibido de Supabase, sin tocar la base). Si el administrador navega a otra sección o recarga la página sin guardar, el estado de React se pierde y el cambio pendiente desaparece — es el comportamiento estándar de "cambios sin guardar" pedido, no se implementó ningún mecanismo adicional (como `beforeunload`) porque no fue solicitado y habría sido una complejidad innecesaria para un panel interno.

**Misma regla que antes para el orden por columna:** tanto el arrastre como las flechas y los botones de guardar/descartar solo están disponibles mientras la tabla está en su vista de "orden de publicación". Si hay un orden de columna activo (Parte 2 del ajuste anterior), las filas dejan de ser `draggable`, el ícono de agarre y las flechas no se muestran, y los botones de guardar/descartar quedan ocultos — la única acción disponible en ese estado es "Volver al orden de publicación".

**Verificado en el navegador** (ruta temporal `/dev-test-upload`, sin sesión de admin real — revertida por completo antes de terminar): en Videos, se arrastró la primera fila varias posiciones hacia abajo y el cambio se reflejó de inmediato en la vista, sin ninguna llamada a Supabase todavía (confirmado por la ausencia de errores hasta ese punto) y con los botones "Guardar cambios"/"Descartar cambios" apareciendo correctamente; "Descartar cambios" restauró el orden original tal cual estaba antes del arrastre. Se repitió con una flecha "Bajar" (mismo resultado: solo vista, botones aparecen) y esta vez se hizo clic en "Guardar cambios" — disparó una escritura real contra `content_items`, rechazada con `permission denied for table content_items` por no haber sesión de admin en esta ruta de prueba (RLS protegiendo la escritura en el servidor, tal como en pruebas anteriores), con el error mostrado en el banner sin romper la UI. Se confirmó también que, al activar un orden por columna (Categoría), el ícono de agarre y las flechas desaparecen por completo de cada fila (no solo se deshabilitan visualmente) y los botones de guardar no se muestran. En Noticias se confirmó que sigue sin ninguna columna de reordenamiento. La sección Eventos sigue sin poder probarse end-to-end contra la base real por la misma razón del ajuste anterior: la migración `20260731100000_events_sort_order.sql` todavía no ha sido ejecutada por Braulio.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — botón Guardar siempre visible, solo arrastre, paginación y rediseño de Contacto/Opinión

Cuatro ajustes de UX pedidos por Braulio en el mismo mensaje, todos revisados primero en local.

**1. "Guardar cambios" siempre visible.** Antes el botón (y "Descartar cambios") solo aparecían cuando había cambios pendientes, y ambos se ocultaban por completo mientras había un orden de columna activo. Ahora, en Videos, Infografías y Eventos, "Guardar cambios" **siempre se renderiza** — deshabilitado (atenuado, `cursor:default`) cuando no hay cambios pendientes (`!orderDirty`), habilitado cuando sí los hay. A propósito, se decidió que su estado habilitado/deshabilitado depende únicamente de `orderDirty`, **no** de si hay un orden de columna activo: si el admin arrastró filas y luego activó un orden de columna para revisar algo, el cambio pendiente de antes sigue pudiendo guardarse sin tener que volver primero al orden de publicación. "Descartar cambios" se mantuvo con visibilidad condicional (solo aparece si `orderDirty`) porque no fue parte del pedido explícito y no tiene sentido mostrarlo sin nada que descartar.

**2. Solo arrastrar y soltar (se quitaron las flechas ↑/↓).** Braulio consideró que tener flechas y arrastre al mismo tiempo era redundante y confuso. Se eliminaron los botones "Subir"/"Bajar" (y la función `moveRow` que los respaldaba) — el único método de reordenar ahora es mantener presionado el ícono de seis puntos (`grip-vertical`) y arrastrar. La lógica de reordenamiento en memoria (`moveToPosition`, `handleDragStart`/`handleDragEnter`) no cambió, solo el punto de entrada.

**3. Paginación de 10 elementos por página (las 4 secciones).** Se agregó un componente `Pagination` (números de página + flechas anterior/siguiente, estilo WordPress) debajo de cada tabla de `ContentTable` — Videos, Infografías, Noticias y Eventos. Con los volúmenes de contenido actuales (decenas de filas, no miles) no se justificó truncar la lista de páginas con "…"; se listan todas. La página vuelve a 1 automáticamente cuando cambian los datos (nueva carga), la sección, o se activa/desactiva un orden de columna.

*Conflicto arrastre + paginación, y cómo se resolvió:* el arrastre solo puede reordenar dentro de la página visible. No hizo falta ninguna validación explícita para lograr esto — es una consecuencia natural de que las filas de otras páginas no están en el DOM mientras no son la página activa, así que nunca puede dispararse un `dragenter` sobre una fila de otra página. Si el administrador necesita mover un elemento a una página distante, debe hacerlo en varios pasos (arrastrar hacia el borde de la página actual, guardar, pasar a la página siguiente, continuar) — se consideró suficiente para el volumen de contenido de hoy; una solución más sofisticada (arrastre entre páginas con auto-scroll o "cargar más" al arrastrar al borde) no se justificó para este panel interno.

**4 y 5. Rediseño de Contacto + Opinión integrada + estrellas en el popup.** El bloque de Contacto (`ContactFormSection` en `src/components/Services.jsx`) tenía dos columnas: izquierda con logo + datos de oficinas Chile/Perú, derecha con el formulario. Ahora: **columna izquierda** — título "¿Tienes algún proyecto en mente?", el texto de invitación, y debajo el formulario de contacto completo (antes vivía a la derecha); se eliminaron por completo las oficinas de Chile y Perú, y con ellas `MapModal` y la llamada a `serviceCatalogService.getOffices()` en este componente (sin otro consumidor, se quitaron limpiamente). **Columna derecha** — el bloque completo de "Tu Opinión nos ayuda a mejorar" (`OpinionPanel.jsx`), que dejó de ser una sección aparte de la página (`HomePage.jsx` ya no la renderiza por separado) y ahora se importa y monta directamente como la columna derecha de Contacto. El ancla de navegación `#section-opinion` (usada por el bloque "Tu Opinión" bajo el hero) se movió del wrapper de la sección completa al `<div>` de esta columna específica, así el scroll sigue funcionando pero ahora apunta directo a la columna correcta. Como ambas columnas quedan sobre el mismo fondo oscuro (`grad-corporate`), las etiquetas y textos de ayuda del formulario de contacto (antes en `var(--gray-600)` sobre fondo blanco) se ajustaron a colores claros (`rgba(255,255,255,0.75)` para etiquetas, `var(--brand-cyan)` para el link de privacidad) para mantener contraste.

Las estrellas de calificación, que antes se mostraban en el bloque principal de Opinión (junto al botón "Enviar mi opinión", visibles sin necesidad de abrir nada), se movieron dentro del popup que abre ese botón, como el primer campo del formulario (antes del nombre/email/opinión). El bloque principal de Opinión ahora solo muestra: eyebrow "Feedback", título, texto descriptivo y el botón — sin ninguna calificación visible de entrada.

**Verificado en el navegador:**
- Portal (`/`, sin necesidad de sesión): el bloque de Contacto muestra la columna izquierda con título+texto+formulario completo (sin oficinas) y la columna derecha con "Tu Opinión" (título, texto, botón, sin estrellas visibles); no existe ningún bloque "Tu Opinión" aparte más abajo en la página. Al hacer clic en "Enviar mi opinión" se abre el popup con las estrellas como primer campo, funcionando correctamente (clic en una estrella actualiza la calificación y el mensaje de ayuda).
- Admin (ruta temporal `/dev-test-upload`, revertida por completo antes de terminar — `git status`/`git diff` confirmaron cero cambios residuales): "Guardar cambios" aparece siempre (atenuado sin cambios pendientes) en Videos e Infografías; ya no hay flechas ↑/↓, solo el ícono de agarre. El arrastre se probó disparando eventos HTML5 nativos (`dragstart`/`dragenter`/`dragover`/`drop`) con una pausa real entre `dragstart` y el resto — la simulación de arrastre por mouse del entorno de pruebas no dispara los eventos nativos de HTML5 Drag and Drop sin ese espaciado, algo esperado del propio entorno de automatización y no del código; con la pausa, el reordenamiento funcionó correctamente y activó "Guardar cambios", que disparó una escritura real contra Supabase (rechazada con `permission denied for table content_items` por no haber sesión de admin en esta ruta de prueba — RLS protegiendo la escritura en el servidor, igual que en pruebas anteriores). "Descartar cambios" restauró el orden original correctamente. Para verificar la paginación (ninguna sección real supera hoy los 10 elementos) se bajó temporalmente `PAGE_SIZE` a 3 en el código, se confirmó que los números de página y anterior/siguiente funcionan y que cada página muestra solo las filas reordenables de esa página, y luego se revirtió `PAGE_SIZE` a 10 antes de terminar.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — se elimina el sidebar del portal, bloques de categoría simplificados, Servicios oculto, ajustes de Contacto y transición fluida al filtrar

Cinco cambios de diseño/UX pedidos por Braulio para el portal público (no tocan el panel admin), todos revisados primero en local.

**1. Se eliminó el Sidebar del portal** (`src/components/Sidebar.jsx`, borrado — el `AdminSidebar` del panel admin no se tocó). `PortalLayout.jsx` ya no lo renderiza; el logo de TIBOX y la navegación por secciones se movieron al `Header.jsx`: nuevos botones "Inicio", "Videos y Webinars", "Infografías", "Noticias" y "Eventos" que usan el mismo mecanismo `window.scrollToSection(...)` que ya usaban los bloques de categoría bajo el hero. También se agregó "Soporte" al header (antes un ítem del sidebar que abría el mismo modal — `PortalLayout.jsx` le pasa `onSoporte` a `Header`). **Decisión explícita sobre "Mi Perfil" y "Configuración":** no se migraron al header porque en el sidebar original no tenían ningún destino real — no navegaban a ninguna ruta ni sección, solo marcaban un estado "activo" puramente decorativo sin efecto visible. Recrearlos en el header habría significado fabricar una navegación falsa; se consideran eliminados a propósito. Si Braulio los necesita, hay que definir primero a dónde deberían llevar (¿una página de perfil público? ¿no existe todavía en el modelo de datos actual, que solo tiene perfiles de administrador — ver DATA-MODEL.md?). El breadcrumb "Portal > Tibox Connect" se eliminó del header. Los íconos de notificaciones (campana) y ayuda (`?`) se ocultaron con `display:'none'` sin borrar su código (ni el estado `showNotif` ni el panel de notificaciones), por si se reactivan más adelante. De paso, se limpiaron del `index.css` las clases que solo usaba el sidebar eliminado (`.portal-sidebar`, `.nav-item`, `.nav-section-label` y sus variantes) — no las usaba ningún otro componente.

**2. Bloques de categoría bajo el hero simplificados** (`CategoryBlocks` en `Hero.jsx`): se eliminó el bloque blanco inferior (título + descripción + dato estadístico tipo "8 próximos") — ahora todo vive dentro del mismo recuadro de color: ícono y título en una fila, descripción breve debajo. El dato estadístico (`c.count`) ya no se muestra en ningún lado de este componente.

**3. Bloque de Servicios oculto** (`HomePage.jsx`): se agregó una constante `SHOW_SERVICES = false` que condiciona el render de `<ServicesV2/>` — el componente en sí (`Services.jsx`) no se tocó, solo dejó de montarse en la página. Volver a mostrarlo es cambiar esa constante a `true`.

**4. Ajustes al formulario de contacto** (`ContactFormSection` en `Services.jsx`): la frase "proyecto en mente" del título ahora usa el mismo patrón de degradado azul (`var(--grad-title)` + `WebkitBackgroundClip:'text'`) que ya usan otros títulos destacados del sitio (Hero, ExploraPanel, InfographicsPanel, NoticiasPanel, OpinionPanel) — no se inventó un degradado nuevo. Se eliminó por completo el campo "Áreas de interés" (el `<select>` y el estado `form.servicio`); `formService.submitContactForm` es hoy un simulador que no depende de campos específicos, así que quitar uno no requirió ningún otro cambio.

**5. Transición fluida al filtrar por categoría.** Se agregó un hook nuevo y reutilizable, `src/hooks/useFadeContent.js`, usado de forma consistente en los 3 bloques que sí tienen filtro de categoría: **Videoteca** (`ExploraPanel`), **Infografías** (`InfographicsPanel`, ambos en `Media.jsx`) y **Noticias** (`NoticiasPanel`, en `Events.jsx`). El problema: `useAsyncData` vuelve a `status:'loading'` (con `data:null`) en cada cambio de categoría, lo que antes desmontaba la grilla entera y mostraba el spinner de carga en cada clic de filtro — un salto visual brusco. `useFadeContent` sigue mostrando el último contenido cargado (con opacidad reducida a `0.35` y una transición CSS de `220ms`) mientras la categoría nueva carga, y hace un crossfade suave cuando llegan los datos; el spinner real (`LoadingState`) solo se usa en la carga inicial del bloque, cuando todavía no hay ningún dato previo que mantener en pantalla. **Aclaración importante:** el bloque "Próximos Eventos" (`EventosPanel`, también en `Events.jsx`) **no tiene filtro de categoría** — solo pagina entre eventos ya cargados una vez (con su propia animación de deslizamiento, `tbxSlideIn`, que no cambió), así que no había ningún salto por `useAsyncData` que corregir ahí; se deja documentado por si esta aclaración no coincidía con lo que Braulio tenía en mente al mencionar "eventos" entre los 4 bloques.

**Verificado en el navegador:**
- Sin sidebar, la página usa el ancho completo; el logo y los 5 links de navegación (+ Soporte) aparecen en el header, sin breadcrumb ni íconos de campana/ayuda visibles. Los links de navegación fueron verificados disparando el clic directamente sobre el botón del DOM (`button.click()`) — confirmado que invocan `window.scrollToSection` y desplazan correctamente a cada sección (`section-videos`, `section-infographics`, `section-news`, `section-events`); el clic simulado por coordenadas del entorno de pruebas no siempre acertaba sobre el botón exacto debido al escalado de la captura de pantalla, pero eso es una limitación de la herramienta de automatización, no del código — se confirmó con el método directo.
- Los 4 bloques de categoría bajo el hero muestran ícono + título + descripción dentro del recuadro de color, sin bloque blanco ni dato estadístico.
- `document.getElementById('section-services')` devuelve `null` — el bloque de Servicios no se monta.
- El título de Contacto renderiza el degradado (confirmado vía `getComputedStyle`: `background-image: linear-gradient(...)`, `-webkit-background-clip: text`) y ya no existe ningún campo "Áreas de interés" en el formulario.
- Se cambió la categoría en Videoteca, Infografías y Noticias — en los tres, la grilla/lista se actualiza sin ningún parpadeo de spinner (el contenido nuevo reemplaza al anterior con un fade), confirmado por inspección del código y del comportamiento (el conteo de resultados cambia correctamente por categoría, ej. "Ciberseguridad" en Videoteca pasó de 8 a 2 videos).

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — bloque de Contacto + Feedback: proporción 60/40, tarjetas redondeadas y menos aire

Ajustes de detalle sobre el bloque de Contacto/Feedback del ajuste anterior, pedidos por Braulio.

**Sobre las oficinas de Chile/Perú:** Braulio reportó que seguían apareciendo, ahora en la columna de Feedback. Se revisó el código y el navegador (con recarga forzada) y no se encontró ningún rastro — `OpinionPanel.jsx` nunca tuvo datos de oficinas, y `Services.jsx` ya no las renderiza desde el ajuste anterior (`document.body.innerText.includes('Santiago'|'Curicó'|'Lima')` da `false` en la app corriendo). Lo más probable es que Braulio estuviera viendo una versión en caché del `npm run dev` de la sesión anterior sin recargar. Se deja documentado por transparencia, sin cambios de código para este punto — si vuelve a aparecer después de un refresh real, avisar para investigar a fondo.

**Proporción 60/40 y tarjetas independientes.** Antes, Contacto y Feedback eran una sola tarjeta (`.section-card`, radio 16px) partida al medio con `1fr 1fr` y `overflow:hidden` — por eso ambas columnas se veían como un único rectángulo sin esquinas redondeadas propias. Ahora cada columna es su propia tarjeta independiente con el mismo radio de 16px que usa `.section-card` en el resto del sitio (no se inventó un valor nuevo), con un espacio real entre ambas (20px, el mismo que ya se usaba entre `EventosPanel`/`EventosRealizadosPanel`). La proporción 60/40 y el apilado en móvil viven en una clase CSS nueva, `.contact-grid` (`index.css`): `grid-template-columns: 3fr 2fr` en escritorio, `1fr` bajo `@media (max-width: 760px)`. **Nota técnica:** el proyecto no tenía ningún `@media` todavía — todo el layout era de ancho fijo de escritorio, así que el apilado en móvil que Braulio daba por hecho ("como ya debe estar funcionando") no existía realmente; esta es la primera regla responsive real del proyecto. Se implementó tal como se pidió, no se dejó pendiente.

**Menos aire en el bloque de Contacto**, sin tocar la grilla de campos (Nombre+Correo, Empresa+Teléfono, Mensaje ancho completo, sin reordenar): padding de la tarjeta de 40px a 32px/36px, separación entre el bloque de título/texto y el formulario de 24px a 16px, separación entre título y párrafo descriptivo reducida, `gap` del formulario de 14px a 10px, el textarea de Mensaje de `rows={3}` a `rows={2}` (con `minHeight:56` para que no se vea recortado) manteniendo `resize:'vertical'` para que el usuario lo agrande si necesita escribir más, y el botón "Enviar mensaje" con menos padding vertical. El resultado es más compacto sin apretar el texto ni los campos.

**Feedback equilibrado.** La columna de Feedback (`OpinionPanel.jsx`) redujo su radio de 20px a 16px (para igualar el nuevo estándar) y su padding/espaciados internos en la misma proporción que Contacto, así ambas columnas se ven consistentes. Como además es un hijo de una fila de grid (`align-items: stretch` por defecto), su alto siempre coincide con el de Contacto — al compactar Contacto, Feedback se compacta automáticamente con él, sin dejar espacio vacío desproporcionado.

**Verificado en el navegador:**
- Escritorio (1300px): las dos columnas miden 732.6px y 488.4px respectivamente — exactamente 60.0%/40.0% del ancho disponible (`getBoundingClientRect()` sobre `.contact-grid`). Ambas con esquinas redondeadas visibles y separadas por un espacio real, no una sola tarjeta partida. El formulario se ve notablemente más compacto (título, descripción y campos con menos aire) sin verse apretado; Feedback ya no deja un vacío desproporcionado abajo.
- Móvil (390px, iPhone-width): las columnas se apilan verticalmente (Contacto arriba, Feedback abajo), confirmado por captura de pantalla — la regla `@media (max-width: 760px)` de `.contact-grid` funciona. (Nota aparte, fuera de alcance de este ajuste: el header con la navegación agregada en el ajuste anterior no tiene su propio comportamiento responsive todavía — a este ancho los links se cortan sin menú hamburguesa. No se tocó porque no fue parte de este pedido, pero queda para un ajuste futuro si Braulio lo prioriza.)
- No se encontró texto de oficinas ("Santiago", "Curicó", "Lima") en ningún punto de la página tras una recarga forzada.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — Contacto y Feedback en un solo contenedor (patrón de "Tendencias de la industria")

Braulio pidió unificar Contacto y Feedback en un único bloque, en vez de las dos tarjetas independientes del ajuste anterior — el mismo patrón visual que ya usa `NoticiasPanel` ("Tendencias de la industria"): un contenedor con fondo compartido, dividido internamente por una línea sutil, no dos tarjetas con bordes/sombras propios.

**Contenedor único.** `ContactFormSection` (`Services.jsx`) ahora renderiza un solo `<div>` con el fondo `var(--grad-corporate)`, radio 16px y sombra — antes cada columna tenía su propio fondo/radio/sombra. El `CosmicBg` y el overlay degradado, que antes se duplicaban (uno en Contacto, otro en `OpinionPanel`), ahora son compartidos por todo el bloque. `OpinionPanel.jsx` perdió su propia tarjeta (fondo, radio, `CosmicBg`) — ahora solo aporta contenido y su propio padding (`32px 36px`, igual al de Contacto, para que ambas columnas se vean consistentes); el contenedor padre es quien pone el fondo. La línea divisoria interna vive en una clase CSS nueva, `.contact-col-form` (`index.css`): borde derecho de `rgba(255,255,255,0.14)` en escritorio, borde inferior al apilarse en móvil — mismo mecanismo que el `borderRight` que ya separaba la lista de noticias de la destacada en `NoticiasPanel`.

**Logo eliminado.** Se quitó el `<img>` del logo TIBOX que aparecía arriba de "Cuéntanos tu idea" — ya está en el encabezado del sitio (ver ajuste posterior anterior, cuando se movió el logo del sidebar eliminado al `Header`), así que quedaba duplicado.

**Proporción 60/40 mantenida.** La columna de Contacto (formulario, con más campos) sigue ocupando el 60% del ancho y Feedback el 40%, vía `.contact-grid` (`grid-template-columns: 3fr 2fr`) — mismo mecanismo de proporción asimétrica que ya usa `NoticiasPanel` entre sus columnas (ahí es 1fr/1fr porque el contenido es más parecido en tamaño; acá se mantuvo 3fr/2fr porque Contacto tiene notoriamente más campos).

**Compactación conservada.** Los ajustes de aire del turno anterior (textarea de Mensaje en `rows={2}` con `minHeight:56`, gaps reducidos entre título/texto/campos, checkbox y botón "Enviar mensaje" acercados al resto del formulario) se mantuvieron intactos en esta reestructuración — no hubo que tocarlos de nuevo, solo se preservaron al mover el JSX al nuevo contenedor.

**Verificado en el navegador:**
- Escritorio (1300px): un solo bloque con fondo azul compartido y una línea vertical sutil entre las columnas (`getComputedStyle` confirma `border-right: 1px solid rgba(255, 255, 255, 0.14)` en `.contact-col-form`); proporción exacta 744.6px/496.4px = 60.0%/40.0% (`getBoundingClientRect()`); no hay ningún `<img alt="TIBOX">` dentro de `.contact-grid`; `document.body.innerText` no contiene "Santiago", "Curicó" ni "Lima" en ningún punto de la página.
- Móvil (390px): las columnas se apilan verticalmente (Contacto arriba, Feedback abajo) sobre el mismo fondo compartido, con una línea horizontal sutil entre ambas (la regla `@media (max-width: 760px)` de `.contact-col-form` cambia el borde de derecho a inferior) — confirmado por captura de pantalla.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — Contacto/Feedback a 50/50, Feedback centrado verticalmente

Ajuste de detalle sobre el bloque combinado del ajuste anterior.

**Proporción 50/50.** `.contact-grid` pasó de `3fr 2fr` (60/40) a `1fr 1fr` — ambas columnas ahora ocupan el mismo ancho, confirmado en el navegador vía `getBoundingClientRect()` (ratio exacto `0.5`).

**Feedback centrado verticalmente.** Al quedar Feedback con el mismo ancho que el formulario (que tiene bastante más contenido), su columna se estira a la misma altura por ser fila de grid, dejando aire de sobra. `OpinionPanel.jsx` ya usaba `height:'100%'` + `justifyContent:'center'` desde el ajuste en que se integró como columna — no hizo falta ningún cambio de código para este punto, ese centrado vertical ya estaba en su lugar y simplemente se volvió más visible con la columna más ancha. Verificado con `getBoundingClientRect()`: el contenido de Feedback queda a 172.9px del borde superior de la fila y 172.9px del inferior — perfectamente centrado, no pegado arriba.

**Fondo cósmico:** ya estaba compartido por ambas columnas desde el ajuste anterior (`<CosmicBg variant={0}/>` vive en el contenedor único de `ContactFormSection`, no en cada columna por separado), así que no hizo falta agregar nada — el fondo estrellado ya se ve detrás de Feedback como textura visual sin agregar texto ni botones nuevos.

**Sin tercer CTA ni oficinas.** Se confirmó en el navegador que el bloque solo tiene dos botones ("Enviar mensaje" y "Enviar mi opinión") y que no hay texto de oficinas ("Santiago"/"Curicó"/"Lima") en ningún punto de la página.

**Verificado en el navegador:**
- Escritorio (1300px): columnas de igual ancho (ratio `0.5`); contenido de Feedback centrado con simetría exacta arriba/abajo; fondo cósmico visible detrás de ambas columnas; exactamente 2 botones en todo el bloque.
- Móvil (390px): las columnas se apilan verticalmente sobre el mismo fondo compartido, sin cambios respecto al ajuste anterior — confirmado por captura de pantalla.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — header azul, carrusel horizontal en Noticias, degradado completo en "Tu Opinión"

Tres ajustes visuales independientes pedidos por Braulio.

**1. Header azul.** `.portal-header` (`index.css`) pasó de `background: var(--white)` a `background: var(--grad-corporate)` — la misma variable que ya usan Infografías y Contacto, sin inventar un tono nuevo. El texto de los links de navegación (Inicio/Videos y Webinars/Infografías/Noticias/Eventos/Soporte) pasó de `color: var(--gray-600)` a `color: white` y de `fontWeight: 600` a `fontWeight: 'var(--fw-regular)'` (400) — token ya existente en `tokens/typography.css` (cargado globalmente vía `index.html`, junto con `--fw-light: 300` disponible si Braulio prefiere un peso todavía más liviano). De paso se ajustaron para contraste sobre fondo oscuro: los divisores verticales (de `var(--gray-200)` a `rgba(255,255,255,0.15)`), el borde del avatar de admin y el texto "Cerrar sesión" (de `var(--gray-500)` a `rgba(255,255,255,0.7)`). El botón ADM (fondo blanco) y "Crear Tickets" (naranja) no necesitaron cambios — ya contrastan bien sobre cualquier fondo.

**2. Carrusel horizontal en Noticias.** La lista de noticias de `NoticiasPanel` (columna izquierda de "Tendencias de la industria") era una lista vertical con su propio scroll y un degradado de desvanecimiento al fondo; ahora es un carrusel horizontal con el mismo patrón que Videoteca/Infografías: tarjetas de ancho fijo (`NewsListCard`, 230px, con una barra superior del color de la categoría) en una fila con `overflowX:'auto'` + `scroll-snap` + flechas anterior/siguiente (`newsNavBtnStyle`). Al convertir la lista a un carrusel horizontal dentro de una celda de grid (`1fr 1fr` junto a la publicación destacada), apareció un bug clásico de CSS grid/flexbox: sin `minWidth:0` en la celda y en el contenedor flex intermedio, el ancho intrínseco de todas las tarjetas alineadas empujaba la columna más allá de su `1fr`, rompiendo la proporción 50/50 con la destacada (medido en el navegador: `2049px` vs `186px` en vez de mitad y mitad). Se corrigió agregando `minWidth:0` en la celda de grid y en el contenedor flex del carrusel — confirmado que la proporción volvió a `619.5px`/`619.5px` (50/50 exacto).

**3. Degradado completo en "Tu Opinión".** En `OpinionPanel.jsx`, el `<span>` con el degradado (`var(--grad-title)`) envolvía solo la palabra "Opinión"; ahora envuelve "Tu Opinión" completo.

**Verificado en el navegador:**
- Escritorio (1300px): `getComputedStyle` sobre `.portal-header` confirma `background-image: linear-gradient(150deg, rgb(0, 21, 68)...)` (el valor real de `--grad-corporate`); los links de navegación miden `color: rgb(255, 255, 255)` y `font-weight: 400`. La columna de noticias muestra tarjetas en fila con flechas; se probó tanto haciendo scroll directo del contenedor (confirma el `scroll-snap-align` alineando cada tarjeta) como disparando el clic de los botones de flecha — el `scrollBy(..., {behavior:'smooth'})` es el mismo patrón que ya usan Videoteca e Infografías desde antes de este ajuste (no se tocó esa lógica), y el entorno de automatización de este chat no anima bien los scrolls `smooth` (mismo comportamiento ya documentado con el drag-and-drop del panel admin, ver ajuste anterior) — la asignación directa de `scrollLeft` sí confirma que el snap y el desplazamiento funcionan correctamente. Después del fix de `minWidth:0`, la proporción 50/50 entre la lista de noticias y la publicación destacada quedó exacta. El `<span>` de "Tu Opinión" en el popup de Feedback ahora cubre `"Tu Opinión"` completo (confirmado con `textContent`). No se encontró texto de oficinas ("Santiago"/"Curicó"/"Lima") en ningún punto de la página.
- Móvil (390px): el header oscuro se mantiene; el carrusel de noticias es deslizable con las flechas visibles. **Nota aparte, fuera de alcance de este ajuste** (ya señalada en un ajuste anterior): la cuadrícula de "Tendencias de la industria" (lista + destacada) no tiene su propio `@media` para apilarse en móvil — a este ancho ambas columnas quedan comprimidas una junto a la otra. No se tocó porque no fue parte de este pedido, pero queda anotado para un ajuste de responsive más amplio si Braulio lo prioriza (junto con el header, que tiene la misma limitación).

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — revertir carrusel de Noticias a lista vertical, subir peso del menú del header

Dos correcciones sobre el ajuste anterior, pedidas por Braulio.

**1. Noticias vuelve a lista vertical.** El carrusel horizontal con flechas que se agregó en el ajuste anterior no era lo pedido — se revirtió `NoticiasPanel` a su formato original: una noticia debajo de otra, con scroll vertical propio dentro de la columna (`maxHeight:450, overflowY:'auto'`, con el degradado de desvanecimiento al fondo) cuando el contenido no cabe. Se eliminaron por completo `NewsListCard`, `newsNavBtnStyle`, `trackRef` y la función `scroll()` que se habían agregado para el carrusel — ya no queda código muerto de ese intento.

**2. Peso del texto del menú.** `var(--fw-regular)` (400) se leía demasiado delgado sobre el fondo azul del header. Se subió a `var(--fw-semibold)` (600) — el mismo peso que el menú ya tenía originalmente sobre fondo blanco, y el punto intermedio real que existe en `tokens/typography.css` entre `--fw-regular` (400) y `--fw-bold` (700); no hay un token "medium" (500) en el sistema de diseño.

**Verificado en el navegador:**
- La lista de noticias hace scroll vertical correctamente (`scrollTop` se mueve de 0 a 200 con `scrollHeight:709` vs `clientHeight:450`, confirmando que hay contenido de sobra para scrollear) y no quedan botones con `aria-label="Anterior"`/`"Siguiente"` en la sección.
- El texto del menú mide `font-weight: 600` (`getComputedStyle`) y se lee con buen contraste sobre el azul del header.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — bloques de categoría: de 4 a 5, con Contacto agregado

Braulio pidió cambiar los bloques de categoría bajo el hero: de 4 a 5, con contenido, orden y colores nuevos.

**Contenido y orden** (`CATS` en `src/data/seed/homeSeed.js`, `scrollTarget` apunta a los `id="section-*"` ya existentes en el DOM):
1. Videos y Webinars → `videos` → "Charlas, demos y webinars grabados"
2. Infografías → `infographics` → "Contenido visual fácil de compartir"
3. Tendencias → `news` (la sección sigue siendo "Tendencias de la industria" / noticias) → "Lo último del sector tecnológico"
4. Eventos → `events` → "Agenda y actividades de TIBOX"
5. Contacto (nuevo) → `contact` → "Cuéntanos tu proyecto"

"Tu Opinión" deja de tener su propio bloque — ya no correspondía tener un bloque separado apuntando a Feedback ahora que esa sección vive integrada dentro de Contacto (ver ajuste anterior), así que se reemplazó por un bloque "Contacto" que apunta al bloque combinado completo.

**Colores** (`CAT_GRADIENTS` en `Hero.jsx`): los 4 tonos existentes (morado/Webinars, naranja-rojo/Ciberseguridad, azul/Cloud, verde/Transformación Digital) se reasignaron a Videos, Infografías, Tendencias y Eventos respectivamente — mismos tonos de la paleta real de categorías, sin inventar nada nuevo para esos 4. Para Contacto (el 5to bloque) se agregó un tono cian/turquesa nuevo, ligado a `var(--brand-cyan)` (el acento cian que ya se usa en eyebrows, badges y separadores en todo el sitio) — no repite ninguno de los otros 4.

**Layout responsive** (`.category-grid` en `index.css`, reemplaza el `gridTemplateColumns:'repeat(4,1fr)'` inline anterior): fila de 5 columnas iguales en escritorio ancho, `repeat(3,1fr)` (3+2) por debajo de 980px, y una sola columna apilada por debajo de 560px.

Cada bloque sigue usando el mismo mecanismo de scroll (`window.scrollToSection`) que ya usaban los 4 anteriores — no se agregó ninguna navegación nueva, solo se actualizaron los `scrollTarget` para que apunten a las 5 secciones correctas.

**Verificado en el navegador:**
- Escritorio (1300px): los 5 bloques se ven en una sola fila, en el orden pedido, cada uno con su color, ícono, título y descripción. Se confirmó que `document.getElementById('section-videos'|'section-infographics'|'section-news'|'section-events'|'section-contact')` existen los 5, y se disparó el clic de cada bloque directamente sobre el DOM: los 5 mueven `portal-content.scrollTop` a una posición distinta y creciente en el orden esperado (540 → 1046 → 1634 → 2319 → 2609), confirmando que cada uno navega a su sección correspondiente y no a otra.
- Pantalla mediana (850px): los bloques se acomodan 3+2, sin verse forzados.
- Móvil (390px): los 5 bloques se apilan verticalmente a ancho completo, en el mismo orden, con sus colores y contenido correctos.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — scroll suave con offset del header

Braulio pidió que el desplazamiento entre secciones (menú del header + bloques de categoría) fuera suave en vez de un salto instantáneo, y que la sección de destino no quedara tapada bajo el header (fijo/azul desde un ajuste anterior).

**Scroll suave.** `scrollToSection` (`PortalLayout.jsx`, la función global `window.scrollToSection` que ya consumían tanto los links del header como los 5 bloques de categoría — no hubo que tocar ninguno de esos dos componentes) pasó de mover `content.scrollTop` de golpe a usar `el.scrollIntoView({ behavior:'smooth', block:'start' })`; el caso especial "Inicio" (`id==='hero'`) usa `content.scrollTo({ top:0, behavior:'smooth' })`. También se agregó `scroll-behavior: smooth` a `.portal-content` en `index.css` como refuerzo.

**Offset del header.** Se agregó `[id^="section-"] { scroll-margin-top: 78px; }` en `index.css` (aplica a todos los `id="section-*"` existentes: hero, videos, infographics, news, events, contact) — 78px = los 62px de alto del header + margen de aire. Esto hace que `scrollIntoView` deje ese espacio libre arriba de cada sección automáticamente, sin tener que calcular el offset a mano en JS. **Aclaración:** en la estructura actual, `.portal-header` es hermano de `.portal-content` dentro de un `flex-direction:column` (no vive superpuesto/encima del contenido — cada uno ocupa su propio espacio), así que en rigor no había overlap que corregir; se agregó el `scroll-margin-top` de todas formas para que el resultado sea robusto si el layout cambia más adelante y por pedido explícito.

**Verificado en el navegador:** el mecanismo de scroll (`scrollIntoView`) y el offset (`scroll-margin-top`) se probaron con `behavior:'instant'` para evitar la animación — confirmado que la sección de destino queda exactamente 78px por debajo del borde inferior del header (`gap: 78.15625`, medido con `getBoundingClientRect()`), sin quedar tapada. La animación `behavior:'smooth'` en sí **no se pudo verificar visualmente** en el entorno de pruebas de este chat: tanto `scrollIntoView({behavior:'smooth'})` como una asignación directa de `scrollTop` con `scroll-behavior:smooth` activo se quedan sin avanzar (`scrollTop` permanece en `0` incluso después de varios segundos de espera) — un límite ya observado antes en esta sesión con otras animaciones basadas en scroll/drag (el carrusel de Noticias, el drag-and-drop del panel admin): los navegadores suelen pausar las animaciones controladas por `requestAnimationFrame` en pestañas que la automatización no mantiene realmente en primer plano/activas, y el scroll suave depende de eso. El mecanismo en sí (mismo `scrollIntoView`, mismo contenedor, mismo `scroll-margin-top`) está confirmado correcto con `behavior:'instant'`; la sensación de "suave" en un navegador real de Braulio no debería verse afectada por esta limitación del entorno de pruebas — se pide que la confirme con su propio `npm run dev`.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — Responsividad, Bloque 1: header, hero y bloques de categoría

Braulio empezó un trabajo de responsividad en varios bloques — este es el primero: encabezado, carrusel principal y bloques de categoría. **El diseño original nunca tuvo ningún punto de quiebre (`@media`) para estos tres** — se revisó cada uno por separado en vez de asumir que "ya funcionaba parecido" en pantallas chicas, y en los tres casos el layout de escritorio se rompía visiblemente por debajo de ~900px.

**1. Header — menú hamburguesa.** Patrón elegido: **menú hamburguesa clásico**, no "elementos que quepan + resto colapsado". Con 6 ítems de navegación (uno largo, "Videos y Webinars") casi ninguno cabría legible en una fila de celular, así que ocultar todos detrás de un control conocido es más predecible que una fila parcial con un indicador de "+N más". Bajo los 900px (`.header-nav-desktop`, `.header-secondary-desktop`, `.header-burger-btn` en `index.css`, con `!important` porque las dos primeras parten con `display:flex` inline y necesitan que la media query les gane): se ocultan el menú de navegación, el link "ADM" y el bloque de avatar/"Cerrar sesión"; aparece un botón de hamburguesa que despliega un panel vertical (`.header-mobile-menu`) con todas esas opciones como filas grandes (`.header-mobile-link`, `padding:14px 12px` — supera el mínimo de 44px de alto recomendado para toque). **"Crear Tickets" se mantiene siempre visible**, incluso en celular — es el CTA de negocio más importante y hay espacio de sobra junto al logo y la hamburguesa incluso a 375px. El menú se cierra solo al elegir una opción, al hacer clic afuera (overlay invisible), o si la ventana crece más allá de los 900px mientras está abierto (listener de `resize` en `Header.jsx`, más una regla CSS de respaldo `@media (min-width:901px) { .header-mobile-menu { display:none !important; } }`).

**2. Hero — layout de una columna en celular.** La columna lateral fija de 220px para el número de slide y las flechas (`.hero-grid`, `grid-template-columns:1fr 220px` en escritorio) no dejaba casi nada de ancho para el texto en un celular de 375px. Bajo los 700px (`.hero-shell`, `.hero-grid`, `.hero-side`, `.hero-counter` en `index.css`): la grilla pasa a una sola columna (el texto arriba, controles abajo), el padding del contenedor se reduce (`40px 52px` → `28px 20px`), la altura deja de ser fija (`360px` → `auto` con `min-height:420px`, para que el contenido apilado no quede recortado), la columna lateral pasa de vertical a una fila horizontal (flechas + puntos), y el número grande "02/04" (decorativo, de baja prioridad) se oculta para no competir por espacio vertical con el texto. También se agregó `flexWrap` al badge superior (eyebrow + tag) por si el texto combinado no cabe en una línea a 375px.

**3. Bloques de categoría — ya tenían breakpoints de un ajuste anterior, sin cambios.** El ajuste que llevó los bloques de 4 a 5 (ver arriba) ya había agregado `.category-grid` con `repeat(5,1fr)` en escritorio, `repeat(3,1fr)` (3+2) bajo 980px y `1fr` (apilado) bajo 560px — se revisó de nuevo en este bloque de trabajo y sigue funcionando correctamente sin tocar nada; el padding de cada tarjeta (`20px 22px`) ya daba un área de toque cómodamente por encima del mínimo recomendado.

**Verificado en el navegador** en tres anchos (con un servidor de desarrollo temporal en un puerto libre, ya que el puerto 5173 por defecto estaba ocupado por otro proceso — se cerró al terminar):
- **~375px:** header muestra solo logo + "Crear Tickets" + hamburguesa (sin menú comprimido); el panel del menú despliega los 6 ítems en filas grandes, se cierra al elegir "Eventos" (confirmado que `.header-mobile-menu` desaparece del DOM tras el clic); el hero se ve en una columna, sin texto cortado, botón "Ver infografías" completo, flechas y puntos visibles debajo del texto, sin el número grande; los 5 bloques de categoría se apilan en una columna a ancho completo.
- **~768px:** header sigue en modo hamburguesa (768 < 900, decisión deliberada — ver más arriba); el hero se mantiene en dos columnas (768 > 700) con la columna lateral legible; los bloques de categoría se acomodan 3+2, sin verse forzados.
- **Escritorio (1300px):** confirmado que nada se rompió — header con el menú completo en fila, hero en dos columnas con el número de slide visible, 5 bloques de categoría en una sola fila.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — Videoteca en páginas propias (de popup a rutas con URL)

Cambio grande de UX pedido tras revisión con gerencia: el botón "Ver todos los videos" del bloque Videoteca en la home dejó de abrir un popup grande (`VideoLibraryModal`) y ahora navega a páginas completas con URL propia, dentro del mismo router y `PortalLayout` que ya usa el resto del portal (header siempre visible). **El popup del reproductor que se abre al hacer clic en una tarjeta dentro del bloque corto de la home no se tocó** — sigue siendo el mismo `VideoModal` de siempre.

### Rutas nuevas

- **`/videoteca`** (`src/pages/VideotecaPage.jsx`) — listado combinado con filtros, orden, grilla paginada.
- **`/videoteca/:slug`** (`src/pages/VideotecaDetailPage.jsx`) — detalle de un video real o un evento ya realizado (el `slug` puede pertenecer a `content_items` o a `events`; la página prueba ambas tablas).

Ambas registradas como hijas de la ruta `/` (`PortalLayout`) en `AppRouter.jsx`, junto a `HomePage`.

### Contenido combinado y decisión "categoría oculta eventos"

`/videoteca` muestra en un solo listado paginado (12 por página, 3×4 en escritorio) **todos** los videos publicados (`content_items` tipo `video`) **y todos** los eventos (`published`/próximos y `completed`/realizados) — combinados y ordenados por fecha en `videotecaService.getVideotecaItems()`. Los eventos que todavía no ocurrieron muestran una etiqueta "PRÓXIMAMENTE" en la tarjeta.

`events` no tiene columna `category_id` (confirmado en `20260727100500_events.sql`), así que filtrar por una categoría específica (Ciberseguridad, Cloud & Infraestructura, etc.) **oculta todos los eventos** en vez de mostrarlos sin filtrar — mostrar eventos "de cualquier categoría" mezclados con videos de una categoría específica habría sido confuso. Cuando el filtro "Mostrar" está en "Solo eventos realizados" o "Solo próximos eventos" (ver abajo), los chips de categoría no tendrían ningún efecto sobre el resultado, así que se atenúan visualmente (`opacity:0.4`) y se deshabilitan (`pointer-events:none`) en vez de quedar interactivos sin dar ninguna señal.

### Ordenar por / Mostrar: dos selects, no uno combinado

Se pidió un control con 4 opciones (recientes primero, más antiguo primero, solo eventos realizados, solo próximos eventos) y se dejó a criterio de diseño. Se optó por **dos `<select>` independientes** en vez de un único selector de 4 opciones mezcladas:

- **"Ordenar por"** (`recent` / `oldest`) — orden cronológico.
- **"Mostrar"** (`all` / `completed` / `upcoming`) — qué subconjunto de contenido.

Motivo: son conceptualmente independientes — por ejemplo, "solo eventos realizados" ordenados de más antiguo a más reciente es una combinación válida y razonable que un único selector de 4 opciones fijas no podría expresar sin volverse una lista de 6+ combinaciones. Documentado también como comentario en `VideotecaPage.jsx`.

### Detalle de video/evento (70/30) y reutilización de componentes

Al hacer clic en una tarjeta de video real o de evento ya realizado, navega a `/videoteca/:slug`. Layout `.videoteca-detail-grid` (70/30 en escritorio vía `grid-template-columns: 7fr 3fr`, apilado a 1 columna bajo 860px):

- **Izquierda (70%):** reproductor (`YouTubePlayer`, el mismo componente extraído de `VideoModal` — no se duplicó la lógica de `extractYouTubeVideoId`), título, categoría (solo videos, `events` no tiene categoría), fecha, duración (solo videos), descripción.
- **Derecha (30%, "Mira también"):** hasta 6 próximos eventos (`status='published'`, fecha futura), cada uno abre el mismo `EventDetailModal` que ya usa la sección Eventos (se cambió a `export function EventDetailModal` en `Events.jsx` para poder importarlo desde acá — antes era local al archivo).

Las tarjetas "PRÓXIMAMENTE" (evento que todavía no ocurrió) **no navegan** a esta página de detalle — abren directamente el mismo `EventDetailModal` (fecha, hora, modalidad, lugar, botón "Inscríbete aquí") sobre `/videoteca`, igual que en la sección Eventos.

**Limitación de modelo de datos encontrada y documentada:** `events` no tiene ninguna columna de URL de video (a diferencia de `content_items.external_url`), así que un evento `completed` nunca tiene un video de YouTube que reproducir — `YouTubePlayer` cae en su estado de respaldo "Sin video disponible", y se agregó una nota adicional bajo la descripción para ese caso ("Este evento todavía no tiene una grabación en video disponible"). Se reutilizó el mismo componente en vez de crear una variante "sin reproductor" para que, si en el futuro se agrega una columna de grabación a `events`, esta página funcione sin cambios.

**Estado "no encontrado":** si el slug no corresponde a ningún video publicado ni evento, se muestra un `EmptyState` con un link "Volver a la videoteca" — se prefirió esto a un redirect automático porque es más informativo (el usuario entiende qué pasó) y evita el parpadeo/salto de una redirección silenciosa.

### Componentes compartidos extraídos (reutilización, no duplicación)

- **`src/components/shared/Pagination.jsx`** — extraído del `Pagination` local de `AdminWidgets.jsx` (mismo patrón numerado tipo WordPress que ya usaban las tablas del panel admin). Se le agregó un prop `bordered` (default `false`) para el borde superior que solo quería el contexto admin; `/videoteca` lo usa sin ese borde.
- **`src/components/shared/YouTubePlayer.jsx`** — extraído del poster/botón de play/iframe que antes vivía inline dentro de `VideoModal` (`Media.jsx`). `VideoModal` ahora delegan en él; la página de detalle lo usa igual, sin duplicar la lógica de extracción del ID de YouTube (`src/lib/youtube.js`).
- **`EventDetailModal`** (`Events.jsx`) — pasó de función local a `export`, sin cambios de comportamiento, para poder reutilizarse desde `/videoteca` y `/videoteca/:slug`.

Con esto, `VideoLibraryCard` y `VideoLibraryModal` (el popup grande anterior) se eliminaron por completo de `Media.jsx` — ya no tenían ningún punto de uso.

### Verificado en el navegador

Con un servidor de desarrollo temporal en un puerto libre (5173 estaba ocupado por otro proceso; se cerró al terminar):

- `/videoteca` carga con el header del portal siempre visible, título, reseña, chips de categoría, selects de orden/mostrar y grilla de 12 elementos (video + eventos combinados, con badges "PRÓXIMAMENTE" en los eventos futuros).
- Filtrar por categoría ("Ciberseguridad") deja solo videos de esa categoría, sin eventos — comportamiento esperado.
- Cambiar "Mostrar" a "Solo próximos eventos" con una categoría específica activa atenúa y deshabilita los chips (confirmado `opacity:0.4` y `pointer-events:none` vía `getComputedStyle`); al volver "Mostrar" a "Todo el contenido" el chip de categoría se reactiva y conserva la selección.
- Paginación numerada funciona (2 páginas con el contenido de seed actual).
- Clic en una tarjeta de video real navega a `/videoteca/<slug>` con URL limpia; el reproductor inserta el iframe de YouTube correctamente (`src` con el ID esperado); "Mira también" lista próximos eventos.
- Clic en una tarjeta "PRÓXIMAMENTE" abre el `EventDetailModal` (fecha, hora, modalidad, lugar, "Inscríbete aquí") sin navegar — la URL se mantiene en `/videoteca`.
- Recarga directa de `/videoteca/<slug>` (no solo navegación interna) confirmada — la página carga igual desde cero.
- Responsive: a 375px, `.videoteca-grid` baja a 1 columna; en la página de detalle, `.videoteca-detail-grid` pasa de 70/30 a apilado vertical (reproductor y datos arriba, "Mira también" debajo).
- `npm run lint` y `npm run build` sin errores.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — páginas propias para Infografías, Tendencias y Eventos + miga de pan + rediseño del bloque de Eventos

Extensión del cambio de "ver todos" a páginas completas (ver ajuste anterior de Videoteca): mismo patrón aplicado ahora a Infografías, Tendencias y Eventos, más una miga de pan en las 4 páginas y un rediseño del bloque de Eventos del inicio.

### Rutas nuevas

- **`/infografias`** (`src/pages/InfografiasPage.jsx`) — miga de pan, título y reseña iguales a los que ya usaba el bloque del inicio, filtro por categoría, grilla 12/página (reutiliza `.videoteca-grid`), paginación. Reutiliza `InfoCard` e `InfografiaModal` (exportados desde `Media.jsx`) — el clic en una tarjeta abre el mismo popup con el flujo de lead/descarga, sin tocarlo.
- **`/tendencias`** (`src/pages/TendenciasPage.jsx`) — mismo patrón. No existía una versión "tarjeta" de noticia reutilizable (`NoticiasPanel` usa una lista vertical con scroll propio, pensada para la columna angosta del inicio, no para una grilla de página completa), así que se creó `NoticiaGridCard`, local a esta página, en vez de forzar la lista existente a un layout distinto. El popup sigue siendo el mismo `NoticiaModal` (exportado desde `Events.jsx`).
- **`/eventos`** (`src/pages/EventosPage.jsx`) — mismo patrón, con una diferencia deliberada: **sin filtro por categoría**. `events` no tiene columna de categoría en el modelo de datos (mismo motivo documentado en el ajuste de Videoteca por el que esa página oculta los eventos al filtrar por categoría), así que no había nada que filtrar. El listado combina próximos y realizados (`eventService.getAllEvents()`, próximos primero) reutilizando la misma `EventCard` del inicio — no se creó una tarjeta nueva. Al hacer clic, cada tarjeta abre el popup que ya tenía según su estado: `EventDetailModal` (con "Inscríbete aquí") para próximos, `VistaModal` (resumen + galería, sin inscripción) para realizados — ninguno de los dos se modificó.

**Texto elegido para Eventos** (el único de los 3 sin un texto preexistente en el inicio que copiar): título **"Agenda y Eventos TIBOX"**, reseña **"Revisa las próximas actividades de TIBOX y vuelve a ver lo mejor de nuestros eventos realizados."** — se optó por nombrar ambos tiempos (próximos y realizados) porque la página, a diferencia de antes, los combina en un solo listado; un texto que solo hablara de "próximos eventos" habría sido engañoso una vez que aparecen tarjetas de eventos ya pasados en el mismo scroll.

**Colisión de nombres evitada:** el panel admin ya tenía `InfografiasPage` y `EventosPage` propias (`admin/pages/`). Los imports públicos en `AppRouter.jsx` se renombraron al importar (`InfografiasPage as InfografiasPublicPage`, `EventosPage as EventosPublicPage`) en vez de renombrar ninguno de los dos componentes existentes.

### Miga de pan

Nuevo componente `src/components/shared/Breadcrumb.jsx` — recibe `items: [{label, to}]`, el último elemento es la página actual y nunca lleva link. Se agregó a las 4 páginas propias del portal (`/videoteca`, `/infografias`, `/tendencias`, `/eventos`), cada una con su propio "Inicio > [Sección]"; el clic en "Inicio" navega a `/` vía `react-router-dom`'s `Link`.

### Botones "Ver todos/as" en el inicio

Cada uno de los 4 bloques del inicio ya tenía o ganó su botón hacia la página completa correspondiente:
- Videoteca → "Ver todos los videos" → `/videoteca` (ya existía, ver ajuste anterior).
- Infografías → **"Ver todas las infografías"** (nuevo, agregado al banner de `InfographicsPanel`, estilo "glass" blanco translúcido acorde al fondo oscuro del panel) → `/infografias`.
- Tendencias → **"Ver todas las tendencias"** (nuevo, agregado al header de `NoticiasPanel`, mismo estilo blanco bordeado que ya usaba "Ver todos los videos") → `/tendencias`.
- Eventos → **"Ver todos los eventos"** (nuevo, debajo del carrusel combinado) → `/eventos`.

### Rediseño del bloque de Eventos del inicio: de dos paneles a un carrusel único

Antes el inicio mostraba **"Próximos Eventos"** y **"Eventos Realizados"** como dos paneles lado a lado (grilla `1fr 1fr`), cada uno con su propia paginación por "páginas" de 2 tarjetas + puntos. Se unificaron en **un solo panel** (`EventosPanel`, `Events.jsx`) con un **carrusel horizontal de scroll** — mismo patrón visual e interacción que ya usaba `InfographicsPanel` (flechas glass a los costados, `scrollBy` con `behavior:'smooth'`, `scroll-snap`) — en vez del paginado por "páginas fijas" que tenía antes. `EventosRealizadosPanel`, `PastEventsListModal` y `PastEventCard` quedaron sin ningún punto de uso y se eliminaron (mismo criterio que la limpieza de `VideoLibraryModal` en el ajuste de Videoteca).

**Fuente de datos combinada.** Nueva función `eventService.getAllEvents()` — concatena `getUpcomingEvents()` (ya ordenados por `sort_order`/fecha ascendente) y `getPastEvents()` (ya ordenados por fecha descendente) sin duplicar ninguna consulta a Supabase. Próximos primero: es lo accionable (inscribirse), el historial va después.

**Tarjeta enriquecida.** `EventCard` (ahora exportada, reutilizada también por `/eventos`) ya traía modalidad, fecha, hora, descripción breve y colaborador/logo — de ahí solo faltaba la etiqueta "PRÓXIMAMENTE" para los eventos que aún no ocurren, ahora que el panel mezcla ambos estados. Se agregó derivándola de `ev.rawStatus !== 'completed'` (ya expuesto por `mapEventRow`) en vez de un prop aparte — así la tarjeta se comporta igual venga de un listado combinado (inicio, `/eventos`) o de uno ya filtrado, sin que el componente consumidor tenga que indicárselo.

**Popups sin cambios.** Cada tarjeta sigue abriendo el popup que le correspondía antes de la fusión — `EventDetailModal` para próximos, `VistaModal` para realizados — la función `handleVerDetalle` simplemente decide cuál según `ev.rawStatus`. "Ver calendario" (antes exclusivo de "Próximos Eventos") se mantuvo igual, operando solo sobre el subconjunto de próximos (`events.filter(ev => ev.rawStatus !== 'completed')`) — mostrar eventos ya pasados en un "calendario" no habría tenido sentido.

### Verificado en el navegador

Con un servidor de desarrollo temporal en un puerto libre (se cerró al terminar):

- `/infografias`, `/tendencias` y `/eventos` cargan con miga de pan, título, reseña y grilla — clic en "Inicio" de la miga de pan navega a `/` correctamente.
- `/infografias`: filtro por categoría funciona, clic en una tarjeta abre `InfografiaModal` con el flujo de descarga existente.
- `/tendencias`: filtro por categoría funciona, clic en una noticia abre `NoticiaModal` con el contenido completo.
- `/eventos`: sin filtro de categoría (por diseño), tarjetas con etiqueta "PRÓXIMAMENTE" donde corresponde, clic en "Ver detalles" de un evento próximo abre `EventDetailModal` con fecha/hora/modalidad/lugar/"Inscríbete aquí". **No se pudo verificar visualmente el clic sobre un evento ya realizado** (abre `VistaModal`) porque el seed actual no tiene ningún evento `completed` disponible — mismo pendiente ya documentado más abajo (migración `20260730100000_demo_content_agosto.sql`); la rama de código se revisó y sigue el mismo patrón ya probado en Videoteca para esta misma distinción.
- Los 4 botones "Ver todos/as" del inicio (Videos, Infografías, Tendencias, Eventos) navegan a su página correspondiente — confirmado con `location.pathname` tras cada clic.
- El carrusel combinado de Eventos en el inicio muestra próximos (con badge "PRÓXIMAMENTE") seguidos del historial, con flechas de navegación funcionales y el botón "Ver todos los eventos" debajo.
- Responsive a 375px: las 3 grillas nuevas bajan a 1 columna (misma clase `.videoteca-grid` reutilizada de Videoteca), el carrusel de Eventos del inicio se ve en una tarjeta a la vez sin overflow horizontal en el `body` (`scrollWidth === clientWidth === 375`), y el botón "Ver todos los eventos" se ve completo debajo.
- `npm run lint` y `npm run build` sin errores.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — orden de botones, thumbnail en tarjetas de Eventos y fix de navegación del menú superior

Tres ajustes puntuales al bloque de Eventos del inicio y al Header, tras revisión del ajuste anterior.

**1. Orden de botones.** En el panel "Agenda y Eventos TIBOX" del inicio, "Ver todos los eventos" se movió al header del panel, a la izquierda de "Ver calendario" (antes vivía suelto debajo del carrusel, como único botón centrado).

**2. Thumbnail en las tarjetas de Eventos.** `EventCard` (`Events.jsx`) ganó una imagen destacada (`ev.img`, es decir `thumbnail_url`) arriba de la tarjeta, mismo patrón visual que `InfoCard` (Media.jsx): imagen con `aspectRatio:'16/9'` seguida del contenido. Se aplica tanto en el carrusel del inicio como en la grilla de `/eventos`, ya que ambos reutilizan el mismo componente.

**3. Bug de navegación del menú superior — corregido con una simplificación.** El Header usaba `window.scrollToSection`, un mecanismo global (definido en `PortalLayout.jsx`) que hacía scroll suave a anclas `section-*` que solo existen en `HomePage` — al entrar directo a `/videoteca`, `/infografias`, `/tendencias` o `/eventos`, esas anclas no existen y el menú quedaba sin efecto. Con Videos, Infografías, Tendencias y Eventos ya convertidos en páginas propias (ver ajuste anterior), la solución fue **simplificar, no parchear**: el Header ahora navega directo a cada ruta (`Link to="/videoteca"`, etc.) en vez de hacer scroll, consistente en todas las páginas del sitio. Se eliminó por completo `window.scrollToSection` de `PortalLayout.jsx` — quedó sin ningún punto de uso una vez que el Header dejó de necesitarlo.

El único caso que seguía necesitando scroll — el bloque de categoría "Contacto" en el inicio, que no tiene ruta propia — se resolvió con un `scrollIntoView` local dentro de `CategoryBlocks` (Hero.jsx), sin depender de ningún global. Los otros 4 bloques de categoría (Videos, Infografías, Tendencias, Eventos) pasaron del mismo `scrollTarget` a `to` (navegación real) en `CATS` (`src/data/seed/homeSeed.js`).

**Verificado en el navegador:** desde cada una de las 4 páginas nuevas, los 5 ítems del menú superior (Inicio, Videos y Webinars, Infografías, Noticias, Eventos) navegan a su ruta correcta — confirmado con `location.pathname` tras cada clic, en escritorio y en el menú hamburguesa móvil. El bloque de categoría "Contacto" en el inicio sigue sin navegar (se queda en `/`), y los otros 4 bloques navegan a sus páginas. El panel de Eventos del inicio muestra "Ver todos los eventos" a la izquierda de "Ver calendario", y cada tarjeta (inicio y `/eventos`) muestra su imagen destacada. `npm run lint` y `npm run build` sin errores.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — reversión parcial: menú superior y bloques de categoría vuelven a hacer scroll en el inicio

Braulio pidió revertir parcialmente el ajuste anterior: los 5 bloques de categoría bajo el carrusel y los ítems del menú superior (Inicio/Videos y Webinars/Infografías/Noticias/Eventos) vuelven a llevar a las secciones del inicio, no a las páginas dedicadas. Las páginas dedicadas (`/videoteca`, `/infografias`, `/tendencias`, `/eventos`) siguen existiendo — solo se llega a ellas desde los botones "Ver todos..." de cada bloque, que no se tocaron.

**Bloques de categoría (`CategoryBlocks`, Hero.jsx).** Vuelven a usar `window.scrollToSection(c.scrollTarget)` para los 5, tal como funcionaban antes del ajuste anterior. `CATS` (`src/data/seed/homeSeed.js`) volvió de `to` a `scrollTarget` en los 4 que lo habían perdido.

**Menú superior (`Header.jsx`).** Este es el único punto que no es una reversión 1:1, porque el pedido explícito fue que el menú funcione en *todas* las páginas, no solo en el inicio: si `location.pathname === '/'`, hace `window.scrollToSection(target)` directo (igual que antes); si está en cualquier otra página, navega a `/` pasando `state: { scrollTo: target }` con `useNavigate`. `PortalLayout.jsx` (que envuelve todas las páginas del portal vía `<Outlet/>`) recuperó su `window.scrollToSection` global y ganó un efecto nuevo que observa `useLocation()`: cuando el pathname es `/` y `location.state.scrollTo` existe, completa el scroll — resolviendo el pendiente una vez que `HomePage` ya está montada. Sin este paso intermedio, navegar desde otra página se habría quedado solo en el tope del inicio (justo el bug que el pedido quería evitar).

Se eliminó por completo la lógica de navegación directa a rutas que se había agregado en el ajuste anterior (`Link to="/videoteca"` etc. en el Header, `navigate(c.to)` en `CategoryBlocks`) — no quedó código muerto porque se reescribió directamente sobre esas mismas líneas.

**Verificado en el navegador:** desde el inicio, cada ítem del menú y cada bloque de categoría llama a `window.scrollToSection` con el target correcto (confirmado programáticamente y con `scrollIntoView({behavior:'instant'})` para saltar la limitación ya documentada de animaciones `smooth` en el entorno de pruebas de este chat). Desde `/videoteca` (llegando ahí vía "Ver todos los videos"), el clic en "Infografías" del menú navega a `/` con `state:{scrollTo:'infographics'}` y, tras esperar la animación, la vista queda exactamente sobre la sección "Información visual, simple y al alcance" — confirmado visualmente con captura de pantalla, sin quedarse en el tope. `npm run lint` y `npm run build` sin errores.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — etiqueta "PRÓXIMAMENTE" superpuesta sobre la imagen, en azul

Ajuste a `EventCard` (`Events.jsx`), compartida por el carrusel de Eventos del inicio y la página `/eventos` (un solo cambio, ambos lugares se actualizan igual).

La etiqueta "PRÓXIMAMENTE" pasó de estar en la fila de metadatos bajo la imagen (junto a la modalidad) a superponerse sobre la imagen, esquina superior derecha (`position:absolute`, dentro del contenedor de la imagen). Cambió de naranjo (`#FF6707`, mismo tono que "Ver detalles") a azul (`#0050C8`, el azul de marca que ya usa el sitio en botones, links y otros elementos — no se inventó un tono nuevo) con texto blanco, a propósito para que no compita visualmente ni se confunda con el botón de acción. La etiqueta de modalidad ("Online"/"Presencial") no se movió — sigue debajo de la imagen, junto a fecha y hora.

Se agregó un fallback: si el evento no tiene `thumbnail_url` (`ev.img` vacío), la etiqueta vuelve a mostrarse inline junto a la modalidad (mismo lugar de antes) en vez de perderse — no todos los eventos tienen imagen cargada todavía.

**Verificado en el navegador:** mismo resultado visual en el carrusel del inicio y en `/eventos` (misma tarjeta reutilizada). En móvil (375px) la etiqueta queda dentro del área de la imagen sin tapar información relevante (título, colaborador, botón), tanto en la grilla de `/eventos` como en el carrusel del inicio. `npm run lint` y `npm run build` sin errores.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — guardado real de leads de infografías + descarga real + panel admin de solo lectura

Pendiente arrastrado desde la Fase 1.5 (documentado en `FASE-01B-AJUSTES-VISUALES-PAULA.md`): `InfografiaLeadModal` solo simulaba el envío (`setTimeout`) y recordaba el consentimiento en `sessionStorage`, sin persistir nada. La tabla `infographic_leads` (con su RLS: insert público, select solo admin) ya existía desde la Fase 4, sin usar.

**1. Guardado real.** `formService.submitInfografiaLead()` pasó de `simulateDelay` a un `insert` real contra `infographic_leads` (`full_name`, `company`, `position`, `email`, `content_item_id`). `InfografiaModal` le pasa `info.id` (el id del `content_item` de la infografía) a `InfografiaLeadModal` como `contentItemId`, que ahora viaja en el body del insert — antes no existía ese dato en ningún lado del flujo. Se agregó manejo de error real (antes no hacía falta, `simulateDelay` nunca fallaba): si el insert falla, se muestra un mensaje inline en el propio formulario y el botón vuelve a estar habilitado, sin perder los datos ya escritos.

**2. Descarga real de la infografía, con fallback a pestaña nueva.** Nuevo helper `src/lib/download.js` (`downloadImageWithFallback`): intenta primero `fetch(url, {mode:'cors'})` sobre `thumbnail_url`, arma un blob y dispara una descarga forzada con `<a download>` (nombre de archivo derivado del título de la infografía, sanitizado con el mismo criterio sin-literal-unicode que `lib/slugify.js`); si el `fetch` falla — típicamente porque el host de la imagen no manda cabeceras CORS pensadas para que JS pueda leer el contenido, no solo mostrarlo en un `<img>` — cae a `window.open(url, '_blank')` sin mostrar ningún error al usuario, que igual puede guardar la imagen manualmente desde esa pestaña. **Verificado en el navegador con las imágenes reales del seed** (alojadas en Unsplash): Unsplash sí manda CORS permisivo, así que el `fetch` tuvo éxito y se confirmó el blob (98 KB, `image/jpeg`) — la ruta de descarga forzada es la que se ejerce hoy con este contenido. La ruta de fallback se verificó por separado, forzando un `fetch` a una URL que responde con error de red: confirmado que lanza y que el `catch` es exactamente el punto donde se dispara `window.open`. Si en el futuro se cargan infografías desde un host que no permita CORS, el comportamiento observado sería automáticamente el de abrir en pestaña nueva, sin cambios de código.

**3. Panel admin de solo lectura.** Sección nueva **"Leads de infografías"**, en el sidebar del admin justo debajo de "Infografías" (`/admin/contenidos/infografias/leads`) — se eligió un ítem de menú propio en vez de una pestaña dentro de Infografías porque el admin no tiene ningún patrón de pestañas hoy y un ítem de sidebar es más fácil de encontrar que agregar ese patrón desde cero para un solo caso. Mismo patrón visual y de paginación (10/página, `Pagination` compartido) que el resto de tablas del admin. Tabla: nombre, empresa, cargo, correo, infografía relacionada (join a `content_items.title`) y fecha — sin acciones de editar/eliminar, tal como se pidió (la política RLS de `infographic_leads` tampoco da esos permisos a nadie, ni a administradores). No aparece el botón "Nuevo" en esta página (no está en `NEWABLE_PATHS` de `AdminHeader.jsx`) porque no tiene sentido crear un lead a mano.

**4. Comportamiento "una vez por visita" sin cambios de UX**, solo que ahora la primera vez sí persiste: `sessionStorage.getItem('tibox_infografia_lead_ok')` sigue decidiendo si se pide el formulario o se descarga directo, igual que antes.

**Verificado en el navegador:**
- Se limpió `sessionStorage` y se abrió una infografía → apareció el formulario de lead.
- Se completó y envió → guardó en `infographic_leads` (confirmado en el panel admin nuevo, fila con los datos enviados y la infografía correcta) y la descarga se disparó sin mostrar error.
- Se abrió una infografía **distinta** en la misma visita → descargó directo, sin volver a pedir el formulario (confirmado: sigue habiendo solo 1 lead en el panel admin tras la segunda descarga, no 2).
- `npm run lint` y `npm run build` sin errores.

**Nota para Braulio:** la prueba de este ajuste dejó un lead real en `infographic_leads` (nombre "Braulio Test QA", correo `qa-test@tibox.cl`) — visible en `/admin/contenidos/infografias/leads`. Como la tabla no tiene política de `delete` para nadie (ver Fase 4, decisión 10), no se pudo limpiar desde la app; si quieres sacarlo, hay que borrarlo manualmente desde el Table Editor de Supabase.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Ajuste posterior — ocultar webinars sin realizar, nombres de sección, e imágenes de infografías duplicadas

Cuatro ajustes puntuales pedidos por Braulio.

**1. Videos con fecha futura ocultos.** Un video es la grabación de un webinar ya realizado — si todavía no llegó su fecha efectiva (`published_at`, o `created_at` si no tiene), no hay nada real que reproducir. `contentService.getVideos()` ahora filtra esos casos (`dateRaw <= ahora`) antes de devolver la lista, así que tanto "Explora Videos y Webinars" (inicio) como `/videoteca` (que reutiliza la misma función) dejan de mostrarlos. **Verificado en el navegador:** con los datos actuales del seed no hay ningún video con fecha futura (los 9 videos publicados tienen fecha hasta hoy, 30 Jul 2026), así que hoy no se oculta nada — se confirmó comparando el listado del admin (9 filas) contra el del portal (9 tarjetas, mismos títulos) para asegurar que el filtro no esté ocultando de más. El filtro queda listo para cuando exista un video con fecha posterior a hoy.

**2. Imágenes de infografías duplicadas — corrección pendiente vía migración.** Se detectaron 2 pares de infografías compartiendo la misma imagen (`thumbnail_url` idéntico): "5 señales de que tu empresa necesita migrar a la nube" / "Los 5 pilares de la transformación digital empresarial", y "Checklist de respaldo 3-2-1: protege tu información" / "Automatización de procesos: por dónde empezar". Esto es un problema de datos, no de código — se agregó la migración `20260731100100_fix_infographic_thumbnail_duplicates.sql`, que reasigna una imagen nueva (misma fuente, Unsplash, ya usada en el resto del seed) a la segunda infografía de cada par. **No se pudo aplicar en vivo durante esta sesión:** se intentó editar una de las dos infografías desde el panel admin (cambiar la imagen a la nueva URL y guardar) para verificar el fix de punta a punta, pero el guardado no persistió el cambio pese a que el modal cerró sin error visible — no se investigó más a fondo para no arriesgar una operación destructiva accidental sobre datos reales (en el intento de reabrir el menú de acciones se estuvo a punto de confirmar "Eliminar publicación" sobre esa misma infografía; se canceló a tiempo y se confirmó que las 6 infografías siguen intactas). Braulio debe ejecutar la migración manualmente en el SQL Editor de Supabase — ver sección Pendiente más abajo.

**3. "Videoteca" → "Videos y Webinars".** Ambas etiquetas pequeñas que decían "Videoteca" (el eyebrow de "Explora Videos y Webinars" en el inicio, y el eyebrow + miga de pan de `/videoteca`) ahora dicen "Videos y Webinars", igual que la categoría del menú admin y que el ítem del menú superior del portal — no quedaba ningún otro lugar visible con el nombre viejo.

**4. Renombre de etiquetas pequeñas (eyebrows).** Se actualizaron en los 2 lugares donde vive cada una (el bloque del inicio y su página dedicada):
   - "Al día" → **"Tendencias"** (`NoticiasPanel` en Events.jsx, y `TendenciasPage.jsx`).
   - "Agenda" → **"Eventos"** (`EventosPanel` en Events.jsx, y `EventosPage.jsx`).
   - "Cuéntanos tu idea" → **"Contacto"** (`ContactFormSection` en Services.jsx).
   
   En los tres casos solo se tocó la etiqueta pequeña en mayúsculas (el eyebrow) — los títulos grandes debajo ("Agenda y Eventos TIBOX", "Tendencias de la industria", "¿Tienes algún proyecto en mente?") no se pidieron cambiar y se dejaron igual.

**Verificado en el navegador:** los 4 lugares con "Videos y Webinars" (inicio + `/videoteca`, breadcrumb incluido), "Tendencias" (inicio + `/tendencias`), "Eventos" (inicio + `/eventos`) y "Contacto" (inicio) muestran el texto nuevo. `npm run lint` y `npm run build` sin errores.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Auditoría del panel admin — bugs encontrados/corregidos y funcionalidades faltantes

Auditoría completa pedida por Braulio: revisión estática de código (agente de exploración) + pruebas en vivo del flujo crear/editar/publicar/eliminar en las 5 categorías de contenido y de las secciones cruzadas del admin (Dashboard, Leads, Mensajes, Opiniones, Administradores, Configuración, Perfil). El informe completo (con severidad, prioridad y esfuerzo estimado) se entregó a Braulio en el chat; acá queda el resumen de qué se tocó en el código.

### Bugs corregidos en este ajuste

1. **"Publicaciones recientes" del Dashboard siempre vacío.** `ContentTable section="recent"` llamaba `listContentItems(SECTION_TO_TYPE['recent'])`, y `'recent'` nunca estuvo en `SECTION_TO_TYPE` — la consulta filtraba por `type=undefined` y no traía nada, sin importar cuánto contenido real hubiera. Nueva función `adminContentService.listRecentContentItems()` (trae video+infografía+noticia combinados por fecha) y el widget pasa a ser de **solo lectura** (`RowMenu` con prop `readOnly`, solo ofrece "Ver publicación") — mezclar 3 tipos en una tabla significa que el modal de edición no puede saber con qué campos armarse, así que no se ofrece Editar/Eliminar/etc. desde ahí; para eso está la sección real de cada tipo.
2. **"Abrir en el portal" (popup "Ver publicación") siempre enlazaba a "/"**, sin importar qué contenido se estuviera viendo. Ahora arma la URL real: `/videoteca/:slug` para videos, `/infografias`/`/tendencias` para infografías/noticias (no tienen página propia por ítem, van a su listado), `/eventos` para eventos.
3. **Imágenes huérfanas en Storage al eliminar o editar contenido.** Ni borrar ni editar (reemplazando la imagen) un video/infografía/noticia/evento limpiaba la imagen subida al bucket `content-images` — quedaba ahí para siempre. `deleteContentItem`/`deleteEvent` usan `.delete().select()` (una sola consulta) para saber qué imagen borrar; `updateContentItem`/`updateEvent` leen la URL anterior antes de actualizar (solo cuando `fields` trae `thumbnail_url`) y, si cambió, limpian la anterior después del update. En ambos casos solo se borra del Storage si ningún otro content_item/evento sigue apuntando a esa misma URL (`storageService.deleteContentImageIfUnused`) — "Duplicar" copia la URL de la imagen tal cual a la fila nueva, así que dos filas pueden compartir legítimamente el mismo archivo. (La limpieza en "Editar" se había implementado y revertido una primera vez por precaución, al coincidir con el bug de guardado colgado descrito abajo — Braulio confirmó en su propio navegador que ese colgado era una limitación del entorno de pruebas en sandbox, no un bug real, así que se volvió a implementar.)
4. **Sin confirmación antes de eliminar un mensaje de contacto.** El botón "Eliminar" de la bandeja de mensajes borraba la fila al primer clic, sin aviso (a diferencia del resto del admin, que sí usa `ConfirmDialog`). Se agregó el mismo diálogo de confirmación.
5. **"Marcar todas como leídas" (campana de notificaciones) no tenía ningún `onClick`** — no hacía nada. Se conectó a un estado local que marca las notificaciones visibles como leídas (las notificaciones en sí siguen siendo datos de ejemplo, ver pendiente más abajo).
6. **Eventos: sin validación de fecha de término anterior al inicio.** Se podía guardar un evento con `ends_at` antes que `starts_at`, sin ningún aviso ni acá ni en la base. Se agregó la validación en el formulario.

### Bug crítico reportado en la auditoría — descartado, confirmado como limitación del sandbox

Durante la auditoría, crear o editar contenido desde el panel admin parecía quedarse colgado indefinidamente en "Guardando…", reproducido en dos sesiones de auditoría independientes. Braulio probó crear un video/webinar y un evento en su propio navegador y ambos se publicaron sin problemas, sin ningún colgado. **Se confirma que el colgado era una limitación del entorno de pruebas en sandbox usado durante la auditoría, no un bug real de la app** — no se requiere más investigación en Supabase Logs. Con esto se restauró la limpieza de imagen anterior al editar (ver punto 3 arriba), que se había revertido por precaución mientras este bug parecía real.

### Funcionalidades faltantes detectadas (no corregidas, quedan para que Braulio priorice)

Ver la lista completa con prioridad y esfuerzo estimado en el resumen ejecutivo entregado en el chat. Los hallazgos más relevantes:

- **Configuración/Portada (`/admin/portada`) es 100% decorativa.** Los 3 tabs (Slides del hero, Bloques de categoría, Contacto) leen datos de ejemplo y **el botón "Guardar cambios" no tiene ningún `onClick` en ninguno de los tres** — cualquier edición se pierde sin ningún aviso al recargar. Confirmado en vivo. Es la brecha más severa del panel: se ve como una función real y no lo es en absoluto.
- **Servicios TIBOX, Mensajes de contacto y Opiniones de clientes no están conectados a Supabase** — leen datos de ejemplo (`adminService.js` + seeds), pese a que las tablas reales (`contact_messages`, `feedback`) ya existen con RLS completo para admin. Confirmado en vivo: los cambios en Servicios TIBOX se pierden al recargar.
- **Perfil (`/admin/perfil`)** tampoco persiste nada real (avatar, contraseña, preferencias) — solo estado local con un `setTimeout` que simula guardar.
- **Buscador del header ("Buscar…") es decorativo** — no tiene `value`/`onChange`, no filtra nada en ninguna página.
- Sin historial/registro de actividad (quién publicó/editó/eliminó qué), sin roles diferenciados (todo admin invitado tiene acceso idéntico), sin exportar a CSV/Excel en ningún listado, sin paginación en Mensajes/Opiniones (aceptable hoy por ser datos de ejemplo pequeños, no una vez sean reales).

### Configuración/Portada (`/admin/portada`) conectada a Supabase

Los 3 tabs eran 100% decorativos (ver hallazgo de la auditoría, arriba). Se conectaron los tres:

- **Sliders principales** — CRUD real contra `hero_slides` (la misma tabla que ya alimenta el hero público, `homeService.getHeroSlides()`). Nuevo `adminPortadaService.js` con `listHeroSlides/createHeroSlide/updateHeroSlide/deleteHeroSlide`; "Quitar"/"Agregar slider" persisten al instante, el resto de los campos se acumulan como cambios pendientes y se guardan con "Guardar cambios" (ahora con `onClick` real, estado de carga y de error). La imagen de fondo usa el mismo flujo de subida que Videos/Infografías/Noticias/Eventos (`storageService.uploadContentImage`), y reemplazar o quitar una imagen limpia la anterior del bucket si nada más la usa.
- **"Bloques de categorías" → renombrado a "Categorías de contenido", repurposeado a la tabla `categories` real** (decisión confirmada con Braulio antes de implementar). El concepto original — los 4 bloques de navegación bajo el hero (Explora/Noticias/Eventos/Tu Opinión) — es chrome fijo del portal sin tabla propia (`homeService.getCategoryBlocks()`, decisión deliberada documentada ahí mismo); no había nada real que ese tab pudiera editar. Se repurposa para editar las categorías que sí existen y sí se usan (clasificación de videos/infografías/noticias en todo el portal) — CRUD real contra `categories`, mismo patrón de guardado que sliders.
- **Contacto** — nueva tabla `site_settings` (fila única `id='contact'`, columna `data jsonb`) vía la migración `20260731100200_site_settings.sql`. `adminPortadaService.updateContactSettings()` guarda título/descripción/direcciones/CTA de verdad. Además — confirmado con Braulio que valía la pena ampliar el alcance — **se conectó también la portada pública**: antes ni siquiera el "Guardar cambios" fantasma alimentaba nada, el título/descripción/CTA del bloque de contacto (`Services.jsx`) estaban hardcodeados directamente en el JSX. Ahora `Services.jsx` lee esos 3 campos desde la misma fila vía `siteSettingsService.getContactSettings()` (nuevo, lectura pública compartida entre portal y admin), con los textos actuales como fallback mientras carga o si la tabla todavía no existe. Las direcciones de oficina (Chile/Perú) se guardan pero no se muestran en el portal — se habían quitado deliberadamente de este bloque en un ajuste anterior (ver comentario en `Services.jsx`), no se reintrodujeron.

No se pudo probar el guardado real en vivo en esta sesión (sin sesión de admin en el navegador de esta herramienta) — verificado con lint + build limpios y navegación pública (fallback del bloque de Contacto confirmado en pantalla). Falta que Braulio pruebe el flujo completo de los 3 tabs en su propio navegador después de ejecutar la migración pendiente.

### Mensajes de contacto y Opiniones conectados a Supabase

Ambas secciones leían datos de ejemplo (`adminService.getMessages()/getOpinions()`) y no persistían ningún cambio — confirmado en la auditoría.

- **Mensajes** — nuevo `adminMessagesService.js`, CRUD real contra `contact_messages`: `listMessages`, `deleteMessage` y `markMessageRead` (nuevo — "Ver mensaje" ahora marca el mensaje como leído la primera vez que se abre, antes el estado "Nuevo"/"Leído"/"Respondido" era puramente decorativo). El diálogo de confirmación de borrado (agregado en la auditoría) ahora sí elimina de verdad.
- **Opiniones** — nuevo `adminOpinionsService.js`, CRUD real contra `feedback`: `listOpinions`, `deleteOpinion`. Se agregó la acción "Eliminar" (con el mismo `ConfirmDialog`), que antes no existía en esta sección — no era parte de lo pedido explícitamente, pero se agrega para dar paridad con Mensajes ahora que ambas tienen datos reales que sí conviene poder borrar (spam, pruebas, etc.).
- **Alcance ampliado (con el mismo criterio confirmado por Braulio para el tab Contacto de Portada): se conectaron también los formularios públicos.** `formService.submitContactForm`/`submitOpinionForm` solo simulaban el envío (`setTimeout`, sin persistir nada) — es decir, ni siquiera con este ajuste la bandeja del admin tendría mensajes reales que mostrar si el formulario público seguía sin guardar nada. Ahora ambos insertan de verdad (`contact_messages`/`feedback`, mismo patrón que `submitInfografiaLead`: RLS permite insert público sin sesión). Se agregó manejo de error visible en ambos formularios (`Services.jsx`, `OpinionPanel.jsx`) — antes un fallo de red dejaba el botón en "Enviando…" para siempre porque solo había `.then()`, sin `.catch()`.

No se pudo probar el envío real de ningún formulario en vivo en esta sesión (limitación ya documentada de esta herramienta con las llamadas a Supabase — ver bug crítico descartado, arriba). Verificado con lint + build limpios y revisión de código contra el mismo patrón ya probado en producción por Braulio (`submitInfografiaLead`). Falta que Braulio pruebe en su navegador: enviar el formulario de contacto, enviar una opinión, y verificar que ambos aparezcan en `/admin/mensajes` y `/admin/mensajes/opiniones`.

**Commit local únicamente, sin `git push`** — a la espera de que Braulio lo revise en local con `npm run dev`.

## Pendiente

- **Braulio debe ejecutar la migración `20260731100200_site_settings.sql`** (crea la tabla `site_settings`, usada por el tab "Contacto" de `/admin/portada` y por el bloque de contacto público en `Services.jsx`) en el SQL Editor de Supabase — hasta entonces, ese tab y el bloque de contacto público funcionan con los textos de reserva (fallback) hardcodeados, sin persistencia real. Contenido completo de la migración en `supabase/migrations/20260731100200_site_settings.sql`.
- **Braulio debe ejecutar la migración `20260731100100_fix_infographic_thumbnail_duplicates.sql`** (reasigna imágenes únicas a 2 infografías que hoy comparten thumbnail con otras) en el SQL Editor de Supabase. Contenido completo de la migración:
  ```sql
  update public.content_items
  set thumbnail_url = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop'
  where type = 'infographic'
    and title = 'Los 5 pilares de la transformación digital empresarial';

  update public.content_items
  set thumbnail_url = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=450&fit=crop'
  where type = 'infographic'
    and title = 'Automatización de procesos: por dónde empezar';
  ```
- **Braulio debe ejecutar la migración `20260731100000_events_sort_order.sql`** (agrega `sort_order` a `events`) en el SQL Editor de Supabase — hasta entonces, la sección Eventos del panel admin y "Próximos Eventos" del portal fallarán al cargar (columna inexistente). Contenido completo de la migración:
  ```sql
  alter table public.events
    add column if not exists sort_order integer not null default 0;

  create index if not exists events_sort_order_idx on public.events (sort_order);
  ```
- **Braulio debe ejecutar la migración `20260730100000_demo_content_agosto.sql`** (contenido de ejemplo adicional para la demo) en el SQL Editor de Supabase — entre otras cosas, incluye el único evento `completed` disponible hoy; hasta que se ejecute, el botón "Ver eventos realizados" no aparece (el panel muestra correctamente el estado vacío "Todavía no hay eventos realizados").
- **Braulio debe ejecutar, en este orden, las 3 migraciones nuevas de esta fase** (`20260729100000_webinars_category.sql`, `20260729100100_hero_slides_seed.sql`, `20260729100200_storage_content_images.sql`) en el SQL Editor de Supabase, después de las ya ejecutadas de las Fases 4 y 5.
- **Si el `INSERT` sobre `storage.buckets` de la migración de Storage falla**, crear el bucket manualmente: Supabase Dashboard → Storage → New bucket → nombre `content-images` → Public bucket activado. Luego ejecutar el resto del archivo (las políticas RLS) igual.
- **Probar el flujo completo de creación de contenido desde el panel admin** (login real, crear/publicar una noticia con imagen, una infografía con imagen, un video de YouTube, un evento con banner y enlace de inscripción) — ver los pasos exactos en el mensaje de cierre de esta fase.
- Agregar `resources` genéricos y galería de eventos, si el negocio los sigue necesitando después del evento de agosto.
- Mejorar el refetch tras acciones del admin sin recargar la página completa (ver decisión 8).
- Evaluar restringir el CORS de Storage/Edge Functions a un dominio fijo una vez exista uno de producción (heredado de la Fase 5).

## Próxima fase recomendada

Fase 9 (o la que Braulio priorice después del evento de agosto) — guardado real de leads de infografías, mensajes de contacto y opiniones (conectar `formService.js` a Supabase), y evaluar `resources`/galería de eventos si siguen siendo necesarios. **No se avanza sin confirmación explícita de Braulio**, y sin que primero se hayan ejecutado las migraciones de esta fase y probado la creación de contenido real desde el panel admin.
