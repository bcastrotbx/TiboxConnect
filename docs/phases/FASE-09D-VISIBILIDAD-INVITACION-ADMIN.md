# Fase 9d — Visibilidad de aceptación de invitación en "Administradores"

Continuación de la conversación sobre el flujo de invitación de administradores (ver [ADR-005](../decisions/ADR-005-PROMOCION-ADMIN-EN-INVITACION.md)). Se evaluó agregar un paso de aprobación en dos tiempos (revertir ADR-005) y **se descartó** — el equipo es interno y el riesgo no justifica el costo. En su lugar, se implementó la opción mínima: hacer visible en el panel si un administrador ya aceptó su invitación o sigue con el enlace sin abrir.

## Qué NO cambia (fuera de alcance, confirmado explícitamente)

- El momento en que se otorga `role='admin'` sigue siendo inmediato al invitar — ADR-005 sigue vigente sin modificaciones.
- No se agrega ningún paso de aprobación manual.
- No hay notificación automática por correo cuando alguien acepta.

Este ajuste es **puramente de lectura/visibilidad** — no cambia ningún permiso ni flujo existente.

## Qué cambia

- **`supabase/migrations/20260812120000_admin_profiles_last_sign_in.sql`** (nueva, no modifica la migración de la Fase 9 ya aplicada): `list_admin_profiles()` ahora también devuelve `last_sign_in_at` (de `auth.users`). Postgres no permite `CREATE OR REPLACE FUNCTION` cuando cambia la forma del `RETURNS TABLE`, así que la migración hace `DROP FUNCTION` + `CREATE` de la misma función — mismas restricciones de seguridad que antes (`security definer`, chequeo de `is_admin()` dentro del cuerpo, `revoke` a `public`/`anon`, `grant` solo a `authenticated`).
- **`src/services/adminUsersService.js`**: `listAdmins()` mapea `hasSignedIn: row.last_sign_in_at != null`.
- **`src/admin/pages/UsuariosPage.jsx`**: nueva columna "Invitación" en la tabla, con un badge separado del de "Estado":
  - **"Aceptada"** (verde) si la persona ya inició sesión al menos una vez.
  - **"Invitación pendiente"** (ámbar) si `last_sign_in_at` es nulo — la cuenta existe con `role='admin'`, pero la persona nunca abrió el enlace.

**Por qué un badge separado y no reusar "Activo"/"Inactivo" del "Estado" existente:** "Estado" (`AdminStatusBadge`) es sobre si la cuenta está bloqueada o no (`profiles.status`); esto es sobre si la persona aceptó la invitación (`auth.users.last_sign_in_at`). Son dos conceptos distintos — mezclarlos bajo la misma palabra "Activo" habría sido confuso (una cuenta puede estar "Activo" en estado y aun así nunca haber iniciado sesión).

## Cómo probar

1. **Requiere que Braulio ejecute primero** `supabase/migrations/20260812120000_admin_profiles_last_sign_in.sql` en el SQL Editor de Supabase.
2. Ir a `/admin/usuarios` con sesión de administrador → la tabla "Administradores registrados" debe mostrar una columna "Invitación" adicional.
3. Para un administrador que ya inició sesión alguna vez: badge verde "Aceptada".
4. Para uno recién invitado que todavía no abrió el enlace: badge ámbar "Invitación pendiente".
5. Confirmar que la columna "Estado" (activo/bloqueado) sigue funcionando igual que antes, sin relación con la nueva columna.

## Verificación técnica

- `npm run lint` — sin errores ni warnings nuevos.
- `npm run build` — build exitoso.
- Verificado en el navegador de desarrollo (ruta temporal `/dev-test-usuarios`, agregada y revertida antes de terminar — confirmado con `git diff` limpio en `AppRouter.jsx`) que el componente no rompe sin sesión real (estado de error esperado, ya que el RPC exige `is_admin()`).

## Pendiente de Braulio

1. **Ejecutar la migración `supabase/migrations/20260812120000_admin_profiles_last_sign_in.sql`** en el SQL Editor de Supabase.
