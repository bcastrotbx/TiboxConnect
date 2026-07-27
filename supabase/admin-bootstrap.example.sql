-- Fase 4 — Bootstrap del primer administrador
--
-- Este archivo es un EJEMPLO para copiar y pegar manualmente en el SQL
-- Editor de Supabase. No es una migración (no vive en supabase/migrations/
-- y no debe ejecutarse automáticamente): requiere reemplazar el correo
-- placeholder por uno real y correrse a mano, una sola vez por cada
-- administrador que se quiera crear.
--
-- Pasos:
--   1. Crear la cuenta primero desde Supabase → Authentication → Add user
--      (o vía invitación), con el correo real del administrador. Esto
--      dispara el trigger on_auth_user_created y crea su fila en
--      public.profiles con role='user' por defecto.
--   2. Ejecutar el bloque de abajo completo, reemplazando el correo
--      placeholder, para convertir esa cuenta en administrador.
--
-- Nota importante — por qué se deshabilita el trigger:
-- profiles_prevent_self_role_status_change (ver
-- 20260727100100_profiles.sql) bloquea cualquier UPDATE de role/status
-- salvo que quien ejecuta la consulta ya sea admin según is_admin(), es
-- decir, salvo que auth.uid() resuelva a un profiles.role='admin' activo.
-- El SQL Editor de Supabase corre las consultas sin contexto de sesión de
-- usuario (no hay un usuario autenticado real detrás de auth.uid()), así
-- que is_admin() siempre da false ahí — incluso para el primer bootstrap,
-- donde por definición todavía no existe ningún admin. Por eso este es el
-- único caso en que se deshabilita el trigger explícitamente antes del
-- UPDATE y se vuelve a habilitar inmediatamente después, en la misma
-- ejecución. Cualquier cambio de role/status hecho desde la aplicación (con
-- un usuario autenticado real) no necesita esto — RLS + el trigger operan
-- con normalidad.

alter table public.profiles disable trigger profiles_prevent_self_role_status_change;

update public.profiles
set role = 'admin'
where id = (
  select id
  from auth.users
  where email = 'CORREO_DEL_ADMIN_AQUI@tibox.cl'
);

alter table public.profiles enable trigger profiles_prevent_self_role_status_change;

-- Verificación opcional: confirma que el cambio se aplicó.
select id, full_name, role, status
from public.profiles
where id = (
  select id from auth.users where email = 'CORREO_DEL_ADMIN_AQUI@tibox.cl'
);
