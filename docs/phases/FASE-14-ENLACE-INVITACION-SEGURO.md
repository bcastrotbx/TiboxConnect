# Fase 14 — Enlace de invitación seguro (fix de raíz)

## Diagnóstico (caso real: invitación a pfarias@tibox.cl)

Paula abrió su enlace de invitación y le apareció la home normal del portal, sin sesión ni botón "ADM". La URL que le quedó en el navegador:

```
https://tibox-connect.vercel.app/#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired&sb=...
```

Dos hechos confirmados por Braulio: (1) pasó menos de 1 hora entre generar el enlace y que Paula lo abriera — mucho menos que cualquier expiración normal; (2) el enlace se envió por Slack/Teams.

**Causa raíz**: `UsuariosPage.jsx` mostraba el `action_link` crudo que devuelve `supabase.auth.admin.generateLink()` — una URL tipo `https://<ref>.supabase.co/auth/v1/verify?token=...&type=invite&redirect_to=...`. Es un enlace GET de un solo uso: la primera petición que llega lo consume, sin importar quién la hizo. Slack y Teams generan automáticamente una tarjeta de vista previa al pegar un link — para eso hacen su propio GET a esa URL apenas se pega el mensaje, antes de que la persona invitada haga clic. Esa petición automática consumía el token; cuando Paula hacía clic de verdad, el enlace ya estaba muerto → `otp_expired`.

**Bug independiente encontrado de paso**: cuando la verificación falla, Supabase redirige con `#error=...` en el hash de la URL, pero el portal (`AuthContext.jsx`, `UpdatePasswordPage.jsx`) no leía ni reaccionaba a ese hash en ningún lado — la SPA simplemente renderizaba la home como si nada, sin avisarle a la persona que su enlace falló. La solución de este ajuste resuelve ambos problemas a la vez: al dejar de compartir el link crudo de Supabase, ya no hay ningún flujo que dependa de leer ese hash de error.

## Solución: enlace propio del portal en vez del link crudo de Supabase

En vez de compartir la URL de Supabase directamente, el admin comparte un enlace del propio dominio (`tibox-connect.vercel.app/aceptar-invitacion?token=...`). Esa página no verifica nada automáticamente al cargar — solo pide clic en un botón "Aceptar invitación", y ahí recién se llama a `supabase.auth.verifyOtp(...)`. Un bot de vista previa (Slack, Teams, WhatsApp) solo hace un GET simple para leer metadatos de la página — no ejecuta el `onClick` de un botón — así que el token queda intacto hasta que la persona invitada hace clic de verdad.

## Qué se hizo

- **`src/services/adminUsersService.js`**: nueva función `buildSecureInviteLink(actionLink)` — extrae `token` y `type` del `action_link` crudo y arma `${origin}/aceptar-invitacion?token=...&type=...`. Se aplica sobre `data.data.actionLink` antes de devolverlo desde `inviteAdmin()`. No cambia nada de cómo Supabase o la Edge Function generan el link — la reescritura ocurre enteramente del lado del cliente, después de recibir la respuesta.
- **`src/pages/AceptarInvitacionPage.jsx`** (nueva): ruta pública `/aceptar-invitacion`. Estados `idle` (botón "Aceptar invitación") / `loading` / `error`. `verifyOtp({ token_hash: token, type })` solo se llama dentro de `handleAccept`, nunca en un efecto de montaje — verificado en vivo que no dispara ningún request de verificación al cargar la página. Al verificar con éxito, navega a `/actualizar-contrasena` (mismo flujo de definir contraseña que ya existía). Mismo shell visual que `LoginPage.jsx`/`UpdatePasswordPage.jsx` (`CosmicBg` + fondo `--grad-corporate` + tarjeta blanca) para consistencia con el resto de páginas públicas de autenticación.
- **`src/routes/AppRouter.jsx`**: ruta nueva `/aceptar-invitacion`, pública, fuera de `PortalLayout` — mismo nivel que `/actualizar-contrasena`.
- **`src/admin/pages/UsuariosPage.jsx`**: sin cambios funcionales (sigue leyendo `data?.actionLink` igual que antes — ahora ese valor ya viene reescrito). Se agregó una frase al párrafo informativo explicando que el enlace ahora es seguro frente a vistas previas automáticas de mensajería.

## Verificación en vivo

- `npm run lint` y `npm run build` sin errores.
- Generada una invitación de prueba (ruta temporal con `AdminLayout`, revertida — `git diff` limpio en `AppRouter.jsx`) con un `action_link` de Supabase simulado (mismo formato real): el campo mostrado en `/admin/usuarios` fue exactamente `http://localhost:5173/aceptar-invitacion?token=pkce_abc123def456&type=invite` — confirma que el link mostrado ya es del dominio del portal, con el token preservado.
- Navegado directo a `/aceptar-invitacion?token=...&type=invite`: la página carga en estado `idle` sin disparar ningún request de red hacia un endpoint de verificación (confirmado revisando las requests de red) — este es exactamente el comportamiento que evita que un bot de vista previa consuma el token.
- Clic en "Aceptar invitación" con un token falso: dispara un `verifyOtp` real contra Supabase, que lo rechaza — la página muestra el mensaje de error correcto ("Este enlace ya no es válido…") en vez de crashear o mostrar la home en silencio.
- Navegado a `/aceptar-invitacion` sin ningún parámetro y clic en el botón: muestra el mensaje distinto de "enlace no válido — falta información", confirmando que ambos casos de error (token ausente vs. token rechazado por Supabase) están cubiertos con mensajes propios.

No fue posible probar el caso real de punta a punta (generar una invitación real, pegarla en Slack/Teams, y confirmar que sigue funcionando tras la vista previa) sin credenciales de administrador reales en este entorno — la combinación de las cuatro verificaciones de arriba cubre la misma lógica que ese caso ejercitaría.

## Pendiente para Braulio

- Confirmar de punta a punta con una invitación real: generarla desde `/admin/usuarios`, pegarla en un chat de Slack o Teams (el mismo escenario que falló con Paula), dejar que se genere la vista previa, y luego abrir el enlace de verdad — debe seguir funcionando.
- Confirmar que `/login` y "olvidé mi contraseña" siguen sin cambios — este ajuste es exclusivo del flujo de invitación de administradores.
