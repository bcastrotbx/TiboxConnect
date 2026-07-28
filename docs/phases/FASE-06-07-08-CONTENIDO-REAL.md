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

## Pendiente

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
- Conectar el guardado real de leads de infografías (`InfografiaLeadModal` → tabla `infographic_leads`) — Fase 9.
- Agregar `resources` genéricos y galería de eventos, si el negocio los sigue necesitando después del evento de agosto.
- Mejorar el refetch tras acciones del admin sin recargar la página completa (ver decisión 8).
- Evaluar restringir el CORS de Storage/Edge Functions a un dominio fijo una vez exista uno de producción (heredado de la Fase 5).

## Próxima fase recomendada

Fase 9 (o la que Braulio priorice después del evento de agosto) — guardado real de leads de infografías, mensajes de contacto y opiniones (conectar `formService.js` a Supabase), y evaluar `resources`/galería de eventos si siguen siendo necesarios. **No se avanza sin confirmación explícita de Braulio**, y sin que primero se hayan ejecutado las migraciones de esta fase y probado la creación de contenido real desde el panel admin.
