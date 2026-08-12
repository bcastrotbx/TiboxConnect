-- Regla "destacado" exclusiva para Noticias (ver prompt "Menú Contacto,
-- regla de destacado en Noticias, y bugs de Portada"): como máximo una
-- noticia puede estar marcada como destacada a la vez.

-- Por qué un trigger y no solo lógica en el cliente (adminContentService.js):
-- un "primero desmarco la anterior, después marco la nueva" hecho con dos
-- llamadas desde el navegador no es atómico — dos administradores editando
-- casi al mismo tiempo (o un reintento de red) podrían dejar dos noticias
-- destacadas a la vez, o ninguna. Un trigger BEFORE INSERT/UPDATE corre
-- dentro de la misma transacción que el propio guardado, así que Postgres
-- serializa cualquier carrera con los locks de fila normales — nunca puede
-- quedar más de una fila con is_featured=true para type='news'.
create or replace function public.enforce_single_featured_news()
returns trigger
language plpgsql
as $$
begin
  update public.content_items
  set is_featured = false
  where type = 'news'
    and is_featured = true
    and id <> new.id;
  return new;
end;
$$;

drop trigger if exists trg_enforce_single_featured_news on public.content_items;

create trigger trg_enforce_single_featured_news
before insert or update of is_featured on public.content_items
for each row
when (new.type = 'news' and new.is_featured = true)
execute function public.enforce_single_featured_news();
