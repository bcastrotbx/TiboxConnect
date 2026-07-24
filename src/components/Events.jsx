import React from 'react';
import { Icon } from './shared/Icon.jsx';
import { ModalShell } from './shared/ModalShell.jsx';
import { CosmicBg } from './shared/CosmicBg.jsx';
import { LoadingState, EmptyState, ErrorState } from './shared/AsyncState.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import * as eventService from '../services/eventService.js';
import * as newsService from '../services/newsService.js';

/* ── Detalle del evento (sin formulario propio: la inscripción ocurre
   en la URL externa de registrationUrl, abierta en una pestaña nueva) ── */
function EventDetailModal({ event, modalidadById, onClose }) {
  const mod = modalidadById[event.modalidad] || { color:'#0050C8', icon:'wifi' };
  return (
    <ModalShell onClose={onClose} maxWidth={460}>
      {/* Imagen destacada con nombre del evento */}
      <div style={{position:'relative',height:170,overflow:'hidden',background:'#0b1a3a'}}>
        <img src={event.img} alt={event.title} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(2,12,36,0.35) 0%, rgba(2,12,36,0.55) 55%, rgba(2,12,36,0.9) 100%)'}}></div>
        <button onClick={onClose} style={{position:'absolute',top:14,right:14,background:'rgba(2,12,36,0.5)',border:'1px solid rgba(255,255,255,0.25)',borderRadius:8,cursor:'pointer',color:'white',padding:6,display:'flex',backdropFilter:'blur(4px)'}}>
          <Icon name="x" style={{width:16,height:16}} />
        </button>
        <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'16px 24px'}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--brand-cyan)',marginBottom:6}}>Detalles del evento</div>
          <div style={{fontSize:17,fontWeight:700,color:'white',lineHeight:1.25}}>{event.title}</div>
        </div>
      </div>

      {/* Información principal destacada */}
      <div style={{padding:'18px 24px 4px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          {[
            {ic:'calendar',  lb:'Fecha',     vl:`${event.day} ${event.month} 2026`},
            {ic:'clock',     lb:'Hora',      vl:`${event.time} hrs`},
            {ic:mod.icon,    lb:'Modalidad', vl:event.modalidad, color:mod.color},
            {ic:'map-pin',   lb:'Lugar',     vl:event.place},
          ].map((it,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:11,padding:'11px 13px',background:'var(--gray-50)',borderRadius:11,border:'1px solid var(--gray-200)'}}>
              <div style={{width:34,height:34,borderRadius:9,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',background:(it.color||'#0050C8')+'15'}}>
                <Icon name={it.ic} style={{width:16,height:16,color:it.color||'#0050C8'}} />
              </div>
              <div style={{minWidth:0}}>
                <div style={{fontSize:9.5,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',color:'var(--gray-400)'}}>{it.lb}</div>
                <div style={{fontSize:13,fontWeight:700,color:'var(--navy-900)',lineHeight:1.25}}>{it.vl}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reseña / descripción */}
      <div style={{padding:'16px 24px 4px'}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--brand-cyan-700,#0079a8)',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
          <Icon name="info" style={{width:13,height:13}} />Sobre el evento
        </div>
        <p style={{fontSize:13.5,color:'var(--gray-600)',lineHeight:1.6,margin:0}}>{event.resena || event.desc}</p>
      </div>

      {/* Inscripción: enlace externo (registrationUrl), editable desde el
          admin en una fase futura */}
      <div style={{padding:'18px 24px 24px'}}>
        <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" style={{
          width:'100%',padding:'12px',borderRadius:10,border:'none',cursor:'pointer',
          background:'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',color:'white',textDecoration:'none',
          fontSize:14,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:8,
          boxShadow:'0 2px 14px rgba(255,103,7,0.4)',transition:'transform 150ms',
        }}
          onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
          onMouseLeave={e=>e.currentTarget.style.transform='none'}
        >
          <Icon name="external-link" style={{width:16,height:16}} />Inscríbete aquí
        </a>
      </div>
    </ModalShell>
  );
}

function CalendarModal({ events, modalidadById, onClose }) {
  return (
    <ModalShell onClose={onClose} maxWidth={540}>
      <div style={{padding:'20px 24px',background:'var(--grad-corporate)',position:'relative',overflow:'hidden'}}>
        <CosmicBg variant={0} />
        <div style={{position:'absolute',inset:0,background:'rgba(3,18,55,0.55)'}}></div>
        <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--brand-cyan)',marginBottom:4}}>Agenda TIBOX Connect</div>
            <div style={{fontSize:17,fontWeight:700,color:'white'}}>Calendario de eventos</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.7)',marginTop:3}}>Junio – Agosto 2026</div>
          </div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:8,cursor:'pointer',color:'white',padding:6,flexShrink:0,display:'flex'}}>
            <Icon name="x" style={{width:16,height:16}} />
          </button>
        </div>
      </div>
      <div style={{maxHeight:'56vh',overflowY:'auto',padding:'14px 18px 18px',display:'flex',flexDirection:'column',gap:8}}>
        {events.map(ev=>{
          const m = modalidadById[ev.modalidad] || { color:'#0050C8' };
          return (
            <div key={ev.id} style={{display:'flex',gap:12,alignItems:'center',padding:'10px 12px',borderRadius:10,border:'1px solid var(--gray-200)'}}>
              <div style={{minWidth:46,textAlign:'center',background:'var(--navy-900)',borderRadius:8,padding:'6px 6px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <div style={{fontSize:7,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--brand-cyan)',lineHeight:1.2}}>{ev.month}</div>
                <div style={{fontSize:17,fontWeight:700,color:'white',lineHeight:1}}>{ev.day}</div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12.5,fontWeight:700,color:'var(--navy-900)',lineHeight:1.3}}>{ev.title}</div>
                <div style={{display:'flex',gap:12,marginTop:4,flexWrap:'wrap'}}>
                  <span style={{fontSize:11,color:'var(--gray-500)',display:'inline-flex',alignItems:'center',gap:4}}>
                    <Icon name="map-pin" style={{width:11,height:11}} />{ev.place}
                  </span>
                  <span style={{fontSize:11,color:'var(--gray-500)',display:'inline-flex',alignItems:'center',gap:4}}>
                    <Icon name="clock" style={{width:11,height:11}} />{ev.time} hrs
                  </span>
                </div>
              </div>
              <span style={{fontSize:10,fontWeight:700,borderRadius:999,padding:'2px 8px',background:`${m.color}15`,color:m.color,flexShrink:0}}>{ev.modalidad}</span>
            </div>
          );
        })}
      </div>
    </ModalShell>
  );
}

function EventCard({ ev, modalidadById, partnersById, onVerDetalle }) {
  const m = modalidadById[ev.modalidad] || { color:'#0050C8', icon:'wifi' };
  const partner = partnersById[ev.partner] || { logo:'', name:'' };
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        border:'1px solid var(--gray-200)', borderRadius:14, padding:'14px 16px',
        display:'flex', flexDirection:'column', gap:10, flex:1, justifyContent:'space-between',
        background: hov ? 'white' : 'rgba(255,255,255,0.95)',
        boxShadow: hov ? '0 6px 18px rgba(0,0,0,0.18)' : '0 1px 4px rgba(0,0,0,0.08)',
        borderColor: hov ? 'var(--gray-300)' : 'var(--gray-200)',
        transition:'box-shadow 180ms, border-color 180ms, background 180ms',
      }}
    >
      <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
        <div style={{minWidth:48,textAlign:'center',background:'var(--navy-900)',borderRadius:9,padding:'7px 6px',display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
          <div style={{fontSize:8,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--brand-cyan)',lineHeight:1.2}}>{ev.month}</div>
          <div style={{fontSize:19,fontWeight:700,color:'white',lineHeight:1}}>{ev.day}</div>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:5,flexWrap:'wrap'}}>
            <span style={{fontSize:10,fontWeight:700,borderRadius:999,padding:'2px 9px',background:`${m.color}15`,color:m.color,display:'inline-flex',alignItems:'center',gap:4}}>
              <Icon name={m.icon} style={{width:11,height:11}} />{ev.modalidad}
            </span>
            <span style={{fontSize:10.5,color:'var(--gray-400)',display:'inline-flex',alignItems:'center',gap:4}}>
              <Icon name="clock" style={{width:11,height:11}} />{ev.time} hrs
            </span>
          </div>
          <div style={{fontSize:13.5,fontWeight:700,color:'var(--navy-900)',lineHeight:1.3}}>{ev.title}</div>
        </div>
      </div>

      <p style={{fontSize:12,color:'var(--gray-600)',lineHeight:1.5,margin:0,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{ev.desc}</p>

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,paddingTop:2}}>
        <div style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}>
          <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'var(--gray-400)'}}>Colaborador</span>
          <img src={partner.logo} alt={partner.name} title={partner.name} style={{height:17,maxWidth:96,objectFit:'contain'}} />
        </div>
        <button onClick={()=>onVerDetalle(ev)} style={{
          fontSize:12,fontWeight:700,color:'white',
          background:'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',border:'none',borderRadius:9,
          padding:'8px 16px',cursor:'pointer',flexShrink:0,whiteSpace:'nowrap',
          boxShadow:'0 2px 10px rgba(255,103,7,0.32)',transition:'transform 150ms',
        }}
          onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
          onMouseLeave={e=>e.currentTarget.style.transform='none'}
        >Ver detalles</button>
      </div>
    </div>
  );
}

export function EventosPanel() {
  const { status, data, error } = useAsyncData(() => Promise.all([
    eventService.getUpcomingEvents(),
    eventService.getModalidadConfig(),
    eventService.getPartners(),
  ]).then(([events, modalidad, partners]) => ({ events, modalidad, partners })), []);

  const [openEvent, setOpenEvent] = React.useState(null);
  const [showCal, setShowCal] = React.useState(false);
  const [page, setPage] = React.useState(0);

  const events = data?.events || [];
  const modalidadById = data?.modalidad || {};
  const partnersById = data?.partners || {};
  const perPage = 2;
  const pages = [];
  for (let i = 0; i < events.length; i += perPage) pages.push(events.slice(i, i + perPage));

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',borderRadius:16,overflow:'hidden',position:'relative',background:'var(--grad-corporate)',boxShadow:'0 4px 18px rgba(2,18,55,0.2)'}}>
      <CosmicBg variant={1} />
      <div style={{position:'absolute',inset:0,background:'linear-gradient(160deg,rgba(2,16,46,0.82),rgba(5,24,72,0.65))',pointerEvents:'none'}}></div>
      <div style={{position:'relative',display:'flex',flexDirection:'column',flex:1,minHeight:0}}>
      <div style={{padding:'18px 20px 14px',borderBottom:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,position:'relative'}}>
        <div>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--brand-cyan)',marginBottom:3}}>Agenda</div>
          <div style={{fontSize:'clamp(1.3rem,2vw,1.7rem)',fontWeight:700,color:'white'}}>Próximos <span style={{background:'var(--grad-title)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>Eventos</span></div>
        </div>
        {status === 'success' && events.length > 0 && (
          <button onClick={()=>setShowCal(true)} style={{
            fontSize:12,fontWeight:700,color:'white',
            background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.22)',borderRadius:9,
            padding:'9px 15px',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:7,whiteSpace:'nowrap',
            transition:'transform 150ms,background 150ms',
          }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.background='rgba(255,255,255,0.22)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.background='rgba(255,255,255,0.12)';}}
          >
            <Icon name="calendar-days" style={{width:14,height:14}} />Ver calendario
          </button>
        )}
      </div>

      {status === 'loading' && <LoadingState label="Cargando eventos…" tone="dark" />}
      {status === 'error' && <ErrorState label="No pudimos cargar los próximos eventos." tone="dark" error={error} />}
      {status === 'success' && events.length === 0 && <EmptyState label="No hay eventos próximos por ahora." icon="calendar-check" tone="dark" />}
      {status === 'success' && events.length > 0 && (
        <React.Fragment>
          <div style={{flex:1, display:'flex', alignItems:'stretch'}}>
            <button onClick={()=>setPage((page-1+pages.length)%pages.length)}
              aria-label="Anterior"
              style={{flexShrink:0,width:32,background:'none',border:'none',cursor:'pointer',
                color:'rgba(255,255,255,0.4)',display:'flex',alignItems:'center',justifyContent:'center',
                transition:'color 150ms',
              }}
              onMouseEnter={e=>e.currentTarget.style.color='white'}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}
            >
              <Icon name="chevron-left" style={{width:18,height:18}} />
            </button>
            <div style={{flex:1,padding:'14px 0 4px',display:'flex',flexDirection:'column'}}>
              <div key={page} style={{flex:1,display:'flex',flexDirection:'column',gap:12,animation:'tbxSlideIn 320ms cubic-bezier(0.25,0.8,0.3,1)'}}>
                {pages[page].map(ev => <EventCard key={ev.id} ev={ev} modalidadById={modalidadById} partnersById={partnersById} onVerDetalle={setOpenEvent} />)}
              </div>
            </div>
            <button onClick={()=>setPage((page+1)%pages.length)}
              aria-label="Siguiente"
              style={{flexShrink:0,width:32,background:'none',border:'none',cursor:'pointer',
                color:'rgba(255,255,255,0.4)',display:'flex',alignItems:'center',justifyContent:'center',
                transition:'color 150ms',
              }}
              onMouseEnter={e=>e.currentTarget.style.color='white'}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}
            >
              <Icon name="chevron-right" style={{width:18,height:18}} />
            </button>
          </div>

          <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:7,padding:'10px 0 16px'}}>
            {pages.map((_,i)=>(
              <button key={i} onClick={()=>setPage(i)} aria-label={`Página ${i+1}`} style={{
                width: i===page ? 20 : 7, height:7,
                borderRadius:999,border:'none',cursor:'pointer',padding:0,
                background: i===page ? 'var(--brand-cyan)' : 'rgba(255,255,255,0.3)',
                transition:'all 300ms',
              }}/>
            ))}
          </div>
        </React.Fragment>
      )}

      {openEvent && <EventDetailModal event={openEvent} modalidadById={modalidadById} onClose={()=>setOpenEvent(null)} />}
      {showCal && <CalendarModal events={events} modalidadById={modalidadById} onClose={()=>setShowCal(false)} />}
      </div>
    </div>
  );
}

/* ── Vista modal (evento realizado + galería) ───── */
function VistaModal({ event, onClose }) {
  const [lightbox, setLightbox] = React.useState(null);
  return (
    <ModalShell onClose={onClose} maxWidth={560}>
      {/* Imagen principal */}
      <div style={{position:'relative',height:190,overflow:'hidden',background:'#0b1a3a'}}>
        <img src={event.img} alt={event.title} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(2,12,36,0.3) 0%, rgba(2,12,36,0.5) 55%, rgba(2,12,36,0.9) 100%)'}}></div>
        <button onClick={onClose} style={{position:'absolute',top:14,right:14,background:'rgba(2,12,36,0.5)',border:'1px solid rgba(255,255,255,0.25)',borderRadius:8,cursor:'pointer',color:'white',padding:6,display:'flex',backdropFilter:'blur(4px)'}}>
          <Icon name="x" style={{width:16,height:16}} />
        </button>
        <span style={{position:'absolute',top:14,left:14,fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'white',background:'rgba(13,138,78,0.92)',borderRadius:999,padding:'4px 11px',display:'inline-flex',alignItems:'center',gap:5}}>
          <Icon name="check-circle-2" style={{width:12,height:12}} />Evento realizado
        </span>
        <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'16px 24px'}}>
          <div style={{fontSize:18,fontWeight:700,color:'white',lineHeight:1.25}}>{event.title}</div>
        </div>
      </div>

      {/* Información general */}
      <div style={{padding:'18px 24px 4px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
          {[
            {ic:'calendar', lb:'Fecha', vl:`${event.day} ${event.month} 2026`},
            {ic:'clock',    lb:'Hora',  vl:`${event.time} hrs`},
            {ic:'map-pin',  lb:'Lugar', vl:event.place},
          ].map((it,i)=>(
            <div key={i} style={{padding:'11px 13px',background:'var(--gray-50)',borderRadius:11,border:'1px solid var(--gray-200)'}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:5}}>
                <Icon name={it.ic} style={{width:13,height:13,color:'#0050C8'}} />
                <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',color:'var(--gray-400)'}}>{it.lb}</span>
              </div>
              <div style={{fontSize:12.5,fontWeight:700,color:'var(--navy-900)',lineHeight:1.3}}>{it.vl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen + reseña */}
      <div style={{padding:'16px 24px 4px'}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'#0079a8',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
          <Icon name="file-text" style={{width:13,height:13}} />Resumen
        </div>
        <p style={{fontSize:13.5,fontWeight:600,color:'var(--navy-900)',lineHeight:1.55,margin:'0 0 10px'}}>{event.resumen}</p>
        <p style={{fontSize:13,color:'var(--gray-600)',lineHeight:1.65,margin:0}}>{event.resena}</p>
      </div>

      {/* Galería fotográfica */}
      <div style={{padding:'18px 24px 24px'}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'#FF6707',marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
          <Icon name="images" style={{width:13,height:13}} />Galería del evento
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {event.gallery.map((src,i)=>(
            <button key={i} onClick={()=>setLightbox(src)} style={{
              position:'relative',aspectRatio:'4/3',borderRadius:11,overflow:'hidden',cursor:'pointer',
              border:'1px solid var(--gray-200)',padding:0,background:'#0b1a3a',
            }}
              onMouseEnter={e=>{const im=e.currentTarget.querySelector('img');if(im)im.style.transform='scale(1.06)';}}
              onMouseLeave={e=>{const im=e.currentTarget.querySelector('img');if(im)im.style.transform='none';}}
            >
              <img src={src} alt={`Foto ${i+1}`} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transition:'transform 320ms'}} />
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div onClick={()=>setLightbox(null)} style={{position:'fixed',inset:0,zIndex:700,background:'rgba(2,12,36,0.86)',display:'flex',alignItems:'center',justifyContent:'center',padding:32,cursor:'zoom-out'}}>
          <img src={lightbox} alt="Foto del evento" style={{maxWidth:'100%',maxHeight:'100%',borderRadius:12,boxShadow:'0 24px 64px rgba(0,0,0,0.5)'}} />
        </div>
      )}
    </ModalShell>
  );
}

function PastEventCard({ ev, onVer }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        border:'1px solid var(--gray-200)', borderRadius:14, padding:'14px 16px',
        display:'flex', flexDirection:'column', gap:10, flex:1, justifyContent:'space-between',
        background: hov ? 'white' : 'rgba(255,255,255,0.95)',
        boxShadow: hov ? '0 6px 18px rgba(0,0,0,0.18)' : '0 1px 4px rgba(0,0,0,0.08)',
        borderColor: hov ? 'var(--gray-300)' : 'var(--gray-200)',
        transition:'box-shadow 180ms, border-color 180ms, background 180ms',
      }}
    >
      <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
        <div style={{position:'relative',width:56,height:56,borderRadius:10,overflow:'hidden',flexShrink:0,background:'#0b1a3a'}}>
          <img src={ev.img} alt={ev.title} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />
          <div style={{position:'absolute',inset:0,background:'rgba(2,12,36,0.25)'}}></div>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:5,flexWrap:'wrap'}}>
            <span style={{fontSize:10,fontWeight:700,borderRadius:999,padding:'2px 9px',background:'rgba(13,138,78,0.12)',color:'#0d8a4e',display:'inline-flex',alignItems:'center',gap:4}}>
              <Icon name="check-circle-2" style={{width:11,height:11}} />Realizado
            </span>
            <span style={{fontSize:10.5,color:'var(--gray-400)',display:'inline-flex',alignItems:'center',gap:4}}>
              <Icon name="calendar" style={{width:11,height:11}} />{ev.day} {ev.month}
            </span>
          </div>
          <div style={{fontSize:13.5,fontWeight:700,color:'var(--navy-900)',lineHeight:1.3}}>{ev.title}</div>
        </div>
      </div>

      <p style={{fontSize:12,color:'var(--gray-600)',lineHeight:1.5,margin:0,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{ev.resumen}</p>

      <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:10,paddingTop:2}}>
        <button onClick={()=>onVer(ev)} style={{
          fontSize:12,fontWeight:700,color:'white',
          background:'linear-gradient(135deg, #0050C8 0%, #2a8fe0 100%)',border:'none',borderRadius:9,
          padding:'8px 16px',cursor:'pointer',flexShrink:0,whiteSpace:'nowrap',
          display:'inline-flex',alignItems:'center',gap:6,transition:'transform 150ms, box-shadow 150ms',
          boxShadow:'0 2px 10px rgba(0,80,200,0.32)',
        }}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 4px 16px rgba(0,80,200,0.45)';}}
          onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 2px 10px rgba(0,80,200,0.32)';}}
        >Ver detalles del evento <Icon name="arrow-right" style={{width:13,height:13}} /></button>
      </div>
    </div>
  );
}

export function EventosRealizadosPanel() {
  const { status, data, error } = useAsyncData(() => eventService.getPastEvents(), []);
  const [openEvent, setOpenEvent] = React.useState(null);
  const [page, setPage] = React.useState(0);

  const pastEventItems = data || [];
  const perPage = 2;
  const pages = [];
  for (let i = 0; i < pastEventItems.length; i += perPage) pages.push(pastEventItems.slice(i, i + perPage));

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',borderRadius:16,overflow:'hidden',position:'relative',background:'var(--grad-corporate)',boxShadow:'0 4px 18px rgba(2,18,55,0.2)'}}>
      <CosmicBg variant={2} />
      <div style={{position:'absolute',inset:0,background:'linear-gradient(160deg,rgba(2,16,46,0.82),rgba(5,24,72,0.65))',pointerEvents:'none'}}></div>
      <div style={{position:'relative',display:'flex',flexDirection:'column',flex:1,minHeight:0}}>
        <div style={{padding:'18px 20px 14px',borderBottom:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--brand-cyan)',marginBottom:3}}>Historial</div>
            <div style={{fontSize:'clamp(1.3rem,2vw,1.7rem)',fontWeight:700,color:'white'}}>Eventos <span style={{background:'var(--grad-title)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>Realizados</span></div>
          </div>
          {status === 'success' && pastEventItems.length > 0 && (
            <span style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.7)',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:999,padding:'6px 13px',whiteSpace:'nowrap'}}>{pastEventItems.length} eventos</span>
          )}
        </div>

        {status === 'loading' && <LoadingState label="Cargando eventos realizados…" tone="dark" />}
        {status === 'error' && <ErrorState label="No pudimos cargar los eventos realizados." tone="dark" error={error} />}
        {status === 'success' && pastEventItems.length === 0 && <EmptyState label="Todavía no hay eventos realizados." icon="calendar-check" tone="dark" />}
        {status === 'success' && pastEventItems.length > 0 && (
          <React.Fragment>
            <div style={{flex:1, display:'flex', alignItems:'stretch'}}>
              <button onClick={()=>setPage((page-1+pages.length)%pages.length)} aria-label="Anterior"
                style={{flexShrink:0,width:32,background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.4)',display:'flex',alignItems:'center',justifyContent:'center',transition:'color 150ms'}}
                onMouseEnter={e=>e.currentTarget.style.color='white'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}>
                <Icon name="chevron-left" style={{width:18,height:18}} />
              </button>
              <div style={{flex:1,padding:'14px 0 4px',display:'flex',flexDirection:'column'}}>
                <div key={page} style={{flex:1,display:'flex',flexDirection:'column',gap:12,animation:'tbxSlideIn 320ms cubic-bezier(0.25,0.8,0.3,1)'}}>
                  {pages[page].map(ev => <PastEventCard key={ev.id} ev={ev} onVer={setOpenEvent} />)}
                </div>
              </div>
              <button onClick={()=>setPage((page+1)%pages.length)} aria-label="Siguiente"
                style={{flexShrink:0,width:32,background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.4)',display:'flex',alignItems:'center',justifyContent:'center',transition:'color 150ms'}}
                onMouseEnter={e=>e.currentTarget.style.color='white'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}>
                <Icon name="chevron-right" style={{width:18,height:18}} />
              </button>
            </div>

            <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:7,padding:'10px 0 16px'}}>
              {pages.map((_,i)=>(
                <button key={i} onClick={()=>setPage(i)} aria-label={`Página ${i+1}`} style={{
                  width: i===page ? 20 : 7, height:7, borderRadius:999,border:'none',cursor:'pointer',padding:0,
                  background: i===page ? 'var(--brand-cyan)' : 'rgba(255,255,255,0.3)', transition:'all 300ms',
                }}/>
              ))}
            </div>
          </React.Fragment>
        )}

        {openEvent && <VistaModal event={openEvent} onClose={()=>setOpenEvent(null)} />}
      </div>
    </div>
  );
}

export function NoticiasPanel() {
  const { data: allCats } = useAsyncData(() => newsService.getNewsCategories(), []);
  const { data: featuredNews } = useAsyncData(() => newsService.getFeaturedNews(), []);
  const [filter, setFilter] = React.useState('all');
  const { status, data: items, error } = useAsyncData(() => newsService.getNews({ category: filter }), [filter]);

  const cats = allCats || [];
  const catsById = React.useMemo(() => Object.fromEntries((allCats || []).map(c => [c.id, c])), [allCats]);
  const fc = featuredNews ? catsById[featuredNews.cat] : null;

  return (
    <div className="section-card">
      <div style={{padding:'20px 24px 0'}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--brand-cyan)',marginBottom:4}}>Al día</div>
        <div style={{fontSize:'clamp(1.3rem,2vw,1.7rem)',fontWeight:700,color:'var(--navy-900)'}}>Tendencias <span style={{background:'var(--grad-title)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>de la industria</span></div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:0,marginTop:16,borderTop:'1px solid var(--gray-100)'}}>
        {/* Left: categories + news list */}
        <div style={{padding:'18px 22px',borderRight:'1px solid var(--gray-100)'}}>
          {/* Category filter */}
          <div style={{display:'flex',gap:7,flexWrap:'wrap',marginBottom:16}}>
            {cats.map(c => {
              const on = filter === c.id;
              return (
                <button key={c.id} onClick={()=>setFilter(c.id)} style={{
                  fontSize:11.5, fontWeight:700, cursor:'pointer',
                  borderRadius:999, padding:'5px 12px',
                  border: on ? '1px solid '+c.color : '1px solid var(--gray-200)',
                  background: on ? c.color : 'white',
                  color: on ? 'white' : 'var(--gray-600)',
                  transition:'all 150ms', whiteSpace:'nowrap',
                }}>{c.label}</button>
              );
            })}
          </div>
          {/* News list */}
          {status === 'loading' && <LoadingState label="Cargando noticias…" />}
          {status === 'error' && <ErrorState label="No pudimos cargar las noticias." error={error} />}
          {status === 'success' && (items || []).length === 0 && <EmptyState label="No hay noticias en esta categoría todavía." icon="rss" />}
          {status === 'success' && (items || []).length > 0 && (
            <div style={{position:'relative'}}>
              <div style={{display:'flex',flexDirection:'column',maxHeight:450,overflowY:'auto',scrollbarWidth:'thin',scrollbarColor:'var(--gray-300) transparent',paddingRight:4}}>
                {items.map((n,idx) => {
                  const c = catsById[n.cat] || {};
                  return (
                    <a key={n.id} href={featuredNews ? featuredNews.url : '#'} target="_blank" rel="noopener noreferrer"
                      style={{display:'flex',gap:13,padding:'13px 0',textDecoration:'none',borderTop: idx===0?'none':'1px solid var(--gray-100)',cursor:'pointer'}}
                      onMouseEnter={e=>e.currentTarget.style.opacity='0.72'}
                      onMouseLeave={e=>e.currentTarget.style.opacity='1'}
                    >
                      <div style={{width:4,borderRadius:999,background:c.color,flexShrink:0,alignSelf:'stretch'}}></div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
                          <span style={{fontSize:10,fontWeight:700,color:c.color,textTransform:'uppercase',letterSpacing:'0.04em'}}>{c.label}</span>
                          <span style={{fontSize:10.5,color:'var(--gray-400)'}}>·</span>
                          <span style={{fontSize:10.5,color:'var(--gray-400)'}}>{n.source}</span>
                        </div>
                        <div style={{fontSize:13,fontWeight:600,color:'var(--navy-900)',lineHeight:1.4}}>{n.title}</div>
                        <div style={{fontSize:10.5,color:'var(--gray-400)',marginTop:5,display:'flex',alignItems:'center',gap:4}}>
                          <Icon name="clock" style={{width:11,height:11}} />{n.date}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
              <div style={{position:'absolute',bottom:0,left:0,right:4,height:60,background:'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.97) 100%)',pointerEvents:'none'}}></div>
            </div>
          )}
        </div>

        {/* Right: featured publication */}
        {featuredNews && (
          <div style={{padding:'18px 22px',display:'flex',flexDirection:'column'}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#FF6707',marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
              <Icon name="star" style={{width:13,height:13}} />Publicación destacada
            </div>
            <div style={{borderRadius:14,overflow:'hidden',position:'relative',aspectRatio:'16/9',background:'#0b1a3a',marginBottom:14}}>
              <img src={featuredNews.img} alt={featuredNews.title} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />
              <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(2,12,36,0.1),rgba(2,12,36,0.5))'}}></div>
              {fc && <span style={{position:'absolute',top:12,left:12,fontSize:10.5,fontWeight:700,color:'white',background:fc.color,borderRadius:999,padding:'4px 11px'}}>{fc.label}</span>}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:12,fontSize:11,color:'var(--gray-400)',marginBottom:9}}>
              <span style={{display:'inline-flex',alignItems:'center',gap:4}}><Icon name="calendar" style={{width:12,height:12}} />{featuredNews.date}</span>
              <span style={{display:'inline-flex',alignItems:'center',gap:4}}><Icon name="book-open" style={{width:12,height:12}} />{featuredNews.readtime}</span>
            </div>
            <h3 style={{fontSize:17,fontWeight:700,color:'var(--navy-900)',lineHeight:1.3,margin:'0 0 9px'}}>{featuredNews.title}</h3>
            <p style={{fontSize:13,color:'var(--gray-600)',lineHeight:1.6,margin:'0 0 18px'}}>{featuredNews.excerpt}</p>
            <a href={featuredNews.url} target="_blank" rel="noopener noreferrer" style={{
              alignSelf:'flex-start',display:'inline-flex',alignItems:'center',gap:8,textDecoration:'none',
              fontSize:13.5,fontWeight:700,color:'white',
              background:'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',borderRadius:10,
              padding:'12px 22px',boxShadow:'0 2px 14px rgba(255,103,7,0.35)',transition:'transform 150ms',
            }}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='none'}
            >
              Ver publicación <Icon name="external-link" style={{width:15,height:15}} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
