import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './shared/Icon.jsx';
import { ModalShell } from './shared/ModalShell.jsx';
import { CosmicBg } from './shared/CosmicBg.jsx';
import { LoadingState, EmptyState, ErrorState } from './shared/AsyncState.jsx';
import { CtaPrimary, CtaCard, CtaLink } from './shared/CtaStyles.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { useFadeContent } from '../hooks/useFadeContent.js';
import { YouTubePlayer } from './shared/YouTubePlayer.jsx';
import * as contentService from '../services/contentService.js';
import * as formService from '../services/formService.js';
import { extractYouTubeVideoId } from '../lib/youtube.js';
import { downloadImageWithFallback } from '../lib/download.js';

/* ── Video player modal — Fase 6/7/8, ajuste posterior: reproductor real de
   YouTube en vez del reproductor decorativo heredado del prototipo original
   (barra de progreso falsa + texto "Reproducción de demostración"). Se
   arranca en estado "poster" (miniatura + botón Play) y solo se embebe el
   iframe al hacer clic — evita autoplay con sonido apenas se abre el
   popup, más apropiado para una demo en vivo. Reutiliza
   extractYouTubeVideoId() (src/lib/youtube.js) en vez de duplicar la
   extracción del ID. Si external_url no es un link de YouTube válido, no
   se finge un reproductor — se ofrece un enlace real a "Ver contenido". ── */
function VideoModal({ video, catsById, onClose }) {
  const cat = catsById[video.cat] || { color:'var(--navy-900)', label:'' };
  const youtubeId = extractYouTubeVideoId(video.externalUrl);

  return (
    <ModalShell onClose={onClose} maxWidth={680}>
      <div style={{position:'relative'}}>
        <YouTubePlayer thumb={video.thumb} externalUrl={video.externalUrl} title={video.title} badge={cat} />
        <button onClick={onClose} style={{position:'absolute',top:12,right:12,zIndex:3,width:34,height:34,borderRadius:'50%',background:'rgba(0,0,0,0.45)',border:'1px solid rgba(255,255,255,0.2)',color:'white',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Icon name="x" style={{width:17,height:17}} />
        </button>
      </div>
      <div style={{padding:'18px 22px 20px'}}>
        <div style={{fontSize:16,fontWeight:700,color:'var(--navy-900)',lineHeight:1.3}}>{video.title}</div>
        <div style={{display:'flex',gap:14,marginTop:8,alignItems:'center'}}>
          <span style={{fontSize:12,color:'var(--gray-500)',display:'inline-flex',alignItems:'center',gap:5}}><Icon name="clock" style={{width:13,height:13}} />{video.dur}</span>
          <span style={{fontSize:12,color:'var(--gray-500)',display:'inline-flex',alignItems:'center',gap:5}}><Icon name="calendar" style={{width:13,height:13}} />{video.date}</span>
        </div>
        {!youtubeId && (
          <div style={{fontSize:13,color:'var(--gray-500)',marginTop:10,lineHeight:1.55}}>
            {video.externalUrl
              ? 'Este contenido no está alojado en YouTube — usa "Ver contenido" para abrirlo en una pestaña nueva.'
              : 'Este video todavía no tiene un link asociado.'}
          </div>
        )}
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
        <CtaCard onClick={(e) => { e.stopPropagation(); onOpen(v); }} style={{alignSelf:'flex-start'}}>Ver video</CtaCard>
      </div>
    </div>
  );
}

export function ExploraPanel() {
  const navigate = useNavigate();
  const { data: categories } = useAsyncData(() => contentService.getVideoCategories(), []);
  const [filter, setFilter] = React.useState('all');
  const { status, data: items, error } = useAsyncData(() => contentService.getVideos({ category: filter }), [filter]);
  const { displayData: fadeItems, isInitialLoad, isRefreshing } = useFadeContent(status, items);
  const [openVideo, setOpenVideo] = React.useState(null);
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
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'#0050C8',marginBottom:4}}>Videos y Webinars</div>
          <div style={{fontSize:19,fontWeight:700,color:'var(--navy-900)'}}>Explora <span style={{background:'var(--grad-title)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>Videos y Webinars</span></div>
          <div style={{fontSize:13,color:'var(--gray-500)',marginTop:4,maxWidth:560,lineHeight:1.5}}>Webinars, cápsulas, charlas y registros de eventos, reunidos en un solo lugar.</div>
        </div>
        <div style={{display:'flex',gap:10,flexShrink:0,paddingTop:4,alignItems:'center'}}>
          <CtaLink onClick={()=>navigate('/videoteca')}>
            Ver todos los videos <Icon name="arrow-right" style={{width:13,height:13}} />
          </CtaLink>
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

      {/* Carousel track — 5 visible, horizontal scroll. Al cambiar de
          categoría se mantiene la última grilla cargada (fadeItems) con
          opacidad reducida durante el refetch, en vez de desmontarla y
          mostrar el spinner — ver useFadeContent. */}
      {isInitialLoad && <LoadingState label="Cargando videos…" />}
      {status === 'error' && <ErrorState label="No pudimos cargar la videoteca." onRetry={() => setFilter(f => f)} error={error} />}
      {!isInitialLoad && status !== 'error' && (
        (fadeItems || []).length === 0 ? (
          <EmptyState label="No hay videos en esta categoría todavía." icon="film" />
        ) : (
          <div ref={trackRef} style={{
            display:'flex', gap:16, padding:'16px 24px 24px',
            overflowX:'auto', scrollSnapType:'x mandatory',
            scrollbarWidth:'none',
            opacity: isRefreshing ? 0.35 : 1, transition:'opacity 220ms ease',
          }} className="hide-scroll">
            {fadeItems.map(v => <VideoCard key={v.id} v={v} catsById={catsById} onOpen={setOpenVideo} />)}
          </div>
        )
      )}

      {openVideo && <VideoModal video={openVideo} catsById={catsById} onClose={()=>setOpenVideo(null)} />}
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

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): el envío ahora
// guarda de verdad en `infographic_leads` (antes solo simulaba con
// setTimeout). `contentItemId` identifica la infografía que originó la
// descarga — lo pasa InfografiaModal, dueño de ese dato.
function InfografiaLeadModal({ contentItemId, onSuccess, onClose }) {
  const [form, setForm] = React.useState({ name:'', empresa:'', cargo:'', email:'' });
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState('');
  const up = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const inputS = { width:'100%',padding:'9px 12px',border:'1.5px solid var(--gray-200)',borderRadius:8,fontSize:13,outline:'none',fontFamily:'inherit',transition:'border-color 150ms' };

  const submit = (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    formService.submitInfografiaLead({ ...form, contentItemId })
      .then(() => {
        sessionStorage.setItem(INFOGRAFIA_LEAD_KEY, 'true');
        onSuccess();
      })
      .catch((err) => {
        setSending(false);
        setError(err.message || 'No pudimos guardar tus datos. Intenta nuevamente.');
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
        {error && (
          <div style={{fontSize:12.5,color:'#c0392b',background:'rgba(192,57,43,0.08)',border:'1px solid rgba(192,57,43,0.2)',borderRadius:8,padding:'9px 12px'}}>{error}</div>
        )}
        <CtaPrimary type="submit" disabled={sending} style={{marginTop:4,width:'100%'}}>
          {sending
            ? <React.Fragment><Icon name="loader-2" style={{width:16,height:16}} />Enviando…</React.Fragment>
            : <React.Fragment><Icon name="download" style={{width:16,height:16}} />Continuar a la descarga</React.Fragment>
          }
        </CtaPrimary>
      </form>
    </ModalShell>
  );
}

// Exportado (ver ajuste posterior "páginas propias" en
// FASE-06-07-08-CONTENIDO-REAL.md): la página /infografias reutiliza este
// mismo popup (incluido el flujo de lead) en vez de duplicar la lógica de
// descarga.
export function InfografiaModal({ info, channelsById, onClose }) {
  const ch = channelsById[info.channel] || { color:'var(--navy-900)', label:'', icon:'link' };
  const [showLead, setShowLead] = React.useState(false);
  const [justDownloaded, setJustDownloaded] = React.useState(false);

  // Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): descarga real
  // en vez del estado visual simulado — ver lib/download.js para el
  // fallback a pestaña nueva cuando el fetch por blob falla (CORS).
  const startDownload = () => {
    setJustDownloaded(true);
    setTimeout(() => setJustDownloaded(false), 2200);
    downloadImageWithFallback(info.img, info.title);
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
        <CtaPrimary onClick={handleDownloadClick} style={{width:'100%'}}>
          <Icon name={justDownloaded ? 'check' : 'download'} style={{width:15,height:15}} />{justDownloaded ? 'Descarga iniciada' : 'Descargar'}
        </CtaPrimary>
      </div>
      {showLead && (
        <InfografiaLeadModal
          contentItemId={info.id}
          onClose={()=>setShowLead(false)}
          onSuccess={() => { setShowLead(false); startDownload(); }}
        />
      )}
    </ModalShell>
  );
}

// Exportado: reutilizado por la página /infografias (misma tarjeta, dentro
// de una grilla en vez de un carrusel).
export function InfoCard({ inf, channelsById, onOpen }) {
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
        <CtaCard onClick={(e) => { e.stopPropagation(); onOpen(inf); }} style={{marginTop:10}}>Ver infografía</CtaCard>
      </div>
    </div>
  );
}

export function InfographicsPanel() {
  const navigate = useNavigate();
  const { data: channels } = useAsyncData(() => contentService.getChannels(), []);
  const { data: allCats } = useAsyncData(() => contentService.getInfographicCategories(), []);
  const [filter, setFilter] = React.useState('all');
  const { status, data: items, error } = useAsyncData(() => contentService.getInfographics({ category: filter }), [filter]);
  const { displayData: fadeItems, isInitialLoad, isRefreshing } = useFadeContent(status, items);
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
      <div style={{position:'relative',padding:'26px 28px 0',display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}>
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
        <CtaLink tone="dark" onClick={()=>navigate('/infografias')} style={{flexShrink:0}}>
          Ver todas las infografías <Icon name="arrow-right" style={{width:13,height:13}} />
        </CtaLink>
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

      {/* Carousel con flechas laterales — mismo criterio de crossfade que
          ExploraPanel al cambiar de categoría (ver useFadeContent). */}
      {isInitialLoad && <div style={{position:'relative'}}><LoadingState label="Cargando infografías…" tone="dark" /></div>}
      {status === 'error' && <div style={{position:'relative'}}><ErrorState label="No pudimos cargar las infografías." tone="dark" error={error} /></div>}
      {!isInitialLoad && status !== 'error' && (
        (fadeItems || []).length === 0 ? (
          <div style={{position:'relative'}}><EmptyState label="No hay infografías en esta categoría todavía." icon="pie-chart" tone="dark" /></div>
        ) : (
          <div style={{display:'flex',alignItems:'center',padding:'18px 20px 28px',gap:10,position:'relative'}}>
            <button onClick={()=>scroll(-1)} aria-label="Anterior" style={navBtnGlassStyle}>
              <Icon name="chevron-left" style={{width:18,height:18}} />
            </button>
            <div ref={trackRef} style={{
              flex:1, display:'flex', gap:18,
              overflowX:'auto', scrollSnapType:'x mandatory', scrollbarWidth:'none',
              opacity: isRefreshing ? 0.35 : 1, transition:'opacity 220ms ease',
            }} className="hide-scroll">
              {fadeItems.map(inf => <InfoCard key={inf.id} inf={inf} channelsById={channelsById} onOpen={setOpenInfo} />)}
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
