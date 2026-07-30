-- Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): dos pares de
-- infografías compartían la misma imagen (thumbnail_url) — "5 señales de
-- que tu empresa necesita migrar a la nube" / "Los 5 pilares de la
-- transformación digital empresarial", y "Checklist de respaldo 3-2-1:
-- protege tu información" / "Automatización de procesos: por dónde
-- empezar". Se reasigna una imagen nueva y distinta a la segunda de cada
-- par (elegida de la misma fuente — Unsplash — que ya usa el resto del
-- seed) para que cada infografía tenga una imagen única. No se toca la
-- primera de cada par ni ninguna otra fila.

update public.content_items
set thumbnail_url = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop'
where type = 'infographic'
  and title = 'Los 5 pilares de la transformación digital empresarial';

update public.content_items
set thumbnail_url = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=450&fit=crop'
where type = 'infographic'
  and title = 'Automatización de procesos: por dónde empezar';
