# Fase 9c — Menú "Contacto", regla de "destacado" en Noticias, y bugs de Portada

Tres frentes independientes. Se documentan juntos por venir del mismo pedido, pero corresponden a **3 commits separados** (ver [Archivos modificados por frente](#archivos-modificados-por-frente)) — no se mezclan.

## 0. Regresión: el CTA del hero seguía sin funcionar (causa real)

**No era un problema de datos.** Se verificó en producción (`https://tibox-connect.vercel.app`, no local) que:
- `getHeroSlides()` sí traía `ctaUrl` correctamente para el Slide 1 (`https://tibox-connect.vercel.app/infografias`, la misma URL que Braulio confirmó en el campo "URL del botón").
- `Hero.jsx` sí renderizaba el CTA como un `<a href="...">` real con esa URL exacta — no había datos viejos, ni un slide equivocado, ni nada hardcodeado de `data/seed/`.
- El bundle servido en producción (`assets/index-D8UXoooH.js`, confirmado por hash) ya incluía el fix del commit `67e17e2` — no era un problema de caché de build/CDN de Vercel.

**La causa real:** `.hero-shell` (el contenedor de todo el hero) tiene un handler `onPointerDown` para permitir arrastrar/deslizar el hero con el mouse o el dedo (pedido de Braulio de una fase anterior). Ese handler llamaba **incondicionalmente** a `e.currentTarget.setPointerCapture(e.pointerId)` en cada `pointerdown` dentro del hero — sin importar si el clic empezaba sobre el fondo (donde sí debía iniciar el arrastre) o sobre un control interactivo como el CTA, los puntos o las flechas del carrusel. Capturar el puntero en el contenedor interfiere con que el navegador dispare el evento `click` nativo sobre el botón/enlace real que está debajo, así que el clic se perdía de forma intermitente (varía según navegador/dispositivo) — esto explica tanto que el CTA "no llevara a ningún lado" como que las flechas "no funcionaran" (punto 3 más abajo): es la **misma causa raíz** para ambos síntomas.

**Fix:** `onHeroPointerDown` ahora revisa `e.target.closest('button, a')` primero — si el `pointerdown` empezó sobre un control interactivo, no inicia el arrastre ni captura el puntero, dejando que ese control reciba su propio clic con normalidad. El arrastre del fondo del hero (imagen/texto) sigue funcionando igual que antes.

**Verificado con clics reales** (no solo lectura del DOM) en el navegador de desarrollo: el CTA navegó a la URL configurada, la flecha "Siguiente" avanzó exactamente un slide, la flecha "Anterior" retrocedió exactamente un slide — los tres casos confirmados con el estado del slide antes/después de cada clic.

## 1. Menú "Contacto" (antes "Soporte")

- **`src/components/Header.jsx`**: ítem del menú renombrado de "Soporte" a "Contacto" (desktop y mobile). Prop `onSoporte`→`onContacto`, handler `handleSoporteClick`→`handleContactoClick` (renombrados, no solo el texto visible — evita que el código quede describiendo algo que ya no existe).
- **`src/layouts/PortalLayout.jsx`**: `SoporteModal`→`ContactoModal`. Contenido reemplazado por completo (antes tenía teléfono genérico + email + link al portal de tickets; ahora es un contacto general hacia tibox.cl):
  - "Contáctanos al +56 (75) 2600330. Selecciona la opción 3 "Área Comercial.""
  - Horario: "Lunes a viernes de 9:00 a 18:00 horas." / "Soporte crítico 24/7 para clientes NOC/SOC."
  - Botón "Ir a tibox.cl" → `https://tibox.cl`, `target="_blank" rel="noopener noreferrer"` (mismo criterio que el resto de enlaces externos del sitio, p. ej. el botón "Crear Tickets" del header, que no se tocó).

## 2. "Destacado" exclusivo para Noticias

**Antes:** el checkbox "Marcar como destacado" (formulario), la acción "Marcar/Quitar destacado" (menú de fila) y la columna "Destacado" de la tabla aparecían para Videos e Infografías también, sin que nada en el portal usara ese dato para esos dos tipos (solo `NoticiasPanel`/`newsService.getFeaturedNews()` lo consumen). Para Eventos ya estaba oculto (usan otra tabla/formulario, sin columna `is_featured`).

**Ajuste de UI (`src/admin/AdminWidgets.jsx`):**
- El checkbox del formulario (`NewContentModal`) solo se renderiza si `section === 'news'`.
- Al guardar, `is_featured` se fuerza a `false` para cualquier tipo que no sea `news`, en vez de confiar en que el checkbox oculto nunca se haya activado antes de este ajuste.
- La acción "Marcar/Quitar destacado" del menú de fila (`buildRowMenuItems`) ahora recibe un flag `isNews` explícito (antes usaba `!isEvent`, que dejaba pasar Videos/Infografías).
- La columna "Destacado" de `ContentTable` (encabezado y celda) solo se renderiza si `section === 'news'` — antes aparecía siempre (vacía y deshabilitada para Eventos, sin sentido para Videos/Infografías).

**Unicidad — a nivel de base de datos, no de UI (`supabase/migrations/20260812110000_single_featured_news_trigger.sql`):** se agregó un trigger `BEFORE INSERT OR UPDATE OF is_featured` sobre `content_items`. Cuando una fila `type='news'` se guarda con `is_featured=true`, el trigger desmarca automáticamente cualquier otra noticia que estuviera destacada, dentro de la **misma transacción**. Se eligió un trigger (no dos llamadas seguidas desde `adminContentService.js`) explícitamente porque un "primero desmarco, después marco" hecho desde el cliente **no es atómico** — dos administradores guardando casi al mismo tiempo podrían dejar dos noticias destacadas a la vez, o ninguna. El trigger corre siempre, sin importar qué camino del admin dispare el guardado (formulario o acción rápida del menú), así que no hay forma de saltárselo por accidente.

`newsService.getFeaturedNews()` (portal público) no cambió — ya filtraba por `is_featured=true` con `limit(1)`, que ahora es una garantía real (antes técnicamente podían existir dos filas `true` a la vez sin que nada lo impidiera, aunque en la práctica no había pasado).

## 3. Bugs de Portada (carrusel del hero)

- **CTA de infografías:** resuelto en el punto 0 — mismo fix (pointer capture), no fue necesario ningún cambio adicional específico de este slide.
- **Flechas del carrusel:** resuelto por el mismo fix del punto 0 — no eran un bug de estado/lógica del carrusel (`go()`, `setCur`, el `useEffect` del autoplay), sino el pointer capture del contenedor comiéndose el clic antes de que llegara al botón. El auto-play (`setInterval` cada 5.5s) no interfiere con la navegación manual — sigue corriendo en paralelo y el usuario puede seguir navegando manualmente en cualquier momento, igual que antes.

## Archivos modificados por frente

**Frente 0 + 3 (mismo commit — es el mismo fix):**
- `src/components/Hero.jsx` — guard `e.target.closest('button, a')` en `onHeroPointerDown`.

**Frente 1:**
- `src/components/Header.jsx` — rename Soporte→Contacto (prop, handler, label).
- `src/layouts/PortalLayout.jsx` — `ContactoModal` con el contenido nuevo.

**Frente 2:**
- `src/admin/AdminWidgets.jsx` — checkbox/columna/acción de "Destacado" acotados a `section === 'news'`.
- `supabase/migrations/20260812110000_single_featured_news_trigger.sql` — trigger de unicidad (nuevo).

## Cómo probar cada punto manualmente

**0 y 3 — Hero (CTA + flechas):**
1. En el inicio, esperar/navegar hasta el slide con CTA de infografías ("Ver infografías") y hacer clic → debe abrir `https://tibox-connect.vercel.app/infografias` en una pestaña nueva.
2. Hacer clic en la flecha "Siguiente" (`›`) varias veces seguidas → cada clic avanza exactamente un slide.
3. Hacer clic en la flecha "Anterior" (`‹`) → retrocede exactamente un slide.
4. Confirmar que arrastrar con el mouse sobre el fondo del hero (no sobre un botón) sigue cambiando de slide como antes.
5. Probado en desktop y mobile (viewport 375×812).

**1 — Menú Contacto:**
1. En el header, confirmar que el ítem dice "Contacto" (desktop y menú hamburguesa en mobile).
2. Al hacer clic, el popup debe mostrar exactamente el teléfono/opción 3, el horario, y el botón "Ir a tibox.cl" → `https://tibox.cl` en pestaña nueva.

**2 — Destacado exclusivo de Noticias:**
1. **Requiere que Braulio ejecute primero** `supabase/migrations/20260812110000_single_featured_news_trigger.sql` en el SQL Editor de Supabase.
2. En `/admin/contenidos` (Videos) y `/admin/contenidos/infografias`, confirmar que no aparece ninguna columna "Destacado" ni la opción en el menú de "..." de cada fila, ni el checkbox al crear/editar.
3. En `/admin/contenidos/noticias`, confirmar que sí aparecen los tres (columna, checkbox, acción de menú).
4. Marcar una noticia como destacada estando otra ya marcada → la anterior debe desmarcarse sola sin recargar manualmente esa otra fila (recargar la tabla para confirmar, ya que el admin recarga la página completa tras guardar).
5. En el inicio del portal, confirmar que el bloque "Publicación destacada" de Tendencias muestra la noticia recién marcada.

## Verificación técnica

- `npm run lint` — sin errores ni warnings nuevos.
- `npm run build` — build exitoso (aviso de chunk >500kB preexistente).
- Pruebas manuales descritas arriba, todas verificadas en el navegador de desarrollo salvo el guardado real de "Destacado" (bloqueado por la migración pendiente — se verificó sí que la UI oculta/muestra el control correctamente sin necesidad de escribir en la base).
- Rutas temporales de prueba (`/dev-test-videos`, `/dev-test-noticias`) agregadas y revertidas antes de terminar, confirmado con `git status`/`git diff` limpio en `AppRouter.jsx`.

## Pendiente de Braulio

1. **Ejecutar la migración `supabase/migrations/20260812110000_single_featured_news_trigger.sql`** en el SQL Editor de Supabase — sin esto, la regla de unicidad no está activa todavía en producción (el resto de los cambios de este punto sí, porque son solo de UI).
