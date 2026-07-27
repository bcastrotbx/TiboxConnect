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
  };
}

export async function getUpcomingEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .gte('starts_at', new Date().toISOString())
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
