import { supabase } from '../lib/supabase.js';

// Fase 6/7/8 — categorías reales de public.categories, compartidas por
// videos, infografías y noticias (una sola taxonomía, ver docs/DATA-MODEL.md
// y la decisión documentada en FASE-06-07-08-CONTENIDO-REAL.md sobre por qué
// se unificaron las 4 taxonomías separadas del prototipo original en una
// sola tabla real).
export async function getActiveCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, color')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return (data || []).map((c) => ({ id: c.slug, label: c.name, color: c.color || 'var(--navy-900)' }));
}
