import { supabase } from '../lib/supabase.js';
import { formatShortDateEs } from '../lib/formatters.js';

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): lectura/borrado
// real de `feedback` — antes OpinionsPanel leía datos de ejemplo
// (adminService.getOpinions()) y no tenía ninguna acción de borrado (a
// diferencia de Mensajes, que sí la tenía aunque fuera solo local).

function mapOpinionRow(row) {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    rating: row.rating || 0,
    mensaje: row.message || '',
    fecha: formatShortDateEs(row.created_at),
    dateRaw: row.created_at,
  };
}

export async function listOpinions() {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapOpinionRow);
}

export async function deleteOpinion(id) {
  const { error } = await supabase.from('feedback').delete().eq('id', id);
  if (error) throw error;
}
