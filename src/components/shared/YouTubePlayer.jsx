import React from 'react';
import { Icon } from './Icon.jsx';
import { extractYouTubeVideoId } from '../../lib/youtube.js';

// Reproductor embebido de YouTube — extraído del popup de video
// (VideoModal, src/components/Media.jsx) para reutilizarlo tal cual en la
// página de detalle de la Videoteca (VideotecaDetailPage.jsx), sin duplicar
// la lógica de extracción de ID ni el estado "poster antes de reproducir"
// (ver ajuste posterior en FASE-06-07-08-CONTENIDO-REAL.md). Arranca en
// modo poster (miniatura + botón Play) y solo embebe el iframe al hacer
// clic — evita autoplay con sonido apenas se muestra. Si `externalUrl` no
// es un link de YouTube válido, no finge un reproductor: ofrece "Ver
// contenido" (si hay `externalUrl`) o un mensaje de "sin video disponible".
export function YouTubePlayer({ thumb, externalUrl, title, badge, borderRadius = 0 }) {
  const [playing, setPlaying] = React.useState(false);
  const youtubeId = extractYouTubeVideoId(externalUrl);

  return (
    <div style={{ position:'relative', aspectRatio:'16/9', background:'#040b22', overflow:'hidden', borderRadius }}>
      {playing && youtubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <React.Fragment>
          {thumb && <img src={thumb} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(2,12,36,0.25),rgba(2,12,36,0.82))' }}></div>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {youtubeId ? (
              <button onClick={() => setPlaying(true)} title="Reproducir" style={{
                width:74, height:74, borderRadius:'50%', border:'none', padding:0,
                background:'linear-gradient(135deg,#FF6707,#FF8C3A)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 0 0 10px rgba(255,103,7,0.18), 0 8px 28px rgba(255,103,7,0.45)',
                cursor:'pointer',
              }}>
                <Icon name="play" style={{ width:30, height:30, color:'white', marginLeft:3 }} />
              </button>
            ) : externalUrl ? (
              <a href={externalUrl} target="_blank" rel="noopener noreferrer" title="Ver contenido" style={{
                width:74, height:74, borderRadius:'50%', textDecoration:'none',
                background:'rgba(255,255,255,0.14)', border:'1.5px solid rgba(255,255,255,0.4)',
                display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
              }}>
                <Icon name="external-link" style={{ width:26, height:26, color:'white' }} />
              </a>
            ) : (
              <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.75)' }}>Sin video disponible</span>
            )}
          </div>
          {badge && (
            <span style={{ position:'absolute', top:14, left:16, zIndex:2, fontSize:10.5, fontWeight:700, color:'white', background:badge.color || 'var(--navy-900)', borderRadius:999, padding:'4px 11px', boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
              {badge.label}
            </span>
          )}
        </React.Fragment>
      )}
    </div>
  );
}
