-- Fase 4 — Modelo de datos y RLS
-- Extensiones y funciones de utilidad compartidas por las migraciones siguientes.

-- gen_random_uuid() ya es nativo en Postgres 13+, pero se deja pgcrypto
-- habilitado de forma defensiva por si el proyecto corre en una versión
-- que todavía lo requiera como extensión.
create extension if not exists pgcrypto;

-- Función genérica para mantener "updated_at" al día en cualquier tabla que
-- la use como trigger BEFORE UPDATE. Evita repetir esta lógica en cada tabla.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
