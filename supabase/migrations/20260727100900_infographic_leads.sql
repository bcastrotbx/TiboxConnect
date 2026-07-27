-- Fase 4 — Modelo de datos y RLS
-- Leads capturados por InfografiaLeadModal (src/components/Media.jsx) antes
-- de descargar una infografía. Hoy el formulario solo simula el envío y
-- recuerda el estado en sessionStorage (ver Fase 01B) — el guardado real
-- queda para cuando se conecte formService a Supabase (Fase 6).

create table public.infographic_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company text,
  position text,
  email text not null,
  content_item_id uuid references public.content_items (id) on delete set null,
  created_at timestamptz not null default now()
);

create index infographic_leads_content_item_id_idx on public.infographic_leads (content_item_id);

-- RLS ---------------------------------------------------------------------

alter table public.infographic_leads enable row level security;

-- Cualquiera puede dejar sus datos, sin sesión, para descargar una
-- infografía.
create policy infographic_leads_insert_public
  on public.infographic_leads
  for insert
  to anon, authenticated
  with check (true);

-- Solo administradores pueden ver los leads capturados.
create policy infographic_leads_select_admin
  on public.infographic_leads
  for select
  to authenticated
  using (public.is_admin());
