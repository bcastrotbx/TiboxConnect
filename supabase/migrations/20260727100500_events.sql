-- Fase 4 — Modelo de datos y RLS
-- Eventos (próximos y realizados, hoy src/data/seed/eventsSeed.js). Incluye
-- registration_url: enlace externo de inscripción (Teams, etc.) que hoy es
-- un dato de ejemplo hardcodeado y que el botón "Inscríbete aquí" de
-- EventDetailModal ya consume (ver Fase 01B).

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  modality text not null check (modality in ('online', 'presential', 'hybrid')),
  thumbnail_url text,
  registration_url text,
  visibility text not null default 'public' check (visibility in ('public', 'authenticated')),
  status text not null default 'draft' check (status in ('draft', 'published', 'completed', 'archived')),
  partner_name text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_starts_at_idx on public.events (starts_at);
create index events_status_visibility_idx on public.events (status, visibility);

create trigger set_events_updated_at
  before update on public.events
  for each row
  execute function public.set_updated_at();

-- RLS ---------------------------------------------------------------------

alter table public.events enable row level security;

create policy events_select_public
  on public.events
  for select
  to anon, authenticated
  using (status = 'published' and visibility = 'public');

create policy events_select_authenticated
  on public.events
  for select
  to authenticated
  using (status = 'published' and visibility = 'authenticated');

create policy events_select_admin
  on public.events
  for select
  to authenticated
  using (public.is_admin());

create policy events_insert_admin
  on public.events
  for insert
  to authenticated
  with check (public.is_admin());

create policy events_update_admin
  on public.events
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy events_delete_admin
  on public.events
  for delete
  to authenticated
  using (public.is_admin());
