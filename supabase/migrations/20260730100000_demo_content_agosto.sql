-- Fase 6/7/8 — contenido de ejemplo adicional para la demo
--
-- Pedido explícito de Braulio: el portal se veía casi vacío con solo el
-- contenido de la Fase 4 (1 video, 1 infografía, 1 noticia, 2 eventos). Se
-- agregan 2 videos, 2 infografías, 2 noticias (con body completo) y 3
-- eventos (2 próximos + 1 realizado) adicionales, todos publicados y
-- públicos, usando las categorías ya creadas. Mismo patrón idempotente que
-- supabase/seed.sql y 20260729100000_webinars_category.sql — ON CONFLICT
-- sobre slug, se puede correr más de una vez sin duplicar filas.
--
-- No reemplaza supabase/seed.sql (que sigue siendo el set mínimo original
-- de la Fase 4) — es contenido adicional, pensado exclusivamente para que
-- el portal no se vea vacío en la demo.

-- Videos -------------------------------------------------------------------

insert into public.content_items (
  type, category_id, title, slug, summary, thumbnail_url, external_url,
  duration_minutes, source_name, visibility, status, is_featured, sort_order, published_at
)
values
  (
    'video',
    (select id from public.categories where slug = 'webinars'),
    'Copilot Studio: crea tu propio agente de IA',
    'video-copilot-studio-agente-ia',
    'Cómo diseñar y publicar un agente de IA a medida con Copilot Studio, sin escribir código.',
    'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    22,
    'TIBOX',
    'public',
    'published',
    false,
    2,
    now() - interval '3 days'
  ),
  (
    'video',
    (select id from public.categories where slug = 'cloud-infraestructura'),
    'Cloud e IA: arquitecturas inteligentes en Azure',
    'video-cloud-ia-arquitecturas-azure',
    'Patrones de arquitectura para cargas de trabajo con IA generativa sobre Azure, pensados para empresas medianas.',
    'https://www.tibox.cl/assets/seed/video-placeholder.jpg',
    'https://www.youtube.com/watch?v=seed-cloud-ia-azure',
    41,
    'TIBOX',
    'public',
    'published',
    false,
    3,
    now() - interval '10 days'
  )
on conflict (slug) do nothing;

-- Infografías ----------------------------------------------------------

insert into public.content_items (
  type, category_id, title, slug, summary, thumbnail_url, visibility, status, is_featured, sort_order, published_at
)
values
  (
    'infographic',
    (select id from public.categories where slug = 'ciberseguridad'),
    'Checklist de respaldo 3-2-1: protege tu información',
    'infografia-checklist-respaldo-321',
    'Tres copias, dos medios distintos, una fuera de sitio — la regla básica de respaldo explicada en una pieza visual.',
    'https://www.tibox.cl/assets/seed/infografia-placeholder-2.jpg',
    'public',
    'published',
    false,
    2,
    now() - interval '5 days'
  ),
  (
    'infographic',
    (select id from public.categories where slug = 'cloud-infraestructura'),
    'Cloud vs on-premise: ¿cuál es mejor para tu empresa?',
    'infografia-cloud-vs-onpremise',
    'Comparativa rápida de costos, escalabilidad y seguridad entre mantener infraestructura propia o migrar a la nube.',
    'https://www.tibox.cl/assets/seed/infografia-placeholder-3.jpg',
    'public',
    'published',
    false,
    3,
    now() - interval '12 days'
  )
on conflict (slug) do nothing;

-- Noticias (con body completo) -------------------------------------------

insert into public.content_items (
  type, category_id, title, slug, summary, body, thumbnail_url, source_name, visibility, status, is_featured, sort_order, published_at
)
values
  (
    'news',
    (select id from public.categories where slug = 'transformacion-digital'),
    'Microsoft anuncia nuevas funciones de Copilot para empresas',
    'noticia-microsoft-copilot-funciones-empresas',
    'Microsoft suma agentes autónomos y automatización de flujos de trabajo a Copilot para clientes empresariales.',
    'Microsoft anunció esta semana un conjunto de nuevas capacidades para Copilot orientadas a empresas, con foco en la automatización de tareas repetitivas y la creación de agentes autónomos que pueden ejecutar procesos completos sin supervisión constante.' || chr(10) || chr(10) ||
    'Entre las novedades destaca la posibilidad de conectar Copilot directamente con sistemas internos (ERP, CRM, mesas de ayuda) para que los agentes puedan consultar y actualizar información en tiempo real, respetando los permisos de cada usuario.' || chr(10) || chr(10) ||
    'Para TIBOX, esto representa una oportunidad concreta para nuestros clientes que ya usan Microsoft 365: la automatización de procesos administrativos y de soporte puede reducir tiempos de respuesta sin requerir grandes proyectos de desarrollo a medida. El equipo de Consultoría TI está evaluando los primeros casos de uso aplicables a la región.',
    'https://www.tibox.cl/assets/seed/news-placeholder-2.jpg',
    'Microsoft',
    'public',
    'published',
    false,
    2,
    now() - interval '2 days'
  ),
  (
    'news',
    (select id from public.categories where slug = 'ciberseguridad'),
    'Aumentan los ataques de ransomware a pymes en Chile',
    'noticia-ransomware-pymes-chile',
    'Un informe reciente muestra que las pymes chilenas son cada vez más un objetivo, por tener defensas más débiles que las grandes empresas.',
    'Un informe reciente de la industria de ciberseguridad muestra un aumento sostenido de ataques de ransomware dirigidos a pequeñas y medianas empresas en Chile durante el último trimestre. A diferencia de las grandes corporaciones, las pymes suelen tener defensas más débiles — sin monitoreo 24/7, sin respaldos probados y con parches de seguridad atrasados — lo que las convierte en un objetivo atractivo para los atacantes.' || chr(10) || chr(10) ||
    'Los especialistas coinciden en que los controles más efectivos no requieren necesariamente grandes inversiones: autenticación multifactor, respaldos inmutables probados periódicamente, y un plan de respuesta ante incidentes documentado reducen drásticamente el impacto de un ataque exitoso.' || chr(10) || chr(10) ||
    'Desde TIBOX, recomendamos a las empresas que aún no han evaluado su postura de seguridad que agenden una revisión con nuestro equipo de Ciberseguridad — muchas veces los controles esenciales están al alcance de cualquier presupuesto, el problema es no saber por dónde empezar.',
    'https://www.tibox.cl/assets/seed/news-placeholder-3.jpg',
    'ENISA',
    'public',
    'published',
    false,
    3,
    now() - interval '6 days'
  )
on conflict (slug) do nothing;

-- Eventos próximos -----------------------------------------------------

insert into public.events (
  title, slug, summary, description, starts_at, ends_at, location, modality,
  thumbnail_url, registration_url, visibility, status, partner_name
)
values
  (
    'Webinar: Automatización de procesos con IA',
    'evento-webinar-automatizacion-procesos-ia',
    'Cómo identificar procesos manuales candidatos a automatizar con IA generativa, sin proyectos de meses.',
    'Descripción de ejemplo del evento, sin contenido real — pensado únicamente para la demo.',
    now() + interval '7 days',
    now() + interval '7 days' + interval '1 hour',
    'Microsoft Teams',
    'online',
    'https://www.tibox.cl/assets/seed/evento-placeholder-2.jpg',
    'https://teams.microsoft.com/registration/tibox-automatizacion-ia-2026',
    'public',
    'published',
    'Microsoft'
  ),
  (
    'Taller: Seguridad en la nube para pymes',
    'evento-taller-seguridad-nube-pymes',
    'Controles esenciales para proteger cargas de trabajo en la nube, con ejercicios prácticos.',
    'Descripción de ejemplo del evento, sin contenido real — pensado únicamente para la demo.',
    now() + interval '21 days',
    now() + interval '21 days' + interval '3 hours',
    'Oficina TIBOX, Vitacura',
    'presential',
    'https://www.tibox.cl/assets/seed/evento-placeholder-3.jpg',
    'https://teams.microsoft.com/registration/tibox-seguridad-nube-pymes-2026',
    'public',
    'published',
    'Veeam'
  )
on conflict (slug) do nothing;

-- Evento realizado -------------------------------------------------------

insert into public.events (
  title, slug, summary, description, starts_at, ends_at, location, modality,
  thumbnail_url, registration_url, visibility, status, partner_name
)
values
  (
    'TIBOX Cloud Day 2026',
    'evento-tibox-cloud-day-2026',
    'Jornada de casos reales de migración a la nube, ya realizada.',
    'Descripción de ejemplo del evento, sin contenido real — pensado únicamente para la demo.',
    now() - interval '45 days',
    now() - interval '45 days' + interval '4 hours',
    'Hotel W, Santiago',
    'presential',
    'https://www.tibox.cl/assets/seed/evento-placeholder-4.jpg',
    null,
    'public',
    'completed',
    'Microsoft'
  )
on conflict (slug) do nothing;
