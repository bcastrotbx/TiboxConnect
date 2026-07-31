-- Fix: GRANT base faltante para site_settings y services
--
-- Mismo hallazgo que 20260728110000_grants_anon_authenticated.sql: este
-- proyecto Supabase tiene "Automatically expose new tables" desactivado, así
-- que cada tabla nueva necesita su propio GRANT de Postgres a nivel de
-- tabla además de las políticas RLS — sin el GRANT, PostgREST devuelve 401
-- "permission denied" antes de evaluar RLS. Se omitió este GRANT al crear
-- site_settings y services en esta misma fase, lo que dejó ambas tablas
-- inaccesibles en producción (confirmado en vivo contra
-- https://tibox-connect.vercel.app: 401 en ambos endpoints, mientras que
-- categories —que sí tiene su GRANT— respondía 200). El alcance de cada
-- GRANT refleja exactamente las políticas RLS ya creadas para estas tablas.

-- site_settings: lectura pública (portal + admin), solo update para admin
-- (fila singleton, sin insert/delete en las políticas RLS).
grant select on public.site_settings to anon;
grant select, update on public.site_settings to authenticated;

-- services: mismo patrón que categories/hero_slides — anon solo lee filas
-- activas; authenticated además puede insertar/actualizar/eliminar si es
-- admin (acotado por RLS, no por este GRANT).
grant select on public.services to anon;
grant select, insert, update, delete on public.services to authenticated;
