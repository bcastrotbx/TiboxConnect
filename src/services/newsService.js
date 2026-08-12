import { supabase } from '../lib/supabase.js';
import { getActiveCategories } from './categoryService.js';
import { formatShortDateEs, formatDayMonth, estimateReadTime } from '../lib/formatters.js';

// Fase 6/7/8 — conectado a Supabase (content_items, type='news'). Mismas
// firmas que en la Fase 2, ver contentService.js para el detalle de por qué
// la taxonomía de categorías se unificó en una sola tabla real.

function mapNewsRow(row) {
  const { day, month } = formatDayMonth(row.published_at || row.created_at);
  return {
    id: row.id,
    // Ajuste posterior (ver FASE-09-NOTICIAS-DETALLE-Y-ADMIN.md): agregado
    // para la página de detalle propia /tendencias/:slug — antes no se
    // exponía porque nada lo necesitaba (el popup del inicio no navega a
    // ningún lado). day/month siguen el mismo formato que eventService, para
    // reutilizar el mismo bloque visual de "Mira también".
    slug: row.slug,
    day,
    month,
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
    id: row.id,
    // Ajuste posterior (ver FASE-09-NOTICIAS-DETALLE-Y-ADMIN.md): el CTA
    // "Ver publicación" del inicio ahora navega directo a esta noticia.
    slug: row.slug,
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

// Ajuste posterior (ver FASE-09-NOTICIAS-DETALLE-Y-ADMIN.md): usada por la
// página propia /tendencias/:slug — mismo patrón que
// eventService.getEventDetailBySlug / contentService.getVideoBySlug.
export async function getNewsBySlug(slug) {
  const { data, error } = await supabase
    .from('content_items')
    .select('*, category:categories(slug, name, color)')
    .eq('type', 'news')
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .maybeSingle();

  if (error) throw error;
  return data ? mapNewsRow(data) : null;
}
