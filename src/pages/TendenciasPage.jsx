import React from 'react';
import { Icon } from '../components/shared/Icon.jsx';
import { Breadcrumb } from '../components/shared/Breadcrumb.jsx';
import { LoadingState, EmptyState, ErrorState } from '../components/shared/AsyncState.jsx';
import { Pagination } from '../components/shared/Pagination.jsx';
import { NoticiaModal } from '../components/Events.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import * as newsService from '../services/newsService.js';

const PAGE_SIZE = 12;

// Tarjeta de grilla para /tendencias — no existía una versión "tarjeta" de
// noticia reutilizable (NoticiasPanel usa una lista vertical con scroll
// propio, pensada para la columna angosta del inicio, no para una grilla de
// página completa), así que se creó una nueva liviana en vez de forzar la
// lista existente a un layout que no era el suyo. Reutiliza NoticiaModal
// (Events.jsx) para el popup, igual que en el inicio.
function NoticiaGridCard({ n, catsById, onOpen }) {
  const c = catsById[n.cat] || { color: 'var(--navy-900)', label: '' };
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: 'white', borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        boxShadow: hov ? '0 14px 32px rgba(2,18,55,0.28)' : '0 4px 14px rgba(2,18,55,0.16)',
        transform: hov ? 'translateY(-5px)' : 'none',
        transition: 'box-shadow 220ms, transform 220ms',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: '#0b1a3a' }}>
        {n.img && <img src={n.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.04)' : 'none', transition: 'transform 340ms' }} />}
        <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 10, fontWeight: 700, color: 'white', background: c.color, borderRadius: 999, padding: '3px 10px' }}>{c.label}</span>
      </div>
      <div style={{ padding: '13px 15px 16px' }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy-900)', lineHeight: 1.32, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.7em' }}>{n.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, fontSize: 11, color: 'var(--gray-400)' }}>
          {n.source && <span>{n.source}</span>}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="clock" style={{ width: 11, height: 11 }} />{n.date}</span>
        </div>
      </div>
    </div>
  );
}

// Ajuste posterior — página propia de Tendencias (ver nota extensa en
// FASE-06-07-08-CONTENIDO-REAL.md): mismo patrón de /videoteca (miga de
// pan, título, reseña, filtro por categoría, grilla 12/página con
// paginación). El clic en una noticia abre el mismo NoticiaModal que ya
// existe en el inicio, sin cambios de comportamiento.
export function TendenciasPage() {
  const [category, setCategory] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const [openNews, setOpenNews] = React.useState(null);

  const { data: cats } = useAsyncData(() => newsService.getNewsCategories(), []);
  const { status, data: items, error } = useAsyncData(() => newsService.getNews({ category }), [category]);

  React.useEffect(() => { setPage(1); }, [category]);

  const catsById = React.useMemo(() => Object.fromEntries((cats || []).map((c) => [c.id, c])), [cats]);
  const allItems = items || [];
  const totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
  const pageItems = allItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="section-card" style={{ padding: '28px 28px 4px' }}>
      <div style={{ marginBottom: 20 }}>
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Tendencias' }]} />
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand-cyan)', marginBottom: 6 }}>Tendencias</div>
        <h1 style={{ fontSize: 'clamp(1.5rem,2.4vw,2rem)', fontWeight: 700, color: 'var(--navy-900)', margin: '0 0 8px' }}>
          Tendencias <span style={{ background: 'var(--grad-title)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>de la industria</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--gray-500)', margin: 0, maxWidth: 640, lineHeight: 1.6 }}>
          Lo último del sector tecnológico, seleccionado por el equipo de TIBOX.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
        {(cats || []).map((c) => {
          const on = category === c.id;
          return (
            <button key={c.id} onClick={() => setCategory(c.id)} style={{
              fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 999, padding: '6px 14px',
              border: on ? '1px solid ' + c.color : '1px solid var(--gray-200)',
              background: on ? c.color : 'white', color: on ? 'white' : 'var(--gray-600)',
              transition: 'all 150ms', whiteSpace: 'nowrap',
            }}>{c.label}</button>
          );
        })}
      </div>

      {status === 'loading' && <LoadingState label="Cargando noticias…" />}
      {status === 'error' && <ErrorState label="No pudimos cargar las noticias." error={error} />}
      {status === 'success' && (
        pageItems.length === 0 ? (
          <EmptyState label="No hay noticias para esta categoría." icon="rss" />
        ) : (
          <div className="videoteca-grid">
            {pageItems.map((n) => (
              <NoticiaGridCard key={n.id} n={n} catsById={catsById} onOpen={() => {
                const c = catsById[n.cat];
                setOpenNews({ title: n.title, img: n.img, body: n.body, catLabel: c?.label, catColor: c?.color });
              }} />
            ))}
          </div>
        )
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {openNews && <NoticiaModal noticia={openNews} onClose={() => setOpenNews(null)} />}
    </div>
  );
}
