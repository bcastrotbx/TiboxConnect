import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/shared/Icon.jsx';
import { LoadingState, EmptyState, ErrorState } from '../components/shared/AsyncState.jsx';
import { Pagination } from '../components/shared/Pagination.jsx';
import { Breadcrumb } from '../components/shared/Breadcrumb.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import * as videotecaService from '../services/videotecaService.js';
import * as eventService from '../services/eventService.js';
import { EventDetailModal } from '../components/Events.jsx';

const PAGE_SIZE = 12;

const ORDER_OPTIONS = [
  { value: 'recent', label: 'Más recientes primero' },
  { value: 'oldest', label: 'Más antiguos primero' },
];

// Decisión de diseño (ver nota extensa en FASE-06-07-08-CONTENIDO-REAL.md):
// "Ordenar por" (orden cronológico) y "Mostrar" (qué subconjunto de
// contenido) son dos controles separados, no uno combinado — son
// conceptualmente independientes (se puede querer, por ejemplo, "solo
// eventos realizados" ordenados de más antiguo a más reciente) y meterlos
// en un único selector con 4 opciones mezcladas habría sido menos claro que
// dos selects con 2-3 opciones cada uno.
const STATUS_OPTIONS = [
  { value: 'all', label: 'Todo el contenido' },
  { value: 'completed', label: 'Solo eventos realizados' },
  { value: 'upcoming', label: 'Solo próximos eventos' },
];

const selectStyle = {
  fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, color: 'var(--navy-900)',
  padding: '8px 12px', borderRadius: 9, border: '1px solid var(--gray-200)', background: 'white', cursor: 'pointer',
};

function VideotecaCard({ item, catsById, onOpen }) {
  const [hov, setHov] = React.useState(false);
  const cat = item.kind === 'video' ? (catsById[item.cat] || { color: 'var(--navy-900)', label: '' }) : null;
  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: '#021847', borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: hov ? '0 10px 26px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.2)',
        transform: hov ? 'translateY(-3px)' : 'none', transition: 'box-shadow 200ms, transform 200ms',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: '#0b1a3a' }}>
        {item.thumb && <img src={item.thumb} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.05)' : 'none', transition: 'transform 320ms' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(2,12,36,0) 40%,rgba(2,12,36,0.5))' }}></div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: hov ? 'linear-gradient(135deg,#FF6707,#FF8C3A)' : 'rgba(2,12,36,0.55)',
            border: '1.5px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 200ms',
          }}>
            <Icon name={item.kind === 'event' ? 'calendar' : 'play'} style={{ width: 18, height: 18, color: 'white', marginLeft: item.kind === 'event' ? 0 : 2 }} />
          </div>
        </div>
        {item.kind === 'event' && item.isUpcoming && (
          <span style={{ position: 'absolute', top: 8, left: 8, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'white', background: '#FF6707', borderRadius: 6, padding: '3px 8px' }}>
            Próximamente
          </span>
        )}
        {item.kind === 'video' && item.dur && (
          <span style={{ position: 'absolute', bottom: 8, right: 8, fontSize: 10.5, fontWeight: 700, color: 'white', background: 'rgba(2,12,36,0.7)', borderRadius: 6, padding: '2px 7px' }}>{item.dur}</span>
        )}
      </div>
      <div style={{ padding: '11px 12px 13px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1.32, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.6em' }}>{item.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          {cat ? (
            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.02em', color: cat.color, background: 'white', borderRadius: 999, padding: '2px 8px' }}>{cat.label}</span>
          ) : (
            <span style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.55)' }}>Evento</span>
          )}
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon name="calendar" style={{ width: 11, height: 11 }} />{item.date}
          </span>
        </div>
      </div>
    </div>
  );
}

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): reemplaza al
// popup VideoLibraryModal — "Ver todos los videos" ahora navega acá en vez
// de abrir un popup. Combina content_items(type='video') + events
// (próximos y realizados) en un solo listado paginado.
export function VideotecaPage() {
  const navigate = useNavigate();
  const [category, setCategory] = React.useState('all');
  const [order, setOrder] = React.useState('recent');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const [openEvent, setOpenEvent] = React.useState(null);

  const { data: cats } = useAsyncData(() => videotecaService.getVideotecaCategories(), []);
  const { data: modalidad } = useAsyncData(() => eventService.getModalidadConfig(), []);
  const { status, data: items, error } = useAsyncData(
    () => videotecaService.getVideotecaItems({ category, order, statusFilter }),
    [category, order, statusFilter]
  );

  const catsById = React.useMemo(() => Object.fromEntries((cats || []).map((c) => [c.id, c])), [cats]);

  React.useEffect(() => { setPage(1); }, [category, order, statusFilter]);

  const allItems = items || [];
  const totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
  const pageItems = allItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Los eventos "PRÓXIMAMENTE" no tienen página de detalle propia — abren
  // el mismo popup que ya usa la sección de Eventos (EventDetailModal), en
  // vez de navegar. Videos reales y eventos ya realizados sí navegan a
  // /videoteca/:slug.
  const handleOpen = (item) => {
    if (item.kind === 'event' && item.isUpcoming) { setOpenEvent(item.eventData); return; }
    navigate(`/videoteca/${item.slug}`);
  };

  // El filtro de categoría no tiene efecto sobre "solo eventos" (ver
  // decisión documentada en videotecaService.js) — se atenúa y deshabilita
  // visualmente en vez de dejarlo interactivo sin efecto aparente.
  const categoryDisabled = statusFilter !== 'all';

  return (
    <div className="section-card" style={{ padding: '28px 28px 4px' }}>
      <div style={{ marginBottom: 20 }}>
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Videos y Webinars' }]} />
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0050C8', marginBottom: 6 }}>Videos y Webinars</div>
        <h1 style={{ fontSize: 'clamp(1.5rem,2.4vw,2rem)', fontWeight: 700, color: 'var(--navy-900)', margin: '0 0 8px' }}>
          Explora <span style={{ background: 'var(--grad-title)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Videos y Webinars</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--gray-500)', margin: 0, maxWidth: 640, lineHeight: 1.6 }}>
          Webinars, cápsulas, charlas y registros de eventos, reunidos en un solo lugar.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', opacity: categoryDisabled ? 0.4 : 1, pointerEvents: categoryDisabled ? 'none' : 'auto', transition: 'opacity 150ms' }}>
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
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-400)' }}>Ordenar por</span>
            <select value={order} onChange={(e) => setOrder(e.target.value)} style={selectStyle}>
              {ORDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-400)' }}>Mostrar</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
              {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      {status === 'loading' && <LoadingState label="Cargando contenido…" />}
      {status === 'error' && <ErrorState label="No pudimos cargar la videoteca." error={error} />}
      {status === 'success' && (
        pageItems.length === 0 ? (
          <EmptyState label="No hay contenido para esta combinación de filtros." icon="film" />
        ) : (
          <div className="videoteca-grid">
            {pageItems.map((item) => (
              <VideotecaCard key={`${item.kind}-${item.id}`} item={item} catsById={catsById} onOpen={() => handleOpen(item)} />
            ))}
          </div>
        )
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {openEvent && <EventDetailModal event={openEvent} modalidadById={modalidad || {}} onClose={() => setOpenEvent(null)} />}
    </div>
  );
}
