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

/* ── Category Blocks ──────────────────────────────
   Un color distinto por bloque, tomado de la misma paleta que ya usan las
   categorías reales (ver supabase/migrations/*_webinars_category.sql y
   seed.sql: ciberseguridad #F2542D, cloud-infraestructura #2D6CF2,
   transformacion-digital #2DBE60, webinars #6a3ed0) — no son colores nuevos
   inventados, son variantes (oscuro → color → claro) de tonos que ya
   existen en la app, para que se sientan parte de la misma paleta.
   Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): de 4 a 5 bloques
   — se agrega "contacto" con un quinto tono cian/turquesa, ligado a
   var(--brand-cyan) (el acento cian que ya se usa en eyebrows, badges y
   separadores en todo el sitio), y no repite ninguno de los otros 4. */
const CAT_GRADIENTS = {
  videos:      'linear-gradient(135deg, #2c1a5e 0%, #6a3ed0 60%, #b39ddb 100%)', // morado — mismo tono que la categoría "Webinars"
  infografias: 'linear-gradient(135deg, #7a1f10 0%, #F2542D 58%, #ff9a7d 100%)', // naranja/rojo — mismo tono que "Ciberseguridad"
  tendencias:  'linear-gradient(135deg, #06246a 0%, #2D6CF2 58%, #7db2ff 100%)', // azul — mismo tono que "Cloud & Infraestructura"
  eventos:     'linear-gradient(135deg, #0b3d24 0%, #2DBE60 58%, #7fe0a3 100%)', // verde — mismo tono que "Transformación Digital"
  contacto:    'linear-gradient(135deg, #033c42 0%, #0eb8c9 58%, #8fe9ef 100%)', // cian/turquesa — nuevo, ligado a var(--brand-cyan)
};
const CAT_BLUE = CAT_GRADIENTS.tendencias; // fallback si aparece un bloque nuevo sin color asignado

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): se eliminó el
// bloque blanco inferior (título + descripción + dato estadístico) — ahora
// todo (ícono, título y descripción) vive dentro del mismo recuadro de
// color. `c.count` (el dato estadístico, ej. "8 próximos") ya no se
// muestra en ningún lado de este componente. El layout de 5 bloques usa
// .category-grid (index.css): una fila de 5 en escritorio ancho, 3+2 en
// pantallas medianas y apilado en móvil.
export function CategoryBlocks() {
  const { status, data: cats } = useAsyncData(() => homeService.getCategoryBlocks(), []);
  const [hov, setHov] = React.useState(null);
  if (status !== 'success') return null;
  return (
    <div className="category-grid">
      {cats.map(c=>(
        <div key={c.id}
          onMouseEnter={()=>setHov(c.id)} onMouseLeave={()=>setHov(null)}
          onClick={()=>window.scrollToSection&&window.scrollToSection(c.scrollTarget)}
          style={{
            borderRadius:14,overflow:'hidden',cursor:'pointer',position:'relative',
            background:CAT_GRADIENTS[c.id] || CAT_BLUE,
            padding:'20px 22px',
            transform: hov===c.id ? 'translateY(-3px)' : 'none',
            boxShadow: hov===c.id ? '0 8px 24px rgba(0,0,0,0.18)' : '0 1px 4px rgba(0,0,0,0.1)',
            transition:'all 200ms',
          }}
        >
          <div style={{position:'absolute',right:-16,top:-16,width:72,height:72,borderRadius:'50%',background:'rgba(255,255,255,0.07)'}}></div>
          <div style={{position:'relative',display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
            <div style={{width:40,height:40,borderRadius:10,background:'rgba(255,255,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Icon name={c.icon} style={{width:20,height:20,color:'white'}} />
            </div>
            <div style={{fontSize:15.5,fontWeight:700,color:'white'}}>{c.label}</div>
          </div>
          <div style={{position:'relative',fontSize:12.5,color:'rgba(255,255,255,0.78)',lineHeight:1.45}}>{c.sub}</div>
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
