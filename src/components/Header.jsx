import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './shared/Icon.jsx';
import { CtaSecondary } from './shared/CtaStyles.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function initialsFor(profile) {
  const name = profile?.full_name?.trim();
  if (!name) return 'AD';
  const parts = name.split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map(p => p[0]).join('');
  return initials.toUpperCase() || 'AD';
}

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): se eliminó el
// Sidebar del portal público — el logo y la navegación por secciones
// (Inicio/Videos/Infografías/Noticias/Eventos) que antes vivían ahí se
// movieron acá. "Soporte" también se movió acá (antes un ítem del sidebar
// que abría el mismo modal, ver PortalLayout.jsx). "Mi Perfil" y
// "Configuración" NO se migraron: en el sidebar original no tenían ningún
// destino real (no navegaban a ninguna ruta ni sección, solo marcaban un
// estado "activo" decorativo) — eran enlaces sin función, así que se
// consideran eliminados a propósito en vez de recrear una navegación falsa.
//
// Ajuste posterior — reversión parcial (ver nota corta en
// FASE-06-07-08-CONTENIDO-REAL.md): hubo un intento breve de que estos
// ítems navegaran directo a las páginas dedicadas (/videoteca, etc.) — se
// revirtió a pedido de Braulio. Vuelven a hacer scroll suave a su sección
// dentro del inicio (`scrollTarget`, igual que antes), con un agregado: si
// el usuario NO está en el inicio, primero navega ahí y completa el scroll
// una vez que carga (ver handleNavClick más abajo y el efecto en
// PortalLayout.jsx que resuelve ese scroll pendiente).
const NAV_LINKS = [
  { label: 'Inicio', scrollTarget: 'hero' },
  { label: 'Videos y Webinars', scrollTarget: 'videos' },
  { label: 'Infografías', scrollTarget: 'infographics' },
  { label: 'Noticias', scrollTarget: 'news' },
  { label: 'Eventos', scrollTarget: 'events' },
];

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): cada scrollTarget
// del menú tiene una página propia de "ver todo" — se usa para decidir a
// dónde navega el menú cuando el usuario ya está fuera del inicio (ver
// handleNavClick). Rutas relativas (no absolutas ni con dominio) a
// propósito: el dominio actual (tibox-connect.vercel.app) es temporal, va a
// cambiar a uno propio de TIBOX más adelante — nada acá debe depender de
// cuál sea.
const CATEGORY_ROUTES = {
  videos: '/videoteca',
  infographics: '/infografias',
  news: '/tendencias',
  events: '/eventos',
};

// Tibox Connect v2 — Header (Crear Tickets = naranja; el botón azul
// "Contacta a tu KAM" se eliminó a pedido de negocio)
//
// Ajuste posterior — responsividad, Bloque 1 (ver
// FASE-06-07-08-CONTENIDO-REAL.md): el diseño original no tenía ningún
// punto de quiebre para el header — en celular, el menú de 6 ítems se
// habría comprimido ilegible o desbordado la pantalla. Se eligió el patrón
// estándar de "menú hamburguesa": bajo los 900px (`.header-nav-desktop` /
// `.header-secondary-desktop` / `.header-burger-btn` en index.css) el menú
// de navegación, el link ADM y el bloque de avatar/cerrar sesión se ocultan
// y se reemplazan por un botón de hamburguesa que despliega un panel
// vertical con todas esas opciones como filas grandes (fáciles de tocar con
// el pulgar). "Crear Tickets" se mantiene siempre visible en el header
// compacto — es el CTA de negocio más importante y hay espacio de sobra
// para él junto al logo y la hamburguesa incluso en un celular angosto
// (~375px). Se prefirió este patrón sobre "elementos que quepan + resto
// colapsado" porque con 6 ítems de navegación (uno bastante largo, "Videos
// y Webinars") casi ninguno cabría de forma legible en una fila de celular,
// así que ocultarlos todos detrás de un solo control conocido es más
// predecible para el usuario que una fila parcial más un "+2 más".
export function Header({ onContacto }) {
  const [showNotif, setShowNotif] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { isAdmin, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  // Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): en el inicio,
  // el menú sigue haciendo scroll con ancla dentro de la misma página (sin
  // cambios). Fuera del inicio — en una página de "ver todo" de una
  // categoría (/videoteca, /infografias, /tendencias, /eventos, o el
  // detalle de un video) — pedido de Braulio: ya no debe volver al inicio
  // con un ancla pendiente, sino ir directo a la página de esa categoría.
  // Si ya es la categoría en la que está, hace scroll al inicio de la
  // página en vez de un navigate() redundante.
  const handleNavClick = (target) => {
    setMobileOpen(false);
    if (location.pathname === '/') {
      window.scrollToSection && window.scrollToSection(target);
      return;
    }
    const categoryRoute = CATEGORY_ROUTES[target];
    if (!categoryRoute) {
      // "Inicio" (target === 'hero') u otro sin página propia: siempre al inicio.
      navigate('/', { state: { scrollTo: target } });
      return;
    }
    if (location.pathname === categoryRoute || location.pathname.startsWith(categoryRoute + '/')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    navigate(categoryRoute);
  };
  const handleContactoClick = () => {
    setMobileOpen(false);
    onContacto && onContacto();
  };
  const notifs = [
    { id: 1, text: 'Nuevo webinar: Ciberseguridad para PYMES 2025', time: 'hace 1 h', unread: true },
    { id: 2, text: 'Tu ticket #4821 fue actualizado por soporte', time: 'hace 4 h', unread: true },
    { id: 3, text: 'Infografía publicada: Redes SD-WAN explicadas', time: 'ayer', unread: false },
  ];
  const unread = notifs.filter(n => n.unread).length;

  // Si la ventana crece más allá del punto de quiebre mientras el menú
  // móvil está abierto (ej. al rotar un dispositivo o redimensionar en
  // devtools), lo cierra — evita que quede un panel "fantasma" abierto
  // sobre el header de escritorio.
  React.useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header className="portal-header">
      {/* Logo — antes vivía en el Sidebar del portal, ahora eliminado (ver
          FASE-06-07-08-CONTENIDO-REAL.md) */}
      <img src="/assets/logo-tibox.png" alt="TIBOX" style={{ height: 22, flexShrink: 0 }} />

      {/* Navegación por secciones — reemplaza los ítems del Sidebar
          eliminado. Mismo mecanismo de scroll (window.scrollToSection) que
          ya usan los bloques de categoría bajo el hero, con el agregado de
          cross-página (ver handleNavClick arriba). Oculta bajo los 900px
          (ver .header-nav-desktop en index.css) — reemplazada por el menú
          hamburguesa. */}
      <nav className="header-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 18 }}>
        {NAV_LINKS.map(link => (
          <button key={link.scrollTarget} onClick={() => handleNavClick(link.scrollTarget)} style={{
            background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            fontSize: 13, fontWeight: 'var(--fw-semibold)', color: 'white',
            padding: '7px 10px', borderRadius: 8, transition: 'background 150ms, opacity 150ms',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          >
            {link.label}
          </button>
        ))}
        {onContacto && (
          <button onClick={handleContactoClick} style={{
            background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            fontSize: 13, fontWeight: 'var(--fw-semibold)', color: 'white',
            padding: '7px 10px', borderRadius: 8, transition: 'background 150ms, opacity 150ms',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          >
            Contacto
          </button>
        )}
      </nav>

      <div style={{ flex: 1 }}></div>

      {/* ADM — acceso al panel de administración. Solo visible con sesión de
          administrador activa (Fase 5) y, en escritorio, como link directo;
          en celular se mueve al menú hamburguesa (ver más abajo). */}
      {isAdmin && (
        <div className="header-secondary-desktop" style={{ display: 'flex', alignItems: 'center' }}>
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
        </div>
      )}

      {/* Crear Tickets — siempre visible, incluso en celular (ver nota de
          diseño arriba). Nivel 2 del sistema de CTA del portal (ver
          CtaStyles.jsx): degradado azul→cian de "Infraestructura TI", para
          no competir visualmente con el Nivel 1 (naranja) del hero. */}
      <CtaSecondary href="https://soporte.tibox.cl/Login/LoginCliente" target="_blank" rel="noopener noreferrer">
        <Icon name="ticket" style={{ width: 15, height: 15 }} />
        Crear Tickets
      </CtaSecondary>

      <div className="header-secondary-desktop" style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.15)', margin: '0 6px' }}></div>

      {/* Icons — ocultos a pedido de Braulio (ver FASE-06-07-08-CONTENIDO-REAL.md);
          se deja el código intacto (solo display:'none') por si se reactivan más
          adelante, en vez de borrarlo. */}
      <div style={{ display: 'none', gap: 4, alignItems: 'center' }}>
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
          forma de volver a /admin o cerrar sesión sin salir del portal. En
          celular se mueve al menú hamburguesa. */}
      {isAdmin && (
        <div className="header-secondary-desktop" style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.15)', margin: '0 4px' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div title={profile?.full_name || 'Administrador'} style={{
              width: 34, height: 34, borderRadius: '50%', background: 'var(--grad-title)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'white', cursor: 'default',
              border: '2px solid rgba(255,255,255,0.25)', flexShrink: 0,
            }}>{initialsFor(profile)}</div>
            <button onClick={handleSignOut} title="Cerrar sesión" style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px',
              fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap',
              borderRadius: 8, transition: 'color 150ms, background 150ms',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FF8C3A'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'none'; }}
            >
              <Icon name="log-out" style={{ width: 14, height: 14 }} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}

      {/* Botón hamburguesa — oculto en escritorio, visible bajo los 900px
          (ver .header-burger-btn en index.css). */}
      <button
        className="header-burger-btn"
        onClick={() => setMobileOpen(o => !o)}
        aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={mobileOpen}
        style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: mobileOpen ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon name={mobileOpen ? 'x' : 'menu'} style={{ width: 20, height: 20 }} />
      </button>

      {/* Panel del menú móvil — todas las opciones de navegación como filas
          grandes (padding vertical generoso, ver .header-mobile-link en
          index.css) para que sean fáciles de tocar con el pulgar. */}
      {mobileOpen && (
        <React.Fragment>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, top: 62, zIndex: 55 }}></div>
          <div className="header-mobile-menu" style={{
            position: 'absolute', top: 62, left: 0, right: 0, zIndex: 60,
            background: 'var(--grad-corporate)', borderBottom: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 16px 32px rgba(0,0,0,0.3)',
            display: 'flex', flexDirection: 'column', padding: '8px 12px 16px',
          }}>
            {NAV_LINKS.map(link => (
              <button key={link.scrollTarget} onClick={() => handleNavClick(link.scrollTarget)} className="header-mobile-link">
                {link.label}
              </button>
            ))}
            {onContacto && (
              <button onClick={handleContactoClick} className="header-mobile-link">
                Contacto
              </button>
            )}
            {isAdmin && (
              <React.Fragment>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '8px 4px' }}></div>
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="header-mobile-link" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                  <Icon name="shield" style={{ width: 15, height: 15 }} /> Panel de administración
                </Link>
                <button onClick={() => { setMobileOpen(false); handleSignOut(); }} className="header-mobile-link" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="log-out" style={{ width: 15, height: 15 }} /> Cerrar sesión
                </button>
              </React.Fragment>
            )}
          </div>
        </React.Fragment>
      )}
    </header>
  );
}
