# Fase 9 — Página de artículo para Tendencias/Noticias y ajustes de UX en Admin

**Estado:** Completa en código (verificada en el navegador de desarrollo). Pendiente de que Braulio ejecute en el SQL Editor de Supabase la migración `20260812100000_list_admin_profiles_function.sql` (ver [Comandos pendientes](#pendiente-de-braulio)) y confirme el nombre elegido para la sección renombrada (ver [Punto 2.2](#22--renombrar-configuración-y-moverla-dentro-de-contenidos)).

## Objetivo

Tarea de una sola fase, con dos partes independientes:

1. Dar a cada noticia de "Tendencias" su propia página de detalle (mismo patrón que Videos/Eventos), con "Mira también" de otras noticias, y conectar los dos CTAs que hoy no llevan a ningún lado (el popup del inicio y la noticia destacada).
2. Cuatro ajustes de UX en el panel de administración: quitar "Servicios TIBOX" del menú, renombrar y reubicar "Configuración", agregar un listado real de administradores, y renombrar "Negocio" a "Mensajes".

## Investigación previa

Antes de escribir código se revisó cómo están implementadas hoy `EventoDetailPage.jsx` y `VideotecaDetailPage.jsx` (ambas usan la clase `.videoteca-detail-grid`, definida en `src/index.css`: grid 70/30 que colapsa a una columna en pantallas angostas, con un `section-card` de contenido principal y otro de "Mira también"/"Eventos recomendados"). La página nueva de noticias replica exactamente esa misma estructura.

También se confirmó que `content_items` (la tabla compartida por videos/infografías/noticias) sí tiene una columna `slug` poblada para las tres — `adminContentService.createContentItem()` la genera con `makeSlug(fields.title)` sin distinguir por `type`. El problema era que `newsService.js` nunca la exponía en el mapeo, a diferencia de `contentService.js`/`eventService.js`.

## Parte 1 — Página de detalle para Noticias/Tendencias

### 1.1 Página propia por noticia

- **`src/services/newsService.js`**: `mapNewsRow()` ahora expone `slug`, `day` y `month` (estos dos últimos vía `formatDayMonth`, para el badge de fecha de "Mira también", igual que en `eventService.js`). `getFeaturedNews()` ahora expone `id` y `slug`. Se agregó `getNewsBySlug(slug)`, mismo patrón que `eventService.getEventDetailBySlug()`/`contentService.getVideoBySlug()` (una sola fila, `status='published'`, `visibility='public'`, `maybeSingle()`).
- **`src/pages/NoticiaDetailPage.jsx`** (nuevo): replica la estructura de `EventoDetailPage.jsx` — imagen destacada con degradado + badge de categoría + `<h1>`, bloque de datos (Fecha / Categoría / Fuente), cuerpo completo de la noticia (sin recortar, a diferencia del popup) y breadcrumb (Inicio › Tendencias › título). Estados de carga/error/no-encontrado con los componentes compartidos (`LoadingState`/`ErrorState`/`EmptyState`).
- **`src/routes/AppRouter.jsx`**: nueva ruta `{ path: 'tendencias/:slug', element: <NoticiaDetailPage /> }`, mismo patrón que `videoteca/:slug` y `eventos/:slug`.

### 1.2 "Mira también"

En `NoticiaDetailPage.jsx`, la columna derecha lista otras noticias publicadas (excluyendo la actual, hasta 6) usando `newsService.getNews({})` — mismo componente visual (badge de fecha + título recortado a 2 líneas) que "Eventos recomendados"/"Mira también" en las otras dos páginas de detalle, pero enlazando a `/tendencias/:slug` de cada una.

### 1.3 Popup de Tendencias en la home — botón "Ver Más"

`NoticiaModal` (en `src/components/Events.jsx`) no cambió su comportamiento de apertura/cierre — solo se le agregó un `CtaLink` "Ver Más" al final del cuerpo, que navega a `/tendencias/${noticia.slug}` (solo se muestra si `noticia.slug` está presente). Para que el popup tenga el slug disponible, se agregó `slug: n.slug` al objeto que arma tanto `NoticiasPanel` (lista de la izquierda, en el inicio) como `TendenciasPage` (grilla de `/tendencias`) al abrir el modal.

### 1.4 CTA de la noticia destacada

En `NoticiasPanel` (`src/components/Events.jsx`), el botón "Ver publicación" de la columna derecha ("Publicación destacada") dejó de abrir `NoticiaModal` — ahora navega directo a `/tendencias/${featuredNews.slug}` con `useNavigate()` (el mismo hook que ya usaba el componente para "Ver todas las tendencias").

## Parte 2 — Ajustes de UX en el panel de administración

### 2.1 Eliminar "Servicios TIBOX" del menú lateral

Se quitó la entrada `/admin/contenidos/servicios` de `AdminSidebar.jsx`. **Decisión explícita, no solicitar reconfirmación pero documentada para que quede clara:** no se borró la ruta, la página (`ServiciosPage.jsx`) ni el servicio (`adminServicesService.js`, conectado a Supabase desde la Fase 6/7/8) — siguen existiendo y siguen siendo alcanzables por URL directa. Se investigó específicamente que ningún otro componente dependa de que ese ítem esté en el menú: `SECTION_TO_TYPE` en `AdminWidgets.jsx` solo mapea `videos`/`infographics`/`news` (Servicios nunca pasó por ese flujo genérico), y `AdminHeader.jsx` mantiene su propia entrada en `TITLES` para el título de la página si se visita por URL directa — no queda ningún enlace roto. Se optó por esta vía (reversible) en vez de eliminar el CRUD completo porque el bloque de Servicios en el portal público ya fue *ocultado* (no borrado, ver ajuste anterior "Portal: ocultar bloque de Servicios") y los datos siguen conectados a Supabase — si el bloque público se reactiva en el futuro, el admin no tiene que reconstruirse desde cero.

### 2.2 Renombrar "Configuración" y moverla dentro de "Contenidos"

**Nombre elegido: "Portada".** Coincide con el nombre que ya usa la ruta (`/admin/portada`) y el servicio (`adminPortadaService.js`) — no se inventó un nombre nuevo que aprender. El ítem se movió del grupo "Cuenta" al grupo "Contenidos" en `AdminSidebar.jsx` (queda al final, después de "Eventos"), y se actualizó el título correspondiente en `AdminHeader.jsx` (`TITLES['/admin/portada']`). El grupo "Cuenta" quedó solo con "Administradores" — se dejó así (no se fusionó con otro grupo) porque no se pidió explícitamente y sigue siendo una agrupación coherente ("cuenta/acceso" vs. "contenido del sitio").

**Braulio: confirma si "Portada" te parece bien, o si prefieres otro nombre (p.ej. "Carrusel", "Hero", "Slides").**

### 2.3 Listado de administradores

- **Migración nueva `supabase/migrations/20260812100000_list_admin_profiles_function.sql`**: función `list_admin_profiles()` (`security definer`, mismo patrón que `promote_to_admin()` de la Fase 5). Por qué una función y no un `SELECT` directo desde el cliente: `profiles` no tiene columna `email` (vive en `auth.users`, que PostgREST no expone) — la función une ambas tablas y revisa `is_admin()` explícitamente antes de devolver nada, para que solo un administrador autenticado pueda leer los correos de otros administradores.
- **`src/services/adminUsersService.js`**: nueva función `listAdmins()`, que llama `supabase.rpc('list_admin_profiles')` y mapea el resultado a `{ id, fullName, email, status }` (`status` traducido a "Activo"/"Bloqueado").
- **`src/admin/pages/UsuariosPage.jsx`**: se agregó un bloque `AdminsList` (tabla `nombre / correo / estado`, con badge de color por estado) debajo del formulario de invitación existente — de solo lectura por ahora, tal como pedía la tarea. No se duplicó ninguna función existente: se integró en la misma página/sección "Administradores" que ya existía.

### 2.4 Renombrar "Negocios" a "Mensajes"

En `AdminSidebar.jsx`, el grupo que agrupaba "Servicios TIBOX" + "Mensajes de contacto" + "Opiniones de clientes" bajo la etiqueta "Negocio" se dividió: "Servicios TIBOX" se quitó (ver 2.1) y el grupo se renombró a **"Mensajes"**, quedando solo con "Mensajes de contacto" y "Opiniones de clientes" — ambos ítems ya tenían esos nombres (`AdminHeader.jsx` no necesitó cambios ahí, sus títulos de página nunca decían "Negocio"). Cambio de etiqueta únicamente, sin tocar ninguna funcionalidad de `MensajesPage.jsx`/`OpinionesPage.jsx`.

## Archivos modificados

**Portal público:**
- `src/services/newsService.js` — `slug`/`day`/`month` en `mapNewsRow`, `slug`/`id` en `getFeaturedNews`, nueva `getNewsBySlug()`.
- `src/pages/NoticiaDetailPage.jsx` — nuevo.
- `src/routes/AppRouter.jsx` — nueva ruta `tendencias/:slug`.
- `src/components/Events.jsx` — CTA "Ver Más" en `NoticiaModal`; CTA "Ver publicación" de `NoticiasPanel` navega directo; `slug` agregado al abrir el modal desde la lista.
- `src/pages/TendenciasPage.jsx` — `slug` agregado al abrir el modal desde la grilla.

**Admin:**
- `src/admin/AdminSidebar.jsx` — reestructuración del `NAV` (quita Servicios TIBOX, mueve y renombra Portada, renombra Negocio→Mensajes).
- `src/admin/AdminHeader.jsx` — título de `/admin/portada` actualizado a "Portada".
- `src/admin/pages/UsuariosPage.jsx` — listado de administradores (`AdminsList`).
- `src/services/adminUsersService.js` — nueva `listAdmins()`.
- `supabase/migrations/20260812100000_list_admin_profiles_function.sql` — nuevo.

## Cómo probar cada punto manualmente

**1.1 / 1.2 — Página de detalle:**
1. Ir a `/tendencias`, clic en "Ver noticia" de cualquier tarjeta → se abre el popup de siempre.
2. En el popup, clic en "Ver Más" → navega a `/tendencias/<slug-real>` con el artículo completo, mismo layout que `/videoteca/:slug`/`/eventos/:slug`.
3. Confirmar que "Mira también" (columna derecha) muestra otras noticias, sin incluir la actual, y que cada una navega a su propia página.
4. Recargar la URL de detalle directamente (F5) — debe seguir funcionando (no depende de navegación interna).

**1.3 — Popup con "Ver Más":**
1. En el inicio, sección "Tendencias", clic en cualquier noticia de la lista izquierda → se abre el popup igual que siempre, ahora con el botón "Ver Más" al final.

**1.4 — CTA de noticia destacada:**
1. En el inicio, columna derecha "Publicación destacada", clic en "Ver publicación" → navega directo a la página de detalle de esa noticia (ya no abre popup).

**2.1 — Servicios TIBOX fuera del menú:**
1. Iniciar sesión como admin → confirmar que "Servicios TIBOX" ya no aparece en el sidebar.
2. Visitar `/admin/contenidos/servicios` por URL directa → debe seguir cargando sin error (ruta intencionalmente no eliminada, ver decisión arriba).

**2.2 — Portada dentro de Contenidos:**
1. En el sidebar, confirmar que "Portada" aparece dentro del grupo "Contenidos" (no en "Cuenta"), y que al hacer clic muestra el mismo contenido de hero_slides/carrusel de siempre.

**2.3 — Listado de administradores:**
1. **Requiere que Braulio ejecute primero la migración pendiente** (ver abajo).
2. Ir a "Administradores" → debajo del formulario de invitación debe aparecer una tabla "Administradores registrados" con nombre, correo y estado de cada admin.

**2.4 — Mensajes:**
1. En el sidebar, confirmar que el grupo antes llamado "Negocio" ahora dice "Mensajes", y que sigue conteniendo "Mensajes de contacto" y "Opiniones de clientes" funcionando igual que antes.

**Todos los puntos de admin también se verificaron sin sesión real** usando el patrón ya establecido en fases anteriores (rutas temporales `/dev-test-admin` y `/dev-test-usuarios` agregadas y revertidas antes de terminar, confirmado con `git status`/`git diff` limpio) — se confirmó que el sidebar renderiza la estructura correcta y que la página de administradores maneja con gracia la ausencia de sesión (estado de error, no un crash), ya que la función RPC exige `is_admin()` real.

**Mobile:** probado en viewport 375×812 — la página de detalle de noticias colapsa a una columna igual que Videoteca/Eventos.

## Pendiente de Braulio

1. **Ejecutar la migración `supabase/migrations/20260812100000_list_admin_profiles_function.sql`** en el SQL Editor de Supabase — sin esto, el listado de administradores (2.3) mostrará "No pudimos cargar el listado de administradores" (la función RPC no existe todavía en el proyecto real).
2. **Confirmar el nombre "Portada"** para la sección 2.2, o indicar uno distinto.

## Verificación técnica

- `npm run lint` — sin errores ni warnings nuevos.
- `npm run build` — build exitoso (el aviso de chunk >500kB es preexistente, no introducido por esta fase).
- Pruebas manuales en el navegador (desktop y mobile) descritas arriba, todas verificadas salvo el listado real de administradores (bloqueado por la migración pendiente).
