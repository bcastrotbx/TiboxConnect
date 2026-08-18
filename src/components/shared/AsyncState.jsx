import React from 'react';
import { Icon } from './Icon.jsx';

// Estados de carga/vacío/error reutilizables para las secciones que ya
// consumen src/services/* vía useAsyncData. `tone="dark"` es para paneles
// sobre fondo navy (--grad-corporate); por defecto es para tarjetas claras.
const TONES = {
  light: { text:'var(--gray-500)', textStrong:'var(--navy-900)', border:'var(--gray-200)', accent:'#0050C8' },
  dark:  { text:'rgba(255,255,255,0.65)', textStrong:'white', border:'rgba(255,255,255,0.15)', accent:'var(--brand-cyan)' },
};

export function LoadingState({ label = 'Cargando…', tone = 'light', minHeight = 160 }) {
  const t = TONES[tone];
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, minHeight, padding:'24px 20px', color:t.text }}>
      <Icon name="loader-2" className="tbx-spin" style={{ width:22, height:22 }} />
      <span style={{ fontSize:13, fontWeight:600 }}>{label}</span>
    </div>
  );
}

export function EmptyState({ label = 'No hay contenido para mostrar todavía.', icon = 'inbox', tone = 'light', minHeight = 160 }) {
  const t = TONES[tone];
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, minHeight, padding:'24px 20px', color:t.text, textAlign:'center' }}>
      <Icon name={icon} style={{ width:24, height:24 }} />
      <span style={{ fontSize:13.5, fontWeight:600, maxWidth:320 }}>{label}</span>
    </div>
  );
}

export function ErrorState({ label = 'No pudimos cargar este contenido. Inténtalo nuevamente.', onRetry, tone = 'light', minHeight = 160 }) {
  const t = TONES[tone];
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, minHeight, padding:'24px 20px', color:t.text, textAlign:'center' }}>
      <Icon name="alert-triangle" style={{ width:24, height:24, color:'#c0392b' }} />
      <span style={{ fontSize:13.5, fontWeight:600, color:t.textStrong, maxWidth:340 }}>{label}</span>
      {onRetry && (
        <button onClick={onRetry} style={{ marginTop:2, fontSize:12.5, fontWeight:700, color:t.accent, background:'none', border:`1px solid ${t.border}`, borderRadius:8, padding:'7px 14px', cursor:'pointer' }}>
          Reintentar
        </button>
      )}
    </div>
  );
}
