import React from 'react';
import { Icon } from './shared/Icon.jsx';
import { CtaPrimary } from './shared/CtaStyles.jsx';
import * as formService from '../services/formService.js';

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): este panel ya no
// tiene su propia tarjeta (fondo/radio/CosmicBg) — ahora es la columna
// derecha de un único contenedor compartido con Contacto
// (ContactFormSection en Services.jsx), replicando el patrón de "Tendencias
// de la industria" (un solo bloque con fondo común, dividido por una línea
// sutil, no dos tarjetas independientes). El fondo lo pone el contenedor
// padre; este componente aporta su propio padding (para que coincida con el
// de la columna de Contacto) y contenido. Las estrellas de calificación se
// movieron del bloque principal al popup: de entrada solo se ve título,
// texto y el botón.
export function OpinionPanel() {
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);
  const [form, setForm] = React.useState({name:'',email:'',msg:''});
  const [sent, setSent] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setSubmitError('');
    formService.submitOpinionForm({ ...form, rating }).then(() => {
      setSending(false);
      setSent(true);
      setTimeout(()=>{setShowModal(false);setSent(false);setForm({name:'',email:'',msg:''});setRating(0);},1800);
    }).catch(() => {
      setSending(false);
      setSubmitError('No pudimos enviar tu opinión. Inténtalo nuevamente.');
    });
  };

  return (
    <div id="section-opinion" style={{position:'relative',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',padding:'32px 36px'}}>
      <div style={{position:'relative'}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--brand-cyan)',marginBottom:8}}>Feedback</div>
        <h2 style={{fontSize:'clamp(1.4rem,2.2vw,2rem)',fontWeight:700,color:'white',lineHeight:1.2,margin:'0 0 8px',letterSpacing:'-0.01em'}}>
          <span style={{background:'var(--grad-title)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>Tu Opinión</span> nos ayuda a mejorar
        </h2>
        <p style={{fontSize:14,color:'rgba(255,255,255,0.65)',lineHeight:1.55,margin:'0 0 18px'}}>
          Cuéntanos qué te parece el portal Tibox Connect. Tu feedback orienta el contenido y la experiencia que construimos para tu empresa.
        </p>
        <CtaPrimary onClick={()=>setShowModal(true)}>
          <Icon name="message-circle" style={{width:15,height:15}} />
          Enviar mi opinión
        </CtaPrimary>
      </div>

      {showModal && (
        <div style={{position:'fixed',inset:0,zIndex:500,background:'rgba(2,18,51,0.5)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}} onClick={()=>setShowModal(false)}>
          <div style={{background:'white',borderRadius:20,padding:'32px 36px',width:'100%',maxWidth:440,boxShadow:'0 24px 64px rgba(0,0,0,0.2)'}} onClick={e=>e.stopPropagation()}>
            {sent ? (
              <div style={{textAlign:'center',padding:'24px 0'}}>
                <div style={{width:60,height:60,borderRadius:'50%',background:'rgba(22,179,100,0.12)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
                  <Icon name="check" style={{width:30,height:30,color:'#0d8a4e'}} />
                </div>
                <div style={{fontSize:18,fontWeight:700,color:'var(--navy-900)'}}>¡Gracias por tu opinión!</div>
                <div style={{fontSize:14,color:'var(--gray-500)',marginTop:8}}>Tu feedback ha sido recibido y será revisado por nuestro equipo.</div>
              </div>
            ) : (
              <React.Fragment>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}>
                  <div>
                    <div style={{fontSize:18,fontWeight:700,color:'var(--navy-900)'}}>Comparte tu experiencia</div>
                    <div style={{fontSize:13,color:'var(--gray-500)',marginTop:3}}>Ayúdanos a mejorar el portal Connect</div>
                  </div>
                  <button onClick={()=>setShowModal(false)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--gray-400)',padding:4}}>
                    <Icon name="x" style={{width:18,height:18}} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
                  {/* Estrellas de calificación: antes vivían en el bloque
                      principal, ahora quedan dentro del popup junto al resto
                      del formulario (ver ajuste posterior). */}
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:7}}>
                    <label style={{fontSize:12,fontWeight:600,color:'var(--gray-600)'}}>Tu calificación</label>
                    <div style={{display:'flex',gap:8}}>
                      {[1,2,3,4,5].map(i=>(
                        <button key={i} type="button"
                          onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(0)}
                          onClick={()=>setRating(i)}
                          style={{background:'none',border:'none',cursor:'pointer',padding:2,transform: (hover>=i || rating>=i) ? 'scale(1.15)' : 'scale(1)',transition:'transform 150ms'}}
                        >
                          <svg width="26" height="26" viewBox="0 0 24 24" style={{display:'block',fill:(hover>=i||rating>=i)?'var(--brand-yellow)':'none',stroke:(hover>=i||rating>=i)?'var(--brand-yellow)':'var(--gray-300)',strokeWidth:1.75,strokeLinecap:'round',strokeLinejoin:'round',transition:'fill 150ms, stroke 150ms'}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </button>
                      ))}
                    </div>
                    <div style={{fontSize:12,color:'var(--gray-500)',textAlign:'center',minHeight:16}}>
                      {rating>0 ? (rating<=2?'Lamentamos tu experiencia. Cuéntanos más.':rating<=3?'Gracias por tu feedback.':'¡Gracias! Nos alegra que disfrutes el portal.') : 'Califica tu experiencia'}
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    <div>
                      <label style={{fontSize:12,fontWeight:600,color:'var(--gray-600)',display:'block',marginBottom:5}}>Nombre</label>
                      <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Tu nombre"
                        style={{width:'100%',padding:'9px 12px',border:'1.5px solid var(--gray-200)',borderRadius:8,fontSize:13,outline:'none',fontFamily:'inherit',transition:'border-color 150ms'}}
                        onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'}
                      />
                    </div>
                    <div>
                      <label style={{fontSize:12,fontWeight:600,color:'var(--gray-600)',display:'block',marginBottom:5}}>Email</label>
                      <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="tu@empresa.cl"
                        style={{width:'100%',padding:'9px 12px',border:'1.5px solid var(--gray-200)',borderRadius:8,fontSize:13,outline:'none',fontFamily:'inherit',transition:'border-color 150ms'}}
                        onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{fontSize:12,fontWeight:600,color:'var(--gray-600)',display:'block',marginBottom:5}}>Tu opinión</label>
                    <textarea value={form.msg} onChange={e=>setForm(f=>({...f,msg:e.target.value}))} placeholder="Cuéntanos qué mejorarías o qué te ha gustado…" rows={4}
                      style={{width:'100%',padding:'9px 12px',border:'1.5px solid var(--gray-200)',borderRadius:8,fontSize:13,outline:'none',fontFamily:'inherit',resize:'vertical',transition:'border-color 150ms'}}
                      onFocus={e=>e.target.style.borderColor='#0050C8'} onBlur={e=>e.target.style.borderColor='var(--gray-200)'}
                    />
                  </div>
                  {submitError && <div style={{fontSize:12.5,color:'#c0392b'}}>{submitError}</div>}
                  <CtaPrimary type="submit" disabled={sending} style={{width:'100%'}}>
                    {sending ? 'Enviando…' : 'Enviar opinión'}
                  </CtaPrimary>
                </form>
              </React.Fragment>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
