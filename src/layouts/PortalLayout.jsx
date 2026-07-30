import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Icon } from '../components/shared/Icon.jsx';
import { ModalShell } from '../components/shared/ModalShell.jsx';
import { CosmicBg } from '../components/shared/CosmicBg.jsx';
import { Header } from '../components/Header.jsx';

function SoporteModal({ onClose }) {
  return (
    <ModalShell onClose={onClose} maxWidth={460}>
      <div style={{padding:'22px 26px',background:'var(--grad-corporate)',position:'relative',overflow:'hidden'}}>
        <CosmicBg variant={1} />
        <div style={{position:'absolute',inset:0,background:'rgba(3,18,55,0.55)'}}></div>
        <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--brand-cyan)',marginBottom:4}}>Soporte TIBOX</div>
            <div style={{fontSize:18,fontWeight:700,color:'white'}}>Contacta con nosotros</div>
          </div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:8,cursor:'pointer',color:'white',padding:6,display:'flex'}}>
            <Icon name="x" style={{width:16,height:16}} />
          </button>
        </div>
      </div>
      <div style={{padding:'24px 26px',display:'flex',flexDirection:'column',gap:18}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:40,height:40,borderRadius:10,background:'rgba(0,80,200,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <Icon name="phone" style={{width:18,height:18,color:'#0050C8'}} />
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--gray-400)',marginBottom:2}}>Chile</div>
            <div style={{fontSize:14,fontWeight:700,color:'var(--navy-900)'}}>+56 2 2938 9000</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:40,height:40,borderRadius:10,background:'rgba(0,80,200,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <Icon name="mail" style={{width:18,height:18,color:'#0050C8'}} />
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--gray-400)',marginBottom:2}}>Email soporte</div>
            <div style={{fontSize:14,fontWeight:700,color:'var(--navy-900)'}}>soporte@tibox.cl</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:40,height:40,borderRadius:10,background:'rgba(0,80,200,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <Icon name="ticket" style={{width:18,height:18,color:'#0050C8'}} />
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--gray-400)',marginBottom:2}}>Portal de tickets</div>
            <a href="https://soporte.tibox.cl/Login/LoginCliente" target="_blank" rel="noopener noreferrer" style={{fontSize:14,fontWeight:700,color:'#0050C8',textDecoration:'none'}}>soporte.tibox.cl</a>
          </div>
        </div>
        <div style={{padding:'14px 16px',background:'var(--gray-50)',borderRadius:10,border:'1px solid var(--gray-200)'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
            <Icon name="clock" style={{width:14,height:14,color:'var(--gray-500)'}} />
            <span style={{fontSize:12,fontWeight:700,color:'var(--navy-900)'}}>Horario de atención</span>
          </div>
          <div style={{fontSize:13,color:'var(--gray-600)',lineHeight:1.5}}>
            Lunes a viernes, 09:00 – 18:30 hrs<br/>
            Soporte crítico 24/7 para clientes NOC/SOC
          </div>
        </div>
        <a href="https://soporte.tibox.cl/Login/LoginCliente" target="_blank" rel="noopener noreferrer" style={{
          display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'12px',borderRadius:10,
          background:'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',color:'white',
          fontSize:14,fontWeight:700,textDecoration:'none',
          boxShadow:'0 2px 14px rgba(255,103,7,0.35)',
        }}>
          <Icon name="external-link" style={{width:15,height:15}} />
          Ir al portal de soporte
        </a>
      </div>
    </ModalShell>
  );
}

// Chrome del portal (header + wrapper de contenido con scroll), antes fijo
// dentro de src/App.jsx. Las páginas del portal se renderizan vía <Outlet/>.
// window.scrollToSection sigue siendo un global deliberado (igual que en la
// Fase 1) porque lo consume tanto CategoryBlocks como los links de
// navegación del Header (ver ajuste posterior en
// FASE-06-07-08-CONTENIDO-REAL.md: se eliminó el Sidebar del portal — no el
// del admin — y su navegación se movió al Header).
//
// Ajuste posterior — reversión parcial (ver nota corta en
// FASE-06-07-08-CONTENIDO-REAL.md): se había reemplazado este mecanismo por
// navegación directa a páginas dedicadas (/videoteca, etc.), pero se
// revirtió a pedido de Braulio — los bloques de categoría y el menú
// superior vuelven a hacer scroll dentro del inicio. La única pieza nueva
// es el bloque de abajo: cuando el Header ya no está en "/" y el usuario
// hace clic en un ítem, primero navega a "/" pasando `state:{scrollTo}` (ver
// handleNavClick en Header.jsx); este efecto detecta ese estado una vez que
// el Outlet ya cambió a HomePage y completa el scroll — sin este paso, la
// navegación cross-página se habría quedado solo en el tope del inicio.
export function PortalLayout() {
  const [showSoporte, setShowSoporte] = React.useState(false);
  const location = useLocation();

  const scrollToSection = React.useCallback((id) => {
    const content = document.querySelector('.portal-content');
    if (!content) return;
    if (id === 'hero') { content.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.getElementById('section-' + id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  React.useEffect(() => { window.scrollToSection = scrollToSection; }, [scrollToSection]);

  React.useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      scrollToSection(location.state.scrollTo);
    }
  }, [location, scrollToSection]);

  return (
    <React.Fragment>
      <div className="portal-main">
        <Header onSoporte={() => setShowSoporte(true)} />
        <div className="portal-content">
          <div className="content-wrap">
            <Outlet />
            <div style={{ textAlign: 'center', padding: '4px 0 14px', fontSize: 12.5, fontWeight: 600, color: 'var(--gray-400)', letterSpacing: '0.02em' }}>
              Desarrollado por TIBOX 2026
            </div>
          </div>
        </div>
      </div>
      {showSoporte && <SoporteModal onClose={() => setShowSoporte(false)} />}
    </React.Fragment>
  );
}
