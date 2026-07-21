// Tibox Connect v2 — Media sections: ExploraPanel (videos) + InfographicsPanel

/* ── Video category palette ─────────────────────── */
const VIDEO_CATS = [
  { id:'all',     label:'Todos',                   color:'var(--navy-900)' },
  { id:'copilot', label:'Microsoft Copilot',       color:'#6a3ed0' },
  { id:'ciber',   label:'Webinars Ciberseguridad', color:'#c0221a' },
  { id:'m365',    label:'Microsoft 365',           color:'#0050C8' },
  { id:'cloudia', label:'Cloud e IA',              color:'#0891b2' },
  { id:'eventos', label:'Eventos TIBOX',           color:'#FF6707' },
];
const VCAT = Object.fromEntries(VIDEO_CATS.map(c => [c.id, c]));

const videoItems = [
  {id:1, cat:'copilot', libCat:'ia',    thumb:window.__res('videoCopilot','assets/video-copilot.jpg'), title:'Microsoft Copilot: productividad con IA en tu día a día', dur:'24 min', date:'28 May 2026'},
  {id:2, cat:'ciber',   libCat:'ciber', thumb:window.__res('videoCiber','assets/video-ciber.jpg'),   title:'Webinar: cómo blindar tu empresa ante ransomware',        dur:'52 min', date:'15 May 2026'},
  {id:3, cat:'m365',    libCat:'cloud', thumb:window.__res('videoM365','assets/video-m365.jpg'),    title:'Microsoft 365: colaboración segura en Teams y SharePoint',dur:'31 min', date:'09 May 2026'},
  {id:4, cat:'cloudia', libCat:'cloud', thumb:window.__res('videoCloud','assets/video-cloud.jpg'),   title:'Cloud e IA: arquitecturas inteligentes en Azure',         dur:'41 min', date:'02 May 2026'},
  {id:5, cat:'eventos', libCat:'infra', thumb:window.__res('videoEvento','assets/video-evento.jpg'),  title:'TIBOX Summit 2026: los highlights del evento',            dur:'18 min', date:'24 Abr 2026'},
  {id:6, cat:'cloudia', libCat:'ia',    thumb:window.__res('videoIa','assets/video-ia.jpg'),      title:'IA generativa aplicada a procesos de negocio',            dur:'36 min', date:'18 Abr 2026'},
  {id:7, cat:'ciber',   libCat:'ciber', thumb:window.__res('videoWebinar','assets/video-webinar.jpg'), title:'Webinar: Zero Trust en la práctica',                      dur:'47 min', date:'11 Abr 2026'},
  {id:8, cat:'copilot', libCat:'ia',    thumb:window.__res('videoCopilot','assets/video-copilot.jpg'), title:'Copilot Studio: crea tu propio agente de IA',             dur:'22 min', date:'04 Abr 2026'},
  {id:9, cat:'m365',    libCat:'cloud', thumb:window.__res('videoM365','assets/video-m365.jpg'),    title:'Automatiza tareas con Power Automate y Microsoft 365',    dur:'29 min', date:'28 Mar 2026'},
  {id:10,cat:'eventos', libCat:'infra', thumb:window.__res('videoEvento','assets/video-evento.jpg'),  title:'TIBOX Talks: tendencias tecnológicas 2026',               dur:'33 min', date:'21 Mar 2026'},
];

const LIB_CATS = [
  { id:'all',   label:'Todos' },
  { id:'ia',    label:'IA' },
  { id:'ciber', label:'Ciberseguridad' },
  { id:'cloud', label:'Cloud' },
  { id:'infra', label:'Infraestructura' },
];

/* ── Video player modal (simulated) ─────────────── */
function VideoModal({ video, onClose }) {
  const Shell = window.ModalShell;
  const cat = VCAT[video.cat] || VIDEO_CATS[0];
  return (
    <Shell onClose={onClose} maxWidth={680}>
      <div style={{position:'relative',aspectRatio:'16/9',background:'#040b22',overflow:'hidden'}}>
        <img src={video.thumb} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(2,12,36,0.25),rgba(2,12,36,0.82))'}}></div>
        <button onClick={onClose} style={{position:'absolute',top:12,right:12,zIndex:3,width:34,height:34,borderRadius:'50%',background:'rgba(0,0,0,0.45)',border:'1px solid rgba(255,255,255,0.2)',color:'white',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <i data-lucide="x" style={{width:17,height:17}}></i>
        </button>
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{
            width:74,height:74,borderRadius:'50%',
            background:'linear-gradient(135deg,#FF6707,#FF8C3A)',
            display:'flex',alignItems:'center',justifyContent:'center',
            boxShadow:'0 0 0 10px rgba(255,103,7,0.18), 0 8px 28px rgba(255,103,7,0.45)',
            cursor:'pointer',
          }}>
            <i data-lucide="play" style={{width:30,height:30,color:'white',marginLeft:3}}></i>
          </div>
        </div>
        <div style={{position:'absolute',left:18,right:18,bottom:16,zIndex:2}}>
          <div style={{height:4,borderRadius:999,background:'rgba(255,255,255,0.25)',overflow:'hidden'}}>
            <div style={{width:'24%',height:'100%',background:'var(--brand-cyan)'}}></div>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:7,fontSize:11,color:'rgba(255,255,255,0.7)',fontVariantNumeric:'tabular-nums'}}>
            <span>06:32</span><span>{video.dur}</span>
          </div>
        </div>
        <span style={{position:'absolute',top:14,left:16,zIndex:2,fontSize:10.5,fontWeight:700,color:'white',background:cat.color,borderRadius:999,padding:'4px 11px',boxShadow:'0 2px 8px rgba(0,0,0,0.3)'}}>{cat.label}</span>
      </div>
      <div style={{padding:'18px 22px 20px'}}>
        <div style={{fontSize:16,fontWeight:700,color:'var(--navy-900)',lineHeight:1.3}}>{video.title}</div>
        <div style={{display:'flex',gap:14,marginTop:8,alignItems:'center'}}>
          <span style={{fontSize:12,color:'var(--gray-500)',display:'inline-flex',alignItems:'center',gap:5}}><i data-lucide="clock" style={{width:13,height:13}}></i>{video.dur}</span>
          <span style={{fontSize:12,color:'var(--gray-500)',display:'inline-flex',alignItems:'center',gap:5}}><i data-lucide="calendar" style={{width:13,height:13}}></i>{video.date}</span>
        </div>
        <div style={{fontSize:13,color:'var(--gray-500)',marginTop:10,lineHeight:1.55}}>
          Reproducción de demostración. En el portal real, este contenido se transmite desde la videoteca de TIBOX Connect con calidad adaptativa.
        </div>
      </div>
    </Shell>
  );
}

/* ── Poster video card (formato "imagen + título + etiqueta + meta") ── */
function VideoCard({ v, onOpen }) {
  const cat = VCAT[v.cat] || VIDEO_CATS[0];
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onClick={() => onOpen(v)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex:'0 0 calc((100% - 3 * 16px) / 4)', minWidth:0,
        background:'#021847', borderRadius:14, overflow:'hidden', cursor:'pointer',
        border:'1px solid rgba(255,255,255,0.1)',
        boxShadow: hov ? '0 10px 26px rgba(0,0,0,0.38)' : '0 2px 8px rgba(0,0,0,0.22)',
        transform: hov ? 'translateY(-4px)' : 'none',
        transition:'box-shadow 200ms, transform 200ms',
      }}
    >
      {/* Main image */}
      <div style={{position:'relative', aspectRatio:'16/10', overflow:'hidden', background:'#0b1a3a'}}>
        <img src={v.thumb} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transform:hov?'scale(1.05)':'none',transition:'transform 320ms'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(2,12,36,0) 40%,rgba(2,12,36,0.45))'}}></div>
        {/* Play */}
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{
            width:46,height:46,borderRadius:'50%',
            background: hov ? 'linear-gradient(135deg,#FF6707,#FF8C3A)' : 'rgba(2,12,36,0.55)',
            border:'1.5px solid rgba(255,255,255,0.6)',
            display:'flex',alignItems:'center',justifyContent:'center',
            boxShadow: hov ? '0 4px 16px rgba(255,103,7,0.5)' : 'none',
            transition:'background 200ms, box-shadow 200ms',
          }}>
            <i data-lucide="play" style={{width:20,height:20,color:'white',marginLeft:2}}></i>
          </div>
        </div>
        {/* Duration badge */}
        <span style={{position:'absolute',bottom:8,right:8,fontSize:10.5,fontWeight:700,color:'white',background:'rgba(2,12,36,0.7)',borderRadius:6,padding:'2px 7px',fontVariantNumeric:'tabular-nums'}}>{v.dur}</span>
      </div>
      {/* Body */}
      <div style={{padding:'11px 12px 13px',display:'flex',flexDirection:'column',gap:8}}>
        <div style={{fontSize:13,fontWeight:700,color:'white',lineHeight:1.32,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',minHeight:'2.6em'}}>{v.title}</div>
        <div>
          <span style={{display:'inline-block',fontSize:9.5,fontWeight:700,letterSpacing:'0.02em',color:cat.color,background:'white',borderRadius:999,padding:'2px 8px',boxShadow:'0 1px 3px rgba(0,0,0,0.12)'}}>{cat.label}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12,fontSize:11,color:'rgba(255,255,255,0.5)'}}>
          <span style={{display:'inline-flex',alignItems:'center',gap:4}}><i data-lucide="clock" style={{width:11,height:11}}></i>{v.dur}</span>
          <span style={{display:'inline-flex',alignItems:'center',gap:4}}><i data-lucide="calendar" style={{width:11,height:11}}></i>{v.date}</span>
        </div>
      </div>
    </div>
  );
}

function VideoLibraryCard({ v, onOpen }) {
  const cat = VCAT[v.cat] || VIDEO_CATS[0];
  const [hov, setHov] = React.useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      background:'#021847', borderRadius:14, overflow:'hidden',
      border:'1px solid rgba(255,255,255,0.1)',
      boxShadow: hov ? '0 10px 26px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.2)',
      transform: hov ? 'translateY(-3px)' : 'none', transition:'box-shadow 200ms, transform 200ms',
    }}>
      <div onClick={()=>onOpen(v)} style={{position:'relative', aspectRatio:'16/10', overflow:'hidden', background:'#0b1a3a', cursor:'pointer'}}>
        <img src={v.thumb} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transform:hov?'scale(1.05)':'none',transition:'transform 320ms'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(2,12,36,0) 40%,rgba(2,12,36,0.45))'}}></div>
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{width:44,height:44,borderRadius:'50%',background:hov?'linear-gradient(135deg,#FF6707,#FF8C3A)':'rgba(2,12,36,0.55)',border:'1.5px solid rgba(255,255,255,0.6)',display:'flex',alignItems:'center',justifyContent:'center',transition:'background 200ms'}}>
            <i data-lucide="play" style={{width:18,height:18,color:'white',marginLeft:2}}></i>
          </div>
        </div>
        <span style={{position:'absolute',bottom:8,right:8,fontSize:10.5,fontWeight:700,color:'white',background:'rgba(2,12,36,0.7)',borderRadius:6,padding:'2px 7px',fontVariantNumeric:'tabular-nums'}}>{v.dur}</span>
      </div>
      <div style={{padding:'11px 12px 13px',display:'flex',flexDirection:'column',gap:9}}>
        <div style={{fontSize:13,fontWeight:700,color:'white',lineHeight:1.32,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',minHeight:'2.6em'}}>{v.title}</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
          <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'0.02em',color:cat.color,background:'white',borderRadius:999,padding:'2px 8px',boxShadow:'0 1px 3px rgba(0,0,0,0.12)'}}>{cat.label}</span>
          <span style={{fontSize:11,color:'rgba(255,255,255,0.5)',display:'inline-flex',alignItems:'center',gap:4}}><i data-lucide="clock" style={{width:11,height:11}}></i>{v.dur}</span>
        </div>
        <button onClick={()=>onOpen(v)} style={{marginTop:2,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'8px',borderRadius:8,border:'1px solid rgba(255,255,255,0.18)',background:'rgba(255,255,255,0.06)',color:'white',fontSize:12,fontWeight:700,cursor:'pointer'}}>
          <i data-lucide="play" style={{width:13,height:13}}></i>Ver video
        </button>
      </div>
    </div>
  );
}

function VideoLibraryModal({ onClose }) {
  const Shell = window.ModalShell;
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [openVideo, setOpenVideo] = React.useState(null);
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [filter, q, openVideo]);

  const items = videoItems.filter(v =>
    (filter === 'all' || v.libCat === filter) &&
    v.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <Shell onClose={onClose} maxWidth="85vw">
      <div style={{position:'sticky',top:0,zIndex:2,background:'white',borderBottom:'1px solid var(--gray-200)',padding:'20px 26px 16px',borderRadius:'20px 20px 0 0'}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'#0050C8',marginBottom:4}}>Videoteca completa</div>
            <div style={{fontSize:19,fontWeight:700,color:'var(--navy-900)'}}>Todos los videos y webinars</div>
          </div>
          <button onClick={onClose} style={{background:'var(--gray-100)',border:'none',borderRadius:8,cursor:'pointer',color:'var(--gray-500)',padding:8,display:'flex',flexShrink:0}}>
            <i data-lucide="x" style={{width:18,height:18}}></i>
          </button>
        </div>
        <div style={{display:'flex',gap:12,marginTop:16,flexWrap:'wrap'}}>
          <div style={{position:'relative',flex:'1 1 260px',minWidth:220}}>
            <i data-lucide="search" style={{width:15,height:15,position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:'var(--gray-400)'}}></i>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por título…" style={{width:'100%',fontFamily:'inherit',fontSize:13.5,padding:'10px 14px 10px 36px',borderRadius:10,border:'1px solid var(--gray-200)'}} />
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {LIB_CATS.map(c => {
              const on = filter === c.id;
              return (
                <button key={c.id} onClick={()=>setFilter(c.id)} style={{
                  fontSize:12, fontWeight:700, cursor:'pointer', borderRadius:999, padding:'8px 15px',
                  border: on ? '1px solid #0050C8' : '1px solid var(--gray-200)',
                  background: on ? '#0050C8' : 'white', color: on ? 'white' : 'var(--gray-600)',
                  transition:'all 150ms', whiteSpace:'nowrap',
                }}>{c.label}</button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{padding:'22px 26px 8px'}}>
        {items.length === 0 ? (
          <div style={{textAlign:'center',color:'var(--gray-400)',padding:'40px 0',fontSize:13.5}}>No encontramos videos que coincidan con tu búsqueda.</div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))',gap:16}}>
            {items.map(v => <VideoLibraryCard key={v.id} v={v} onOpen={setOpenVideo} />)}
          </div>
        )}
      </div>

      <div style={{padding:'22px 26px 28px',display:'flex',justifyContent:'center'}}>
        {/* href pendiente: reemplazar por la URL del sitio institucional TIBOX cuando esté definida */}
        <a href="#" onClick={e=>e.preventDefault()} style={{
          display:'inline-flex',alignItems:'center',gap:9,
          background:'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',color:'white',
          border:'none',borderRadius:12,padding:'13px 26px',fontWeight:700,fontSize:14,cursor:'pointer',
          textDecoration:'none',boxShadow:'0 4px 16px rgba(255,103,7,0.32)',
        }}>
          Ver más contenido en TIBOX<i data-lucide="arrow-up-right" style={{width:16,height:16}}></i>
        </a>
      </div>

      {openVideo && <VideoModal video={openVideo} onClose={()=>setOpenVideo(null)} />}
    </Shell>
  );
}

function ExploraPanel() {
  const [openVideo, setOpenVideo] = React.useState(null);
  const [filter, setFilter] = React.useState('all');
  const [showLibrary, setShowLibrary] = React.useState(false);
  const trackRef = React.useRef(null);

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const items = filter === 'all' ? videoItems : videoItems.filter(v => v.cat === filter);
  const scroll = (dir) => {
    const el = trackRef.current; if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior:'smooth' });
  };

  return (
    <div className="section-card">
      {/* Header */}
      <div style={{padding:'20px 24px 0',display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16}}>
        <div>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'#0050C8',marginBottom:4}}>Videoteca</div>
          <div style={{fontSize:19,fontWeight:700,color:'var(--navy-900)'}}>Explora <span style={{background:'var(--grad-title)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>Videos y Webinars</span></div>
          <div style={{fontSize:13,color:'var(--gray-500)',marginTop:4,maxWidth:560,lineHeight:1.5}}>Webinars, cápsulas, charlas y registros de eventos, reunidos en un solo lugar.</div>
        </div>
        <div style={{display:'flex',gap:10,flexShrink:0,paddingTop:4,alignItems:'center'}}>
          <button onClick={()=>setShowLibrary(true)} style={{display:'inline-flex',alignItems:'center',gap:7,fontSize:12.5,fontWeight:700,cursor:'pointer',padding:'9px 15px',borderRadius:10,border:'1px solid var(--gray-200)',background:'white',color:'var(--gray-600)',whiteSpace:'nowrap'}}>
            <i data-lucide="layout-grid" style={{width:14,height:14}}></i>Ver todos los videos
          </button>
          <button onClick={()=>scroll(-1)} aria-label="Anterior" style={navBtnStyle}>
            <i data-lucide="chevron-left" style={{width:18,height:18}}></i>
          </button>
          <button onClick={()=>scroll(1)} aria-label="Siguiente" style={navBtnStyle}>
            <i data-lucide="chevron-right" style={{width:18,height:18}}></i>
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{padding:'16px 24px 4px',display:'flex',gap:8,flexWrap:'wrap'}}>
        {VIDEO_CATS.map(c => {
          const on = filter === c.id;
          return (
            <button key={c.id} onClick={()=>setFilter(c.id)} style={{
              fontSize:12, fontWeight:700, cursor:'pointer',
              borderRadius:999, padding:'6px 14px',
              border: on ? '1px solid '+c.color : '1px solid var(--gray-200)',
              background: on ? c.color : 'white',
              color: on ? 'white' : 'var(--gray-600)',
              transition:'all 150ms', whiteSpace:'nowrap',
            }}>{c.label}</button>
          );
        })}
      </div>

      {/* Carousel track — 5 visible, horizontal scroll */}
      <div ref={trackRef} style={{
        display:'flex', gap:16, padding:'16px 24px 24px',
        overflowX:'auto', scrollSnapType:'x mandatory',
        scrollbarWidth:'none',
      }} className="hide-scroll">
        {items.map(v => <VideoCard key={v.id} v={v} onOpen={setOpenVideo} />)}
      </div>

      {openVideo && <VideoModal video={openVideo} onClose={()=>setOpenVideo(null)} />}
      {showLibrary && <VideoLibraryModal onClose={()=>setShowLibrary(false)} />}
    </div>
  );
}
const navBtnStyle = {
  width:36, height:36, borderRadius:'50%',
  background:'white', border:'1px solid var(--gray-200)',
  color:'var(--navy-900)', cursor:'pointer',
  display:'flex', alignItems:'center', justifyContent:'center',
  boxShadow:'0 1px 3px rgba(0,0,0,0.06)', transition:'background 150ms',
};

/* ── Infografías ─────────────────────────────────── */
const INFO_CATS = [
  { id:'all',          label:'Todas' },
  { id:'seguridad',    label:'Seguridad' },
  { id:'phishing',     label:'Phishing' },
  { id:'respaldos',    label:'Respaldos' },
  { id:'productividad',label:'Productividad' },
];
const CHANNELS = {
  linkedin:  { label:'LinkedIn',  icon:'briefcase', color:'#0A66C2' },
  instagram: { label:'Instagram', icon:'camera',    color:'#C13584' },
  mailing:   { label:'Mailing',   icon:'mail',      color:'#0050C8' },
};

const infogs = [
  { id:1, img:window.__res('info2','assets/info-2.jpg'), cat:'seguridad',     channel:'instagram', title:'¿Tu plan de ciberseguridad se enfoca en prevención o en respuesta?',
    summary:'Hoy la pregunta no es si te atacarán, sino cuán rápido podrás responder. Un SOC reduce drásticamente el tiempo de detección y contención.' },
  { id:2, img:window.__res('info3','assets/info-3.jpg'), cat:'seguridad',     channel:'linkedin',  title:'Los ciberataques no se toman feriados',
    summary:'Los fines de semana largos concentran el mayor riesgo: si nadie está monitoreando, una brecha puede pasar inadvertida durante días.' },
  { id:3, img:window.__res('info4','assets/info-4.jpg'), cat:'phishing',      channel:'mailing',   title:'Reconoce un correo de phishing antes de hacer clic',
    summary:'Remitentes que imitan dominios, urgencia artificial y enlaces acortados. Cuatro señales para detectar el fraude a tiempo.' },
  { id:4, img:window.__res('info2','assets/info-2.jpg'), cat:'phishing',      channel:'linkedin',  title:'Phishing dirigido: la amenaza silenciosa al directorio',
    summary:'El spear phishing apunta a ejecutivos con mensajes hechos a medida. La capacitación y el MFA son tu mejor defensa.' },
  { id:5, img:window.__res('info4','assets/info-4.jpg'), cat:'respaldos',     channel:'mailing',   title:'Respaldos 3-2-1: tu última línea de defensa',
    summary:'Tres copias, en dos medios distintos, una fuera de sitio. La regla que mantiene tu negocio operativo tras un incidente.' },
  { id:6, img:window.__res('info3','assets/info-3.jpg'), cat:'respaldos',     channel:'linkedin',  title:'Recuperación ante desastres: ¿tu empresa está lista?',
    summary:'Un plan de DRP probado convierte una caída crítica en una interrupción controlada y medida en minutos, no en días.' },
  { id:7, img:window.__res('info1','assets/info-1.jpg'), cat:'productividad', channel:'linkedin',  title:'La transformación digital fracasa por falta de estrategia',
    summary:'En 2026 el éxito no dependerá de qué nube elijas, sino del partner que la implemente y la gestione contigo.' },
  { id:8, img:window.__res('info1','assets/info-1.jpg'), cat:'productividad', channel:'instagram', title:'Más productividad con IA, sin más complejidad',
    summary:'Copilot y la automatización liberan horas de trabajo repetitivo para que tu equipo se enfoque en lo que aporta valor.' },
];

function InfografiaModal({ info, onClose }) {
  const Shell = window.ModalShell;
  const ch = CHANNELS[info.channel];
  return (
    <Shell onClose={onClose} maxWidth={560}>
      <div style={{position:'relative',background:'#0b1a3a'}}>
        <img src={info.img} alt={info.title} style={{display:'block',width:'100%',maxHeight:'62vh',objectFit:'contain',background:'#0b1a3a'}} />
        <button onClick={onClose} style={{position:'absolute',top:12,right:12,background:'rgba(0,0,0,0.5)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:8,cursor:'pointer',color:'white',padding:6,display:'flex'}}>
          <i data-lucide="x" style={{width:16,height:16}}></i>
        </button>
        <span style={{position:'absolute',top:12,left:12,display:'inline-flex',alignItems:'center',gap:6,fontSize:11,fontWeight:700,color:'white',background:ch.color,borderRadius:999,padding:'4px 11px',boxShadow:'0 2px 8px rgba(0,0,0,0.3)'}}>
          <i data-lucide={ch.icon} style={{width:13,height:13}}></i>{ch.label}
        </span>
      </div>
      <div style={{padding:'20px 24px 24px'}}>
        <div style={{fontSize:16.5,fontWeight:700,color:'var(--navy-900)',lineHeight:1.32,marginBottom:9}}>{info.title}</div>
        <p style={{fontSize:13.5,color:'var(--gray-600)',lineHeight:1.65,margin:'0 0 18px'}}>{info.summary}</p>
        <div style={{display:'flex',gap:10}}>
          <button style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'11px',borderRadius:10,border:'none',cursor:'pointer',background:'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',color:'white',fontSize:13.5,fontWeight:700,boxShadow:'0 2px 12px rgba(255,103,7,0.35)'}}>
            <i data-lucide="download" style={{width:15,height:15}}></i>Descargar
          </button>
          <button style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:'11px 18px',borderRadius:10,border:'1px solid var(--gray-200)',cursor:'pointer',background:'white',color:'var(--gray-600)',fontSize:13.5,fontWeight:700}}>
            <i data-lucide="share-2" style={{width:15,height:15}}></i>Compartir
          </button>
        </div>
      </div>
    </Shell>
  );
}

function InfoCard({ inf, onOpen }) {
  const ch = CHANNELS[inf.channel];
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onClick={()=>onOpen(inf)}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        flex:'0 0 calc((100% - 36px) / 3)', minWidth:200, scrollSnapAlign:'start',
        background:'white', borderRadius:16, overflow:'hidden', cursor:'pointer',
        boxShadow: hov ? '0 14px 32px rgba(2,18,55,0.28)' : '0 4px 14px rgba(2,18,55,0.16)',
        transform: hov ? 'translateY(-5px)' : 'none',
        transition:'box-shadow 220ms, transform 220ms',
      }}
    >
        <div style={{position:'relative', aspectRatio:'1 / 1', overflow:'hidden', background:'#0b1a3a'}}>
        <img src={inf.img} alt={inf.title} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transform:hov?'scale(1.04)':'none',transition:'transform 340ms'}} />
      </div>
      <div style={{padding:'13px 15px 16px'}}>
        <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:9,flexWrap:'wrap'}}>
          <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:10.5,fontWeight:700,color:'white',background:ch.color,borderRadius:999,padding:'3px 10px'}}>
            <i data-lucide={ch.icon} style={{width:12,height:12}}></i>{ch.label}
          </span>
          <span style={{fontSize:9.5,fontWeight:700,color:'var(--gray-600)',background:'var(--gray-100)',border:'1px solid var(--gray-200)',borderRadius:999,padding:'3px 9px',textTransform:'capitalize'}}>{inf.cat}</span>
        </div>
        <div style={{fontSize:13.5,fontWeight:700,color:'var(--navy-900)',lineHeight:1.32,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',minHeight:'2.7em'}}>{inf.title}</div>
        <div style={{display:'flex',alignItems:'center',gap:6,marginTop:10,fontSize:11.5,fontWeight:700,color:'#0050C8'}}>
          Ver infografía <i data-lucide="arrow-right" style={{width:13,height:13}}></i>
        </div>
      </div>
    </div>
  );
}

function InfographicsPanel() {
  const [openInfo, setOpenInfo] = React.useState(null);
  const [filter, setFilter] = React.useState('all');
  const trackRef = React.useRef(null);

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const items = filter === 'all' ? infogs : infogs.filter(i => i.cat === filter);
  const scroll = (dir) => {
    const el = trackRef.current; if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior:'smooth' });
  };

  return (
    <div style={{
      borderRadius:18, overflow:'hidden', position:'relative',
      background:'var(--grad-corporate)',
      boxShadow:'0 4px 18px rgba(2,18,55,0.18)',
    }}>
      {window.CosmicBg2 && React.createElement(window.CosmicBg2, {variant:2})}
      <div style={{position:'absolute',inset:0,background:'linear-gradient(160deg,rgba(2,16,46,0.82),rgba(5,24,72,0.65))',pointerEvents:'none'}}></div>

      {/* Banner */}
      <div style={{position:'relative',padding:'26px 28px 0',display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:20}}>
        <div>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,marginBottom:12,background:'rgba(255,255,255,0.12)',borderRadius:999,padding:'4px 13px',border:'1px solid rgba(255,255,255,0.2)'}}>
            <i data-lucide="layout-grid" style={{width:13,height:13,color:'var(--brand-cyan)'}}></i>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'white'}}>Infografías</span>
          </div>
          <h2 style={{fontSize:'clamp(1.3rem,2vw,1.7rem)',fontWeight:700,color:'white',lineHeight:1.18,margin:'0 0 8px',letterSpacing:'-0.01em'}}>
            Información visual, <span style={{background:'var(--grad-title)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>simple y al alcance</span>
          </h2>
          <p style={{fontSize:13.5,color:'rgba(255,255,255,0.72)',lineHeight:1.55,maxWidth:540,margin:0}}>
            Las piezas que publicamos en LinkedIn, Instagram y nuestros mailings, listas para descargar y compartir en tu organización.
          </p>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{position:'relative',padding:'18px 28px 2px',display:'flex',gap:8,flexWrap:'wrap'}}>
        {INFO_CATS.map(c => {
          const on = filter === c.id;
          return (
            <button key={c.id} onClick={()=>setFilter(c.id)} style={{
              fontSize:12, fontWeight:700, cursor:'pointer',
              borderRadius:999, padding:'6px 15px',
              border: on ? '1px solid white' : '1px solid rgba(255,255,255,0.25)',
              background: on ? 'white' : 'rgba(255,255,255,0.08)',
              color: on ? 'var(--navy-900)' : 'rgba(255,255,255,0.8)',
              transition:'all 150ms', whiteSpace:'nowrap',
            }}>{c.label}</button>
          );
        })}
      </div>

      {/* Carousel con flechas laterales */}
      <div style={{display:'flex',alignItems:'center',padding:'18px 20px 28px',gap:10,position:'relative'}}>
        <button onClick={()=>scroll(-1)} aria-label="Anterior" style={navBtnGlassStyle}>
          <i data-lucide="chevron-left" style={{width:18,height:18}}></i>
        </button>
        <div ref={trackRef} style={{
          flex:1, display:'flex', gap:18,
          overflowX:'auto', scrollSnapType:'x mandatory', scrollbarWidth:'none',
        }} className="hide-scroll">
          {items.map(inf => <InfoCard key={inf.id} inf={inf} onOpen={setOpenInfo} />)}
        </div>
        <button onClick={()=>scroll(1)} aria-label="Siguiente" style={navBtnGlassStyle}>
          <i data-lucide="chevron-right" style={{width:18,height:18}}></i>
        </button>
      </div>

      {openInfo && <InfografiaModal info={openInfo} onClose={()=>setOpenInfo(null)} />}
    </div>
  );
}
const navBtnGlassStyle = {
  width:36, height:36, borderRadius:'50%',
  background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.25)',
  color:'white', cursor:'pointer',
  display:'flex', alignItems:'center', justifyContent:'center',
  transition:'background 150ms',
};

Object.assign(window, { ExploraPanel, InfographicsPanel, VideoModal, InfografiaModal, VideoLibraryModal });
