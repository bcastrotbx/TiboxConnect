import { supabase } from '../lib/supabase.js';

// Fase 6/7/8 (Portada real) — lectura pública de site_settings (fila
// singleton 'contact'). Compartido entre el portal público (Services.jsx)
// y el panel admin (adminPortadaService.updateContactSettings escribe
// sobre la misma fila).

export async function getContactSettings() {
  const { data, error } = await supabase.from('site_settings').select('data').eq('id', 'contact').single();
  if (error) throw error;
  return data?.data || {};
}
