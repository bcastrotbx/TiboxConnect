-- Campo "Video del evento" (pedido de Braulio): link de YouTube opcional
-- por evento, cargado desde el formulario de "Nuevo evento / Editar
-- evento" del admin. Se muestra únicamente en la página pública de detalle
-- (/eventos/:slug, EventoDetailPage.jsx), en un bloque nuevo "Ver video del
-- evento" arriba de "Eventos recomendados" — no aparece en /videoteca ni en
-- ningún otro listado.
--
-- Sin default y nullable, mismo criterio que thumbnail_url/registration_url:
-- es un campo opcional y un evento sin video no debe quedar con un string
-- vacío que después haya que distinguir de "no cargado".
--
-- No requiere cambios de RLS: las políticas de `events` son por fila
-- completa (select *), no por columna, así que la columna nueva queda
-- cubierta por las políticas ya existentes sin tocarlas.
alter table public.events
  add column if not exists video_url text;

-- PostgREST cachea el esquema de la base al iniciar y no detecta columnas
-- nuevas por su cuenta — sin este NOTIFY (o un restart manual del proyecto
-- desde el dashboard), cualquier request que mencione `video_url` sigue
-- fallando con "Could not find the 'video_url' column of 'events' in the
-- schema cache" aunque la columna ya exista. Mismo problema real que se
-- vivió con `gallery` (ver 20260810100000_events_gallery.sql).
notify pgrst, 'reload schema';
