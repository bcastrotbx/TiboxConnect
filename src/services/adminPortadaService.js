import { supabase } from '../lib/supabase.js';
import { deleteContentImageIfUnused } from './storageService.js';
import { getContactSettings } from './siteSettingsService.js';

export { getContactSettings };

// Fase 6/7/8 (Portada real) — CRUD de /admin/portada contra Supabase.
// Antes los 3 tabs (sliders, categorías, contacto) eran 100% decorativos:
// leían datos de ejemplo y "Guardar cambios" no tenía onClick.

// --- Sliders del hero (tabla hero_slides, ya usada por homeService.getHeroSlides) ---

function mapSlide(row) {
  return {
    id: row.id,
    eyebrow: row.eyebrow || '',
    title: row.title || '',
    highlightText: row.highlight_text || '',
    description: row.description || '',
    buttonLabel: row.button_label || '',
    buttonUrl: row.button_url || '',
    imageUrl: row.image_url || '',
    sortOrder: row.sort_order ?? 0,
    isActive: row.is_active,
  };
}

export async function listHeroSlides() {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapSlide);
}

export async function createHeroSlide(fields) {
  const { data, error } = await supabase.from('hero_slides').insert(fields).select('*').single();
  if (error) throw error;
  return mapSlide(data);
}

export async function updateHeroSlide(id, fields) {
  let previousUrl = null;
  if ('image_url' in fields) {
    const { data } = await supabase.from('hero_slides').select('image_url').eq('id', id).single();
    previousUrl = data?.image_url || null;
  }
  const { error } = await supabase.from('hero_slides').update(fields).eq('id', id);
  if (error) throw error;
  if (previousUrl && previousUrl !== fields.image_url) {
    await deleteContentImageIfUnused(previousUrl);
  }
}

export async function deleteHeroSlide(id) {
  const { data: deleted, error } = await supabase.from('hero_slides').delete().select('image_url').eq('id', id);
  if (error) throw error;
  const imageUrl = deleted?.[0]?.image_url;
  if (imageUrl) await deleteContentImageIfUnused(imageUrl);
}

// --- Categorías de contenido (tabla categories, ya usada para clasificar ---
// --- videos/infografías/noticias en todo el portal) ---
//
// Ajuste posterior: el tab "Bloques de categorías" editaba datos de ejemplo
// que no alimentaban nada real — los 4 bloques de navegación bajo el hero
// (Explora/Noticias/Eventos/Tu Opinión) son chrome hardcodeado en
// homeService.getCategoryBlocks(), sin tabla propia (documentado ahí mismo
// como decisión deliberada). Se repurposa este tab, con permiso de
// Braulio, para editar la tabla `categories` real en su lugar — pasa a
// llamarse "Categorías de contenido".

function mapCategory(row) {
  return {
    id: row.id,
    name: row.name || '',
    slug: row.slug || '',
    description: row.description || '',
    color: row.color || '',
    icon: row.icon || 'grid-3x3',
    sortOrder: row.sort_order ?? 0,
    isActive: row.is_active,
  };
}

export async function listCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapCategory);
}

export async function createCategory(fields) {
  const { data, error } = await supabase.from('categories').insert(fields).select('*').single();
  if (error) throw error;
  return mapCategory(data);
}

export async function updateCategory(id, fields) {
  const { error } = await supabase.from('categories').update(fields).eq('id', id);
  if (error) throw error;
}

export async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// --- Configuración de contacto (tabla site_settings, fila singleton 'contact') ---
// getContactSettings vive en siteSettingsService.js porque también la usa
// el portal público (Services.jsx) — se re-exporta acá para no romper el
// resto de este archivo, que agrupa todo lo que usa /admin/portada.

export async function updateContactSettings(fields) {
  const { error } = await supabase.from('site_settings').update({ data: fields }).eq('id', 'contact');
  if (error) throw error;
}
