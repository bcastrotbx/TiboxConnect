import { supabase } from '../lib/supabase.js';
import { simulateDelay } from './simulateDelay.js';

// submitContactForm/submitOpinionForm siguen simulados (setTimeout, sin
// backend real) — ver docs/phases/FASE-02-RUTAS-Y-DATOS.md. Conectarlos a
// Supabase (contact_messages/feedback) queda para una fase posterior; no
// forma parte de este ajuste. Las firmas ya devuelven Promise<{ ok: boolean }>
// para que ese cambio futuro solo toque la implementación interna.

export function submitContactForm(_data) {
  return simulateDelay({ ok: true }, 1200);
}

export function submitOpinionForm(_data) {
  return simulateDelay({ ok: true }, 1200);
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
