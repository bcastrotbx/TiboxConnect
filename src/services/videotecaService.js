import * as contentService from './contentService.js';
import * as eventService from './eventService.js';
import { getActiveCategories } from './categoryService.js';

// Ajuste posterior — Videoteca en páginas propias (ver
// FASE-06-07-08-CONTENIDO-REAL.md): antes de este cambio, "Ver todos los
// videos" abría un popup (VideoLibraryModal) que solo listaba
// content_items(type='video'). El pedido de gerencia fue reemplazarlo por
// páginas con URL propia (/videoteca y /videoteca/:slug) que combinan DOS
// fuentes de datos — videos reales y eventos (próximos y realizados) — en
// un solo listado. Este servicio existe para esa combinación: no toca
// contentService.js ni eventService.js más allá de agregarles campos
// (dateRaw/slug) de forma aditiva, y reutiliza sus funciones ya existentes
// en vez de volver a consultar Supabase con lógica duplicada.

// Categorías con "Todas" (así, femenino plural, tal como se pidió para esta
// página) — no reutiliza contentService.getVideoCategories() porque esa
// devuelve "Todos" (masculino), usado en otras partes del portal que no se
// querían tocar.
export async function getVideotecaCategories() {
  const cats = await getActiveCategories();
  return [{ id: 'all', label: 'Todas', color: 'var(--navy-900)' }, ...cats];
}

function normalizeVideo(v) {
  return {
    kind: 'video',
    id: v.id,
    slug: v.slug,
    title: v.title,
    thumb: v.thumb,
    cat: v.cat,
    dur: v.dur,
    date: v.date,
    dateRaw: v.dateRaw,
    isUpcoming: false,
    externalUrl: v.externalUrl,
    summary: v.summary,
  };
}

function normalizeEvent(ev, isUpcoming) {
  return {
    kind: 'event',
    id: ev.id,
    slug: ev.slug,
    title: ev.title,
    thumb: ev.img,
    cat: null,
    dur: '',
    date: `${ev.day} ${ev.month} ${ev.year}`,
    dateRaw: ev.startsAtRaw,
    isUpcoming,
    summary: ev.desc,
    eventData: ev, // fila completa mapeada por eventService — se le pasa tal
                    // cual a EventDetailModal para los eventos "PRÓXIMAMENTE"
                    // sin tener que volver a mapear nada.
  };
}

// `category`: id de categoría real, o 'all'. `order`: 'recent' | 'oldest'.
// `statusFilter`: 'all' | 'completed' | 'upcoming'.
//
// Decisión de diseño: el filtro de categoría solo aplica a videos — los
// eventos no tienen categoría en el modelo de datos actual (la tabla
// `events` no tiene `category_id`). Cuando hay una categoría específica
// seleccionada (no 'all'), los eventos se ocultan del listado combinado en
// vez de mostrarse sin filtrar — mezclar "solo Ciberseguridad" con eventos
// sin categoría habría sido confuso. Con 'all' sí se muestran ambas fuentes
// juntas.
export async function getVideotecaItems({ category = 'all', order = 'recent', statusFilter = 'all' } = {}) {
  const includeVideos = statusFilter === 'all';
  const includeUpcoming = statusFilter === 'all' || statusFilter === 'upcoming';
  const includePast = statusFilter === 'all' || statusFilter === 'completed';
  const includeEvents = category === 'all'; // ver decisión arriba

  const [videos, upcoming, past] = await Promise.all([
    includeVideos ? contentService.getVideos({ category }) : Promise.resolve([]),
    includeUpcoming && includeEvents ? eventService.getUpcomingEvents() : Promise.resolve([]),
    includePast && includeEvents ? eventService.getPastEvents() : Promise.resolve([]),
  ]);

  const items = [
    ...videos.map(normalizeVideo),
    ...upcoming.map((ev) => normalizeEvent(ev, true)),
    ...past.map((ev) => normalizeEvent(ev, false)),
  ];

  items.sort((a, b) => {
    const da = a.dateRaw ? new Date(a.dateRaw).getTime() : 0;
    const db = b.dateRaw ? new Date(b.dateRaw).getTime() : 0;
    return order === 'oldest' ? da - db : db - da;
  });

  return items;
}

// Resuelve el slug de /videoteca/:slug probando primero como video real y
// luego como evento realizado (los próximos eventos nunca tienen página de
// detalle — abren el popup existente, ver VideotecaPage.jsx). Devuelve
// null si no coincide con ninguno de los dos (la página trata esto como
// "no encontrado", no como un error de red).
export async function getVideotecaDetailBySlug(slug) {
  const video = await contentService.getVideoBySlug(slug);
  if (video) return { kind: 'video', data: video };

  const event = await eventService.getEventBySlug(slug);
  if (event) return { kind: 'event', data: event };

  return null;
}
