import { useRef } from 'react';

// Pedido de Braulio: arrastrar con clic sostenido (mouse) para navegar los
// carruseles horizontales del portal, sin quitar las flechas existentes ni
// romper el clic normal sobre una tarjeta. Solo mouse: en touch, el scroll
// horizontal por arrastre ya es el comportamiento nativo del navegador
// sobre un contenedor con overflow-x — reimplementarlo a mano encima
// habría competido con el gesto nativo en vez de complementarlo.
//
// Devuelve los handlers de puntero (+ onClickCapture) para pasarle al
// contenedor con scroll. Un clic se suprime solo si el puntero se movió
// más de DRAG_THRESHOLD px antes de soltar — así un clic simple sigue
// abriendo la tarjeta y solo el arrastre real mueve el carrusel.
//
// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): el umbral
// original de 6px por sí solo no era la causa real del bug reportado (un
// clic real de mouse, probado con la secuencia nativa de eventos de
// puntero — no un `.click()` sintético — seguía sin abrir el popup incluso
// sin ningún movimiento). La causa real: `el.setPointerCapture(...)` se
// llamaba en TODO pointerdown, no solo al confirmarse un arrastre. Con el
// puntero capturado desde el primer instante, Chrome retarget el evento
// "click" posterior al elemento que capturó el puntero (el track) en vez
// del elemento real bajo el cursor (el botón/la tarjeta) — el target del
// clic terminaba siendo el track completo, así que el onClick del botón
// nunca llegaba a dispararse, sin importar cuánto se hubiera movido el
// mouse. Se corrigió capturando el puntero recién en onPointerMove, una
// vez que el movimiento supera DRAG_THRESHOLD (18px, temblor natural de
// la mano) y se confirma que es un arrastre real — un clic simple, sin
// ese movimiento, nunca llega a capturar el puntero y el clic conserva su
// target real.
//
// onClickCapture se pasa como prop normal de React (no vía
// ref+addEventListener manual en un useEffect) a propósito: el track de
// varios carruseles de este portal solo se monta condicionalmente después
// de la carga inicial (mientras isInitialLoad es true se renderiza un
// LoadingState en su lugar) — un useEffect con `[ref]` como dependencia
// corre una sola vez, cuando ref.current todavía es null, y no vuelve a
// correr cuando el div del track aparece más tarde (la identidad del
// objeto ref nunca cambia). Como prop de React normal, en cambio, se
// re-vincula en cada render igual que onPointerDown/onPointerMove, sin
// depender de cuándo se montó el nodo.
const DRAG_THRESHOLD = 18;

export function useDragScroll(ref) {
  const state = useRef({ dragging: false, startX: 0, startScrollLeft: 0, moved: false, pointerId: null });

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    // Nota: no se captura el puntero acá todavía — ver comentario extenso
    // arriba sobre por qué eso rompía el target del clic normal.
    state.current = { dragging: true, startX: e.clientX, startScrollLeft: el.scrollLeft, moved: false, pointerId: e.pointerId };
    el.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse' || !state.current.dragging) return;
    const el = ref.current;
    if (!el) return;
    const dx = e.clientX - state.current.startX;
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      if (!state.current.moved) el.setPointerCapture(state.current.pointerId);
      state.current.moved = true;
    }
    el.scrollLeft = state.current.startScrollLeft - dx;
  };

  const endDrag = (e) => {
    if (!state.current.dragging) return;
    state.current.dragging = false;
    const el = ref.current;
    if (el) {
      el.style.cursor = 'grab';
      if (e?.pointerId != null && el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
    }
    document.body.style.userSelect = '';
  };

  const onClickCapture = (e) => {
    if (state.current.moved) {
      e.stopPropagation();
      e.preventDefault();
      state.current.moved = false;
    }
  };

  return { onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag, onClickCapture };
}
