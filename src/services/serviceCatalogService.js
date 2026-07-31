import { supabase } from '../lib/supabase.js';
import { OFFICES_MAP } from '../data/seed/servicesSeed.js';
import { simulateDelay } from './simulateDelay.js';

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): getServiceCatalog()
// ahora lee la tabla real `services` en vez del seed estático — el bloque
// público sigue oculto hoy (SHOW_SERVICES=false en HomePage.jsx), pero ya
// muestra el mismo catálogo que edita el admin en vez de datos congelados
// en el código. getOffices() se mantiene con el seed (no hay tabla ni se
// pidió una para las oficinas mostradas en mapas).

export async function getServiceCatalog() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data || []).map((row) => ({
    id: row.slug,
    label: row.label,
    desc: row.description || '',
    gradient: row.gradient || '',
    logo: row.logo_url || '',
    icon: row.icon || 'briefcase',
    detail: row.detail || { fullName: row.label, intro: '', groups: [] },
  }));
}

export function getOffices() {
  return simulateDelay(OFFICES_MAP);
}
