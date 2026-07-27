# ADR-005 — Promoción a administrador en el momento de la invitación, no tras aceptarla

**Estado:** Aceptada
**Fecha:** 2026-07-27
**Contexto de la decisión:** Fase 5 (autenticación real de administradores), a petición explícita de Braulio

## Contexto

La Fase 5 implementa la invitación de administradores adicionales (ver [ADR-004](ADR-004-SIN-REGISTRO-PUBLICO.md), punto 3: "se agregará... una función para que un administrador invite a otros administradores adicionales"). El trigger `on_auth_user_created` (Fase 4) crea automáticamente una fila en `profiles` con `role='user'` para cualquier cuenta nueva de `auth.users` — incluida una cuenta creada vía `supabase.auth.admin.inviteUserByEmail`.

Esto abre dos diseños posibles para el flujo "Agregar administrador" del panel (`/admin/usuarios`):

1. **Promover a `role='admin'` de inmediato**, como parte de la misma llamada que crea la invitación — antes de que la persona invitada siquiera acepte el correo.
2. **Dejar la cuenta en `role='user'`** tras la invitación, y requerir que un administrador la promueva explícitamente en un segundo paso, después de que la persona invitada acepte y defina su contraseña.

## Decisión

Se optó por la **opción 1: promover a `admin` de inmediato**, dentro de la misma ejecución de la Edge Function `invite-admin` (ver `supabase/functions/invite-admin/index.ts`), inmediatamente después de que `inviteUserByEmail` confirma la creación de la cuenta.

## Justificación

- **El propio acto de llenar el formulario "Agregar administrador" ya es la decisión.** Un administrador activo, con su identidad ya verificada por `AdminRoute` y de nuevo dentro de la Edge Function, decide explícitamente que la persona invitada debe tener acceso de administrador. No hay ambigüedad que resolver en un paso posterior — la opción 2 solo agregaría una espera y una segunda pantalla ("administradores pendientes de promoción") sin ningún beneficio real de seguridad, porque el control de acceso ya ocurrió en el momento de invitar, no en el momento de aceptar.
- **Menos superficie de estado intermedio.** La opción 2 requiere modelar un tercer estado ("invitado, no admin todavía, pendiente de promoción") que no existe hoy en `profiles.role` (`'user' | 'admin'`) ni en `profiles.status` (`'active' | 'blocked'`), y que solo tendría sentido para esta ventana de tiempo entre invitar y aceptar. Se prefirió no introducir ese estado.
- **Simplicidad de la Edge Function.** Promover en el mismo paso evita tener que exponer una segunda operación privilegiada ("promover a un usuario ya invitado") con su propio control de acceso — toda la lógica de privilegio elevado queda concentrada en una sola función, un solo momento, un solo lugar del código a auditar.

## Consecuencias

- Si la invitación por correo nunca es aceptada (el destinatario la ignora, la borra, o el correo no llega), esa cuenta queda registrada en `auth.users` y en `profiles` con `role='admin'` sin haber iniciado sesión nunca. No representa un riesgo mayor: sin aceptar la invitación no existe una contraseña con la que iniciar sesión, así que la cuenta no es utilizable hasta que la persona la acepte y defina su contraseña.
- Si se decide en el futuro revocar una invitación antes de que sea aceptada, hoy no hay un botón para eso en `/admin/usuarios` (ver pendientes en [FASE-05-AUTENTICACION.md](../phases/FASE-05-AUTENTICACION.md)) — debe hacerse manualmente desde el panel de Supabase (Authentication → Users → eliminar la cuenta).
- La función SQL `public.promote_to_admin()` (ver `supabase/migrations/20260728100000_promote_to_admin_function.sql`) queda restringida al rol `service_role` exclusivamente — ni `anon` ni `authenticated` pueden ejecutarla, así que no puede usarse como una vía alterna de auto-promoción desde el cliente.

## Referencias

- [ADR-004 — Sin registro/login público de usuarios finales](ADR-004-SIN-REGISTRO-PUBLICO.md)
- [FASE-05-AUTENTICACION.md](../phases/FASE-05-AUTENTICACION.md)
- `supabase/functions/invite-admin/index.ts`
- `supabase/migrations/20260728100000_promote_to_admin_function.sql`
