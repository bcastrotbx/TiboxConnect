# TIBOX Connect

Portal de conocimiento y panel de administración para TIBOX (compañía B2B de tecnología, Chile).

## Estado actual

**Esto es un prototipo visual de alta fidelidad. No tiene backend, no tiene build real y ninguna acción persiste datos.** Antes de asumir que algo "funciona", léase lo siguiente:

- **Sin build:** no hay `package.json`, `vite.config.*` ni `node_modules`. Las páginas son HTML estático que carga React, ReactDOM y Babel **desde CDN (unpkg)**, y transpila los archivos `.jsx` en el navegador en tiempo real (`<script type="text/babel" src="...">`). No hay bundling, minificación ni optimización del código propio.
- **Sin backend:** no existe ningún servidor, API ni base de datos conectada. Todo el contenido (videos, infografías, noticias, eventos, servicios, mensajes, opiniones) vive en arrays de JavaScript hardcodeados dentro de los `.jsx`.
- **Sin persistencia:** el panel de administración (`admin/index.html`) permite "crear", "editar", "duplicar" y "eliminar" contenido, pero todo ocurre en memoria (`React.useState`). Al recargar la página, todo vuelve al estado inicial.
- **Formularios simulados:** el formulario de contacto, el panel de opinión de clientes y la inscripción a eventos muestran una animación de "enviado con éxito", pero ningún dato sale del navegador — no hay `fetch`, no hay envío de correo, no hay guardado en ningún lado.
- **Usuarios de ejemplo:** el portal muestra una sesión ficticia ("Carlos Mora — Empresa Modelo S.A.") y el panel admin otra ("Alejandro Díaz"). No hay autenticación real.
- **Enlaces rotos conocidos:** varios botones del panel admin ("Volver al portal", "Ir al Portal") apuntan a `../Tibox Connect v2.html`, un archivo que no existe en este repositorio.

En resumen: es útil para validar diseño, contenido y flujo de UX con stakeholders, pero **no debe presentarse como una aplicación funcional** hasta que se complete la migración a un stack con build real (React + Vite) y, eventualmente, un backend.

Ver el detalle completo del diagnóstico en [docs/phases/FASE-00-PREPARACION.md](docs/phases/FASE-00-PREPARACION.md).

## Estructura

```
index.html                              # Portal (Tibox Connect v2)
admin/index.html                        # Panel de administración (mock)
connect-v2-*.jsx                        # Componentes React del portal, cargados vía Babel standalone
assets/                                  # Imágenes y logos en uso
_ds/tibox-design-system-.../             # Design system: tokens CSS y bundle de componentes
uploads/, screenshots/                   # Material de referencia, no conectado al código
```

## Documentación

Ver [docs/INDEX.md](docs/INDEX.md) para el índice completo de fases de trabajo.
