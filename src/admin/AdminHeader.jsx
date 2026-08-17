import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/shared/Icon.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import * as adminService from '../services/adminService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Avatar } from './AdminWidgets.jsx';

const TITLES = {
  '/admin': 'Dashboard',
  '/admin/analitica': 'Analítica',
  '/admin/contenidos': 'Videos y Webinars',
  '/admin/contenidos/infografias': 'Infografías',
  '/admin/contenidos/noticias': 'Noticias',
  '/admin/contenidos/servicios': 'Servicios TIBOX',
  '/admin/eventos': 'Eventos',
  '/admin/mensajes': 'Mensajes de contacto',
  '/admin/mensajes/opiniones': 'Opiniones de clientes',
  '/admin/portada': 'Portada',
  '/admin/perfil': 'Mi Perfil',
  '/admin/usuarios': 'Administradores',
};

const NEWABLE_PATHS = ['/admin/contenidos', '/admin/contenidos/infografias', '/admin/contenidos/noticias', '/admin/eventos'];

// Ajuste posterior (auditoría del panel admin, luego reemplazado por datos
// reales): la campanita mostraba notificaciones de ejemplo
// (adminService.getNotifications(), datos de adminSeed.js) sin relación con
// nada real del portal. Ahora suma mensajes de contacto sin leer + opiniones
// recientes (ver adminService.getPendingNotifications) — misma fuente que
// ya usan MessagesTable/OpinionsPanel y las tarjetas del Dashboard, sin
// duplicar la lógica de conteo. No hay "marcar todas como leídas": un
// mensaje se marca leído al abrirlo (MessagesTable ya lo hace) y una opinión
// no tiene un estado propio que marcar (ver nota en adminService.js) — el
// desplegable ofrece ir directo a cada bandeja en su lugar.
function NotificationBell() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { data } = useAsyncData(() => adminService.getPendingNotifications(), []);
  const count = data?.count || 0;
  const messages = data?.messages || [];
  const opinions = data?.opinions || [];

  const goTo = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div style={{ position:'relative' }}>
      <button onClick={() => setOpen(o => !o)} title="Notificaciones" style={{ position:'relative', width:38, height:38, borderRadius:10, border:'1px solid var(--gray-200)', background:open?'var(--gray-50)':'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gray-600)' }}>
        <Icon name="bell" style={{ width:17, height:17 }} />
        {count > 0 && <span style={{ position:'absolute', top:6, right:6, minWidth:15, height:15, padding:'0 4px', borderRadius:999, background:'#FF6707', border:'2px solid white', color:'white', fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{count}</span>}
      </button>
      {open && (
        <React.Fragment>
          <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, zIndex:400 }}></div>
          <div style={{ position:'absolute', top:46, right:0, width:340, background:'white', borderRadius:14, border:'1px solid var(--gray-200)', boxShadow:'0 14px 40px rgba(2,18,55,0.2)', zIndex:401, overflow:'hidden' }}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--gray-100)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:14, fontWeight:700, color:'var(--navy-900,#021233)' }}>Notificaciones</span>
              <span style={{ fontSize:11, fontWeight:700, color:'#0050C8' }}>{count} pendientes</span>
            </div>
            <div style={{ maxHeight:360, overflowY:'auto' }}>
              {count === 0 && (
                <div style={{ padding:'24px 16px', textAlign:'center', fontSize:12.5, color:'var(--gray-400)' }}>No hay nada pendiente por ahora.</div>
              )}
              {messages.map((m) => (
                <div key={`msg-${m.id}`} onClick={() => goTo('/admin/mensajes')}
                  style={{ display:'flex', gap:11, padding:'12px 16px', borderBottom:'1px solid var(--gray-100)', cursor:'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                  <div style={{ width:34, height:34, borderRadius:9, flexShrink:0, background:'rgba(255,103,7,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name="mail" style={{ width:16, height:16, color:'#FF6707' }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:'var(--navy-900,#021233)' }}>{m.name}</div>
                    <div style={{ fontSize:12, color:'var(--gray-500)', margin:'1px 0 3px', lineHeight:1.4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.mensaje}</div>
                    <div style={{ fontSize:10.5, color:'var(--gray-400)', fontWeight:600 }}>{m.fecha}</div>
                  </div>
                </div>
              ))}
              {opinions.map((o) => (
                <div key={`op-${o.id}`} onClick={() => goTo('/admin/mensajes/opiniones')}
                  style={{ display:'flex', gap:11, padding:'12px 16px', borderBottom:'1px solid var(--gray-100)', cursor:'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                  <div style={{ width:34, height:34, borderRadius:9, flexShrink:0, background:'rgba(255,198,0,0.14)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name="star" style={{ width:16, height:16, color:'#FFC600' }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:'var(--navy-900,#021233)' }}>{o.name} — {o.rating}/5</div>
                    <div style={{ fontSize:12, color:'var(--gray-500)', margin:'1px 0 3px', lineHeight:1.4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.mensaje || 'Sin comentario.'}</div>
                    <div style={{ fontSize:10.5, color:'var(--gray-400)', fontWeight:600 }}>{o.fecha}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:'11px 16px', display:'flex', justifyContent:'space-between', gap:10 }}>
              <span onClick={() => goTo('/admin/mensajes')} style={{ fontSize:12, fontWeight:700, color:'#0050C8', cursor:'pointer' }}>Mensajes de contacto</span>
              <span onClick={() => goTo('/admin/mensajes/opiniones')} style={{ fontSize:12, fontWeight:700, color:'#0050C8', cursor:'pointer' }}>Opiniones de clientes</span>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export function AdminHeader({ pathname, onNew }) {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const newable = NEWABLE_PATHS.includes(pathname);
  // Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): el buscador era
  // decorativo (sin value/onChange). Se guarda en el query param `q` en vez
  // de un estado local/contexto — así cada página de listado (ContentTable,
  // MessagesTable, OpinionsPanel, InfographicLeadsPanel) puede leerlo con
  // useSearchParams sin que el header y la página necesiten compartir
  // estado directamente, y cambiar de sección limpia la búsqueda sola (la
  // URL destino no trae `q`).
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchParams(val ? { q: val } : {}, { replace: true });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="adm-header">
      <div>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gray-400)' }}>Panel de administración</div>
        <div style={{ fontSize:19, fontWeight:700, color:'var(--navy-900,#021233)' }}>{TITLES[pathname]}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ position:'relative' }}>
          <Icon name="search" style={{ width:15, height:15, position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--gray-400)' }} />
          <input placeholder="Buscar…" value={query} onChange={handleSearchChange} style={{ padding:'9px 14px 9px 34px', borderRadius:10, border:'1px solid var(--gray-200)', fontSize:13, width:220, fontFamily:'inherit' }} />
        </div>
        <a href="/" title="Ir al portal" style={{
          display:'inline-flex', alignItems:'center', gap:6,
          fontSize:12, fontWeight:700, letterSpacing:'0.03em', color:'white',
          background:'linear-gradient(135deg, #0050C8 0%, #0080F0 100%)', border:'none', borderRadius:10,
          padding:'9px 13px', cursor:'pointer', whiteSpace:'nowrap', textDecoration:'none',
          boxShadow:'0 2px 10px rgba(0,80,200,0.28)', transition:'transform 150ms, box-shadow 150ms',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,80,200,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,80,200,0.28)'; }}
        >
          <Icon name="external-link" style={{ width:14, height:14 }} />
          Ir al Portal
        </a>
        <button onClick={() => navigate('/admin/perfil')} title="Mi Perfil" style={{
          display:'inline-flex', alignItems:'center', gap:7,
          fontSize:12, fontWeight:700, letterSpacing:'0.03em', color:'var(--navy-900,#021233)',
          background:'white', border:'1px solid var(--gray-200)', borderRadius:10,
          padding:'8px 12px', cursor:'pointer', whiteSpace:'nowrap',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.borderColor = '#0050C8'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--gray-200)'; }}
        >
          <Avatar profile={profile} size={22} fontSize={9.5} />
          Mi Perfil
        </button>
        <button onClick={handleSignOut} title="Cerrar sesión" style={{
          display:'inline-flex', alignItems:'center', gap:7,
          fontSize:12, fontWeight:700, letterSpacing:'0.03em', color:'var(--gray-500)',
          background:'white', border:'1px solid var(--gray-200)', borderRadius:10,
          padding:'8px 12px', cursor:'pointer', whiteSpace:'nowrap',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#FF6707'; e.currentTarget.style.borderColor = '#FF6707'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--gray-500)'; e.currentTarget.style.borderColor = 'var(--gray-200)'; }}
        >
          <Icon name="log-out" style={{ width:14, height:14 }} />
          Cerrar sesión
        </button>
        <NotificationBell />
        {newable && (
          <button onClick={onNew} style={{
            display:'inline-flex', alignItems:'center', gap:7,
            background:'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)', color:'white',
            border:'none', borderRadius:10, padding:'9px 16px', fontWeight:700, fontSize:13, cursor:'pointer',
            boxShadow:'0 2px 10px rgba(255,103,7,0.28)', transition:'transform 150ms, box-shadow 150ms',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,103,7,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(255,103,7,0.28)'; }}
          >
            <Icon name="plus" style={{width:15,height:15}} />Nuevo
          </button>
        )}
      </div>
    </header>
  );
}
