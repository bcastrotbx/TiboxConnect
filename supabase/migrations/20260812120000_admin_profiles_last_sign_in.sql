-- Visibilidad de aceptación de invitación en "Administradores" (ver
-- docs/phases/FASE-09D-VISIBILIDAD-INVITACION-ADMIN.md).
--
-- ADR-005 sigue vigente sin cambios: role='admin' se otorga de inmediato al
-- invitar, no al aceptar. Esto NO agrega ningún paso de aprobación — solo
-- expone un dato de solo lectura (auth.users.last_sign_in_at) para que el
-- panel pueda distinguir, a simple vista, una cuenta que ya inició sesión
-- al menos una vez (aceptó la invitación y definió su contraseña) de una
-- que sigue con la invitación sin abrir.
--
-- No se modifica la migración de la Fase 9 (20260812100000_list_admin_profiles_function.sql,
-- ya aplicada en producción) — Postgres no permite CREATE OR REPLACE
-- FUNCTION cuando cambia la forma del RETURNS TABLE, así que esta migración
-- hace DROP + CREATE de la misma función, en un archivo nuevo y versionado.
drop function if exists public.list_admin_profiles();

create or replace function public.list_admin_profiles()
returns table (
  id uuid,
  full_name text,
  email text,
  status text,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'No autorizado.';
  end if;

  return query
    select p.id, p.full_name, u.email::text, p.status, p.created_at, u.last_sign_in_at
    from public.profiles p
    join auth.users u on u.id = p.id
    where p.role = 'admin'
    order by p.created_at asc;
end;
$$;

revoke all on function public.list_admin_profiles() from public;
revoke all on function public.list_admin_profiles() from anon;
grant execute on function public.list_admin_profiles() to authenticated;
