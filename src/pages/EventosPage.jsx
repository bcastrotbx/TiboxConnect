import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/shared/Breadcrumb.jsx';
import { LoadingState, EmptyState, ErrorState } from '../components/shared/AsyncState.jsx';
import { Pagination } from '../components/shared/Pagination.jsx';
import { EventCard } from '../components/Events.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import * as eventService from '../services/eventService.js';

const PAGE_SIZE = 12;

// Ajuste posterior — página propia de Eventos (ver nota extensa en
// FASE-06-07-08-CONTENIDO-REAL.md): mismo patrón de /videoteca (miga de
// pan, título, reseña, grilla 12/página con paginación). A diferencia de
// Infografías/Tendencias, no hay filtro por categoría — `events` no tiene
// columna de categoría en el modelo de datos (mismo motivo por el que
// /videoteca oculta los eventos al filtrar por categoría). El listado
// combina próximos y realizados (eventService.getAllEvents(), próximos
// primero) reutilizando la misma EventCard del inicio, que ya distingue
// "PRÓXIMAMENTE" por su cuenta.
//
// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): "Ver detalles"
// pasó de abrir el popup del inicio (EventDetailModal/VistaModal) a navegar
// a una página propia (/eventos/:slug) — mismo patrón que Videoteca. El
// inicio (EventosPanel) sigue usando el popup, no se tocó.
export function EventosPage() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);

  const { status, data, error } = useAsyncData(() => Promise.all([
    eventService.getAllEvents(),
    eventService.getModalidadConfig(),
    eventService.getPartners(),
  ]).then(([events, modalidad, partners]) => ({ events, modalidad, partners })), []);

  const events = data?.events || [];
  const modalidadById = data?.modalidad || {};
  const partnersById = data?.partners || {};
  const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  const pageItems = events.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleVerDetalle = (ev) => navigate(`/eventos/${ev.slug}`);

  return (
    <div className="section-card" style={{ padding: '28px 28px 4px' }}>
      <div style={{ marginBottom: 20 }}>
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Eventos' }]} />
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand-cyan)', marginBottom: 6 }}>Eventos</div>
        <h1 style={{ fontSize: 'clamp(1.5rem,2.4vw,2rem)', fontWeight: 700, color: 'var(--navy-900)', margin: '0 0 8px' }}>
          Agenda y <span style={{ background: 'var(--grad-title)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Eventos TIBOX</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--gray-500)', margin: 0, maxWidth: 640, lineHeight: 1.6 }}>
          Revisa las próximas actividades de TIBOX y vuelve a ver lo mejor de nuestros eventos realizados.
        </p>
      </div>

      {status === 'loading' && <LoadingState label="Cargando eventos…" />}
      {status === 'error' && <ErrorState label="No pudimos cargar los eventos." error={error} />}
      {status === 'success' && (
        pageItems.length === 0 ? (
          <EmptyState label="Todavía no hay eventos publicados." icon="calendar-check" />
        ) : (
          <div className="videoteca-grid">
            {pageItems.map((ev) => (
              <EventCard key={ev.id} ev={ev} modalidadById={modalidadById} partnersById={partnersById} onVerDetalle={handleVerDetalle} />
            ))}
          </div>
        )
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
