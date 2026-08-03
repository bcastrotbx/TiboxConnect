import React from 'react';

// Sistema de jerarquía de botones del portal público (pedido de Braulio):
// antes casi todos los CTA del sitio usaban el mismo degradado naranja sin
// distinción de peso/tamaño, así que nada tenía prioridad visual clara.
// Se centralizan acá los 4 niveles para que quede en un solo lugar — evita
// que se repita la inconsistencia original (copiar el mismo inline style
// naranja en 10+ componentes distintos). No se toca el panel admin, que
// tiene su propio sistema de estilos (admin.css / AdminWidgets.jsx).

const ORANGE_GRADIENT = 'linear-gradient(135deg, #FF6707 0%, #FF8C3A 100%)';
// var(--u-infra-g) — degradado oficial "Infraestructura TI" (azul → cian)
// de la guía de marca (public/_ds/.../tokens/colors.css), no un azul nuevo.
const INFRA_GRADIENT = 'linear-gradient(135deg, #0056e9 0%, #02b8ea 100%)';

// Nivel 1 — Primario. El de mayor tamaño/peso del portal: slide del hero,
// "Ver publicación" (noticia destacada), "Enviar mi opinión", y — por
// pedido explícito de Braulio al aprobar este sistema — el resto de los
// CTA que ya cumplían esta misma función (acción principal de su pantalla):
// "Inscríbete aquí", "Descargar"/"Continuar a la descarga", "Enviar mensaje".
export function CtaPrimary({ as = 'button', disabled, style, children, ...props }) {
  const [hov, setHov] = React.useState(false);
  const Tag = as;
  return (
    <Tag
      {...props}
      disabled={as === 'button' ? disabled : undefined}
      onMouseEnter={(e) => { setHov(true); props.onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHov(false); props.onMouseLeave?.(e); }}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: disabled ? 'var(--gray-300)' : ORANGE_GRADIENT,
        color: 'white', fontSize: 14, fontWeight: 700, padding: '12px 24px',
        borderRadius: 10, border: 'none', cursor: disabled ? 'default' : 'pointer',
        textDecoration: 'none', whiteSpace: 'nowrap',
        boxShadow: disabled ? 'none' : (hov
          ? '0 0 0 1px rgba(255,140,58,0.5), 0 4px 20px rgba(255,103,7,0.6), 0 0 34px rgba(255,103,7,0.5)'
          : '0 0 0 1px rgba(255,140,58,0.4), 0 2px 14px rgba(255,103,7,0.5), 0 0 26px rgba(255,103,7,0.35)'),
        transform: hov && !disabled ? 'translateY(-2px)' : 'none',
        transition: 'transform 150ms, box-shadow 200ms',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

// Nivel 2 — Secundario. Un único uso hoy ("Crear Tickets" del header), se
// centraliza igual por si se necesita en otro lado más adelante. Mismo
// tamaño que el "Crear Tickets" original — solo cambia el color de fondo
// (antes compartía el naranja del Nivel 1, competía con el hero) y el
// tinte de la sombra, de naranja a azul.
export function CtaSecondary({ as = 'a', style, children, ...props }) {
  const [hov, setHov] = React.useState(false);
  const Tag = as;
  return (
    <Tag
      {...props}
      onMouseEnter={(e) => { setHov(true); props.onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHov(false); props.onMouseLeave?.(e); }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        fontSize: 13, fontWeight: 700, color: 'white',
        background: INFRA_GRADIENT,
        border: 'none', borderRadius: 10, padding: '8px 16px',
        cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none', flexShrink: 0,
        boxShadow: hov ? '0 4px 16px rgba(0,86,233,0.4)' : '0 2px 10px rgba(0,86,233,0.28)',
        transform: hov ? 'translateY(-1px)' : 'none',
        transition: 'transform 150ms, box-shadow 150ms',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

// Nivel 3 — CTA de tarjeta. Referencia: "Ver detalles" de EventCard
// (Events.jsx) — mismo porte y color se aplica a todas las tarjetas
// equivalentes (Videos, Infografías, Noticias/Tendencias). A diferencia de
// los Niveles 1/2, sí pueden repetirse varias veces en una misma pantalla
// (una por tarjeta de la grilla) — es la misma función en cada una.
export function CtaCard({ style, children, ...props }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      type="button"
      {...props}
      onMouseEnter={(e) => { setHov(true); props.onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHov(false); props.onMouseLeave?.(e); }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 12, fontWeight: 700, color: 'white',
        background: ORANGE_GRADIENT, border: 'none', borderRadius: 9,
        padding: '8px 16px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
        boxShadow: '0 2px 10px rgba(255,103,7,0.32)',
        transform: hov ? 'translateY(-1px)' : 'none',
        transition: 'transform 150ms',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// Nivel 4 — Enlace "ver todo". No es un botón: texto + flecha, sin fondo ni
// borde. `tone="dark"` para secciones sobre fondo navy (Infografías,
// Eventos — usa var(--brand-cyan), ya el acento de marca sobre fondo
// oscuro en el resto del portal); por defecto (`tone="light"`) usa #0050C8,
// el azul que ya usan de forma consistente los "eyebrow" de Explora,
// Videoteca e Infografías — no se inventa un tono nuevo para esto.
export function CtaLink({ as = 'button', tone = 'light', style, children, ...props }) {
  const [hov, setHov] = React.useState(false);
  const Tag = as;
  const color = tone === 'dark' ? 'var(--brand-cyan)' : '#0050C8';
  return (
    <Tag
      {...props}
      onMouseEnter={(e) => { setHov(true); props.onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHov(false); props.onMouseLeave?.(e); }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'none', border: 'none', padding: 0,
        color, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
        textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
        opacity: hov ? 0.72 : 1, transition: 'opacity 150ms',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
