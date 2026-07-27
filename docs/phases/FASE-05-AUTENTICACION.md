# Fase 05 — Autenticación real de administradores

**Estado:** Completa (login/logout/protección de rutas verificados sin credenciales reales; login con la cuenta admin real e invitación de administradores pendientes de que Braulio los pruebe — ver [Pruebas](#pruebas-realizadas) y [Pendiente](#pendiente))
**Fecha:** 2026-07-27
**Rama de trabajo:** `feat/react-vite-migration` (misma de las fases anteriores)
**Repositorio:** https://github.com/bcastrotbx/TiboxConnect

## Objetivo

Implementar autenticación real de administradores sobre el modelo de datos y RLS ya creados en la [Fase 4](FASE-04-MODELO-DATOS-RLS.md), adaptada según [ADR-004](../decisions/ADR-004-SIN-REGISTRO-PUBLICO.md): **sin registro público de usuarios finales**. El portal completo sigue siendo 100% público sin sesión; solo existen cuentas de administrador, creadas por invitación desde el propio panel (o manualmente en Supabase). No se conectó `src/services/*` a Supabase en esta fase (eso sigue siendo alcance de la Fase 6) — esta fase es exclusivamente el mecanismo de sesión, protección de rutas e invitación de administradores.

## Alcance realizado

### Parte A — Autenticación real

1. **`src/context/AuthContext.jsx`** (nuevo): única fuente de verdad de sesión en toda la app. Expone `user`, `profile` (la fila de `public.profiles` del usuario actual), `session`, `loading`, `signIn(email, password)`, `signOut()`, `isAdmin` (`profile.role === 'admin' && profile.status === 'active'`). Se suscribe a `supabase.auth.onAuthStateChange` y vuelve a cargar el `profile` en cada cambio de sesión.
2. **`/login`** (`src/pages/LoginPage.jsx`, nuevo): formulario de correo/contraseña vía `supabase.auth.signInWithPassword`. Sin opción de registro, sin enlace a "crear cuenta". Incluye "¿Olvidaste tu contraseña?", que dentro de la misma página cambia a un formulario de solo correo que llama a `supabase.auth.resetPasswordForEmail` (ver decisión 1).
3. **`/actualizar-contrasena`** (`src/pages/UpdatePasswordPage.jsx`, nuevo): recibe la sesión temporal de recuperación que Supabase deja tras el enlace del correo, pide nueva contraseña + confirmación, llama a `supabase.auth.updateUser({ password })`.
4. **`src/routes/AdminRoute.jsx`** (nuevo): envuelve todas las rutas `/admin/*`. Mientras `loading` es `true`, muestra un loader de pantalla completa (nunca el panel vacío ni un parpadeo). Si no hay sesión de admin activa (`!isAdmin`), redirige a `/acceso-no-autorizado` — nunca a `/login` (para no confundir a un visitante normal que llegó por error a `/admin`).
5. **Cuenta bloqueada:** dentro de `AuthContext`, si el `profile` cargado tiene `status === 'blocked'`, se llama a `supabase.auth.signOut()` automáticamente y se guarda un aviso (`blockedNotice`) que `LoginPage` muestra ("Tu cuenta fue bloqueada...").
6. **Header público condicional** (`src/components/Header.jsx`): el botón "ADM" y el bloque "avatar + Cerrar sesión" (antes hardcodeados como el usuario de ejemplo "CM"/Carlos Mora, ver ADR-004) ahora solo se muestran si `isAdmin` es verdadero. Sin sesión, el header público no muestra ningún control de cuenta. Con sesión de admin activa, el avatar muestra las iniciales reales de `profile.full_name` y "Cerrar sesión" llama a `signOut()`.
7. **Botón "Cerrar sesión" dentro del panel admin**: agregado en `AdminSidebar.jsx` (junto a "Volver al portal") y en `AdminHeader.jsx` (junto al botón "Mi Perfil"), ambos llaman a `signOut()` y redirigen a `/`. De paso, se conectó la identidad mostrada en ambos (avatar con iniciales + nombre) a `profile.full_name` real, en vez del "Alejandro Díaz"/"AD" hardcodeado de la Fase 1 — dejarlo hardcodeado habría sido inconsistente con el objetivo mismo de esta fase (ver decisión 6).

### Parte B — Invitar administradores adicionales

8. **`/admin/usuarios`** (`src/admin/pages/UsuariosPage.jsx`, nuevo): formulario "Agregar administrador" (nombre + correo). Nueva entrada en el sidebar del admin, grupo "Cuenta". Como toda la rama `/admin/*` ya exige sesión de administrador activa vía `AdminRoute`, no hace falta un guardado adicional dentro de la página.
9. **`supabase/functions/invite-admin/index.ts`** (nuevo, Edge Function en Deno): recibe `{ email, fullName }`, verifica que quien llama tiene una sesión válida y es admin activo (usando su propio JWT, sin `service_role` todavía), y solo entonces usa la `service_role` key (leída exclusivamente de los secretos de entorno de la función) para invitar al usuario (`supabase.auth.admin.inviteUserByEmail`) y promoverlo a `role='admin'` de inmediato (ver [ADR-005](../decisions/ADR-005-PROMOCION-ADMIN-EN-INVITACION.md)).
10. **`supabase/migrations/20260728100000_promote_to_admin_function.sql`** (nuevo): función `public.promote_to_admin(target_user_id uuid)`, `SECURITY DEFINER`, restringida al rol `service_role` (ni `anon` ni `authenticated` pueden ejecutarla). Deshabilita y vuelve a habilitar el trigger `profiles_prevent_self_role_status_change` alrededor del `UPDATE`, por la misma razón documentada en la Fase 4 para el bootstrap manual: una llamada con la `service_role` key no tiene un `auth.uid()` de sesión de usuario asociado, así que `is_admin()` evaluaría `false` y el trigger bloquearía incluso esta promoción legítima.
11. **`src/services/adminUsersService.js`** (nuevo): `inviteAdmin({ email, fullName })`, única función de `src/services/*` que ya está conectada a Supabase de verdad (no simula datos de seed) — invitar administradores no tiene una forma útil de simularse con datos de ejemplo.

**Limitación temporal documentada explícitamente (pedido por Braulio):** no se configuró SMTP propio (SendGrid) en esta fase — todavía no hay acceso al dominio de TIBOX. Los correos de invitación y recuperación de contraseña los envía el **servicio de correo por defecto de Supabase**, que tiene límites de volumen y puede demorar o caer en spam/promociones. Ver [Pendiente](#pendiente).

## Archivos creados/modificados

```
src/context/AuthContext.jsx                    (nuevo)
src/routes/AdminRoute.jsx                       (nuevo)
src/pages/LoginPage.jsx                         (nuevo)
src/pages/UpdatePasswordPage.jsx                (nuevo)
src/pages/Unauthorized.jsx                      (nuevo)
src/admin/pages/UsuariosPage.jsx                (nuevo)
src/services/adminUsersService.js               (nuevo)
supabase/functions/invite-admin/index.ts        (nuevo, Edge Function)
supabase/migrations/20260728100000_promote_to_admin_function.sql  (nuevo)
docs/decisions/ADR-005-PROMOCION-ADMIN-EN-INVITACION.md           (nuevo)

src/main.jsx                    (envuelve <AppRouter/> en <AuthProvider/>)
src/routes/AppRouter.jsx        (rutas /login, /actualizar-contrasena, /acceso-no-autorizado,
                                 /admin/* envuelto en <AdminRoute/>, nueva ruta /admin/usuarios)
src/components/Header.jsx       (ADM + avatar + cerrar sesión condicionales a isAdmin)
src/admin/AdminSidebar.jsx       (identidad real, botón cerrar sesión, nav "Administradores")
src/admin/AdminHeader.jsx        (identidad real, botón cerrar sesión, título de /admin/usuarios)
```

No se modificó `src/services/*` existente (salvo el nuevo `adminUsersService.js`) ni `src/data/seed/*` — la conexión de esos servicios a Supabase sigue siendo la Fase 6.

## Comandos ejecutados

```bash
npm run lint
npm run build
```

## Pruebas realizadas

### `npm run lint`
```
src/admin/AdminWidgets.jsx
  65:28  warning  'ix' is defined but never used. Allowed unused args must match /^_/u

✖ 1 problem (0 errors, 1 warning)
```
Mismo único warning preexistente desde la Fase 1 (`ix` sin usar en `RowMenu`). **0 errores nuevos.**

### `npm run build`
```
vite v6.4.3 building for production...
✓ 1676 modules transformed.
dist/index.html                     1.12 kB │ gzip:   0.42 kB
dist/assets/index-*.css             6.16 kB │ gzip:   1.70 kB
dist/assets/index-*.js          1,424.14 kB │ gzip: 306.19 kB
(!) Some chunks are larger than 500 kB after minification.
✓ built in 1.49s
```
El bundle creció (1,187 kB → 1,424 kB) por el código nuevo de autenticación (Supabase Auth ya estaba en el bundle desde la Fase 3, pero ahora se ejercita más superficie de la librería) — mismo problema de chunk único ya documentado desde la Fase 2, sin cambios de fondo.

### Verificación manual en navegador (sin credenciales — ver detalle abajo)

Se levantó el servidor de desarrollo (`npm run dev`, `http://localhost:5173`) y se verificó, **sin iniciar sesión** (no había credenciales disponibles en este entorno de trabajo):

1. **`/admin` sin sesión → redirige a `/acceso-no-autorizado`.** Confirmado navegando directamente a la URL: `window.location.href` terminó en `/acceso-no-autorizado`, sin parpadeo del panel admin, 0 errores de consola.
2. **`/login` renderiza correctamente:** formulario de correo/contraseña, enlace "¿Olvidaste tu contraseña?", sin ningún enlace de registro. 0 errores de consola.
3. **Header público sin sesión:** en `/`, se confirmó (vía `read_page`) que no existe ningún elemento "ADM", avatar ni "Cerrar sesión" — solo quedan "Mis Tickets" y "Contacta a tu KAM" (no relacionados con sesión). 0 errores de consola.

**Lo que falta verificar con la cuenta admin real (`bcastro+portal@tibox.cl`) queda para que Braulio lo haga** — ver los pasos exactos entregados en el mensaje de cierre de esta fase (login, acceso a `/admin`, cierre de sesión, recarga de `/admin` estando logueado). Este entorno de trabajo no tiene la contraseña de esa cuenta ni forma de obtenerla de manera segura, así que no se simuló ni se asumió su resultado.

## Decisiones tomadas

1. **Recuperación de contraseña sin ruta propia:** el pedido decía "incluye un enlace... que lleve a un flujo de recuperación", no una URL dedicada. Se implementó como un segundo estado dentro de la misma `LoginPage` (un toggle "¿Olvidaste tu contraseña?") en vez de crear una ruta `/recuperar-contrasena` separada, para no agregar una ruta pública no pedida explícitamente.
2. **`/acceso-no-autorizado` como página dedicada** (una de las dos opciones que ofrecía el pedido, la otra era redirigir a `/`): se eligió porque es más informativa para un administrador que escribió mal su URL o cuya sesión expiró, sin ofrecerle un login a un visitante normal que llegó por error.
3. **Enlace secundario "¿Eres administrador? Inicia sesión" en `/acceso-no-autorizado`:** no estaba pedido explícitamente, pero sin él un administrador cuya sesión simplemente expiró no tendría ninguna forma de volver a entrar salvo escribir `/login` de memoria. Es un enlace secundario (texto pequeño, no un botón), no una oferta de login visible desde el portal público.
4. **`is_admin` se recalcula en cada carga de `profile`, no se cachea en `localStorage`:** cualquier cambio de `role`/`status` hecho por otro administrador se refleja la próxima vez que la sesión se revalida (recarga de página, o el propio `onAuthStateChange`) — no hay una suscripción en tiempo real a cambios de `profiles` en esta fase (ver Pendiente).
5. **Cuenta bloqueada → `signOut()` automático, no un estado de "solo lectura":** un `status='blocked'` cierra la sesión inmediatamente en vez de dejar a la persona con algún nivel de acceso mientras se decide qué hacer — bloqueado significa bloqueado.
6. **Identidad real (`profile.full_name`) reemplaza el "Alejandro Díaz"/"AD" hardcodeado en `AdminSidebar`/`AdminHeader`:** no estaba pedido literalmente para esta fase (el pedido solo mencionaba agregar un botón de cerrar sesión), pero dejar un nombre falso permanentemente visible en el panel mientras se implementa "autenticación real" habría sido inconsistente y confuso para cualquiera que probara la fase. Se limitó el cambio a la identidad mostrada (avatar + nombre) — el formulario de "Información personal" de `/admin/perfil` (edición de nombre/teléfono/cargo) se dejó intacto, todavía mockeado: es una funcionalidad de edición de datos que pertenece más a la Fase 6 (conectar servicios) que a esta fase de autenticación.
7. **Promoción a `admin` inmediata al invitar** (no un segundo paso de aprobación tras aceptar la invitación): ver [ADR-005](../decisions/ADR-005-PROMOCION-ADMIN-EN-INVITACION.md) para la justificación completa.
8. **`promote_to_admin()` como función SQL dedicada, restringida a `service_role`**, en vez de que la Edge Function haga un `UPDATE` directo sobre `profiles`: necesario para poder deshabilitar/rehabilitar el trigger `profiles_prevent_self_role_status_change` de forma transaccional (si algo falla a mitad de camino, Postgres revierte también la deshabilitación del trigger) — mismo patrón ya usado y documentado en la Fase 4 para el bootstrap manual del primer admin.
9. **No se restringe `Access-Control-Allow-Origin` a un dominio específico en la Edge Function** (se dejó `*`): no hay todavía un dominio de producción fijo para el portal. Documentado como mejora sugerida, no bloqueante (ver Pendiente).
10. **`adminUsersService.js` es el único servicio de `src/services/*` conectado a Supabase de verdad en esta fase:** todos los demás (`contentService`, `eventService`, etc.) siguen leyendo de `src/data/seed/*` — la conexión general es la Fase 6. Se hizo una excepción puntual porque "invitar un administrador" no tiene una forma útil de simularse con datos de ejemplo (a diferencia de listar videos o eventos, que sí).

## Problemas conocidos

- **La Edge Function `invite-admin` no se pudo desplegar ni probar desde este entorno de trabajo** — no hay Supabase CLI instalado/vinculado ni credenciales de servicio disponibles aquí. El código fue escrito y revisado manualmente, pero su ejecución real contra el proyecto Supabase queda pendiente de que Braulio la despliegue (ver instrucciones en el mensaje de cierre de esta fase).
- **El login/logout con la cuenta admin real no se pudo probar desde este entorno** — no hay credenciales disponibles aquí de forma segura. Queda pendiente de que Braulio lo verifique siguiendo los pasos entregados.
- **Sin SMTP propio (SendGrid):** los correos de invitación y recuperación de contraseña dependen del servicio de correo por defecto de Supabase, con límites de volumen y posible demora/spam. Es una limitación temporal esperada, no un bug.
- **Sin revocación de invitaciones pendientes desde el panel:** si una invitación no se acepta y se quiere cancelarla, hoy debe hacerse manualmente desde Supabase (Authentication → Users).
- **Bundle único de Vite sigue creciendo** (1,424 kB) — mismo problema estructural documentado desde la Fase 2 (sin code-splitting por ruta).

## Pendiente

- **Braulio debe desplegar la Edge Function `invite-admin`** y probar el flujo completo de invitación (ver instrucciones paso a paso entregadas en el mensaje de cierre).
- **Braulio debe probar login/logout/protección de rutas con la cuenta admin real** (`bcastro+portal@tibox.cl`), siguiendo los pasos entregados.
- Configurar SMTP propio (SendGrid, dominio de TIBOX) para los correos de Supabase Auth, cuando exista acceso al dominio.
- Evaluar restringir `Access-Control-Allow-Origin` de la Edge Function a un dominio fijo una vez exista uno de producción.
- Evaluar agregar una lista de administradores existentes (y revocar invitaciones pendientes) en `/admin/usuarios` — hoy solo tiene el formulario de invitar, sin listado.
- Conectar `src/services/*` (excepto `adminUsersService.js`, ya conectado) a Supabase — Fase 6.
- Proteger la escritura de contenido real contra RLS de verdad una vez `src/services/*` esté conectado — hoy el admin sigue mutando estado local en memoria (Fase 6).

## Próxima fase recomendada

Fase 6 — conectar `src/services/*` a Supabase, reemplazando la lectura desde `src/data/seed/*.js`, sin tocar los componentes que los consumen. **No se avanza a la Fase 6 sin confirmación explícita de Braulio**, y sin que primero se hayan verificado el despliegue de la Edge Function y el login real con la cuenta admin.
