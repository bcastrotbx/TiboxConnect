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
--   2. Ejecutar el UPDATE de abajo, reemplazando el correo placeholder, para
--      convertir esa cuenta en administrador.

update public.profiles
set role = 'admin'
where id = (
  select id
  from auth.users
  where email = 'CORREO_DEL_ADMIN_AQUI@tibox.cl'
);

-- Verificación opcional: confirma que el cambio se aplicó.
select id, full_name, role, status
from public.profiles
where id = (
  select id from auth.users where email = 'CORREO_DEL_ADMIN_AQUI@tibox.cl'
);
