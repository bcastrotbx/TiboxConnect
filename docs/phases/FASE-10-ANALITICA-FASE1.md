# Fase Analítica 1 — Base de tracking anónimo + vistas iniciales en el admin

## Objetivo

Primera entrega de la analítica de comportamiento del portal, a partir de un documento de análisis pasado por negocio ("TIBOX Connect — Analítica de comportamiento de usuarios en el portal"). Ese documento propone una arquitectura híbrida en 6 fases: (A) tracking propio sobre Supabase para métricas del portal + (D) Microsoft Clarity para heatmaps/grabaciones de sesión, descartando explícitamente el uso de IP como identificador por motivos legales (Ley 19.628, GDPR).

Alcance confirmado para esta entrega (decisión explícita: arrancar solo con la Fase 1, dejar las siguientes para cuando esta base esté probada en producción):

1. Tabla `analytics_events` + RLS con `is_admin()`.
2. `trackPageView` en el cliente.
3. Vista "Resumen general" (visitas totales, visitantes únicos) en `/admin/analitica`.
4. Vista "Secciones más visitadas" (gráfico de barras) en la misma página.

**Fuera de alcance en esta fase** (quedan para fases siguientes, condicionadas a que esta base funcione bien en producción): tracking de video, clics en CTA, abandono de formularios, vistas materializadas/cron, integración con Microsoft Clarity.

## Correcciones sobre el documento original

- La política RLS propuesta en el documento hacía referencia a una tabla `admin_profiles` que no existe en este proyecto. Se usa `public.is_admin()`, la misma función que ya usan todas las políticas RLS existentes (ver [DATA-MODEL.md](../DATA-MODEL.md)).
- El documento no especificaba una librería de gráficos. El proyecto no tenía ninguna instalada (`@supabase/supabase-js`, `lucide-react`, `react`, `react-dom`, `react-router-dom` eran las únicas dependencias). Se agregó `recharts` — primera dependencia de UI que se incorpora al proyecto.

## Qué se hizo

### Base de datos

- `supabase/migrations/20260815100000_analytics_events.sql`: tabla `analytics_events` (ver esquema completo en [DATA-MODEL.md](../DATA-MODEL.md)), RLS (`insert` público para `anon`+`authenticated`, `select` solo admin vía `is_admin()`), y **GRANT explícito en la misma migración** — este proyecto tiene "Automatically expose new tables" desactivado en Supabase, así que RLS sola no alcanza. Se incluye desde el principio para no repetir el 401 real que causó omitir el GRANT en `site_settings`/`services` (Fase 6/7/8, ver `20260731100400_grants_site_settings_services.sql`).
- El `check` de `event_type` incluye los tipos previstos por el documento completo (video, CTA, formularios) aunque solo `page_view` se usa en esta fase — evita un `ALTER` del constraint cuando lleguen las fases siguientes.

### Cliente

- `src/lib/analytics.js`: expone únicamente `trackPageView(pathname)`. Internamente maneja `anonymous_id` (UUID persistido en `localStorage`), `session_id` (UUID que expira a los 30 min de inactividad), tipo de dispositivo (mismos breakpoints que el CSS existente) y sección (mapeo de rutas públicas: `/`→home, `/videoteca*`, `/infografias*`, `/tendencias*`, `/eventos*`, resto→otro). El insert es *fire-and-forget*: cualquier error se captura en silencio y nunca interrumpe la experiencia del portal. Deliberadamente no se agregan stubs de `trackVideoPlay`/`trackClick`/etc. — quedan para cuando esas fases se aborden.
- `src/layouts/PortalLayout.jsx`: único punto de instrumentación — un efecto sobre `location.pathname` llama a `trackPageView` en cada navegación. Como `/admin/*` usa `AdminLayout.jsx` (un componente distinto), el tráfico de administradores queda excluido sin necesidad de ninguna bandera adicional.

### Panel admin

- `src/services/analyticsService.js`: `getPageViewStats({ days })` hace una sola consulta a `analytics_events` (sin vistas materializadas ni cron — con el volumen actual del portal, agregar en el cliente es suficiente) y calcula `totalViews`, `uniqueVisitors` y `topSections` sobre el mismo array, evitando dos consultas separadas para las dos vistas que necesitan los mismos datos.
- `src/admin/pages/AnaliticaPage.jsx`: nueva página en `/admin/analitica`. Selector de rango (7/30/90 días), dos tarjetas de estadística (visitas totales, visitantes únicos) y un gráfico de barras horizontal (`recharts`) con las secciones más visitadas. Usa los componentes compartidos `LoadingState`/`ErrorState`/`EmptyState` y la clase `adm-card` ya usada en el resto del admin.
- Entrada "Analítica" agregada al grupo "General" del sidebar (junto a Dashboard), ruta registrada en `AppRouter.jsx`, título agregado a `AdminHeader.jsx`.

## Verificación

- `npm run lint` y `npm run build` — sin errores. El build ahora pesa más por `recharts`: el gzip del bundle principal pasó de ~313 KB a ~425 KB. Vale la pena que quede registrado como el trade-off real de agregar la primera librería de gráficos al proyecto.
- Verificado en navegador contra la base de datos real de Supabase que la tabla `analytics_events` **todavía no existe en producción** — la migración está lista pero pendiente de que Braulio la ejecute.
- Con la tabla ausente, se confirmó que el insert de `trackPageView` falla en silencio (404 de red visible en consola, sin excepción no capturada) — el portal público sigue funcionando con normalidad.
- Se verificó el render de `/admin/analitica` mediante una ruta temporal de desarrollo (agregada y revertida en el mismo lote, confirmado con `git diff`): header, selector de rango y el estado de error (`EmptyState`/`ErrorState`) se ven correctamente. Faltará una verificación con datos reales una vez ejecutada la migración.

## Pendiente para Braulio

- Ejecutar la migración `20260815100000_analytics_events.sql` en el SQL Editor de Supabase antes de que la analítica empiece a registrar datos.
- Una vez con datos reales, confirmar visualmente que "Resumen general" y "Secciones más visitadas" muestran números coherentes.
- Evaluar la creación de la cuenta de Microsoft Clarity (paso independiente, mencionado en el documento de análisis) cuando se aborde esa fase.

## Qué queda para fases siguientes

Tracking de reproducción de video, clics en CTA, abandono de formularios, vistas materializadas/cron para agregación a mayor escala, e integración de Microsoft Clarity — todo condicionado a que esta base (tabla + tracking de páginas + vistas iniciales) esté validada en producción.
