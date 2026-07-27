# TIBOX Connect

Portal de conocimiento y panel de administración para TIBOX (compañía B2B de tecnología, Chile).

## Estado actual

**Esto sigue siendo un prototipo visual de alta fidelidad, sin persistencia de datos de contenido.** Lo que cambió en la Fase 5 es que **la autenticación de administradores ya es real**: login/logout con Supabase Auth, `/admin/*` protegido por sesión real, invitación de administradores adicionales. Lo que sigue sin cambiar: el contenido del portal (videos, infografías, noticias, eventos) sigue viniendo de datos de ejemplo, no de la base de datos. Antes de asumir que algo "funciona", léase lo siguiente:

- **Build real con Vite, una sola entrada:** todo se sirve desde `index.html` y `react-router-dom` decide qué se renderiza según la URL.
- **El admin vive en `/admin/...`** — ver el mapa completo de rutas en [Rutas disponibles](#rutas-disponibles) más abajo.
- **`/admin/*` ya exige sesión real de administrador (Fase 5).** Sin sesión, o con una cuenta que no sea admin activo, se redirige a `/acceso-no-autorizado`. Login en `/login`, recuperación de contraseña desde ahí mismo, definición de nueva contraseña en `/actualizar-contrasena`. Sigue sin haber registro público de usuarios finales (ver [ADR-004](docs/decisions/ADR-004-SIN-REGISTRO-PUBLICO.md)) — el portal público no requiere cuenta para nada; solo los administradores inician sesión, y solo se crean por invitación (`/admin/usuarios`, ver [ADR-005](docs/decisions/ADR-005-PROMOCION-ADMIN-EN-INVITACION.md)).
- **El contenido del portal sigue sin backend conectado:** todo el contenido (videos, infografías, noticias, eventos, servicios, mensajes, opiniones) vive en `src/data/seed/` y se sirve a través de `src/services/*`, que hoy solo simulan un delay de red. El esquema completo de tablas y políticas de seguridad (RLS) ya existe en Supabase desde la Fase 4 (ver [docs/DATA-MODEL.md](docs/DATA-MODEL.md)) — pero **estos servicios todavía no lo usan** (esa conexión es la Fase 6).
- **Sigue sin persistencia de contenido:** el panel de administración permite "crear", "editar", "duplicar" y "eliminar" contenido, pero todo ocurre en memoria (`React.useState`). Al recargar la página, todo vuelve al estado inicial. (La sesión de administrador sí persiste de verdad — eso es Supabase Auth, no el estado en memoria del contenido.)
- **Formularios simulados:** contacto, opinión de cliente y el formulario de lead de infografías muestran un estado de "enviado con éxito", pero ningún dato sale del navegador — no hay `fetch` a un backend real.
- **Sin SMTP propio todavía:** los correos de invitación de administrador y recuperación de contraseña usan el servicio de correo por defecto de Supabase (sin dominio propio configurado) — pueden demorar o caer en spam.

En resumen: la autenticación de administradores ya es real y funcional, pero el contenido del portal sigue siendo un prototipo visual — **no debe presentarse como una aplicación funcional de punta a punta** todavía.

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
| `/login` | Login de administrador (público, sin registro) |
| `/actualizar-contrasena` | Definir nueva contraseña tras el enlace de recuperación (público) |
| `/acceso-no-autorizado` | Página mostrada al intentar `/admin/*` sin sesión de admin activa (público) |
| `/admin` | Dashboard del admin (requiere sesión de admin activa) |
| `/admin/contenidos` | Videos y webinars |
| `/admin/contenidos/infografias` | Infografías |
| `/admin/contenidos/noticias` | Noticias |
| `/admin/contenidos/servicios` | Catálogo de servicios TIBOX |
| `/admin/eventos` | Eventos |
| `/admin/portada` | Configuración de la portada del portal (sliders, categorías, contacto) |
| `/admin/mensajes` | Mensajes de contacto |
| `/admin/mensajes/opiniones` | Opiniones de clientes |
| `/admin/perfil` | Mi perfil (admin) |
| `/admin/usuarios` | Agregar administradores adicionales (invitación) |
| cualquier otra | Página 404 |

Todas las rutas `/admin/*` (excepto las de login/recuperación, que son públicas) están protegidas por `AdminRoute` — ver [Fase 05](docs/phases/FASE-05-AUTENTICACION.md).

## Estructura

```
index.html                 # Única entrada HTML (Vite)
src/
  main.jsx                 # Monta AppRouter dentro de AuthProvider
  index.css                # Estilos globales
  routes/
    AppRouter.jsx           # Definición de todas las rutas
    AdminRoute.jsx           # Guard de sesión para /admin/* (Fase 5)
  layouts/                  # PortalLayout y AdminLayout (sidebar+header, <Outlet/>)
  pages/                    # HomePage, NotFound, LoginPage, UpdatePasswordPage, Unauthorized
  components/               # Sidebar, Header, Hero, OpinionPanel, Media, Events, Services
    shared/                # Icon, CosmicBg, ModalShell, AsyncState (loading/empty/error)
  admin/
    AdminSidebar.jsx, AdminHeader.jsx
    AdminWidgets.jsx, PortadaWidgets.jsx   # UI compartida del admin
    pages/                 # Una página por ruta de /admin/* (incluye UsuariosPage.jsx, Fase 5)
  data/seed/                 # Datos de ejemplo (eventos, contenido, noticias, portada, servicios, admin)
  services/                  # Una función por caso de uso, sobre los datos de seed
                              # (adminUsersService.js es la excepción: ya conectado a Supabase, Fase 5)
  hooks/useAsyncData.js       # Patrón loading/success/error para los servicios
  context/
    DesignSystemContext.jsx  # Carga perezosa del bundle del design system (solo en /admin/*)
    AuthContext.jsx          # Sesión real de Supabase Auth (Fase 5) — user/profile/isAdmin/signIn/signOut
  lib/supabase.js             # Cliente de Supabase inicializado
supabase/
  migrations/                # Esquema de tablas + RLS (Fase 4) y funciones de auth (Fase 5)
  seed.sql                   # Datos de ejemplo idempotentes (Fase 4)
  admin-bootstrap.example.sql # Bloque manual para crear el primer administrador (Fase 4)
  functions/invite-admin/     # Edge Function: invitar administradores adicionales (Fase 5)
public/
  assets/                  # Imágenes y logos en uso (servidos tal cual por Vite)
  _ds/tibox-design-system-.../  # Design system: tokens CSS y bundle compilado (fuera de alcance)
legacy/
  uploads/, screenshots/   # Material de referencia, no conectado al código
  tibox-connect-portal-standalone.html  # Wrapper de artifact-host, no es el portal real
```

## Documentación

Ver [docs/INDEX.md](docs/INDEX.md) para el índice completo de fases de trabajo y decisiones de arquitectura.
