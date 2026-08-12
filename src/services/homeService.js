import { supabase } from '../lib/supabase.js';
import { CATS } from '../data/seed/homeSeed.js';

// Fase 6/7/8 — getHeroSlides() conectado a Supabase (tabla hero_slides).
// getCategoryBlocks() sigue siendo estático: los 4 bloques de navegación
// (Explora/Noticias/Eventos/Tu Opinión) son chrome de navegación del portal,
// no contenido editable — no hay tabla para esto ni se pidió crearla.

export async function getHeroSlides() {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    eyebrow: row.eyebrow || '',
    title: row.title,
    titleAccent: row.highlight_text || '',
    desc: row.description || '',
    cta: row.button_label || '',
    // Ajuste posterior: el botón era decorativo (sin href/onClick) desde la
    // Fase 1 — se descubrió al revisar por qué un button_url guardado desde
    // /admin/portada no producía ningún clic funcional en el home. Ahora se
    // expone el campo real; Hero.jsx decide si renderiza como enlace o como
    // botón inerte según si viene vacío.
    ctaUrl: row.button_url || '',
    ctaIcon: 'arrow-right',
    tag: '', // sin columna equivalente — Hero.jsx omite el separador si está vacío
    bg: row.image_url,
  }));
}

export function getCategoryBlocks() {
  return Promise.resolve(CATS);
}
