import { Link } from 'react-router-dom';
import { Icon } from '../components/shared/Icon.jsx';
import { CosmicBg } from '../components/shared/CosmicBg.jsx';

// Página 404 para cualquier ruta no reconocida (ruta "*" de AppRouter). No
// asume si el usuario buscaba el portal o el admin, así que solo ofrece
// volver al portal público.
export function NotFound() {
  return (
    <div style={{
      position:'relative', width:'100%', height:'100vh', overflow:'hidden',
      background:'var(--grad-corporate)', display:'flex', alignItems:'center', justifyContent:'center',
      padding:24,
    }}>
      <CosmicBg variant={0} />
      <div style={{position:'absolute',inset:0,background:'linear-gradient(120deg, rgba(2,16,46,0.82), rgba(5,24,72,0.55))',pointerEvents:'none'}}></div>
      <div style={{position:'relative',textAlign:'center',maxWidth:420}}>
        <img src="/assets/mark-cube.png" alt="TIBOX" style={{width:56,height:56,objectFit:'contain',marginBottom:20}} />
        <div style={{fontSize:'clamp(2.5rem,6vw,4rem)',fontWeight:700,color:'white',lineHeight:1,marginBottom:12}}>404</div>
        <div style={{fontSize:19,fontWeight:700,color:'white',marginBottom:8}}>Página no encontrada</div>
        <p style={{fontSize:14,color:'rgba(255,255,255,0.7)',lineHeight:1.6,margin:'0 0 28px'}}>
          La página que buscas no existe o fue movida.
        </p>
        <Link to="/" style={{
          display:'inline-flex',alignItems:'center',gap:8,padding:'12px 24px',borderRadius:10,
          background:'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)',color:'white',textDecoration:'none',
          fontSize:14,fontWeight:700,boxShadow:'0 2px 14px rgba(255,103,7,0.35)',
        }}>
          <Icon name="arrow-left" style={{width:15,height:15}} />
          Volver al portal
        </Link>
      </div>
    </div>
  );
}
