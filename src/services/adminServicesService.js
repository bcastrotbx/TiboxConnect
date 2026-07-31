import { supabase } from '../lib/supabase.js';

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): CRUD real contra
// la tabla `services` — antes /admin/contenidos/servicios editaba un
// dataset de ejemplo sin ninguna relación con el catálogo público real
// (ver migración 20260731100300_services.sql para el detalle completo).

function mapServiceRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    label: row.label,
    description: row.description || '',
    icon: row.icon || 'briefcase',
    gradient: row.gradient || '',
    logoUrl: row.logo_url || '',
    detail: row.detail || { fullName: '', intro: '', groups: [] },
    sortOrder: row.sort_order ?? 0,
    isActive: row.is_active,
  };
}

export async function listServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapServiceRow);
}

export async function createService(fields) {
  const { data, error } = await supabase.from('services').insert(fields).select('*').single();
  if (error) throw error;
  return mapServiceRow(data);
}

export async function updateService(id, fields) {
  const { error } = await supabase.from('services').update(fields).eq('id', id);
  if (error) throw error;
}

export async function deleteService(id) {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
}
