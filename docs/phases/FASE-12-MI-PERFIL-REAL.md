# Fase 12 — "Mi Perfil" real

## Auditoría (antes de tocar código)

`/admin/perfil` (`PerfilPage.jsx`) era enteramente decorativo — nada de lo que se ve en la captura de pantalla estaba conectado a Supabase:

| Campo/control | Estado antes |
|---|---|
| Nombre completo | `<input defaultValue="Alejandro Díaz">` fijo, sin `onChange` |
| Cargo | `<input defaultValue="Administrador del portal">` fijo — además, el nombre del campo no correspondía a ninguna columna real (`profiles.company`, no `position`) |
| Correo electrónico | `<input defaultValue="alejandro.diaz@tibox.cl">` fijo |
| Teléfono | `<input defaultValue="+56 9 1234 5678">` fijo |
| Botón "Guardar cambios" | Solo mostraba un toast "Cambios guardados" con `setTimeout` — no llamaba a Supabase para nada |
| Cambiar contraseña | El formulario aparecía/desaparecía, pero no tenía `onSubmit` — cualquier valor tecleado se perdía |
| Autenticación en dos pasos (2FA) | `useState` local (`twoFA`), sin persistencia ni backend — el toggle "funcionaba" visualmente pero no activaba nada real |
| Preferencias de la cuenta (notif. por correo, resumen semanal, sonido, idioma) | Todo `useState` local, sin persistencia — se perdía al recargar |
| Foto de perfil | `<input type="file">` sin `onChange` — el clic abría el selector de archivos del sistema operativo pero elegir un archivo no hacía nada |
| Avatar mostrado | Iniciales fijas "AD", nunca una foto real |

## Qué se hizo

Alcance confirmado con Braulio: nombre, correo y foto operativos; cargo y teléfono se quitan (no se piden); contraseña debe funcionar de punta a punta; 2FA y Preferencias de la cuenta se quitan por completo (ninguno tenía backend detrás y no estaba en el pedido).

### Base de datos

- `supabase/migrations/20260817100000_profiles_avatar_url.sql`: agrega `avatar_url text` a `profiles`. Sin GRANT ni política nueva — la columna queda cubierta por el `UPDATE` ya otorgado a `authenticated` sobre toda la tabla y por las políticas `profiles_update_own`/`profiles_update_admin` ya existentes.
- `company`/`phone` no se tocan: existen desde la Fase 4, no se usan en ningún otro lugar del código, y no hay pedido de eliminarlas del esquema — solo de la UI de esta página.

### Cliente

- `src/services/profileService.js` (nuevo): `updateFullName`, `updateAvatar`, `requestEmailChange` (vía `supabase.auth.updateUser({ email })` — Supabase exige confirmar el cambio desde un link enviado a la dirección nueva antes de que se aplique de verdad, no es instantáneo), `changePassword` (reautentica con `signInWithPassword` usando la contraseña actual antes de llamar `updateUser({ password })` — es la única forma de validar "contraseña actual" que expone supabase-js, sin perder la sesión activa en el intento).
- `PerfilPage.jsx` reescrita:
  - **Información personal**: solo Nombre completo y Correo electrónico (Cargo/Teléfono eliminados), precargados desde `useAuth()` (`profile.full_name`, `user.email`), con "Guardar cambios" real. Si el correo cambió, el mensaje de confirmación se lo dice explícitamente al admin ("revisa tu correo nuevo") en vez de mostrar "Cambios guardados" como si ya hubiera terminado.
  - **Seguridad**: solo Contraseña (2FA eliminada). El formulario de cambio de contraseña ahora reautentica y llama a Supabase de verdad; mínimo 8 caracteres y confirmación, mismo criterio que `/actualizar-contrasena`.
  - **Preferencias de la cuenta**: bloque completo eliminado.
  - **Foto de perfil**: sube el archivo a Storage (reutiliza `storageService.uploadContentImage`, mismo bucket `content-images` que usa el resto del contenido del admin) y guarda la URL en `profiles.avatar_url`; recarga la página al terminar (mismo patrón que el resto del admin tras una mutación).
- `AdminWidgets.jsx`: nuevo componente compartido `Avatar` (+ `initialsFor` centralizado) — muestra la foto real si `avatar_url` existe, si no las iniciales de siempre. Reemplaza la lógica que antes estaba duplicada en `AdminHeader.jsx` y `AdminSidebar.jsx` (cada uno con su propio `initialsFor` y su propio círculo con degradado, ninguno mostraba una foto real porque la columna no existía). Ahora los tres puntos donde se ve el avatar del admin (header, sidebar, Mi Perfil) muestran la misma foto real una vez subida.

## Verificación

- `npm run lint` y `npm run build` sin errores.
- Verificado en navegador con una ruta temporal (`AdminLayout` completo, agregada y revertida en el mismo lote, confirmado con `git diff`): la página renderiza sin errores de consola no capturados, el formulario de contraseña se abre/cierra, la validación de "el nombre no puede quedar vacío" funciona, y Cargo/Teléfono/2FA/Preferencias ya no aparecen en ningún lado.
- No fue posible probar los flujos que requieren una sesión real (guardar nombre/correo, cambiar contraseña de punta a punta y confirmar que sirve para el siguiente login, subir una foto real) — este entorno no tiene credenciales de administrador. Los 401 vistos en consola durante la verificación son exactamente los esperados sin sesión (mismo comportamiento que el resto del panel).

## Pendiente para Braulio

1. Ejecutar la migración `20260817100000_profiles_avatar_url.sql` en el SQL Editor de Supabase (sin ella, subir una foto falla porque la columna no existe).
2. Logueado como admin, confirmar de punta a punta:
   - Cambiar el nombre y guardar — debe reflejarse en el header/sidebar tras recargar.
   - Cambiar el correo — debe llegar un correo de confirmación a la dirección nueva; el correo de la cuenta no cambia hasta confirmarlo.
   - Cambiar la contraseña — cerrar sesión y volver a entrar con la contraseña nueva para confirmar que quedó activa.
   - Subir una foto de perfil — debe verse en el círculo de Mi Perfil, en el header y en el sidebar.
