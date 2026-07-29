import { supabase } from '../lib/supabase.js';
import { MODALIDAD, PARTNERS } from '../data/seed/eventsSeed.js';
import { formatDayMonth, formatTimeRange, modalityLabel } from '../lib/formatters.js';

// Fase 6/7/8 — conectado a Supabase (tabla events). Mismas firmas que en la
// Fase 2. MODALIDAD y PARTNERS siguen siendo configuración visual estática
// (colores/íconos por modalidad, logos de un set fijo de partners) — no
// existe (ni se pidió) una tabla para esto; events.partner_name es texto
// libre, así que se intenta emparejar contra los partners conocidos y, si no
// hay coincidencia, se muestra el nombre en texto (ver ajuste en
// EventCard/Events.jsx documentado en FASE-06-07-08-CONTENIDO-REAL.md).

function matchPartnerSlug(partnerName) {
  if (!partnerName) return null;
  const needle = partnerName.trim().toLowerCase();
  const match = Object.entries(PARTNERS).find(([, p]) => p.name.toLowerCase() === needle);
  return match ? match[0] : null;
}

function mapEventRow(row) {
  const { day, month, year } = formatDayMonth(row.starts_at);
  return {
    id: row.id,
    slug: row.slug,
    day,
    month,
    year,
    title: row.title,
    modalidad: modalityLabel(row.modality),
    time: formatTimeRange(row.starts_at, row.ends_at),
    place: row.location || '',
    partner: matchPartnerSlug(row.partner_name),
    partnerName: row.partner_name || '',
    img: row.thumbnail_url,
    registrationUrl: row.registration_url,
    desc: row.summary || '',
    resena: row.description || row.summary || '',
    resumen: row.summary || '',
    startsAtRaw: row.starts_at,
    rawStatus: row.status,
  };
}

export async function getUpcomingEvents() {
  // Orden manual (sort_order) primero — controlado con las flechas del panel
  // admin (ver AdminWidgets.jsx, ajuste posterior de la Fase 6/7/8) — y
  // starts_at como desempate. Los eventos realizados (getPastEvents) no
  // participan de este reordenamiento manual, siguen por fecha.
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .gte('starts_at', new Date().toISOString())
    .order('sort_order', { ascending: true })
    .order('starts_at', { ascending: true });

  if (error) throw error;
  return (data || []).map(mapEventRow);
}

export async function getPastEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'completed')
    .eq('visibility', 'public')
    .order('starts_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapEventRow);
}

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): usada por la
// página de detalle /videoteca/:slug para eventos ya realizados — solo
// eventos con status='completed' tienen página de detalle propia; los
// próximos/publicados abren el popup existente (EventDetailModal) en vez de
// navegar, así que no se buscan acá.
export async function getEventBySlug(slug) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'completed')
    .eq('visibility', 'public')
    .maybeSingle();

  if (error) throw error;
  return data ? mapEventRow(data) : null;
}

export async function getEventById(id) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .in('status', ['published', 'completed'])
    .eq('visibility', 'public')
    .maybeSingle();

  if (error) throw error;
  return data ? mapEventRow(data) : null;
}

export function getModalidadConfig() {
  return Promise.resolve(MODALIDAD);
}

export function getPartners() {
  return Promise.resolve(PARTNERS);
}
