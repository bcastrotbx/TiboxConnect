import React from 'react';
import { Icon } from './shared/Icon.jsx';
import { ModalShell } from './shared/ModalShell.jsx';
import { CosmicBg } from './shared/CosmicBg.jsx';

/* ── Services V2 (full-gradient tiles) ─────────── */
const servicesV2 = [
  { id:'infra', label:'Infraestructura TI', desc:'Redes, servidores y conectividad que sostienen tu operación.', gradient:'var(--u-infra-g)', logo:'/assets/logo-infraestructura.png', icon:'network',
    detail:{
      fullName:'Infraestructura TI & NOC',
      intro:'Soporte TI integral y un Centro de Operaciones de Red (NOC) que monitorea y administra tu infraestructura para garantizar continuidad operacional.',
      groups:[
        {name:'Soporte TI',items:['Soporte onsite y remoto','Mesa de ayuda y resolución de incidentes','Servicio técnico','Gestión de infraestructura']},
        {name:'NOC — Centro de Operaciones de Red',items:['Monitoreo y administración de infraestructura TI','Administración y optimización de plataformas cloud','Administración de servidores en HA','Administración de redes y comunicaciones','Gestión de backups y Recuperación ante Desastres (DRP)','Administración y monitoreo de firewall']},
      ],
    }},
  { id:'ciber', label:'Ciberseguridad', desc:'Protección activa, auditorías y cumplimiento normativo 24/7.', gradient:'var(--u-ciber-g)', logo:'/assets/logo-ciberseguridad.png', icon:'lock',
    detail:{
      fullName:'Ciberseguridad & SOC',
      intro:'Protección activa de tu organización con un SOC que vigila, detecta y responde ante amenazas las 24 horas.',
      groups:[
        {name:'Servicios',items:['Seguridad perimetral: firewall y antivirus empresarial','Gestión y monitoreo de seguridad (SOC)','Ethical hacking y penetration testing','Inteligencia de amenazas y detección de incidentes con IA','Implementación de seguridad Zero Trust','Automatización de respuesta a incidentes (SOAR)','Seguridad en la nube (SASE)']},
      ],
    }},
  { id:'cloud', label:'Soluciones Cloud', desc:'Migraciones, arquitectura multi-cloud y soporte local cercano.', gradient:'var(--u-cloud-g)', logo:'/assets/logo-soluciones-cloud.png', icon:'cloud',
    detail:{
      fullName:'Soluciones Cloud',
      intro:'Administración, migración y optimización de tus entornos en la nube, con foco en continuidad, costos y cumplimiento.',
      groups:[
        {name:'Servicios',items:['Administración y monitoreo de máquinas virtuales','Administración de respaldos en la nube','Administración de escritorios virtuales','Disaster recovery y continuidad operativa','Migración e implementación de correos M365 & Google Workspace','Licenciamiento Microsoft 365 y Google Workspace','Gestión y soporte para entornos IaaS, PaaS y SaaS','Optimización de costos cloud (FinOps)','Cloud Security Posture Management (CSPM)']},
      ],
    }},
  { id:'analitica', label:'Analítica TI', desc:'BI, dashboards en tiempo real e inteligencia operacional.', gradient:'var(--u-analitica-g)', logo:'/assets/logo-analitica.png', icon:'trending-up',
    detail:{
      fullName:'Analítica de Datos & Inteligencia Artificial',
      intro:'Convierte tus datos en decisiones: plataformas de BI, modelos predictivos e inteligencia artificial aplicada a tu negocio.',
      groups:[
        {name:'Servicios',items:['Gestión de plataformas de BI empresarial','Consultoría en Business Intelligence (BI)','Arquitectura cloud para datos','Gobierno y gestión de datos','Analítica predictiva y modelos de machine learning','MLOps para empresas: escalabilidad de IA','Chatbot de inteligencia artificial (IA)','IA como servicio para empresas']},
      ],
    }},
  { id:'consultoria', label:'Consultoría TI', desc:'Roadmaps tecnológicos, gestión de proveedores y estrategia.', gradient:'var(--u-consultoria-g)', logo:'/assets/logo-consultoria-ti.png', icon:'layers',
    detail:{
      fullName:'Consultoría TI & Transformación Digital',
      intro:'Acompañamiento estratégico para alinear la tecnología con los objetivos de tu organización y acelerar su transformación digital.',
      groups:[
        {name:'Servicios',items:['Assessment y diagnóstico TI','Consultoría estratégica en TI y transformación digital','Optimización y mejora continua de procesos TI','Elaboración de políticas y procedimientos TI','Gestión de riesgos y cumplimiento normativo en TI','Análisis e informes de ciberataques y seguridad','Adopción de IA y automatización empresarial','Matriz de riesgos sobre activos TI']},
      ],
    }},
  { id:'smart', label:'Soluciones Inteligentes', desc:'Automatización, IA aplicada y soluciones a medida.', gradient:'var(--u-smart-g)', logo:'/assets/logo-soluciones-inteligentes.png', icon:'cpu',
    detail:{
      fullName:'Soluciones Inteligentes & Automatización',
      intro:'Desarrollo y automatización a medida: desde sitios y aplicaciones web hasta IoT, RPA y gemelos digitales.',
      groups:[
        {name:'Servicios',items:['Diseño y desarrollo de sitios web empresariales','Desarrollo de aplicaciones web','Intranet y portales corporativos en SharePoint Online','Sistemas de gestión documental en SharePoint Online','Implementación de proyectos IoT e industria 4.0','Automatización con Robotic Process Automation (RPA)','Digital Twins — gemelos digitales']},
      ],
    }},
];

/* ── Service detail modal ───────────────────────── */
function ServiceModal({ service, onClose }) {
  return (
    <ModalShell onClose={onClose} maxWidth={560}>
      <div style={{padding:'22px 26px',background:service.gradient,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',right:-26,top:-26,width:110,height:110,borderRadius:'50%',background:'rgba(255,255,255,0.1)'}}></div>
        <div style={{position:'absolute',right:50,bottom:-40,width:90,height:90,borderRadius:'50%',background:'rgba(255,255,255,0.07)'}}></div>
        <button onClick={onClose} style={{position:'absolute',top:14,right:14,background:'rgba(0,0,0,0.18)',border:'none',borderRadius:8,cursor:'pointer',color:'white',padding:6,display:'flex'}}>
          <Icon name="x" style={{width:16,height:16}} />
        </button>
        <div style={{position:'relative',display:'flex',alignItems:'center',gap:16}}>
          <img src={service.logo} alt={service.label} style={{width:56,height:56,objectFit:'contain',filter:'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',flexShrink:0}}
            onError={e=>{e.currentTarget.style.display='none';}} />
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.8)',marginBottom:4}}>Servicio TIBOX</div>
            <div style={{fontSize:19,fontWeight:700,color:'white',lineHeight:1.2}}>{service.detail.fullName}</div>
          </div>
        </div>
      </div>
      <div style={{maxHeight:'56vh',overflowY:'auto',padding:'20px 26px 24px'}}>
        <p style={{fontSize:13.5,color:'var(--gray-600)',lineHeight:1.65,margin:'0 0 16px'}}>{service.detail.intro}</p>
        {service.detail.groups.map(g=>(
          <div key={g.name} style={{marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--brand-cyan-700)',marginBottom:9}}>{g.name}</div>
            <div style={{display:'flex',flexDirection:'column',gap:7}}>
              {g.items.map((it,i)=>(
                <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                  <div style={{width:18,height:18,borderRadius:5,background:'rgba(0,80,200,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
                    <Icon name="check" style={{width:11,height:11,color:'#0050C8'}} />
                  </div>
                  <span style={{fontSize:13,color:'var(--gray-700)',lineHeight:1.45}}>{it}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={onClose} style={{
          marginTop:6,width:'100%',padding:'12px',borderRadius:10,border:'none',cursor:'pointer',
          background:'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',color:'white',
          fontSize:14,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:8,
          boxShadow:'0 2px 14px rgba(255,103,7,0.35)',transition:'transform 150ms',
        }}
          onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
          onMouseLeave={e=>e.currentTarget.style.transform='none'}
        >
          Solicita una cotización <Icon name="arrow-right" style={{width:15,height:15}} />
        </button>
      </div>
    </ModalShell>
  );
}

/* Single service row — navy + distinct cosmos background, neutral surface,
   unit color reserved for the "Conoce más" button only. */
function ServiceRow({ s, index, onOpen }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onClick={() => onOpen(s)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:'relative', overflow:'hidden', borderRadius:14, cursor:'pointer',
        background:'var(--grad-corporate)',
        border:'1px solid rgba(255,255,255,0.08)',
        boxShadow: hov ? '0 8px 22px rgba(2,18,55,0.22)' : '0 1px 4px rgba(2,18,55,0.12)',
        transform: hov ? 'translateY(-2px)' : 'none',
        transition:'box-shadow 200ms, transform 200ms',
      }}
    >
      {/* Distinct cosmos per service */}
      <CosmicBg variant={index % 3} />
      <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'linear-gradient(100deg, rgba(2,16,46,0.86) 0%, rgba(4,22,68,0.66) 60%, rgba(6,28,80,0.5) 100%)'}}></div>

      <div style={{position:'relative',display:'flex',alignItems:'center',gap:16,padding:'16px 20px'}}>
        <div style={{width:46,height:46,borderRadius:11,background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.16)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <img src={s.logo} alt={s.label} style={{width:30,height:30,objectFit:'contain'}} onError={e=>{e.currentTarget.style.display='none';}} />
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:15,fontWeight:700,color:'white',lineHeight:1.2}}>{s.label}</div>
          <div style={{fontSize:12.5,color:'rgba(255,255,255,0.68)',lineHeight:1.5,marginTop:3,display:'-webkit-box',WebkitLineClamp:1,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{s.desc}</div>
        </div>
        <button onClick={(e)=>{e.stopPropagation();onOpen(s);}} style={{
          flexShrink:0, display:'inline-flex', alignItems:'center', gap:7,
          fontSize:12.5, fontWeight:700, color:'white',
          background: s.gradient, border:'none', borderRadius:9,
          padding:'9px 18px', cursor:'pointer', whiteSpace:'nowrap',
          boxShadow: hov ? '0 4px 14px rgba(0,0,0,0.28)' : '0 2px 8px rgba(0,0,0,0.2)',
          transition:'box-shadow 180ms, transform 150ms',
        }}
          onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
          onMouseLeave={e=>e.currentTarget.style.transform='none'}
        >
          Conoce más <Icon name="arrow-right" style={{width:13,height:13}} />
        </button>
      </div>
    </div>
  );
}

export function ServicesV2() {
  const [openService, setOpenService] = React.useState(null);

  return (
    <div className="section-card">
      {/* Header — secondary, low-key */}
      <div style={{ padding:'18px 24px 14px', borderBottom:'1px solid var(--gray-100)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gray-400)', marginBottom:4 }}>También en TIBOX</div>
          <div style={{ fontSize:'clamp(1.3rem,2vw,1.7rem)', fontWeight:700, color:'var(--navy-900)' }}>Servicios <span style={{background:'var(--grad-title)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>TIBOX</span></div>
        </div>
        <button style={{ fontSize:12.5, fontWeight:600, color:'var(--gray-500)', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
          Ver todos <Icon name="arrow-right" style={{ width:14, height:14 }} />
        </button>
      </div>

      {/* Grid de servicios — 2 columnas */}
      <div style={{ padding:'16px 24px 22px', display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:10 }}>
        {servicesV2.map((s,i) => (
          <ServiceRow key={s.id} s={s} index={i} onOpen={setOpenService} />
        ))}
      </div>

      {openService && <ServiceModal service={openService} onClose={()=>setOpenService(null)} />}
    </div>
  );
}

/* ── Contact Form Section ───────────────────────── */
/* ── Map Modal ──────────────────────────────────── */
const OFFICES_MAP = {
  santiago: {
    label: 'Santiago',
    address: 'Av. Pdte. Kennedy 5600, Oficina 1506, Vitacura',
    lat: -33.4052, lng: -70.5884,
    osmEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=-70.602,-33.413,-70.574,-33.398&layer=mapnik&marker=-33.4052,-70.5884',
  },
  curico: {
    label: 'Curicó',
    address: 'Jesús Pons 421',
    lat: -34.9854, lng: -71.2392,
    osmEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=-71.252,-35.000,-71.227,-34.971&layer=mapnik&marker=-34.9854,-71.2392',
  },
  lima: {
    label: 'Lima, Miraflores',
    address: 'Grimaldo del Solar 162, URB LEURO INT. 407, Miraflores',
    lat: -12.1289, lng: -77.0267,
    osmEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=-77.042,-12.138,-77.012,-12.119&layer=mapnik&marker=-12.1289,-77.0267',
  },
};

function MapModal({ office, onClose }) {
  const o = OFFICES_MAP[office];
  if (!o) return null;
  return (
    <ModalShell onClose={onClose} maxWidth={540}>
      <div style={{padding:'18px 22px',background:'var(--grad-corporate)',position:'relative',overflow:'hidden'}}>
        <CosmicBg variant={0} />
        <div style={{position:'absolute',inset:0,background:'rgba(3,18,55,0.55)'}}></div>
        <div style={{position:'relative',display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--brand-cyan)',marginBottom:3}}>Oficina TIBOX</div>
            <div style={{fontSize:17,fontWeight:700,color:'white',lineHeight:1.2}}>{o.label}</div>
            <div style={{fontSize:12.5,color:'rgba(255,255,255,0.65)',marginTop:5,display:'flex',alignItems:'flex-start',gap:5}}>
              <Icon name="map-pin" style={{width:13,height:13,flexShrink:0,marginTop:1}} />
              <span>{o.address}</span>
            </div>
          </div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:8,cursor:'pointer',color:'white',padding:6,display:'flex',flexShrink:0}}>
            <Icon name="x" style={{width:16,height:16}} />
          </button>
        </div>
      </div>
      <div style={{height:300,overflow:'hidden'}}>
        <iframe src={o.osmEmbed} title={`Ubicación ${o.label}`}
          style={{border:'none',width:'100%',height:'100%',display:'block'}} loading="lazy"></iframe>
      </div>
      <div style={{padding:'11px 20px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'var(--gray-50)',borderTop:'1px solid var(--gray-200)'}}>
        <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11.5,color:'var(--gray-500)'}}>
          <Icon name="info" style={{width:13,height:13}} /> Mapa de referencia
        </div>
        <a href={`https://www.openstreetmap.org/?mlat=${o.lat}&mlon=${o.lng}#map=16/${o.lat}/${o.lng}`}
          target="_blank" rel="noopener noreferrer"
          style={{fontSize:12.5,fontWeight:700,color:'#0050C8',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:5}}>
          Abrir en mapa <Icon name="external-link" style={{width:13,height:13}} />
        </a>
      </div>
    </ModalShell>
  );
}

export function ContactFormSection() {
  const [form, setForm] = React.useState({ name:'', email:'', empresa:'', phone:'', servicio:'', msg:'' });
  const [sent, setSent] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [mapOffice, setMapOffice] = React.useState(null);

  const update = (k) => (e) => setForm(f => ({...f, [k]: e.target.value}));
  const inputStyle = { width:'100%', padding:'10px 13px', border:'1.5px solid var(--gray-200)', borderRadius:9, fontSize:13, fontFamily:'inherit', outline:'none', background:'white', color:'var(--gray-800)', transition:'border-color 150ms' };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  return (
    <div className="section-card" style={{ marginBottom:8 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:400 }}>
        {/* Left: dark promo */}
        <div style={{
          background:'var(--grad-corporate)', padding:'40px 40px',
          display:'flex', flexDirection:'column', justifyContent:'center', gap:24,
          position:'relative', overflow:'hidden',
        }}>
          {/* Nebula */}
          <div style={{ position:'absolute', top:-60, right:-40, width:240, height:240, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,80,200,0.3) 0%, transparent 70%)', pointerEvents:'none' }}></div>
          <div style={{ position:'absolute', bottom:-40, left:20, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle, rgba(100,20,200,0.2) 0%, transparent 70%)', pointerEvents:'none' }}></div>

          <div style={{ position:'relative' }}>
            <img src="/assets/logo-tibox.png" alt="TIBOX" style={{ height:22, marginBottom:28 }} />
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--brand-cyan)', marginBottom:12 }}>Cuéntanos tu idea</div>
            <h2 style={{ fontSize:'clamp(1.4rem,2.2vw,2rem)', fontWeight:700, color:'white', lineHeight:1.2, margin:'0 0 14px', letterSpacing:'-0.01em' }}>
              ¿Tienes algún proyecto en mente?
            </h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.65)', lineHeight:1.65, margin:'0 0 28px' }}>
              Si tienes una necesidad, iniciativa o proyecto tecnológico en evaluación, cuéntanos. Un consultor TIBOX te contactará en menos de 24 horas hábiles.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, position:'relative', alignItems:'start' }}>
            {/* CHILE */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <span style={{ fontSize:12, fontWeight:700, letterSpacing:'0.14em', color:'white' }}>CHILE</span>
                <svg width="22" height="15" viewBox="0 0 22 15" style={{ borderRadius:2, flexShrink:0 }} aria-label="Bandera de Chile">
                  <rect width="22" height="15" fill="#ffffff"></rect>
                  <rect y="7.5" width="22" height="7.5" fill="#D52B1E"></rect>
                  <rect width="7.5" height="7.5" fill="#0039A6"></rect>
                  <path d="M3.75 1.6 4.3 3.25h1.74L4.63 4.27l0.54 1.65-1.42-1.02-1.42 1.02 0.54-1.65-1.41-1.02h1.74Z" fill="#ffffff"></path>
                </svg>
              </div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.85)', letterSpacing:'0.04em', marginBottom:3 }}>Santiago</div>
                <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.65)', lineHeight:1.5 }}>Av. Pdte. Kennedy 5600, Oficina 1506, Vitacura.</div>
                <a href="#" onClick={e=>{e.preventDefault();setMapOffice('santiago');}} style={{ fontSize:12, fontWeight:600, color:'var(--brand-cyan)', textDecoration:'underline', textUnderlineOffset:3 }}>ver mapa</a>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.85)', letterSpacing:'0.04em', marginBottom:3 }}>Curicó</div>
                <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.65)', lineHeight:1.5 }}>Jesús Pons 421.</div>
                <a href="#" onClick={e=>{e.preventDefault();setMapOffice('curico');}} style={{ fontSize:12, fontWeight:600, color:'var(--brand-cyan)', textDecoration:'underline', textUnderlineOffset:3 }}>ver mapa</a>
              </div>
            </div>
            {/* PERÚ */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <span style={{ fontSize:12, fontWeight:700, letterSpacing:'0.14em', color:'white' }}>PERÚ</span>
                <svg width="22" height="15" viewBox="0 0 22 15" style={{ borderRadius:2, flexShrink:0 }} aria-label="Bandera de Perú">
                  <rect width="22" height="15" fill="#D91023"></rect>
                  <rect x="7.33" width="7.33" height="15" fill="#ffffff"></rect>
                </svg>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.85)', letterSpacing:'0.04em', marginBottom:3 }}>Lima</div>
                <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.65)', lineHeight:1.5 }}>Grimaldo del Solar 162, URB LEURO INT. 407 URB LEURO, Miraflores.</div>
                <a href="#" onClick={e=>{e.preventDefault();setMapOffice('lima');}} style={{ fontSize:12, fontWeight:600, color:'var(--brand-cyan)', textDecoration:'underline', textUnderlineOffset:3 }}>ver mapa</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div style={{ padding:'40px 40px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          {sent ? (
            <div style={{ textAlign:'center', padding:'40px 0' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(22,179,100,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px' }}>
                <Icon name="check-circle-2" style={{ width:32, height:32, color:'#0d8a4e' }} />
              </div>
              <div style={{ fontSize:20, fontWeight:700, color:'var(--navy-900)', marginBottom:8 }}>¡Mensaje enviado!</div>
              <div style={{ fontSize:14, color:'var(--gray-500)', lineHeight:1.6 }}>Un consultor TIBOX te contactará en las próximas 24 horas hábiles.</div>
              <button onClick={()=>setSent(false)} style={{ marginTop:24, fontSize:13, fontWeight:600, color:'var(--brand-cyan-700)', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>Enviar otro mensaje</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ marginBottom:4 }}>
                <div style={{ fontSize:'clamp(1.3rem,2vw,1.7rem)', fontWeight:700, color:'var(--navy-900)' }}>Cuéntanos sobre <span style={{background:'var(--grad-title)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>tu proyecto</span></div>
                <div style={{ fontSize:13, color:'var(--gray-500)', marginTop:3 }}>Todos los campos son requeridos</div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'var(--gray-600)', display:'block', marginBottom:5 }}>Nombre completo</label>
                  <input value={form.name} onChange={update('name')} placeholder="Juan Pérez" required style={inputStyle}
                    onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'}
                  />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'var(--gray-600)', display:'block', marginBottom:5 }}>Correo corporativo</label>
                  <input type="email" value={form.email} onChange={update('email')} placeholder="tu@empresa.cl" required style={inputStyle}
                    onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'}
                  />
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'var(--gray-600)', display:'block', marginBottom:5 }}>Empresa</label>
                  <input value={form.empresa} onChange={update('empresa')} placeholder="Empresa S.A." required style={inputStyle}
                    onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'}
                  />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'var(--gray-600)', display:'block', marginBottom:5 }}>Teléfono</label>
                  <input value={form.phone} onChange={update('phone')} placeholder="+56 9 XXXX XXXX" style={inputStyle}
                    onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize:12, fontWeight:600, color:'var(--gray-600)', display:'block', marginBottom:5 }}>Áreas de interés</label>
                <select value={form.servicio} onChange={update('servicio')} style={{...inputStyle, cursor:'pointer'}}>
                  <option value="">Selecciona un área…</option>
                  <option>Cloud</option>
                  <option>Ciberseguridad</option>
                  <option>Microsoft 365</option>
                  <option>Backup</option>
                  <option>IA</option>
                  <option>Automatización de procesos</option>
                  <option>Power BI y analítica</option>
                  <option>Desarrollo de aplicaciones</option>
                  <option>Intranet o SharePoint</option>
                  <option>Diseño de sitios web</option>
                  <option>Otro</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize:12, fontWeight:600, color:'var(--gray-600)', display:'block', marginBottom:5 }}>Mensaje</label>
                <textarea value={form.msg} onChange={update('msg')} placeholder="Cuéntanos en qué podemos ayudarte…" rows={3} required
                  style={{...inputStyle, resize:'vertical'}}
                  onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'}
                />
              </div>

              <button type="submit" disabled={sending} style={{
                padding:'13px', borderRadius:10, border:'none', cursor: sending?'default':'pointer',
                background: sending ? 'var(--gray-300)' : 'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',
                color:'white', fontSize:14, fontWeight:700,
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                boxShadow: sending ? 'none' : '0 4px 16px rgba(255,103,7,0.28)',
                transition:'transform 150ms, box-shadow 150ms',
              }}
                onMouseEnter={e=>{ if(!sending){ e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 22px rgba(255,103,7,0.38)'; }}}
                onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=sending?'none':'0 4px 16px rgba(255,103,7,0.28)'; }}
              >
                {sending
                  ? <React.Fragment><Icon name="loader-2" style={{width:16,height:16}} /> Enviando…</React.Fragment>
                  : <React.Fragment><Icon name="send" style={{width:16,height:16}} /> Enviar mensaje</React.Fragment>
                }
              </button>
            </form>
          )}
        </div>
      </div>
      {mapOffice && <MapModal office={mapOffice} onClose={() => setMapOffice(null)} />}
    </div>
  );
}
