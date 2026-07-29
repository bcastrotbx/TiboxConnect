import { supabase } from '../lib/supabase.js';
import { getActiveCategories } from './categoryService.js';
import { CHANNELS } from '../data/seed/contentSeed.js';
import { formatDurationMinutes, formatShortDateEs } from '../lib/formatters.js';

// Fase 6/7/8 — conectado a Supabase (content_items, type='video'|'infographic').
// Mismas firmas de función que en la Fase 2 para no tocar los componentes
// (Media.jsx) — ver decisiones en docs/phases/FASE-06-07-08-CONTENIDO-REAL.md
// sobre por qué se unificó la taxonomía de categorías (antes 4 listas
// separadas hardcodeadas: VIDEO_CATS/LIB_CATS/INFO_CATS/NEWS_CATS) en una
// sola tabla real `categories`, compartida por los 3 tipos de contenido.
//
// Solo se leen filas status='published' y visibility='public': el portal es
// 100% público (ADR-004) y no hay usuarios finales autenticados todavía, así
// que no hay ninguna sesión que debiera ver contenido 'authenticated'. Se
// filtra explícitamente en la consulta (no "traer todo y filtrar en el
// cliente"), aunque RLS ya lo exigiría de todas formas.

function mapContentRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    cat: row.category?.slug || null,
    libCat: row.category?.slug || null, // misma categoría para ambos filtros (ver decisión de unificación)
    thumb: row.thumbnail_url,
    title: row.title,
    summary: row.summary || '',
    dur: formatDurationMinutes(row.duration_minutes),
    date: formatShortDateEs(row.published_at || row.created_at),
    dateRaw: row.published_at || row.created_at,
    externalUrl: row.external_url,
  };
}

async function fetchPublished(type) {
  // Orden manual (sort_order) primero — es lo que el admin controla con las
  // flechas arriba/abajo (ver AdminWidgets.jsx, ajuste posterior de la Fase
  // 6/7/8) — y published_at como desempate para filas que compartan
  // sort_order (p.ej. contenido recién creado, todavía en 0). Solo aplica a
  // video/infographic — las noticias tienen su propia consulta en
  // newsService.js, siempre por published_at, sin orden manual.
  const { data, error } = await supabase
    .from('content_items')
    .select('*, category:categories(slug, name, color)')
    .eq('type', type)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) throw error;
  return data || [];
}

export async function getVideos({ category } = {}) {
  const rows = await fetchPublished('video');
  const items = rows.map(mapContentRow);
  return category && category !== 'all' ? items.filter((v) => v.cat === category) : items;
}

export async function getVideoLibrary({ category, query } = {}) {
  const rows = await fetchPublished('video');
  const q = (query || '').toLowerCase();
  return rows
    .map(mapContentRow)
    .filter((v) => (!category || category === 'all' || v.libCat === category) && v.title.toLowerCase().includes(q));
}

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): usada por la
// página de detalle /videoteca/:slug — busca un video individual por su
// slug real (no por id), igual que el resto del portal público hace con
// noticias/infografías. Devuelve null si no existe o no está publicado (la
// página de detalle lo trata como "no encontrado", no como un error).
export async function getVideoBySlug(slug) {
  const { data, error } = await supabase
    .from('content_items')
    .select('*, category:categories(slug, name, color)')
    .eq('type', 'video')
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .maybeSingle();

  if (error) throw error;
  return data ? mapContentRow(data) : null;
}

export async function getVideoCategories() {
  const cats = await getActiveCategories();
  return [{ id: 'all', label: 'Todos', color: 'var(--navy-900)' }, ...cats];
}

export async function getVideoLibraryCategories() {
  // Misma lista que getVideoCategories(): se unificó la taxonomía de la
  // videoteca rápida y la biblioteca completa en una sola (ver decisión en
  // FASE-06-07-08-CONTENIDO-REAL.md).
  return getVideoCategories();
}

export async function getInfographics({ category } = {}) {
  const rows = await fetchPublished('infographic');
  const items = rows.map((row) => ({
    id: row.id,
    img: row.thumbnail_url,
    cat: row.category?.slug || null,
    channel: null, // sin equivalente en el modelo de datos — ver decisión
    title: row.title,
    summary: row.summary,
  }));
  return category && category !== 'all' ? items.filter((i) => i.cat === category) : items;
}

export async function getInfographicCategories() {
  const cats = await getActiveCategories();
  return [{ id: 'all', label: 'Todas', color: 'var(--navy-900)' }, ...cats];
}

// CHANNELS (LinkedIn/Instagram/Mailing) es configuración visual fija de las
// redes por las que TIBOX comparte infografías, no contenido — no existe (ni
// se pidió) una columna "channel" en content_items, así que se mantiene como
// configuración estática. InfografiaModal ya maneja con gracia un
// `info.channel` ausente (fallback a ícono/color genérico).
export function getChannels() {
  return Promise.resolve(CHANNELS);
}
