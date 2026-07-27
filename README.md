# TIBOX Connect

Portal de conocimiento y panel de administración para TIBOX (compañía B2B de tecnología, Chile).

## Estado actual

**Esto sigue siendo un prototipo visual de alta fidelidad, sin backend real y sin persistencia de datos.** Lo que cambió en la Fase 2 es que el portal y el admin ahora son **una sola aplicación con rutas reales** (antes eran dos páginas HTML separadas) y que los datos de ejemplo pasan por una capa de servicios en vez de estar sueltos en los componentes. Lo que la aplicación *hace* no cambió. Antes de asumir que algo "funciona", léase lo siguiente:

- **Build real con Vite, una sola entrada:** ya no hay dos páginas HTML (`index.html` + `admin/index.html`); todo se sirve desde `index.html` y `react-router-dom` decide qué se renderiza según la URL.
- **El admin vive en `/admin/...`, no en un archivo separado:** ver el mapa completo de rutas en [Rutas disponibles](#rutas-disponibles) más abajo.
- **`/admin/*` no pide inicio de sesión todavía.** Cualquiera que conozca la URL puede acceder — no hay guardrail de sesión en esta fase. El login de administradores llega en la Fase 5 (ver [ADR-004](docs/decisions/ADR-004-SIN-REGISTRO-PUBLICO.md)): el portal público **no tendrá registro de usuarios finales**, solo los administradores inician sesión.
- **Sigue sin backend:** no existe ningún servidor, API ni base de datos conectada. Todo el contenido (videos, infografías, noticias, eventos, servicios, mensajes, opiniones) vive en `src/data/seed/` y se sirve a través de `src/services/*`, que hoy solo simulan un delay de red. Desde la Fase 3 existe un cliente de Supabase inicializado en `src/lib/supabase.js`, pero **ningún servicio lo usa todavía** — no hay tablas creadas ni autenticación implementada.
- **Sigue sin persistencia:** el panel de administración permite "crear", "editar", "duplicar" y "eliminar" contenido, pero todo ocurre en memoria (`React.useState`). Al recargar la página, todo vuelve al estado inicial.
- **Formularios simulados:** contacto, opinión de cliente y el formulario de lead de infografías muestran un estado de "enviado con éxito", pero ningún dato sale del navegador — no hay `fetch` a un backend real.
- **Usuarios de ejemplo:** el portal muestra una sesión ficticia ("Carlos Mora — Empresa Modelo S.A.") y el admin otra ("Alejandro Díaz"). El botón "ADM"/"Cerrar sesión" del header público siempre es visible — pendiente de condicionarlo a sesión real en la Fase 5.

En resumen: es útil para validar diseño, contenido y flujo de UX con stakeholders, pero **no debe presentarse como una aplicación funcional** — sigue faltando backend, autenticación real y persistencia de datos.

Ver el detalle completo en [docs/INDEX.md](docs/INDEX.md) (índice de todas las fases).

## Requisitos

- Node.js **20.19+** o **22.12+**
- npm (incluido con Node)

## Instalación

```bash
npm install
```

Luego crea tu archivo de variables de entorno local (ver [Variables de entorno](#variables-de-entorno) abajo):

```bash
cp .env.example .env.local
```

Y completa los valores reales en `.env.local` (nunca se sube al repositorio).

## Variables de entorno

El proyecto necesita estas dos variables, definidas en un archivo `.env.local` en la raíz (no versionado — ver `.env.example` como plantilla):

| Variable | Qué es |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave pública ("publishable") del proyecto Supabase, segura para usar en el frontend |

Los valores reales los provee Braulio o quien administre el proyecto Supabase `tibox-connect` — no están documentados aquí ni en ningún archivo versionado. Si falta alguna al levantar la app, `src/lib/supabase.js` lanza un error explícito en consola indicando qué falta y cómo resolverlo.

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo de Vite con recarga en caliente |
| `npm run build` | Genera el build de producción en `dist/` (una sola entrada) |
| `npm run lint` | Corre ESLint sobre todo el proyecto |
| `npm run preview` | Sirve el build de `dist/` localmente, para verificar antes de desplegar |

## Rutas disponibles

| Ruta | Qué es |
|---|---|
| `/` | Portal público |
| `/admin` | Dashboard del admin |
| `/admin/contenidos` | Videos y webinars |
| `/admin/contenidos/infografias` | Infografías |
| `/admin/contenidos/noticias` | Noticias |
| `/admin/contenidos/servicios` | Catálogo de servicios TIBOX |
| `/admin/eventos` | Eventos |
| `/admin/portada` | Configuración de la portada del portal (sliders, categorías, contacto) |
| `/admin/mensajes` | Mensajes de contacto |
| `/admin/mensajes/opiniones` | Opiniones de clientes |
| `/admin/perfil` | Mi perfil (admin) |
| cualquier otra | Página 404 |

## Estructura

```
index.html                 # Única entrada HTML (Vite)
src/
  main.jsx                 # Monta AppRouter
  index.css                # Estilos globales
  routes/AppRouter.jsx      # Definición de todas las rutas
  layouts/                  # PortalLayout y AdminLayout (sidebar+header, <Outlet/>)
  pages/                    # HomePage (portal) y NotFound (404)
  components/               # Sidebar, Header, Hero, OpinionPanel, Media, Events, Services
    shared/                # Icon, CosmicBg, ModalShell, AsyncState (loading/empty/error)
  admin/
    AdminSidebar.jsx, AdminHeader.jsx
    AdminWidgets.jsx, PortadaWidgets.jsx   # UI compartida del admin
    pages/                 # Una página por ruta de /admin/*
  data/seed/                 # Datos de ejemplo (eventos, contenido, noticias, portada, servicios, admin)
  services/                  # Una función por caso de uso, sobre los datos de seed
  hooks/useAsyncData.js       # Patrón loading/success/error para los servicios
  context/DesignSystemContext.jsx  # Carga perezosa del bundle del design system (solo en /admin/*)
  lib/supabase.js             # Cliente de Supabase inicializado (sin usar todavía, Fase 3)
public/
  assets/                  # Imágenes y logos en uso (servidos tal cual por Vite)
  _ds/tibox-design-system-.../  # Design system: tokens CSS y bundle compilado (fuera de alcance)
legacy/
  uploads/, screenshots/   # Material de referencia, no conectado al código
  tibox-connect-portal-standalone.html  # Wrapper de artifact-host, no es el portal real
```

## Documentación

Ver [docs/INDEX.md](docs/INDEX.md) para el índice completo de fases de trabajo y decisiones de arquitectura.
