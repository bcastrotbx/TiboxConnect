import { supabase } from '../lib/supabase.js';
import { makeSlug } from '../lib/slugify.js';
import { formatShortDateEs } from '../lib/formatters.js';
import { deleteContentImageIfUnused } from './storageService.js';

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
    type: row.type,
    slug: row.slug,
    title: row.title,
    cat: row.category?.name || '—',
    categoryId: row.category_id || '',
    status: STATUS_LABEL[row.status] || row.status,
    rawStatus: row.status,
    date: formatShortDateEs(row.published_at || row.created_at),
    dateRaw: row.published_at || row.created_at,
    isFeatured: row.is_featured,
    summary: row.summary || '',
    body: row.body || '',
    thumbnailUrl: row.thumbnail_url || '',
    externalUrl: row.external_url || '',
    durationMinutes: row.duration_minutes || '',
    sourceName: row.source_name || '',
    visibility: row.visibility,
    sortOrder: row.sort_order ?? 0,
  };
}

// video/infographic: mismo orden manual (sort_order) que ve el portal
// público, para que las flechas de reordenar del admin sean fieles a lo que
// el usuario final ve. news: se excluye del reordenamiento manual (ver
// ajuste posterior en FASE-06-07-08-CONTENIDO-REAL.md) — siempre por fecha
// de publicación descendente, igual que en el portal (newsService.js).
export async function listContentItems(type) {
  let query = supabase
    .from('content_items')
    .select('*, category:categories(id, slug, name)')
    .eq('type', type);

  query = type === 'news'
    ? query.order('published_at', { ascending: false, nullsFirst: false })
    : query.order('sort_order', { ascending: true });

  const { data, error } = await query;

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

// Ajuste posterior (auditoría del panel admin): al reemplazar la imagen de
// un contenido desde "Editar", la imagen anterior quedaba huérfana en
// Storage — igual que el problema que ya se corrigió para "Eliminar". Si
// `fields` trae un `thumbnail_url` nuevo, se lee primero la URL anterior;
// tras un update exitoso, si la URL cambió, se limpia la anterior (solo si
// ningún otro content_item/evento sigue usándola, ver
// storageService.deleteContentImageIfUnused).
export async function updateContentItem(id, fields) {
  let previousUrl = null;
  if ('thumbnail_url' in fields) {
    const { data } = await supabase.from('content_items').select('thumbnail_url').eq('id', id).single();
    previousUrl = data?.thumbnail_url || null;
  }
  const { error } = await supabase.from('content_items').update(fields).eq('id', id);
  if (error) throw error;
  if (previousUrl && previousUrl !== fields.thumbnail_url) {
    await deleteContentImageIfUnused(previousUrl);
  }
}

// Ajuste posterior (auditoría del panel admin): eliminar no limpiaba la
// imagen subida a Storage — cada borrado dejaba un archivo huérfano en el
// bucket `content-images` para siempre. `.delete().select()` trae la fila
// borrada en la misma llamada (sin una consulta previa aparte) para saber
// qué imagen limpiar; la limpieza en sí solo procede si ningún otro
// content_item/evento sigue usando esa URL (ver
// storageService.deleteContentImageIfUnused).
export async function deleteContentItem(id) {
  const { data: deleted, error } = await supabase.from('content_items').delete().select('thumbnail_url').eq('id', id);
  if (error) throw error;
  const thumbnailUrl = deleted?.[0]?.thumbnail_url;
  if (thumbnailUrl) await deleteContentImageIfUnused(thumbnailUrl);
}
