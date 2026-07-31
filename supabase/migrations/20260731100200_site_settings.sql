-- Fase 6/7/8 (Portada real) — configuración del bloque de contacto público
-- (título, descripción, direcciones de oficina, texto del CTA). Hoy esos
-- textos están hardcodeados en Services.jsx; esta tabla permite que el tab
-- "Contacto" de /admin/portada los edite de verdad. Fila única (singleton)
-- identificada por id='contact'.

create table public.site_settings (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row
  execute function public.set_updated_at();

insert into public.site_settings (id, data) values (
  'contact',
  '{
    "title": "¿Tienes algún proyecto en mente?",
    "description": "Cuéntanos sobre tu proyecto y un especialista de TIBOX te contactará dentro de 24 horas hábiles.",
    "officeCl": "Av. Pdte. Kennedy 5600, Oficina 1506, Vitacura, Santiago",
    "officePe": "Grimaldo del Solar 162, URB LEURO INT. 407, Miraflores, Lima",
    "ctaText": "Enviar mensaje"
  }'::jsonb
);

-- RLS ---------------------------------------------------------------------

alter table public.site_settings enable row level security;

-- Lectura pública: el portal necesita estos textos sin sesión.
create policy site_settings_select_public
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

create policy site_settings_update_admin
  on public.site_settings
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
