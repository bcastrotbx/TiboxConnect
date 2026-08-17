import {
  CONTENT_ITEMS,
  ICON_LIBRARY, CONTENT_TYPE_CATEGORIES,
} from '../data/seed/adminSeed.js';
import { simulateDelay } from './simulateDelay.js';
import * as analyticsService from './analyticsService.js';
import * as adminMessagesService from './adminMessagesService.js';
import * as adminOpinionsService from './adminOpinionsService.js';

// Interfaz pensada para que en la Fase 6 solo cambie la implementación
// interna (leer/escribir contra Supabase en vez del seed) — quien llama a
// este servicio no debería necesitar cambios. Las mutaciones (duplicar,
// eliminar, guardar) siguen viviendo en el estado local de cada página del
// admin, tal como en la Fase 1 — no hay persistencia real todavía.

// Ajuste posterior (rediseño del Dashboard): los 3 KPIs de arriba dejan de
// ser datos de ejemplo — cada uno lee de la misma fuente que ya usa su
// sección dedicada, sin duplicar lógica de conteo/promedio en otro lugar.
// "Nuevas inscripciones a eventos" se quita (no era parte del pedido, y
// event_registrations no tiene una vista de admin propia todavía).
export async function getDashboardStats() {
  const [pageStats, messages, opinions] = await Promise.all([
    analyticsService.getPageViewStats({ days: 30 }),
    adminMessagesService.listMessages(),
    adminOpinionsService.listOpinions(),
  ]);

  const unreadMessages = messages.filter((m) => m.rawStatus === 'new').length;
  const avgRating = opinions.length
    ? opinions.reduce((sum, o) => sum + (o.rating || 0), 0) / opinions.length
    : 0;

  return [
    {
      value: pageStats.totalViews.toLocaleString('es-CL'),
      label: 'Visitas al portal (30 días)',
      icon: 'trending-up',
      accent: 'var(--brand-cyan)',
      tint: 'rgba(0,200,250,0.12)',
    },
    {
      value: String(unreadMessages),
      label: 'Mensajes de contacto sin leer',
      icon: 'mail',
      accent: 'var(--brand-orange)',
      tint: 'rgba(255,103,7,0.12)',
    },
    {
      value: opinions.length ? `${avgRating.toFixed(1)} / 5` : '—',
      label: 'Satisfacción promedio',
      icon: 'star',
      accent: 'var(--brand-yellow)',
      tint: 'rgba(255,198,0,0.14)',
    },
  ];
}

export function getContentItems(section) {
  return simulateDelay(CONTENT_ITEMS[section] || []);
}

// Campanita del header del admin (ver AdminHeader.jsx): antes datos de
// ejemplo (NOTIFICATIONS, adminSeed.js) que no reflejaban nada real. Suma
// dos fuentes ya existentes en el admin, sin duplicar su lógica de conteo:
// - Mensajes de contacto sin leer: misma condición que la tarjeta del
//   Dashboard (contact_messages.status === 'new').
// - Opiniones "nuevas": `feedback` no tiene un estado de revisada/leída (a
//   diferencia de contact_messages) y agregar uno implicaría una migración
//   + wiring de "marcar como revisada" en OpinionsPanel, fuera del alcance
//   de este ajuste. Se usa antigüedad reciente (últimos 7 días) como proxy
//   de "pendiente de revisar" — alternativa explícitamente aceptada para
//   este caso en vez de la migración.
const RECENT_OPINION_MS = 7 * 24 * 60 * 60 * 1000;

export async function getPendingNotifications() {
  const [messages, opinions] = await Promise.all([
    adminMessagesService.listMessages(),
    adminOpinionsService.listOpinions(),
  ]);

  const unreadMessages = messages.filter((m) => m.rawStatus === 'new');
  const now = Date.now();
  const recentOpinions = opinions.filter((o) => o.dateRaw && now - new Date(o.dateRaw).getTime() <= RECENT_OPINION_MS);

  return {
    count: unreadMessages.length + recentOpinions.length,
    messages: unreadMessages.slice(0, 5),
    opinions: recentOpinions.slice(0, 5),
  };
}

export function getIconLibrary() {
  return simulateDelay(ICON_LIBRARY);
}

export function getContentTypeCategories() {
  return simulateDelay(CONTENT_TYPE_CATEGORIES);
}
