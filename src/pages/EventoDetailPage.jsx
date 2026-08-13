import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '../components/shared/Icon.jsx';
import { LoadingState, EmptyState, ErrorState } from '../components/shared/AsyncState.jsx';
import { CtaPrimary } from '../components/shared/CtaStyles.jsx';
import { Breadcrumb } from '../components/shared/Breadcrumb.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import * as eventService from '../services/eventService.js';

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): página propia de
// detalle de un evento — mismo patrón 70/30 que /videoteca/:slug
// (.videoteca-detail-grid): contenido principal a la izquierda, "Eventos
// recomendados" (otros próximos eventos ya publicados) a la derecha. Antes
// "Ver detalles" en la página /eventos abría el mismo popup del inicio
// (EventDetailModal/VistaModal) — se mantiene ese popup para el inicio, pero
// el listado /eventos ahora navega acá.
//
// Ajuste posterior (galería con miniaturas + lightbox): antes cada foto se
// mostraba directamente a su tamaño de grilla (minmax(160px,1fr)), lo que en
// eventos con pocas fotos las dejaba enormes. Ahora la galería usa
// .event-gallery-grid (mismo patrón responsive de 4/3/2/1 columnas que
// .videoteca-grid, definido en index.css) y cada miniatura abre la foto a
// tamaño completo en un lightbox superpuesto, con navegación anterior/
// siguiente y cierre con click afuera, botón X o tecla Escape.
export function EventoDetailPage() {
  const { slug } = useParams();
  const { status, data: event, error } = useAsyncData(() => eventService.getEventDetailBySlug(slug), [slug]);
  const { data: modalidad } = useAsyncData(() => eventService.getModalidadConfig(), []);
  const { data: partners } = useAsyncData(() => eventService.getPartners(), []);
  const { data: upcoming } = useAsyncData(() => eventService.getUpcomingEvents(), []);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const gallery = event?.gallery || [];

  // Navegación por teclado del lightbox: Escape cierra, flechas cambian de
  // foto. Solo se engancha el listener mientras el lightbox está abierto.
  useEffect(() => {
    if (lightboxIndex === null) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i + 1) % gallery.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, gallery.length]);

  if (status === 'loading') {
    return <div className="section-card" style={{ padding: '40px 24px' }}><LoadingState label="Cargando…" /></div>;
  }
  if (status === 'error') {
    return <div className="section-card" style={{ padding: '40px 24px' }}><ErrorState label="No pudimos cargar este evento." error={error} /></div>;
  }
  if (!event) {
    return (
      <div className="section-card" style={{ padding: '40px 24px', textAlign: 'center' }}>
        <EmptyState label="No encontramos este evento — puede que ya no esté disponible." icon="calendar" />
        <Link to="/eventos" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13, fontWeight: 700, color: '#0050C8', textDecoration: 'none' }}>
          <Icon name="arrow-left" style={{ width: 14, height: 14 }} /> Volver a Eventos
        </Link>
      </div>
    );
  }

  const modalidadById = modalidad || {};
  const partnersById = partners || {};
  const mod = modalidadById[event.modalidad] || { color: '#0050C8', icon: 'wifi' };
  const partner = partnersById[event.partner] || { logo: '', name: '' };
  const partnerLogo = event.partnerLogoUrl || partner.logo;
  const isUpcoming = !eventService.isEventPast(event.startsAtRaw);
  const recommended = (upcoming || []).filter((ev) => ev.id !== event.id).slice(0, 6);

  return (
    <>
      <div className="videoteca-detail-grid">
        {/* Contenido principal — 70% */}
        <div className="section-card" style={{ padding: 0 }}>
          <div style={{ marginBottom: 4, padding: '20px 26px 0' }}>
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Eventos', to: '/eventos' }, { label: event.title }]} />
          </div>

          {/* Imagen destacada */}
          <div className="detail-banner-image" style={{ position: 'relative', overflow: 'hidden', background: '#0b1a3a', margin: '14px 0 0' }}>
            <img src={event.img} alt={event.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,12,36,0.25) 0%, rgba(2,12,36,0.5) 55%, rgba(2,12,36,0.92) 100%)' }}></div>
            {!isUpcoming && (
              <span style={{ position: 'absolute', top: 16, left: 16, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'white', background: 'rgba(13,138,78,0.92)', borderRadius: 999, padding: '4px 11px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Icon name="check-circle-2" style={{ width: 12, height: 12 }} />Evento realizado
              </span>
            )}
            {isUpcoming && (
              <span style={{ position: 'absolute', top: 16, left: 16, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'white', background: '#0050C8', borderRadius: 999, padding: '4px 11px' }}>
                Próximamente
              </span>
            )}
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 26px' }}>
              <h1 style={{ fontSize: 'clamp(1.3rem,2vw,1.7rem)', fontWeight: 700, color: 'white', lineHeight: 1.3, margin: 0 }}>{event.title}</h1>
            </div>
          </div>

          <div style={{ padding: '22px 26px 28px' }}>
            {/* Info bento */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
              {[
                { ic: 'calendar', lb: 'Fecha', vl: `${event.day} ${event.month} ${event.year}` },
                { ic: 'clock', lb: 'Hora', vl: `${event.time} hrs` },
                { ic: mod.icon, lb: 'Modalidad', vl: event.modalidad, color: mod.color },
                { ic: 'map-pin', lb: 'Lugar', vl: event.place },
              ].map((it, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', background: 'var(--gray-50)', borderRadius: 11, border: '1px solid var(--gray-200)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: (it.color || '#0050C8') + '15' }}>
                    <Icon name={it.ic} style={{ width: 16, height: 16, color: it.color || '#0050C8' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-400)' }}>{it.lb}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-900)', lineHeight: 1.25 }}>{it.vl}</div>
                  </div>
                </div>
              ))}
            </div>

            {(partnerLogo || event.partnerName) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gray-400)' }}>Colaborador</span>
                {partnerLogo ? (
                  <img src={partnerLogo} alt={event.partnerName || partner.name} title={event.partnerName || partner.name} style={{ height: 20, maxWidth: 120, objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-900)' }}>{event.partnerName}</span>
                )}
              </div>
            )}

            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand-cyan-700,#0079a8)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="info" style={{ width: 13, height: 13 }} />Sobre el evento
            </div>
            <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7, margin: '0 0 20px' }}>{event.resena || event.desc || 'Sin descripción disponible.'}</p>

            {/* Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md):
                "Inscríbete aquí" y la galería son independientes entre sí —
                antes un if/else los mostraba de forma excluyente según
                isUpcoming, así que un evento realizado con fotos igual podía
                perder la galería si por algún motivo isUpcoming daba true, y
                un evento próximo con fotos ya cargadas (poco común, pero
                posible) nunca las habría mostrado. La galería ahora se
                muestra siempre que tenga fotos, sin importar el estado. */}
            {isUpcoming && (
              <CtaPrimary as="a" href={event.registrationUrl} target="_blank" rel="noopener noreferrer" style={{ marginBottom: gallery.length > 0 ? 24 : 0 }}>
                <Icon name="external-link" style={{ width: 16, height: 16 }} />Inscríbete aquí
              </CtaPrimary>
            )}

            {gallery.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#FF6707', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="images" style={{ width: 13, height: 13 }} />Galería del evento
                </div>
                <div className="event-gallery-grid">
                  {gallery.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      className="event-gallery-thumb"
                      onClick={() => setLightboxIndex(i)}
                      aria-label={`Ver foto ${i + 1} en grande`}
                    >
                      <img src={src} alt={`Foto ${i + 1}`} loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* "Eventos recomendados" — 30% */}
        <div className="section-card" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-900)', marginBottom: 14 }}>Eventos recomendados</div>
          {recommended.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>No hay más eventos próximos por ahora.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recommended.map((ev) => (
                <Link key={ev.id} to={`/eventos/${ev.slug}`} style={{
                  display: 'flex', gap: 10, alignItems: 'center', textDecoration: 'none',
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox de la galería — se renderiza fuera de .videoteca-detail-grid
          para poder cubrir toda la pantalla con position:fixed. */}
      {lightboxIndex !== null && gallery.length > 0 && (
        <div
          className="event-gallery-lightbox"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            className="event-gallery-lightbox-close"
            onClick={() => setLightboxIndex(null)}
            aria-label="Cerrar"
          >
            <Icon name="x" style={{ width: 20, height: 20 }} />
          </button>

          {gallery.length > 1 && (
            <button
              type="button"
              className="event-gallery-lightbox-prev"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i - 1 + gallery.length) % gallery.length); }}
              aria-label="Foto anterior"
            >
              <Icon name="chevron-left" style={{ width: 22, height: 22 }} />
            </button>
          )}

          <img
            src={gallery[lightboxIndex]}
            alt={`Foto ${lightboxIndex + 1} de ${gallery.length}`}
            onClick={(e) => e.stopPropagation()}
          />

          {gallery.length > 1 && (
            <button
              type="button"
              className="event-gallery-lightbox-next"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i + 1) % gallery.length); }}
              aria-label="Foto siguiente"
            >
              <Icon name="chevron-right" style={{ width: 22, height: 22 }} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
