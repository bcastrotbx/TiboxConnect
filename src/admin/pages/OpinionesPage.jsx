import { OpinionsPanel } from '../AdminWidgets.jsx';

// Ruta /admin/mensajes/opiniones — antes la sección "feedback" del admin
// (Fase 1). Se agrupa bajo /admin/mensajes porque no tenía una ruta propia
// en la lista pedida para la Fase 2.
export function OpinionesPage() {
  return <OpinionsPanel />;
}
