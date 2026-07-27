-- Fase 4 — Modelo de datos y RLS
-- Opiniones de clientes (OpinionPanel del portal,
-- formService.submitOpinionForm). Mismo patrón de acceso que
-- contact_messages: inserción pública, lectura/gestión solo admin.

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  full_name text not null,
  email text not null,
  rating integer not null check (rating between 1 and 5),
  message text,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

create index feedback_status_idx on public.feedback (status);

-- RLS ---------------------------------------------------------------------

alter table public.feedback enable row level security;

create policy feedback_insert_public
  on public.feedback
  for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

create policy feedback_select_admin
  on public.feedback
  for select
  to authenticated
  using (public.is_admin());

create policy feedback_update_admin
  on public.feedback
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy feedback_delete_admin
  on public.feedback
  for delete
  to authenticated
  using (public.is_admin());
