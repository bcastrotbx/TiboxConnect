-- Fase 4 — Datos de ejemplo mínimos
--
-- Pensado para ejecutarse en el SQL Editor de Supabase DESPUÉS de todas las
-- migraciones de supabase/migrations/. Es idempotente: usa ON CONFLICT sobre
-- las columnas "slug" (todas únicas), así que correr este archivo más de una
-- vez no duplica filas — la segunda vez simplemente no hace nada.
--
-- No reemplaza src/data/seed/*.js (el frontend todavía no lee de Supabase,
-- eso es la Fase 6) — es solo para tener datos reales con los que probar
-- las políticas RLS de la Fase 4 desde el Table Editor / SQL Editor.

-- Categorías --------------------------------------------------------------

insert into public.categories (name, slug, description, color, icon, sort_order, is_active)
values
  ('Ciberseguridad', 'ciberseguridad', 'Contenido sobre protección de datos, amenazas y buenas prácticas.', '#F2542D', 'shield', 1, true),
  ('Cloud & Infraestructura', 'cloud-infraestructura', 'Migración, arquitectura y gestión de infraestructura en la nube.', '#2D6CF2', 'cloud', 2, true),
  ('Transformación Digital', 'transformacion-digital', 'Procesos, herramientas y casos de adopción tecnológica.', '#2DBE60', 'trending-up', 3, true)
on conflict (slug) do nothing;

-- Contenido (uno de cada tipo) ---------------------------------------------

insert into public.content_items (
  type, category_id, title, slug, summary, body, thumbnail_url, external_url,
  duration_minutes, source_name, visibility, status, is_featured, sort_order, published_at
)
values
  (
    'video',
    (select id from public.categories where slug = 'ciberseguridad'),
    'Cómo proteger a tu pyme de ataques de phishing',
    'video-proteger-pyme-phishing',
    'Una guía práctica de 12 minutos sobre las señales más comunes de phishing y cómo entrenar a tu equipo.',
    null,
    'https://www.tibox.cl/assets/seed/video-placeholder.jpg',
    'https://www.youtube.com/watch?v=seed-phishing-pyme',
    12,
    'TIBOX',
    'public',
    'published',
    true,
    1,
    now()
  ),
  (
    'infographic',
    (select id from public.categories where slug = 'cloud-infraestructura'),
    '5 señales de que tu empresa necesita migrar a la nube',
    'infografia-senales-migrar-nube',
    'Infografía descargable con los indicadores clave para evaluar una migración a cloud.',
    null,
    'https://www.tibox.cl/assets/seed/infografia-placeholder.jpg',
    null,
    null,
    'TIBOX',
    'public',
    'published',
    false,
    1,
    now()
  ),
  (
    'news',
    (select id from public.categories where slug = 'transformacion-digital'),
    'TIBOX certifica a su equipo técnico en nuevas plataformas cloud',
    'noticia-certificacion-equipo-tecnico',
    'El equipo de TIBOX suma certificaciones para reforzar su oferta de servicios gestionados.',
    'Cuerpo de la noticia de ejemplo, sin contenido real — solo para probar el modelo de datos.',
    'https://www.tibox.cl/assets/seed/news-placeholder.jpg',
    null,
    null,
    'TIBOX',
    'public',
    'published',
    false,
    1,
    now()
  ),
  (
    'resource',
    (select id from public.categories where slug = 'cloud-infraestructura'),
    'Checklist de seguridad para infraestructura híbrida',
    'recurso-checklist-seguridad-hibrida',
    'Documento descargable con una checklist de 20 puntos para auditar infraestructura híbrida.',
    null,
    'https://www.tibox.cl/assets/seed/resource-placeholder.jpg',
    'https://www.tibox.cl/assets/seed/checklist-seguridad-hibrida.pdf',
    null,
    'TIBOX',
    'authenticated',
    'published',
    false,
    1,
    now()
  )
on conflict (slug) do nothing;

-- Eventos -------------------------------------------------------------------

insert into public.events (
  title, slug, summary, description, starts_at, ends_at, location, modality,
  thumbnail_url, registration_url, visibility, status, partner_name
)
values
  (
    'Ciberseguridad para pymes: cómo prepararse en 2026',
    'evento-ciberseguridad-pymes-2026',
    'Webinar en vivo sobre las amenazas más comunes para pymes chilenas y cómo mitigarlas.',
    'Descripción de ejemplo del evento, sin contenido real.',
    now() + interval '14 days',
    now() + interval '14 days' + interval '1 hour',
    'Online',
    'online',
    'https://www.tibox.cl/assets/seed/evento-placeholder.jpg',
    'https://teams.microsoft.com/registration/tibox-ciberseguridad-pymes-2026',
    'public',
    'published',
    'Microsoft'
  ),
  (
    'Encuentro TIBOX de transformación digital 2026',
    'evento-encuentro-transformacion-digital-2026',
    'Evento presencial ya realizado, con casos de éxito de clientes TIBOX.',
    'Descripción de ejemplo del evento, sin contenido real.',
    now() - interval '30 days',
    now() - interval '30 days' + interval '3 hours',
    'Santiago, Chile',
    'presential',
    'https://www.tibox.cl/assets/seed/evento-placeholder.jpg',
    null,
    'public',
    'completed',
    null
  )
on conflict (slug) do nothing;
