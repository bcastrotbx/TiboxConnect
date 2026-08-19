import { supabase } from '../lib/supabase.js';

// Ajuste posterior (caso real: invitación a pfarias@tibox.cl, otp_expired):
// el action_link crudo que devuelve generateLink() es una URL GET de un
// solo uso (.../auth/v1/verify?token=...&type=invite&redirect_to=...).
// Slack/Teams/WhatsApp generan automáticamente una tarjeta de vista previa
// al pegar un link — para eso hacen su propio GET a esa URL apenas se pega
// el mensaje, antes de que la persona invitada haga clic real. Esa petición
// automática consume el token de un solo uso; cuando la persona invitada
// hace clic de verdad, el enlace ya está muerto (otp_expired). No cambia
// nada de cómo Supabase/la Edge Function generan el link — solo se extrae
// el token y el type acá, del lado del cliente, y se arma un enlace propio
// del portal (/aceptar-invitacion) que no dispara ninguna verificación
// automática al cargar (ver AceptarInvitacionPage.jsx) — un GET de vista
// previa no ejecuta el clic real del botón "Aceptar invitación", así que el
// token queda intacto hasta que la persona invitada de verdad abre el link.
function buildSecureInviteLink(actionLink) {
  try {
    const url = new URL(actionLink);
    const token = url.searchParams.get('token');
    const type = url.searchParams.get('type') || 'invite';
    if (!token) return actionLink; // no debería pasar; fallback al link original
    return `${window.location.origin}/aceptar-invitacion?token=${encodeURIComponent(token)}&type=${encodeURIComponent(type)}`;
  } catch {
    return actionLink; // fallback si el parseo falla por lo que sea
  }
}

// Fase 5 — invitar administradores adicionales (ver ADR-005 y ADR-004).
// A diferencia del resto de src/services/*, esta función SÍ está conectada
// a Supabase desde ya (no simula datos de seed): la invitación de admins no
// tiene forma de simularse de manera útil, y depende de la Edge Function
// supabase/functions/invite-admin, que es la única pieza con privilegios
// para crear cuentas (requiere la service_role key, que nunca puede vivir
// en el frontend).
//
// Ajuste posterior (ver FASE-05-AUTENTICACION.md): la Edge Function ahora
// devuelve `actionLink` — el enlace de invitación en sí, para que la UI lo
// muestre con un botón "Copiar" en vez de depender únicamente de que el
// correo automático de Supabase llegue (ver razón completa en el comentario
// de la Edge Function).
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
  // Ajuste posterior (confirmado en vivo por el cliente): la Edge Function
  // responde con { data: { invited, userId, actionLink } } — su propio
  // helper `json()` envuelve el body en una clave `data`. Antes de este
  // ajuste se devolvía ese objeto completo tal cual, así que
  // `data.actionLink` en UsuariosPage.jsx siempre era `undefined` (el valor
  // real vivía en `data.data.actionLink`) y el bloque de enlace/botón
  // "Copiar" nunca se mostraba, aunque el mensaje de éxito sí. Se desenvuelve
  // acá para que el llamador reciba directamente { invited, userId, actionLink }.
  return {
    data: { ...data.data, actionLink: buildSecureInviteLink(data.data.actionLink) },
    error: null,
  };
}

// Fase 9 (ver FASE-09-NOTICIAS-DETALLE-Y-ADMIN.md, punto 2.3) — listado de
// administradores registrados, solo lectura por ahora. Usa el RPC
// list_admin_profiles() (migración 20260812100000) en vez de un SELECT
// directo sobre profiles porque el correo vive en auth.users, que
// PostgREST no expone — ver el comentario completo en esa migración.
//
// Ajuste posterior (ver FASE-09D-VISIBILIDAD-INVITACION-ADMIN.md): se
// agrega `hasSignedIn`, derivado de auth.users.last_sign_in_at (expuesto
// por la migración 20260812120000) — permite distinguir en la UI una
// cuenta que ya aceptó la invitación y definió su contraseña de una que
// sigue con la invitación sin abrir. No cambia nada del momento en que se
// otorga role='admin' (ver ADR-005) ni agrega ningún paso de aprobación —
// es solo un dato de lectura.
export async function listAdmins() {
  const { data, error } = await supabase.rpc('list_admin_profiles');
  if (error) throw error;
  return (data || []).map((row) => ({
    id: row.id,
    fullName: row.full_name || '',
    email: row.email || '',
    status: row.status === 'blocked' ? 'Bloqueado' : 'Activo',
    hasSignedIn: row.last_sign_in_at != null,
  }));
}
