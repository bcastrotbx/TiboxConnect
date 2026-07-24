import { SLIDES, CATS } from '../data/seed/homeSeed.js';
import { simulateDelay } from './simulateDelay.js';

// Interfaz pensada para que en la Fase 6 solo cambie la implementación
// interna (leer de Supabase en vez del seed) — quien llama a este servicio
// no debería necesitar cambios.

export function getHeroSlides() {
  return simulateDelay(SLIDES);
}

export function getCategoryBlocks() {
  return simulateDelay(CATS);
}
