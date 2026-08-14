# Índice de documentación — TIBOX Connect

Documentación del proceso de migración y estabilización del prototipo TIBOX Connect.

## Fases

- [Fase 00 — Preparación y diagnóstico](phases/FASE-00-PREPARACION.md) — inventario del estado actual, riesgos y prerequisitos antes de tocar código.
- [Fase 01 — Migración a React + Vite](phases/FASE-01-MIGRACION-VITE.md) — conversión del prototipo CDN/Babel a una app Vite real, sin cambiar diseño ni comportamiento visual.
- [Fase 01B — Ajustes visuales y de texto (Paula)](phases/FASE-01B-AJUSTES-VISUALES-PAULA.md) — 8 ajustes de texto/UX pedidos por negocio sobre eventos, servicios, videoteca, infografías, noticias y contacto, sin tocar el modelo de datos ni conectar backend.
- [Fase 02 — Rutas, layouts y datos hardcodeados](phases/FASE-02-RUTAS-Y-DATOS.md) — rutas reales con react-router-dom, admin unificado en la misma app (mapeo completo de sus 10 secciones a las nuevas URLs), datos movidos a `src/data/seed/` detrás de `src/services/*`, estados de carga/vacío/error. Sin Supabase, sin login todavía.
- [Fase 03 — Conexión base a Supabase](phases/FASE-03-SUPABASE-SETUP.md) — `.env.local`/`.env.example`, cliente en `src/lib/supabase.js` con validación explícita de variables faltantes. Sin tablas, sin autenticación, sin conectar `src/services/*` todavía.
- [Fase 04 — Modelo de datos y Row Level Security](phases/FASE-04-MODELO-DATOS-RLS.md) — 9 tablas + RLS vía migraciones SQL versionadas en `supabase/migrations/`, función `is_admin()`, trigger de perfil sobre `auth.users`, seed de datos idempotente. Sin conectar `src/services/*`, sin login todavía.
- [Fase 05 — Autenticación real de administradores](phases/FASE-05-AUTENTICACION.md) — login/logout real (`supabase.auth`), protección de `/admin/*` vía `AdminRoute`, recuperación de contraseña, invitación de administradores adicionales (Edge Function `invite-admin`). Sin conectar el resto de `src/services/*` todavía.
- [Fase 06-07-08 — Contenido real (combinada y acotada)](phases/FASE-06-07-08-CONTENIDO-REAL.md) — por urgencia de negocio (evento de la primera semana de agosto 2026): lectura pública del portal conectada a Supabase, Storage para imágenes, y panel admin real para noticias, infografías, videos/webinars y eventos. Sin `resources` genéricos, galería de eventos, ni leads de infografías reales todavía.
- [Fase 09 — Página de artículo para Noticias/Tendencias y ajustes de UX en Admin](phases/FASE-09-NOTICIAS-DETALLE-Y-ADMIN.md) — página de detalle propia por noticia (`/tendencias/:slug`, mismo patrón que Videos/Eventos) con "Mira también" y CTAs conectados; en el admin: se quita "Servicios TIBOX" del menú, se renombra y reubica "Configuración" → "Portada" (dentro de Contenidos), se agrega listado de administradores registrados, y "Negocio" pasa a llamarse "Mensajes". Pendiente que Braulio ejecute la migración `list_admin_profiles()` y confirme el nombre "Portada".
- [Fase 09b — CTA "Ver Más" en Videos y altura del banner en páginas de artículo](phases/FASE-09B-VIDEOS-VER-MAS-Y-BANNER-DETALLE.md) — mismo patrón "Ver Más" de la Fase 9 replicado en el popup de Videos del inicio, con "Mira también" mostrando otros videos/webinars en su página de detalle; banner de cabecera de las 3 plantillas de detalle (Noticia/Video/Evento) sube de 260px a 380px (260px en mobile) vía una clase CSS compartida, para que fotos verticales/con personas de pie no queden recortadas.
- [Fase 09c — Menú "Contacto", regla de "destacado" en Noticias, y bugs de Portada](phases/FASE-09C-CONTACTO-DESTACADO-Y-BUGS-PORTADA.md) — causa real del CTA/flechas del hero que "no funcionaban": pointer capture del carrusel se comía el clic de cualquier botón/enlace dentro del hero; menú "Soporte"→"Contacto" con popup nuevo hacia tibox.cl; "Destacado" pasa a ser exclusivo de Noticias (UI) con unicidad garantizada por un trigger de base de datos (no solo en el cliente). Pendiente que Braulio ejecute la migración del trigger.
- [Fase 09d — Visibilidad de aceptación de invitación en "Administradores"](phases/FASE-09D-VISIBILIDAD-INVITACION-ADMIN.md) — se evaluó y descartó revertir ADR-005 (flujo de aprobación en dos pasos); en su lugar, `list_admin_profiles()` expone `auth.users.last_sign_in_at` y la tabla de Administradores muestra un badge "Aceptada"/"Invitación pendiente" separado del de Estado. Solo visibilidad — no cambia cuándo se otorga `role='admin'`. Pendiente que Braulio ejecute la migración nueva.
- [Fase 09e — Quitar popup redundante en /tendencias, y menú de navegación roto dentro de una página de detalle](phases/FASE-09E-FIXES-TENDENCIAS-Y-NAV-DETALLE.md) — el listado /tendencias navega directo al detalle en vez de abrir el popup del inicio (que no se tocó); el menú superior ("Noticias"/"Videos y Webinars"/"Eventos") no navegaba estando dentro de una página de detalle por un match de ruta demasiado amplio en `handleNavClick` combinado con un `window.scrollTo` que no aplicaba al contenedor real de scroll del layout.
- [Fase 09f — Reubicar cápsulas de categoría a la miniatura](phases/FASE-09F-REUBICAR-CAPSULAS-CATEGORIA.md) — en las 4 tarjetas de contenido que muestran categoría (`/videoteca`, carrusel de Videos del inicio, `/infografias` + su carrusel, `/tendencias`), la cápsula pasa del cuerpo (pegada al CTA) a la esquina superior derecha de la miniatura. `EventCard` no se tocó — los eventos no tienen categoría, solo modalidad.
- [Fase 09g — "Ver video" abre popup en /videoteca](phases/FASE-09G-VIDEOS-POPUP-EN-VIDEOTECA.md) — en `/videoteca`, un video real deja de navegar a `/videoteca/:slug` y abre `VideoModal` (el mismo popup reproductor del carrusel del inicio, ahora exportado desde `Media.jsx`) sobre el listado, sin botón "Ver Más". Los eventos del mismo listado no cambian: próximos siguen con `EventDetailModal`, realizados siguen navegando a su página.
- [Fase 09h — Campo "Video del evento" + bloque en la página de detalle](phases/FASE-09H-VIDEO-DEL-EVENTO.md) — columna nueva `events.video_url` (migración), campo opcional de link de YouTube en el formulario admin de eventos (con preview de miniatura), y bloque "Ver video del evento" en `/eventos/:slug` arriba de "Eventos recomendados" que abre el reproductor en un popup. **La migración debe ejecutarse antes del deploy**: mientras la columna no exista, falla el guardado de cualquier evento (mismo caso que `gallery`).

## Modelo de datos

- [DATA-MODEL.md](DATA-MODEL.md) — esquema completo de tablas, relaciones, RLS, funciones y Storage.

## Decisiones de arquitectura (ADR)

- [ADR-004 — Sin registro/login público de usuarios finales](decisions/ADR-004-SIN-REGISTRO-PUBLICO.md) — el portal será público sin cuenta; la autenticación se reserva solo para administradores, con invitación de administradores adicionales en una fase futura. Reemplaza la sección 4.2 del plan maestro para la Fase 5.
- [ADR-005 — Promoción a administrador en el momento de la invitación](decisions/ADR-005-PROMOCION-ADMIN-EN-INVITACION.md) — por qué un administrador invitado recibe `role='admin'` de inmediato, en vez de un segundo paso de aprobación tras aceptar la invitación.

## Otros documentos

- [README.md](../README.md) — estado actual del proyecto, cómo abrirlo, qué es real y qué es solo visual.
- [CHANGELOG.md](CHANGELOG.md) — eventos relevantes que no son parte de una fase específica (cambios de infraestructura, propiedad del repositorio, etc.).

## Convención

Cada fase vive en `docs/phases/FASE-NN-NOMBRE.md` y documenta: objetivo, hallazgos, comandos ejecutados, riesgos y qué queda pendiente para la fase siguiente. Este índice se actualiza a medida que se agregan fases nuevas.
