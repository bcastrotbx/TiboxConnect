import {
  CONTENT_ITEMS, NOTIFICATIONS,
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

export function getNotifications() {
  return simulateDelay(NOTIFICATIONS);
}

export function getIconLibrary() {
  return simulateDelay(ICON_LIBRARY);
}

export function getContentTypeCategories() {
  return simulateDelay(CONTENT_TYPE_CATEGORIES);
}
