-- Fase 6/7/8 — seed de hero_slides
--
-- No estaba pedido explícitamente, pero es necesario: src/services/homeService.js
-- se conecta a esta tabla en esta misma fase (Parte A), y hero_slides estaba
-- vacía (Fase 4 no la sembró). Sin estas filas, el slider de portada del
-- portal quedaría vacío apenas se despliegue esta fase — una regresión
-- visual justo antes del evento de negocio. Se insertan los mismos 4 slides
-- que ya existían como dato de ejemplo hardcodeado en
-- src/data/seed/homeSeed.js, para que el comportamiento visual no cambie.
-- Idempotente: no hay una columna única natural aquí (a diferencia de
-- categories/content_items/events con slug), así que se protege con un
-- guard "insertar solo si la tabla está vacía" en vez de ON CONFLICT.

insert into public.hero_slides (eyebrow, title, highlight_text, description, button_label, image_url, sort_order, is_active)
select * from (values
  ('INFOGRAFÍAS', 'Información que se', 'entiende al instante',
   'Piezas visuales, simples y fáciles de compartir sobre ciberseguridad, cloud y productividad — seleccionadas por nuestros expertos.',
   'Ver infografías', '/assets/hero-slider-1.jpg', 1, true),
  ('NOTICIAS DE LA INDUSTRIA', 'Mantente al día con', 'el sector tecnológico',
   'Las novedades de Microsoft, Google, cloud, IA, ciberseguridad y normativas TI que impactan a tu organización, en un solo lugar.',
   'Leer noticias', '/assets/hero-slider-2.jpg', 2, true),
  ('PRÓXIMOS EVENTOS', 'Conecta con', 'expertos TI',
   'Webinars, talleres presenciales y demos en vivo con especialistas en infraestructura, cloud, ciberseguridad y automatización.',
   'Ver agenda completa', '/assets/hero-slider-3.jpg', 3, true),
  ('TU OPINIÓN CUENTA', 'Queremos saber', 'tu opinión',
   'Tu experiencia guía la evolución de TIBOX Connect. Cuéntanos qué contenido te sirve y qué te gustaría ver en el portal.',
   'Compartir mi opinión', '/assets/hero-universe.jpg', 4, true)
) as v(eyebrow, title, highlight_text, description, button_label, image_url, sort_order, is_active)
where not exists (select 1 from public.hero_slides);
