-- Fase 6/7/8 (Portada real, Servicios TIBOX) — el admin
-- (/admin/contenidos/servicios) editaba un dataset de ejemplo (icono +
-- puntos destacados, 7 unidades genéricas) que no tenía ninguna relación
-- con el catálogo real mostrado en el portal público (src/data/seed/servicesSeed.js:
-- 6 unidades con logo, gradiente, descripción y grupos de ítems detallados)
-- — ni siquiera los nombres coincidían. Esta tabla replica la estructura
-- real para que el admin edite lo mismo que se muestra (o se mostrará,
-- hoy oculto tras SHOW_SERVICES=false en HomePage.jsx) en el portal.

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  description text,
  icon text,
  gradient text,
  logo_url text,
  detail jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index services_sort_order_idx on public.services (sort_order);

create trigger set_services_updated_at
  before update on public.services
  for each row
  execute function public.set_updated_at();

-- RLS ---------------------------------------------------------------------

alter table public.services enable row level security;

create policy services_select_active
  on public.services
  for select
  to anon, authenticated
  using (is_active = true);

create policy services_select_admin
  on public.services
  for select
  to authenticated
  using (public.is_admin());

create policy services_insert_admin
  on public.services
  for insert
  to authenticated
  with check (public.is_admin());

create policy services_update_admin
  on public.services
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy services_delete_admin
  on public.services
  for delete
  to authenticated
  using (public.is_admin());

-- Datos iniciales — migrados tal cual desde servicesSeed.js -----------------

insert into public.services (slug, label, description, icon, gradient, logo_url, detail, sort_order) values
('infra', 'Infraestructura TI', 'Redes, servidores y conectividad que sostienen tu operación.', 'network', 'var(--u-infra-g)', '/assets/logo-infraestructura.png',
  '{"fullName":"Infraestructura TI & NOC","intro":"Soporte TI integral y un Centro de Operaciones de Red (NOC) que monitorea y administra tu infraestructura para garantizar continuidad operacional.","groups":[{"name":"Soporte TI","items":["Soporte onsite y remoto","Mesa de ayuda y resolución de incidentes","Servicio técnico","Gestión de infraestructura"]},{"name":"NOC — Centro de Operaciones de Red","items":["Monitoreo y administración de infraestructura TI","Administración y optimización de plataformas cloud","Administración de servidores en HA","Administración de redes y comunicaciones","Gestión de backups y Recuperación ante Desastres (DRP)","Administración y monitoreo de firewall"]}]}'::jsonb, 0),
('ciber', 'Ciberseguridad', 'Protección activa, auditorías y cumplimiento normativo 24/7.', 'lock', 'var(--u-ciber-g)', '/assets/logo-ciberseguridad.png',
  '{"fullName":"Ciberseguridad & SOC","intro":"Protección activa de tu organización con un SOC que vigila, detecta y responde ante amenazas las 24 horas.","groups":[{"name":"Servicios","items":["Seguridad perimetral: firewall y antivirus empresarial","Gestión y monitoreo de seguridad (SOC)","Ethical hacking y penetration testing","Inteligencia de amenazas y detección de incidentes con IA","Implementación de seguridad Zero Trust","Automatización de respuesta a incidentes (SOAR)","Seguridad en la nube (SASE)"]}]}'::jsonb, 1),
('cloud', 'Soluciones Cloud', 'Migraciones, arquitectura multi-cloud y soporte local cercano.', 'cloud', 'var(--u-cloud-g)', '/assets/logo-soluciones-cloud.png',
  '{"fullName":"Soluciones Cloud","intro":"Administración, migración y optimización de tus entornos en la nube, con foco en continuidad, costos y cumplimiento.","groups":[{"name":"Servicios","items":["Administración y monitoreo de máquinas virtuales","Administración de respaldos en la nube","Administración de escritorios virtuales","Disaster recovery y continuidad operativa","Migración e implementación de correos M365 & Google Workspace","Licenciamiento Microsoft 365 y Google Workspace","Gestión y soporte para entornos IaaS, PaaS y SaaS","Optimización de costos cloud (FinOps)","Cloud Security Posture Management (CSPM)"]}]}'::jsonb, 2),
('analitica', 'Analítica TI', 'BI, dashboards en tiempo real e inteligencia operacional.', 'trending-up', 'var(--u-analitica-g)', '/assets/logo-analitica.png',
  '{"fullName":"Analítica de Datos & Inteligencia Artificial","intro":"Convierte tus datos en decisiones: plataformas de BI, modelos predictivos e inteligencia artificial aplicada a tu negocio.","groups":[{"name":"Servicios","items":["Gestión de plataformas de BI empresarial","Consultoría en Business Intelligence (BI)","Arquitectura cloud para datos","Gobierno y gestión de datos","Analítica predictiva y modelos de machine learning","MLOps para empresas: escalabilidad de IA","Chatbot de inteligencia artificial (IA)","IA como servicio para empresas"]}]}'::jsonb, 3),
('consultoria', 'Consultoría TI', 'Roadmaps tecnológicos, gestión de proveedores y estrategia.', 'layers', 'var(--u-consultoria-g)', '/assets/logo-consultoria-ti.png',
  '{"fullName":"Consultoría TI & Transformación Digital","intro":"Acompañamiento estratégico para alinear la tecnología con los objetivos de tu organización y acelerar su transformación digital.","groups":[{"name":"Servicios","items":["Assessment y diagnóstico TI","Consultoría estratégica en TI y transformación digital","Optimización y mejora continua de procesos TI","Elaboración de políticas y procedimientos TI","Gestión de riesgos y cumplimiento normativo en TI","Análisis e informes de ciberataques y seguridad","Adopción de IA y automatización empresarial","Matriz de riesgos sobre activos TI"]}]}'::jsonb, 4),
('smart', 'Soluciones Inteligentes', 'Automatización, IA aplicada y soluciones a medida.', 'cpu', 'var(--u-smart-g)', '/assets/logo-soluciones-inteligentes.png',
  '{"fullName":"Soluciones Inteligentes & Automatización","intro":"Desarrollo y automatización a medida: desde sitios y aplicaciones web hasta IoT, RPA y gemelos digitales.","groups":[{"name":"Servicios","items":["Diseño y desarrollo de sitios web empresariales","Desarrollo de aplicaciones web","Intranet y portales corporativos en SharePoint Online","Sistemas de gestión documental en SharePoint Online","Implementación de proyectos IoT e industria 4.0","Automatización con Robotic Process Automation (RPA)","Digital Twins — gemelos digitales"]}]}'::jsonb, 5);
