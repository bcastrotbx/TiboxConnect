-- Fase 5 — GRANT base para los roles anon/authenticated
--
-- Hallazgo durante la verificación manual del login (ver
-- docs/phases/FASE-05-AUTENTICACION.md): el proyecto Supabase se creó con
-- "Automatically expose new tables" desmarcado, así que las tablas de la
-- Fase 4 nunca recibieron el GRANT de Postgres a nivel de tabla para los
-- roles anon/authenticated. RLS por sí sola no es suficiente — una política
-- RLS solo decide QUÉ FILAS puede ver/tocar un rol que YA tiene permiso de
-- Postgres para hacer SELECT/INSERT/UPDATE/DELETE sobre la tabla; sin el
-- GRANT de tabla, Postgres rechaza la operación antes siquiera de evaluar
-- las políticas (por eso el login fallaba con 403 al intentar leer
-- profiles). Esta migración deja esos GRANT versionados, para que
-- cualquier entorno nuevo (staging, otro proyecto Supabase) los reciba
-- automáticamente al aplicar las migraciones en orden, sin depender de un
-- ajuste manual de configuración en el dashboard.
--
-- El alcance de cada GRANT refleja exactamente las políticas RLS ya creadas
-- en las migraciones de la Fase 4 (20260727100100 a 20260727100900): se
-- otorga a un rol únicamente la operación (SELECT/INSERT/UPDATE/DELETE) para
-- la que ese rol tiene al menos una política — el GRANT no amplía el acceso
-- real, que sigue estando acotado por RLS; solo habilita que RLS pueda
-- evaluarse en absoluto.

-- profiles: solo authenticated tiene políticas (self + admin), anon no
-- tiene ninguna.
grant select, update on public.profiles to authenticated;

-- categories, content_items, hero_slides, events: mismo patrón — anon solo
-- lee filas públicas/activas; authenticated además puede insertar/
-- actualizar/eliminar si es admin (acotado por RLS, no por este GRANT).
grant select on public.categories to anon;
grant select, insert, update, delete on public.categories to authenticated;

grant select on public.content_items to anon;
grant select, insert, update, delete on public.content_items to authenticated;

grant select on public.hero_slides to anon;
grant select, insert, update, delete on public.hero_slides to authenticated;

grant select on public.events to anon;
grant select, insert, update, delete on public.events to authenticated;

-- event_registrations, infographic_leads: inserción pública, solo lectura
-- para admins (acotado por RLS).
grant insert on public.event_registrations to anon;
grant insert, select on public.event_registrations to authenticated;

grant insert on public.infographic_leads to anon;
grant insert, select on public.infographic_leads to authenticated;

-- contact_messages, feedback: inserción pública, lectura/actualización/
-- eliminación para admins (acotado por RLS).
grant insert on public.contact_messages to anon;
grant insert, select, update, delete on public.contact_messages to authenticated;

grant insert on public.feedback to anon;
grant insert, select, update, delete on public.feedback to authenticated;
