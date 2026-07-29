import React from 'react';
import { Icon } from './Icon.jsx';

// Paginación estilo WordPress: números de página + anterior/siguiente.
// Extraído de src/admin/AdminWidgets.jsx (ver ajuste posterior en
// FASE-06-07-08-CONTENIDO-REAL.md — se movió acá para reutilizarlo también
// en la página pública /videoteca en vez de duplicarlo). Estilos inline
// propios (no depende de admin.css) para poder usarse tanto en el panel
// admin como en el portal público. Con los volúmenes de contenido de este
// sitio (decenas de filas, no miles) no hace falta truncar la lista de
// páginas con "…".
const btnStyle = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
  fontSize: 12, fontWeight: 700, borderRadius: 8, padding: '6px 11px',
  cursor: 'pointer', border: '1px solid var(--gray-200)', background: 'white', color: 'var(--gray-600)',
  fontFamily: 'inherit', minWidth: 30,
};

export function Pagination({ page, totalPages, onChange, bordered = false }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'14px 20px', borderTop: bordered ? '1px solid var(--gray-200)' : 'none' }}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        style={{ ...btnStyle, opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? 'default' : 'pointer' }}
      >
        <Icon name="chevron-left" style={{ width:13, height:13 }} />
      </button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          style={{
            ...btnStyle,
            fontWeight: p === page ? 700 : 600,
            background: p === page ? '#0050C8' : 'white',
            color: p === page ? 'white' : 'var(--gray-600)',
            borderColor: p === page ? '#0050C8' : 'var(--gray-200)',
          }}
        >{p}</button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        style={{ ...btnStyle, opacity: page === totalPages ? 0.4 : 1, cursor: page === totalPages ? 'default' : 'pointer' }}
      >
        <Icon name="chevron-right" style={{ width:13, height:13 }} />
      </button>
    </div>
  );
}
