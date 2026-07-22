import React from 'react';
import { Icon } from '../components/shared/Icon.jsx';

const { Badge } = window.TIBOXDesignSystem_6dc0b3 || {};

const NAV = [
  { label:'General', items:[
    { id:'dashboard', icon:'layout-dashboard', label:'Dashboard' },
  ]},
  { label:'Contenidos', items:[
    { id:'videos', icon:'film', label:'Videos y Webinars' },
    { id:'infographics', icon:'pie-chart', label:'Infografías' },
    { id:'news', icon:'rss', label:'Noticias' },
    { id:'events', icon:'calendar-check', label:'Eventos' },
  ]},
  { label:'Negocio', items:[
    { id:'services', icon:'briefcase', label:'Servicios TIBOX' },
    { id:'messages', icon:'mail', label:'Mensajes de contacto' },
    { id:'feedback', icon:'star', label:'Opiniones de clientes' },
  ]},
  { label:'Cuenta', items:[
    { id:'settings', icon:'settings', label:'Configuración' },
  ]},
];

const CONTENT_ITEMS = {
  videos: [
    { title:'Copilot para equipos de TI: primeros pasos', cat:'Microsoft 365', status:'Publicado', date:'02 Jul 2026' },
    { title:'Ciberseguridad para PYMES: guía rápida', cat:'Ciberseguridad', status:'Publicado', date:'28 Jun 2026' },
    { title:'Automatización con IA en soporte técnico', cat:'Inteligencia Artificial', status:'Borrador', date:'19 Jun 2026' },
    { title:'Migración a la nube sin downtime', cat:'Cloud', status:'Publicado', date:'11 Jun 2026' },
  ],
  infographics: [
    { title:'6 señales de que necesitas un SOC gestionado', cat:'Ciberseguridad', status:'Publicado', date:'05 Jul 2026' },
    { title:'FinOps en 5 pasos: controla tu gasto cloud', cat:'Cloud', status:'Publicado', date:'30 Jun 2026' },
    { title:'Checklist de continuidad operacional 24/7', cat:'Infraestructura', status:'Programado', date:'20 Jul 2026' },
  ],
  news: [
    { title:'Nueva normativa de ciberseguridad para empresas en Chile', cat:'Regulación', status:'Publicado', date:'10 Jul 2026' },
    { title:'Tendencias IA generativa para 2027', cat:'Innovación', status:'Publicado', date:'01 Jul 2026' },
    { title:'TIBOX certifica su NOC bajo ISO 27001', cat:'Empresa', status:'Borrador', date:'27 Jun 2026' },
  ],
  events: [
    { title:'Webinar: Ciberseguridad para PYMES Chile 2026', cat:'Online', status:'Próximo', date:'19 Jul 2026' },
    { title:'Taller: Implementación SD-WAN en tu empresa', cat:'Presencial', status:'Próximo', date:'24 Jul 2026' },
    { title:'Cumbre TIBOX Cloud & IA 2026', cat:'Presencial', status:'Realizado', date:'28 May 2026' },
  ],
};

CONTENT_ITEMS.recent = [
  { title:'Nueva normativa de ciberseguridad para empresas en Chile', cat:'Noticias', status:'Publicado', date:'10 Jul 2026' },
  { title:'6 señales de que necesitas un SOC gestionado', cat:'Infografías', status:'Publicado', date:'05 Jul 2026' },
  { title:'Copilot para equipos de TI: primeros pasos', cat:'Videos y Webinars', status:'Publicado', date:'02 Jul 2026' },
  { title:'Webinar: Ciberseguridad para PYMES Chile 2026', cat:'Eventos', status:'Próximo', date:'19 Jul 2026' },
  { title:'Automatización con IA en soporte técnico', cat:'Videos y Webinars', status:'Borrador', date:'19 Jun 2026' },
];

const NOTIFICATIONS = [
  { icon:'mail', tone:'#0050C8', title:'Nuevo mensaje de contacto', desc:'Fernanda Rojas — Constructora Andes', time:'Hace 12 min', unread:true },
  { icon:'calendar-check', tone:'#FF6707', title:'Nueva inscripción a evento', desc:'Webinar: Ciberseguridad para PYMES', time:'Hace 1 h', unread:true },
  { icon:'star', tone:'#FFC600', title:'Nueva opinión de cliente', desc:'Rodrigo Salinas dejó una calificación 5★', time:'Hace 3 h', unread:true },
  { icon:'rss', tone:'#00C8FA', title:'Publicación programada', desc:'"Checklist de continuidad 24/7" se publicará el 20 Jul', time:'Ayer', unread:false },
  { icon:'shield-check', tone:'#16a34a', title:'Respaldo completado', desc:'Copia de seguridad del portal finalizada', time:'Ayer', unread:false },
];

const MESSAGES = [
  { name:'Fernanda Rojas', email:'fernanda.rojas@constructoraandes.cl', empresa:'Constructora Andes', servicio:'Ciberseguridad', fecha:'12 Jul 2026', estado:'Nuevo',
    mensaje:'Hola, estamos evaluando reforzar la seguridad de nuestra red corporativa tras un intento de phishing reciente. Nos interesa conocer sus planes de SOC gestionado y tiempos de respuesta ante incidentes.' },
  { name:'Marcelo Iturra', email:'m.iturra@logisticasur.cl', empresa:'Grupo Logístico Sur', servicio:'Infraestructura TI', fecha:'11 Jul 2026', estado:'Nuevo',
    mensaje:'Buenas tardes, necesitamos modernizar la conectividad entre 5 sucursales con una solución SD-WAN. ¿Podrían enviarnos una propuesta técnica y comercial?' },
  { name:'Camila Vidal', email:'camila.vidal@retailexpress.cl', empresa:'Retail Express', servicio:'Soluciones Cloud', fecha:'09 Jul 2026', estado:'Respondido',
    mensaje:'Queremos migrar nuestro ERP a la nube antes de fin de año. Nos gustaría agendar una reunión para revisar alternativas y costos estimados.' },
  { name:'Andrés Peña', email:'apena@clinicasanrafael.cl', empresa:'Clínica San Rafael', servicio:'Consultoría TI', fecha:'07 Jul 2026', estado:'Respondido',
    mensaje:'Solicitamos una auditoría de nuestra infraestructura actual para identificar riesgos de continuidad operacional en el área clínica.' },
  { name:'Josefina Muñoz', email:'jmunoz@agroindustrialmaule.cl', empresa:'Agroindustrial Maule', servicio:'Analítica TI', fecha:'03 Jul 2026', estado:'Cerrado',
    mensaje:'Nos gustaría implementar dashboards de producción en tiempo real. ¿Tienen experiencia en el rubro agroindustrial?' },
];

const OPINIONS = [
  { name:'Rodrigo Salinas', email:'rsalinas@vertice.cl', rating:5, fecha:'10 Jul 2026', mensaje:'Excelente atención del equipo de soporte, resolvieron nuestro incidente de red en menos de una hora. El portal Connect también nos ha facilitado mucho el seguimiento de tickets.' },
  { name:'Valentina Correa', email:'vcorrea@puertoblanco.cl', rating:4, fecha:'08 Jul 2026', mensaje:'Muy buena experiencia general con el equipo TIBOX. Sería ideal tener más webinars grabados disponibles para revisar con el equipo interno.' },
  { name:'Ignacio Bravo', email:'ibravo@textilnorte.cl', rating:5, fecha:'05 Jul 2026', mensaje:'El taller de SD-WAN fue muy práctico y aplicable. Felicitaciones al equipo de eventos por la organización.' },
  { name:'Daniela Contreras', email:'dcontreras@saludintegra.cl', rating:3, fecha:'01 Jul 2026', mensaje:'El servicio es bueno, pero nos gustaría mayor rapidez en las respuestas del formulario de contacto general.' },
];

function statusTone(s) {
  if (s === 'Publicado' || s === 'Respondido' || s === 'Realizado') return 'success';
  if (s === 'Borrador' || s === 'Nuevo') return 'cyan';
  if (s === 'Próximo' || s === 'Programado') return 'warning';
  return 'gray';
}

function AdminSidebar({ active, onNav }) {
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
              <div key={item.id} className={`adm-nav-item${active === item.id ? ' active' : ''}`} onClick={() => onNav(item.id)}>
                <Icon name={item.icon} style={{ width:16, height:16, flexShrink:0 }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', gap:9 }}>
        <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, background:'var(--grad-title)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white' }}>AD</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'white', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Bienvenido (a) ADMIN</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>TIBOX Connect</div>
        </div>
        <a href="/" title="Volver al portal" style={{ color:'rgba(255,255,255,0.35)', display:'flex' }}>
          <Icon name="external-link" style={{ width:14, height:14 }} />
        </a>
      </div>
    </aside>
  );
}

function NotificationBell() {
  const [open, setOpen] = React.useState(false);
  const unread = NOTIFICATIONS.filter(n => n.unread).length;
  return (
    <div style={{ position:'relative' }}>
      <button onClick={() => setOpen(o => !o)} title="Notificaciones" style={{ position:'relative', width:38, height:38, borderRadius:10, border:'1px solid var(--gray-200)', background:open?'var(--gray-50)':'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gray-600)' }}>
        <Icon name="bell" style={{ width:17, height:17 }} />
        {unread > 0 && <span style={{ position:'absolute', top:6, right:6, minWidth:15, height:15, padding:'0 4px', borderRadius:999, background:'#FF6707', border:'2px solid white', color:'white', fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{unread}</span>}
      </button>
      {open && (
        <React.Fragment>
          <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, zIndex:400 }}></div>
          <div style={{ position:'absolute', top:46, right:0, width:340, background:'white', borderRadius:14, border:'1px solid var(--gray-200)', boxShadow:'0 14px 40px rgba(2,18,55,0.2)', zIndex:401, overflow:'hidden' }}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--gray-100)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:14, fontWeight:700, color:'var(--navy-900,#021233)' }}>Notificaciones</span>
              <span style={{ fontSize:11, fontWeight:700, color:'#0050C8' }}>{unread} sin leer</span>
            </div>
            <div style={{ maxHeight:360, overflowY:'auto' }}>
              {NOTIFICATIONS.map((n,i) => (
                <div key={i} style={{ display:'flex', gap:11, padding:'12px 16px', borderBottom:'1px solid var(--gray-100)', background: n.unread ? 'rgba(0,80,200,0.03)' : 'white', cursor:'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = n.unread ? 'rgba(0,80,200,0.03)' : 'white'}>
                  <div style={{ width:34, height:34, borderRadius:9, flexShrink:0, background:n.tone+'1a', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name={n.icon} style={{ width:16, height:16, color:n.tone }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:'var(--navy-900,#021233)' }}>{n.title}</div>
                    <div style={{ fontSize:12, color:'var(--gray-500)', margin:'1px 0 3px', lineHeight:1.4 }}>{n.desc}</div>
                    <div style={{ fontSize:10.5, color:'var(--gray-400)', fontWeight:600 }}>{n.time}</div>
                  </div>
                  {n.unread && <div style={{ width:7, height:7, borderRadius:'50%', background:'#0050C8', flexShrink:0, marginTop:5 }}></div>}
                </div>
              ))}
            </div>
            <div style={{ padding:'11px 16px', textAlign:'center' }}>
              <span style={{ fontSize:12.5, fontWeight:700, color:'#0050C8', cursor:'pointer' }}>Marcar todas como leídas</span>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function AdminHeader({ section, onNew, onProfile }) {
  const titles = { dashboard:'Dashboard', videos:'Videos y Webinars', infographics:'Infografías', news:'Noticias', events:'Eventos', services:'Servicios TIBOX', messages:'Mensajes de contacto', feedback:'Opiniones de clientes', settings:'Configuración', profile:'Mi Perfil' };
  const newable = ['videos','infographics','news','events'].includes(section);
  return (
    <header className="adm-header">
      <div>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gray-400)' }}>Panel de administración</div>
        <div style={{ fontSize:19, fontWeight:700, color:'var(--navy-900,#021233)' }}>{titles[section]}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ position:'relative' }}>
          <Icon name="search" style={{ width:15, height:15, position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--gray-400)' }} />
          <input placeholder="Buscar…" style={{ padding:'9px 14px 9px 34px', borderRadius:10, border:'1px solid var(--gray-200)', fontSize:13, width:220, fontFamily:'inherit' }} />
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
        <button onClick={onProfile} title="Mi Perfil" style={{
          display:'inline-flex', alignItems:'center', gap:7,
          fontSize:12, fontWeight:700, letterSpacing:'0.03em', color:'var(--navy-900,#021233)',
          background:'white', border:'1px solid var(--gray-200)', borderRadius:10,
          padding:'8px 12px', cursor:'pointer', whiteSpace:'nowrap',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.borderColor = '#0050C8'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--gray-200)'; }}
        >
          <div style={{ width:22, height:22, borderRadius:'50%', background:'var(--grad-title)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9.5, fontWeight:700, color:'white' }}>AD</div>
          Mi Perfil
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

function StatRow() {
  const stats = [
    { value:'12,480', label:'Visitas al portal (30d)', icon:'trending-up' },
    { value:'86', label:'Nuevas inscripciones a eventos', icon:'calendar-check' },
    { value:'23', label:'Mensajes de contacto pendientes', icon:'mail' },
    { value:'4.6 / 5', label:'Satisfacción promedio', icon:'star' },
  ];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:18 }}>
      {stats.map((s,i) => (
        <div key={i} className="adm-card" style={{ padding:'18px 20px', display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--gray-400)' }}>{s.label}</span>
            <div style={{ width:30, height:30, borderRadius:8, background:'rgba(0,80,200,0.08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name={s.icon} style={{ width:14, height:14, color:'#0050C8' }} />
            </div>
          </div>
          <div style={{ fontSize:26, fontWeight:700, color:'var(--navy-900,#021233)' }}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}

function RowMenu({ onAction }) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ top:0, left:0 });
  const btnRef = React.useRef(null);
  const toggle = () => {
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top:r.bottom + 6, left:r.right - 184 });
    setOpen(o => !o);
  };
  const items = [
    { id:'view', icon:'eye', label:'Ver publicación' },
    { id:'edit', icon:'pencil', label:'Editar' },
    { id:'duplicate', icon:'copy', label:'Duplicar' },
    { id:'delete', icon:'trash-2', label:'Eliminar', danger:true },
  ];
  return (
    <React.Fragment>
      <button ref={btnRef} onClick={toggle} title="Acciones" style={{ background:open?'var(--gray-100)':'none', border:'none', cursor:'pointer', padding:5, borderRadius:7, display:'inline-flex', color:'var(--gray-500)' }}>
        <Icon name="more-horizontal" style={{ width:16, height:16 }} />
      </button>
      {open && (
        <React.Fragment>
          <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, zIndex:400 }}></div>
          <div style={{ position:'fixed', top:pos.top, left:pos.left, width:184, background:'white', borderRadius:11, border:'1px solid var(--gray-200)', boxShadow:'0 10px 32px rgba(2,18,55,0.18)', zIndex:401, padding:6 }}>
            {items.map((it,ix) => (
              <React.Fragment key={it.id}>
                {it.danger && <div style={{ height:1, background:'var(--gray-100)', margin:'5px 4px' }}></div>}
                <button onClick={() => { setOpen(false); onAction(it.id); }} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 10px', border:'none', background:'none', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:600, textAlign:'left', color: it.danger ? '#c0392b' : 'var(--navy-900,#021233)', fontFamily:'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.background = it.danger ? 'rgba(192,57,43,0.06)' : 'var(--gray-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                  <Icon name={it.icon} style={{ width:14, height:14 }} />{it.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="adm-modal-overlay" style={{ zIndex:600 }} onClick={onCancel}>
      <div className="adm-modal" style={{ maxWidth:410 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding:'24px 24px 4px', display:'flex', gap:14 }}>
          <div style={{ width:42, height:42, borderRadius:11, background:'rgba(192,57,43,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Icon name="alert-triangle" style={{ width:20, height:20, color:'#c0392b' }} />
          </div>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'var(--navy-900,#021233)' }}>{title}</div>
            <p style={{ fontSize:13, color:'var(--gray-500)', lineHeight:1.55, margin:'6px 0 0' }}>{message}</p>
          </div>
        </div>
        <div style={{ padding:'18px 24px 20px', display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button className="adm-mini-btn" onClick={onCancel}>Cancelar</button>
          <button className="adm-mini-btn" onClick={onConfirm} style={{ background:'#c0392b', color:'white', borderColor:'#c0392b' }}><Icon name="trash-2" style={{ width:13, height:13 }} />{confirmLabel || 'Eliminar'}</button>
        </div>
      </div>
    </div>
  );
}

function ContentViewModal({ item, onClose }) {
  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div style={{ height:140, background:'linear-gradient(135deg,#021233 0%,#0050C8 100%)', borderRadius:'18px 18px 0 0', display:'flex', alignItems:'flex-end', padding:'20px 24px', position:'relative' }}>
          <button onClick={onClose} style={{ position:'absolute', top:14, right:14, background:'rgba(255,255,255,0.16)', border:'none', borderRadius:8, cursor:'pointer', color:'white', padding:6, display:'flex' }}>
            <Icon name="x" style={{ width:16, height:16 }} />
          </button>
          <span style={{ fontSize:10.5, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'white', background:'rgba(255,255,255,0.16)', padding:'4px 11px', borderRadius:999 }}>{item.cat}</span>
        </div>
        <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ fontSize:18, fontWeight:700, color:'var(--navy-900,#021233)', lineHeight:1.3 }}>{item.title}</div>
          <div style={{ display:'flex', gap:18, alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              {Badge ? <Badge tone={statusTone(item.status)}>{item.status}</Badge> : <span>{item.status}</span>}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12.5, color:'var(--gray-500)' }}>
              <Icon name="calendar" style={{ width:14, height:14 }} />{item.date}
            </div>
          </div>
          <p style={{ fontSize:13.5, color:'var(--gray-500)', lineHeight:1.6, margin:0 }}>Vista previa de la publicación tal como aparece en el portal de clientes de TIBOX Connect.</p>
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--gray-200)', display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button className="adm-mini-btn" onClick={onClose}>Cerrar</button>
          <a href="/" target="_blank" className="adm-mini-btn primary"><Icon name="external-link" style={{ width:13, height:13 }} />Abrir en el portal</a>
        </div>
      </div>
    </div>
  );
}

function ContentTable({ section, title }) {
  const [rows, setRows] = React.useState(CONTENT_ITEMS[section] || []);
  const [viewing, setViewing] = React.useState(null);
  const [editing, setEditing] = React.useState(null);
  const [confirming, setConfirming] = React.useState(null);
  React.useEffect(() => { setRows(CONTENT_ITEMS[section] || []); }, [section]);
  const editSection = ['videos','infographics','news','events'].includes(section) ? section : 'news';
  const handle = (action, i) => {
    if (action === 'view') setViewing(rows[i]);
    else if (action === 'edit') setEditing(rows[i]);
    else if (action === 'duplicate') {
      const dup = { ...rows[i], title: rows[i].title + ' (copia)', status:'Borrador' };
      setRows([...rows.slice(0,i+1), dup, ...rows.slice(i+1)]);
    } else if (action === 'delete') setConfirming(i);
  };
  return (
    <div className="adm-card">
      <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>{title || 'Contenido publicado'}</div>
        <span style={{ fontSize:12, color:'var(--gray-400)' }}>{rows.length} elementos</span>
      </div>
      <table className="adm-table">
        <thead><tr><th>Título</th><th>Categoría</th><th>Estado</th><th>Fecha</th><th></th></tr></thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i}>
              <td style={{ fontWeight:600 }}>{r.title}</td>
              <td style={{ color:'var(--gray-500)' }}>{r.cat}</td>
              <td>{Badge ? <Badge tone={statusTone(r.status)}>{r.status}</Badge> :
                <span style={{ fontSize:11, fontWeight:700, borderRadius:999, padding:'3px 10px', background:'var(--gray-100)' }}>{r.status}</span>}</td>
              <td style={{ color:'var(--gray-500)' }}>{r.date}</td>
              <td style={{ textAlign:'right' }}>
                <RowMenu onAction={a => handle(a, i)} />
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan="5" style={{ textAlign:'center', color:'var(--gray-400)', padding:'24px' }}>No hay publicaciones.</td></tr>}
        </tbody>
      </table>
      {viewing && <ContentViewModal item={viewing} onClose={() => setViewing(null)} />}
      {editing && <NewContentModal section={editSection} item={editing} onClose={() => setEditing(null)} />}
      {confirming !== null && (
        <ConfirmDialog title="Eliminar publicación"
          message={`¿Seguro que deseas eliminar "${rows[confirming].title}"? Esta acción no se puede deshacer.`}
          onCancel={() => setConfirming(null)}
          onConfirm={() => { setRows(rows.filter((_,ix) => ix !== confirming)); setConfirming(null); }} />
      )}
    </div>
  );
}

function MessageViewModal({ msg, onClose }) {
  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
          <div>
            <div style={{ fontSize:17, fontWeight:700, color:'var(--navy-900,#021233)' }}>{msg.name}</div>
            <div style={{ fontSize:12.5, color:'var(--gray-500)', marginTop:2 }}>{msg.email}</div>
          </div>
          <button onClick={onClose} style={{ background:'var(--gray-100)', border:'none', borderRadius:8, cursor:'pointer', color:'var(--gray-500)', padding:6, display:'flex', flexShrink:0 }}>
            <Icon name="x" style={{ width:16, height:16 }} />
          </button>
        </div>
        <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
            {[['Empresa', msg.empresa],['Servicio', msg.servicio],['Fecha', msg.fecha]].map(([lb,vl],i) => (
              <div key={i} style={{ background:'var(--gray-50)', border:'1px solid var(--gray-200)', borderRadius:10, padding:'9px 11px' }}>
                <div style={{ fontSize:9.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--gray-400)' }}>{lb}</div>
                <div style={{ fontSize:12.5, fontWeight:700, color:'var(--navy-900,#021233)' }}>{vl}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--gray-400)', marginBottom:6 }}>Mensaje</div>
            <p style={{ fontSize:13.5, color:'var(--navy-900,#021233)', lineHeight:1.6, margin:0 }}>{msg.mensaje}</p>
          </div>
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--gray-200)', display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button onClick={onClose} className="adm-mini-btn">Cerrar</button>
          <a href={`mailto:${msg.email}`} className="adm-mini-btn primary"><Icon name="reply" style={{width:13,height:13}} />Responder</a>
        </div>
      </div>
    </div>
  );
}

function MessagesTable() {
  const [rows, setRows] = React.useState(MESSAGES);
  const [viewing, setViewing] = React.useState(null);
  return (
    <div className="adm-card">
      <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Bandeja de mensajes</div>
        <span style={{ fontSize:12, color:'var(--gray-400)' }}>{rows.length} mensajes</span>
      </div>
      <table className="adm-table">
        <thead><tr><th>Contacto</th><th>Empresa</th><th>Servicio</th><th>Fecha</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          {rows.map((m,i) => (
            <tr key={i}>
              <td style={{ fontWeight:600 }}>{m.name}</td>
              <td style={{ color:'var(--gray-500)' }}>{m.empresa}</td>
              <td style={{ color:'var(--gray-500)' }}>{m.servicio}</td>
              <td style={{ color:'var(--gray-500)' }}>{m.fecha}</td>
              <td>{Badge ? <Badge tone={statusTone(m.estado)}>{m.estado}</Badge> :
                <span style={{ fontSize:11, fontWeight:700, borderRadius:999, padding:'3px 10px', background:'var(--gray-100)' }}>{m.estado}</span>}</td>
              <td style={{ textAlign:'right', whiteSpace:'nowrap' }}>
                <div style={{ display:'inline-flex', gap:6 }}>
                  <button className="adm-mini-btn" onClick={() => setViewing(m)}><Icon name="eye" style={{width:13,height:13}} />Ver mensaje</button>
                  <button className="adm-mini-btn danger" onClick={() => setRows(rows.filter((_,ix) => ix !== i))}><Icon name="trash-2" style={{width:13,height:13}} />Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan="6" style={{ textAlign:'center', color:'var(--gray-400)', padding:'24px' }}>No hay mensajes.</td></tr>}
        </tbody>
      </table>
      {viewing && <MessageViewModal msg={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}

function OpinionsPanel() {
  const [viewing, setViewing] = React.useState(null);
  return (
    <div className="adm-card">
      <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Opiniones recibidas</div>
        <span style={{ fontSize:12, color:'var(--gray-400)' }}>{OPINIONS.length} opiniones</span>
      </div>
      <table className="adm-table">
        <thead><tr><th>Nombre</th><th>Email</th><th>Calificación</th><th>Fecha</th><th></th></tr></thead>
        <tbody>
          {OPINIONS.map((o,i) => (
            <tr key={i}>
              <td style={{ fontWeight:600 }}>{o.name}</td>
              <td style={{ color:'var(--gray-500)' }}>{o.email}</td>
              <td>
                <div style={{ display:'flex', gap:1 }}>
                  {[1,2,3,4,5].map(n => <Icon key={n} name="star" style={{ width:13, height:13, color: n<=o.rating ? '#FFC600' : 'var(--gray-200)', fill: n<=o.rating ? '#FFC600' : 'none' }} />)}
                </div>
              </td>
              <td style={{ color:'var(--gray-500)' }}>{o.fecha}</td>
              <td style={{ textAlign:'right' }}>
                <button className="adm-mini-btn" onClick={() => setViewing(o)}><Icon name="eye" style={{width:13,height:13}} />Ver mensaje</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {viewing && (
        <div className="adm-modal-overlay" onClick={() => setViewing(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
              <div>
                <div style={{ fontSize:17, fontWeight:700, color:'var(--navy-900,#021233)' }}>{viewing.name}</div>
                <div style={{ fontSize:12.5, color:'var(--gray-500)', marginTop:2 }}>{viewing.email}</div>
                <div style={{ display:'flex', gap:1, marginTop:6 }}>
                  {[1,2,3,4,5].map(n => <Icon key={n} name="star" style={{ width:14, height:14, color: n<=viewing.rating ? '#FFC600' : 'var(--gray-200)', fill: n<=viewing.rating ? '#FFC600' : 'none' }} />)}
                </div>
              </div>
              <button onClick={() => setViewing(null)} style={{ background:'var(--gray-100)', border:'none', borderRadius:8, cursor:'pointer', color:'var(--gray-500)', padding:6, display:'flex', flexShrink:0 }}>
                <Icon name="x" style={{ width:16, height:16 }} />
              </button>
            </div>
            <div style={{ padding:'20px 24px' }}>
              <p style={{ fontSize:13.5, color:'var(--navy-900,#021233)', lineHeight:1.6, margin:0 }}>{viewing.mensaje}</p>
            </div>
            <div style={{ padding:'16px 24px', borderTop:'1px solid var(--gray-200)', display:'flex', justifyContent:'flex-end' }}>
              <button onClick={() => setViewing(null)} className="adm-mini-btn">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const DEFAULT_SERVICES = {
  'Infraestructura TI': { icon:'network', bullets:['Redes, servidores y respaldo gestionados 24/7', 'Monitoreo proactivo con NOC propio', 'SLA de disponibilidad garantizado'] },
  'Ciberseguridad': { icon:'lock', bullets:['SOC gestionado con detección y respuesta', 'Protección de endpoints y correo', 'Cumplimiento normativo y auditorías'] },
  'Soluciones Cloud': { icon:'cloud', bullets:['Migración a Azure / AWS sin downtime', 'Optimización de costos (FinOps)', 'Arquitecturas híbridas y multicloud'] },
  'Analítica TI': { icon:'trending-up', bullets:['Dashboards de operación en tiempo real', 'Modelos predictivos de demanda', 'Integración con tus fuentes de datos'] },
  'Consultoría TI': { icon:'layers', bullets:['Diagnóstico y roadmap tecnológico', 'Acompañamiento en transformación digital', 'Gestión de proyectos TI'] },
  'Soluciones Inteligentes': { icon:'cpu', bullets:['Automatización de procesos con IA', 'Chatbots y asistentes virtuales', 'Integración de modelos generativos'] },
};

const ICON_LIBRARY = ['network','lock','cloud','trending-up','layers','cpu','shield-check','server','database','wifi','globe','activity','film','rss','calendar-check','message-circle','star','briefcase','settings','users','headphones','zap'];

function IconPicker({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="adm-field">
      <label>Ícono</label>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:38, height:38, borderRadius:9, background:'rgba(0,80,200,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon name={value} style={{ width:18, height:18, color:'#0050C8' }} />
        </div>
        <label className="adm-mini-btn" style={{ margin:0 }}>
          <Icon name="upload-cloud" style={{width:13,height:13}} />Subir desde escritorio
          <input type="file" accept="image/*" style={{ display:'none' }} />
        </label>
        <button type="button" className="adm-mini-btn" onClick={() => setOpen(o => !o)}><Icon name="grid-3x3" style={{width:13,height:13}} />Elegir de biblioteca</button>
      </div>
      {open && (
        <div style={{ border:'1px solid var(--gray-200)', borderRadius:10, padding:10, marginTop:6 }}>
          <div className="adm-icon-lib">
            {ICON_LIBRARY.map(ic => (
              <button type="button" key={ic} className={`adm-icon-opt${value===ic ? ' active' : ''}`} onClick={() => { onChange(ic); setOpen(false); }} title={ic}>
                <Icon name={ic} style={{ width:16, height:16 }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceEditModal({ name, data, onSave, onClose }) {
  const [bullets, setBullets] = React.useState(data.bullets);
  const update = (i, v) => setBullets(bullets.map((b,ix) => ix===i ? v : b));
  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal wide" onClick={e => e.stopPropagation()}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:17, fontWeight:700, color:'var(--navy-900,#021233)' }}>Editar {name}</div>
          <button onClick={onClose} style={{ background:'var(--gray-100)', border:'none', borderRadius:8, cursor:'pointer', color:'var(--gray-500)', padding:6, display:'flex' }}>
            <Icon name="x" style={{ width:16, height:16 }} />
          </button>
        </div>
        <div style={{ padding:'22px 24px', display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--navy-900,#021233)', marginBottom:8 }}>Puntos destacados (popup del servicio)</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {bullets.map((b,i) => (
                <div key={i} style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <Icon name="check-circle-2" style={{ width:15, height:15, color:'#0050C8', flexShrink:0 }} />
                  <input style={{ flex:1, fontFamily:'inherit', fontSize:13.5, padding:'9px 11px', border:'1px solid var(--gray-200)', borderRadius:9 }} value={b} onChange={e => update(i, e.target.value)} />
                  <button className="adm-mini-btn danger" onClick={() => setBullets(bullets.filter((_,ix) => ix !== i))}><Icon name="trash-2" style={{width:13,height:13}} /></button>
                </div>
              ))}
            </div>
            <button className="adm-mini-btn" style={{ marginTop:10 }} onClick={() => setBullets([...bullets, ''])}><Icon name="plus" style={{width:13,height:13}} />Agregar punto</button>
          </div>
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--gray-200)', display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button onClick={onClose} className="adm-mini-btn">Cancelar</button>
          <button onClick={() => { onSave({ icon: data.icon, bullets: bullets.filter(b => b.trim()) }); onClose(); }} className="adm-mini-btn primary">Guardar cambios</button>
        </div>
      </div>
    </div>
  );
}

function ServicesGrid() {
  const [services, setServices] = React.useState(DEFAULT_SERVICES);
  const [editing, setEditing] = React.useState(null);
  return (
    <div className="adm-card" style={{ padding:20 }}>
      <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)', marginBottom:16 }}>Unidades de negocio</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
        {Object.entries(services).map(([name, data]) => (
          <div key={name} style={{ border:'1px solid var(--gray-200)', borderRadius:12, padding:'14px 16px', display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:'rgba(0,80,200,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon name={data.icon} style={{ width:17, height:17, color:'#0050C8' }} />
              </div>
              <div style={{ fontSize:13.5, fontWeight:700, color:'var(--navy-900,#021233)' }}>{name}</div>
            </div>
            <div style={{ fontSize:11.5, color:'var(--gray-400)' }}>{data.bullets.length} puntos destacados</div>
            <button className="adm-mini-btn" onClick={() => setEditing(name)}><Icon name="pencil" style={{width:13,height:13}} />Editar</button>
          </div>
        ))}
      </div>
      {editing && (
        <ServiceEditModal name={editing} data={services[editing]} onClose={() => setEditing(null)}
          onSave={(newData) => setServices({ ...services, [editing]: newData })} />
      )}
    </div>
  );
}

function Placeholder({ label }) {
  return (
    <div className="adm-card" style={{ padding:'60px 20px', textAlign:'center', color:'var(--gray-400)' }}>
      <Icon name="construction" style={{ width:28, height:28, marginBottom:10 }} />
      <div style={{ fontSize:14 }}>Sección "{label}" en construcción.</div>
    </div>
  );
}

const VIDEO_CATS = ['Microsoft 365', 'Ciberseguridad', 'Inteligencia Artificial', 'Cloud', 'Infraestructura', 'Analítica TI', 'Eventos'];

function Field({ label, children }) {
  return <div className="adm-field"><label>{label}</label>{children}</div>;
}

function NewContentModal({ section, item, onClose }) {
  const newTitles = { videos:'Nuevo video o webinar', infographics:'Nueva infografía', news:'Nueva noticia', events:'Nuevo evento' };
  const editTitles = { videos:'Editar video o webinar', infographics:'Editar infografía', news:'Editar noticia', events:'Editar evento' };
  const titles = item ? editTitles : newTitles;
  const t = item ? item.title : '';
  const c = item ? item.cat : '';

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:17, fontWeight:700, color:'var(--navy-900,#021233)' }}>{titles[section]}</div>
          <button onClick={onClose} style={{ background:'var(--gray-100)', border:'none', borderRadius:8, cursor:'pointer', color:'var(--gray-500)', padding:6, display:'flex' }}>
            <Icon name="x" style={{ width:16, height:16 }} />
          </button>
        </div>

        <div style={{ padding:'22px 24px', display:'flex', flexDirection:'column', gap:16 }}>
          {section === 'videos' && (
            <React.Fragment>
              <Field label="Link del video"><input type="url" placeholder="https://youtube.com/watch?v=…" /></Field>
              <Field label="Título"><input type="text" placeholder="Título del video o webinar" defaultValue={t} /></Field>
              <Field label="Descripción"><textarea placeholder="Breve descripción del contenido…"></textarea></Field>
              <Field label="Categoría">
                <select defaultValue={c}><option value="">Selecciona una categoría</option>{VIDEO_CATS.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>
              </Field>
              <Field label="Fecha"><input type="date" /></Field>
            </React.Fragment>
          )}

          {section === 'infographics' && (
            <React.Fragment>
              <Field label="Imagen">
                <div className="adm-upload">
                  <Icon name="upload-cloud" style={{ width:24, height:24, marginBottom:8 }} />
                  <div style={{ fontSize:13, fontWeight:600 }}>Arrastra una imagen o haz clic para subir</div>
                  <input type="file" accept="image/*" style={{ display:'none' }} />
                </div>
              </Field>
              <Field label="Título"><input type="text" placeholder="Título de la infografía" defaultValue={t} /></Field>
              <Field label="Categoría">
                <select defaultValue={c}><option value="">Selecciona una categoría</option>{VIDEO_CATS.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>
              </Field>
              <Field label="Link de la publicación"><input type="url" placeholder="https://…" /></Field>
            </React.Fragment>
          )}

          {section === 'news' && (
            <React.Fragment>
              <Field label="Título de la noticia"><input type="text" placeholder="Título de la noticia" defaultValue={t} /></Field>
              <Field label="Categoría">
                <select defaultValue={c}><option value="">Selecciona una categoría</option>{VIDEO_CATS.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>
              </Field>
              <Field label="Información"><textarea placeholder="Contenido de la noticia…" style={{ minHeight:130 }}></textarea></Field>
            </React.Fragment>
          )}

          {section === 'events' && (
            <React.Fragment>
              <Field label="Título del evento"><input type="text" placeholder="Título del evento" defaultValue={t} /></Field>
              <Field label="Modalidad">
                <select><option value="">Selecciona una modalidad</option><option>Presencial</option><option>Online</option><option>Híbrida</option></select>
              </Field>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <Field label="Fecha"><input type="date" /></Field>
                <Field label="Hora"><input type="time" /></Field>
              </div>
              <Field label="Breve reseña"><textarea placeholder="Descripción breve del evento…"></textarea></Field>
              <Field label="Logo del partner">
                <div className="adm-upload">
                  <Icon name="upload-cloud" style={{ width:24, height:24, marginBottom:8 }} />
                  <div style={{ fontSize:13, fontWeight:600 }}>Sube el logo del partner</div>
                  <input type="file" accept="image/*" style={{ display:'none' }} />
                </div>
              </Field>
            </React.Fragment>
          )}
        </div>

        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--gray-200)', display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button onClick={onClose} style={{ background:'white', border:'1px solid var(--gray-200)', borderRadius:10, padding:'10px 18px', fontSize:13, fontWeight:600, color:'var(--gray-600)', cursor:'pointer' }}>Cancelar</button>
          <button onClick={onClose} style={{ background:'#0050C8', color:'white', border:'none', borderRadius:10, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer' }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_SLIDES = [
  { id:1, title:'Continuidad operacional sin interrupciones', category:'Infraestructura TI', desc:'Redes, servidores y monitoreo 24/7 para que tu operación nunca se detenga.', cta:'Agenda una asesoría', bg:'hero-slider-1.jpg' },
  { id:2, title:'Ciberseguridad que protege tu negocio', category:'Ciberseguridad', desc:'SOC gestionado y respuesta ante incidentes para tu tranquilidad.', cta:'Conoce nuestros servicios', bg:'hero-slider-2.jpg' },
  { id:3, title:'Tecnología que impulsa tu crecimiento', category:'Soluciones Cloud', desc:'Migra a la nube sin downtime y con costos optimizados.', cta:'Solicita una cotización', bg:'hero-slider-3.jpg' },
  { id:4, title:'El universo TIBOX, en expansión constante', category:'Empresa', desc:'Un socio tecnológico que crece junto a tu organización.', cta:'Conversemos', bg:'hero-universe.jpg' },
];

const DEFAULT_CATS = [
  { id:1, icon:'film', title:'Explora', tag:'Videos y Webinars' },
  { id:2, icon:'rss', title:'Noticias', tag:'Sector Tecnológico' },
  { id:3, icon:'calendar-check', title:'Eventos', tag:'Agenda y Webinars' },
  { id:4, icon:'message-circle', title:'Tu Opinión', tag:'Comparte tu voz' },
];

const DEFAULT_FORM_FIELDS = [
  { name:'Nombre completo', helper:'Como aparece en tu correo corporativo' },
  { name:'Correo corporativo', helper:'Te responderemos en menos de 24 horas' },
  { name:'Empresa', helper:'Razón social de tu organización' },
  { name:'Teléfono', helper:'Opcional' },
  { name:'Servicio de interés', helper:'Selecciona el área que te interesa' },
  { name:'Mensaje', helper:'Cuéntanos brevemente tu proyecto' },
];

function SettingsSlidesPanel() {
  const [slides, setSlides] = React.useState(DEFAULT_SLIDES);
  const update = (id, key, val) => setSlides(slides.map(s => s.id === id ? { ...s, [key]: val } : s));
  const remove = (id) => setSlides(slides.filter(s => s.id !== id));
  const add = () => setSlides([...slides, { id:Date.now(), title:'', category:'', desc:'', cta:'', bg:'' }]);
  return (
    <div className="adm-card" style={{ padding:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Sliders principales del hero</div>
        <button className="adm-mini-btn primary" onClick={add}><Icon name="plus" style={{width:13,height:13}} />Agregar slider</button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {slides.map((s,i) => (
          <div key={s.id} style={{ border:'1px solid var(--gray-200)', borderRadius:12, padding:16, display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:12, fontWeight:700, color:'var(--gray-400)' }}>Slider {i+1}</span>
              <button className="adm-mini-btn danger" onClick={() => remove(s.id)}><Icon name="trash-2" style={{width:13,height:13}} />Quitar</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="Título"><input value={s.title} onChange={e => update(s.id,'title',e.target.value)} /></Field>
              <Field label="Categoría"><input value={s.category} onChange={e => update(s.id,'category',e.target.value)} /></Field>
            </div>
            <Field label="Texto descriptivo"><textarea style={{ minHeight:60 }} value={s.desc} onChange={e => update(s.id,'desc',e.target.value)}></textarea></Field>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="Texto del CTA"><input value={s.cta} onChange={e => update(s.id,'cta',e.target.value)} /></Field>
              <Field label="Imagen de fondo">
                <div className="adm-upload" style={{ padding:12 }}>
                  <Icon name="image" style={{ width:18, height:18, marginBottom:4 }} />
                  <div style={{ fontSize:12 }}>{s.bg || 'Subir imagen de fondo'}</div>
                </div>
              </Field>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:4 }}>
        <button className="adm-mini-btn primary"><Icon name="check" style={{width:13,height:13}} />Guardar cambios</button>
      </div>
    </div>
  );
}

function SettingsCatsPanel() {
  const [cats, setCats] = React.useState(DEFAULT_CATS);
  const update = (id, key, val) => setCats(cats.map(c => c.id === id ? { ...c, [key]: val } : c));
  return (
    <div className="adm-card" style={{ padding:20 }}>
      <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)', marginBottom:16 }}>Bloques de categorías (bajo el slider)</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {cats.map(c => (
          <div key={c.id} style={{ border:'1px solid var(--gray-200)', borderRadius:12, padding:16, display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:'rgba(0,80,200,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon name={c.icon} style={{ width:15, height:15, color:'#0050C8' }} />
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:'var(--gray-400)' }}>Bloque {c.id}</span>
            </div>
            <IconPicker value={c.icon} onChange={v => update(c.id,'icon',v)} />
            <Field label="Título"><input value={c.title} onChange={e => update(c.id,'title',e.target.value)} /></Field>
            <Field label="Tag"><input value={c.tag} onChange={e => update(c.id,'tag',e.target.value)} /></Field>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:16 }}>
        <button className="adm-mini-btn primary"><Icon name="check" style={{width:13,height:13}} />Guardar cambios</button>
      </div>
    </div>
  );
}

function SettingsContactPanel() {
  const [title, setTitle] = React.useState('¿Tienes algún proyecto en mente?');
  const [desc, setDesc] = React.useState('Cuéntanos sobre tu proyecto y un especialista de TIBOX te contactará dentro de 24 horas hábiles.');
  const [officeCl, setOfficeCl] = React.useState('Av. Pdte. Kennedy 5600, Oficina 1506, Vitacura, Santiago');
  const [officePe, setOfficePe] = React.useState('Grimaldo del Solar 162, URB LEURO INT. 407, Miraflores, Lima');
  const [ctaText, setCtaText] = React.useState('Enviar mensaje');
  const [fields, setFields] = React.useState(DEFAULT_FORM_FIELDS);
  const updateField = (i, key, val) => setFields(fields.map((f,ix) => ix===i ? { ...f, [key]: val } : f));
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div className="adm-card" style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Encabezado de la sección de contacto</div>
        <Field label="Título"><input value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="Descripción"><textarea value={desc} onChange={e => setDesc(e.target.value)}></textarea></Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <Field label="Datos de contacto — Chile"><textarea style={{ minHeight:60 }} value={officeCl} onChange={e => setOfficeCl(e.target.value)}></textarea></Field>
          <Field label="Datos de contacto — Perú"><textarea style={{ minHeight:60 }} value={officePe} onChange={e => setOfficePe(e.target.value)}></textarea></Field>
        </div>
      </div>
      <div className="adm-card" style={{ padding:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Campos del formulario</div>
          <button className="adm-mini-btn primary" onClick={() => setFields([...fields, { name:'', helper:'' }])}><Icon name="plus" style={{width:13,height:13}} />Agregar campo</button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {fields.map((f,i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:10, alignItems:'end' }}>
              <Field label="Nombre del campo"><input value={f.name} onChange={e => updateField(i,'name',e.target.value)} /></Field>
              <Field label="Texto de ayuda"><input value={f.helper} onChange={e => updateField(i,'helper',e.target.value)} /></Field>
              <button className="adm-mini-btn danger" onClick={() => setFields(fields.filter((_,ix) => ix !== i))}><Icon name="trash-2" style={{width:13,height:13}} /></button>
            </div>
          ))}
        </div>
        <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid var(--gray-200)' }}>
          <Field label="Texto del botón (CTA)"><input style={{ maxWidth:280 }} value={ctaText} onChange={e => setCtaText(e.target.value)} /></Field>
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <button className="adm-mini-btn primary"><Icon name="check" style={{width:13,height:13}} />Guardar cambios</button>
      </div>
    </div>
  );
}

function SettingsPanel() {
  const [tab, setTab] = React.useState('sliders');
  const tabs = [ { id:'sliders', label:'Sliders principales' }, { id:'cats', label:'Bloques de categorías' }, { id:'contact', label:'Contacto' } ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'flex', gap:4, borderBottom:'1px solid var(--gray-200)' }}>
        {tabs.map(t => <div key={t.id} className={`adm-tab${tab===t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</div>)}
      </div>
      {tab === 'sliders' && <SettingsSlidesPanel />}
      {tab === 'cats' && <SettingsCatsPanel />}
      {tab === 'contact' && <SettingsContactPanel />}
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{ width:42, height:24, borderRadius:999, border:'none', cursor:'pointer', padding:0, position:'relative', background: on ? '#0050C8' : 'var(--gray-300)', transition:'background 160ms', flexShrink:0 }}>
      <span style={{ position:'absolute', top:3, left: on ? 21 : 3, width:18, height:18, borderRadius:'50%', background:'white', transition:'left 160ms', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}></span>
    </button>
  );
}

function ProfileRow({ icon, title, desc, children }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 0', borderBottom:'1px solid var(--gray-100)' }}>
      <div style={{ width:38, height:38, borderRadius:10, background:'rgba(0,80,200,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon name={icon} style={{ width:17, height:17, color:'#0050C8' }} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13.5, fontWeight:700, color:'var(--navy-900,#021233)' }}>{title}</div>
        {desc && <div style={{ fontSize:12.5, color:'var(--gray-500)', marginTop:1 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function ProfileView() {
  const [twoFA, setTwoFA] = React.useState(true);
  const [prefs, setPrefs] = React.useState({ emailNotif:true, weekly:false, darkAdmin:false, sound:true });
  const [saved, setSaved] = React.useState(false);
  const [pwd, setPwd] = React.useState(false);
  const togglePref = k => setPrefs(p => ({ ...p, [k]: !p[k] }));
  const cardHead = (t) => <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)', marginBottom:6 }}>{t}</div>;
  return (
    <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:20, alignItems:'start' }}>
      <div className="adm-card" style={{ padding:24, display:'flex', flexDirection:'column', alignItems:'center', gap:4, textAlign:'center' }}>
        <div style={{ position:'relative' }}>
          <div style={{ width:104, height:104, borderRadius:'50%', background:'var(--grad-title)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, fontWeight:700, color:'white' }}>AD</div>
          <label style={{ position:'absolute', bottom:2, right:2, width:32, height:32, borderRadius:'50%', background:'white', border:'1px solid var(--gray-200)', boxShadow:'0 2px 8px rgba(0,0,0,0.12)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#0050C8' }} title="Cambiar foto">
            <Icon name="camera" style={{ width:15, height:15 }} />
            <input type="file" accept="image/*" style={{ display:'none' }} />
          </label>
        </div>
        <div style={{ fontSize:18, fontWeight:700, color:'var(--navy-900,#021233)', marginTop:12 }}>Alejandro Díaz</div>
        <div style={{ fontSize:13, color:'var(--gray-500)' }}>Administrador del portal</div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(0,200,250,0.08)', borderRadius:8, padding:'5px 11px', border:'1px solid rgba(0,200,250,0.2)', marginTop:10 }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--brand-cyan)' }}></div>
          <span style={{ fontSize:11, fontWeight:700, color:'#0079a3', letterSpacing:'0.08em' }}>ADMIN</span>
        </div>
        <label className="adm-mini-btn" style={{ marginTop:16 }}>
          <Icon name="upload-cloud" style={{ width:13, height:13 }} />Cambiar foto de perfil
          <input type="file" accept="image/*" style={{ display:'none' }} />
        </label>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        <div className="adm-card" style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
          {cardHead('Información personal')}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Field label="Nombre completo"><input defaultValue="Alejandro Díaz" /></Field>
            <Field label="Cargo"><input defaultValue="Administrador del portal" /></Field>
            <Field label="Correo electrónico"><input type="email" defaultValue="alejandro.diaz@tibox.cl" /></Field>
            <Field label="Teléfono"><input type="tel" defaultValue="+56 9 1234 5678" /></Field>
          </div>
        </div>

        <div className="adm-card" style={{ padding:'8px 24px 20px' }}>
          <div style={{ padding:'16px 0 0' }}>{cardHead('Seguridad')}</div>
          <ProfileRow icon="key" title="Contraseña" desc="Último cambio hace 3 meses">
            <button className="adm-mini-btn" onClick={() => setPwd(p => !p)}><Icon name="lock" style={{ width:13, height:13 }} />Cambiar contraseña</button>
          </ProfileRow>
          {pwd && (
            <div style={{ padding:'16px 0', borderBottom:'1px solid var(--gray-100)', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
              <Field label="Contraseña actual"><input type="password" placeholder="••••••••" /></Field>
              <Field label="Nueva contraseña"><input type="password" placeholder="••••••••" /></Field>
              <Field label="Confirmar"><input type="password" placeholder="••••••••" /></Field>
            </div>
          )}
          <ProfileRow icon="shield-check" title="Autenticación en dos pasos (2FA)" desc={twoFA ? 'Activada — código por aplicación autenticadora' : 'Desactivada — tu cuenta es más vulnerable'}>
            <Toggle on={twoFA} onChange={setTwoFA} />
          </ProfileRow>
        </div>

        <div className="adm-card" style={{ padding:'8px 24px 20px' }}>
          <div style={{ padding:'16px 0 0' }}>{cardHead('Preferencias de la cuenta')}</div>
          <ProfileRow icon="mail" title="Notificaciones por correo" desc="Recibe avisos de mensajes e inscripciones">
            <Toggle on={prefs.emailNotif} onChange={() => togglePref('emailNotif')} />
          </ProfileRow>
          <ProfileRow icon="calendar" title="Resumen semanal" desc="Reporte de actividad cada lunes">
            <Toggle on={prefs.weekly} onChange={() => togglePref('weekly')} />
          </ProfileRow>
          <ProfileRow icon="volume-2" title="Sonido de notificaciones" desc="Alerta sonora dentro del panel">
            <Toggle on={prefs.sound} onChange={() => togglePref('sound')} />
          </ProfileRow>
          <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 0 0' }}>
            <div style={{ width:38, height:38, borderRadius:10, background:'rgba(0,80,200,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Icon name="globe" style={{ width:17, height:17, color:'#0050C8' }} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13.5, fontWeight:700, color:'var(--navy-900,#021233)' }}>Idioma del panel</div>
            </div>
            <select defaultValue="es" style={{ fontFamily:'inherit', fontSize:13, padding:'8px 12px', border:'1px solid var(--gray-200)', borderRadius:9, color:'var(--navy-900,#021233)', background:'white' }}>
              <option value="es">Español</option><option value="en">English</option><option value="pt">Português</option>
            </select>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:14 }}>
          {saved && <span style={{ fontSize:13, fontWeight:700, color:'#16a34a', display:'inline-flex', alignItems:'center', gap:6 }}><Icon name="check-circle-2" style={{ width:15, height:15 }} />Cambios guardados</span>}
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2600); }} style={{ background:'linear-gradient(135deg, #0050C8 0%, #0080F0 100%)', color:'white', border:'none', borderRadius:11, padding:'11px 24px', fontSize:13.5, fontWeight:700, cursor:'pointer', boxShadow:'0 2px 10px rgba(0,80,200,0.28)' }}>Guardar cambios</button>
        </div>
      </div>
    </div>
  );
}

export function AdminApp() {
  const [section, setSection] = React.useState('dashboard');
  const [showNew, setShowNew] = React.useState(false);

  return (
    <React.Fragment>
      <AdminSidebar active={section} onNav={setSection} />
      <div className="adm-main">
        <AdminHeader section={section} onNew={() => setShowNew(true)} onProfile={() => setSection('profile')} />
        <div className="adm-content">
          <div className="adm-wrap">
            {section === 'dashboard' && (
              <React.Fragment>
                <StatRow />
                <ContentTable section="recent" title="Publicaciones recientes" />
                <MessagesTable />
              </React.Fragment>
            )}
            {['videos','infographics','news','events'].includes(section) && <ContentTable section={section} />}
            {section === 'services' && <ServicesGrid />}
            {section === 'messages' && <MessagesTable />}
            {section === 'feedback' && <OpinionsPanel />}
            {section === 'settings' && <SettingsPanel />}
            {section === 'profile' && <ProfileView />}
          </div>
        </div>
      </div>
      {showNew && <NewContentModal section={section} onClose={() => setShowNew(false)} />}
    </React.Fragment>
  );
}
