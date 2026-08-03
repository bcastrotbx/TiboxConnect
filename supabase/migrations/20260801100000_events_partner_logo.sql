-- Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): el logo del
-- colaborador de un evento se resolvía emparejando `partner_name` (texto
-- libre) contra un set fijo de logos estáticos en el código (PARTNERS en
-- eventsSeed.js) — si el nombre no calzaba exacto, o el partner no estaba
-- en esa lista chica, no había logo real que mostrar. Se agrega una columna
-- para subir el logo real del colaborador (bucket content-images, igual
-- que el resto de las imágenes del admin) en vez de depender de ese
-- emparejo. `partner_name` se mantiene — sigue siendo el texto alternativo
-- y el fallback cuando no hay logo subido.

alter table public.events
  add column if not exists partner_logo_url text;
