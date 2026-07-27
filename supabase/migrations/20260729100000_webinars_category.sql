-- Fase 6/7/8 — categoría "Webinars"
--
-- Pedido explícito de Braulio: agregar Webinars como categoría real (antes
-- solo existía como chip de filtro hardcodeado en LIB_CATS, sin contenido de
-- ejemplo etiquetado, ver Fase 01B). Mismo patrón idempotente que
-- supabase/seed.sql (ON CONFLICT sobre slug, se puede correr más de una vez).

insert into public.categories (name, slug, description, color, icon, sort_order, is_active)
values (
  'Webinars',
  'webinars',
  'Charlas y sesiones en vivo grabadas, disponibles para ver on-demand.',
  '#6a3ed0',
  'presentation',
  4,
  true
)
on conflict (slug) do nothing;
