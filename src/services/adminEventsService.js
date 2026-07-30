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
    location: row.location || '',
    modality: row.modality,
    visibility: row.visibility,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    dateRaw: row.starts_at,
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

export async function updateEvent(id, fields) {
  const { error } = await supabase.from('events').update(fields).eq('id', id);
  if (error) throw error;
}

// Ajuste posterior (auditoría del panel admin): mismo fix que
// adminContentService.deleteContentItem — limpia el banner en Storage al
// eliminar el evento, en una sola llamada (`.delete().select()`, sin
// consulta previa aparte), solo si ningún otro content_item/evento sigue
// apuntando a esa misma imagen. Ver esa misma función para la nota sobre
// por qué "Editar" no limpia la imagen anterior todavía.
export async function deleteEvent(id) {
  const { data: deleted, error } = await supabase.from('events').delete().select('thumbnail_url').eq('id', id);
  if (error) throw error;
  const thumbnailUrl = deleted?.[0]?.thumbnail_url;
  if (thumbnailUrl) await deleteContentImageIfUnused(thumbnailUrl);
}
