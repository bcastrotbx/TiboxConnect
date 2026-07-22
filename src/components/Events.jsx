import React from 'react';
import { Icon } from './shared/Icon.jsx';
import { ModalShell } from './shared/ModalShell.jsx';
import { CosmicBg } from './shared/CosmicBg.jsx';

/* ── Events data ─────────────────────────────────── */
const MODALIDAD = {
  'Online':     { color:'#0891b2', icon:'wifi' },
  'Presencial': { color:'#0056b3', icon:'map-pin' },
  'Híbrida':    { color:'#6a3ed0', icon:'git-merge' },
};
const PARTNERS = {
  microsoft: { logo:'/assets/partner-microsoft.svg', name:'Microsoft' },
  azure:     { logo:'/assets/partner-azure.svg',     name:'Microsoft Azure' },
  veeam:     { logo:'/assets/partner-veeam.svg',     name:'Veeam' },
  hpe:       { logo:'/assets/partner-hpe.svg',       name:'HPE' },
};

const eventItems = [
  {id:1, day:'19', month:'Jun', title:'Webinar: Ciberseguridad para PYMES Chile 2026', modalidad:'Online', time:'10:00 – 11:30', place:'Microsoft Teams', partner:'microsoft', img:'/assets/video-ciber.jpg',
    desc:'Aprende a proteger tu empresa con controles esenciales y un SOC gestionado, sin sobredimensionar tu presupuesto.',
    resena:'En este webinar revisaremos las amenazas más frecuentes que enfrentan las pymes chilenas y cómo construir una defensa por capas realista. El objetivo es que salgas con un checklist de controles esenciales —respaldo, MFA, endpoint y monitoreo— priorizados por impacto y costo. Ideal para gerentes y encargados de TI que buscan elevar su postura de seguridad sin sobredimensionar la inversión.'},
  {id:2, day:'24', month:'Jun', title:'Taller: Implementación SD-WAN en tu empresa', modalidad:'Presencial', time:'09:30 – 13:00', place:'Oficina TIBOX, Vitacura', city:'Santiago', partner:'hpe', img:'/assets/hero-slider-1.jpg',
    desc:'Sesión práctica para diseñar una red SD-WAN resiliente y optimizar la conectividad entre tus sucursales.',
    resena:'Taller práctico, con casos reales, donde diseñarás una topología SD-WAN resiliente para conectar tus sucursales con mayor disponibilidad y menor costo de enlaces. Abordaremos políticas de tráfico, failover automático y visibilidad de la red. Te llevarás un blueprint aplicable a tu propia operación y las mejores prácticas de despliegue.'},
  {id:3, day:'02', month:'Jul', title:'Demo en vivo: TIBOX NOC, monitoreo 24/7', modalidad:'Online', time:'16:00 – 17:00', place:'Zoom', partner:'azure', img:'/assets/video-cloud.jpg',
    desc:'Recorrido por nuestro Centro de Operaciones de Red y cómo anticipamos fallas antes de que te afecten.',
    resena:'Recorreremos en vivo nuestro Centro de Operaciones de Red (NOC) y mostraremos cómo la observabilidad y la automatización nos permiten anticipar incidentes antes de que afecten tu negocio. Verás dashboards reales, flujos de alertamiento y tiempos de respuesta. Pensado para quienes evalúan externalizar o reforzar su monitoreo.'},
  {id:4, day:'10', month:'Jul', title:'Conferencia: Transformación Digital en Retail', modalidad:'Híbrida', time:'08:30 – 13:30', place:'Hotel W, Santiago', city:'Santiago', partner:'microsoft', img:'/assets/video-evento.jpg',
    desc:'Casos reales de retailers que modernizaron su operación con cloud, datos e inteligencia artificial.',
    resena:'Una mañana de casos reales: retailers que modernizaron su operación con cloud, datos e inteligencia artificial, y los aprendizajes detrás de cada proyecto. Conversaremos sobre experiencia de cliente, eficiencia operativa y cómo construir un roadmap digital sostenible. Incluye espacio de networking con pares de la industria.'},
  {id:5, day:'16', month:'Jul', title:'Webinar: FinOps — optimiza tus costos cloud', modalidad:'Online', time:'11:00 – 12:00', place:'Microsoft Teams', partner:'azure', img:'/assets/video-m365.jpg',
    desc:'Estrategias para reducir tu factura cloud sin frenar el crecimiento, con gobernanza y visibilidad de costos.',
    resena:'Aprenderás el marco FinOps para alinear finanzas, tecnología y negocio en torno al gasto cloud. Veremos cómo ganar visibilidad de costos, identificar desperdicio y establecer gobernanza sin frenar el crecimiento. Útil para CFOs, líderes TI y equipos de plataforma que quieren maximizar el retorno de su nube.'},
  {id:6, day:'23', month:'Jul', title:'Taller: Respaldo y recuperación con Veeam', modalidad:'Presencial', time:'09:00 – 12:30', place:'Oficina TIBOX, Curicó', city:'Curicó', partner:'veeam', img:'/assets/info-2.jpg',
    desc:'Diseña una estrategia de respaldos 3-2-1 y prueba tu plan de recuperación ante desastres paso a paso.',
    resena:'Taller hands-on para diseñar una estrategia de respaldos 3-2-1 robusta y probar tu plan de recuperación ante desastres paso a paso. Cubriremos políticas de retención, inmutabilidad ante ransomware y pruebas de restauración. Te irás con un plan de continuidad concreto para tu organización.'},
  {id:7, day:'30', month:'Jul', title:'Demo: Chatbots con IA para tu empresa', modalidad:'Online', time:'15:00 – 16:00', place:'Zoom', partner:'azure', img:'/assets/video-ia.jpg',
    desc:'Cómo desplegar asistentes virtuales con IA generativa integrados a tus sistemas y canales de atención.',
    resena:'Demostración práctica de cómo desplegar asistentes virtuales con IA generativa integrados a tus sistemas y canales de atención. Veremos casos de uso en soporte, ventas y operaciones, y cómo medir su impacto. Pensado para equipos que buscan automatizar la atención sin perder cercanía con el cliente.'},
  {id:8, day:'06', month:'Ago', title:'Mesa redonda: Zero Trust en la práctica', modalidad:'Híbrida', time:'09:00 – 11:30', place:'Oficina TIBOX, Miraflores', city:'Lima', partner:'microsoft', img:'/assets/video-copilot.jpg',
    desc:'Expertos comparten cómo adoptar un modelo Zero Trust de forma gradual y medible en tu organización.',
    resena:'Expertos de TIBOX y partners comparten cómo adoptar un modelo Zero Trust de forma gradual y medible, sin paralizar la operación. Discutiremos identidad, segmentación, dispositivos y datos, con métricas para demostrar avance. Incluye preguntas abiertas y casos de la audiencia.'},
];

/* ── Eventos realizados (past events) ────────────── */
const pastEventItems = [
  {id:101, day:'28', month:'May', title:'Cumbre TIBOX Cloud & IA 2026', modalidad:'Presencial', time:'09:00 – 14:00', place:'Hotel W, Santiago', attendees:'180 asistentes', partner:'microsoft',
    img:'/assets/hero-universe.jpg',
    resumen:'Una jornada dedicada a cómo la nube y la inteligencia artificial están redefiniendo la operación de las empresas chilenas.',
    resena:'La Cumbre reunió a líderes de TI de distintos sectores para explorar casos reales de adopción de cloud e IA generativa. Se presentaron arquitecturas de referencia, resultados de proyectos de modernización y un panel sobre gobernanza de datos. Las principales conclusiones apuntaron a que la madurez en datos y la gestión del cambio son los mayores diferenciadores de éxito, por sobre la tecnología misma.',
    gallery:['/assets/info-1.jpg','/assets/video-evento.jpg','/assets/video-cloud.jpg','/assets/hero-slider-2.jpg']},
  {id:102, day:'15', month:'May', title:'Workshop: Ciberseguridad Empresarial', modalidad:'Presencial', time:'09:30 – 13:00', place:'Oficina TIBOX, Vitacura', attendees:'45 asistentes', partner:'microsoft',
    img:'/assets/video-ciber.jpg',
    resumen:'Sesión práctica sobre cómo construir una postura de seguridad por capas y responder ante incidentes reales.',
    resena:'Durante el workshop, los participantes realizaron un ejercicio de simulación de incidente (tabletop) y revisaron controles esenciales de protección. Se abordaron MFA, segmentación, respaldo inmune a ransomware y monitoreo continuo. La conclusión más valorada fue la importancia de practicar el plan de respuesta antes de necesitarlo, y contar con un SOC que reduzca los tiempos de detección.',
    gallery:['/assets/video-copilot.jpg','/assets/info-3.jpg','/assets/video-m365.jpg','/assets/info-4.jpg']},
  {id:103, day:'30', month:'Abr', title:'TIBOX Connect Day Santiago', modalidad:'Híbrida', time:'08:30 – 13:30', place:'Espacio Riesco, Santiago', attendees:'320 asistentes', partner:'azure',
    img:'/assets/video-evento.jpg',
    resumen:'Nuestro encuentro anual de clientes y partners, con charlas, demos y espacios de networking.',
    resena:'Connect Day reunió a clientes y partners en torno a las tendencias que están marcando la transformación digital en Chile. Hubo demostraciones en vivo de monitoreo NOC, automatización e IA, además de un keynote sobre continuidad operacional. Los asistentes destacaron el valor de las conversaciones uno a uno con especialistas y la cercanía del equipo TIBOX.',
    gallery:['/assets/hero-slider-1.jpg','/assets/hero-slider-3.jpg','/assets/info-2.jpg','/assets/video-webinar.jpg']},
  {id:104, day:'18', month:'Abr', title:'Webinar: Continuidad Operacional 24/7', modalidad:'Online', time:'11:00 – 12:00', place:'Microsoft Teams', attendees:'210 asistentes', partner:'veeam',
    img:'/assets/video-webinar.jpg',
    resumen:'Cómo diseñar infraestructura y procesos que mantengan tu negocio operativo ante cualquier imprevisto.',
    resena:'En este webinar revisamos los pilares de la continuidad operacional: redundancia de infraestructura, respaldos probados, monitoreo proactivo y planes de recuperación. Se compartieron métricas de disponibilidad reales y cómo TIBOX las sostiene con su NOC. La conclusión: la continuidad no es un producto, sino una disciplina que combina tecnología, procesos y práctica constante.',
    gallery:['/assets/video-cloud.jpg','/assets/info-1.jpg','/assets/video-ia.jpg','/assets/hero-universe.jpg']},
];

/* ── Inscripción modal (event sign-up) ──────────── */
function InscripcionModal({ event, onClose }) {
  const mod = MODALIDAD[event.modalidad] || { color:'#0050C8', icon:'wifi' };
  const [form, setForm] = React.useState({ name:'', rut:'', empresa:'', phone:'' });
  const [accept, setAccept] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const up = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const inputS = { width:'100%',padding:'9px 12px',border:'1.5px solid var(--gray-200)',borderRadius:8,fontSize:13,outline:'none',fontFamily:'inherit',transition:'border-color 150ms' };
  const submit = (e) => { e.preventDefault(); setDone(true); setTimeout(onClose, 1900); };
  return (
    <ModalShell onClose={onClose} maxWidth={460}>
      {done ? (
        <div style={{textAlign:'center',padding:'40px 32px'}}>
          <div style={{width:60,height:60,borderRadius:'50%',background:'rgba(22,179,100,0.12)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
            <Icon name="check" style={{width:30,height:30,color:'#0d8a4e'}} />
          </div>
          <div style={{fontSize:18,fontWeight:700,color:'var(--navy-900)'}}>¡Inscripción registrada!</div>
          <div style={{fontSize:13.5,color:'var(--gray-500)',marginTop:8,lineHeight:1.5}}>Te enviaremos los detalles de acceso a tu correo. ¡Nos vemos en el evento!</div>
        </div>
      ) : (
        <React.Fragment>
          {/* Imagen destacada con nombre del evento */}
          <div style={{position:'relative',height:170,overflow:'hidden',background:'#0b1a3a'}}>
            <img src={event.img} alt={event.title} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />
            <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(2,12,36,0.35) 0%, rgba(2,12,36,0.55) 55%, rgba(2,12,36,0.9) 100%)'}}></div>
            <button onClick={onClose} style={{position:'absolute',top:14,right:14,background:'rgba(2,12,36,0.5)',border:'1px solid rgba(255,255,255,0.25)',borderRadius:8,cursor:'pointer',color:'white',padding:6,display:'flex',backdropFilter:'blur(4px)'}}>
              <Icon name="x" style={{width:16,height:16}} />
            </button>
            <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'16px 24px'}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--brand-cyan)',marginBottom:6}}>Inscripción al evento</div>
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

          {/* Formulario de inscripción (después de la información) */}
          <div style={{padding:'18px 24px 6px'}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'#FF6707',display:'flex',alignItems:'center',gap:6}}>
              <Icon name="user-plus" style={{width:13,height:13}} />Completa tu inscripción
            </div>
          </div>
          <form onSubmit={submit} style={{padding:'10px 24px 24px',display:'flex',flexDirection:'column',gap:13}}>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:'var(--gray-600)',display:'block',marginBottom:5}}>Nombre</label>
              <input value={form.name} onChange={up('name')} required placeholder="Tu nombre completo" style={inputS}
                onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'} />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:'var(--gray-600)',display:'block',marginBottom:5}}>RUT</label>
                <input value={form.rut} onChange={up('rut')} required placeholder="12.345.678-9" style={inputS}
                  onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'} />
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:'var(--gray-600)',display:'block',marginBottom:5}}>Teléfono</label>
                <input value={form.phone} onChange={up('phone')} required placeholder="+56 9 XXXX XXXX" style={inputS}
                  onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'} />
              </div>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:'var(--gray-600)',display:'block',marginBottom:5}}>Empresa</label>
              <input value={form.empresa} onChange={up('empresa')} required placeholder="Empresa S.A." style={inputS}
                onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'} />
            </div>
            <label style={{display:'flex',gap:9,alignItems:'flex-start',cursor:'pointer',fontSize:12.5,color:'var(--gray-600)',lineHeight:1.45,marginTop:2}}>
              <input type="checkbox" checked={accept} onChange={e=>setAccept(e.target.checked)} required
                style={{width:16,height:16,marginTop:1,accentColor:'#FF6707',cursor:'pointer',flexShrink:0}} />
              <span>He leído y acepto el aviso de privacidad e información de titular.</span>
            </label>
            <button type="submit" style={{
              marginTop:4,padding:'12px',borderRadius:10,border:'none',cursor:'pointer',
              background:'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',color:'white',
              fontSize:14,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:8,
              boxShadow:'0 2px 14px rgba(255,103,7,0.4)',transition:'transform 150ms',
            }}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='none'}
            >
              <Icon name="check-circle-2" style={{width:16,height:16}} />Confirmar inscripción
            </button>
          </form>
        </React.Fragment>
      )}
    </ModalShell>
  );
}

function CalendarModal({ onClose }) {
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
        {eventItems.map(ev=>{
          const m = MODALIDAD[ev.modalidad];
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

function EventCard({ ev, onInscribir }) {
  const m = MODALIDAD[ev.modalidad];
  const partner = PARTNERS[ev.partner];
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
          <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'var(--gray-400)'}}>Partner</span>
          <img src={partner.logo} alt={partner.name} title={partner.name} style={{height:17,maxWidth:96,objectFit:'contain'}} />
        </div>
        <button onClick={()=>onInscribir(ev)} style={{
          fontSize:12,fontWeight:700,color:'white',
          background:'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',border:'none',borderRadius:9,
          padding:'8px 16px',cursor:'pointer',flexShrink:0,whiteSpace:'nowrap',
          boxShadow:'0 2px 10px rgba(255,103,7,0.32)',transition:'transform 150ms',
        }}
          onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
          onMouseLeave={e=>e.currentTarget.style.transform='none'}
        >Inscribirme</button>
      </div>
    </div>
  );
}

export function EventosPanel() {
  const [openEvent, setOpenEvent] = React.useState(null);
  const [showCal, setShowCal] = React.useState(false);
  const [page, setPage] = React.useState(0);

  const perPage = 2;
  const pages = [];
  for (let i = 0; i < eventItems.length; i += perPage) pages.push(eventItems.slice(i, i + perPage));

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
      </div>

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
            {pages[page].map(ev => <EventCard key={ev.id} ev={ev} onInscribir={setOpenEvent} />)}
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

      {openEvent && <InscripcionModal event={openEvent} onClose={()=>setOpenEvent(null)} />}
      {showCal && <CalendarModal onClose={()=>setShowCal(false)} />}
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
  const partner = PARTNERS[ev.partner];
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

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,paddingTop:2}}>
        <span style={{fontSize:10.5,color:'var(--gray-400)',display:'inline-flex',alignItems:'center',gap:5}}>
          <Icon name="users" style={{width:12,height:12}} />{ev.attendees}
        </span>
        <button onClick={()=>onVer(ev)} style={{
          fontSize:12,fontWeight:700,color:'white',
          background:'linear-gradient(135deg, #0050C8 0%, #2a8fe0 100%)',border:'none',borderRadius:9,
          padding:'8px 16px',cursor:'pointer',flexShrink:0,whiteSpace:'nowrap',
          display:'inline-flex',alignItems:'center',gap:6,transition:'transform 150ms, box-shadow 150ms',
          boxShadow:'0 2px 10px rgba(0,80,200,0.32)',
        }}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 4px 16px rgba(0,80,200,0.45)';}}
          onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 2px 10px rgba(0,80,200,0.32)';}}
        >Ver más <Icon name="arrow-right" style={{width:13,height:13}} /></button>
      </div>
    </div>
  );
}

export function EventosRealizadosPanel() {
  const [openEvent, setOpenEvent] = React.useState(null);
  const [page, setPage] = React.useState(0);

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
          <span style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.7)',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:999,padding:'6px 13px',whiteSpace:'nowrap'}}>{pastEventItems.length} eventos</span>
        </div>

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

        {openEvent && <VistaModal event={openEvent} onClose={()=>setOpenEvent(null)} />}
      </div>
    </div>
  );
}

/* ── Noticias de la industria (full-width, 50/50) ── */
const NEWS_CATS = [
  { id:'all',           label:'Todas',          color:'var(--navy-900)' },
  { id:'microsoft',     label:'Microsoft',      color:'#0050C8' },
  { id:'google',        label:'Google',         color:'#EA4335' },
  { id:'ia',            label:'IA',             color:'#6a3ed0' },
  { id:'ciberseguridad',label:'Ciberseguridad', color:'#c0221a' },
  { id:'cloud',         label:'Cloud',          color:'#0891b2' },
  { id:'productividad', label:'Productividad',  color:'#0d8a4e' },
  { id:'automatizacion',label:'Automatización', color:'#FF6707' },
  { id:'normativas',    label:'Normativas TI',  color:'#5b6470' },
];
const NCAT = Object.fromEntries(NEWS_CATS.map(c => [c.id, c]));

const newsItems = [
  {id:1, cat:'ia',            source:'Microsoft', date:'10 Jun 2026', title:'Copilot suma agentes autónomos para automatizar flujos de trabajo en empresas'},
  {id:2, cat:'ciberseguridad',source:'ENISA',     date:'08 Jun 2026', title:'El ransomware como servicio crece un 40% y apunta a la cadena de suministro'},
  {id:3, cat:'cloud',         source:'AWS',        date:'05 Jun 2026', title:'Nuevas regiones cloud en Latinoamérica reducen la latencia para Chile'},
  {id:4, cat:'google',        source:'Google',     date:'03 Jun 2026', title:'Gemini se integra de forma nativa en Workspace para todas las cuentas business'},
  {id:5, cat:'normativas',    source:'BCN Chile',  date:'01 Jun 2026', title:'Entra en vigencia la Ley Marco de Ciberseguridad: qué deben cumplir las empresas'},
  {id:6, cat:'automatizacion',source:'Gartner',    date:'28 May 2026', title:'La hiperautomatización será prioridad de inversión TI para el 65% de las organizaciones'},
  {id:7, cat:'microsoft',     source:'Microsoft', date:'26 May 2026', title:'Windows Server 2025 refuerza la seguridad con aislamiento basado en hardware'},
  {id:8, cat:'productividad', source:'Forrester',  date:'22 May 2026', title:'Equipos que adoptan IA generativa recuperan hasta 11 horas semanales por persona'},
];

const featuredNews = {
  cat:'ciberseguridad',
  img:'/assets/news-featured.jpg',
  date:'11 Jun 2026',
  readtime:'6 min de lectura',
  title:'Ley Marco de Ciberseguridad en Chile: la guía práctica para preparar a tu empresa',
  excerpt:'Analizamos los plazos, las obligaciones por sector y los controles mínimos que tu organización debe implementar para cumplir con la nueva normativa, sin frenar la operación.',
  url:'https://www.tibox.cl/eventos',
};

export function NoticiasPanel() {
  const [filter, setFilter] = React.useState('all');
  const items = filter === 'all' ? newsItems : newsItems.filter(n => n.cat === filter);
  const fc = NCAT[featuredNews.cat];

  return (
    <div className="section-card">
      <div style={{padding:'20px 24px 0'}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--brand-cyan)',marginBottom:4}}>Al día</div>
        <div style={{fontSize:'clamp(1.3rem,2vw,1.7rem)',fontWeight:700,color:'var(--navy-900)'}}>Noticias <span style={{background:'var(--grad-title)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>de la industria</span></div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:0,marginTop:16,borderTop:'1px solid var(--gray-100)'}}>
        {/* Left: categories + news list */}
        <div style={{padding:'18px 22px',borderRight:'1px solid var(--gray-100)'}}>
          {/* Category filter */}
          <div style={{display:'flex',gap:7,flexWrap:'wrap',marginBottom:16}}>
            {NEWS_CATS.map(c => {
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
          <div style={{position:'relative'}}>
          <div style={{display:'flex',flexDirection:'column',maxHeight:450,overflowY:'auto',scrollbarWidth:'thin',scrollbarColor:'var(--gray-300) transparent',paddingRight:4}}>
            {items.map((n,idx) => {
              const c = NCAT[n.cat];
              return (
                <a key={n.id} href={featuredNews.url} target="_blank" rel="noopener noreferrer"
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
        </div>

        {/* Right: featured publication */}
        <div style={{padding:'18px 22px',display:'flex',flexDirection:'column'}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#FF6707',marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
            <Icon name="star" style={{width:13,height:13}} />Publicación destacada
          </div>
          <div style={{borderRadius:14,overflow:'hidden',position:'relative',aspectRatio:'16/9',background:'#0b1a3a',marginBottom:14}}>
            <img src={featuredNews.img} alt={featuredNews.title} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />
            <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(2,12,36,0.1),rgba(2,12,36,0.5))'}}></div>
            <span style={{position:'absolute',top:12,left:12,fontSize:10.5,fontWeight:700,color:'white',background:fc.color,borderRadius:999,padding:'4px 11px'}}>{fc.label}</span>
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
      </div>
    </div>
  );
}
