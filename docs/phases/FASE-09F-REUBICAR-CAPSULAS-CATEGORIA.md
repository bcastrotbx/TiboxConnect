# Fase 9f — Reubicar cápsulas de categoría a la miniatura

Pedido de Braulio: la cápsula de categoría vivía en el cuerpo de la tarjeta, muy cerca del CTA ("Ver video", "Ver detalles", etc.), lo que confundía. Se movió a la esquina superior derecha de la miniatura/imagen, como etiqueta flotante — mismo patrón ya usado por "Próximamente" (esquina opuesta).

**No aplica a `EventCard`** (`src/components/Events.jsx`) — los eventos no tienen columna de categoría, solo "Modalidad", y esa etiqueta ya vivía lejos del CTA. Sin cambios ahí, confirmado en `/eventos`.

## Archivos modificados

- **`src/pages/VideotecaPage.jsx`** (`VideotecaCard`) — tarjeta de `/videoteca` (videos + eventos combinados). La cápsula de categoría/tipo (o "Evento" cuando no aplica) pasó de la fila `título → [categoría | fecha] → CTA` a un `<span>` `position:absolute, top:8, right:8` sobre la miniatura. No choca con "Próximamente" (arriba a la izquierda) ni con la duración del video (abajo a la derecha).
- **`src/components/Media.jsx`** (`VideoCard`) — carrusel "Explora Videos y Webinars" del inicio. Misma cápsula agregada arriba a la derecha de la miniatura (junto a la duración, que sigue abajo a la derecha); se eliminó el bloque que la mostraba en el cuerpo.
- **`src/components/Media.jsx`** (`InfoCard`) — grilla de `/infografias` y su carrusel del inicio. El badge de canal (LinkedIn/Instagram/etc., con ícono) pasó a la miniatura arriba a la izquierda — mismo patrón que ya usa `InfografiaModal` en la vista ampliada; la cápsula de categoría pasó a la miniatura arriba a la derecha. El cuerpo de la tarjeta quedó solo con título y botón "Ver infografía".
- **`src/pages/TendenciasPage.jsx`** (`NoticiaGridCard`) — ya mostraba la categoría sobre la imagen, pero a la izquierda; por consistencia con las otras 3 tarjetas, pasó a la derecha (`left: 10` → `right: 10`, único cambio en este archivo).

## Cómo se probó

1. `/videoteca` — cada tarjeta (video o evento) muestra su categoría/tipo en la esquina superior derecha de la miniatura. Confirmado en el navegador de desarrollo.
2. Inicio → carrusel "Explora Videos y Webinars" — mismo resultado.
3. `/infografias` — canal arriba a la izquierda, categoría arriba a la derecha, cuerpo solo con título y botón. Confirmado.
4. `/tendencias` — la categoría de cada noticia pasó de la esquina superior izquierda a la superior derecha. Confirmado.
5. `/eventos` — `EventCard` sin cambios, badge de modalidad sigue en el cuerpo como antes. Confirmado.
6. Sin errores de consola en ninguna de las páginas anteriores.

## Verificación técnica

- `npm run lint` — sin errores ni warnings nuevos.
- `npm run build` — build exitoso (aviso de chunk >500kB preexistente).
