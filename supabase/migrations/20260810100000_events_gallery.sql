-- Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): galería de fotos
-- del evento — pedido explícito de Braulio para el formulario de "Nuevo
-- evento / Editar evento" del admin. `events.gallery` ya se leía en el
-- frontend (VistaModal, EventoDetailPage) desde datos de ejemplo
-- (src/data/seed/eventsSeed.js), pero la tabla real nunca tuvo esta
-- columna — por eso la sección de galería quedaba oculta en cualquier
-- evento real (`event.gallery || []`, siempre vacío).
--
-- text[] simple (URLs del bucket content-images, mismo bucket que
-- thumbnail_url/partner_logo_url) en vez de una tabla aparte — no se pidió
-- ni se necesita ordenar, taggear o paginar las fotos de un evento, así que
-- una tabla relacionada habría sido una complejidad sin beneficio real.
--
-- El límite de 8 fotos se valida principalmente en el frontend (mejor
-- experiencia: el admin ve el límite mientras sube), pero se agrega un
-- check constraint acá también — mismo criterio que el ajuste posterior de
-- "auditoría del panel admin" que agregó la validación de ends_at/starts_at
-- que faltaba: una validación que solo vive en el cliente no protege contra
-- nada que escriba directo a la base (ej. un futuro script, o una función
-- SQL propia).
alter table public.events
  add column if not exists gallery text[] not null default '{}';

alter table public.events
  add constraint events_gallery_max_8 check (array_length(gallery, 1) is null or array_length(gallery, 1) <= 8);
