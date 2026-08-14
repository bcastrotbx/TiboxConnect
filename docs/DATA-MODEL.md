# Modelo de datos — TIBOX Connect

Este documento describe el esquema de Postgres/Supabase creado en la [Fase 4](phases/FASE-04-MODELO-DATOS-RLS.md), vía las migraciones versionadas en `supabase/migrations/`. Es un documento vivo: se actualiza cada vez que el esquema cambie en una fase futura.

**Importante:** este esquema existe en Supabase pero **`src/services/*` todavía no lo usa** — el frontend sigue leyendo de `src/data/seed/*.js`. La conexión real es alcance de la Fase 6.

## Diagrama de relaciones

```
auth.users (Supabase Auth)
  └─ 1:1 → profiles

categories
  └─ 1:N → content_items (category_id)

content_items
  └─ 1:N → infographic_leads (content_item_id, nullable)

profiles
  ├─ 1:N → content_items (created_by, nullable)
  ├─ 1:N → events (created_by, nullable)
  ├─ 1:N → event_registrations (user_id, nullable)
  └─ 1:N → feedback (user_id, nullable)

events
  └─ 1:N → event_registrations (event_id)

hero_slides, contact_messages, feedback  → tablas independientes (sin FK entrantes propias además de las ya listadas)
```

## Tablas

### `profiles`

Perfil de cada cuenta de `auth.users`. Se crea automáticamente vía el trigger `on_auth_user_created` (ver más abajo) — no hay registro público (ver [ADR-004](decisions/ADR-004-SIN-REGISTRO-PUBLICO.md)), así que en la práctica solo se crea cuando se da de alta una cuenta de administrador.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK, FK a `auth.users(id)`, `on delete cascade` |
| `full_name` | `text` | `not null default ''` |
| `company` | `text` | nullable |
| `phone` | `text` | nullable |
| `role` | `text` | `'user' \| 'admin'`, default `'user'` |
| `status` | `text` | `'active' \| 'blocked'`, default `'active'` |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | mantenido por trigger `set_profiles_updated_at` |

**RLS:** un usuario lee/actualiza solo su propia fila; los administradores (`is_admin()`) leen y actualizan cualquier fila. Un trigger (`prevent_self_role_status_change`) bloquea que un usuario no-admin cambie su propio `role`/`status`, incluso si técnicamente pudiera hacer `UPDATE` sobre su fila. No hay política de `INSERT` (las filas solo se crean vía el trigger de `auth.users`) ni de `DELETE`.

### `categories`

Categorías de `content_items` (videoteca, biblioteca, infografías, etc.).

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `name` | `text` | not null |
| `slug` | `text` | unique, not null |
| `description` | `text` | nullable |
| `color` | `text` | nullable |
| `icon` | `text` | nullable |
| `sort_order` | `integer` | default `0` |
| `is_active` | `boolean` | default `true` |
| `created_at` / `updated_at` | `timestamptz` | — |

**RLS:** lectura pública (`anon` + `authenticated`) de categorías con `is_active = true`; los admins ven todas (incluidas inactivas) y son los únicos que pueden insertar/actualizar/eliminar.

### `content_items`

Contenido del portal: videos, infografías, noticias y recursos, todos en la misma tabla (mismo patrón que ya usa el frontend), diferenciados por `type`.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK |
| `type` | `text` | `'video' \| 'infographic' \| 'news' \| 'resource'` |
| `category_id` | `uuid` | FK a `categories(id)`, `on delete set null` |
| `title` | `text` | not null |
| `slug` | `text` | unique, not null |
| `summary` | `text` | nullable |
| `body` | `text` | nullable (cuerpo largo, p. ej. noticias) |
| `thumbnail_url` | `text` | nullable |
| `external_url` | `text` | nullable (link externo: video, PDF, etc.) |
| `duration_minutes` | `integer` | nullable (videos) |
| `source_name` | `text` | nullable |
| `visibility` | `text` | `'public' \| 'authenticated'`, default `'public'` |
| `status` | `text` | `'draft' \| 'published' \| 'archived'`, default `'draft'` |
| `is_featured` | `boolean` | default `false` |
| `sort_order` | `integer` | default `0` |
| `published_at` | `timestamptz` | nullable |
| `created_by` | `uuid` | FK a `profiles(id)`, `on delete set null` |
| `created_at` / `updated_at` | `timestamptz` | — |

**RLS:**
- `anon` + `authenticated`: leen filas con `status='published'` y `visibility='public'`.
- `authenticated`: además, filas con `status='published'` y `visibility='authenticated'` (hoy no hay usuarios finales logueados por ADR-004, pero la política queda lista para futuros roles autenticados).
- Admins: leen todo (incluidos borradores/archivados) y son los únicos que insertan/actualizan/eliminan.

### `hero_slides`

Slides del carrusel de portada (hoy `SLIDES` en `src/data/seed/homeSeed.js`).

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK |
| `eyebrow`, `title`, `highlight_text`, `description` | `text` | `title` es `not null`, el resto nullable |
| `button_label`, `button_url`, `image_url` | `text` | nullable |
| `sort_order` | `integer` | default `0` |
| `is_active` | `boolean` | default `true` |
| `created_at` / `updated_at` | `timestamptz` | — |

**RLS:** igual patrón que `categories` — lectura pública de slides activos, admins ven/gestionan todo.

### `events`

Eventos próximos y realizados.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK |
| `title` | `text` | not null |
| `slug` | `text` | unique, not null |
| `summary`, `description` | `text` | nullable |
| `starts_at` | `timestamptz` | not null |
| `ends_at` | `timestamptz` | nullable |
| `location` | `text` | nullable |
| `modality` | `text` | `'online' \| 'presential' \| 'hybrid'` |
| `thumbnail_url` | `text` | nullable |
| `registration_url` | `text` | nullable — **agregado en la Fase 4** para el link externo de inscripción (Teams, etc.) que `EventDetailModal` ya consume desde la Fase 01B |
| `visibility` | `text` | `'public' \| 'authenticated'`, default `'public'` |
| `status` | `text` | `'draft' \| 'published' \| 'completed' \| 'archived'`, default `'draft'` |
| `partner_name` | `text` | nullable |
| `created_by` | `uuid` | FK a `profiles(id)`, `on delete set null` |
| `created_at` / `updated_at` | `timestamptz` | — |

**RLS:** mismo patrón que `content_items` (público/autenticado/admin según `status` + `visibility`).

### `event_registrations`

Inscripciones a eventos (independiente del link externo `registration_url` — pensada para cuando se capture inscripción directamente en la plataforma).

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK |
| `event_id` | `uuid` | FK a `events(id)`, `on delete cascade`, not null |
| `user_id` | `uuid` | FK a `profiles(id)`, `on delete set null`, nullable |
| `full_name`, `email` | `text` | not null |
| `company`, `phone` | `text` | nullable |
| `created_at` | `timestamptz` | — |

Constraint adicional: índice único sobre `(event_id, lower(email))` para evitar inscripciones duplicadas del mismo correo al mismo evento.

**RLS:** cualquiera (`anon`/`authenticated`) puede insertar su propia inscripción (`user_id` debe ser `null` o el propio `auth.uid()`); solo admins pueden leer el listado. No hay políticas de `UPDATE`/`DELETE` en esta fase.

### `contact_messages`

Mensajes del formulario de contacto.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK |
| `full_name`, `email`, `message` | `text` | not null |
| `company`, `phone`, `service` | `text` | nullable |
| `status` | `text` | `'new' \| 'read' \| 'resolved'`, default `'new'` |
| `created_at` | `timestamptz` | — |

**RLS:** inserción pública sin restricciones; solo admins leen/actualizan/eliminan — **nadie, ni siquiera quien envió el mensaje, puede volver a leerlo**.

### `feedback`

Opiniones de clientes (`OpinionPanel`). Mismo patrón de acceso que `contact_messages`.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK a `profiles(id)`, `on delete set null`, nullable |
| `full_name`, `email` | `text` | not null |
| `rating` | `integer` | not null, `between 1 and 5` |
| `message` | `text` | nullable |
| `status` | `text` | `'new' \| 'read' \| 'archived'`, default `'new'` |
| `created_at` | `timestamptz` | — |

**RLS:** inserción pública (`user_id` debe ser `null` o el propio `auth.uid()`); solo admins leen/actualizan/eliminan.

### `infographic_leads`

Leads capturados por `InfografiaLeadModal` antes de descargar una infografía.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK |
| `full_name`, `email` | `text` | not null |
| `company`, `position` | `text` | nullable |
| `content_item_id` | `uuid` | FK a `content_items(id)`, `on delete set null`, nullable |
| `created_at` | `timestamptz` | — |

**RLS:** inserción pública sin sesión; solo admins pueden leer.

### `analytics_events`

Eventos de comportamiento anónimo del portal público (Fase Analítica 1, ver [FASE-10-ANALITICA-FASE1.md](phases/FASE-10-ANALITICA-FASE1.md)). Solo `page_view` está en uso — el resto de `event_type` queda previsto para fases siguientes (video, CTAs, formularios) sin necesitar un `ALTER` del constraint.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `bigint` | PK, `generated always as identity` |
| `event_type` | `text` | not null, `check` con los tipos previstos por el documento de análisis; solo `'page_view'` en uso |
| `anonymous_id` | `uuid` | not null — persistido en `localStorage`, no vinculado a datos personales |
| `session_id` | `uuid` | not null — expira por inactividad (30 min), ver `src/lib/analytics.js` |
| `page_path`, `section`, `content_id`, `content_title` | `text` | nullable salvo `page_path` |
| `metadata` | `jsonb` | not null, default `'{}'` |
| `referrer` | `text` | nullable |
| `device_type` | `text` | `check` `'mobile' \| 'tablet' \| 'desktop'`, nullable |
| `created_at` | `timestamptz` | — |

**RLS:** inserción pública (`anon`+`authenticated`) sin restricciones — cualquier visitante registra su propio comportamiento; solo admins leen (`is_admin()`). Sin tabla `admin_profiles` separada, mismo patrón que el resto del esquema. **No se rastrea por IP** — ver la nota de privacidad en la migración.

## Funciones y triggers

- **`public.set_updated_at()`** — trigger genérico `BEFORE UPDATE` que fija `updated_at = now()`. Usado por `profiles`, `categories`, `content_items`, `hero_slides` y `events`.
- **`public.handle_new_user()`** — trigger `AFTER INSERT` sobre `auth.users` que crea la fila correspondiente en `profiles`. `SECURITY DEFINER`. Deliberadamente **no atrapa excepciones**: si el insert en `profiles` falla, la creación del usuario en `auth.users` también falla y el error queda visible (no hay fallo silencioso).
- **`public.is_admin()`** — función `SECURITY DEFINER` + `search_path` fijo que verifica si `auth.uid()` corresponde a un `profiles.role='admin'` con `status='active'`. Usada por todas las políticas RLS de todas las tablas — ninguna política duplica esta lógica inline.
- **`public.prevent_self_role_status_change()`** — trigger `BEFORE UPDATE` sobre `profiles` que impide que un usuario no-admin cambie su propio `role` o `status`, incluso dentro de su propia fila.
- **`public.promote_to_admin(target_user_id uuid)`** (Fase 5) — función `SECURITY DEFINER` restringida al rol `service_role`, usada por la Edge Function `invite-admin` para promover a un usuario recién invitado a `role='admin'`.

## Storage (Fase 6/7/8)

- **Bucket `content-images`** (público): miniaturas de noticias/infografías y banners de eventos, subidos desde el panel admin (`src/services/storageService.js`). Lectura pública sin restricción; escritura (insert/update/delete) restringida a administradores vía `is_admin()` sobre `storage.objects`. Ver `supabase/migrations/20260729100200_storage_content_images.sql`.

## Convenciones usadas en todo el esquema

- Todas las PK son `uuid` con `default gen_random_uuid()` (excepto `profiles.id`, que es la misma `auth.users.id`).
- RLS está **habilitado en todas las tablas, sin excepción**.
- Ninguna política duplica la lógica de "¿es admin?" — todas llaman a `public.is_admin()`.
- Los campos de estado (`status`, `visibility`, `role`) usan `check` constraints con los valores permitidos en vez de tablas de lookup separadas, dado el tamaño y estabilidad del set de valores.
