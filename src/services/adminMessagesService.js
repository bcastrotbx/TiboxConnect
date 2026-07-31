import { supabase } from '../lib/supabase.js';
import { formatShortDateEs } from '../lib/formatters.js';

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): lectura/borrado
// real de `contact_messages` — antes MessagesTable leía datos de ejemplo
// (adminService.getMessages()) y cualquier "Eliminar" solo afectaba el
// estado local del componente, sin persistir entre recargas.

const STATUS_LABEL = { new: 'Nuevo', read: 'Leído', resolved: 'Respondido' };

function mapMessageRow(row) {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    empresa: row.company || '',
    servicio: row.service || '',
    mensaje: row.message,
    fecha: formatShortDateEs(row.created_at),
    dateRaw: row.created_at,
    estado: STATUS_LABEL[row.status] || row.status,
    rawStatus: row.status,
  };
}

export async function listMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapMessageRow);
}

export async function markMessageRead(id) {
  const { error } = await supabase.from('contact_messages').update({ status: 'read' }).eq('id', id).eq('status', 'new');
  if (error) throw error;
}

export async function deleteMessage(id) {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) throw error;
}
