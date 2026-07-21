// Tibox Connect v2 — Sidebar with updated iconography
function V2Sidebar({ active, onNav, onScroll, onSoporte, collapsed, onToggle }) {
  const sz = 16;
  const groups = [
    {
      label: 'Portal',
      items: [
        { id: 'dashboard', icon: 'house',       label: 'Inicio',     scrollTarget: 'hero' },
        { id: 'support',   icon: 'headphones',  label: 'Soporte',    isSupport: true },
      ]
    },
    {
      label: 'Recursos',
      items: [
        { id: 'videos',       icon: 'film',           label: 'Videos y Webinars',   scrollTarget: 'videos' },
        { id: 'infographics', icon: 'pie-chart',      label: 'Infografías',         scrollTarget: 'infographics' },
        { id: 'news',         icon: 'rss',            label: 'Noticias del Sector', scrollTarget: 'news' },
        { id: 'events',       icon: 'calendar-check', label: 'Eventos',             scrollTarget: 'events' },
      ]
    },
    {
      label: 'Servicios',
      items: [
        { id: 'infra',       icon: 'network',      label: 'Infraestructura TI',      scrollTarget: 'services' },
        { id: 'ciber',       icon: 'lock',         label: 'Ciberseguridad',          scrollTarget: 'services' },
        { id: 'cloud',       icon: 'cloud',        label: 'Soluciones Cloud',        scrollTarget: 'services' },
        { id: 'analitica',   icon: 'trending-up',  label: 'Analítica TI',            scrollTarget: 'services' },
        { id: 'consultoria', icon: 'layers',       label: 'Consultoría TI',          scrollTarget: 'services' },
        { id: 'smart',       icon: 'cpu',          label: 'Soluciones Inteligentes', scrollTarget: 'services' },
      ]
    },
    {
      label: 'Mi Cuenta',
      items: [
        { id: 'profile',  icon: 'circle-user',        label: 'Mi Perfil' },
        { id: 'settings', icon: 'sliders-horizontal', label: 'Configuración' },
      ]
    },
  ];

  return (
    <aside className="portal-sidebar" style={{
      width: collapsed ? 68 : 240,
      minWidth: collapsed ? 68 : 240,
      transition: 'width 250ms cubic-bezier(0.4,0,0.2,1), min-width 250ms cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden',
    }}>
      {/* Logo + toggle */}
      <div style={{ padding:'14px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:collapsed?'center':'space-between', gap:8 }}>
        {collapsed ? (
          <img src={window.__res("markCube","assets/mark-cube.png")} alt="TIBOX" style={{ width:28, height:28, objectFit:'contain' }} />
        ) : (
          <div style={{flex:1,display:'flex',alignItems:'center'}}>
            <img src={window.__res("logoTibox","assets/logo-tibox.png")} alt="TIBOX" style={{ height:22 }} />
          </div>
        )}
        <button key={String(collapsed)} onClick={onToggle} title={collapsed?'Expandir menú':'Colapsar menú'}
          style={{ background:'rgba(255,255,255,0.09)', border:'1px solid rgba(255,255,255,0.2)', cursor:'pointer', color:'rgba(255,255,255,0.75)', display:'flex', alignItems:'center', justifyContent:'center', width:30, height:30, borderRadius:8, flexShrink:0, transition:'all 150ms' }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,200,250,0.18)';e.currentTarget.style.color='var(--brand-cyan)';e.currentTarget.style.borderColor='rgba(0,200,250,0.35)';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.09)';e.currentTarget.style.color='rgba(255,255,255,0.75)';e.currentTarget.style.borderColor='rgba(255,255,255,0.2)';}}
        >
          <i data-lucide={collapsed?"chevron-right":"chevron-left"} style={{ width:15, height:15 }}></i>
        </button>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, paddingBottom: 12 }}>
        {groups.map(g => (
          <div key={g.label}>
            {!collapsed && <div className="nav-section-label">{g.label}</div>}
            {g.items.map(item => (
              <div
                key={item.id}
                className={`nav-item${!collapsed && item.sub ? ' sub' : ''}${active === item.id ? ' active' : ''}`}
                style={collapsed ? {padding:'10px 0',justifyContent:'center'} : {}}
                title={collapsed ? item.label : undefined}
                onClick={() => {
                onNav(item.id);
                if (item.isSupport) { onSoporte && onSoporte(); return; }
                if (item.scrollTarget) { onScroll && onScroll(item.scrollTarget); }
              }}
              >
                <i data-lucide={item.icon} style={{ width: sz, height: sz, flexShrink: 0 }}></i>
                {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* User */}
      <div style={{ padding: collapsed ? '12px 0' : '12px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : undefined, gap: 9 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: 'var(--grad-title)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: 'white',
        }}>CM</div>
        <div style={{ flex: 1, minWidth: 0, display: collapsed ? 'none' : undefined }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Carlos Mora</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Empresa Modelo S.A.</div>
        </div>
        <i data-lucide="log-out" style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.25)', cursor: 'pointer', flexShrink: 0, display: collapsed ? 'none' : undefined }}></i>
      </div>
      </aside>
  );
}
window.V2Sidebar = V2Sidebar;
