# Fase 02 — Rutas, layouts y datos hardcodeados

**Estado:** Completa
**Fecha:** 2026-07-24
**Rama de trabajo:** `feat/react-vite-migration` (misma de las fases anteriores)
**Repositorio:** https://github.com/WARISNAKE421/TiboxConnect

## Objetivo

Ordenar rutas, layouts y datos hardcodeados del portal y el panel admin, usando `react-router-dom` (instalado desde la Fase 1) para unificar el admin dentro de la misma aplicación React — sin conectar Supabase, sin autenticación real y sin cambiar el diseño visual.

## Alcance realizado

### 1. Rutas reales (`src/routes/AppRouter.jsx`)

```
/                              → portal (PortalLayout > HomePage)
/admin                         → dashboard
/admin/contenidos              → videos (índice)
/admin/contenidos/infografias  → infografías
/admin/contenidos/noticias     → noticias
/admin/contenidos/servicios    → servicios TIBOX
/admin/eventos                 → eventos
/admin/portada                 → configuración de portada (sliders/categorías/contacto)
/admin/mensajes                → mensajes de contacto (índice)
/admin/mensajes/opiniones      → opiniones de clientes
/admin/perfil                  → mi perfil
*                               → 404 (src/pages/NotFound.jsx)
```

**Deliberadamente NO implementadas:** `/login`, `/registro`, `/recuperar-contrasena`, `/actualizar-contrasena`, ni un `/perfil` público de usuario final. El sistema de autenticación se rediseñó — ver [ADR-004](../decisions/ADR-004-SIN-REGISTRO-PUBLICO.md): el portal completo será público sin registro, solo los administradores inician sesión. `/admin/*` **no pide login todavía**; eso llega en la Fase 5.

### 2. Mapeo de las 10 secciones del admin de la Fase 1 a las rutas pedidas

La Fase 1 dejó el admin con 10 "secciones" controladas por un `useState` local (`dashboard`, `videos`, `infographics`, `news`, `events`, `services`, `messages`, `feedback`, `settings`, `profile`). La lista de rutas pedida para esta fase tiene solo 4 rutas de negocio bajo `/admin` (`contenidos`, `eventos`, `portada`, `mensajes`) más el índice `/admin`. Decisión tomada para no perder ninguna de las 10 secciones ni inventar una navegación nueva:

| Sección Fase 1 | Ruta Fase 2 | Nota |
|---|---|---|
| `dashboard` | `/admin` | igual |
| `videos` | `/admin/contenidos` (índice) | — |
| `infographics` | `/admin/contenidos/infografias` | sub-ruta agregada |
| `news` | `/admin/contenidos/noticias` | sub-ruta agregada |
| `events` | `/admin/eventos` | igual |
| `services` | `/admin/contenidos/servicios` | **agrupado bajo `/admin/contenidos`** — no tenía ruta propia en la lista pedida; es contenido de negocio, más cercano a "Contenidos" que a cualquier otra categoría |
| `messages` | `/admin/mensajes` (índice) | — |
| `feedback` | `/admin/mensajes/opiniones` | **agrupado bajo `/admin/mensajes`** — no tenía ruta propia; opiniones y mensajes son ambos "comunicación entrante de clientes" |
| `settings` | `/admin/portada` | renombrado: la sección edita literalmente contenido de la portada del portal (hero, categorías, encabezado de contacto) |
| `profile` | `/admin/perfil` | **ruta agregada** — antes solo alcanzable desde el botón "Mi Perfil" del header, nunca estuvo en el sidebar; se le dio una URL real para que sea "pegable" |

Ninguna de las adiciones (`/admin/contenidos/servicios`, `/admin/mensajes/opiniones`, `/admin/perfil`, y las sub-rutas de `/admin/contenidos`) inventa una interfaz nueva: el sidebar del admin sigue teniendo exactamente los mismos 10 ítems, mismos íconos, mismos textos, misma agrupación visual (General/Contenidos/Negocio/Cuenta) que en la Fase 1 — solo cambió que cada ítem ahora navega a una URL real en vez de cambiar un estado local.

### 3. Layouts (`src/layouts/`)

- `PortalLayout.jsx`: sidebar + header + wrapper de scroll del portal, antes fijos en `src/App.jsx` (eliminado). Renderiza `<Outlet/>` para la única página del portal (`src/pages/HomePage.jsx`).
- `AdminLayout.jsx`: sidebar + header del admin, antes fijos en `src/admin/AdminApp.jsx` (eliminado). Envuelve todo en `DesignSystemProvider` (ver punto 6) y renderiza `<Outlet/>` para las páginas de `src/admin/pages/`.

### 4. Datos hardcodeados → `src/data/seed/`

Se extrajeron todos los arrays/objetos hardcodeados que antes vivían dentro de los componentes:

| Archivo | Contenido |
|---|---|
| `eventsSeed.js` | eventos próximos y realizados, `MODALIDAD`, `PARTNERS` |
| `contentSeed.js` | videos, categorías de video, infografías, categorías de infografía, `CHANNELS` |
| `newsSeed.js` | noticias, categorías, noticia destacada |
| `homeSeed.js` | slides del hero, bloques de categoría |
| `servicesSeed.js` | catálogo de servicios TIBOX, oficinas (mapa de contacto) |
| `adminSeed.js` | estadísticas del dashboard, contenido por sección, notificaciones, mensajes, opiniones, config. de servicios/portada del admin |

### 5. Capa de servicios (`src/services/`)

Una función por caso de uso (`eventService.getUpcomingEvents()`, `contentService.getVideos({category})`, `formService.submitContactForm(data)`, etc.), todas leyendo hoy de `src/data/seed/` pero devolviendo `Promise` con un delay simulado (`simulateDelay.js`, 350ms–1200ms según el caso). **Los componentes visuales ya no importan los datos de seed directamente** — todos pasan por el servicio correspondiente. La firma de cada función está pensada para que en la Fase 6 solo cambie la implementación interna (leer/escribir contra Supabase), no quién las llama.

### 6. `window.React` / `_ds_bundle.js` reubicado (`src/context/DesignSystemContext.jsx`)

El fix de la Fase 1 (exponer `window.React` antes de que cargue `_ds_bundle.js`) vivía en `src/admin/main.jsx`, que se ejecutaba solo en el entry point del admin y garantizaba el orden vía `<script>` síncrono en `admin/index.html` **antes** del módulo de React. Al unificar todo en un solo entry, ese script tag ya no existe y el módulo del admin puede evaluarse antes de que el bundle cargue. Se resolvió con:
- `DesignSystemProvider` (envuelve `AdminLayout`): expone `window.React` e inyecta el `<script>` de `_ds_bundle.js` de forma perezosa, solo la primera vez que se visita una ruta `/admin/*` — el portal público nunca paga ese costo.
- `useDesignSystem()`: hook que expone `Badge` reactivamente (antes era `const { Badge } = window.TIBOXDesignSystem_6dc0b3 || {}` evaluado una sola vez a nivel de módulo, lo que habría capturado `undefined` para siempre si el script no había cargado todavía). Ahora cada componente que usa `Badge` (`ContentTable`, `MessagesTable`, `ContentViewModal`) lo consume vía el hook y se re-renderiza cuando el bundle termina de cargar.

### 7. Estados de carga/vacío/error (`src/components/shared/AsyncState.jsx` + `src/hooks/useAsyncData.js`)

`useAsyncData(fetcher, deps)` estandariza el patrón `loading/success/error` sobre cualquier llamada a un servicio. Se aplicó con la UI completa (`LoadingState`/`EmptyState`/`ErrorState`, con variante `tone="dark"` para paneles sobre fondo navy) en las secciones explícitamente pedidas — videos, infografías, noticias, eventos (próximos y realizados) del portal, y las tablas del admin (contenido, mensajes, opiniones, sliders/categorías/campos de portada, servicios). En piezas más pequeñas y no listadas explícitamente (hero slider, bloques de categoría, campana de notificaciones) se usa el mismo hook pero con un tratamiento de carga más liviano (no se renderiza nada hasta que los datos llegan) para no introducir una interfaz nueva no pedida.

### 8. Segunda entrada de Vite eliminada

`vite.config.js` pasa de `rollupOptions.input: { main, admin }` a una sola entrada (`index.html`). Se eliminaron `admin/index.html`, `src/admin/main.jsx` y `src/admin/AdminApp.jsx` (reemplazado por `src/layouts/AdminLayout.jsx` + `src/admin/pages/*` + `src/admin/AdminWidgets.jsx`/`AdminSidebar.jsx`/`AdminHeader.jsx`/`PortadaWidgets.jsx`).

### 9. Bug encontrado y corregido durante la verificación

El botón "ADM" del header del portal (`src/components/Header.jsx`) seguía apuntando a `href="/admin/index.html"` — una ruta física que dejó de existir al eliminar la segunda entrada de Vite. Sin el fix, ese enlace habría caído en la ruta `*` (404) en vez de abrir el admin. Se corrigió a `<Link to="/admin">` de `react-router-dom` (navegación cliente, sin recarga completa).

### 10. Nota pendiente agregada explícitamente

Se agrega aquí, según lo pedido: **el botón "ADM"/"Cerrar sesión" en el header público debe ocultarse o mostrarse condicionalmente según sesión real — pendiente para la Fase 5.** Hoy ambos son visibles siempre porque no existe el concepto de sesión real (ver ADR-004).

## Archivos modificados/creados (resumen)

```
src/routes/AppRouter.jsx                              (nuevo)
src/layouts/{PortalLayout,AdminLayout}.jsx             (nuevos)
src/pages/{HomePage,NotFound}.jsx                      (nuevos)
src/admin/{AdminSidebar,AdminHeader,AdminWidgets,
           PortadaWidgets}.jsx                         (nuevos, ex AdminApp.jsx)
src/admin/pages/*.jsx                                  (nuevos, 8 páginas)
src/data/seed/*.js                                     (nuevos, 6 archivos)
src/services/*.js                                      (nuevos, 8 archivos)
src/hooks/useAsyncData.js                              (nuevo)
src/context/DesignSystemContext.jsx                    (nuevo)
src/components/shared/AsyncState.jsx                   (nuevo)
src/components/{Hero,Media,Events,Services,
                 OpinionPanel,Header}.jsx               (reescritos: servicios + async states)
src/index.css                                          (nuevo keyframe tbxSpin)
src/main.jsx                                           (monta AppRouter en vez de App)
vite.config.js                                         (una sola entrada)
eslint.config.js                                       (argsIgnorePattern '^_')
```

Eliminados: `admin/index.html`, `src/App.jsx`, `src/admin/main.jsx`, `src/admin/AdminApp.jsx`.

## Comandos ejecutados

```bash
npm run lint
npm run build
npm run preview -- --port 4176   # primera verificación (encontró el bug del punto 9)
npm run build                    # rebuild tras el fix
npm run preview -- --port 4177   # verificación final
```

## Pruebas y resultados (salida real)

### `npm run lint`
```
src/admin/AdminWidgets.jsx
  65:28  warning  'ix' is defined but never used. Allowed unused args must match /^_/u

✖ 1 problem (0 errors, 1 warning)
```
Único warning restante: variable `ix` no usada en `RowMenu`, heredada tal cual desde la Fase 1 (ya documentada como código muerto preexistente). 0 errores.

### `npm run build`
```
vite v6.4.3 building for production...
✓ 1626 modules transformed.
dist/index.html                     1.12 kB │ gzip:   0.42 kB
dist/assets/index-*.css             6.16 kB │ gzip:   1.70 kB
dist/assets/index-*.js          1,187.47 kB │ gzip: 245.54 kB
(!) Some chunks are larger than 500 kB after minification.
✓ built in 1.29s
```
**Advertencia real, no oculta:** al unificar portal + admin en una sola entrada sin code-splitting por ruta, el bundle único creció a 1.19 MB (245 KB gzip) — antes eran dos bundles separados (`main-*.js` 128 KB + `admin-*.js` 56 KB) que un usuario del portal nunca descargaba si no visitaba `/admin`. Ahora todo el código del admin viaja siempre, incluso para quien solo visita el portal. Ver "Problemas conocidos".

### Verificación en navegador — todas las rutas probadas con URL pegada + recarga

Servidor en `http://localhost:4177/`. Se navegó directamente (no clic interno) a cada una de las 11 rutas y se confirmó render correcto + 0 errores de consola en cada una:

`/`, `/admin`, `/admin/contenidos`, `/admin/contenidos/infografias`, `/admin/contenidos/noticias`, `/admin/contenidos/servicios`, `/admin/eventos`, `/admin/portada`, `/admin/mensajes`, `/admin/mensajes/opiniones`, `/admin/perfil`, y una ruta inexistente (`/algo-que-no-existe`) → 404 con diseño acorde a la marca.

Además se verificó interactivamente: navegación cliente "/" → "/admin" vía el botón ADM (sin recarga completa), apertura del menú de acciones de una fila y su modal "Editar" (con categorías cargadas vía `adminService.getContentTypeCategories()`), y que `vite preview` sirve correctamente el fallback de SPA para rutas anidadas al pegarlas directamente (confirmando que no se necesitó configuración adicional de servidor para esta fase).

## Decisiones tomadas

1. **Admin unificado en la misma app (no como sub-aplicación aparte):** se decidió porque la instrucción de esta fase lo pedía explícitamente, para que la Fase 5 pueda proteger `/admin/*` con una sesión real usando un layout guard estándar de React Router, algo que no era posible limpiamente con dos entradas de Vite separadas.
2. **Mapeo 10→5 rutas del admin:** ver tabla completa en el punto 2. Se priorizó no perder ninguna funcionalidad ni rediseñar la navegación visual, aceptando 3 adiciones necesarias (`/admin/contenidos/servicios`, `/admin/mensajes/opiniones`, `/admin/perfil`) sobre la lista literal de 4 rutas pedida.
3. **`window.React`/`_ds_bundle.js` con carga perezosa por ruta:** en vez de cargarlo siempre (como en la Fase 1), solo se carga al visitar `/admin/*`, evitando que el portal público pague el costo de un bundle que no usa.
4. **`Badge` vía hook reactivo en vez de constante de módulo:** necesario porque la carga perezosa introduce una ventana de tiempo real en la que el bundle aún no está listo; con la constante de módulo de la Fase 1, esa ventana habría dejado `Badge` en `undefined` para siempre.
5. **Filtrado de texto de la videoteca completa sigue siendo client-side:** se decidió NO re-consultar el servicio en cada tecla del buscador (que habría agregado el delay simulado a cada pulsación) — se carga el set completo una vez vía el servicio y se filtra en memoria, igual que en la Fase 1. Los filtros por categoría (botones, no texto) sí re-consultan el servicio, ya que es una interacción deliberada, no continua.
6. **Sin code-splitting por ruta (`React.lazy`) en esta fase:** se prefirió mantener la implementación simple; el bundle único es más grande que en la Fase 1 (ver advertencia de build). Queda como mejora sugerida, no bloqueante.
7. **Datos de config de admin (`MODALIDAD`, `PARTNERS`, categorías) se cargan a nivel de panel y se pasan como props a las tarjetas/modales hijos**, en vez de que cada tarjeta individual llame al servicio — evita decenas de llamadas duplicadas por el mismo dato estático dentro de una misma lista.

## Problemas conocidos

- **Bundle único de 1.19 MB (245 KB gzip)** — el portal público ahora descarga también el código del admin. Mitigación sugerida para una fase futura: `React.lazy()` en las rutas `/admin/*` de `AppRouter.jsx` para que Vite genere un chunk separado, cargado solo al navegar al admin.
- **El chunk de íconos (924 KB) sigue siendo el mismo problema heredado de la Fase 1** (wrapper `Icon` con resolución dinámica de `lucide-react`), ahora parte del bundle único.
- **`/admin/*` no tiene ningún guardrail de sesión** — cualquiera que conozca la URL puede acceder. Es el comportamiento esperado de esta fase (login llega en la Fase 5), pero se documenta explícitamente para que no se interprete como funcional.
- **El botón "ADM"/"Cerrar sesión" del header público siempre es visible** — pendiente de condicionar a sesión real (ver punto 10 de "Alcance realizado").
- **1 warning de ESLint preexistente** (`ix` sin usar en `RowMenu`), heredado sin cambios desde la Fase 1.

## Pendiente para la Fase 3 (conexión a Supabase)

- Conectar `@supabase/supabase-js` (instalado desde la Fase 1, sin usar) reemplazando la implementación interna de `src/services/*` — las firmas ya están listas, no debería requerir cambios en los componentes que las llaman.
- Reemplazar `formService.js` (contacto, opinión, lead de infografías) por envíos reales a Supabase.
- Decidir si el estado local de las tablas del admin (duplicar/eliminar filas) pasa a mutaciones reales contra la base de datos.
- Guardar los leads de infografías en un backend real y mostrarlos en el panel admin (pendiente desde la Fase 01B).
- Campo "Enlace de inscripción" editable desde el admin por evento (pendiente desde la Fase 01B).

## Pendiente general (no exclusivo de la Fase 3)

- Login de administradores y protección de `/admin/*` (Fase 5, ver ADR-004).
- Ocultar/mostrar condicionalmente "ADM"/"Cerrar sesión" en el header público según sesión real (Fase 5).
- Invitar administradores adicionales (Fase 5).
- Evaluar `React.lazy()` para separar el bundle del admin del bundle del portal.
- Evaluar reemplazar el wrapper dinámico de `Icon` por imports explícitos (pendiente desde la Fase 1).

## Próxima fase recomendada

Fase 3 — conexión a Supabase, reemplazando la implementación interna de `src/services/*` sin tocar los componentes que los consumen. Requiere confirmación explícita de Braulio antes de iniciar.
