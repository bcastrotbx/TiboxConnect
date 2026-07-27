// Fase 5 — Edge Function: invitar administradores adicionales
//
// Por qué esto no puede vivir en el frontend: invitar usuarios
// (supabase.auth.admin.inviteUserByEmail) requiere la service_role key, que
// tiene privilegios completos sobre el proyecto y NUNCA debe llegar al
// navegador. Esta función corre en el servidor (Deno, gestionado por
// Supabase) y es el único lugar del proyecto que lee esa clave.
//
// Flujo:
//   1. Verifica que quien llama tiene una sesión válida (su JWT, reenviado
//      en el header Authorization) y que su perfil es role='admin' +
//      status='active'. Se usa un cliente "como el usuario que llama"
//      (anon key + su JWT) para esto — RLS se aplica normalmente, no hace
//      falta la service_role key todavía.
//   2. Recién si lo anterior pasa, se crea un segundo cliente con la
//      service_role key y se invita al nuevo usuario
//      (auth.admin.inviteUserByEmail). Esto crea la fila en auth.users, lo
//      que dispara el trigger on_auth_user_created (Fase 4) y crea su
//      profiles con role='user' por defecto.
//   3. Se promueve esa fila a role='admin' inmediatamente, llamando a la
//      función SQL public.promote_to_admin() (Fase 5,
//      20260728100000_promote_to_admin_function.sql). Ver ADR-005 para la
//      justificación de por qué se promueve de inmediato en vez de dejar un
//      estado intermedio "invitado pero no admin todavía".
//
// Límite conocido: el correo de invitación lo envía el servicio de correo
// por defecto de Supabase (no hay SMTP propio configurado — ver
// docs/phases/FASE-05-AUTENTICACION.md). Puede demorar o caer en spam.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  // Restringir a un origen específico (el dominio real del portal) es una
  // mejora sugerida una vez exista un dominio de producción fijo — ver
  // "Pendiente" en FASE-05-AUTENTICACION.md.
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Método no permitido.' }, 405);
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return json({ error: 'Falta el header Authorization.' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      // Estas tres variables las inyecta Supabase automáticamente en todo
      // proyecto — si faltan, algo está mal configurado en el entorno de la
      // función, no en el código.
      return json({ error: 'Faltan variables de entorno reservadas de Supabase en la función.' }, 500);
    }

    // Paso 1: verificar que quien llama es un admin activo. Cliente "como el
    // usuario que llama" — nunca se usa este cliente para invitar ni para
    // promover, solo para leer.
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await callerClient.auth.getUser();
    if (userError || !userData?.user) {
      return json({ error: 'Sesión inválida o expirada.' }, 401);
    }

    const { data: callerProfile, error: profileError } = await callerClient
      .from('profiles')
      .select('role, status')
      .eq('id', userData.user.id)
      .single();

    if (profileError || !callerProfile) {
      return json({ error: 'No se pudo verificar el perfil de quien invita.' }, 403);
    }

    if (callerProfile.role !== 'admin' || callerProfile.status !== 'active') {
      return json({ error: 'Solo administradores activos pueden invitar nuevos administradores.' }, 403);
    }

    const body = await req.json().catch(() => null);
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : '';

    if (!email) {
      return json({ error: 'El correo es obligatorio.' }, 400);
    }

    // Paso 2: recién aquí se usa la service_role key. Nunca antes de
    // confirmar que quien llama ya es admin.
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: { full_name: fullName },
    });

    if (inviteError) {
      return json({ error: `No se pudo invitar: ${inviteError.message}` }, 400);
    }

    const invitedUserId = inviteData?.user?.id;
    if (!invitedUserId) {
      return json({ error: 'La invitación se envió pero no se pudo confirmar el id del usuario creado.' }, 500);
    }

    // Paso 3: promover a role='admin' de inmediato (ver ADR-005). El trigger
    // on_auth_user_created ya creó la fila en profiles con role='user'.
    const { error: promoteError } = await adminClient.rpc('promote_to_admin', {
      target_user_id: invitedUserId,
    });

    if (promoteError) {
      return json({
        error:
          'El usuario fue invitado pero no se pudo asignar el rol de administrador automáticamente. ' +
          'Puedes promoverlo manualmente desde el Table Editor de Supabase (tabla profiles, columna role) ' +
          `para el usuario con id ${invitedUserId}.`,
      }, 500);
    }

    return json({ data: { invited: true, userId: invitedUserId } }, 200);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido.';
    return json({ error: `Error inesperado: ${message}` }, 500);
  }
});
