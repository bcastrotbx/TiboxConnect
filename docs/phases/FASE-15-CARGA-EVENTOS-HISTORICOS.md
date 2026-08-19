# Fase 15 — Carga de 9 eventos históricos ("Eventos a clientes")

Carga de datos puntual, no una feature de UI — sin cambios de código en el repo. Documentada acá por las decisiones técnicas y el hallazgo de infraestructura que dejó, no por el proceso en sí.

## Qué se cargó

9 eventos "Eventos a clientes" ya realizados, extraídos por Braulio desde `https://www.tibox.cl/capacitaciones-a-clientes/`, insertados directo en `public.events` en producción: título, descripción, fecha, lugar, colaborador, banner, galería de fotos (10 por evento) y video de YouTube (7 de 9 eventos).

`modality='presential'`, `status='published'`, `visibility='public'` — mismo criterio que ya usan los eventos pasados reales que se ven en `/eventos` (confirmado contra el esquema real vía `select * from events limit 1`, no asumido). `registration_url`/`partner_logo_url` quedan `null` — no aplica a eventos ya pasados.

## Decisiones tomadas durante la carga (confirmadas con Braulio)

- **Hora del evento**: ninguna fuente traía hora exacta — se usó 14:00 UTC (≈10-11am Chile) como valor neutro para los 9, cosmético (solo afecta el campo "Hora" del detalle público).
- **Colaboración doble** (ej. "Microsoft / Intcomex"): `partner_name` es un solo campo de texto libre — se dejó el texto tal cual, sin partir en dos colaboradores.
- **`summary`**: se dejó `null` — la fuente traía descripción larga (`description`), no un resumen corto aparte.
- **Video en páginas con 2 videos** (eventos "Ciberseguridad Curicó", "Ciberseguridad Santiago", "Recuperación ante desastres"): se usó el primero de los dos links dados por Braulio en cada caso.

## Hallazgo real: límite de 10 fotos en `gallery`

6 de los 9 eventos traían más de 10 fotos en su galería original (hasta 15) — la restricción `events_gallery_max_10` (`check (array_length(gallery,1) <= 10)`, agregada en `20260810100000_events_gallery.sql` a pedido explícito de Braulio para el editor manual del admin) bloquea cualquier `INSERT` que la exceda. **Se truncó a las primeras 10 fotos de cada lista, en el mismo orden en que Braulio las dio** (decisión explícita, no automática — ver conversación). Las fotos restantes de esos 6 eventos no se subieron a `comunidad.tiboxlab.cl` ni se guardaron en ningún lado; si se quiere la galería completa más adelante, habría que re-descargarlas de tibox.cl y decidir si se sube el límite de la restricción (y el mismo límite en `GalleryLinksField`, `AdminWidgets.jsx`, que hoy tiene el mismo tope de 10 en el frontend).

## Hallazgo real: límite de tamaño de request de `/api/upload-image`

13 de las ~90 fotos de galería (más algunos banners no, esos ya venían livianos) fallaron al subirse con `413` — no por el chequeo de 8MB del propio código (`api/upload-image.js`, `MAX_BYTES`), sino por el **límite de tamaño de body que impone la plataforma de Vercel Serverless Functions (~4.5MB)**, que rechaza el request antes de que el código de la función llegue a ejecutarse (por eso el body de error no era el JSON esperado, sino `null`). Todas las fotos que fallaron eran PNG de 4.5-5.8MB.

**Solución aplicada** (fuera del repo, en el script one-off de carga): las 13 fotos se recomprimieron a JPEG calidad 82 con `sips` antes de subirlas — bajaron a 0.3-0.5MB, muy por debajo del límite, sin pérdida visual relevante para una galería de fotos de evento. No se tocó `api/upload-image.js` ni `MAX_BYTES` — el límite real de la plataforma (4.5MB) sigue siendo más bajo que el límite que el código cree tener (8MB), así que **cualquier imagen nueva entre 4.5MB y 8MB seguirá fallando con este mismo síntoma** hasta que se ajuste `MAX_BYTES` a un valor realista o se resuelva de otra forma (ej. subir el límite del runtime de Vercel, o comprimir en el cliente antes de enviar). Vale la pena revisarlo como ajuste aparte si se sigue subiendo contenido pesado (fotos de eventos, especialmente PNG sin comprimir) desde el admin.

## Verificación

- Esquema real confirmado en vivo contra producción (`select * from events limit 1`, `select conname, pg_get_constraintdef(...) from pg_constraint where conrelid = 'public.events'::regclass`) antes de escribir el `INSERT` — no se asumieron valores de una migración distinta.
- Los 9 banners y las 90 fotos de galería (10 por evento) confirmados en `comunidad.tiboxlab.cl/imagenes-portal/`, cargando sin el ícono roto de hotlink bloqueado (`HTTP 200` directo, y `naturalWidth > 0` verificado en el navegador sobre `/eventos`).
- `INSERT` ejecutado directo contra producción vía `supabase db query --linked` (Supabase CLI, autenticado en este entorno — sin necesitar que Braulio lo pegara en el SQL Editor). Confirmado después: 9 filas nuevas, `modality`/`status`/`visibility` correctos, `gallery` con exactamente 10 elementos en las 9, `video_url` presente en 8 de 9 (ausente solo en "SayS Week Entel", como corresponde), banners re-hosteados.
- `/eventos` (portal público): los 9 eventos nuevos aparecen, banners cargando bien.
- `/eventos/:slug` de "Recuperación ante desastres" (con video) y de "SayS Week Entel" (sin video): título, fecha, lugar, colaborador, descripción, galería de 10 fotos y bloque "Ver video del evento" correctos en el primero; bloque de video ausente (comportamiento esperado) en el segundo.
- `/admin/eventos` (ruta temporal de desarrollo, agregada y revertida — `git diff`/`git status` limpios): los 13 eventos (4 previos + 9 nuevos) aparecen editables; abierto "Arquitecturas Resilientes" en modo edición — todos los campos cargados correctamente, incluida la galería mostrando "10/10".
- Los eventos previos (los 4 que ya existían) no se tocaron — mismo conteo, mismos datos.

Sin cambios de código — nada que commitear en este repo para esta tarea.
