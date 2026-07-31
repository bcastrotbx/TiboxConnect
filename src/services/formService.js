import { supabase } from '../lib/supabase.js';

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): guardado real en
// contact_messages/feedback — antes solo simulaban el envío (setTimeout) sin
// persistir nada, así que la bandeja de Mensajes/Opiniones del admin nunca
// tenía datos reales que mostrar. Mismo patrón que submitInfografiaLead: RLS
// de ambas tablas permite insert público sin sesión, solo lectura/escritura
// para administradores.

export async function submitContactForm({ name, email, empresa, phone, msg }) {
  const { error } = await supabase.from('contact_messages').insert({
    full_name: name,
    email,
    company: empresa || null,
    phone: phone || null,
    message: msg,
  });
  if (error) throw error;
  return { ok: true };
}

export async function submitOpinionForm({ name, email, msg, rating }) {
  const { error } = await supabase.from('feedback').insert({
    full_name: name,
    email,
    rating: rating || null,
    message: msg,
  });
  if (error) throw error;
  return { ok: true };
}

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): guardado real en
// `infographic_leads` — antes solo simulaba el envío (setTimeout) y no
// persistía nada fuera de sessionStorage. RLS de esa tabla permite insert
// público sin sesión (igual que este formulario, que no requiere login) y
// solo lectura para administradores, así que este insert funciona igual
// para cualquier visitante. `contentItemId` es opcional (columna nullable)
// por si en algún momento se llama sin saber de qué infografía vino.
export async function submitInfografiaLead({ name, empresa, cargo, email, contentItemId }) {
  const { error } = await supabase.from('infographic_leads').insert({
    full_name: name,
    company: empresa || null,
    position: cargo || null,
    email,
    content_item_id: contentItemId || null,
  });
  if (error) throw error;
  return { ok: true };
}
