import { newsItems, NEWS_CATS, featuredNews } from '../data/seed/newsSeed.js';
import { simulateDelay } from './simulateDelay.js';

// Interfaz pensada para que en la Fase 6 solo cambie la implementación
// interna (leer de Supabase en vez del seed) — quien llama a este servicio
// no debería necesitar cambios.

export function getNews({ category } = {}) {
  const items = category && category !== 'all' ? newsItems.filter((n) => n.cat === category) : newsItems;
  return simulateDelay(items);
}

export function getNewsCategories() {
  return simulateDelay(NEWS_CATS);
}

export function getFeaturedNews() {
  return simulateDelay(featuredNews);
}
