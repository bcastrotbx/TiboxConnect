import { supabase } from '../lib/supabase.js';
import { getActiveCategories } from './categoryService.js';
import { formatShortDateEs, estimateReadTime } from '../lib/formatters.js';

// Fase 6/7/8 — conectado a Supabase (content_items, type='news'). Mismas
// firmas que en la Fase 2, ver contentService.js para el detalle de por qué
// la taxonomía de categorías se unificó en una sola tabla real.

function mapNewsRow(row) {
  return {
    id: row.id,
    cat: row.category?.slug || null,
    source: row.source_name || '',
    date: formatShortDateEs(row.published_at || row.created_at),
    title: row.title,
    img: row.thumbnail_url || null,
    // Si no hay cuerpo completo (p.ej. contenido migrado antes de tener este
    // campo), se usa el resumen para que el popup nunca quede en blanco.
    body: row.body || row.summary || '',
  };
}

async function fetchPublishedNews() {
  const { data, error } = await supabase
    .from('content_items')
    .select('*, category:categories(slug, name, color)')
    .eq('type', 'news')
    .eq('status', 'published')
    .eq('visibility', 'public')
    // Más reciente primero. `nullsFirst: false` es explícito a propósito:
    // Postgres ordena NULLS FIRST por defecto en un order descendente, así
    // que sin esto una fila con published_at nulo aparecería primera en vez
    // de al final.
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) throw error;
  return data || [];
}

export async function getNews({ category } = {}) {
  const rows = await fetchPublishedNews();
  const items = rows.map(mapNewsRow);
  return category && category !== 'all' ? items.filter((n) => n.cat === category) : items;
}

export async function getNewsCategories() {
  const cats = await getActiveCategories();
  return [{ id: 'all', label: 'Todas', color: 'var(--navy-900)' }, ...cats];
}

export async function getFeaturedNews() {
  const { data, error } = await supabase
    .from('content_items')
    .select('*, category:categories(slug, name, color)')
    .eq('type', 'news')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .eq('is_featured', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(1);

  if (error) throw error;
  const row = (data || [])[0];
  if (!row) return null;

  return {
    cat: row.category?.slug || null,
    img: row.thumbnail_url,
    date: formatShortDateEs(row.published_at || row.created_at),
    readtime: estimateReadTime(row.body),
    title: row.title,
    excerpt: row.summary,
    body: row.body || row.summary || '',
    url: row.external_url || null,
  };
}
