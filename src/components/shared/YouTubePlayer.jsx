import React from 'react';
import { Icon } from './Icon.jsx';
import { extractYouTubeVideoId, loadYouTubeIframeAPI } from '../../lib/youtube.js';

// Milestones de progreso reportados una sola vez cada uno por reproducción
// (ver PROGRESS_POLL_MS más abajo) — "tasa de finalización aproximada" en
// vez de un porcentaje exacto continuo, suficiente para el ranking de
// /admin/analitica sin pedirle a la YouTube IFrame API más granularidad de
// la que este panel necesita.
const PROGRESS_MILESTONES = [25, 50, 75];
const PROGRESS_POLL_MS = 5000;

// Reproductor embebido de YouTube — extraído del popup de video
// (VideoModal, src/components/Media.jsx) para reutilizarlo tal cual en la
// página de detalle de la Videoteca (VideotecaDetailPage.jsx), sin duplicar
// la lógica de extracción de ID ni el estado "poster antes de reproducir"
// (ver ajuste posterior en FASE-06-07-08-CONTENIDO-REAL.md). Arranca en
// modo poster (miniatura + botón Play) y solo embebe el iframe al hacer
// clic — evita autoplay con sonido apenas se muestra. Si `externalUrl` no
// es un link de YouTube válido, no finge un reproductor: ofrece "Ver
// contenido" (si hay `externalUrl`) o un mensaje de "sin video disponible".
// Ajuste posterior: `className` es opcional — cuando se pasa (ver
// VideotecaDetailPage.jsx, clase compartida `.detail-banner-image`) fija
// una altura mayor que la relación 16/9 por defecto, para que las
// miniaturas verticales/con personas de pie no queden tan recortadas en la
// página de detalle. El popup de video (VideoModal, Media.jsx) no la usa —
// se mantiene compacto en 16/9 como siempre.
// Ajuste posterior (Fase Analítica 2, tracking de video): `onPlay`/
// `onProgress`/`onComplete` son opcionales — solo VideoModal (Media.jsx) los
// pasa. Sin ellos, el reproductor se comporta exactamente igual que antes
// (iframe crudo, sin la IFrame API de YouTube ni tracking) — la página de
// detalle (VideotecaDetailPage.jsx) no los pasa y no cambia en nada. `onPlay`
// se dispara al hacer clic en el botón de reproducir, sin depender de que la
// IFrame API cargue (no debería fallar solo porque un adblocker bloquee ese
// script). `onProgress`/`onComplete` sí necesitan la IFrame API real (para
// leer tiempo/duración de un iframe de otro origen) — solo se carga cuando
// alguno de los dos está presente.
export function YouTubePlayer({ thumb, externalUrl, title, badge, borderRadius = 0, className, onPlay, onProgress, onComplete }) {
  const [playing, setPlaying] = React.useState(false);
  const youtubeId = extractYouTubeVideoId(externalUrl);
  const tracked = Boolean(onProgress || onComplete);
  const containerRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const pollRef = React.useRef(null);
  const reportedRef = React.useRef(new Set());

  const handlePlayClick = () => {
    setPlaying(true);
    if (onPlay) onPlay(youtubeId);
  };

  React.useEffect(() => {
    if (!playing || !youtubeId || !tracked) return undefined;
    let cancelled = false;
    reportedRef.current = new Set();

    loadYouTubeIframeAPI().then((YT) => {
      if (cancelled || !containerRef.current) return;
      playerRef.current = new YT.Player(containerRef.current, {
        videoId: youtubeId,
        playerVars: { autoplay: 1 },
        events: {
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) {
              if (pollRef.current) return;
              pollRef.current = window.setInterval(() => {
                const player = playerRef.current;
                if (!player || typeof player.getDuration !== 'function') return;
                const duration = player.getDuration();
                const current = player.getCurrentTime();
                if (!duration) return;
                const percent = Math.min(100, Math.round((current / duration) * 100));
                PROGRESS_MILESTONES.forEach((m) => {
                  if (percent >= m && !reportedRef.current.has(m)) {
                    reportedRef.current.add(m);
                    if (onProgress) onProgress(youtubeId, m);
                  }
                });
              }, PROGRESS_POLL_MS);
            } else if (pollRef.current) {
              window.clearInterval(pollRef.current);
              pollRef.current = null;
            }
            if (e.data === YT.PlayerState.ENDED && onComplete) onComplete(youtubeId);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (pollRef.current) { window.clearInterval(pollRef.current); pollRef.current = null; }
      if (playerRef.current && typeof playerRef.current.destroy === 'function') playerRef.current.destroy();
      playerRef.current = null;
    };
  }, [playing, youtubeId, tracked, onProgress, onComplete]);

  return (
    <div className={className} style={{ position:'relative', aspectRatio: className ? undefined : '16/9', background:'#040b22', overflow:'hidden', borderRadius }}>
      {playing && youtubeId ? (
        tracked ? (
          <div ref={containerRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            title={title}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )
      ) : (
        <React.Fragment>
          {thumb && <img src={thumb} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(2,12,36,0.25),rgba(2,12,36,0.82))' }}></div>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {youtubeId ? (
              <button onClick={handlePlayClick} title="Reproducir" style={{
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
