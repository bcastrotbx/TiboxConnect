# Fase 04 — Modelo de datos y Row Level Security en Supabase

**Estado:** Completa (pendiente de ejecución manual por Braulio en el SQL Editor de Supabase — ver [Comandos](#comandos-a-ejecutar-en-supabase))
**Fecha:** 2026-07-27
**Rama de trabajo:** `feat/react-vite-migration` (misma de las fases anteriores)
**Repositorio:** https://github.com/bcastrotbx/TiboxConnect

## Objetivo

Crear el modelo de datos completo y las políticas de seguridad (RLS) en el proyecto Supabase (`tibox-connect`), mediante migraciones SQL versionadas en `supabase/migrations/`. **No** se conectó `src/services/*` a estas tablas (eso es la Fase 6) y **no** se implementó login (eso es la Fase 5) — esta fase es exclusivamente esquema + seguridad a nivel de base de datos.

## Alcance realizado

1. **10 migraciones SQL** en `supabase/migrations/`, numeradas por timestamp para que se ejecuten en orden y sean compatibles con `supabase db push` si en el futuro se adopta el CLI de Supabase.
2. **RLS habilitado en las 9 tablas de negocio**, sin excepción.
3. **Función `public.is_admin()`**, usada por todas las políticas — ninguna política duplica la lógica de "¿es administrador?" inline.
4. **Trigger de creación automática de perfil** (`on_auth_user_created` sobre `auth.users`) — no crea usuarios nuevos por sí solo (no hay registro público, ver [ADR-004](../decisions/ADR-004-SIN-REGISTRO-PUBLICO.md)), pero queda listo para cuando se den de alta cuentas de administrador en la Fase 5.
5. **`supabase/seed.sql`** — datos de ejemplo mínimos e idempotentes, pensados para poder probar las políticas RLS manualmente desde el panel de Supabase.
6. **`supabase/admin-bootstrap.example.sql`** — bloque de ejemplo (no una migración) para convertir una cuenta ya creada en administrador.
7. **`docs/DATA-MODEL.md`** — documento nuevo con el detalle completo de tablas, relaciones, RLS y funciones.

## Archivos creados

```
supabase/
  migrations/
    20260727100000_extensions_and_helpers.sql   # pgcrypto + set_updated_at()
    20260727100100_profiles.sql                 # profiles + trigger + is_admin() + RLS
    20260727100200_categories.sql                # categories + RLS
    20260727100300_content_items.sql             # content_items + RLS
    20260727100400_hero_slides.sql               # hero_slides + RLS
    20260727100500_events.sql                    # events (+ registration_url) + RLS
    20260727100600_event_registrations.sql       # event_registrations + RLS
    20260727100700_contact_messages.sql          # contact_messages + RLS
    20260727100800_feedback.sql                  # feedback + RLS
    20260727100900_infographic_leads.sql         # infographic_leads + RLS
  seed.sql                                       # datos de ejemplo idempotentes
  admin-bootstrap.example.sql                    # bootstrap manual del primer admin
docs/DATA-MODEL.md                               # documentación completa del esquema
```

No se modificó ningún archivo de `src/` — esta fase es exclusivamente SQL y documentación.

## Comandos a ejecutar en Supabase

Esta fase **no usa el CLI de Supabase** (no está instalado/vinculado en este proyecto todavía) — la ejecución es manual, vía **Supabase Dashboard → SQL Editor**, en este orden exacto:

1. Ejecutar, en orden, cada archivo de `supabase/migrations/` (por nombre, que ya están numerados: `20260727100000_...` → `20260727100900_...`). Se puede pegar el contenido de cada archivo en una consulta nueva del SQL Editor y ejecutarlo uno por uno, o concatenarlos todos en una sola consulta respetando el orden — el resultado es el mismo porque cada uno depende solo de los anteriores.
2. Ejecutar `supabase/seed.sql` completo (es idempotente — se puede correr más de una vez sin duplicar datos).
3. (Opcional, para tener un admin con el que probar el panel en la Fase 5) Abrir `supabase/admin-bootstrap.example.sql`, reemplazar `'CORREO_DEL_ADMIN_AQUI@tibox.cl'` por el correo real de una cuenta ya creada en **Authentication → Users**, y ejecutar el bloque completo (incluye deshabilitar y volver a habilitar un trigger — ver la nota operacional más abajo, [Bootstrap del primer administrador: por qué se deshabilita un trigger](#bootstrap-del-primer-administrador-por-qué-se-deshabilita-un-trigger)).

No se ejecutó nada de esto desde este entorno de trabajo — no hay acceso de este entorno al panel de Supabase ni credenciales de servicio. Braulio debe ejecutarlo manualmente.

### Bootstrap del primer administrador: por qué se deshabilita un trigger

Al ejecutar por primera vez `supabase/admin-bootstrap.example.sql` desde el SQL Editor de Supabase, el `UPDATE public.profiles set role = 'admin' ...` fallaba con el error del trigger `profiles_prevent_self_role_status_change` (`No puedes modificar tu propio role o status.`), incluso siendo la primera vez que se intentaba crear un administrador.

**Causa:** ese trigger llama a `public.is_admin()`, que evalúa `auth.uid()`. El SQL Editor de Supabase ejecuta las consultas sin contexto de sesión de usuario — no hay un usuario autenticado real detrás de la conexión — así que `auth.uid()` no resuelve a nadie e `is_admin()` siempre da `false` ahí, sin importar qué cuenta se esté intentando promover. Esto es distinto de una llamada real hecha desde la aplicación con un usuario autenticado, donde `auth.uid()` sí tiene valor.

**Solución adoptada (ya incorporada al archivo `supabase/admin-bootstrap.example.sql`):** deshabilitar el trigger explícitamente antes del `UPDATE` y volver a habilitarlo inmediatamente después, en la misma ejecución:

```sql
alter table public.profiles disable trigger profiles_prevent_self_role_status_change;

update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'CORREO_DEL_ADMIN_AQUI@tibox.cl');

alter table public.profiles enable trigger profiles_prevent_self_role_status_change;
```

**Este es el método oficial de bootstrap** para crear el primer administrador en cualquier entorno donde todavía no exista ninguno (producción, staging, u otro proyecto Supabase futuro) — no es un workaround puntual de esta fase. Debe repetirse este mismo procedimiento (deshabilitar → `update` → rehabilitar, siempre en la misma sesión de SQL Editor, sin dejar el trigger deshabilitado) cada vez que se necesite bootstrapear el primer admin de un entorno nuevo. Para promover administradores adicionales una vez que ya existe al menos uno, el camino normal es que ese primer admin lo haga desde la aplicación (Fase 5, invitación de administradores vía ADR-004), donde sí hay una sesión autenticada real y el trigger no es un obstáculo.

## Pruebas de seguridad a realizar (manual, en el panel de Supabase)

Como el entorno de trabajo no tiene acceso directo al proyecto Supabase, estas verificaciones quedan para que Braulio las confirme tras ejecutar las migraciones:

1. **RLS activo en las 9 tablas:** en **Table Editor**, cada tabla de `public.*` debe mostrar el ícono de candado (RLS habilitado). Si alguna tabla no lo muestra, revisar que su migración correspondiente se haya ejecutado completa.
2. **Un visitante no puede leer borradores:** desde el SQL Editor, ejecutar una consulta simulando el rol `anon` (o simplemente usar la API REST de Supabase sin sesión, `apikey` = publishable key) sobre `content_items`/`events` con `status != 'published'` — debe devolver 0 filas.
3. **Un usuario normal no puede escribir contenido:** crear una cuenta de prueba sin promoverla a admin (no correr el bootstrap para ella), autenticarse, e intentar un `insert`/`update` sobre `categories`/`content_items`/`hero_slides`/`events` — debe fallar por RLS (error de política, no de conexión).
4. **Un usuario no puede leer `contact_messages`/`feedback`/`infographic_leads` ni siquiera los que él mismo creó** — confirmar que un `select` autenticado no-admin sobre estas tablas devuelve 0 filas, incluso para las filas insertadas con su propio correo.
5. **Un usuario no puede cambiar su propio `role`/`status`** — autenticado como un usuario no-admin, intentar `update profiles set role = 'admin' where id = auth.uid()` debe fallar con el mensaje del trigger (`No puedes modificar tu propio role o status.`).
6. **El admin bootstrapeado sí puede** leer/escribir todo lo anterior — repetir los puntos 2-5 autenticado como el admin creado en el paso 3 de la sección anterior, y confirmar que esta vez sí tiene acceso.

## Decisiones tomadas

1. **`registration_url` en `events`:** se agregó como columna nullable, siguiendo el dato ya usado por el frontend desde la Fase 01B (`eventItems[].registrationUrl`, consumido por `EventDetailModal`). Es la única columna de `events` que no estaba en la lista original del plan maestro, agregada explícitamente por pedido de Braulio para esta fase.
2. **Tabla `infographic_leads` nueva:** no estaba en el modelo original del plan maestro — se agregó a pedido explícito de Braulio para reflejar `InfografiaLeadModal` (Fase 01B), que hoy solo simula el guardado del lead vía `sessionStorage`. Permite `insert` público sin sesión (igual que el formulario real) y solo lectura para admins.
3. **Trigger de perfil creado ahora, aunque no haya registro público:** por pedido explícito de Braulio, se creó `handle_new_user()` en esta fase (no en la Fase 5) como parte del modelo base. Hoy solo se disparará cuando se cree una cuenta de administrador manualmente desde el panel de Supabase — no hay ningún flujo de registro público que lo dispare (ver [ADR-004](../decisions/ADR-004-SIN-REGISTRO-PUBLICO.md)).
4. **El trigger de perfil no atrapa excepciones deliberadamente:** si el `insert` en `profiles` falla, la creación del usuario en `auth.users` falla también y el error es visible para quien lo esté creando (por ejemplo, un error 500 en el Dashboard de Supabase o en la API de administración) — se prefirió esto explícitamente sobre un `exception when others then null` que hubiera dejado usuarios "huérfanos" sin perfil de forma silenciosa.
5. **`is_admin()` centraliza toda la lógica de autorización:** todas las políticas de todas las tablas llaman a esta única función en vez de repetir el `select role='admin' and status='active' from profiles where id = auth.uid()` inline en cada política. Si el criterio de "quién es admin" cambia en el futuro, se actualiza en un solo lugar.
6. **Restricción de `role`/`status` propio vía trigger, no solo RLS:** Postgres RLS no permite comparar el valor viejo contra el nuevo de una misma fila dentro de una sola política `UPDATE` (solo se tiene acceso a la fila vieja en `USING` o a la nueva en `WITH CHECK`, no a ambas a la vez). Se resolvió con un trigger `BEFORE UPDATE` (`prevent_self_role_status_change`) que sí compara `OLD` contra `NEW` y usa `is_admin()` para decidir si el cambio de esas dos columnas específicas está permitido.
7. **Los administradores pueden leer y actualizar *todas* las filas de `profiles`**, no solo la propia: no estaba pedido explícitamente para esta fase, pero es necesaria para cualquier panel futuro de gestión de usuarios (bloquear/desbloquear, promover a admin) que ya está comprometido en el [ADR-004](../decisions/ADR-004-SIN-REGISTRO-PUBLICO.md) ("se agregará... una función para que un administrador invite a otros administradores"). Se documenta aquí como una decisión de diseño, no un pedido explícito de esta fase, para que quede claro si Braulio quiere ajustarla.
8. **`event_registrations`/`feedback` validan que el `user_id` insertado sea el propio `auth.uid()` (o null):** no estaba explícitamente pedido, pero se agregó para que "cualquiera puede insertar su propia inscripción/opinión" no permita insertar una fila a nombre de otro usuario ya autenticado.
9. **Índice único en `event_registrations (event_id, lower(email))`:** constraint no pedida explícitamente, agregada para evitar inscripciones duplicadas del mismo correo al mismo evento — un caso de uso obvio que el modelo original no cubría.
10. **`contact_messages`/`feedback` dan a los admins permisos de `update`/`delete` además de `select`** (siguiendo literalmente "solo admins pueden leer/actualizar/eliminar" para `contact_messages`, y "mismo patrón" para `feedback`), mientras que `event_registrations`/`infographic_leads` solo dan `select` a los admins, porque el pedido original solo mencionaba lectura para esas dos tablas — se documenta como posible pendiente si se necesita `delete` (p. ej. para solicitudes de borrado de datos).
11. **Numeración de migraciones por timestamp** (`20260727100000` en adelante) en vez de un contador simple (`0001_`, `0002_`): es la convención que usa el CLI de Supabase (`supabase migration new`), así que si en una fase futura se decide instalar el CLI y vincular el proyecto, estos archivos ya están en el formato esperado sin necesidad de renombrarlos.
12. **Seed data sin `created_by`:** las filas de ejemplo en `content_items`/`events` no tienen `created_by` (queda `null`) porque el seed está pensado para poder correrse antes de que exista ningún administrador bootstrapeado.
13. **`admin-bootstrap.example.sql` deshabilita y rehabilita `profiles_prevent_self_role_status_change` alrededor del `UPDATE`:** detectado al ejecutar el bootstrap real (ver [nota operacional](#bootstrap-del-primer-administrador-por-qué-se-deshabilita-un-trigger)) — el SQL Editor de Supabase no tiene contexto de sesión, por lo que `auth.uid()`/`is_admin()` siempre evalúan como "no admin" ahí, y el trigger bloquearía incluso el primer bootstrap. Se documenta como el método oficial para cualquier entorno futuro, no como un ajuste único de esta fase.

## Problemas conocidos

- **No se ejecutó ninguna migración contra el proyecto Supabase real desde este entorno de trabajo** — no hay CLI de Supabase instalado/vinculado ni credenciales de servicio disponibles aquí. Todo el SQL fue escrito y revisado manualmente (sintaxis, nombres de columnas, orden de dependencias entre tablas), pero **la verificación real de que corre sin errores queda pendiente de que Braulio lo ejecute en el SQL Editor**.
- El bundle de Vite y los warnings de lint no cambiaron en esta fase (no se tocó `src/`) — no aplica volver a correr `npm run lint`/`npm run build` para esta fase específica.

## Pendiente

- **Ejecutar las migraciones, el seed y el bootstrap de admin** en el proyecto Supabase real (Braulio, manualmente, según la sección [Comandos](#comandos-a-ejecutar-en-supabase)).
- **Realizar las pruebas de seguridad** listadas arriba y confirmar los resultados.
- Implementar autenticación de administradores (`supabase.auth`) sobre este modelo — Fase 5.
- Conectar `src/services/*` a estas tablas, reemplazando la lectura desde `src/data/seed/*.js` — Fase 6.
- Proteger las rutas `/admin/*` con la sesión real — Fase 5.
- Evaluar si `event_registrations`/`infographic_leads` necesitan políticas de `update`/`delete` para administradores más adelante (ver decisión 10).
- **Replicar la nota operacional del bootstrap de administrador en `docs/DEPLOYMENT.md`** cuando ese documento exista (todavía no se crea — está previsto para la Fase 10). Mientras tanto, esta misma sección de este documento es la referencia oficial del procedimiento para cualquier entorno (staging, producción, u otro proyecto Supabase).

## Próxima fase recomendada

Fase 5 — autenticación de administradores (login real sobre `supabase.auth`, protección de rutas `/admin/*`, invitación de administradores adicionales según ADR-004). **No se avanza a la Fase 5 sin confirmación explícita de Braulio**, y sin que primero se hayan ejecutado y verificado las migraciones de esta fase en el proyecto Supabase real.
