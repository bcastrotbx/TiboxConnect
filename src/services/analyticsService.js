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
