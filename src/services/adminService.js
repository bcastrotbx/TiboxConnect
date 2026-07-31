import {
  DASHBOARD_STATS, CONTENT_ITEMS, NOTIFICATIONS,
  ICON_LIBRARY, CONTENT_TYPE_CATEGORIES,
} from '../data/seed/adminSeed.js';
import { simulateDelay } from './simulateDelay.js';

// Interfaz pensada para que en la Fase 6 solo cambie la implementación
// interna (leer/escribir contra Supabase en vez del seed) — quien llama a
// este servicio no debería necesitar cambios. Las mutaciones (duplicar,
// eliminar, guardar) siguen viviendo en el estado local de cada página del
// admin, tal como en la Fase 1 — no hay persistencia real todavía.

export function getDashboardStats() {
  return simulateDelay(DASHBOARD_STATS);
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
