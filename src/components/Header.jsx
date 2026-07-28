import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from './shared/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function initialsFor(profile) {
  const name = profile?.full_name?.trim();
  if (!name) return 'AD';
  const parts = name.split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map(p => p[0]).join('');
  return initials.toUpperCase() || 'AD';
}

// Tibox Connect v2 — Header (Crear Tickets = naranja; el botón azul
// "Contacta a tu KAM" se eliminó a pedido de negocio)
export function Header() {
  const [showNotif, setShowNotif] = React.useState(false);
  const { isAdmin, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  const notifs = [
    { id: 1, text: 'Nuevo webinar: Ciberseguridad para PYMES 2025', time: 'hace 1 h', unread: true },
    { id: 2, text: 'Tu ticket #4821 fue actualizado por soporte', time: 'hace 4 h', unread: true },
    { id: 3, text: 'Infografía publicada: Redes SD-WAN explicadas', time: 'ayer', unread: false },
  ];
  const unread = notifs.filter(n => n.unread).length;

  return (
    <header className="portal-header">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
        <span style={{ fontSize: 13, color: 'var(--gray-400)', fontWeight: 500 }}>Portal</span>
        <Icon name="chevron-right" style={{ width: 13, height: 13, color: 'var(--gray-400)' }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-900)' }}>Tibox Connect</span>
      </div>

      <div style={{ flex: 1 }}></div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* ADM — acceso al panel de administración. Solo visible con sesión
            de administrador activa (Fase 5): el portal es 100% público, así
            que un visitante sin sesión no ve ningún control de cuenta ni
            atajo al panel (ver ADR-004). */}
        {isAdmin && (
          <Link to="/admin" title="Panel de administración" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 700, letterSpacing: '0.03em', color: 'var(--gray-600)',
            background: 'white', border: '1px solid var(--gray-200)', borderRadius: 10,
            padding: '8px 13px', cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none',
            transition: 'background 150ms, border-color 150ms, color 150ms',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.borderColor = 'var(--gray-300)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--gray-200)'; }}
          >
            <Icon name="shield" style={{ width: 14, height: 14 }} />
            ADM
          </Link>
        )}

        {/* Crear Tickets — NARANJA (antes "Mis Tickets", mismo estilo) */}
        <a href="https://soporte.tibox.cl/Login/LoginCliente" target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          fontSize: 13, fontWeight: 700, color: 'white',
          background: 'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',
          border: 'none', borderRadius: 10, padding: '8px 16px',
          cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none',
          boxShadow: '0 2px 10px rgba(255,103,7,0.28)',
          transition: 'transform 150ms, box-shadow 150ms',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,103,7,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(255,103,7,0.28)'; }}
        >
          <Icon name="ticket" style={{ width: 15, height: 15 }} />
          Crear Tickets
        </a>
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--gray-200)', margin: '0 6px' }}></div>

      {/* Icons */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {/* Bell */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowNotif(v => !v)} style={{
            width: 38, height: 38, borderRadius: 10, border: '1px solid var(--gray-200)',
            background: showNotif ? 'var(--gray-50)' : 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 150ms',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
            onMouseLeave={e => e.currentTarget.style.background = showNotif ? 'var(--gray-50)' : 'white'}
          >
            <Icon name="bell" style={{ width: 16, height: 16, color: 'var(--gray-600)' }} />
            {unread > 0 && <span style={{ position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: '50%', background: '#FF6707', border: '2px solid white' }}></span>}
          </button>

          {showNotif && (
            <div style={{
              position: 'absolute', top: 44, right: 0, width: 320,
              background: 'white', borderRadius: 14, border: '1px solid var(--gray-200)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 200, overflow: 'hidden',
            }}>
              <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-900)' }}>Notificaciones</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#0050C8', cursor: 'pointer' }}>Leer todas</span>
              </div>
              {notifs.map(n => (
                <div key={n.id} style={{
                  padding: '11px 16px', borderBottom: '1px solid var(--gray-100)',
                  display: 'flex', gap: 10, background: n.unread ? 'rgba(0,80,200,0.03)' : 'white',
                  cursor: 'pointer', transition: 'background 150ms',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = n.unread ? 'rgba(0,80,200,0.03)' : 'white'}
                >
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.unread ? '#FF6707' : 'transparent', marginTop: 5, flexShrink: 0 }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button style={{
          width: 38, height: 38, borderRadius: 10, border: '1px solid var(--gray-200)',
          background: 'white', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 150ms',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
          onMouseLeave={e => e.currentTarget.style.background = 'white'}
        >
          <Icon name="help-circle" style={{ width: 16, height: 16, color: 'var(--gray-600)' }} />
        </button>
      </div>

      {/* Perfil + Cerrar sesión — antes un usuario de ejemplo hardcodeado
          ("CM" = Carlos Mora, ver ADR-004); ahora refleja la sesión real de
          administrador y solo se muestra si existe una. Un admin puede
          navegar el portal público con su sesión activa y necesita una
          forma de volver a /admin o cerrar sesión sin salir del portal. */}
      {isAdmin && (
        <React.Fragment>
          <div style={{ width: 1, height: 24, background: 'var(--gray-200)', margin: '0 4px' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div title={profile?.full_name || 'Administrador'} style={{
              width: 34, height: 34, borderRadius: '50%', background: 'var(--grad-title)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'white', cursor: 'default',
              border: '2px solid var(--gray-200)', flexShrink: 0,
            }}>{initialsFor(profile)}</div>
            <button onClick={handleSignOut} title="Cerrar sesión" style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px',
              fontSize: 12.5, fontWeight: 600, color: 'var(--gray-500)', whiteSpace: 'nowrap',
              borderRadius: 8, transition: 'color 150ms, background 150ms',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FF6707'; e.currentTarget.style.background = 'var(--gray-50)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--gray-500)'; e.currentTarget.style.background = 'none'; }}
            >
              <Icon name="log-out" style={{ width: 14, height: 14 }} />
              Cerrar sesión
            </button>
          </div>
        </React.Fragment>
      )}
    </header>
  );
}
