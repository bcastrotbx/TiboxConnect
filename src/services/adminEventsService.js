import { supabase } from '../lib/supabase.js';
import { makeSlug } from '../lib/slugify.js';
import { formatShortDateEs } from '../lib/formatters.js';
import { deleteContentImageIfUnused } from './storageService.js';

// Fase 6/7/8 (Parte C) — CRUD real de events para el panel admin. Mismo
// principio que adminContentService.js: RLS protege cada operación en el
// servidor, no solo la ruta /admin/eventos.

const STATUS_LABEL = { draft: 'Borrador', published: 'Publicado', completed: 'Realizado', archived: 'Archivado' };
const MODALITY_LABEL = { online: 'Online', presential: 'Presencial', hybrid: 'Híbrida' };

function mapAdminRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    cat: MODALITY_LABEL[row.modality] || row.modality, // events no tienen categoría propia (ver DATA-MODEL.md)
    status: STATUS_LABEL[row.status] || row.status,
    rawStatus: row.status,
    date: formatShortDateEs(row.starts_at),
    summary: row.summary || '',
    description: row.description || '',
    thumbnailUrl: row.thumbnail_url || '',
    registrationUrl: row.registration_url || '',
    partnerName: row.partner_name || '',
    partnerLogoUrl: row.partner_logo_url || '',
    location: row.location || '',
    modality: row.modality,
    visibility: row.visibility,
    startsAt: row.starts_at,
    dateRaw: row.starts_at,
    gallery: row.gallery || [],
    sortOrder: row.sort_order ?? 0,
  };
}

// sort_order primero (mismo orden manual que "Próximos Eventos" en el
// portal), starts_at desc como desempate. Los eventos con status='completed'
// no se reordenan manualmente desde el admin (ver ajuste posterior en
// FASE-06-07-08-CONTENIDO-REAL.md) — quedan con sort_order=0 por defecto y
// caen ordenados por fecha entre sí gracias al desempate.
export async function listEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('starts_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapAdminRow);
}

export async function createEvent(fields) {
  const { error } = await supabase.from('events').insert({
    slug: makeSlug(fields.title),
    ...fields,
  });
  if (error) throw error;
}

// Imágenes propias de un evento (banner + logo del colaborador, ambas en
// el bucket content-images) — se limpian de la misma forma al editar o
// eliminar, ver más abajo.
const EVENT_IMAGE_FIELDS = ['thumbnail_url', 'partner_logo_url'];

// Ajuste posterior (auditoría del panel admin): mismo fix que
// adminContentService.updateContentItem — al reemplazar el banner o el
// logo del colaborador desde "Editar", se limpia la imagen anterior en
// Storage si nada más la sigue usando.
//
// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): `gallery` ya no
// se limpia en Storage acá — pasó de ser archivos subidos a enlaces
// pegados a mano (ej. WordPress), así que no hay ningún archivo propio de
// TIBOX que borrar al sacar una URL de la galería.
export async function updateEvent(id, fields) {
  const changedImageFields = EVENT_IMAGE_FIELDS.filter(f => f in fields);
  let previous = {};
  if (changedImageFields.length > 0) {
    const { data } = await supabase.from('events').select(changedImageFields.join(',')).eq('id', id).single();
    previous = data || {};
  }
  const { error } = await supabase.from('events').update(fields).eq('id', id);
  if (error) throw error;
  for (const f of changedImageFields) {
    const previousUrl = previous[f];
    if (previousUrl && previousUrl !== fields[f]) {
      await deleteContentImageIfUnused(previousUrl);
    }
  }
}

// Ajuste posterior (auditoría del panel admin): mismo fix que
// adminContentService.deleteContentItem — limpia el banner y el logo del
// colaborador en Storage al eliminar el evento, en una sola llamada
// (`.delete().select()`, sin consulta previa aparte), solo si ningún otro
// content_item/evento sigue apuntando a esa misma imagen.
export async function deleteEvent(id) {
  const { data: deleted, error } = await supabase.from('events').delete().select(EVENT_IMAGE_FIELDS.join(',')).eq('id', id);
  if (error) throw error;
  for (const f of EVENT_IMAGE_FIELDS) {
    const url = deleted?.[0]?.[f];
    if (url) await deleteContentImageIfUnused(url);
  }
}
