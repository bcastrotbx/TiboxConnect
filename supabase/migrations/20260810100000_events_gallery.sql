-- Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): galería de fotos
-- del evento — pedido explícito de Braulio para el formulario de "Nuevo
-- evento / Editar evento" del admin. `events.gallery` ya se leía en el
-- frontend (VistaModal, EventoDetailPage) desde datos de ejemplo
-- (src/data/seed/eventsSeed.js), pero la tabla real nunca tuvo esta
-- columna — por eso la sección de galería quedaba oculta en cualquier
-- evento real (`event.gallery || []`, siempre vacío).
--
-- Ajuste posterior (ver misma nota extensa en FASE-06-07-08-CONTENIDO-REAL.md,
-- entrada "galería de fotos: de subida a Supabase Storage a enlaces"): esta
-- migración se reescribió antes de haberse ejecutado nunca contra el
-- proyecto real (confirmado en vivo: la columna no existía todavía), así
-- que se edita directo en vez de agregar una migración de corrección
-- aparte. Cambios respecto a la primera versión: el límite pasó de 8 a 10
-- (pedido explícito), y ya no se sube nada a Supabase Storage — cada
-- elemento del array es una URL pegada a mano por el admin (ej. una foto
-- ya alojada en WordPress), para no seguir gastando espacio de Storage en
-- fotos de eventos.
--
-- text[] simple en vez de una tabla aparte — no se pidió ni se necesita
-- ordenar, taggear o paginar las fotos de un evento, así que una tabla
-- relacionada habría sido una complejidad sin beneficio real.
--
-- El límite de 10 enlaces se valida principalmente en el frontend (mejor
-- experiencia: el admin ve el límite mientras escribe), pero se agrega un
-- check constraint acá también — mismo criterio que el ajuste posterior de
-- "auditoría del panel admin" que agregó la validación de ends_at/starts_at
-- que faltaba: una validación que solo vive en el cliente no protege contra
-- nada que escriba directo a la base (ej. un futuro script, o una función
-- SQL propia).
alter table public.events
  add column if not exists gallery text[] not null default '{}';

alter table public.events
  add constraint events_gallery_max_10 check (array_length(gallery, 1) is null or array_length(gallery, 1) <= 10);

-- PostgREST cachea el esquema de la base al iniciar y no detecta columnas
-- nuevas por su cuenta — sin este NOTIFY (o un restart manual del proyecto
-- desde el dashboard), cualquier request que mencione `gallery` sigue
-- fallando con "Could not find the 'gallery' column of 'events' in the
-- schema cache" aunque la columna ya exista, porque PostgREST está
-- respondiendo con una versión vieja del esquema que tiene en memoria.
notify pgrst, 'reload schema';
