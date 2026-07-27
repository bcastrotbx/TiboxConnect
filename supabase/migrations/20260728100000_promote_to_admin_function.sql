-- Fase 5 — Autenticación real de administradores
-- Función de soporte para el flujo de invitación de administradores
-- adicionales (ver supabase/functions/invite-admin/ y ADR-005). Se agrega
-- como su propia migración (no se edita ninguna migración ya enviada de la
-- Fase 4) para mantener el historial de cambios versionado correctamente.

-- Por qué existe esta función en vez de un UPDATE directo desde la Edge
-- Function:
-- El trigger profiles_prevent_self_role_status_change (Fase 4,
-- 20260727100100_profiles.sql) bloquea cualquier cambio de role/status a
-- menos que is_admin() sea true para auth.uid(). Una llamada hecha con la
-- service_role key (como hace la Edge Function invite-admin) no tiene un
-- auth.uid() de sesión de usuario asociado — exactamente el mismo problema
-- documentado en la Fase 4 para el bootstrap manual del primer admin (ver
-- docs/phases/FASE-04-MODELO-DATOS-RLS.md). La solución es la misma:
-- deshabilitar el trigger, hacer el UPDATE, y volver a habilitarlo, todo
-- dentro de una única función (y por lo tanto una única transacción — si
-- algo falla a mitad de camino, Postgres revierte todo, incluida la
-- deshabilitación del trigger).
--
-- Esta función se restringe exclusivamente a la promoción a 'admin' (no
-- permite cambiar status ni degradar a un admin) y su ejecución se limita al
-- rol service_role — ni anon ni authenticated pueden invocarla directamente,
-- así que ni siquiera un usuario autenticado no-admin podría llamarla desde
-- el cliente para auto-promoverse. La verificación de "¿quién puede invitar
-- administradores?" ya ocurre antes, dentro de la Edge Function.
create or replace function public.promote_to_admin(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  alter table public.profiles disable trigger profiles_prevent_self_role_status_change;
  update public.profiles set role = 'admin' where id = target_user_id;
  alter table public.profiles enable trigger profiles_prevent_self_role_status_change;
end;
$$;

revoke all on function public.promote_to_admin(uuid) from public;
revoke all on function public.promote_to_admin(uuid) from anon, authenticated;
grant execute on function public.promote_to_admin(uuid) to service_role;
