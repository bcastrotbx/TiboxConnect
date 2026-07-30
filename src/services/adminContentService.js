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
// Ajuste posterior (auditoría del panel admin): "Publicaciones recientes"
// del Dashboard usaba `ContentTable section="recent"`, pero `SECTION_TO_TYPE`
// (AdminWidgets.jsx) no tiene una entrada 'recent' — `listContentItems(undefined)`
// terminaba filtrando por `type=undefined`, así que la tabla siempre se veía
// vacía sin importar cuánto contenido real hubiera. Esta función sí trae
// contenido real, combinando los 3 tipos por fecha de creación — se usa
// solo para ese widget de resumen (de solo lectura, ver ContentTable).
export async function listRecentContentItems(limit = 8) {
  const { data, error } = await supabase
    .from('content_items')
    .select('*, category:categories(id, slug, name)')
    .in('type', ['video', 'infographic', 'news'])
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map(mapAdminRow);
}

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

// Ajuste posterior (auditoría del panel admin): eliminar no limpiaba la
// imagen subida a Storage — cada borrado dejaba un archivo huérfano en el
// bucket `content-images` para siempre. `.delete().select()` trae la fila
// borrada en la misma llamada (sin una consulta previa aparte) para saber
// qué imagen limpiar; la limpieza en sí solo procede si ningún otro
// content_item/evento sigue usando esa URL (ver
// storageService.deleteContentImageIfUnused). Nota: se probó primero una
// versión con un SELECT previo a editar/eliminar para poder limpiar
// también al reemplazar una imagen desde "Editar" — se revirtió esa parte
// porque, en las pruebas de esta auditoría, agregar esa consulta extra
// coincidió con que la operación se colgara indefinidamente (ver bug
// "crear contenido nuevo se cuelga" en el informe de auditoría — no se
// pudo confirmar si la causa es la misma). Editar sigue sin limpiar la
// imagen anterior; solo eliminar lo hace, con esta única consulta.
export async function deleteContentItem(id) {
  const { data: deleted, error } = await supabase.from('content_items').delete().select('thumbnail_url').eq('id', id);
  if (error) throw error;
  const thumbnailUrl = deleted?.[0]?.thumbnail_url;
  if (thumbnailUrl) await deleteContentImageIfUnused(thumbnailUrl);
}
