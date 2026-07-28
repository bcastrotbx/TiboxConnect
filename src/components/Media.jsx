import React from 'react';
import { Icon } from './shared/Icon.jsx';
import { ModalShell } from './shared/ModalShell.jsx';
import { CosmicBg } from './shared/CosmicBg.jsx';
import { LoadingState, EmptyState, ErrorState } from './shared/AsyncState.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import * as contentService from '../services/contentService.js';
import * as formService from '../services/formService.js';

/* ── Video player modal (simulated) ─────────────── */
function VideoModal({ video, catsById, onClose }) {
  const cat = catsById[video.cat] || { color:'var(--navy-900)', label:'' };
  return (
    <ModalShell onClose={onClose} maxWidth={680}>
      <div style={{position:'relative',aspectRatio:'16/9',background:'#040b22',overflow:'hidden'}}>
        <img src={video.thumb} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(2,12,36,0.25),rgba(2,12,36,0.82))'}}></div>
        <button onClick={onClose} style={{position:'absolute',top:12,right:12,zIndex:3,width:34,height:34,borderRadius:'50%',background:'rgba(0,0,0,0.45)',border:'1px solid rgba(255,255,255,0.2)',color:'white',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Icon name="x" style={{width:17,height:17}} />
        </button>
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{
            width:74,height:74,borderRadius:'50%',
            background:'linear-gradient(135deg,#FF6707,#FF8C3A)',
            display:'flex',alignItems:'center',justifyContent:'center',
            boxShadow:'0 0 0 10px rgba(255,103,7,0.18), 0 8px 28px rgba(255,103,7,0.45)',
            cursor:'pointer',
          }}>
            <Icon name="play" style={{width:30,height:30,color:'white',marginLeft:3}} />
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
          <span style={{fontSize:12,color:'var(--gray-500)',display:'inline-flex',alignItems:'center',gap:5}}><Icon name="clock" style={{width:13,height:13}} />{video.dur}</span>
          <span style={{fontSize:12,color:'var(--gray-500)',display:'inline-flex',alignItems:'center',gap:5}}><Icon name="calendar" style={{width:13,height:13}} />{video.date}</span>
        </div>
        <div style={{fontSize:13,color:'var(--gray-500)',marginTop:10,lineHeight:1.55}}>
          Reproducción de demostración. En el portal real, este contenido se transmite desde la videoteca de TIBOX Connect con calidad adaptativa.
        </div>
      </div>
    </ModalShell>
  );
}

/* ── Poster video card (formato "imagen + título + etiqueta + meta") ── */
function VideoCard({ v, catsById, onOpen }) {
  const cat = catsById[v.cat] || { color:'var(--navy-900)', label:'' };
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
            <Icon name="play" style={{width:20,height:20,color:'white',marginLeft:2}} />
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
          <span style={{display:'inline-flex',alignItems:'center',gap:4}}><Icon name="clock" style={{width:11,height:11}} />{v.dur}</span>
          <span style={{display:'inline-flex',alignItems:'center',gap:4}}><Icon name="calendar" style={{width:11,height:11}} />{v.date}</span>
        </div>
      </div>
    </div>
  );
}

function VideoLibraryCard({ v, catsById, onOpen }) {
  const cat = catsById[v.cat] || { color:'var(--navy-900)', label:'' };
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
            <Icon name="play" style={{width:18,height:18,color:'white',marginLeft:2}} />
          </div>
        </div>
        <span style={{position:'absolute',bottom:8,right:8,fontSize:10.5,fontWeight:700,color:'white',background:'rgba(2,12,36,0.7)',borderRadius:6,padding:'2px 7px',fontVariantNumeric:'tabular-nums'}}>{v.dur}</span>
      </div>
      <div style={{padding:'11px 12px 13px',display:'flex',flexDirection:'column',gap:9}}>
        <div style={{fontSize:13,fontWeight:700,color:'white',lineHeight:1.32,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',minHeight:'2.6em'}}>{v.title}</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
          <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'0.02em',color:cat.color,background:'white',borderRadius:999,padding:'2px 8px',boxShadow:'0 1px 3px rgba(0,0,0,0.12)'}}>{cat.label}</span>
          <span style={{fontSize:11,color:'rgba(255,255,255,0.5)',display:'inline-flex',alignItems:'center',gap:4}}><Icon name="clock" style={{width:11,height:11}} />{v.dur}</span>
        </div>
        <button onClick={()=>onOpen(v)} style={{marginTop:2,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'8px',borderRadius:8,border:'1px solid rgba(255,255,255,0.18)',background:'rgba(255,255,255,0.06)',color:'white',fontSize:12,fontWeight:700,cursor:'pointer'}}>
          <Icon name="play" style={{width:13,height:13}} />Ver video
        </button>
      </div>
    </div>
  );
}

// El buscador de texto filtra en el cliente sobre el set completo ya
// cargado (en vez de re-consultar el servicio en cada tecla) para no
// introducir el delay simulado del servicio en cada pulsación.
function VideoLibraryModal({ allVideos, catsById, onClose }) {
  const { status, data: libCats, error } = useAsyncData(() => contentService.getVideoLibraryCategories(), []);
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [openVideo, setOpenVideo] = React.useState(null);

  const items = allVideos.filter(v =>
    (filter === 'all' || v.libCat === filter) &&
    v.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <ModalShell onClose={onClose} maxWidth="85vw">
      <div style={{position:'sticky',top:0,zIndex:2,background:'white',borderBottom:'1px solid var(--gray-200)',padding:'20px 26px 16px',borderRadius:'20px 20px 0 0'}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'#0050C8',marginBottom:4}}>Videoteca completa</div>
            <div style={{fontSize:19,fontWeight:700,color:'var(--navy-900)'}}>Todos los videos y webinars</div>
          </div>
          <button onClick={onClose} style={{background:'var(--gray-100)',border:'none',borderRadius:8,cursor:'pointer',color:'var(--gray-500)',padding:8,display:'flex',flexShrink:0}}>
            <Icon name="x" style={{width:18,height:18}} />
          </button>
        </div>
        <div style={{display:'flex',gap:12,marginTop:16,flexWrap:'wrap'}}>
          <div style={{position:'relative',flex:'1 1 260px',minWidth:220}}>
            <Icon name="search" style={{width:15,height:15,position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:'var(--gray-400)'}} />
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por título…" style={{width:'100%',fontFamily:'inherit',fontSize:13.5,padding:'10px 14px 10px 36px',borderRadius:10,border:'1px solid var(--gray-200)'}} />
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {(libCats || []).map(c => {
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
        {status === 'loading' && <LoadingState label="Cargando categorías…" />}
        {status === 'error' && <ErrorState label="No pudimos cargar los filtros de la videoteca." error={error} />}
        {status === 'success' && (
          items.length === 0 ? (
            <div style={{textAlign:'center',color:'var(--gray-400)',padding:'40px 0',fontSize:13.5}}>No encontramos videos que coincidan con tu búsqueda.</div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))',gap:16}}>
              {items.map(v => <VideoLibraryCard key={v.id} v={v} catsById={catsById} onOpen={setOpenVideo} />)}
            </div>
          )
        )}
      </div>

      <div style={{padding:'22px 26px 28px',display:'flex',justifyContent:'center'}}>
        <a href="https://www.tibox.cl/eventos/" target="_blank" rel="noopener noreferrer" style={{
          display:'inline-flex',alignItems:'center',gap:9,
          background:'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',color:'white',
          border:'none',borderRadius:12,padding:'13px 26px',fontWeight:700,fontSize:14,cursor:'pointer',
          textDecoration:'none',boxShadow:'0 4px 16px rgba(255,103,7,0.32)',
        }}>
          Ver más contenido en TIBOX<Icon name="arrow-up-right" style={{width:16,height:16}} />
        </a>
      </div>

      {openVideo && <VideoModal video={openVideo} catsById={catsById} onClose={()=>setOpenVideo(null)} />}
    </ModalShell>
  );
}

export function ExploraPanel() {
  const { data: categories } = useAsyncData(() => contentService.getVideoCategories(), []);
  const [filter, setFilter] = React.useState('all');
  const { status, data: items, error } = useAsyncData(() => contentService.getVideos({ category: filter }), [filter]);
  const [openVideo, setOpenVideo] = React.useState(null);
  const [showLibrary, setShowLibrary] = React.useState(false);
  const trackRef = React.useRef(null);

  const cats = categories || [];
  const catsById = React.useMemo(() => Object.fromEntries((categories || []).map(c => [c.id, c])), [categories]);
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
            <Icon name="layout-grid" style={{width:14,height:14}} />Ver todos los videos
          </button>
          <button onClick={()=>scroll(-1)} aria-label="Anterior" style={navBtnStyle}>
            <Icon name="chevron-left" style={{width:18,height:18}} />
          </button>
          <button onClick={()=>scroll(1)} aria-label="Siguiente" style={navBtnStyle}>
            <Icon name="chevron-right" style={{width:18,height:18}} />
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{padding:'16px 24px 4px',display:'flex',gap:8,flexWrap:'wrap'}}>
        {cats.map(c => {
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
      {status === 'loading' && <LoadingState label="Cargando videos…" />}
      {status === 'error' && <ErrorState label="No pudimos cargar la videoteca." onRetry={() => setFilter(f => f)} error={error} />}
      {status === 'success' && (
        (items || []).length === 0 ? (
          <EmptyState label="No hay videos en esta categoría todavía." icon="film" />
        ) : (
          <div ref={trackRef} style={{
            display:'flex', gap:16, padding:'16px 24px 24px',
            overflowX:'auto', scrollSnapType:'x mandatory',
            scrollbarWidth:'none',
          }} className="hide-scroll">
            {items.map(v => <VideoCard key={v.id} v={v} catsById={catsById} onOpen={setOpenVideo} />)}
          </div>
        )
      )}

      {openVideo && <VideoModal video={openVideo} catsById={catsById} onClose={()=>setOpenVideo(null)} />}
      {showLibrary && <VideoLibraryModal allVideos={items || []} catsById={catsById} onClose={()=>setShowLibrary(false)} />}
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

// Recordatorio de "lead ya capturado" durante la visita actual, para no
// pedir el formulario en cada descarga. Se limpia solo al cerrar la pestaña
// (sessionStorage), no persiste entre visitas.
const INFOGRAFIA_LEAD_KEY = 'tibox_infografia_lead_ok';

// TODO(fase posterior): guardar el lead en un backend real y mostrarlo en el
// panel admin (sección de leads de infografías). Por ahora el envío solo se
// simula (formService.submitInfografiaLead) y no persiste fuera de
// sessionStorage.
function InfografiaLeadModal({ onSuccess, onClose }) {
  const [form, setForm] = React.useState({ name:'', empresa:'', cargo:'', email:'' });
  const [sending, setSending] = React.useState(false);
  const up = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const inputS = { width:'100%',padding:'9px 12px',border:'1.5px solid var(--gray-200)',borderRadius:8,fontSize:13,outline:'none',fontFamily:'inherit',transition:'border-color 150ms' };

  const submit = (e) => {
    e.preventDefault();
    setSending(true);
    formService.submitInfografiaLead(form).then(() => {
      sessionStorage.setItem(INFOGRAFIA_LEAD_KEY, 'true');
      onSuccess();
    });
  };

  return (
    <ModalShell onClose={onClose} maxWidth={440}>
      <div style={{padding:'24px 26px 4px'}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'#0050C8',marginBottom:6}}>Antes de descargar</div>
        <div style={{fontSize:18,fontWeight:700,color:'var(--navy-900)'}}>Cuéntanos un poco de ti</div>
        <div style={{fontSize:13,color:'var(--gray-500)',marginTop:6,lineHeight:1.5}}>Completa estos datos una vez por visita para descargar el material de TIBOX Connect.</div>
      </div>
      <form onSubmit={submit} style={{padding:'18px 26px 26px',display:'flex',flexDirection:'column',gap:14}}>
        <div>
          <label style={{fontSize:12,fontWeight:600,color:'var(--gray-600)',display:'block',marginBottom:5}}>Nombre</label>
          <input value={form.name} onChange={up('name')} required placeholder="Tu nombre completo" style={inputS}
            onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'} />
        </div>
        <div>
          <label style={{fontSize:12,fontWeight:600,color:'var(--gray-600)',display:'block',marginBottom:5}}>Empresa</label>
          <input value={form.empresa} onChange={up('empresa')} required placeholder="Empresa S.A." style={inputS}
            onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'} />
        </div>
        <div>
          <label style={{fontSize:12,fontWeight:600,color:'var(--gray-600)',display:'block',marginBottom:5}}>Cargo</label>
          <input value={form.cargo} onChange={up('cargo')} required placeholder="Tu cargo en la empresa" style={inputS}
            onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'} />
        </div>
        <div>
          <label style={{fontSize:12,fontWeight:600,color:'var(--gray-600)',display:'block',marginBottom:5}}>Correo corporativo</label>
          <input type="email" value={form.email} onChange={up('email')} required placeholder="tu@empresa.cl" style={inputS}
            onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'} />
        </div>
        <button type="submit" disabled={sending} style={{
          marginTop:4,padding:'12px',borderRadius:10,border:'none',cursor:sending?'default':'pointer',
          background: sending ? 'var(--gray-300)' : 'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',color:'white',
          fontSize:14,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:8,
          boxShadow: sending ? 'none' : '0 2px 14px rgba(255,103,7,0.4)',transition:'transform 150ms',
        }}
          onMouseEnter={e=>{ if(!sending) e.currentTarget.style.transform='translateY(-1px)'; }}
          onMouseLeave={e=>e.currentTarget.style.transform='none'}
        >
          {sending
            ? <React.Fragment><Icon name="loader-2" style={{width:16,height:16}} />Enviando…</React.Fragment>
            : <React.Fragment><Icon name="download" style={{width:16,height:16}} />Continuar a la descarga</React.Fragment>
          }
        </button>
      </form>
    </ModalShell>
  );
}

function InfografiaModal({ info, channelsById, onClose }) {
  const ch = channelsById[info.channel] || { color:'var(--navy-900)', label:'', icon:'link' };
  const [showLead, setShowLead] = React.useState(false);
  const [justDownloaded, setJustDownloaded] = React.useState(false);

  const startDownload = () => {
    // TODO(fase posterior): disparar la descarga real del asset de la
    // infografía. Por ahora solo se simula el estado visual.
    setJustDownloaded(true);
    setTimeout(() => setJustDownloaded(false), 2200);
  };

  const handleDownloadClick = () => {
    const leadOk = sessionStorage.getItem(INFOGRAFIA_LEAD_KEY) === 'true';
    if (leadOk) startDownload();
    else setShowLead(true);
  };

  return (
    <ModalShell onClose={onClose} maxWidth={560}>
      <div style={{position:'relative',background:'#0b1a3a'}}>
        <img src={info.img} alt={info.title} style={{display:'block',width:'100%',maxHeight:'62vh',objectFit:'contain',background:'#0b1a3a'}} />
        <button onClick={onClose} style={{position:'absolute',top:12,right:12,background:'rgba(0,0,0,0.5)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:8,cursor:'pointer',color:'white',padding:6,display:'flex'}}>
          <Icon name="x" style={{width:16,height:16}} />
        </button>
        <span style={{position:'absolute',top:12,left:12,display:'inline-flex',alignItems:'center',gap:6,fontSize:11,fontWeight:700,color:'white',background:ch.color,borderRadius:999,padding:'4px 11px',boxShadow:'0 2px 8px rgba(0,0,0,0.3)'}}>
          <Icon name={ch.icon} style={{width:13,height:13}} />{ch.label}
        </span>
      </div>
      <div style={{padding:'20px 24px 24px'}}>
        <div style={{fontSize:16.5,fontWeight:700,color:'var(--navy-900)',lineHeight:1.32,marginBottom:9}}>{info.title}</div>
        <p style={{fontSize:13.5,color:'var(--gray-600)',lineHeight:1.65,margin:'0 0 18px'}}>{info.summary}</p>
        <button onClick={handleDownloadClick} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'11px',borderRadius:10,border:'none',cursor:'pointer',background:'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',color:'white',fontSize:13.5,fontWeight:700,boxShadow:'0 2px 12px rgba(255,103,7,0.35)'}}>
          <Icon name={justDownloaded ? 'check' : 'download'} style={{width:15,height:15}} />{justDownloaded ? 'Descarga iniciada' : 'Descargar'}
        </button>
      </div>
      {showLead && (
        <InfografiaLeadModal
          onClose={()=>setShowLead(false)}
          onSuccess={() => { setShowLead(false); startDownload(); }}
        />
      )}
    </ModalShell>
  );
}

function InfoCard({ inf, channelsById, onOpen }) {
  const ch = channelsById[inf.channel] || { color:'var(--navy-900)', label:'', icon:'link' };
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onClick={()=>onOpen(inf)}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        flex:'0 0 calc((100% - 54px) / 4)', minWidth:180, scrollSnapAlign:'start',
        background:'white', borderRadius:16, overflow:'hidden', cursor:'pointer',
        boxShadow: hov ? '0 14px 32px rgba(2,18,55,0.28)' : '0 4px 14px rgba(2,18,55,0.16)',
        transform: hov ? 'translateY(-5px)' : 'none',
        transition:'box-shadow 220ms, transform 220ms',
      }}
    >
        <div style={{position:'relative', aspectRatio:'4 / 3', overflow:'hidden', background:'#0b1a3a'}}>
        <img src={inf.img} alt={inf.title} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transform:hov?'scale(1.04)':'none',transition:'transform 340ms'}} />
      </div>
      <div style={{padding:'13px 15px 16px'}}>
        <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:9,flexWrap:'wrap'}}>
          <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:10.5,fontWeight:700,color:'white',background:ch.color,borderRadius:999,padding:'3px 10px'}}>
            <Icon name={ch.icon} style={{width:12,height:12}} />{ch.label}
          </span>
          <span style={{fontSize:9.5,fontWeight:700,color:'var(--gray-600)',background:'var(--gray-100)',border:'1px solid var(--gray-200)',borderRadius:999,padding:'3px 9px',textTransform:'capitalize'}}>{inf.cat}</span>
        </div>
        <div style={{fontSize:13.5,fontWeight:700,color:'var(--navy-900)',lineHeight:1.32,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',minHeight:'2.7em'}}>{inf.title}</div>
        <div style={{display:'flex',alignItems:'center',gap:6,marginTop:10,fontSize:11.5,fontWeight:700,color:'#0050C8'}}>
          Ver infografía <Icon name="arrow-right" style={{width:13,height:13}} />
        </div>
      </div>
    </div>
  );
}

export function InfographicsPanel() {
  const { data: channels } = useAsyncData(() => contentService.getChannels(), []);
  const { data: allCats } = useAsyncData(() => contentService.getInfographicCategories(), []);
  const [filter, setFilter] = React.useState('all');
  const { status, data: items, error } = useAsyncData(() => contentService.getInfographics({ category: filter }), [filter]);
  const [openInfo, setOpenInfo] = React.useState(null);
  const trackRef = React.useRef(null);

  const channelsById = channels || {};
  const cats = allCats || [];
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
      <CosmicBg variant={2} />
      <div style={{position:'absolute',inset:0,background:'linear-gradient(160deg,rgba(2,16,46,0.82),rgba(5,24,72,0.65))',pointerEvents:'none'}}></div>

      {/* Banner */}
      <div style={{position:'relative',padding:'26px 28px 0',display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:20}}>
        <div>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,marginBottom:12,background:'rgba(255,255,255,0.12)',borderRadius:999,padding:'4px 13px',border:'1px solid rgba(255,255,255,0.2)'}}>
            <Icon name="layout-grid" style={{width:13,height:13,color:'var(--brand-cyan)'}} />
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
        {cats.map(c => {
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
      {status === 'loading' && <div style={{position:'relative'}}><LoadingState label="Cargando infografías…" tone="dark" /></div>}
      {status === 'error' && <div style={{position:'relative'}}><ErrorState label="No pudimos cargar las infografías." tone="dark" error={error} /></div>}
      {status === 'success' && (
        (items || []).length === 0 ? (
          <div style={{position:'relative'}}><EmptyState label="No hay infografías en esta categoría todavía." icon="pie-chart" tone="dark" /></div>
        ) : (
          <div style={{display:'flex',alignItems:'center',padding:'18px 20px 28px',gap:10,position:'relative'}}>
            <button onClick={()=>scroll(-1)} aria-label="Anterior" style={navBtnGlassStyle}>
              <Icon name="chevron-left" style={{width:18,height:18}} />
            </button>
            <div ref={trackRef} style={{
              flex:1, display:'flex', gap:18,
              overflowX:'auto', scrollSnapType:'x mandatory', scrollbarWidth:'none',
            }} className="hide-scroll">
              {items.map(inf => <InfoCard key={inf.id} inf={inf} channelsById={channelsById} onOpen={setOpenInfo} />)}
            </div>
            <button onClick={()=>scroll(1)} aria-label="Siguiente" style={navBtnGlassStyle}>
              <Icon name="chevron-right" style={{width:18,height:18}} />
            </button>
          </div>
        )
      )}

      {openInfo && <InfografiaModal info={openInfo} channelsById={channelsById} onClose={()=>setOpenInfo(null)} />}
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
