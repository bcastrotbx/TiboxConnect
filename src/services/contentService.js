import { videoItems, VIDEO_CATS, LIB_CATS, infogs, INFO_CATS, CHANNELS } from '../data/seed/contentSeed.js';
import { simulateDelay } from './simulateDelay.js';

// Interfaz pensada para que en la Fase 6 solo cambie la implementación
// interna (leer de Supabase en vez del seed) — quien llama a este servicio
// no debería necesitar cambios.

export function getVideos({ category } = {}) {
  const items = category && category !== 'all' ? videoItems.filter((v) => v.cat === category) : videoItems;
  return simulateDelay(items);
}

export function getVideoLibrary({ category, query } = {}) {
  const q = (query || '').toLowerCase();
  const items = videoItems.filter((v) =>
    (!category || category === 'all' || v.libCat === category) &&
    v.title.toLowerCase().includes(q)
  );
  return simulateDelay(items);
}

export function getVideoCategories() {
  return simulateDelay(VIDEO_CATS);
}

export function getVideoLibraryCategories() {
  return simulateDelay(LIB_CATS);
}

export function getInfographics({ category } = {}) {
  const items = category && category !== 'all' ? infogs.filter((i) => i.cat === category) : infogs;
  return simulateDelay(items);
}

export function getInfographicCategories() {
  return simulateDelay(INFO_CATS);
}

export function getChannels() {
  return simulateDelay(CHANNELS);
}
