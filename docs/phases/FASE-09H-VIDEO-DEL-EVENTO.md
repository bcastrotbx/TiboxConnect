# Fase 9h — Campo "Video del evento" + bloque en la página de detalle

Pedido de Braulio: campo opcional "Video del evento" (link de YouTube) en el formulario admin de eventos, y un bloque nuevo "Ver video del evento" en la columna derecha de `/eventos/:slug`, arriba de "Eventos recomendados", con la miniatura de YouTube que al hacer clic abre un popup con el reproductor.

Exclusivo de esa página: `/videoteca`, `/videoteca/:slug` y el resto del portal no se tocan.

## Archivos modificados (5)

1. **`supabase/migrations/20260814130000_events_video_url.sql`** (nuevo) — `alter table public.events add column if not exists video_url text;`. Sin default y nullable, mismo criterio que `thumbnail_url`/`registration_url`. No requiere cambios de RLS: las políticas de `events` son por fila completa (`select *`), no por columna. Incluye `notify pgrst, 'reload schema';` por el mismo motivo que la migración de `gallery` (ver riesgo abajo).
2. **`src/services/eventService.js`** — `mapEventRow` expone `videoUrl: row.video_url || ''`. Queda disponible en todas las funciones que usan ese mapper, pero solo `EventoDetailPage.jsx` lo renderiza.
3. **`src/services/adminEventsService.js`** — `mapAdminRow` expone `videoUrl` para que el formulario lo precargue al editar.
4. **`src/admin/AdminWidgets.jsx`** — estado `videoUrl`, `video_url` en el payload de guardado, y el campo visible (input + preview de miniatura si el link es válido) justo después de "Banner del evento". Reutiliza `getYouTubeThumbnailUrl`, que ya estaba importado para el formulario de Videos.
5. **`src/pages/EventoDetailPage.jsx`** — reemplazo completo. La columna derecha pasa de ser un único `section-card` a un contenedor `flex/column/gap:20` con dos tarjetas: "Ver video del evento" (solo si hay `videoUrl`) arriba y "Eventos recomendados" abajo, este último sin cambios internos. El popup reutiliza `ModalShell` + `YouTubePlayer` (mismos componentes compartidos que usa `/videoteca/:slug`), sin categoría ni duración — un evento no tiene esos datos.

## ⚠️ Riesgo de orden de despliegue — importante

**La migración debe ejecutarse ANTES de que el código llegue a producción, no después.**

Verifiqué en vivo contra la base real que la columna `video_url` **todavía no existe**, y qué pasa exactamente al intentar guardar un evento con el código nuevo (prueba hecha con un `id` inexistente para no tocar datos reales):

| Payload | Resultado |
|---|---|
| Con `video_url` | `Could not find the 'video_url' column of 'events' in the schema cache` |
| Sin `video_url` | `permission denied for table events` (llegó hasta RLS — comportamiento normal sin sesión) |

Es decir: **el error de esquema ocurre antes que RLS**. Como `video_url` va *siempre* en el payload de guardado (tenga o no video el evento), mientras la columna no exista **falla el guardado de cualquier evento**, no solo los que lleven video. Es exactamente el mismo problema que se vivió con la columna `gallery` en la Fase 6/7/8.

La lectura pública, en cambio, degrada limpio: `row.video_url` llega `undefined` → `videoUrl: ''` → el bloque simplemente no se renderiza, sin errores.

**Recomendación:** ejecutar la migración en el SQL Editor de Supabase **primero**, y recién después hacer el push (o hacerlo en la misma ventana de tiempo). Si se despliega el código antes, el panel de eventos queda temporalmente inutilizable para guardar.

## Cómo se probó

1. **Campo en el formulario admin** — verificado montando el modal de "Nuevo evento" en una ruta temporal (`/dev-test-evento-form`, agregada y revertida antes de terminar; `git diff` de `AppRouter.jsx` limpio). El campo "Video del evento (YouTube, opcional)" aparece entre "Banner del evento" y "Nombre del colaborador", y al pegar un link de YouTube válido muestra la miniatura real debajo, igual que el formulario de Videos.
2. **Guardar con video** — **no verificable todavía**: bloqueado por la migración pendiente (ver riesgo arriba). Se comprobó la causa exacta, no se asumió.
3. **Bloque en `/eventos/:slug`** — **no verificable todavía** con un video real, por lo mismo: ningún evento puede tener `videoUrl` hasta que exista la columna.
4. **Evento sin video** — verificado en `/eventos/ia-y-seguridad-en-la-empresa-n8c25z`: el bloque no aparece ni deja espacio vacío, solo "Eventos recomendados". Sin errores de consola.
5. **`/videoteca` y `/videoteca/:slug`** — sin cambios, confirmado con `git diff` (ambos archivos sin diferencias).

## Verificación técnica

- `npm run lint` — sin errores ni warnings nuevos.
- `npm run build` — build exitoso (aviso de chunk >500kB preexistente).

## Pendiente de Braulio

1. **Ejecutar `supabase/migrations/20260814130000_events_video_url.sql`** en el SQL Editor de Supabase — preferentemente antes del deploy, por el riesgo descrito arriba.
2. Una vez ejecutada: cargar un link de YouTube en un evento, guardar, y confirmar los puntos 2 y 3 de arriba en la página pública.
