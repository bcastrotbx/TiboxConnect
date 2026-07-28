-- Fase 6/7/8 — ajuste posterior: reordenar manualmente Videos, Infografías
-- y Eventos desde el panel admin
--
-- content_items ya tiene sort_order desde la Fase 4; events no lo tenía —
-- se agrega acá. Default 0 para que las filas existentes no queden con un
-- valor nulo (roto para "order by sort_order").

alter table public.events
  add column if not exists sort_order integer not null default 0;

create index if not exists events_sort_order_idx on public.events (sort_order);
