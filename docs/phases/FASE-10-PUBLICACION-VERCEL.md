# Fase 10 — Preparación para publicar en Vercel

**Estado:** Completa la parte que corresponde a este entorno de trabajo (configuración de código, verificación de build, checklist de variables de entorno y auditoría de secretos). **El despliegue real en Vercel queda pendiente de que Braulio lo haga manualmente** — este entorno no tiene acceso al panel de Vercel. Ver [Pendiente](#pendiente-lo-que-braulio-debe-hacer-en-vercel).
**Fecha:** 2026-07-30
**Rama de trabajo:** `feat/react-vite-migration` (misma de las fases anteriores)
**Repositorio:** https://github.com/bcastrotbx/TiboxConnect

## Objetivo

Preparar el código y la configuración del proyecto para que Braulio pueda publicarlo en Vercel, sin dejar nada por adivinar en el panel: el `vercel.json` necesario para que las rutas de la SPA no den 404 al recargar, confirmación de que `npm run build` sigue funcionando y de cuál es la carpeta de salida, una auditoría explícita de que no hay ninguna clave real filtrada en el repositorio, y la lista exacta de variables de entorno que hay que cargar en Vercel.

## Alcance realizado

1. **`vercel.json`** (nuevo, en la raíz): una regla de `rewrites` que redirige cualquier ruta (`/(.*)`) a `/index.html`, para que `react-router-dom` pueda tomar el control de rutas como `/admin/contenidos` o `/login` al recargar directamente o al pegar la URL — sin esto, Vercel intentaría servir un archivo físico en esa ruta, no lo encontraría, y devolvería 404 en vez de dejar que la SPA decida qué mostrar.
2. **`npm run build` verificado** — sigue compilando sin errores, genera todo en `dist/` (ver [Comandos](#comandos-ejecutados)). Esa es la carpeta que Braulio debe configurar como "Output Directory" en Vercel.
3. **Auditoría de secretos en el repositorio** — búsqueda explícita de claves reales versionadas por error (ver [Auditoría de secretos](#auditoría-de-secretos-realizada) para el detalle de cada búsqueda y su resultado). No se encontró ninguna.
4. **Lista final de variables de entorno para Vercel** — ver [Variables de entorno para Vercel](#variables-de-entorno-para-vercel).

## Comandos ejecutados

```bash
npm run lint
npm run build
ls dist/
```

### `npm run lint`
```
✖ 0 problems
```

### `npm run build`
```
vite v6.4.3 building for production...
✓ 1682 modules transformed.
dist/index.html                     1.12 kB │ gzip:   0.42 kB
dist/assets/index-*.css             6.16 kB │ gzip:   1.70 kB
dist/assets/index-*.js          1,423.71 kB │ gzip: 304.59 kB
✓ built in 1.53s
```

### `ls dist/`
```
_ds
assets
index.html
```

`vite.config.js` no define `build.outDir`, así que Vite usa su valor por defecto: **`dist`**. Es el nombre exacto que Braulio debe escribir en el campo "Output Directory" del panel de Vercel (Vercel suele detectarlo solo al reconocer un proyecto Vite, pero queda documentado explícitamente para no depender de la detección automática).

## Auditoría de secretos realizada

Se buscó, sobre **todos los archivos versionados** (`git grep`, no el directorio de trabajo completo — así no se cuela nada que esté en `.gitignore` pero tampoco se deja pasar nada que sí esté trackeado):

| Búsqueda | Resultado |
|---|---|
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` como texto | Solo aparecen como **nombres de variable** en `.env.example` (sin valor), `README.md`, `docs/phases/FASE-03-SUPABASE-SETUP.md` y `src/lib/supabase.js` (`import.meta.env.VITE_SUPABASE_URL`, nunca un valor hardcodeado). |
| `supabase.co` (dominio del proyecto real) | Sin coincidencias en ningún archivo versionado. |
| El project ref real del proyecto Supabase (visto en pruebas de fases anteriores) | Sin coincidencias. |
| `service_role` | Solo aparece en documentación (`docs/DATA-MODEL.md`, ADR-005, FASE-05) explicando *que existe* y *por qué nunca debe estar en el frontend* — nunca como un valor real. |
| `sb_publishable_...` / `sb_secret_...` (formato nuevo de claves Supabase) con caracteres reales después del prefijo | Sin coincidencias. |
| Cadenas que empiezan con `eyJ` (prefijo base64 típico de un JWT) | Única coincidencia: `legacy/tibox-connect-portal-standalone.html` (7.6 MB, wrapper de artifact-host documentado en el README como "no es el portal real", de antes de la migración a Vite). Se revisó ese archivo explícitamente por "supabase"/"apikey"/"anon key"/"VITE_SUPABASE": **cero coincidencias** — las cadenas `eyJ` que contiene son datos embebidos (imágenes/fuentes en base64) sin relación con Supabase, no credenciales. |
| `.env.local` trackeado por git | No — `git status --ignored` lo confirma como ignorado (`.gitignore:6`), y `git check-ignore -v .env.local` lo confirma explícitamente. |
| `dist/` o `node_modules/` trackeados por git | No — ningún archivo de ninguna de las dos carpetas está en `git ls-files`. |

**Conclusión: no hay ninguna clave real (ni de ejemplo con valores reales) en el repositorio versionado.** La única clave que viaja al navegador (`VITE_SUPABASE_PUBLISHABLE_KEY`) es, por diseño, pública y segura para el frontend — ver la decisión ya documentada en la [Fase 03](FASE-03-SUPABASE-SETUP.md#decisiones-tomadas) — pero de todas formas nunca se hardcodeó, siempre se lee desde variables de entorno.

## Variables de entorno para Vercel

Exactamente estas dos — son las únicas que el código lee (`import.meta.env.*`, ver `src/lib/supabase.js`), y **ambas deben tener el prefijo `VITE_`** para que Vite las incluya en el build del navegador:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Los valores son los mismos que Braulio ya tiene en su `.env.local` (Fase 03) — no se reproducen aquí ni en ningún archivo del repositorio.

**No hay ninguna otra variable que configurar en Vercel.** En particular:
- `SUPABASE_SERVICE_ROLE_KEY` (la Edge Function `invite-admin`, Fase 5) **no es una variable de Vercel** — corre en la infraestructura de Supabase, no en Vercel, y Supabase se la inyecta automáticamente a sus propias Edge Functions. No debe configurarse acá bajo ninguna circunstancia.
- No hay backend propio ni funciones serverless en este proyecto (es una SPA estática servida por Vercel) — todo lo que no sea `VITE_*` no tiene ningún efecto en el build.

## Pendiente (lo que Braulio debe hacer en Vercel)

Todo esto requiere el panel de Vercel, al que este entorno de trabajo no tiene acceso:

1. **Crear el proyecto en Vercel** apuntando a este repositorio (`bcastrotbx/TiboxConnect`), rama `feat/react-vite-migration` (o la rama/tag que se decida usar para producción cuando se haga merge a `main` — este entorno nunca tocó `main`, ver reglas del proyecto).
2. **Framework Preset:** Vercel debería autodetectar "Vite". Si no lo hace, configurar manualmente:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. **Cargar las 2 variables de entorno** listadas arriba (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) en Project Settings → Environment Variables, con los valores reales del proyecto Supabase `tibox-connect`.
4. **Desplegar** y verificar manualmente en el dominio de Vercel:
   - Que `/`, `/login`, `/admin` (debería redirigir a `/acceso-no-autorizado` sin sesión) y una URL profunda como `/admin/contenidos/noticias` cargan bien tanto navegando desde la app como pegando la URL directamente y recargando (esto último es justamente lo que prueba que el `rewrite` de `vercel.json` funciona).
   - Que el login real funciona contra el dominio de Vercel (Supabase Auth no tiene restricción de dominio por defecto, pero conviene confirmarlo).
   - Revisar si hace falta agregar el dominio de Vercel a alguna configuración de URLs permitidas en Supabase Auth (Site URL / Redirect URLs) si no estaba ya configurado desde antes — esto no se pudo verificar desde este entorno.
5. **Dominio propio (si aplica):** configurar un dominio de TIBOX en Vercel en vez del subdominio `*.vercel.app` por defecto, si el negocio lo requiere para el evento o en general.

## Próxima fase recomendada

Ninguna — la Fase 10 se detiene aquí porque el resto depende exclusivamente del panel de Vercel. Cuando Braulio confirme que el despliegue está funcionando, retomar según lo que priorice el negocio (Fase 9 — guardado real de leads/mensajes/opiniones — sigue pendiente de fases anteriores).
