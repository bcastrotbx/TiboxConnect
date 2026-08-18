// Pedido de Braulio: se eliminó el arrastre con mouse de los carruseles
// horizontales del portal — el desplazamiento se hace únicamente con las
// flechas izquierda/derecha. Se deja el hook como no-op (en vez de borrar
// sus usos en cada carrusel) para no tocar el resto del código de
// Media.jsx/Events.jsx que sigue esperando estos props.
export function useDragScroll(_ref) {
  return {};
}
