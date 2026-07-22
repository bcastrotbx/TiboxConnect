# Fase 01 — Migración a React + Vite

**Estado:** Completa
**Fecha:** 2026-07-22
**Rama de trabajo:** `feat/react-vite-migration`
**Repositorio:** https://github.com/WARISNAKE421/TiboxConnect
**Commits de esta fase:** `96132b4`, `091efd9`, `ad474a3` (sobre la base de `868cc73` de Fase 0)

## Objetivo

Migrar el prototipo de HTML estático + React/Babel-por-CDN a una aplicación React + Vite real, administrada con npm, **conservando fielmente** diseño, textos, imágenes, colores y comportamiento visual. No se conecta Supabase, no se implementa autenticación real, no se rediseñan componentes, no se corrige la lógica de los formularios simulados (solo se corrigen enlaces rotos).

## Alcance realizado

1. **Respaldo del prototipo original:** se confirmó que el commit `0d98b32` en `main` es el respaldo íntegro (ver decisión más abajo) — no se duplicó el prototipo en `legacy/`.
2. **`legacy/`:** `uploads/`, `screenshots/` y `Tibox Connect - Portal Standalone.html` movidos fuera del árbol de build, sin borrarse.
3. **Vite + React + JavaScript inicializado:** `package.json` con scripts `dev`, `build`, `lint`, `preview`.
4. **Dependencias instaladas:**
   - Producción: `react`, `react-dom`, `react-router-dom`, `@supabase/supabase-js`, `lucide-react`.
   - Desarrollo: `vite`, `@vitejs/plugin-react`, `eslint` (+ `@eslint/js`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`).
   - `react-router-dom` y `@supabase/supabase-js` quedan **instalados pero sin usar** — listos para la Fase 2, tal como se pidió.
5. **CDN/Babel eliminados:** ya no hay `<script src="unpkg.com/...">` en ningún HTML. Los 6 componentes `.jsx` originales se convirtieron en módulos ES importables:

   | Original | Nuevo módulo |
   |---|---|
   | `connect-v2-sidebar.jsx` | `src/components/Sidebar.jsx` |
   | `connect-v2-header.jsx` | `src/components/Header.jsx` |
   | `connect-v2-top.jsx` | `src/components/Hero.jsx` + `src/components/OpinionPanel.jsx` + `src/components/shared/CosmicBg.jsx` + `src/components/shared/ModalShell.jsx` |
   | `connect-v2-media.jsx` | `src/components/Media.jsx` |
   | `connect-v2-events.jsx` | `src/components/Events.jsx` |
   | `connect-v2-bottom.jsx` | `src/components/Services.jsx` |

   `admin/index.html` (script inline de ~1120 líneas) se convirtió en `src/admin/AdminApp.jsx` + `src/admin/main.jsx`, como segundo entry point de Vite (portal en `/`, admin en `/admin/`), **sin React Router** — sigue siendo una página separada, igual que antes.
6. **Iconos → lucide-react:** se reemplazó el patrón `<i data-lucide="x">` + `window.lucide.createIcons()` por un componente `Icon` (`src/components/shared/Icon.jsx`) que resuelve el nombre kebab-case al componente PascalCase real de `lucide-react` en runtime. Se verificaron los 73 nombres de ícono únicos usados en todo el código contra las exportaciones reales de `lucide-react` antes de aplicar el cambio — los 73 resolvieron correctamente.
7. **Assets:** `assets/` → `public/assets/`, `_ds/` → `public/_ds/`. Se eliminó el indirector `window.__res(id, fallback)` (nunca tenía overrides reales) y se usan rutas absolutas `/assets/...` directamente.
8. **Enlaces rotos corregidos:** los 3 `<a href="../Tibox Connect v2.html">` de `admin/index.html` ahora apuntan a `/` (el portal real). Es un enlace normal entre las dos páginas estáticas, no una ruta de React Router.
9. **Bug encontrado y corregido durante la verificación:** `_ds_bundle.js` (el bundle compilado del design system, fuera de alcance de esta fase) espera un `window.React` global heredado del setup CDN anterior. Al empaquetar React como módulo ES, `window.React` dejaba de existir y el componente `Badge` del admin fallaba con `ReferenceError: React is not defined`, dejando el panel admin en blanco. Se expone `window.React` en `src/admin/main.jsx` antes de montar — sin modificar el bundle en sí.

## Archivos modificados/creados (resumen)

```
package.json, package-lock.json, vite.config.js, eslint.config.js, .gitignore
index.html                       (reescrito: sin CDN, <script type="module">)
admin/index.html                 (reescrito: sin CDN, <script type="module">)
src/main.jsx, src/App.jsx, src/index.css
src/admin/main.jsx, src/admin/AdminApp.jsx, src/admin/admin.css
src/components/{Sidebar,Header,Hero,OpinionPanel,Media,Events,Services}.jsx
src/components/shared/{Icon,CosmicBg,ModalShell}.jsx
public/assets/*  (ex assets/)
public/_ds/*     (ex _ds/)
legacy/{uploads,screenshots,tibox-connect-portal-standalone.html}  (ex raíz)
```

Eliminados (migrados, ya no existen en la raíz): `connect-v2-sidebar.jsx`, `connect-v2-header.jsx`, `connect-v2-top.jsx`, `connect-v2-media.jsx`, `connect-v2-events.jsx`, `connect-v2-bottom.jsx`.

## Comandos ejecutados

```bash
git switch feat/react-vite-migration   # ya existía, no se creó una nueva
git mv uploads legacy/uploads
git mv screenshots legacy/screenshots
git mv "Tibox Connect - Portal Standalone.html" legacy/tibox-connect-portal-standalone.html
git mv assets public/assets
git mv _ds public/_ds
git rm connect-v2-*.jsx
npm install
npm run lint
npm run build
npm run preview -- --port 4173
git add -A && git commit -m "..."   # 3 commits intermedios
```

## Pruebas y resultados (salida real, no asumida)

### `npm install`
```
added 279 packages, and audited 280 packages in 18s
found 0 vulnerabilities
```

### `npm run lint`
Primera corrida: **2 errores** (`react/no-unescaped-entities` por comillas literales `"{label}"` en `Placeholder`, heredadas tal cual del prototipo original) + 3 warnings de variables no usadas (código muerto que ya existía en el prototipo: `Placeholder` nunca se renderiza, `partner` sin usar en `PastEventCard`, un `ix` sin usar). Se corrigieron los 2 errores (escape de comillas); los 3 warnings se dejaron tal cual porque son código muerto preexistente, fuera de alcance de esta fase.

Resultado final:
```
/Users/.../src/admin/AdminApp.jsx
  280:28  warning  'ix' is defined but never used
  634:10  warning  'Placeholder' is defined but never used

/Users/.../src/components/Events.jsx
  445:9  warning  'partner' is assigned a value but never used

✖ 3 problems (0 errors, 3 warnings)
```

### `npm run build`
```
vite v6.4.3 building for production...
✓ 1591 modules transformed.
dist/index.html                   1.19 kB │ gzip:   0.44 kB
dist/admin/index.html             1.45 kB │ gzip:   0.57 kB
dist/assets/main-M_NzMs6T.css     1.97 kB │ gzip:   0.81 kB
dist/assets/admin-BL2sps6D.css    4.17 kB │ gzip:   1.29 kB
dist/assets/admin-D1amNVdf.js    56.21 kB │ gzip:  12.48 kB
dist/assets/main-CN0l5U4T.js    127.57 kB │ gzip:  26.43 kB
dist/assets/Icon-BPEQRzeZ.js    924.30 kB │ gzip: 182.25 kB
(!) Some chunks are larger than 500 kB after minification.
✓ built in 1.22s
```
**Advertencia real, no oculta:** el chunk `Icon-*.js` pesa 924 KB (182 KB gzip) porque el wrapper `Icon` hace `import * as icons from 'lucide-react'` con resolución dinámica por nombre — esto impide que Rollup elimine (tree-shake) los ~1500 íconos no usados de la librería. Es la contrapartida de la decisión de diseño tomada (ver más abajo). Si el tamaño de bundle se vuelve un problema, la solución es reemplazar el wrapper dinámico por imports explícitos de los ~73 íconos realmente usados.

### `npm run preview` + verificación en navegador
Servidor corriendo en `http://localhost:4173/`. Se verificó visualmente:
- **Portal (`/`):** sidebar, header, hero slider (rotación automática y navegación manual), category blocks, modal de videoteca completa (búsqueda + filtros), sin errores de consola.
- **Admin (`/admin/index.html`):** dashboard con estadísticas y `Badge` de estado coloreados correctamente, navegación entre secciones (Mensajes de contacto, con badges NUEVO/RESPONDIDO/CERRADO), sin errores de consola en una pestaña nueva.
- Antes del fix de `window.React`, el admin cargaba en blanco con `ReferenceError: React is not defined` en cada render de `Badge` — confirmado y corregido (ver arriba).

## Decisiones tomadas

1. **Respaldo del prototipo:** se usa el commit `0d98b32` en `main` como respaldo íntegro, en vez de duplicar ~8 MB de archivos en `legacy/prototipo-claude-design/`. Es recuperable en cualquier momento con `git show 0d98b32:<ruta>` o `git checkout 0d98b32 -- .`.
2. **`Tibox Connect - Portal Standalone.html` → `legacy/`:** confirmado como wrapper de artifact-host (7.2 MB, manifiesto de assets embebido en base64), no el portal canónico. No se migra ni se elimina.
3. **`uploads/` y `screenshots/` → `legacy/`:** no estaban referenciados por ningún código.
4. **Admin sin React Router:** se mantiene como segundo entry point estático de Vite (multi-page build), no como ruta de una SPA unificada — así se evita "implementar rutas todavía" sin dejar de corregir los enlaces rotos.
5. **Componente `Icon` con resolución dinámica:** en vez de mapear a mano ~150 usos de íconos a imports individuales de `lucide-react` (alto riesgo de typos), se creó un wrapper que convierte `"chevron-right"` → `ChevronRight` en runtime. Se verificaron los 73 nombres únicos contra las exportaciones reales antes de aplicar el cambio. Costo: pierde tree-shaking (ver advertencia de build arriba).
6. **`_ds_bundle.js` fuera de alcance:** se mantiene como script global cargado por `<script src="...">` en ambos HTML, tal como antes — no se tocó su código, solo se le proveyó el `window.React` que siempre esperó.
7. **Sin `React.StrictMode`:** se decidió no envolver la app en `StrictMode` para esta fase, porque el doble-invocado de efectos en desarrollo podría alterar visualmente animaciones basadas en `setTimeout`/`setInterval` (slider, envíos simulados) durante la comparación visual con el prototipo original.

## Problemas conocidos

- **Bundle de íconos pesado** (924 KB / 182 KB gzip) por el diseño del wrapper `Icon` — documentado arriba, no bloqueante para esta fase.
- **3 warnings de ESLint por código muerto preexistente** (`Placeholder`, variable `partner`, variable `ix`) — heredados del prototipo original, no introducidos por la migración. No se limpiaron para no exceder el alcance de "conservar fielmente el comportamiento actual".
- **`react-router-dom` y `@supabase/supabase-js` instalados sin uso** — es intencional (preparación para fases futuras), pero implica que `npm ls` mostrará dependencias "sin importar" hasta que se usen.

## Cómo revertir

- Revertir solo esta fase: `git revert ad474a3 091efd9 96132b4` (en orden, o usar `git reset --hard 868cc73` si se prefiere descartar la fase completa sin conservar historial — con las salvedades de siempre sobre operaciones destructivas).
- Recuperar el prototipo original completo: `git checkout 0d98b32 -- .` desde cualquier punto del historial.
- La rama `main` nunca fue tocada durante esta fase ni la anterior.

## Pendiente para la Fase 2

- Implementar rutas reales con `react-router-dom` (ya instalado) — decidir si el admin se integra a una sola SPA con rutas o se mantiene como segunda aplicación separada.
- Separar los datos hardcodeados (arrays `SLIDES`, `CONTENT_ITEMS`, `MESSAGES`, `OPINIONS`, `servicesV2`, etc.) de los componentes hacia `src/data/*.js` o similar.
- Decidir si se conecta `@supabase/supabase-js` (ya instalado) a un backend real, y si los formularios simulados pasan a enviar datos de verdad.
- Evaluar si conviene reemplazar el wrapper dinámico de `Icon` por imports explícitos para reducir el peso del bundle.
- Confirmación explícita de Braulio para avanzar a la Fase 2.
