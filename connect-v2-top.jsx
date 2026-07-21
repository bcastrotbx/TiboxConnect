// Tibox Connect v2 — Top: CosmicBg2, ModalShell, HeroSlider, CategoryBlocks, OpinionPanel, ContentGrid

/* ── Cosmic / Universe SVG backgrounds (used by modals & services) ── */
function CosmicBg2({ variant = 0 }) {
  const uid = React.useId().replace(/:/g, '');
  const stars = React.useMemo(() => {
    let s = 71 + variant * 137; const r = () => { s=(s*9301+49297)%233280; return s/233280; };
    return Array.from({length:140},()=>({x:r()*100,y:r()*100,rad:r()*1.4+0.2,o:r()*0.7+0.12,c:r()>0.85?'#9fd4ff':'white'}));
  },[variant]);

  const PAL = [
    { neb:[['72%','35%','55%','#0a63d6',0.4],['12%','72%','45%','#163a8a',0.34],['46%','6%','38%','#00c8fa',0.18]] },
    { neb:[['32%','42%','50%','#1d4ed8',0.42],['82%','28%','42%','#0891b2',0.3],['58%','86%','40%','#3b1f8a',0.24]] },
    { neb:[['86%','70%','55%','#0050c8',0.45],['18%','24%','40%','#0ea5e9',0.3],['50%','100%','45%','#11235e',0.4]] },
  ];
  const pal = PAL[variant % PAL.length];

  return (
    <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}} preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {pal.neb.map((n,i)=>(
          <radialGradient key={i} id={`${uid}n${i}`} cx={n[0]} cy={n[1]} r={n[2]}>
            <stop offset="0%" stopColor={n[3]} stopOpacity={n[4]}/>
            <stop offset="100%" stopColor={n[3]} stopOpacity="0"/>
          </radialGradient>
        ))}
        <radialGradient id={`${uid}gal`} cx="32%" cy="42%" r="44%">
          <stop offset="0%" stopColor="#cfe6ff" stopOpacity="0.6"/>
          <stop offset="28%" stopColor="#3f7bd6" stopOpacity="0.35"/>
          <stop offset="65%" stopColor="#1b2f6b" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#1b2f6b" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`${uid}planet`} cx="40%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#2b6fd6" stopOpacity="1"/>
          <stop offset="60%" stopColor="#10306e" stopOpacity="1"/>
          <stop offset="100%" stopColor="#050f2e" stopOpacity="1"/>
        </radialGradient>
        <radialGradient id={`${uid}rim`} cx="78%" cy="78%" r="62%">
          <stop offset="68%" stopColor="#00c8fa" stopOpacity="0"/>
          <stop offset="90%" stopColor="#3fd0ff" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#3fd0ff" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {pal.neb.map((n,i)=><rect key={i} width="100%" height="100%" fill={`url(#${uid}n${i})`}/>)}

      {variant===1 && (
        <g transform="rotate(-22 270 150)" opacity="0.85">
          <ellipse cx="270" cy="150" rx="260" ry="78" fill={`url(#${uid}gal)`}/>
          <ellipse cx="270" cy="150" rx="150" ry="40" fill={`url(#${uid}gal)`}/>
          <circle cx="270" cy="150" r="6" fill="#ffffff" fillOpacity="0.9"/>
        </g>
      )}
      {variant===2 && (
        <g>
          <circle cx="86%" cy="118%" r="190" fill={`url(#${uid}planet)`}/>
          <circle cx="86%" cy="118%" r="190" fill={`url(#${uid}rim)`}/>
        </g>
      )}

      {stars.map((s,i)=><circle key={i} cx={s.x+'%'} cy={s.y+'%'} r={s.rad} fill={s.c} fillOpacity={s.o}/>)}
      <circle cx="10%" cy="18%" r="1.8" fill="#00C8FA" fillOpacity="0.75"/>
      <circle cx="82%" cy="22%" r="1.6" fill="white"   fillOpacity="0.9"/>
      <circle cx="60%" cy="14%" r="2.0" fill="#a8d8ff" fillOpacity="0.65"/>
    </svg>
  );
}

/* ── Reusable modal shell ───────────────────────── */
function ModalShell({ onClose, children, maxWidth = 460 }) {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div style={{
      position:'fixed',inset:0,zIndex:600,
      background:'rgba(2,18,51,0.55)',backdropFilter:'blur(4px)',
      display:'flex',alignItems:'center',justifyContent:'center',padding:24,
      animation:'tbxFade 160ms ease-out',
    }} onClick={onClose}>
      <div style={{
        background:'white',borderRadius:20,
        width:'100%',maxWidth,maxHeight:'90vh',overflowY:'auto',
        boxShadow:'0 24px 64px rgba(0,0,0,0.28)',
        animation:'tbxPop 180ms cubic-bezier(0.2,0.8,0.3,1)',
      }} onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/* ── Hero Slider ────────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    eyebrow: 'INFOGRAFÍAS',
    title: 'Información que se',
    titleAccent: 'entiende al instante',
    desc: 'Piezas visuales, simples y fáciles de compartir sobre ciberseguridad, cloud y productividad — seleccionadas por nuestros expertos.',
    cta: 'Ver infografías',
    ctaIcon: 'layout-grid',
    tag: 'Contenido visual',
    bg: window.__res('heroSlide1','assets/hero-slider-1.jpg'),
  },
  {
    id: 2,
    eyebrow: 'NOTICIAS DE LA INDUSTRIA',
    title: 'Mantente al día con',
    titleAccent: 'el sector tecnológico',
    desc: 'Las novedades de Microsoft, Google, cloud, IA, ciberseguridad y normativas TI que impactan a tu organización, en un solo lugar.',
    cta: 'Leer noticias',
    ctaIcon: 'rss',
    tag: 'Actualidad TI',
    bg: window.__res('heroSlide2','assets/hero-slider-2.jpg'),
  },
  {
    id: 3,
    eyebrow: 'PRÓXIMOS EVENTOS',
    title: 'Conecta con',
    titleAccent: 'expertos TI',
    desc: 'Webinars, talleres presenciales y demos en vivo con especialistas en infraestructura, cloud, ciberseguridad y automatización.',
    cta: 'Ver agenda completa',
    ctaIcon: 'calendar',
    tag: 'Eventos & Webinars',
    bg: window.__res('heroSlide3','assets/hero-slider-3.jpg'),
  },
  {
    id: 4,
    eyebrow: 'TU OPINIÓN CUENTA',
    title: 'Queremos saber',
    titleAccent: 'tu opinión',
    desc: 'Tu experiencia guía la evolución de TIBOX Connect. Cuéntanos qué contenido te sirve y qué te gustaría ver en el portal.',
    cta: 'Compartir mi opinión',
    ctaIcon: 'message-circle',
    tag: 'Feedback',
    bg: window.__res('heroUniverse','assets/hero-universe.jpg'),
  },
];

function HeroSlider() {
  const [cur, setCur] = React.useState(0);
  const total = SLIDES.length;
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const go = React.useCallback((dir) => { setCur(c => (c + dir + total) % total); }, [total]);
  React.useEffect(() => {
    const id = setInterval(() => go(1), 5500);
    return () => clearInterval(id);
  }, [go]);

  const slide = SLIDES[cur];

  return (
    <div style={{
      borderRadius: 18, overflow: 'hidden',
      background: 'var(--grad-corporate)',
      position: 'relative', height: 360,
      padding: '40px 52px', color: 'white',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}>
      {/* Real background image per slide */}
      <img key={cur} src={slide.bg} alt="" style={{
        position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',
        animation:'tbxFade 600ms ease-out',
      }} />
      {/* Blue tonal overlay for legibility — stronger toward the text side */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',
        background:'linear-gradient(100deg, rgba(2,16,46,0.9) 0%, rgba(4,22,68,0.74) 46%, rgba(6,28,80,0.42) 100%)'}}></div>
      <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'rgba(3,20,60,0.12)'}}></div>
      {/* Right glow */}
      <div style={{position:'absolute',top:-40,right:40,width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,200,250,0.16) 0%,transparent 70%)',pointerEvents:'none'}}></div>

      <div style={{position:'relative',display:'grid',gridTemplateColumns:'1fr 220px',gap:32,alignItems:'center'}}>
        {/* Text */}
        <div key={cur} style={{animation:'tbxFade 500ms ease-out'}}>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:8,marginBottom:16,
            background:'rgba(255,255,255,0.12)',borderRadius:999,padding:'4px 14px',
            border:'1px solid rgba(255,255,255,0.2)',
          }}>
            <div style={{width:5,height:5,borderRadius:'50%',background:'var(--brand-cyan)',boxShadow:'0 0 6px var(--brand-cyan)'}}></div>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:'0.16em'}}>{slide.eyebrow}</span>
            <span style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>·</span>
            <span style={{fontSize:11,color:'rgba(255,255,255,0.6)',fontWeight:500}}>{slide.tag}</span>
          </div>
          <h1 style={{fontSize:'clamp(1.7rem,2.8vw,2.5rem)',fontWeight:700,lineHeight:1.12,margin:'0 0 14px',letterSpacing:'-0.02em',color:'white'}}>
            {slide.title}{' '}
            <span style={{background:'var(--grad-title)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>
              {slide.titleAccent}
            </span>
          </h1>
          <p style={{fontSize:15,color:'rgba(255,255,255,0.78)',lineHeight:1.65,maxWidth:500,margin:'0 0 26px'}}>
            {slide.desc}
          </p>
          <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
            <button style={{
              display:'inline-flex',alignItems:'center',gap:8,
              background:'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',
              color:'white',
              fontSize:14,fontWeight:700,padding:'11px 22px',
              borderRadius:10,border:'none',cursor:'pointer',
              boxShadow:'0 0 0 1px rgba(255,140,58,0.4), 0 2px 14px rgba(255,103,7,0.5), 0 0 26px rgba(255,103,7,0.35)',
              transition:'transform 150ms, box-shadow 200ms',
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 0 0 1px rgba(255,140,58,0.5), 0 4px 20px rgba(255,103,7,0.6), 0 0 34px rgba(255,103,7,0.5)';}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 0 0 1px rgba(255,140,58,0.4), 0 2px 14px rgba(255,103,7,0.5), 0 0 26px rgba(255,103,7,0.35)';}}
            >
              <i data-lucide={slide.ctaIcon} style={{width:15,height:15}}></i>
              {slide.cta}
            </button>
          </div>
        </div>

        {/* Slide counter & indicators */}
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',justifyContent:'space-between',height:'100%',gap:20}}>
          <div style={{fontSize:40,fontWeight:700,color:'rgba(255,255,255,0.16)',lineHeight:1,fontVariantNumeric:'tabular-nums'}}>
            {String(cur+1).padStart(2,'0')}<span style={{fontSize:20,color:'rgba(255,255,255,0.1)'}}>/0{total}</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10,alignItems:'flex-end'}}>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>go(-1)} style={heroArrow}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
              ><i data-lucide="chevron-left" style={{width:16,height:16}}></i></button>
              <button onClick={()=>go(1)} style={heroArrow}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
              ><i data-lucide="chevron-right" style={{width:16,height:16}}></i></button>
            </div>
            <div style={{display:'flex',gap:7,alignItems:'center'}}>
              {SLIDES.map((_,i)=>(
                <button key={i} onClick={()=>setCur(i)} style={{
                  width: i===cur ? 20 : 7, height:7,
                  borderRadius:999, border:'none', cursor:'pointer', padding:0,
                  background: i===cur ? 'var(--brand-cyan)' : 'rgba(255,255,255,0.35)',
                  transition:'all 300ms',
                }}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const heroArrow = {
  width:38,height:38,borderRadius:'50%',
  background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',
  color:'white',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
  transition:'background 150ms',
};

/* ── Category Blocks (unchanged) ────────────────── */
const CAT_BLUE = 'linear-gradient(135deg, #06246a 0%, #0a63d6 58%, #00c8fa 100%)';
const CATS = [
  { id:'explora',   icon:'film',           label:'Explora',       sub:'Videos y Webinars',  count:'240+ recursos',   scrollTarget:'videos'  },
  { id:'noticias',  icon:'rss',            label:'Noticias',      sub:'Sector Tecnológico', count:'Actualizado hoy', scrollTarget:'news'    },
  { id:'eventos',   icon:'calendar-check', label:'Eventos',       sub:'Agenda y Webinars',  count:'8 próximos',      scrollTarget:'events'  },
  { id:'opinion',   icon:'message-circle', label:'Tu Opinión',    sub:'Comparte tu voz',    count:'Nuevo: encuesta', scrollTarget:'opinion' },
];

function CategoryBlocks() {
  const [hov, setHov] = React.useState(null);
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
      {CATS.map(c=>(
        <div key={c.id}
          onMouseEnter={()=>setHov(c.id)} onMouseLeave={()=>setHov(null)}
          onClick={()=>window.scrollToSection&&window.scrollToSection(c.scrollTarget)}
          style={{
            borderRadius:14,overflow:'hidden',cursor:'pointer',
            transform: hov===c.id ? 'translateY(-3px)' : 'none',
            boxShadow: hov===c.id ? '0 8px 24px rgba(0,0,0,0.13)' : '0 1px 4px rgba(0,0,0,0.07)',
            transition:'all 200ms',
          }}
        >
          <div style={{height:72,background:CAT_BLUE,display:'flex',alignItems:'center',padding:'0 20px',position:'relative',overflow:'hidden'}}>
            <div style={{width:40,height:40,borderRadius:10,background:'rgba(255,255,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <i data-lucide={c.icon} style={{width:20,height:20,color:'white'}}></i>
            </div>
            <div style={{position:'absolute',right:-16,top:-16,width:72,height:72,borderRadius:'50%',background:'rgba(255,255,255,0.07)'}}></div>
          </div>
          <div style={{background:'white',padding:'14px 18px 16px'}}>
            <div style={{fontSize:15,fontWeight:700,color:'var(--navy-900)',marginBottom:2}}>{c.label}</div>
            <div style={{fontSize:12,color:'var(--gray-500)',marginBottom:8}}>{c.sub}</div>
            <div style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,fontWeight:700,color:'var(--gray-500)',background:'var(--gray-100)',borderRadius:999,padding:'3px 9px'}}>
              <i data-lucide="sparkles" style={{width:11,height:11}}></i>
              {c.count}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Opinión panel (unchanged) ──────────────────── */
function OpinionPanel() {
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);
  const [form, setForm] = React.useState({name:'',email:'',msg:''});
  const [sent, setSent] = React.useState(false);
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(()=>{setShowModal(false);setSent(false);setForm({name:'',email:'',msg:''});setRating(0);},1800);
  };

  return (
    <div className="section-card" style={{position:'relative',overflow:'hidden',background:'var(--grad-corporate)'}}>
      <CosmicBg2 variant={0} />
      <div style={{position:'absolute',inset:0,background:'linear-gradient(120deg, rgba(2,16,46,0.82), rgba(5,24,72,0.55))',pointerEvents:'none'}}></div>

      <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'28px 40px',flexWrap:'wrap',padding:'26px 36px'}}>
        {/* Left: invitation */}
        <div style={{display:'flex',alignItems:'center',gap:20,minWidth:0,flex:'1 1 360px'}}>
          <img src={window.__res("markCube","assets/mark-cube.png")} alt="TIBOX" style={{width:54,height:54,objectFit:'contain',flexShrink:0}} />
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
            <i data-lucide="message-circle" style={{width:15,height:15}}></i>
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
                  <i data-lucide="check" style={{width:30,height:30,color:'#0d8a4e'}}></i>
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
                    <i data-lucide="x" style={{width:18,height:18}}></i>
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

/* ── ContentGrid: stacked full-width sections + (Próximos | Realizados) events row ── */
function ContentGrid() {
  const { ExploraPanel, InfographicsPanel, NoticiasPanel, EventosPanel, EventosRealizadosPanel } = window;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      <div id="section-videos">{ExploraPanel && <ExploraPanel />}</div>
      <div id="section-infographics">{InfographicsPanel && <InfographicsPanel />}</div>
      <div id="section-news">{NoticiasPanel && <NoticiasPanel />}</div>
      <div id="section-events" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,alignItems:'stretch'}}>
        {EventosPanel && <EventosPanel />}
        {EventosRealizadosPanel && <EventosRealizadosPanel />}
      </div>
    </div>
  );
}

Object.assign(window, { HeroSlider, CategoryBlocks, ContentGrid, CosmicBg2, ModalShell, OpinionPanel });
