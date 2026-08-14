import { supabase } from './supabase.js';

// Fase Analítica 1 (ver docs/phases/FASE-10-ANALITICA-FASE1.md): tracking
// de comportamiento anónimo del portal público. Por diseño, NO usa la IP
// como identificador (ver la sección "Por qué no usar IP" del documento de
// análisis) — se identifica cada navegador con un `anonymous_id` (UUID
// persistido en localStorage, sin vínculo a datos personales) y cada
// sesión de navegación con un `session_id` que expira por 30 min de
// inactividad. No se instrumenta ninguna ruta bajo /admin — este módulo
// solo se importa desde PortalLayout.jsx (chrome del portal público).
//
// Todo insert es "fire-and-forget": un error de red o de RLS acá nunca
// debe romper la navegación real del visitante, así que se captura y se
// descarta en silencio (no hay nada útil que mostrarle a un visitante por
// un fallo de tracking).

const ANON_ID_KEY = 'tbx_analytics_anon_id';
const SESSION_ID_KEY = 'tbx_analytics_session_id';
const SESSION_LAST_ACTIVITY_KEY = 'tbx_analytics_session_last_activity';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

function getAnonymousId() {
  try {
    let id = localStorage.getItem(ANON_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ANON_ID_KEY, id);
    }
    return id;
  } catch {
    // Navegación privada/localStorage bloqueado: se genera un id de solo
    // esta carga de página en vez de fallar — sigue siendo un UUID válido,
    // solo no persiste entre páginas.
    return crypto.randomUUID();
  }
}

// Sesión con expiración por inactividad (30 min, ver documento de
// análisis) — no por tiempo transcurrido desde que se creó, sino desde la
// última vez que se registró actividad. Cada llamada renueva
// SESSION_LAST_ACTIVITY_KEY, así que una visita larga y activa mantiene el
// mismo session_id todo el tiempo.
function getSessionId() {
  try {
    const now = Date.now();
    const lastActivity = Number(localStorage.getItem(SESSION_LAST_ACTIVITY_KEY) || 0);
    let id = localStorage.getItem(SESSION_ID_KEY);
    if (!id || now - lastActivity > SESSION_TIMEOUT_MS) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_ID_KEY, id);
    }
    localStorage.setItem(SESSION_LAST_ACTIVITY_KEY, String(now));
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

// Mismos puntos de quiebre responsive que ya usa el resto del portal (ver
// index.css: 700px para grillas, 900px para el header) — no son umbrales
// nuevos inventados para analítica.
function getDeviceType() {
  const w = window.innerWidth;
  if (w < 700) return 'mobile';
  if (w < 900) return 'tablet';
  return 'desktop';
}

// Deriva la "sección" de negocio a partir de la ruta — una página de
// detalle (/tendencias/:slug) cuenta para la misma sección que su listado
// (/tendencias), que es lo que tiene sentido para un ranking de "secciones
// más visitadas" (ver AnaliticaPage.jsx).
function sectionFromPath(pathname) {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/videoteca')) return 'videoteca';
  if (pathname.startsWith('/infografias')) return 'infografias';
  if (pathname.startsWith('/tendencias')) return 'tendencias';
  if (pathname.startsWith('/eventos')) return 'eventos';
  return 'otro';
}

async function logEvent(eventType, fields) {
  try {
    await supabase.from('analytics_events').insert({
      event_type: eventType,
      anonymous_id: getAnonymousId(),
      session_id: getSessionId(),
      device_type: getDeviceType(),
      referrer: document.referrer || null,
      ...fields,
    });
  } catch {
    // Silencioso a propósito — ver nota al inicio del archivo.
  }
}

// Única función pública de esta fase. `pathname` opcional: por defecto usa
// la ruta actual, pero se puede pasar explícito si el llamador ya la tiene
// (evita depender de que window.location esté actualizado en el momento
// exacto de la llamada).
export function trackPageView(pathname = window.location.pathname) {
  logEvent('page_view', {
    page_path: pathname,
    section: sectionFromPath(pathname),
  });
}
