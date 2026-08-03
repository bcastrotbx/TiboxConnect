import React from 'react';
import { Icon } from './shared/Icon.jsx';
import { ModalShell } from './shared/ModalShell.jsx';
import { CosmicBg } from './shared/CosmicBg.jsx';
import { LoadingState, EmptyState, ErrorState } from './shared/AsyncState.jsx';
import { CtaPrimary, CtaLink } from './shared/CtaStyles.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import * as serviceCatalogService from '../services/serviceCatalogService.js';
import * as formService from '../services/formService.js';
import * as siteSettingsService from '../services/siteSettingsService.js';
import { OpinionPanel } from './OpinionPanel.jsx';

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
  const { status, data, error } = useAsyncData(() => serviceCatalogService.getServiceCatalog(), []);
  const [openService, setOpenService] = React.useState(null);
  const services = data || [];

  return (
    <div className="section-card">
      {/* Header — secondary, low-key */}
      <div style={{ padding:'18px 24px 14px', borderBottom:'1px solid var(--gray-100)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gray-400)', marginBottom:4 }}>También en TIBOX</div>
          <div style={{ fontSize:'clamp(1.3rem,2vw,1.7rem)', fontWeight:700, color:'var(--navy-900)' }}>Servicios <span style={{background:'var(--grad-title)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>TIBOX</span></div>
        </div>
        <CtaLink as="a" href="https://www.tibox.cl/servicios-ti-empresas/" target="_blank" rel="noopener noreferrer">
          Ver todos <Icon name="arrow-right" style={{ width:13, height:13 }} />
        </CtaLink>
      </div>

      {/* Grid de servicios — 2 columnas */}
      {status === 'loading' && <LoadingState label="Cargando servicios…" />}
      {status === 'error' && <ErrorState label="No pudimos cargar el catálogo de servicios." error={error} />}
      {status === 'success' && services.length === 0 && <EmptyState label="No hay servicios para mostrar todavía." icon="briefcase" />}
      {status === 'success' && services.length > 0 && (
        <div style={{ padding:'16px 24px 22px', display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:10 }}>
          {services.map((s,i) => (
            <ServiceRow key={s.id} s={s} index={i} onOpen={setOpenService} />
          ))}
        </div>
      )}

      {openService && <ServiceModal service={openService} onClose={()=>setOpenService(null)} />}
    </div>
  );
}

/* ── Contact Form Section ───────────────────────── */
// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): antes esta sección
// tenía a la izquierda el logo + datos de oficinas Chile/Perú y a la derecha
// el formulario. Ahora la izquierda lleva el título, el texto y el
// formulario completo (se quitaron las oficinas y, con ellas, el MapModal y
// serviceCatalogService.getOffices(), que ya no tienen ningún consumidor en
// este componente); la derecha pasó a ser el bloque de "Tu Opinión"
// (OpinionPanel), que dejó de ser una sección aparte de la página. Como
// ambas columnas quedan sobre el mismo fondo oscuro (grad-corporate), las
// etiquetas y el texto de ayuda del formulario se ajustaron a colores claros
// para mantener contraste (antes vivían sobre fondo blanco).
// Ajuste posterior (Portada real): título/descripción/CTA del formulario
// ahora vienen de site_settings (editables desde /admin/portada → tab
// Contacto) en vez de estar hardcodeados acá. Se mantienen los mismos
// textos como fallback mientras carga o si falla la consulta, para no
// dejar la sección en blanco.
const CONTACT_FALLBACK = {
  title: '¿Tienes algún proyecto en mente?',
  description: 'Si tienes una necesidad, iniciativa o proyecto tecnológico en evaluación, cuéntanos. Un consultor TIBOX te contactará en menos de 24 horas hábiles.',
  ctaText: 'Enviar mensaje',
};

export function ContactFormSection() {
  const [form, setForm] = React.useState({ name:'', email:'', empresa:'', phone:'', msg:'' });
  const [sent, setSent] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [privacyAccepted, setPrivacyAccepted] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');
  const { data: settingsData } = useAsyncData(() => siteSettingsService.getContactSettings(), []);
  const settings = { ...CONTACT_FALLBACK, ...settingsData };

  const update = (k) => (e) => setForm(f => ({...f, [k]: e.target.value}));
  const inputStyle = { width:'100%', padding:'10px 13px', border:'1.5px solid var(--gray-200)', borderRadius:9, fontSize:13, fontFamily:'inherit', outline:'none', background:'white', color:'var(--gray-800)', transition:'border-color 150ms' };
  const labelStyle = { fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.75)', display:'block', marginBottom:5 };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setSubmitError('');
    formService.submitContactForm(form)
      .then(() => { setSending(false); setSent(true); })
      .catch(() => { setSending(false); setSubmitError('No pudimos enviar tu mensaje. Inténtalo nuevamente.'); });
  };

  return (
    <div style={{
      marginBottom:8, position:'relative', overflow:'hidden', borderRadius:16,
      background:'var(--grad-corporate)', boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
    }}>
      {/* Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): Contacto y
          Feedback pasaron de ser dos tarjetas independientes a un solo
          contenedor con fondo compartido, replicando el patrón de
          "Tendencias de la industria" (NoticiasPanel): un único bloque,
          dividido internamente por una línea sutil (.contact-col-form en
          index.css) en vez de bordes/sombras propios por columna. El
          CosmicBg y el overlay ahora son compartidos por ambas columnas en
          vez de duplicarse. La proporción 60/40 y el apilado en móvil viven
          en .contact-grid (index.css). */}
      <CosmicBg variant={0} />
      <div style={{position:'absolute',inset:0,background:'linear-gradient(120deg, rgba(2,16,46,0.82), rgba(5,24,72,0.55))',pointerEvents:'none'}}></div>
      <div className="contact-grid" style={{ position:'relative' }}>
        {/* Left: formulario — 60% */}
        <div className="contact-col-form" style={{
          padding:'32px 36px',
          display:'flex', flexDirection:'column', justifyContent:'center', gap:16,
          position:'relative',
        }}>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--brand-cyan)', marginBottom:8 }}>Contacto</div>
            <h2 style={{ fontSize:'clamp(1.4rem,2.2vw,2rem)', fontWeight:700, color:'white', lineHeight:1.2, margin:'0 0 8px', letterSpacing:'-0.01em' }}>
              {settings.title}
            </h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.65)', lineHeight:1.55, margin:0 }}>
              {settings.description}
            </p>
          </div>

          {sent ? (
            <div style={{ position:'relative', textAlign:'center', padding:'20px 0' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(22,179,100,0.16)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <Icon name="check-circle-2" style={{ width:28, height:28, color:'#3ddc8a' }} />
              </div>
              <div style={{ fontSize:18, fontWeight:700, color:'white', marginBottom:6 }}>¡Mensaje enviado!</div>
              <div style={{ fontSize:13.5, color:'rgba(255,255,255,0.65)', lineHeight:1.6 }}>Un consultor TIBOX te contactará en las próximas 24 horas hábiles.</div>
              <button onClick={()=>setSent(false)} style={{ marginTop:20, fontSize:13, fontWeight:600, color:'var(--brand-cyan)', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>Enviar otro mensaje</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ position:'relative', display:'flex', flexDirection:'column', gap:10 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={labelStyle}>Nombre completo</label>
                  <input value={form.name} onChange={update('name')} placeholder="Juan Pérez" required style={inputStyle}
                    onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Correo corporativo</label>
                  <input type="email" value={form.email} onChange={update('email')} placeholder="tu@empresa.cl" required style={inputStyle}
                    onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'}
                  />
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={labelStyle}>Empresa</label>
                  <input value={form.empresa} onChange={update('empresa')} placeholder="Empresa S.A." required style={inputStyle}
                    onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Teléfono</label>
                  <input value={form.phone} onChange={update('phone')} placeholder="+56 9 XXXX XXXX" style={inputStyle}
                    onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Mensaje</label>
                <textarea value={form.msg} onChange={update('msg')} placeholder="Cuéntanos en qué podemos ayudarte…" rows={2} required
                  style={{...inputStyle, resize:'vertical', minHeight:56}}
                  onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'}
                />
              </div>

              <label style={{display:'flex',gap:9,alignItems:'flex-start',cursor:'pointer',fontSize:12.5,color:'rgba(255,255,255,0.65)',lineHeight:1.4}}>
                <input type="checkbox" checked={privacyAccepted} onChange={e=>setPrivacyAccepted(e.target.checked)} required
                  style={{width:16,height:16,marginTop:1,accentColor:'#FF6707',cursor:'pointer',flexShrink:0}} />
                <span>He leído y acepto el <a href="https://www.tibox.cl/aviso-de-privacidad/" target="_blank" rel="noopener noreferrer" style={{color:'var(--brand-cyan)',fontWeight:600}}>Aviso de Privacidad / Información del titular</a>.</span>
              </label>

              {submitError && <div style={{fontSize:12.5,color:'#ff8a8a'}}>{submitError}</div>}

              <CtaPrimary type="submit" disabled={sending || !privacyAccepted}>
                {sending
                  ? <React.Fragment><Icon name="loader-2" style={{width:16,height:16}} /> Enviando…</React.Fragment>
                  : <React.Fragment><Icon name="send" style={{width:16,height:16}} /> {settings.ctaText}</React.Fragment>
                }
              </CtaPrimary>
            </form>
          )}
        </div>

        {/* Right: "Tu Opinión" — antes era su propia sección, ver comentario arriba — 40% */}
        <OpinionPanel />
      </div>
    </div>
  );
}
