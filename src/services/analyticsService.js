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
