-- Fase "Mi Perfil real" — la página /admin/perfil era enteramente
-- decorativa (nombre/cargo/correo/teléfono con `defaultValue` fijo, "Guardar
-- cambios" solo mostraba un toast falso, la foto de perfil no subía nada).
-- Se agrega `avatar_url` para poder persistir la foto real — el resto de
-- los campos editables (full_name, email vía auth.users) ya tenían columna.
--
-- `company`/`phone` no se tocan: existen en el esquema desde la Fase 4 pero
-- no se usan en ningún lado del código — el pedido de este ajuste es quitar
-- "Cargo"/"Teléfono" de la UI de /admin/perfil, no borrar columnas que
-- podrían servir a futuro sin costo de mantenerlas.

alter table public.profiles add column avatar_url text;

-- Sin GRANT ni política nueva: la columna queda cubierta por el UPDATE ya
-- otorgado a `authenticated` sobre toda la tabla (ver
-- 20260728110000_grants_anon_authenticated.sql) y por las políticas
-- profiles_update_own/profiles_update_admin ya existentes — ninguna de las
-- dos restringe por columna.

notify pgrst, 'reload schema';
