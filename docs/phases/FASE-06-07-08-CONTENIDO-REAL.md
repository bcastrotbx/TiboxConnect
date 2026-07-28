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

## Pendiente

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
