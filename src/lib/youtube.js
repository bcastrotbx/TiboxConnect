// Extrae el ID de un video de YouTube desde varias formas de URL comunes
// (watch?v=, youtu.be/, /embed/, /shorts/). Devuelve null si el link no es
// de YouTube — el formulario de videos debe seguir funcionando sin
// miniatura automática en ese caso (otras plataformas quedan para más
// adelante, no en esta fase).
export function extractYouTubeVideoId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1).split('/')[0];
      return id || null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (u.pathname === '/watch') return u.searchParams.get('v');
      const embedMatch = u.pathname.match(/^\/(embed|shorts)\/([^/]+)/);
      if (embedMatch) return embedMatch[2];
    }
    return null;
  } catch {
    return null;
  }
}

export function getYouTubeThumbnailUrl(url) {
  const id = extractYouTubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

// Fase Analítica 2 (ver docs/phases/, tracking de video): carga perezosa y
// cacheada del script oficial de YouTube IFrame Player API — solo se pide
// cuando algo necesita progreso/finalización real de reproducción (ver
// YouTubePlayer.jsx, prop `onProgress`/`onComplete`). El reproductor
// "poster + iframe crudo" de siempre (sin tracking) no la carga, así que no
// agrega una petición de red donde no se usa. Cacheado a nivel de módulo:
// una sola inyección de <script> y una sola promesa compartida aunque se
// abra más de un reproductor con tracking en la misma sesión.
let youtubeApiPromise = null;

export function loadYouTubeIframeAPI() {
  if (typeof window === 'undefined') return Promise.reject(new Error('No hay window disponible.'));
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousCallback === 'function') previousCallback();
      resolve(window.YT);
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    }
  });
  return youtubeApiPromise;
}
