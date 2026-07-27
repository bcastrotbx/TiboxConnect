import { Link } from 'react-router-dom';
import { Icon } from '../components/shared/Icon.jsx';
import { CosmicBg } from '../components/shared/CosmicBg.jsx';

// Página a la que AdminRoute redirige cuando alguien sin sesión de admin
// activa intenta entrar a /admin/*. Deliberadamente NO redirige a /login
// (pedido explícito de la Fase 5): un visitante normal que llegó por error
// a /admin no debe recibir un formulario de login como si el portal
// esperara que inicie sesión — el portal es 100% público (ver ADR-004). El
// enlace a /login queda como acción secundaria, para el caso legítimo de un
// administrador cuya sesión expiró.
export function Unauthorized() {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100vh', overflow: 'hidden',
      background: 'var(--grad-corporate)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <CosmicBg variant={0} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(2,16,46,0.82), rgba(5,24,72,0.55))', pointerEvents: 'none' }}></div>
      <div style={{ position: 'relative', textAlign: 'center', maxWidth: 420 }}>
        <img src="/assets/mark-cube.png" alt="TIBOX" style={{ width: 56, height: 56, objectFit: 'contain', marginBottom: 20 }} />
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,103,7,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Icon name="shield-alert" style={{ width: 30, height: 30, color: '#FF8C3A' }} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 8 }}>Acceso no autorizado</div>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 28px' }}>
          Esta sección es exclusiva para administradores de TIBOX Connect.
        </p>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10,
          background: 'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)', color: 'white', textDecoration: 'none',
          fontSize: 14, fontWeight: 700, boxShadow: '0 2px 14px rgba(255,103,7,0.35)',
        }}>
          <Icon name="arrow-left" style={{ width: 15, height: 15 }} />
          Volver al portal
        </Link>
        <div style={{ marginTop: 20 }}>
          <Link to="/login" style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.55)', textDecoration: 'underline' }}>
            ¿Eres administrador? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
