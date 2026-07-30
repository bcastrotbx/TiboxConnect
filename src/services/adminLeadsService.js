import { supabase } from '../lib/supabase.js';
import { formatShortDateEs } from '../lib/formatters.js';

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): lectura real de
// `infographic_leads` para la nueva sección del admin — solo lectura por
// ahora (RLS de esa tabla no da permisos de update/delete a nadie, ni
// siquiera a administradores, ver supabase/migrations/20260727100900_infographic_leads.sql).

function mapLeadRow(row) {
  return {
    id: row.id,
    name: row.full_name,
    company: row.company || '',
    position: row.position || '',
    email: row.email,
    infographicTitle: row.content_item?.title || 'Infografía eliminada',
    date: formatShortDateEs(row.created_at),
    dateRaw: row.created_at,
  };
}

export async function listInfographicLeads() {
  const { data, error } = await supabase
    .from('infographic_leads')
    .select('*, content_item:content_items(title)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapLeadRow);
}
