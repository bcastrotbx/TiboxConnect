import { supabase } from '../lib/supabase.js';
import { makeSlug } from '../lib/slugify.js';
import { formatShortDateEs } from '../lib/formatters.js';

// Fase 6/7/8 (Parte C) — CRUD real de content_items para el panel admin
// (noticias, infografías, videos/webinars). Cada llamada usa el cliente de
// Supabase con la sesión actual del navegador — si no hay sesión de admin
// activa, RLS rechaza la operación en el servidor sin importar que la ruta
// ya esté protegida por AdminRoute (defensa en profundidad, no solo del
// lado del cliente).

const STATUS_LABEL = { draft: 'Borrador', published: 'Publicado', archived: 'Archivado' };

function mapAdminRow(row) {
  return {
    id: row.id,
    title: row.title,
    cat: row.category?.name || '—',
    categoryId: row.category_id || '',
    status: STATUS_LABEL[row.status] || row.status,
    rawStatus: row.status,
    date: formatShortDateEs(row.published_at || row.created_at),
    isFeatured: row.is_featured,
    summary: row.summary || '',
    body: row.body || '',
    thumbnailUrl: row.thumbnail_url || '',
    externalUrl: row.external_url || '',
    durationMinutes: row.duration_minutes || '',
    sourceName: row.source_name || '',
    visibility: row.visibility,
  };
}

export async function listContentItems(type) {
  const { data, error } = await supabase
    .from('content_items')
    .select('*, category:categories(id, slug, name)')
    .eq('type', type)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapAdminRow);
}

// `fields` usa nombres de columna reales (snake_case) — el formulario del
// admin arma este objeto directamente, así no hay una segunda capa de
// traducción de nombres entre el form y la base.
export async function createContentItem(type, fields) {
  const { error } = await supabase.from('content_items').insert({
    type,
    slug: makeSlug(fields.title),
    ...fields,
  });
  if (error) throw error;
}

export async function updateContentItem(id, fields) {
  const { error } = await supabase.from('content_items').update(fields).eq('id', id);
  if (error) throw error;
}

export async function deleteContentItem(id) {
  const { error } = await supabase.from('content_items').delete().eq('id', id);
  if (error) throw error;
}
