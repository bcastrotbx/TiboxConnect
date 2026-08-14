-- Fase Analítica 1 (ver docs/phases/FASE-10-ANALITICA-FASE1.md): tabla de
-- eventos de comportamiento anónimo del portal público (page views por
-- ahora; video/CTA/formularios quedan para fases siguientes).
--
-- No se rastrea por IP como identificador — ver la sección "Por qué no usar
-- IP" del documento de análisis. La identificación es por `anonymous_id`
-- (UUID generado y persistido en localStorage del navegador, sin vínculo a
-- datos personales) y `session_id` (UUID que expira por inactividad, ver
-- src/lib/analytics.js). Ningún campo de esta tabla identifica a una
-- persona real, salvo que el visitante sea un administrador — y ese tráfico
-- se excluye desde el cliente (PortalLayout.jsx no instrumenta /admin/*).
create table public.analytics_events (
  id bigint generated always as identity primary key,
  -- 'page_view' es el único tipo que dispara esta fase — el check queda
  -- abierto a los tipos ya previstos en el documento de análisis (video,
  -- cta_click, formularios) para que las fases siguientes no necesiten un
  -- ALTER de este constraint, solo agregar el código que los dispare.
  event_type text not null check (event_type in (
    'page_view', 'section_view', 'cta_click',
    'video_play', 'video_progress', 'video_complete',
    'form_start', 'form_field_interaction', 'form_abandon', 'form_submit',
    'infographic_download'
  )),
  anonymous_id uuid not null,
  session_id uuid not null,
  page_path text not null,
  section text,
  content_id text,
  content_title text,
  metadata jsonb not null default '{}',
  referrer text,
  device_type text check (device_type in ('mobile', 'tablet', 'desktop')),
  created_at timestamptz not null default now()
);

comment on table public.analytics_events is
  'Eventos de comportamiento anónimo del portal público (Fase Analítica). '
  'Sin datos personales — identificación por anonymous_id/session_id, no '
  'por IP. Ver docs/phases/FASE-10-ANALITICA-FASE1.md.';

create index idx_analytics_events_type_created on public.analytics_events (event_type, created_at desc);
create index idx_analytics_events_content on public.analytics_events (content_id) where content_id is not null;
create index idx_analytics_events_session on public.analytics_events (session_id);

alter table public.analytics_events enable row level security;

-- El portal público (rol anon, sin sesión) solo puede insertar — nunca leer
-- los eventos de otros visitantes. `with check (true)` porque no hay
-- ninguna condición de fila que validar en un insert de tracking anónimo:
-- cualquier visitante puede registrar su propio comportamiento.
create policy analytics_events_insert_anon
  on public.analytics_events
  for insert
  to anon, authenticated
  with check (true);

-- Solo administradores pueden leer — mismo patrón is_admin() que usa el
-- resto de las políticas RLS del proyecto (no existe una tabla
-- "admin_profiles" separada; is_admin() ya consulta profiles+auth.uid()).
create policy analytics_events_select_admin
  on public.analytics_events
  for select
  to authenticated
  using (public.is_admin());

-- GRANT de tabla explícito, en la misma migración que crea la tabla — este
-- proyecto tiene "Automatically expose new tables" desactivado en Supabase,
-- así que RLS por sí sola no alcanza (Postgres rechaza la operación antes
-- de evaluar las políticas sin este GRANT). Omitirlo ya causó un 401 real
-- en producción para site_settings/services en la Fase 6/7/8 (ver
-- 20260731100400_grants_site_settings_services.sql) — se incluye acá desde
-- el principio para no repetir ese mismo error.
grant insert on public.analytics_events to anon;
grant insert, select on public.analytics_events to authenticated;

notify pgrst, 'reload schema';
