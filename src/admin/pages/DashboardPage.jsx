import { StatRow, ContentTable, MessagesTable } from '../AdminWidgets.jsx';

// Ruta /admin — antes la sección "dashboard" del admin (Fase 1).
export function DashboardPage() {
  return (
    <>
      <StatRow />
      <ContentTable section="recent" title="Publicaciones recientes" />
      <MessagesTable />
    </>
  );
}
