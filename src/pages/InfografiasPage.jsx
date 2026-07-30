import React from 'react';
import { Breadcrumb } from '../components/shared/Breadcrumb.jsx';
import { LoadingState, EmptyState, ErrorState } from '../components/shared/AsyncState.jsx';
import { Pagination } from '../components/shared/Pagination.jsx';
import { InfoCard, InfografiaModal } from '../components/Media.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import * as contentService from '../services/contentService.js';

const PAGE_SIZE = 12;

// Ajuste posterior — página propia de Infografías (ver nota extensa en
// FASE-06-07-08-CONTENIDO-REAL.md): mismo patrón ya usado en /videoteca
// (miga de pan, título, reseña, filtro por categoría, grilla 12/página con
// paginación). Reutiliza InfoCard e InfografiaModal de Media.jsx en vez de
// duplicarlos — el clic en una tarjeta abre el mismo popup con el flujo de
// descarga (lead) que ya existe, sin cambios.
export function InfografiasPage() {
  const [category, setCategory] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const [openInfo, setOpenInfo] = React.useState(null);

  const { data: channels } = useAsyncData(() => contentService.getChannels(), []);
  const { data: cats } = useAsyncData(() => contentService.getInfographicCategories(), []);
  const { status, data: items, error } = useAsyncData(() => contentService.getInfographics({ category }), [category]);

  React.useEffect(() => { setPage(1); }, [category]);

  const channelsById = channels || {};
  const allItems = items || [];
  const totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
  const pageItems = allItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="section-card" style={{ padding: '28px 28px 4px' }}>
      <div style={{ marginBottom: 20 }}>
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Infografías' }]} />
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0050C8', marginBottom: 6 }}>Infografías</div>
        <h1 style={{ fontSize: 'clamp(1.5rem,2.4vw,2rem)', fontWeight: 700, color: 'var(--navy-900)', margin: '0 0 8px' }}>
          Información visual, <span style={{ background: 'var(--grad-title)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>simple y al alcance</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--gray-500)', margin: 0, maxWidth: 640, lineHeight: 1.6 }}>
          Las piezas que publicamos en LinkedIn, Instagram y nuestros mailings, listas para descargar y compartir en tu organización.
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

      {status === 'loading' && <LoadingState label="Cargando infografías…" />}
      {status === 'error' && <ErrorState label="No pudimos cargar las infografías." error={error} />}
      {status === 'success' && (
        pageItems.length === 0 ? (
          <EmptyState label="No hay infografías para esta categoría." icon="pie-chart" />
        ) : (
          <div className="videoteca-grid">
            {pageItems.map((inf) => (
              <InfoCard key={inf.id} inf={inf} channelsById={channelsById} onOpen={setOpenInfo} />
            ))}
          </div>
        )
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {openInfo && <InfografiaModal info={openInfo} channelsById={channelsById} onClose={() => setOpenInfo(null)} />}
    </div>
  );
}
