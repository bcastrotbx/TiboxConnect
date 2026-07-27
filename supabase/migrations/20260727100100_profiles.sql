-- Fase 4 — Modelo de datos y RLS
-- Tabla profiles, trigger de creación automática al registrar un usuario en
-- auth.users, y la función is_admin() que usarán todas las políticas RLS
-- del resto de las tablas.
--
-- Nota (ADR-004): el portal no tiene registro público. Este trigger igual se
-- crea ahora como parte del modelo base — hoy solo se disparará cuando se
-- creen cuentas de administrador (Fase 5, vía invitación desde el panel de
-- Supabase o la API de Auth), no por un flujo de registro público.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  company text,
  phone text,
  role text not null default 'user' check (role in ('user', 'admin')),
  status text not null default 'active' check (status in ('active', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Perfil de cada usuario de auth.users. Se crea automáticamente vía trigger '
  'al insertar en auth.users (ver handle_new_user más abajo).';

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Trigger de creación automática de perfil ------------------------------

-- SECURITY DEFINER: corre con privilegios del dueño de la función (no del
-- usuario que se está registrando), necesario para poder insertar en
-- public.profiles antes de que exista ninguna fila de sesión/RLS aplicable.
--
-- Deliberadamente esta función NO atrapa excepciones: si el insert en
-- profiles falla (por ejemplo, por un constraint violado), la excepción se
-- propaga y aborta también el insert en auth.users. Esto es intencional:
-- preferimos que la creación de un usuario falle de forma visible (el admin
-- ve un error) a que quede un usuario en auth.users sin su fila de perfil
-- correspondiente de forma silenciosa.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Función is_admin() ----------------------------------------------------

-- Usada por las políticas RLS de todas las demás tablas. SECURITY DEFINER +
-- search_path fijo para que la verificación de rol no dependa de (ni pueda
-- ser alterada por) las políticas RLS de profiles ni por un search_path
-- manipulado por quien la invoca.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and status = 'active'
  );
$$;

-- Trigger que impide que un usuario cambie su propio role/status ---------

-- La política RLS de update (más abajo) ya limita el UPDATE a la propia
-- fila; este trigger agrega la restricción de columna que RLS no puede
-- expresar por sí sola (RLS no puede comparar el valor viejo contra el
-- nuevo de una misma fila dentro de una sola cláusula USING/WITH CHECK).
create or replace function public.prevent_self_role_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role or new.status is distinct from old.status)
     and not public.is_admin() then
    raise exception 'No puedes modificar tu propio role o status.';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_self_role_status_change
  before update on public.profiles
  for each row
  execute function public.prevent_self_role_status_change();

-- RLS ---------------------------------------------------------------------

alter table public.profiles enable row level security;

-- Un usuario puede leer su propia fila.
create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

-- Los administradores pueden leer todas las filas (necesario para un futuro
-- panel de gestión de usuarios / invitación de administradores, ADR-004).
create policy profiles_select_admin
  on public.profiles
  for select
  to authenticated
  using (public.is_admin());

-- Un usuario puede actualizar su propia fila (el trigger de arriba bloquea
-- cambios a role/status si quien actualiza no es admin).
create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Los administradores pueden actualizar cualquier fila (bloquear/desbloquear
-- usuarios, promover a admin, etc.).
create policy profiles_update_admin
  on public.profiles
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- No se agrega política de INSERT: las filas de profiles se crean
-- exclusivamente vía el trigger on_auth_user_created (SECURITY DEFINER,
-- corre con privilegios que no dependen de RLS). No hay un flujo donde un
-- cliente autenticado deba poder insertar su propia fila directamente.
--
-- No se agrega política de DELETE: no hay un flujo de borrado de perfiles
-- en el alcance de esta fase.
