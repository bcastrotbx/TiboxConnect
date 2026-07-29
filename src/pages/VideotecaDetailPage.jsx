import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '../components/shared/Icon.jsx';
import { LoadingState, EmptyState, ErrorState } from '../components/shared/AsyncState.jsx';
import { YouTubePlayer } from '../components/shared/YouTubePlayer.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import * as videotecaService from '../services/videotecaService.js';
import * as contentService from '../services/contentService.js';
import * as eventService from '../services/eventService.js';
import { EventDetailModal } from '../components/Events.jsx';

// Ajuste posterior — Videoteca en páginas propias (ver nota extensa en
// FASE-06-07-08-CONTENIDO-REAL.md): página de detalle para un video real o
// un evento ya realizado. El slug puede pertenecer a cualquiera de las dos
// tablas (content_items o events) — videotecaService.getVideotecaDetailBySlug
// prueba ambas. Layout 70/30 (.videoteca-detail-grid en index.css):
// contenido principal a la izquierda, "Mira también" (próximos eventos) a
// la derecha, apilado en pantallas angostas.
export function VideotecaDetailPage() {
  const { slug } = useParams();
  const { status, data: detail, error } = useAsyncData(() => videotecaService.getVideotecaDetailBySlug(slug), [slug]);
  const { data: cats } = useAsyncData(() => contentService.getVideoCategories(), []);
  const { data: upcoming } = useAsyncData(() => eventService.getUpcomingEvents(), []);
  const { data: modalidad } = useAsyncData(() => eventService.getModalidadConfig(), []);
  const [openEvent, setOpenEvent] = React.useState(null);

  const catsById = React.useMemo(() => Object.fromEntries((cats || []).map((c) => [c.id, c])), [cats]);

  if (status === 'loading') {
    return <div className="section-card" style={{ padding: '40px 24px' }}><LoadingState label="Cargando…" /></div>;
  }
  if (status === 'error') {
    return <div className="section-card" style={{ padding: '40px 24px' }}><ErrorState label="No pudimos cargar este contenido." error={error} /></div>;
  }
  if (!detail) {
    return (
      <div className="section-card" style={{ padding: '40px 24px', textAlign: 'center' }}>
        <EmptyState label="No encontramos este contenido — puede que ya no esté disponible." icon="film" />
        <Link to="/videoteca" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13, fontWeight: 700, color: '#0050C8', textDecoration: 'none' }}>
          <Icon name="arrow-left" style={{ width: 14, height: 14 }} /> Volver a la videoteca
        </Link>
      </div>
    );
  }

  const isVideo = detail.kind === 'video';
  const item = detail.data;
  const cat = isVideo ? catsById[item.cat] : null;
  // Nota de modelo de datos: `events` no tiene ninguna columna de URL de
  // video (a diferencia de content_items.external_url) — un evento
  // realizado nunca tendrá un ID de YouTube que extraer, así que
  // YouTubePlayer siempre cae en su estado de respaldo ("sin video
  // disponible") para este caso. Se reutiliza el mismo componente de todas
  // formas (no uno distinto "sin reproductor") para que, si más adelante se
  // agrega una columna de grabación a eventos, esta página funcione sin
  // cambios — solo habría que pasar ese campo acá.
  const externalUrl = isVideo ? item.externalUrl : null;
  const thumb = isVideo ? item.thumb : item.img;
  const dateLabel = isVideo ? 'Fecha de publicación' : 'Fecha del evento';
  const dateValue = isVideo ? item.date : `${item.day} ${item.month} ${item.year}`;
  const description = isVideo ? item.summary : (item.resena || item.desc);

  return (
    <div className="videoteca-detail-grid">
      {/* Contenido principal — 70% */}
      <div className="section-card" style={{ padding: 0 }}>
        <YouTubePlayer thumb={thumb} externalUrl={externalUrl} title={item.title} />
        <div style={{ padding: '22px 26px 28px' }}>
          <h1 style={{ fontSize: 'clamp(1.3rem,2vw,1.6rem)', fontWeight: 700, color: 'var(--navy-900)', lineHeight: 1.3, margin: '0 0 12px' }}>{item.title}</h1>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
            {cat && (
              <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: cat.color, borderRadius: 999, padding: '4px 11px' }}>{cat.label}</span>
            )}
            <span style={{ fontSize: 12.5, color: 'var(--gray-500)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Icon name="calendar" style={{ width: 13, height: 13 }} />{dateLabel}: {dateValue}
            </span>
            {isVideo && item.dur && (
              <span style={{ fontSize: 12.5, color: 'var(--gray-500)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Icon name="clock" style={{ width: 13, height: 13 }} />{item.dur}
              </span>
            )}
          </div>
          <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7, margin: 0 }}>
            {description || 'Sin descripción disponible.'}
          </p>
          {!isVideo && !externalUrl && (
            <div style={{ marginTop: 16, fontSize: 12.5, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="info" style={{ width: 13, height: 13 }} />Este evento todavía no tiene una grabación en video disponible.
            </div>
          )}
        </div>
      </div>

      {/* "Mira también" — 30% */}
      <div className="section-card" style={{ padding: '20px 22px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-900)', marginBottom: 14 }}>Mira también</div>
        {(upcoming || []).length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>No hay próximos eventos por ahora.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcoming.slice(0, 6).map((ev) => (
              <div key={ev.id} onClick={() => setOpenEvent(ev)} style={{
                display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer',
                padding: '9px 10px', borderRadius: 10, border: '1px solid var(--gray-200)', transition: 'background 150ms',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gray-50)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
              >
                <div style={{ minWidth: 40, textAlign: 'center', background: 'var(--navy-900)', borderRadius: 8, padding: '5px 4px', flexShrink: 0 }}>
                  <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand-cyan)', lineHeight: 1.2 }}>{ev.month}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'white', lineHeight: 1 }}>{ev.day}</div>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy-900)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ev.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {openEvent && <EventDetailModal event={openEvent} modalidadById={modalidad || {}} onClose={() => setOpenEvent(null)} />}
    </div>
  );
}
