-- Fase 4 — Modelo de datos y RLS
-- Mensajes del formulario de contacto (src/components/Services.jsx,
-- formService.submitContactForm).

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  company text,
  phone text,
  service text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'resolved')),
  created_at timestamptz not null default now()
);

create index contact_messages_status_idx on public.contact_messages (status);

-- RLS ---------------------------------------------------------------------

alter table public.contact_messages enable row level security;

-- Cualquiera puede enviar un mensaje de contacto, sin sesión.
create policy contact_messages_insert_public
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

-- Solo administradores pueden leer, actualizar (marcar como leído/resuelto)
-- o eliminar mensajes. Ni siquiera quien envió el mensaje puede volver a
-- leerlo.
create policy contact_messages_select_admin
  on public.contact_messages
  for select
  to authenticated
  using (public.is_admin());

create policy contact_messages_update_admin
  on public.contact_messages
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy contact_messages_delete_admin
  on public.contact_messages
  for delete
  to authenticated
  using (public.is_admin());
