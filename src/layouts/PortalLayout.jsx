import React from 'react';
import { Outlet } from 'react-router-dom';
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
//
// Ajuste posterior — bug de navegación (ver nota corta en
// FASE-06-07-08-CONTENIDO-REAL.md): antes existía acá un `window.scrollToSection`
// global, consumido tanto por el Header como por CategoryBlocks, que hacía
// scroll suave a una sección anclada (`section-*`) — funcionaba mientras
// esas secciones solo existían dentro de HomePage, pero se rompía en
// cualquier otra página (las anclas no existen ahí). Ahora que Videos,
// Infografías, Tendencias y Eventos tienen su propia ruta, el Header navega
// directo a esas rutas y ya no necesita esta función. Se eliminó por
// completo — el único bloque de categoría que todavía hace scroll dentro de
// la página ("Contacto", que no tiene ruta propia) resuelve su propio
// scroll localmente en CategoryBlocks (Hero.jsx), sin depender de un global.
export function PortalLayout() {
  const [showSoporte, setShowSoporte] = React.useState(false);

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
