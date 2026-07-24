import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../admin/AdminSidebar.jsx';
import { AdminHeader } from '../admin/AdminHeader.jsx';
import { NewContentModal } from '../admin/AdminWidgets.jsx';
import { DesignSystemProvider } from '../context/DesignSystemContext.jsx';
import '../admin/admin.css';

const SECTION_BY_PATH = {
  '/admin/contenidos': 'videos',
  '/admin/contenidos/infografias': 'infographics',
  '/admin/contenidos/noticias': 'news',
  '/admin/eventos': 'events',
};

// Chrome del admin (sidebar + header + wrapper de contenido), antes fijo
// dentro de src/admin/AdminApp.jsx montado en su propio entry de Vite. Las
// páginas de cada sección se renderizan vía <Outlet/>. Envuelve todo en
// DesignSystemProvider para que _ds_bundle.js (Badge) se cargue solo cuando
// se visita /admin/* (ver src/context/DesignSystemContext.jsx).
export function AdminLayout() {
  const { pathname } = useLocation();
  const [showNew, setShowNew] = React.useState(false);
  const newSection = SECTION_BY_PATH[pathname];

  return (
    <DesignSystemProvider>
      <AdminSidebar />
      <div className="adm-main">
        <AdminHeader pathname={pathname} onNew={() => setShowNew(true)} />
        <div className="adm-content">
          <div className="adm-wrap">
            <Outlet />
          </div>
        </div>
      </div>
      {showNew && newSection && <NewContentModal section={newSection} onClose={() => setShowNew(false)} />}
    </DesignSystemProvider>
  );
}
