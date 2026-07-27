import React from 'react';
import { Icon } from './shared/Icon.jsx';
import { LoadingState } from './shared/AsyncState.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import * as homeService from '../services/homeService.js';
import { ExploraPanel, InfographicsPanel } from './Media.jsx';
import { NoticiasPanel, EventosPanel, EventosRealizadosPanel } from './Events.jsx';

/* ── Hero Slider ────────────────────────────────── */
export function HeroSlider() {
  const { status, data: slides } = useAsyncData(() => homeService.getHeroSlides(), []);
  const [cur, setCur] = React.useState(0);
  const total = (slides || []).length;

  const go = React.useCallback((dir) => { setCur(c => (c + dir + total) % total); }, [total]);
  React.useEffect(() => {
    if (!total) return;
    const id = setInterval(() => go(1), 5500);
    return () => clearInterval(id);
  }, [go, total]);

  if (status !== 'success' || total === 0) {
    return (
      <div style={{ borderRadius:18, overflow:'hidden', background:'var(--grad-corporate)', height:360, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <LoadingState label="Cargando…" tone="dark" minHeight={0} />
      </div>
    );
  }

  const slide = slides[cur];

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
            {slide.tag && <span style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>·</span>}
            {slide.tag && <span style={{fontSize:11,color:'rgba(255,255,255,0.6)',fontWeight:500}}>{slide.tag}</span>}
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
              <Icon name={slide.ctaIcon} style={{width:15,height:15}} />
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
              ><Icon name="chevron-left" style={{width:16,height:16}} /></button>
              <button onClick={()=>go(1)} style={heroArrow}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
              ><Icon name="chevron-right" style={{width:16,height:16}} /></button>
            </div>
            <div style={{display:'flex',gap:7,alignItems:'center'}}>
              {slides.map((_,i)=>(
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

export function CategoryBlocks() {
  const { status, data: cats } = useAsyncData(() => homeService.getCategoryBlocks(), []);
  const [hov, setHov] = React.useState(null);
  if (status !== 'success') return null;
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
      {cats.map(c=>(
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
              <Icon name={c.icon} style={{width:20,height:20,color:'white'}} />
            </div>
            <div style={{position:'absolute',right:-16,top:-16,width:72,height:72,borderRadius:'50%',background:'rgba(255,255,255,0.07)'}}></div>
          </div>
          <div style={{background:'white',padding:'14px 18px 16px'}}>
            <div style={{fontSize:15,fontWeight:700,color:'var(--navy-900)',marginBottom:2}}>{c.label}</div>
            <div style={{fontSize:12,color:'var(--gray-500)',marginBottom:8}}>{c.sub}</div>
            <div style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,fontWeight:700,color:'var(--gray-500)',background:'var(--gray-100)',borderRadius:999,padding:'3px 9px'}}>
              <Icon name="sparkles" style={{width:11,height:11}} />
              {c.count}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── ContentGrid: stacked full-width sections + (Próximos | Realizados) events row ── */
export function ContentGrid() {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      <div id="section-videos"><ExploraPanel /></div>
      <div id="section-infographics"><InfographicsPanel /></div>
      <div id="section-news"><NoticiasPanel /></div>
      <div id="section-events" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,alignItems:'stretch'}}>
        <EventosPanel />
        <EventosRealizadosPanel />
      </div>
    </div>
  );
}
