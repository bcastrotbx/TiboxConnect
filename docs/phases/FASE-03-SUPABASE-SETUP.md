# Fase 03 — Conexión base a Supabase

**Estado:** Completa
**Fecha:** 2026-07-25
**Rama de trabajo:** `feat/react-vite-migration` (misma de las fases anteriores)
**Repositorio:** https://github.com/WARISNAKE421/TiboxConnect

## Objetivo

Conectar de forma segura la aplicación al proyecto Supabase ya creado (`tibox-connect`), dejando el cliente inicializado y disponible — **sin** crear tablas, **sin** implementar autenticación y **sin** conectar los servicios existentes (`src/services/*`) todavía. Eso es alcance de las Fases 4 y 6.

## Alcance realizado

1. **`.env.local`** creado en la raíz del proyecto, con las dos variables reales entregadas por Braulio:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

   Ambas fueron entregadas explícitamente como "públicas, seguras de usar en el frontend" — es el nuevo formato de clave pública de Supabase (`sb_publishable_...`), equivalente en función a la antigua clave `anon`: está pensada para viajar en el bundle del cliente y quedar expuesta en el navegador. No es una clave secreta.

2. **`.env.example`** creado como plantilla, con los mismos dos nombres de variable **sin valores**, para que cualquiera que clone el repo sepa qué variables necesita sin exponer las reales.

3. **`.gitignore`** actualizado: se agregaron explícitamente `.env`, `.env.local` y `.env.*.local` (antes solo existía `*.local`, que ya cubría `.env.local`/`.env.*.local` por coincidencia de patrón, pero no cubría `.env` a secas — se dejaron las tres reglas explícitas para que no dependa de esa coincidencia).

4. **`src/lib/supabase.js`** creado: inicializa el cliente con `createClient()` de `@supabase/supabase-js` (ya instalado desde la Fase 1), leyendo `import.meta.env.VITE_SUPABASE_URL` y `import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY`. Si falta cualquiera de las dos, **lanza un `Error` con un mensaje explícito** (qué variables faltan, qué archivo crear, a qué documento mirar) en vez de fallar en silencio o con un error críptico de la librería.

5. **Ningún servicio de `src/services/*` fue tocado.** El cliente queda exportado y disponible (`import { supabase } from '../lib/supabase.js'`) pero nada lo importa todavía — se confirmó que el build no cambió de tamaño respecto a la Fase 2 (ver más abajo), señal de que el archivo nuevo no se está empaquetando por no tener ningún importador.

## Archivos modificados/creados

```
.env.local        (nuevo, con valores reales — ignorado por git, no versionado)
.env.example      (nuevo, plantilla sin valores)
.gitignore        (actualizado: + .env, .env.local, .env.*.local)
src/lib/supabase.js  (nuevo)
```

## Comandos ejecutados

```bash
npm run lint
npm run build
git status
git status --ignored=matching
git check-ignore -v .env.local
```

## Pruebas y resultados (salida real)

### `npm run lint`
```
src/admin/AdminWidgets.jsx
  65:28  warning  'ix' is defined but never used. Allowed unused args must match /^_/u

✖ 1 problem (0 errors, 1 warning)
```
Mismo único warning preexistente de la Fase 2 (`ix` sin usar en `RowMenu`, heredado de la Fase 1). 0 errores nuevos.

### `npm run build`
```
vite v6.4.3 building for production...
✓ 1626 modules transformed.
dist/index.html                     1.12 kB │ gzip:   0.42 kB
dist/assets/index-*.css             6.16 kB │ gzip:   1.70 kB
dist/assets/index-*.js          1,187.47 kB │ gzip: 245.54 kB
✓ built in 1.33s
```
Mismo tamaño de bundle exacto que al cierre de la Fase 2 (1,187.47 kB) — confirma que `src/lib/supabase.js` no se empaquetó porque nada lo importa todavía, tal como se esperaba para esta fase.

### Verificación de que `.env.local` está ignorado por git

```
$ git status
On branch feat/react-vite-migration
...
Untracked files:
	.env.example
	src/lib/
```
`.env.local` **no aparece** en absoluto en `git status` (ni como modificado, ni como untracked).

```
$ git status --ignored=matching
Ignored files:
  (use "git add -f <file>..." to include in what will be committed)
	.env.local
```

```
$ git check-ignore -v .env.local
.gitignore:6:.env.local	.env.local
```
Confirmado explícitamente: `.env.local` coincide con la regla `.env.local` de la línea 6 de `.gitignore` y aparece listado como archivo ignorado.

## Decisiones tomadas

1. **Publishable key tratada como dato público, no secreto:** Braulio confirmó explícitamente que ambos valores son seguros para el frontend. Aun así, se guardan solo en `.env.local` (nunca en código, nunca en `.env.example`, nunca en esta documentación) para mantener la práctica correcta de no hardcodear configuración de entorno, independientemente de si el valor es técnicamente público.
2. **Error explícito en vez de fallo silencioso:** `src/lib/supabase.js` lanza un `Error` con instrucciones concretas (qué archivo crear, qué variables faltan, a qué documento mirar) si `VITE_SUPABASE_URL` o `VITE_SUPABASE_PUBLISHABLE_KEY` no están definidas. Esto evita que un desarrollador nuevo se encuentre con un error genérico de `@supabase/supabase-js` sin contexto.
3. **`.gitignore` con reglas explícitas además de `*.local`:** aunque `*.local` ya cubre `.env.local` y `.env.*.local` por coincidencia de patrón, se agregaron las reglas explícitas pedidas (`.env`, `.env.local`, `.env.*.local`) para que la protección no dependa de una coincidencia incidental y sea legible para cualquiera que revise el archivo.
4. **Cero cambios en `src/services/*`:** se verificó (vía el tamaño idéntico del build) que el cliente de Supabase no quedó importado por ningún archivo — cumple estrictamente con "no conectes los servicios existentes todavía".

## Problemas conocidos

- Ninguno nuevo. El chunk de íconos (924 KB) y el bundle único (1.19 MB) siguen siendo los problemas conocidos heredados de la Fase 2, sin cambios en esta fase.

## Pendiente para la Fase 4 (y siguientes)

- Implementar autenticación de administradores usando el cliente ya creado (`supabase.auth`) — sin registro público, ver [ADR-004](../decisions/ADR-004-SIN-REGISTRO-PUBLICO.md).
- Crear el esquema de tablas en Supabase (contenido, mensajes, opiniones, eventos, leads de infografías, etc.) — no se creó ninguna tabla en esta fase.
- Conectar `src/services/*` al cliente de Supabase reemplazando la lectura desde `src/data/seed/` (Fase 6, o antes si se decide adelantar).
- Proteger las rutas `/admin/*` con la sesión real una vez exista autenticación (Fase 5).

## Próxima fase recomendada

Fase 4 — probablemente autenticación de administradores sobre el cliente ya creado, o el diseño del esquema de tablas en Supabase, según lo que defina el plan maestro. Requiere confirmación explícita de Braulio antes de iniciar.
