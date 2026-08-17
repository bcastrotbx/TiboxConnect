import { supabase } from '../lib/supabase.js';

// Fase Analítica 1 (ver docs/phases/FASE-10-ANALITICA-FASE1.md): lecturas
// para /admin/analitica. Sin vistas materializadas ni cron todavía — con
// el volumen actual del portal, agregar en el cliente sobre la tabla cruda
// es suficiente y evita construir infraestructura que las fases 2-4 (video,
// CTAs, formularios) todavía pueden hacer cambiar de forma. Eso queda para
// la Fase 5 del plan (ver documento de análisis), cuando ya haya varias
// fases de eventos distintos conviviendo en la misma tabla.

const SECTION_LABELS = {
  home: 'Inicio',
  videoteca: 'Videos y Webinars',
  infografias: 'Infografías',
  tendencias: 'Tendencias',
  eventos: 'Eventos',
  otro: 'Otro',
};

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat('es-CL', { month: 'short', year: 'numeric' });

async function fetchPageViews(days) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('analytics_events')
    .select('anonymous_id, section, created_at')
    .eq('event_type', 'page_view')
    .gte('created_at', since);

  if (error) throw error;
  return data || [];
}

// Un solo fetch para las dos vistas de "Resumen general" +
// "Secciones más visitadas" — ambas leen los mismos page_view del mismo
// rango, así que se calculan sobre el mismo array en vez de consultar dos
// veces.
export async function getPageViewStats({ days = 30 } = {}) {
  const rows = await fetchPageViews(days);

  const uniqueVisitors = new Set(rows.map((r) => r.anonymous_id)).size;

  const countsBySection = {};
  for (const row of rows) {
    const key = row.section || 'otro';
    countsBySection[key] = (countsBySection[key] || 0) + 1;
  }
  const topSections = Object.entries(countsBySection)
    .map(([section, views]) => ({ section, label: SECTION_LABELS[section] || section, views }))
    .sort((a, b) => b.views - a.views);

  return { totalViews: rows.length, uniqueVisitors, topSections };
}

// Histórico mensual para el bloque "Resumen general". Se agrupa por
// año-mes en el cliente en vez de crear una vista/función SQL — mismo
// criterio que fetchPageViews/getPageViewStats más arriba: con el volumen
// actual del portal no hace falta infraestructura de agregación en la base
// (equivalente a `date_trunc('month', created_at)`, solo que calculado acá
// en vez de en Postgres). Incluye meses sin visitas en 0, para que el
// gráfico no salte fechas.
async function fetchPageViewsSince(sinceIso) {
  const { data, error } = await supabase
    .from('analytics_events')
    .select('created_at')
    .eq('event_type', 'page_view')
    .gte('created_at', sinceIso);

  if (error) throw error;
  return data || [];
}

export async function getMonthlyPageViews({ months = 6 } = {}) {
  const firstMonth = new Date();
  firstMonth.setDate(1);
  firstMonth.setHours(0, 0, 0, 0);
  firstMonth.setMonth(firstMonth.getMonth() - (months - 1));

  const rows = await fetchPageViewsSince(firstMonth.toISOString());

  const countsByMonth = {};
  for (const row of rows) {
    const d = new Date(row.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    countsByMonth[key] = (countsByMonth[key] || 0) + 1;
  }

  const result = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + (months - 1 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    result.push({ month: key, label: MONTH_LABEL_FORMATTER.format(d), views: countsByMonth[key] || 0 });
  }
  return result;
}

// Fase Analítica 2 (tracking de video, ver docs/phases/): ranking de
// "Videos más vistos". Agrupa por `content_id` (el ID de YouTube, ver
// trackVideoPlay en src/lib/analytics.js) — `content_title` viene
// denormalizado en cada evento, así que no hace falta un join contra
// content_items para mostrar el título. La tasa de finalización es
// aproximada a propósito (video_complete / video_play, ver comentario en
// YouTubePlayer.jsx sobre los milestones de progreso) — queda en null
// cuando no hay ninguna reproducción completada todavía, para no mostrar
// "0%" como si fuera un dato real.
async function fetchVideoEvents(days) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('analytics_events')
    .select('event_type, content_id, content_title')
    .in('event_type', ['video_play', 'video_complete'])
    .gte('created_at', since);

  if (error) throw error;
  return data || [];
}

export async function getMostWatchedVideos({ days = 30, limit = 10 } = {}) {
  const rows = await fetchVideoEvents(days);

  const byVideo = {};
  for (const row of rows) {
    if (!row.content_id) continue;
    if (!byVideo[row.content_id]) {
      byVideo[row.content_id] = { videoId: row.content_id, title: row.content_title || row.content_id, plays: 0, completes: 0 };
    }
    if (row.content_title) byVideo[row.content_id].title = row.content_title;
    if (row.event_type === 'video_play') byVideo[row.content_id].plays += 1;
    else if (row.event_type === 'video_complete') byVideo[row.content_id].completes += 1;
  }

  return Object.values(byVideo)
    .map((v) => ({ ...v, completionRate: v.completes > 0 ? Math.round((v.completes / v.plays) * 100) : null }))
    .sort((a, b) => b.plays - a.plays)
    .slice(0, limit);
}
