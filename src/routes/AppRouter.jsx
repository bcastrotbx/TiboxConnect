import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PortalLayout } from '../layouts/PortalLayout.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';
import { HomePage } from '../pages/HomePage.jsx';
import { NotFound } from '../pages/NotFound.jsx';
import { DashboardPage } from '../admin/pages/DashboardPage.jsx';
import { VideosPage } from '../admin/pages/VideosPage.jsx';
import { InfografiasPage } from '../admin/pages/InfografiasPage.jsx';
import { NoticiasPage } from '../admin/pages/NoticiasPage.jsx';
import { EventosPage } from '../admin/pages/EventosPage.jsx';
import { MensajesPage } from '../admin/pages/MensajesPage.jsx';
import { OpinionesPage } from '../admin/pages/OpinionesPage.jsx';
import { ServiciosPage } from '../admin/pages/ServiciosPage.jsx';
import { PerfilPage } from '../admin/pages/PerfilPage.jsx';
import { PortadaPage } from '../admin/PortadaWidgets.jsx';

// Rutas de la Fase 2. Deliberadamente NO incluye /login, /registro,
// /recuperar-contrasena, /actualizar-contrasena ni un /perfil público — el
// sistema de autenticación se rediseñó (ver docs/decisions/ADR-004): sin
// registro público, solo login de administradores en la Fase 5. Por ahora
// /admin/* no pide sesión todavía.
//
// Mapeo de las 10 secciones del admin de la Fase 1 a las rutas pedidas para
// esta fase (documentado en detalle en docs/phases/FASE-02-RUTAS-Y-DATOS.md):
//   dashboard    -> /admin
//   videos       -> /admin/contenidos (índice)
//   infographics -> /admin/contenidos/infografias
//   news         -> /admin/contenidos/noticias
//   services     -> /admin/contenidos/servicios
//   events       -> /admin/eventos
//   messages     -> /admin/mensajes (índice)
//   feedback     -> /admin/mensajes/opiniones
//   settings     -> /admin/portada
//   profile      -> /admin/perfil (ruta agregada; solo era alcanzable desde
//                    el botón "Mi Perfil" del header, nunca del sidebar)
const router = createBrowserRouter([
  {
    path: '/',
    element: <PortalLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: 'contenidos',
        children: [
          { index: true, element: <VideosPage /> },
          { path: 'infografias', element: <InfografiasPage /> },
          { path: 'noticias', element: <NoticiasPage /> },
          { path: 'servicios', element: <ServiciosPage /> },
        ],
      },
      { path: 'eventos', element: <EventosPage /> },
      { path: 'portada', element: <PortadaPage /> },
      {
        path: 'mensajes',
        children: [
          { index: true, element: <MensajesPage /> },
          { path: 'opiniones', element: <OpinionesPage /> },
        ],
      },
      { path: 'perfil', element: <PerfilPage /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
