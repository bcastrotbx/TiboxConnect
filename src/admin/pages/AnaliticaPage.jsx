import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Icon } from '../../components/shared/Icon.jsx';
import { LoadingState, ErrorState, EmptyState } from '../../components/shared/AsyncState.jsx';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import * as analyticsService from '../../services/analyticsService.js';

const RANGE_OPTIONS = [
  { value: 7, label: 'Últimos 7 días' },
  { value: 30, label: 'Últimos 30 días' },
  { value: 90, label: 'Últimos 90 días' },
];

function StatCard({ icon, label, value }) {
  return (
    <div className="adm-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray-400)' }}>{label}</span>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(0,80,200,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} style={{ width: 14, height: 14, color: '#0050C8' }} />
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--navy-900,#021233)' }}>{value}</div>
    </div>
  );
}

// Ruta /admin/analitica — Fase Analítica 1 (ver
// docs/phases/FASE-10-ANALITICA-FASE1.md). Solo "Resumen general" y
// "Secciones más visitadas" por ahora; video/CTAs/formularios/Clarity
// quedan para fases siguientes, una vez que esta base esté probada en
// producción.
export function AnaliticaPage() {
  const [days, setDays] = React.useState(30);
  const { status, data, error } = useAsyncData(() => analyticsService.getPageViewStats({ days }), [days]);
  // Histórico mensual: independiente del selector de rango de arriba (7/30/90
  // días no alcanzan para mostrar tendencia mes a mes) — ventana fija de 6
  // meses, ver analyticsService.getMonthlyPageViews.
  const monthly = useAsyncData(() => analyticsService.getMonthlyPageViews({ months: 6 }), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-900,#021233)' }}>Resumen general</div>
          <p style={{ fontSize: 12.5, color: 'var(--gray-500)', margin: '4px 0 0' }}>
            Comportamiento anónimo de visitantes del portal — sin datos personales, sin IP como identificador.
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          style={{
            fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, color: 'var(--navy-900)',
            padding: '8px 12px', borderRadius: 9, border: '1px solid var(--gray-200)', background: 'white', cursor: 'pointer',
          }}
        >
          {RANGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {status === 'loading' && <LoadingState label="Cargando analítica…" />}
      {status === 'error' && <ErrorState label="No pudimos cargar la analítica." error={error} />}

      {status === 'success' && (
        <React.Fragment>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
            <StatCard icon="eye" label="Visitas totales" value={data.totalViews.toLocaleString('es-CL')} />
            <StatCard icon="users" label="Visitantes únicos" value={data.uniqueVisitors.toLocaleString('es-CL')} />
          </div>

          <div className="adm-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-900,#021233)', marginBottom: 16 }}>Histórico mensual</div>
            {monthly.status === 'loading' && <LoadingState label="Cargando histórico…" />}
            {monthly.status === 'error' && <ErrorState label="No pudimos cargar el histórico mensual." error={monthly.error} />}
            {monthly.status === 'success' && (
              monthly.data.every((m) => m.views === 0) ? (
                <EmptyState label="Todavía no hay visitas registradas en los últimos meses." icon="bar-chart-2" />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthly.data} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gray-200)" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--gray-500)' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--gray-500)' }} />
                    <Tooltip formatter={(value) => [value, 'Visitas']} />
                    <Bar dataKey="views" fill="#0050C8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )
            )}
          </div>

          <div className="adm-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-900,#021233)', marginBottom: 16 }}>Secciones más visitadas</div>
            {data.topSections.length === 0 ? (
              <EmptyState label="Todavía no hay visitas registradas en este rango." icon="bar-chart-2" />
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(200, data.topSections.length * 46)}>
                <BarChart data={data.topSections} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--gray-200)" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--gray-500)' }} />
                  <YAxis type="category" dataKey="label" width={150} tick={{ fontSize: 12, fill: 'var(--navy-900)' }} />
                  <Tooltip formatter={(value) => [value, 'Visitas']} />
                  <Bar dataKey="views" fill="#0050C8" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
