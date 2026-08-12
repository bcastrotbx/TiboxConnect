import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '../components/shared/Icon.jsx';
import { LoadingState, EmptyState, ErrorState } from '../components/shared/AsyncState.jsx';
import { Breadcrumb } from '../components/shared/Breadcrumb.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import * as newsService from '../services/newsService.js';

// Fase 9 (ver FASE-09-NOTICIAS-DETALLE-Y-ADMIN.md): página propia de detalle
// para una noticia/tendencia — mismo patrón 70/30 que /videoteca/:slug y
// /eventos/:slug (.videoteca-detail-grid): contenido principal a la
// izquierda (imagen + categoría + título + cuerpo completo, sin recortar),
// "Mira también" (otras noticias publicadas) a la derecha. El popup del
// inicio (NoticiaModal, Events.jsx) sigue existiendo para la vista rápida,
// ahora con un botón "Ver Más" que trae al visitante acá.
export function NoticiaDetailPage() {
  const { slug } = useParams();
  const { status, data: news, error } = useAsyncData(() => newsService.getNewsBySlug(slug), [slug]);
  const { data: cats } = useAsyncData(() => newsService.getNewsCategories(), []);
  const { data: allNews } = useAsyncData(() => newsService.getNews({}), []);

  const catsById = React.useMemo(() => Object.fromEntries((cats || []).map((c) => [c.id, c])), [cats]);

  if (status === 'loading') {
    return <div className="section-card" style={{ padding: '40px 24px' }}><LoadingState label="Cargando…" /></div>;
  }
  if (status === 'error') {
    return <div className="section-card" style={{ padding: '40px 24px' }}><ErrorState label="No pudimos cargar esta noticia." error={error} /></div>;
  }
  if (!news) {
    return (
      <div className="section-card" style={{ padding: '40px 24px', textAlign: 'center' }}>
        <EmptyState label="No encontramos esta noticia — puede que ya no esté disponible." icon="rss" />
        <Link to="/tendencias" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13, fontWeight: 700, color: '#0050C8', textDecoration: 'none' }}>
          <Icon name="arrow-left" style={{ width: 14, height: 14 }} /> Volver a Tendencias
        </Link>
      </div>
    );
  }

  const cat = catsById[news.cat];
  const recommended = (allNews || []).filter((n) => n.id !== news.id).slice(0, 6);

  return (
    <div className="videoteca-detail-grid">
      {/* Contenido principal — 70% */}
      <div className="section-card" style={{ padding: 0 }}>
        <div style={{ marginBottom: 4, padding: '20px 26px 0' }}>
          <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Tendencias', to: '/tendencias' }, { label: news.title }]} />
        </div>

        {/* Imagen destacada */}
        <div style={{ position: 'relative', height: 260, overflow: 'hidden', background: '#0b1a3a', margin: '14px 0 0' }}>
          {news.img && (
            <img src={news.img} alt={news.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,12,36,0.25) 0%, rgba(2,12,36,0.5) 55%, rgba(2,12,36,0.92) 100%)' }}></div>
          {cat && (
            <span style={{ position: 'absolute', top: 16, left: 16, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'white', background: cat.color, borderRadius: 999, padding: '4px 11px' }}>
              {cat.label}
            </span>
          )}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 26px' }}>
            <h1 style={{ fontSize: 'clamp(1.3rem,2vw,1.7rem)', fontWeight: 700, color: 'white', lineHeight: 1.3, margin: 0 }}>{news.title}</h1>
          </div>
        </div>

        <div style={{ padding: '22px 26px 28px' }}>
          {/* Info bento */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
            {[
              { ic: 'calendar', lb: 'Fecha', vl: news.date },
              { ic: 'rss', lb: 'Categoría', vl: cat?.label || 'Sin categoría', color: cat?.color },
              { ic: 'newspaper', lb: 'Fuente', vl: news.source || 'TIBOX' },
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

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand-cyan-700,#0079a8)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="info" style={{ width: 13, height: 13 }} />Sobre esta noticia
          </div>
          <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{news.body || 'Sin descripción disponible.'}</p>
        </div>
      </div>

      {/* "Mira también" — 30% */}
      <div className="section-card" style={{ padding: '20px 22px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-900)', marginBottom: 14 }}>Mira también</div>
        {recommended.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>No hay más noticias por ahora.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recommended.map((n) => (
              <Link key={n.id} to={`/tendencias/${n.slug}`} style={{
                display: 'flex', gap: 10, alignItems: 'center', textDecoration: 'none',
                padding: '9px 10px', borderRadius: 10, border: '1px solid var(--gray-200)', transition: 'background 150ms',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gray-50)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
              >
                <div style={{ minWidth: 40, textAlign: 'center', background: 'var(--navy-900)', borderRadius: 8, padding: '5px 4px', flexShrink: 0 }}>
                  <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand-cyan)', lineHeight: 1.2 }}>{n.month}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'white', lineHeight: 1 }}>{n.day}</div>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy-900)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.title}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
