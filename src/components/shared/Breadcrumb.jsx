import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon.jsx';

// Miga de pan compartida por las páginas propias del portal (/videoteca,
// /infografias, /tendencias, /eventos — ver ajuste posterior en
// FASE-06-07-08-CONTENIDO-REAL.md). `items`: [{label, to}], el último
// elemento es la página actual y nunca lleva link, tenga o no `to`.
export function Breadcrumb({ items }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, marginBottom: 14, flexWrap: 'wrap' }}>
      {items.map((it, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {i > 0 && <Icon name="chevron-right" style={{ width: 12, height: 12, color: 'var(--gray-300)' }} />}
            {isLast || !it.to ? (
              <span style={{ fontWeight: isLast ? 700 : 500, color: isLast ? 'var(--navy-900)' : 'var(--gray-500)' }}>{it.label}</span>
            ) : (
              <Link
                to={it.to}
                style={{ color: 'var(--gray-500)', textDecoration: 'none', fontWeight: 500, transition: 'color 150ms' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#0050C8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray-500)'; }}
              >
                {it.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
