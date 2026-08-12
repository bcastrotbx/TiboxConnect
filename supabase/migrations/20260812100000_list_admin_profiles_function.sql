-- Fase 9 — Panel "Administradores": listado de administradores registrados
-- (ver docs/phases/FASE-09-NOTICIAS-DETALLE-Y-ADMIN.md, punto 2.3).

-- Por qué una función y no una consulta directa desde el cliente:
-- public.profiles no tiene columna `email` (vive en auth.users, que
-- PostgREST no expone por defecto) — así que un SELECT normal desde
-- adminUsersService.js no puede traer el correo de cada administrador. Esta
-- función security definer une profiles + auth.users y revisa is_admin()
-- explícitamente adentro del cuerpo antes de devolver nada: exponerla a
-- 'authenticated' sin ese chequeo dejaría que cualquier usuario autenticado
-- (no solo administradores) leyera los correos de todos los admins.
create or replace function public.list_admin_profiles()
returns table (
  id uuid,
  full_name text,
  email text,
  status text,
  created_at timestamptz
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
    select p.id, p.full_name, u.email::text, p.status, p.created_at
    from public.profiles p
    join auth.users u on u.id = p.id
    where p.role = 'admin'
    order by p.created_at asc;
end;
$$;

revoke all on function public.list_admin_profiles() from public;
revoke all on function public.list_admin_profiles() from anon;
grant execute on function public.list_admin_profiles() to authenticated;
