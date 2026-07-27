import { servicesV2, OFFICES_MAP } from '../data/seed/servicesSeed.js';
import { simulateDelay } from './simulateDelay.js';

// Interfaz pensada para que en la Fase 6 solo cambie la implementación
// interna (leer de Supabase en vez del seed) — quien llama a este servicio
// no debería necesitar cambios.

export function getServiceCatalog() {
  return simulateDelay(servicesV2);
}

export function getOffices() {
  return simulateDelay(OFFICES_MAP);
}
