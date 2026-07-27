-- Fase 4 — Modelo de datos y RLS
-- Contenido del portal: videos, infografías, noticias y recursos, todos en
-- una sola tabla diferenciados por "type" (mismo patrón que ya usa el
-- frontend en src/data/seed/*.js y src/services/contentService.js).

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('video', 'infographic', 'news', 'resource')),
  category_id uuid references public.categories (id) on delete set null,
  title text not null,
  slug text not null unique,
  summary text,
  body text,
  thumbnail_url text,
  external_url text,
  duration_minutes integer,
  source_name text,
  visibility text not null default 'public' check (visibility in ('public', 'authenticated')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index content_items_category_id_idx on public.content_items (category_id);
create index content_items_type_idx on public.content_items (type);
create index content_items_status_visibility_idx on public.content_items (status, visibility);

create trigger set_content_items_updated_at
  before update on public.content_items
  for each row
  execute function public.set_updated_at();

-- RLS ---------------------------------------------------------------------

alter table public.content_items enable row level security;

-- Visitantes sin sesión: solo contenido publicado y de visibilidad pública.
create policy content_items_select_public
  on public.content_items
  for select
  to anon, authenticated
  using (status = 'published' and visibility = 'public');

-- Usuarios autenticados: además, contenido publicado marcado como
-- "authenticated" (hoy no hay usuarios finales logueados por ADR-004, pero
-- la política queda lista para cuando existan administradores u otros
-- roles autenticados que deban ver este contenido).
create policy content_items_select_authenticated
  on public.content_items
  for select
  to authenticated
  using (status = 'published' and visibility = 'authenticated');

-- Administradores: ven todo, incluyendo borradores y archivados.
create policy content_items_select_admin
  on public.content_items
  for select
  to authenticated
  using (public.is_admin());

create policy content_items_insert_admin
  on public.content_items
  for insert
  to authenticated
  with check (public.is_admin());

create policy content_items_update_admin
  on public.content_items
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy content_items_delete_admin
  on public.content_items
  for delete
  to authenticated
  using (public.is_admin());
