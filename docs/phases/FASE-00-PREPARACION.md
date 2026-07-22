# Fase 00 — Preparación y respaldo

**Fecha:** 2026-07-22
**Rama de trabajo:** `feat/react-vite-migration` (creada desde `main`, commit `0d98b32`)
**Repositorio:** https://github.com/WARISNAKE421/TiboxConnect
**Autor del diagnóstico:** Sesión de Claude Code, a petición de Braulio

## Objetivo

Diagnosticar el estado real del repositorio TIBOX Connect antes de iniciar cualquier migración o cambio de comportamiento. Esta fase es de **inventario y documentación únicamente** — no se modificó ni se borró ningún archivo de la aplicación.

## Estado del repositorio al iniciar

- Rama activa original: `main`, sincronizada con `origin/main`, sin cambios pendientes (`git status` limpio).
- Historial completo: **un solo commit** — `0d98b32 "Add files via upload"` (Braulio, 2026-07-21). No hay historial incremental que analizar; el repo fue subido como snapshot único.
- Remote `origin` apunta a `https://github.com/WARISNAKE421/TiboxConnect.git` (confirmado con Braulio como el owner correcto antes de proceder).

## Comandos ejecutados

```bash
git status
git remote -v
git branch -a
git log --oneline -10
git switch -c feat/react-vite-migration
node --version
npm --version
git --version
find . -not -path '*/.git*' -type f
grep -rlIiE "supabase|sendgrid|api[_-]?key|secret|password|token" ...
```

## Versiones de entorno

| Herramienta | Resultado |
|---|---|
| `git --version` | 2.50.1 (Apple Git-155) |
| `node --version` | **no instalado** en este entorno (comando no encontrado) |
| `npm --version` | **no instalado** en este entorno (comando no encontrado) |

No se encontró `nvm`, ni binarios de Node en `/usr/local/bin` ni `/opt/homebrew/bin`. Esto es un bloqueo directo para la Fase 1: no se puede inicializar Vite, instalar dependencias ni correr un build hasta que Node/npm estén disponibles en la máquina de trabajo (probablemente sí lo están en la máquina real de Braulio; este diagnóstico se corrió en el entorno de la sesión actual).

## Inventario de estructura

```
TiboxConnect/
├── index.html                              # Entry point del portal (Tibox Connect v2)
├── Tibox Connect - Portal Standalone.html   # Wrapper "bundler" (ver hallazgo abajo)
├── admin/index.html                         # Panel de administración (todo mock)
├── connect-v2-sidebar.jsx                   # Sidebar del portal
├── connect-v2-header.jsx                    # Header del portal
├── connect-v2-top.jsx                       # Hero slider + categorías + panel de opinión
├── connect-v2-media.jsx                     # Videos/webinars, infografías
├── connect-v2-events.jsx                    # Noticias y eventos
├── connect-v2-bottom.jsx                    # Servicios + formulario de contacto
├── assets/                                  # Imágenes, logos, íconos (≈4.6 MB)
├── uploads/                                 # Capturas y material del cliente, no referenciado por el código (≈3.4 MB)
├── screenshots/                             # Capturas de QA/revisión, no referenciadas por el código (≈228 KB)
└── _ds/tibox-design-system-.../             # Design system: tokens CSS, bundle JS de componentes, readme (≈124 KB)
```

No existe `package.json`, `vite.config.*` ni `node_modules`. **No hay build real**: todo se sirve como HTML estático.

## Cómo carga React hoy

Confirmado: **CDN/unpkg, sin build**. En `index.html` y `admin/index.html`:

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" ...></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" ...></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" ...></script>
<script src="https://unpkg.com/lucide@latest"></script>
```

Los componentes `.jsx` se cargan como `<script type="text/babel" src="...">` y se transpilan **en el navegador en tiempo real** con Babel standalone. No hay JSX precompilado, no hay bundling, no hay tree-shaking ni minificación de la app (sí de las librerías de unpkg). Esto implica un costo de parseo/transpilación en cada carga de página y es la razón principal para migrar a Vite.

## Componentes `.jsx` existentes y qué hace cada uno

| Archivo | Responsabilidad |
|---|---|
| `connect-v2-sidebar.jsx` | Sidebar de navegación del portal (colapsable). Datos de navegación **hardcodeados** en un array `groups`. Usuario logueado hardcodeado: "Carlos Mora — Empresa Modelo S.A." |
| `connect-v2-header.jsx` | Header superior del portal. |
| `connect-v2-top.jsx` | Hero slider (`SLIDES`, hardcodeado), bloques de categorías (`CATS`, hardcodeado) y el panel de opinión de clientes (formulario simulado). |
| `connect-v2-media.jsx` | Sección de videos/webinars (`VIDEO_CATS`) e infografías (`INFO_CATS`, `LIB_CATS`), todo hardcodeado. |
| `connect-v2-events.jsx` | Noticias (`NEWS_CATS`) y eventos, con modal de inscripción a evento (formulario simulado). |
| `connect-v2-bottom.jsx` | Servicios TIBOX y formulario de contacto principal (simulado). |

## Datos hardcodeados detectados

- Todo el contenido editorial (videos, infografías, noticias, eventos, servicios) vive en arrays JS embebidos en los `.jsx`, no en ninguna fuente de datos externa.
- Usuario "logueado" del portal: **Carlos Mora / Empresa Modelo S.A.** (sidebar del portal, sin sesión real).
- Usuario admin: **Alejandro Díaz / alejandro.diaz@tibox.cl / +56 9 1234 5678** (`admin/index.html`, `ProfileView`), dato de ejemplo, no una cuenta real.
- Panel admin: mensajes de contacto (`MESSAGES`), opiniones (`OPINIONS`), notificaciones (`NOTIFICATIONS`) y contenido (`CONTENT_ITEMS`) — todos son arrays estáticos con nombres, correos y empresas ficticias (ej. "Fernanda Rojas — Constructora Andes").
- Estadísticas del dashboard admin (`StatRow`: "12,480 visitas", "86 inscripciones", etc.) son números fijos, no calculados.

## Enlaces rotos conocidos

Confirmado en `admin/index.html` (3 ocurrencias, líneas 185, 253 y 411):

```html
<a href="../Tibox Connect v2.html" ...>
```

Este archivo **no existe** en el repo. El portal real se llama `index.html` (o `Tibox Connect - Portal Standalone.html`). Todo enlace "Volver al portal" / "Ir al Portal" / "Abrir en el portal" dentro del panel admin está roto.

## `Tibox Connect - Portal Standalone.html`

No es una copia del portal: es un **wrapper de tipo "bundler/artifact-host"** — muestra un thumbnail SVG de carga y luego hace `fetch()` de scripts para reconstruir la página, con manejo especial de CSP (`connect-src 'self'`, no puede hacer `fetch()` de URLs `blob:`). Aparenta ser un artefacto generado por una herramienta externa de bundling/preview, no el portal de producción en sí. Requiere revisión aparte antes de decidir si se conserva, se reemplaza o se elimina en la migración.

## Carpeta `assets/` y contenido

40 archivos (~4.6 MB): logos de marca (`logo-tibox*.png`, `mark-cube.png`), badges de unidades de negocio (`logo-{analitica,ciberseguridad,consultoria-ti,infraestructura,soluciones-cloud,soluciones-inteligentes}.png`), imágenes de hero slider, imágenes de infografía/noticias, thumbnails de video y logos de partners (Azure, HPE, Microsoft, Veeam). Todo referenciado activamente desde los `.jsx` vía `window.__res(id, fallback)`.

Adicionalmente:
- `uploads/` (~3.4 MB): capturas de pantalla y material de contenido (hero slider, infografías) **subido por el cliente pero no referenciado en ningún `.html`/`.jsx`** — parece ser material de entrada para carga manual futura, no assets en uso.
- `screenshots/` (~228 KB): capturas de QA/revisión visual, tampoco referenciadas por el código — documentación de proceso, no assets de la app.

## Panel `admin/index.html`: qué es real y qué es solo visual

**Todo es visual/mock.** Es una SPA React montada en `AdminApp` con estado 100% en memoria (`React.useState`), sin `fetch`, sin `localStorage`, sin backend de ningún tipo:

- Las tablas de contenido (`ContentTable`), mensajes (`MessagesTable`) y opiniones (`OpinionsPanel`) parten de arrays hardcodeados y permiten "editar/duplicar/eliminar" **solo en memoria** — un refresh de página revierte todo.
- Los formularios de "Nuevo contenido" (`NewContentModal`) tienen botón "Guardar" que **solo cierra el modal** (`onClick={onClose}`), no persiste nada.
- Los campos de subida de archivo (`<input type="file">`) no tienen lógica de carga real detrás.
- `ProfileView` → "Guardar cambios" solo muestra un check verde temporal (`setTimeout`), no llama a ningún endpoint.
- El toggle de 2FA, notificaciones, etc. son estado de React puro, sin efecto real.

## Formularios existentes y si guardan/envían datos realmente

Se identificaron 3 formularios con `onSubmit` en el portal público, todos **simulados**:

| Formulario | Archivo | Comportamiento real |
|---|---|---|
| Contacto ("¿Tienes algún proyecto en mente?") | `connect-v2-bottom.jsx:260` | `handleSubmit` hace `e.preventDefault()` y tras 1200ms muestra estado "enviado" (`setSent(true)`) — **no hay `fetch`, no hay envío de correo ni backend**. |
| Opinión de cliente | `connect-v2-top.jsx:310` | Igual patrón: `preventDefault`, simula envío con `setTimeout`, resetea el formulario. Ningún dato se persiste. |
| Inscripción a evento | `connect-v2-events.jsx:12` | `submit = (e) => { e.preventDefault(); setDone(true); setTimeout(onClose, 1900); }` — mismo patrón simulado. |

Ningún formulario del prototipo envía datos a un servidor, servicio de correo (SendGrid u otro) o base de datos (Supabase u otra). Toda la sensación de "guardado exitoso" es una animación de UI con `setTimeout`.

## Búsqueda de credenciales expuestas

Se hizo búsqueda de archivos `.env*`, `*secret*`, `*credential*`, `*.pem`, `*.key` (por nombre) — **ninguno encontrado**. Se hizo además `grep` de contenido por patrones `supabase|sendgrid|api[_-]?key|secret|password|token` sobre todo el código: los únicos matches son falsos positivos (campos `<input type="password">` de UI visual, y "tokens" de diseño CSS del design system — `MIME_TOKEN` en el wrapper standalone). No se detectaron claves API, URLs de Supabase con keys, tokens Bearer, ni patrones `sk_live`/`sk_test`/JWT. **No hay nada que reportar como credencial expuesta.**

## Estado real vs. estado aparente del prototipo

| Aparenta | Realidad |
|---|---|
| Portal con sesión de usuario ("Carlos Mora") | Usuario hardcodeado, sin autenticación |
| Panel admin con CMS funcional | Estado en memoria únicamente; nada persiste tras recargar |
| Formularios que envían mensajes/inscripciones | Simulación con `setTimeout`, ningún dato sale del navegador |
| "Guardar cambios" en configuración/perfil | No-op visual, sin backend |
| Notificaciones, estadísticas del dashboard | Números y eventos fijos, no calculados ni en tiempo real |
| Build de producción optimizado | HTML estático + Babel-en-navegador vía CDN, sin bundler |

En síntesis: es un **prototipo de alta fidelidad visual**, útil para validar diseño y flujo de UX, pero sin ninguna funcionalidad de backend, persistencia o envío de datos real.

## Riesgos detectados

1. **Bloqueo de entorno:** Node/npm no están disponibles en esta sesión de diagnóstico — deben confirmarse/instalarse antes de iniciar Fase 1 (Vite requiere Node).
2. **Enlaces rotos** en `admin/index.html` hacia `../Tibox Connect v2.html` (archivo inexistente) — deben corregirse durante la migración, apuntando al archivo real del portal.
3. **`Tibox Connect - Portal Standalone.html`** tiene un origen/propósito ambiguo (wrapper de bundler/artifact-host) que debe aclararse antes de decidir su tratamiento en la migración — riesgo de conservar código muerto o de perder el archivo "canónico" si se elimina el equivocado.
4. **Ningún dato es real:** cualquier demo o presentación a stakeholders debe dejar explícito que mensajes, opiniones, estadísticas y usuarios son de ejemplo — riesgo de malentendido si se presenta como "ya funciona".
5. **Carpetas `uploads/` y `screenshots/` no están wireadas** al código — antes de migrar hay que decidir si ese contenido se integra (p. ej. imágenes reales del hero slider) o se deja fuera del build.
6. **Ausencia total de tests** — no hay forma automatizada de detectar regresiones durante la migración; la Fase 1 debería considerar al menos una verificación visual manual por sección.
7. **Un solo commit en el historial** ("Add files via upload") — no hay contexto de decisiones previas de diseño/código que rastrear vía git blame; toda la razón de ser de cada archivo depende de inspección manual (como la hecha en esta fase).

## Qué falta para iniciar la Fase 1 (migración a React + Vite)

- [ ] Confirmar que Node.js (LTS) y npm están disponibles en la máquina donde se hará la migración real (no lo están en este entorno de diagnóstico).
- [ ] Decidir el destino de `Tibox Connect - Portal Standalone.html` (¿se migra, se descarta, se documenta como legado?).
- [ ] Decidir si `uploads/` se integra como contenido real o se excluye del nuevo build.
- [ ] Definir estrategia de datos: ¿los arrays hardcodeados se mueven a un `data/*.json` local dentro del nuevo proyecto Vite, o se conecta a un backend real (fuera de alcance de esta fase)?
- [ ] Definir si los formularios simulados deben seguir siendo simulados en la Fase 1, o si se conecta un backend real (ej. Supabase/SendGrid) — **fuera del alcance de esta fase de preparación**.
- [ ] Corregir los enlaces rotos hacia `../Tibox Connect v2.html` como parte del trabajo de migración (no se tocó en esta fase, solo se documentó).
- [ ] Confirmación explícita de Braulio para avanzar a la Fase 1.
