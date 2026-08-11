import { supabase } from '../lib/supabase.js';
import { MODALIDAD, PARTNERS } from '../data/seed/eventsSeed.js';
import { formatDayMonth, formatTimeRange, modalityLabel } from '../lib/formatters.js';

// Fase 6/7/8 — conectado a Supabase (tabla events). Mismas firmas que en la
// Fase 2. MODALIDAD sigue siendo configuración visual estática (colores/
// íconos por modalidad) — no existe (ni se pidió) una tabla para esto.
// PARTNERS (logos de un set fijo) queda como fallback legacy: el admin
// ahora puede subir el logo real del colaborador por evento
// (partner_logo_url, ver EventCard/Events.jsx), así que este emparejo por
// nombre de texto solo se usa si un evento viejo no tiene logo propio
// subido (ver ajuste posterior en FASE-06-07-08-CONTENIDO-REAL.md).

function matchPartnerSlug(partnerName) {
  if (!partnerName) return null;
  const needle = partnerName.trim().toLowerCase();
  const match = Object.entries(PARTNERS).find(([, p]) => p.name.toLowerCase() === needle);
  return match ? match[0] : null;
}

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): "¿ya se realizó?"
// se calcula comparando starts_at con la hora actual, en vez de un estado
// manual ('completed') — ver razón completa (incluye un bug real de RLS que
// esto corrige) en el ajuste posterior del formulario de eventos. Exportada
// para que Events.jsx/EventoDetailPage.jsx no dupliquen esta comparación.
export function isEventPast(startsAtRaw) {
  return new Date(startsAtRaw).getTime() < Date.now();
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
    partnerLogoUrl: row.partner_logo_url || '',
    img: row.thumbnail_url,
    registrationUrl: row.registration_url,
    desc: row.summary || '',
    resena: row.description || row.summary || '',
    resumen: row.summary || '',
    startsAtRaw: row.starts_at,
    rawStatus: row.status,
    gallery: row.gallery || [],
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

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): antes filtraba
// por status='completed' — un estado que la política de seguridad (RLS)
// nunca permitió leer a un visitante público (events_select_public solo
// autoriza status='published'), así que esta función en realidad nunca
// devolvía nada en producción. Ahora filtra por status='published' (lo
// único que RLS permite) y por fecha ya pasada, que es como se determina
// "ya se realizó" en todo el sitio desde este ajuste.
export async function getPastEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .lt('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapEventRow);
}

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): usada por la
// página de detalle /videoteca/:slug para eventos ya realizados — mismo
// ajuste que getPastEvents (status='published' + fecha pasada, en vez de
// un status='completed' que RLS nunca dejó leer al público).
export async function getEventBySlug(slug) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .lt('starts_at', new Date().toISOString())
    .maybeSingle();

  if (error) throw error;
  return data ? mapEventRow(data) : null;
}

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): usada por la
// página propia /eventos/:slug — a diferencia de getEventBySlug (solo
// realizados, para el caso de /videoteca/:slug), acá el detalle propio de
// Eventos existe para próximos Y realizados, así que no se restringe por
// fecha, solo por status='published' (único valor que RLS permite leer).
export async function getEventDetailBySlug(slug) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
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
    .eq('status', 'published')
    .eq('visibility', 'public')
    .maybeSingle();

  if (error) throw error;
  return data ? mapEventRow(data) : null;
}

// Ajuste posterior — Eventos en un solo bloque (ver nota extensa en
// FASE-06-07-08-CONTENIDO-REAL.md): el inicio y la página /eventos muestran
// próximos y realizados combinados en un único listado. Reutiliza
// getUpcomingEvents/getPastEvents en vez de duplicar la consulta — próximos
// primero (ya vienen ordenados por sort_order/fecha ascendente, o sea lo
// más accionable arriba), luego realizados (ya vienen por fecha
// descendente, el más reciente primero).
export async function getAllEvents() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
  return [...upcoming, ...past];
}

export function getModalidadConfig() {
  return Promise.resolve(MODALIDAD);
}

export function getPartners() {
  return Promise.resolve(PARTNERS);
}
