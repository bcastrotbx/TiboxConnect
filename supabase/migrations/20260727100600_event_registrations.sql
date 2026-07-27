-- Fase 4 — Modelo de datos y RLS
-- Inscripciones a eventos. Hoy el portal no tiene un formulario de
-- inscripción propio (Fase 01B lo reemplazó por un link externo
-- registration_url), pero esta tabla queda lista para cuando se decida
-- capturar inscripciones directamente (o para eventos que no usen un link
-- externo).

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  full_name text not null,
  email text not null,
  company text,
  phone text,
  created_at timestamptz not null default now()
);

create index event_registrations_event_id_idx on public.event_registrations (event_id);

-- Evita que el mismo correo se inscriba dos veces al mismo evento.
create unique index event_registrations_event_email_key
  on public.event_registrations (event_id, lower(email));

-- RLS ---------------------------------------------------------------------

alter table public.event_registrations enable row level security;

-- Cualquiera (con o sin sesión) puede inscribirse a un evento. Si hay sesión,
-- el user_id que se guarde debe ser el del propio usuario (o null) — nadie
-- puede registrar una inscripción a nombre de otro user_id.
create policy event_registrations_insert_public
  on public.event_registrations
  for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

-- Solo los administradores pueden ver el listado de inscritos.
create policy event_registrations_select_admin
  on public.event_registrations
  for select
  to authenticated
  using (public.is_admin());
