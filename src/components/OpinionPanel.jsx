import React from 'react';
import { Icon } from './shared/Icon.jsx';
import { CosmicBg } from './shared/CosmicBg.jsx';
import * as formService from '../services/formService.js';

/* ── Opinión panel (unchanged) ──────────────────── */
export function OpinionPanel() {
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);
  const [form, setForm] = React.useState({name:'',email:'',msg:''});
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    formService.submitOpinionForm({ ...form, rating }).then(() => {
      setSent(true);
      setTimeout(()=>{setShowModal(false);setSent(false);setForm({name:'',email:'',msg:''});setRating(0);},1800);
    });
  };

  return (
    <div className="section-card" style={{position:'relative',overflow:'hidden',background:'var(--grad-corporate)'}}>
      <CosmicBg variant={0} />
      <div style={{position:'absolute',inset:0,background:'linear-gradient(120deg, rgba(2,16,46,0.82), rgba(5,24,72,0.55))',pointerEvents:'none'}}></div>

      <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'28px 40px',flexWrap:'wrap',padding:'26px 36px'}}>
        {/* Left: invitation */}
        <div style={{display:'flex',alignItems:'center',gap:20,minWidth:0,flex:'1 1 360px'}}>
          <img src="/assets/mark-cube.png" alt="TIBOX" style={{width:54,height:54,objectFit:'contain',flexShrink:0}} />
          <div style={{minWidth:0}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--brand-cyan)',marginBottom:4}}>Feedback</div>
            <div style={{fontSize:'clamp(1.3rem,2vw,1.7rem)',fontWeight:700,color:'white',lineHeight:1.15,marginBottom:5}}>Tu <span style={{background:'var(--grad-title)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>Opinión</span> nos ayuda a mejorar</div>
            <div style={{fontSize:13.5,color:'rgba(255,255,255,0.72)',lineHeight:1.5,maxWidth:440}}>Cuéntanos qué te parece el portal Tibox Connect. Tu feedback orienta el contenido y la experiencia que construimos para tu empresa.</div>
          </div>
        </div>

        {/* Right: rating + CTA */}
        <div style={{display:'flex',alignItems:'center',gap:'18px 28px',flexWrap:'wrap'}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:7}}>
            <div style={{display:'flex',gap:8}}>
              {[1,2,3,4,5].map(i=>(
                <button key={i}
                  onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(0)}
                  onClick={()=>setRating(i)}
                  style={{background:'none',border:'none',cursor:'pointer',padding:2,transform: (hover>=i || rating>=i) ? 'scale(1.15)' : 'scale(1)',transition:'transform 150ms'}}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" style={{display:'block',fill:(hover>=i||rating>=i)?'var(--brand-yellow)':'none',stroke:(hover>=i||rating>=i)?'var(--brand-yellow)':'rgba(255,255,255,0.45)',strokeWidth:1.75,strokeLinecap:'round',strokeLinejoin:'round',transition:'fill 150ms, stroke 150ms'}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </button>
              ))}
            </div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.78)',textAlign:'center',minHeight:16}}>
              {rating>0 ? (rating<=2?'Lamentamos tu experiencia. Cuéntanos más.':rating<=3?'Gracias por tu feedback.':'¡Gracias! Nos alegra que disfrutes el portal.') : 'Califica tu experiencia'}
            </div>
          </div>
          <button onClick={()=>setShowModal(true)} style={{
            display:'inline-flex',alignItems:'center',gap:8,fontSize:13.5,fontWeight:700,color:'white',
            background:'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',border:'none',
            borderRadius:11,padding:'13px 26px',cursor:'pointer',whiteSpace:'nowrap',
            boxShadow:'0 0 0 1px rgba(255,140,58,0.4), 0 2px 14px rgba(255,103,7,0.5), 0 0 24px rgba(255,103,7,0.3)',
            transition:'transform 150ms,box-shadow 150ms',
          }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 0 0 1px rgba(255,140,58,0.5), 0 4px 20px rgba(255,103,7,0.6), 0 0 32px rgba(255,103,7,0.45)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 0 0 1px rgba(255,140,58,0.4), 0 2px 14px rgba(255,103,7,0.5), 0 0 24px rgba(255,103,7,0.3)';}}
          >
            <Icon name="message-circle" style={{width:15,height:15}} />
            Enviar mi opinión
          </button>
        </div>
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
                  <button type="submit" style={{width:'100%',padding:'12px',borderRadius:10,border:'none',cursor:'pointer',background:'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',color:'white',fontSize:14,fontWeight:700,boxShadow:'0 2px 14px rgba(255,103,7,0.35)',transition:'transform 150ms'}}
                    onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='none'}
                  >Enviar opinión</button>
                </form>
              </React.Fragment>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
