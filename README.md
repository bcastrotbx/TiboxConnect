# TIBOX Connect

Portal de conocimiento y panel de administración para TIBOX (compañía B2B de tecnología, Chile).

## Estado actual

**Esto sigue siendo un prototipo visual de alta fidelidad, sin backend real y sin persistencia de datos.** Lo que cambió en la Fase 1 es *cómo* se construye y sirve el código (ahora con Vite + npm); lo que hace la aplicación no cambió. Antes de asumir que algo "funciona", léase lo siguiente:

- **Build real con Vite:** ya no se carga React/Babel desde CDN ni se transpila `.jsx` en el navegador. El proyecto usa `npm` + `vite` (`npm install`, `npm run dev`, `npm run build`). Ver [Instalación](#instalación) más abajo.
- **Sigue sin backend:** no existe ningún servidor, API ni base de datos conectada. Todo el contenido (videos, infografías, noticias, eventos, servicios, mensajes, opiniones) vive en arrays de JavaScript dentro de los componentes de `src/`. `@supabase/supabase-js` está **instalado pero no conectado** — es preparación para una fase futura, no una integración funcional.
- **Sigue sin persistencia:** el panel de administración (`/admin/`) permite "crear", "editar", "duplicar" y "eliminar" contenido, pero todo ocurre en memoria (`React.useState`). Al recargar la página, todo vuelve al estado inicial.
- **Formularios simulados:** el formulario de contacto, el panel de opinión de clientes y la inscripción a eventos muestran una animación de "enviado con éxito", pero ningún dato sale del navegador — no hay `fetch`, no hay envío de correo, no hay guardado en ningún lado.
- **Usuarios de ejemplo:** el portal muestra una sesión ficticia ("Carlos Mora — Empresa Modelo S.A.") y el panel admin otra ("Alejandro Díaz"). No hay autenticación real.
- **Sin rutas todavía:** `react-router-dom` está instalado pero no en uso. El portal (`/`) y el panel admin (`/admin/`) siguen siendo dos páginas HTML estáticas separadas (build multi-entrada de Vite), igual que antes — no una SPA con rutas de cliente.
- **Enlaces corregidos:** los botones del panel admin ("Volver al portal", "Ir al Portal") ahora apuntan correctamente a `/` (antes apuntaban a un archivo inexistente).

En resumen: es útil para validar diseño, contenido y flujo de UX con stakeholders, pero **no debe presentarse como una aplicación funcional** — sigue faltando backend, autenticación real y persistencia de datos.

Ver el detalle completo en [docs/phases/FASE-00-PREPARACION.md](docs/phases/FASE-00-PREPARACION.md) (diagnóstico) y [docs/phases/FASE-01-MIGRACION-VITE.md](docs/phases/FASE-01-MIGRACION-VITE.md) (migración a Vite).

## Requisitos

- Node.js **20.19+** o **22.12+**
- npm (incluido con Node)

## Instalación

```bash
npm install
```

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo de Vite con recarga en caliente |
| `npm run build` | Genera el build de producción en `dist/` (portal + admin) |
| `npm run lint` | Corre ESLint sobre todo el proyecto |
| `npm run preview` | Sirve el build de `dist/` localmente, para verificar antes de desplegar |

## Estructura

```
index.html                 # Entry HTML del portal (Vite)
admin/index.html           # Entry HTML del panel admin (Vite, segunda entrada del build)
src/
  main.jsx, App.jsx        # Entry y componente raíz del portal
  index.css                # Estilos globales del portal
  components/               # Sidebar, Header, Hero, OpinionPanel, Media, Events, Services
    shared/                # Icon (wrapper sobre lucide-react), CosmicBg, ModalShell
  admin/
    main.jsx, AdminApp.jsx # Entry y componente raíz del panel admin
    admin.css
public/
  assets/                  # Imágenes y logos en uso (servidos tal cual por Vite)
  _ds/tibox-design-system-.../  # Design system: tokens CSS y bundle compilado (fuera de alcance)
legacy/
  uploads/, screenshots/   # Material de referencia, no conectado al código
  tibox-connect-portal-standalone.html  # Wrapper de artifact-host, no es el portal real
```

## Documentación

Ver [docs/INDEX.md](docs/INDEX.md) para el índice completo de fases de trabajo.
