-- Fase 4 — Modelo de datos y RLS
-- Categorías usadas para clasificar content_items (videos, infografías,
-- noticias, recursos).

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  color text,
  icon text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_sort_order_idx on public.categories (sort_order);

create trigger set_categories_updated_at
  before update on public.categories
  for each row
  execute function public.set_updated_at();

-- RLS ---------------------------------------------------------------------

alter table public.categories enable row level security;

-- Lectura pública (anon + authenticated) de categorías activas: el portal
-- las usa para filtros de videoteca/biblioteca/infografías sin necesitar
-- sesión.
create policy categories_select_active
  on public.categories
  for select
  to anon, authenticated
  using (is_active = true);

-- Los administradores ven también las categorías inactivas (para poder
-- reactivarlas desde el panel).
create policy categories_select_admin
  on public.categories
  for select
  to authenticated
  using (public.is_admin());

create policy categories_insert_admin
  on public.categories
  for insert
  to authenticated
  with check (public.is_admin());

create policy categories_update_admin
  on public.categories
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy categories_delete_admin
  on public.categories
  for delete
  to authenticated
  using (public.is_admin());
