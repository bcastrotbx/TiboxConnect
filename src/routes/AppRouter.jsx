import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PortalLayout } from '../layouts/PortalLayout.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';
import { HomePage } from '../pages/HomePage.jsx';
import { VideotecaPage } from '../pages/VideotecaPage.jsx';
import { VideotecaDetailPage } from '../pages/VideotecaDetailPage.jsx';
// Alias: el panel admin ya tiene páginas propias con estos mismos nombres
// (admin/pages/InfografiasPage.jsx, admin/pages/EventosPage.jsx) — se
// renombran al importar para evitar el choque, sin tocar ninguna de las dos.
import { InfografiasPage as InfografiasPublicPage } from '../pages/InfografiasPage.jsx';
import { TendenciasPage } from '../pages/TendenciasPage.jsx';
import { EventosPage as EventosPublicPage } from '../pages/EventosPage.jsx';
import { NotFound } from '../pages/NotFound.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { UpdatePasswordPage } from '../pages/UpdatePasswordPage.jsx';
import { Unauthorized } from '../pages/Unauthorized.jsx';
import { AdminRoute } from './AdminRoute.jsx';
import { DashboardPage } from '../admin/pages/DashboardPage.jsx';
import { VideosPage } from '../admin/pages/VideosPage.jsx';
import { InfografiasPage } from '../admin/pages/InfografiasPage.jsx';
import { NoticiasPage } from '../admin/pages/NoticiasPage.jsx';
import { EventosPage } from '../admin/pages/EventosPage.jsx';
import { MensajesPage } from '../admin/pages/MensajesPage.jsx';
import { OpinionesPage } from '../admin/pages/OpinionesPage.jsx';
import { ServiciosPage } from '../admin/pages/ServiciosPage.jsx';
import { PerfilPage } from '../admin/pages/PerfilPage.jsx';
import { UsuariosPage } from '../admin/pages/UsuariosPage.jsx';
import { PortadaPage } from '../admin/PortadaWidgets.jsx';

// Rutas de la Fase 2, actualizadas en la Fase 5 con autenticación real (ver
// docs/decisions/ADR-004): /login, /actualizar-contrasena y
// /acceso-no-autorizado son públicas, pero no hay ningún flujo de registro
// público — solo sirven para el login/recuperación de cuentas de
// administrador ya creadas por invitación. /admin/* ahora exige sesión de
// administrador activa vía <AdminRoute/>.
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
      // Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): "Ver todos
      // los videos" pasó de abrir un popup a navegar acá — páginas propias
      // con URL, dentro del mismo PortalLayout (header siempre visible).
      { path: 'videoteca', element: <VideotecaPage /> },
      { path: 'videoteca/:slug', element: <VideotecaDetailPage /> },
      // Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): mismo
      // patrón que Videoteca, extendido a Infografías, Tendencias y
      // Eventos — páginas propias en vez de los popups "ver todos"
      // anteriores.
      { path: 'infografias', element: <InfografiasPublicPage /> },
      { path: 'tendencias', element: <TendenciasPage /> },
      { path: 'eventos', element: <EventosPublicPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/actualizar-contrasena', element: <UpdatePasswordPage /> },
  { path: '/acceso-no-autorizado', element: <Unauthorized /> },
  {
    path: '/admin',
    element: <AdminRoute><AdminLayout /></AdminRoute>,
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
      { path: 'usuarios', element: <UsuariosPage /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
