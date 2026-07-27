-- Fase 4 — Modelo de datos y RLS
-- Slides del carrusel de portada del portal (hoy SLIDES en
-- src/data/seed/homeSeed.js).

create table public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  eyebrow text,
  title text not null,
  highlight_text text,
  description text,
  button_label text,
  button_url text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index hero_slides_sort_order_idx on public.hero_slides (sort_order);

create trigger set_hero_slides_updated_at
  before update on public.hero_slides
  for each row
  execute function public.set_updated_at();

-- RLS ---------------------------------------------------------------------

alter table public.hero_slides enable row level security;

create policy hero_slides_select_active
  on public.hero_slides
  for select
  to anon, authenticated
  using (is_active = true);

create policy hero_slides_select_admin
  on public.hero_slides
  for select
  to authenticated
  using (public.is_admin());

create policy hero_slides_insert_admin
  on public.hero_slides
  for insert
  to authenticated
  with check (public.is_admin());

create policy hero_slides_update_admin
  on public.hero_slides
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy hero_slides_delete_admin
  on public.hero_slides
  for delete
  to authenticated
  using (public.is_admin());
