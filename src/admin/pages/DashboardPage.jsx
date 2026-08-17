import { StatRow, RecentContentTabs, MessagesTable } from '../AdminWidgets.jsx';

// Ruta /admin — antes la sección "dashboard" del admin (Fase 1).
export function DashboardPage() {
  return (
    <>
      <StatRow />
      <RecentContentTabs />
      <MessagesTable />
    </>
  );
}
