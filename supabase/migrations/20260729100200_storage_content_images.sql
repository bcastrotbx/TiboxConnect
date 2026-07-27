-- Fase 6/7/8 — Storage: bucket content-images
--
-- Miniaturas de noticias/infografías y banners de eventos. Público para
-- lectura (el portal es 100% público, ADR-004); solo administradores pueden
-- subir/reemplazar/eliminar archivos.
--
-- IMPORTANTE — creación del bucket: este INSERT intenta crear el bucket por
-- SQL directamente en storage.buckets, que es el patrón habitual para
-- versionar buckets en migraciones. Esto no se pudo probar contra un
-- proyecto Supabase real desde este entorno de trabajo (sin acceso), así que
-- si el rol con el que se ejecutan las migraciones no tiene permiso de
-- INSERT sobre storage.buckets en tu proyecto, esta sentencia fallará. En
-- ese caso, el paso manual es:
--   Supabase Dashboard → Storage → New bucket
--     - Name: content-images
--     - Public bucket: activado (toggle ON)
--   Y luego ejecutar solo la parte de este archivo desde "-- Políticas RLS"
--   hacia abajo (las políticas si se pueden crear por SQL siempre, sean cual
--   sea el origen del bucket).
insert into storage.buckets (id, name, public)
values ('content-images', 'content-images', true)
on conflict (id) do nothing;

-- Políticas RLS sobre storage.objects ---------------------------------------
-- storage.objects ya tiene RLS habilitado por defecto en Supabase; el
-- ENABLE de abajo es idempotente (no falla si ya estaba habilitado).
alter table storage.objects enable row level security;

-- Lectura pública de archivos del bucket content-images. El bucket ya es
-- público (sirve archivos vía URL pública sin pasar por RLS), pero esta
-- política además permite que el cliente JS (list()/download()) funcione
-- para cualquiera, no solo la URL pública directa.
create policy content_images_read_public
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'content-images');

-- Solo administradores pueden subir, reemplazar o eliminar archivos.
create policy content_images_insert_admin
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'content-images' and public.is_admin());

create policy content_images_update_admin
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'content-images' and public.is_admin())
  with check (bucket_id = 'content-images' and public.is_admin());

create policy content_images_delete_admin
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'content-images' and public.is_admin());
