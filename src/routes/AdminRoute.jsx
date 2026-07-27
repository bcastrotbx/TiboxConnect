import { Navigate } from 'react-router-dom';
import { Icon } from '../components/shared/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// Envuelve el árbol /admin/* completo (ver AppRouter.jsx). Mientras se
// verifica la sesión, se muestra un loader de pantalla completa — nunca se
// deja pasar al panel "vacío" ni se renderiza <AdminLayout/> antes de saber
// si hay sesión válida (evitaría un parpadeo del panel para alguien sin
// acceso).
//
// Si la sesión no existe o no cumple los requisitos (rol admin, status
// activo), redirige a /acceso-no-autorizado — nunca a /login, para no darle
// a un visitante normal que llegó por error a /admin la impresión de que el
// portal público requiere iniciar sesión (ver ADR-004).
function FullScreenLoader() {
  return (
    <div style={{
      width: '100%', height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 12, background: 'var(--grad-corporate)',
    }}>
      <Icon name="loader-2" className="tbx-spin" style={{ width: 28, height: 28, color: 'white' }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Verificando sesión…</span>
    </div>
  );
}

export function AdminRoute({ children }) {
  const { loading, isAdmin } = useAuth();

  if (loading) return <FullScreenLoader />;
  if (!isAdmin) return <Navigate to="/acceso-no-autorizado" replace />;

  return children;
}
