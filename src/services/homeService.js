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
    ctaIcon: 'arrow-right', // sin columna equivalente — el botón es decorativo (sin onClick) desde la Fase 1
    tag: '', // sin columna equivalente — Hero.jsx omite el separador si está vacío
    bg: row.image_url,
  }));
}

export function getCategoryBlocks() {
  return Promise.resolve(CATS);
}
