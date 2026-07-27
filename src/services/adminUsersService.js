import { supabase } from '../lib/supabase.js';

// Fase 5 — invitar administradores adicionales (ver ADR-005 y ADR-004).
// A diferencia del resto de src/services/*, esta función SÍ está conectada
// a Supabase desde ya (no simula datos de seed): la invitación de admins no
// tiene forma de simularse de manera útil, y depende de la Edge Function
// supabase/functions/invite-admin, que es la única pieza con privilegios
// para crear cuentas (requiere la service_role key, que nunca puede vivir
// en el frontend).
export async function inviteAdmin({ email, fullName }) {
  const { data, error } = await supabase.functions.invoke('invite-admin', {
    body: { email, fullName },
  });
  if (error) {
    // supabase-js no siempre expone el mensaje del cuerpo de la respuesta en
    // error.message para errores 4xx/5xx de una Edge Function — se intenta
    // leer el contexto de la respuesta original si está disponible.
    const serverMessage = error?.context?.body?.error;
    return { data: null, error: serverMessage || error.message || 'No se pudo invitar al administrador.' };
  }
  if (data?.error) {
    return { data: null, error: data.error };
  }
  return { data, error: null };
}
