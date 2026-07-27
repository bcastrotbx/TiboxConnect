// Fase 6/7/8 — utilidades de formato compartidas por los servicios que ya
// leen de Supabase. Centralizadas aquí para no repetir la lógica de fechas
// en contentService/newsService/eventService.

const MESES_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function formatShortDateEs(dateInput) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')} ${MESES_ES[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDayMonth(dateInput) {
  if (!dateInput) return { day: '--', month: '---', year: '' };
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return { day: '--', month: '---', year: '' };
  return { day: String(d.getDate()).padStart(2, '0'), month: MESES_ES[d.getMonth()], year: String(d.getFullYear()) };
}

export function formatTimeRange(startsAt, endsAt) {
  if (!startsAt) return '';
  const fmt = (v) => {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return '';
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  const start = fmt(startsAt);
  const end = endsAt ? fmt(endsAt) : '';
  return end ? `${start} – ${end}` : start;
}

export function formatDurationMinutes(minutes) {
  if (!minutes && minutes !== 0) return '';
  return `${minutes} min`;
}

// Estimación de tiempo de lectura a ~200 palabras por minuto, calculada
// sobre el cuerpo real de la noticia — no es un dato falso, es un cálculo
// hecho sobre el contenido real (mismo criterio que usan la mayoría de CMS).
export function estimateReadTime(bodyText) {
  const words = (bodyText || '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min de lectura`;
}

// Traduce el enum de modalidad de la base ('online'|'presential'|'hybrid')
// a las etiquetas en español que ya usa MODALIDAD (src/data/seed/eventsSeed.js)
// — así el componente no necesita cambios ni el seed de configuración visual.
const MODALITY_LABELS = {
  online: 'Online',
  presential: 'Presencial',
  hybrid: 'Híbrida',
};

export function modalityLabel(dbValue) {
  return MODALITY_LABELS[dbValue] || 'Online';
}
