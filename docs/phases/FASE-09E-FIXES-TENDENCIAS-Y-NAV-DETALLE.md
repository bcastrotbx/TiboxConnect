# Fase 9e — Quitar popup redundante en /tendencias, y menú de navegación roto dentro de una página de detalle

Dos fixes independientes, provistos como diff ya redactado por Braulio (con el archivo completo de `TendenciasPage.jsx` y el bloque exacto a reemplazar en `Header.jsx`) — se aplicaron tal cual, sin cambios de criterio de mi parte.

## Fix 1 — Popup redundante en /tendencias

**Antes:** en `/tendencias` (listado completo), el clic en una tarjeta o en "Ver noticia" abría `NoticiaModal` (el mismo popup del inicio), que a su vez tenía un botón "Ver Más" para recién ahí llegar a `/tendencias/:slug`. Como `/tendencias` ya es un listado dedicado a noticias, el popup era un paso redundante — doble clic para leer una noticia completa.

**`src/pages/TendenciasPage.jsx`:**
- Se quita `import { NoticiaModal } from '../components/Events.jsx'` y el estado `openNews`.
- Se agrega `useNavigate` de `react-router-dom`.
- El `onOpen` de cada tarjeta pasa de abrir el modal a `() => navigate('/tendencias/' + n.slug)`.

**Lo que NO cambió:** `NoticiaModal` (`src/components/Events.jsx`) no se tocó — sigue siendo la vista rápida en popup de `NoticiasPanel` en el inicio (`HomePage.jsx`), con su botón "Ver Más" funcionando igual que en la Fase 9.

## Fix 2 — El menú superior no navegaba desde una página de detalle

**Antes:** estando en `/tendencias/:slug` (o `/videoteca/:slug`, `/eventos/:slug`), hacer clic en "Noticias" ("Videos y Webinars", "Eventos") en el menú superior no hacía nada visible.

**Causa real, en `src/components/Header.jsx`, `handleNavClick`:** la condición que decide "¿ya estoy en esta categoría?" usaba `location.pathname === categoryRoute || location.pathname.startsWith(categoryRoute + '/')` — el segundo término hacía match también con las páginas de detalle (`/tendencias/algo` empieza con `/tendencias/`), así que en vez de navegar al listado (`navigate(categoryRoute)`), ejecutaba `window.scrollTo({top:0})`. Eso además no producía ningún efecto visible porque en este layout el contenedor que realmente scrollea es `.portal-content` (`overflow-y: auto`) — `window`/`body` no scrollea (`#root` tiene `overflow: hidden`). El resultado neto: clic sin efecto.

**Fix:**
- Se quita el `|| location.pathname.startsWith(categoryRoute + '/')` — ahora solo el match exacto cuenta como "ya estoy en la categoría"; cualquier subruta (incluidas las páginas de detalle) cae al `navigate(categoryRoute)` final, que sí lleva al listado completo.
- Se cambia `window.scrollTo(...)` por `document.querySelector('.portal-content')?.scrollTo(...)` — corrige además el caso en que el usuario ya está parado en el listado (`/tendencias`) y hace clic de nuevo en "Noticias": antes no hacía nada, ahora sube al principio del listado.

No se tocó nada más de `Header.jsx` ni de `PortalLayout.jsx` — el scroll por sección dentro del inicio no cambia.

## Cómo se probó

1. `/tendencias` → clic en cualquier tarjeta o en "Ver noticia" → navega directo a `/tendencias/:slug`, sin popup. Confirmado en el navegador de desarrollo.
2. Desde `/`, clic en una noticia de la columna "Tendencias de la industria" → el popup (`NoticiaModal`) sigue apareciendo igual que antes, con su botón "Ver Más". Confirmado.
3. Entrar a `/tendencias/:slug` → clic en "Noticias" en el menú superior → navega a `/tendencias`. Confirmado.
4. Repetido desde `/eventos/:slug` (evento "IA y seguridad en la empresa") → clic en "Eventos" → navega a `/eventos`. Confirmado (mismo bug, mismo fix, ambas categorías comparten `handleNavClick`).
5. Sin errores de consola en ninguno de los casos anteriores.

## Verificación técnica

- `npm run lint` — sin errores ni warnings nuevos.
- `npm run build` — build exitoso (aviso de chunk >500kB preexistente, no introducido por este cambio).

## Archivos modificados

- `src/pages/TendenciasPage.jsx`
- `src/components/Header.jsx`
