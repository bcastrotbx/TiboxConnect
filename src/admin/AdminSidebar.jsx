import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../components/shared/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// Misma estructura visual y agrupación que en la Fase 1 (General/Contenidos/
// Negocio/Cuenta) — solo cambia que cada ítem ahora es una ruta real en vez
// de un setState local. Ver la tabla de mapeo completa en
// docs/phases/FASE-02-RUTAS-Y-DATOS.md. "Administradores" se agrega en la
// Fase 5 (invitar administradores adicionales, ver ADR-004).
//
// Ajuste posterior (ver FASE-09-NOTICIAS-DETALLE-Y-ADMIN.md):
// - "Servicios TIBOX" se quita del menú — ese bloque ya no existe en el
//   home público (ver #47, "Portal: ocultar bloque de Servicios"), así que
//   no tenía sentido dejar una sección de admin para algo invisible en el
//   sitio. La ruta /admin/contenidos/servicios y su CRUD siguen existiendo
//   sin cambios (datos reales conectados a Supabase, ver #71) — solo se
//   dejó de listar en el menú, por si se necesita reactivar el bloque
//   público más adelante sin perder el trabajo ya hecho.
// - "Configuración" (contenido de hero_slides/carrusel) se renombra a
//   "Portada" y se mueve de "Cuenta" a "Contenidos" — mismo nombre que ya
//   usa la ruta (/admin/portada) y el servicio (adminPortadaService.js),
//   así que no genera un nombre nuevo que aprender.
// - "Negocio" se renombra a "Mensajes" — el grupo ya solo contiene
//   secciones de mensajería (contacto + opiniones de clientes), el nombre
//   anterior no describía bien su contenido.
const NAV = [
  { label:'General', items:[
    { path:'/admin', icon:'layout-dashboard', label:'Dashboard' },
  ]},
  { label:'Contenidos', items:[
    { path:'/admin/contenidos', icon:'film', label:'Videos y Webinars' },
    { path:'/admin/contenidos/infografias', icon:'pie-chart', label:'Infografías' },
    { path:'/admin/contenidos/infografias/leads', icon:'download', label:'Leads de infografías' },
    { path:'/admin/contenidos/noticias', icon:'rss', label:'Noticias' },
    { path:'/admin/eventos', icon:'calendar-check', label:'Eventos' },
    { path:'/admin/portada', icon:'layout-template', label:'Portada' },
  ]},
  { label:'Mensajes', items:[
    { path:'/admin/mensajes', icon:'mail', label:'Mensajes de contacto' },
    { path:'/admin/mensajes/opiniones', icon:'star', label:'Opiniones de clientes' },
  ]},
  { label:'Cuenta', items:[
    { path:'/admin/usuarios', icon:'users', label:'Administradores' },
  ]},
];

function initialsFor(profile) {
  const name = profile?.full_name?.trim();
  if (!name) return 'AD';
  const parts = name.split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map(p => p[0]).join('');
  return initials.toUpperCase() || 'AD';
}

export function AdminSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <aside className="adm-sidebar">
      <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <img src="/assets/logo-tibox.png" alt="TIBOX" style={{ height:24 }} />
        <div style={{ marginTop:10, display:'inline-flex', alignItems:'center', gap:7, background:'rgba(0,200,250,0.08)', borderRadius:7, padding:'5px 10px', border:'1px solid rgba(0,200,250,0.18)' }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--brand-cyan)', boxShadow:'0 0 5px var(--brand-cyan)' }}></div>
          <span style={{ fontSize:11, fontWeight:700, color:'var(--brand-cyan)', letterSpacing:'0.1em' }}>ADMIN</span>
        </div>
      </div>
      <div style={{ flex:1, paddingBottom:12 }}>
        {NAV.map(g => (
          <div key={g.label}>
            <div className="adm-nav-label">{g.label}</div>
            {g.items.map(item => (
              <div key={item.path} className={`adm-nav-item${pathname === item.path ? ' active' : ''}`} onClick={() => navigate(item.path)}>
                <Icon name={item.icon} style={{ width:16, height:16, flexShrink:0 }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', gap:9 }}>
        <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, background:'var(--grad-title)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white' }}>{initialsFor(profile)}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'white', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{profile?.full_name || 'Administrador'}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>TIBOX Connect</div>
        </div>
        <a href="/" title="Volver al portal" style={{ color:'rgba(255,255,255,0.35)', display:'flex' }}>
          <Icon name="external-link" style={{ width:14, height:14 }} />
        </a>
        <button onClick={handleSignOut} title="Cerrar sesión" style={{ color:'rgba(255,255,255,0.35)', display:'flex', background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <Icon name="log-out" style={{ width:14, height:14 }} />
        </button>
      </div>
    </aside>
  );
}
