import { eventItems, pastEventItems, MODALIDAD, PARTNERS } from '../data/seed/eventsSeed.js';
import { simulateDelay } from './simulateDelay.js';

// Interfaz pensada para que en la Fase 6 solo cambie la implementación
// interna (leer de Supabase en vez del seed) — quien llama a este servicio
// no debería necesitar cambios.

export function getUpcomingEvents() {
  return simulateDelay(eventItems);
}

export function getPastEvents() {
  return simulateDelay(pastEventItems);
}

export function getEventById(id) {
  const all = [...eventItems, ...pastEventItems];
  return simulateDelay(all.find((e) => e.id === id) || null);
}

export function getModalidadConfig() {
  return simulateDelay(MODALIDAD);
}

export function getPartners() {
  return simulateDelay(PARTNERS);
}
