/* @ds-bundle: {"format":3,"namespace":"TIBOXDesignSystem_6dc0b3","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"ServiceCard","sourcePath":"components/core/ServiceCard.jsx"},{"name":"Stat","sourcePath":"components/core/Stat.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"7fd50d5b5eda","components/core/Button.jsx":"fbafe52aa391","components/core/Card.jsx":"4d08dc46252f","components/core/Eyebrow.jsx":"f24ee3a08b50","components/core/ServiceCard.jsx":"39fdde8b0f9b","components/core/Stat.jsx":"d3181b33d70f","components/forms/Input.jsx":"865a41ed8363","ui_kits/website/Approach.jsx":"4c98f41c6ee7","ui_kits/website/Contact.jsx":"de145515a254","ui_kits/website/Footer.jsx":"c3896c1bb969","ui_kits/website/Header.jsx":"05bb7c7ec701","ui_kits/website/Hero.jsx":"b624aaeeee05","ui_kits/website/Services.jsx":"3b972001a943"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TIBOXDesignSystem_6dc0b3 = window.TIBOXDesignSystem_6dc0b3 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
/**
 * TIBOX Badge / pill label. Tones map to status + brand accents.
 * Use `unit` to tint with a business-unit color.
 */
function Badge({
  children,
  tone = 'neutral',
  unit = null,
  soft = true,
  style = {}
}) {
  const unitColors = {
    analitica: '#ffb300',
    ciber: '#ec4f7e',
    consultoria: '#fe8a57',
    infra: '#0288ea',
    cloud: '#8a5cf0',
    smart: '#7ba428'
  };
  const tones = {
    neutral: {
      fg: 'var(--navy-700)',
      bg: 'var(--gray-100)'
    },
    cyan: {
      fg: 'var(--brand-cyan-700)',
      bg: 'rgba(0,200,250,0.14)'
    },
    success: {
      fg: '#0c7a45',
      bg: 'rgba(22,179,100,0.14)'
    },
    warning: {
      fg: '#9a6800',
      bg: 'rgba(255,179,0,0.18)'
    },
    danger: {
      fg: '#b3271f',
      bg: 'rgba(240,69,58,0.14)'
    }
  };
  let fg, bg;
  if (unit && unitColors[unit]) {
    fg = unitColors[unit];
    bg = soft ? `color-mix(in srgb, ${unitColors[unit]} 16%, white)` : unitColors[unit];
    if (!soft) fg = '#ffffff';
  } else {
    const t = tones[tone] || tones.neutral;
    fg = soft ? t.fg : '#ffffff';
    bg = soft ? t.bg : t.fg;
  }
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: '12px',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      padding: '5px 12px',
      borderRadius: 'var(--radius-pill)',
      color: fg,
      background: bg,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TIBOX Button — primary brand action control.
 * Variants: primary (cyan + glow), secondary (navy), outline, ghost.
 * On dark surfaces pass onDark for the outline/ghost variants.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  onDark = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      fontSize: '14px',
      padding: '8px 16px',
      height: 38,
      radius: 'var(--radius-sm)',
      gap: 8
    },
    md: {
      fontSize: '16px',
      padding: '12px 24px',
      height: 48,
      radius: 'var(--radius-md)',
      gap: 10
    },
    lg: {
      fontSize: '18px',
      padding: '16px 32px',
      height: 58,
      radius: 'var(--radius-md)',
      gap: 12
    }
  };
  const s = sizes[size] || sizes.md;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap + 'px',
    fontFamily: 'var(--font-sans)',
    fontWeight: 700,
    fontSize: s.fontSize,
    letterSpacing: '0.01em',
    lineHeight: 1,
    height: s.height + 'px',
    padding: s.padding,
    width: fullWidth ? '100%' : 'auto',
    borderRadius: s.radius,
    border: '2px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    WebkitTapHighlightColor: 'transparent'
  };
  const variants = {
    primary: {
      background: 'var(--brand-cyan)',
      color: '#021233',
      boxShadow: 'var(--glow-cyan-soft)'
    },
    secondary: {
      background: 'var(--navy-900)',
      color: '#ffffff'
    },
    outline: {
      background: 'transparent',
      color: onDark ? '#ffffff' : 'var(--navy-900)',
      borderColor: onDark ? 'rgba(255,255,255,0.35)' : 'var(--border-default)'
    },
    ghost: {
      background: 'transparent',
      color: onDark ? '#ffffff' : 'var(--accent-press)'
    }
  };
  const hover = {
    primary: (e, on) => {
      e.currentTarget.style.background = on ? 'var(--accent-hover)' : 'var(--brand-cyan)';
      e.currentTarget.style.boxShadow = on ? 'var(--glow-cyan)' : 'var(--glow-cyan-soft)';
      e.currentTarget.style.transform = on ? 'translateY(-1px)' : 'translateY(0)';
    },
    secondary: (e, on) => {
      e.currentTarget.style.background = on ? 'var(--navy-700)' : 'var(--navy-900)';
      e.currentTarget.style.transform = on ? 'translateY(-1px)' : 'translateY(0)';
    },
    outline: (e, on) => {
      e.currentTarget.style.background = on ? onDark ? 'rgba(255,255,255,0.08)' : 'var(--gray-50)' : 'transparent';
    },
    ghost: (e, on) => {
      e.currentTarget.style.background = on ? onDark ? 'rgba(255,255,255,0.08)' : 'var(--gray-100)' : 'transparent';
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    onMouseEnter: e => !disabled && hover[variant](e, true),
    onMouseLeave: e => !disabled && hover[variant](e, false),
    onMouseDown: e => !disabled && (e.currentTarget.style.transform = 'scale(0.97)'),
    onMouseUp: e => !disabled && (e.currentTarget.style.transform = 'translateY(-1px)')
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TIBOX Card — base surface. `variant` controls the look:
 * light (white on light bg), glass (frosted on navy), navy (elevated dark).
 * `interactive` adds hover-lift.
 */
function Card({
  children,
  variant = 'light',
  interactive = false,
  padding = 'var(--space-6)',
  style = {},
  ...rest
}) {
  const variants = {
    light: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-md)',
      color: 'var(--text-body)'
    },
    glass: {
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.14)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: 'var(--shadow-dark)',
      color: '#ffffff'
    },
    navy: {
      background: 'var(--navy-800)',
      border: '1px solid rgba(255,255,255,0.10)',
      boxShadow: 'var(--shadow-dark)',
      color: '#ffffff'
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderRadius: 'var(--radius-lg)',
      padding,
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      ...variants[variant],
      ...style
    },
    onMouseEnter: e => {
      if (!interactive) return;
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = variant === 'light' ? 'var(--shadow-lg)' : 'var(--shadow-xl)';
    },
    onMouseLeave: e => {
      if (!interactive) return;
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = variants[variant].boxShadow;
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
/**
 * TIBOX Eyebrow / overline — uppercase kicker above headings.
 * Optional leading tick mark in cyan (or a unit color).
 */
function Eyebrow({
  children,
  color = 'var(--accent-press)',
  tick = true,
  onDark = false,
  style = {}
}) {
  const c = onDark ? 'var(--brand-cyan)' : color;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: '12px',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: c,
      ...style
    }
  }, tick && /*#__PURE__*/React.createElement("span", {
    style: {
      width: '22px',
      height: '2px',
      background: c,
      borderRadius: '2px',
      display: 'inline-block'
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/ServiceCard.jsx
try { (() => {
const UNIT = {
  analitica: {
    name: 'Analítica TI',
    grad: 'linear-gradient(90deg,#ffab00,#ffee00)',
    solid: '#ffb300'
  },
  ciber: {
    name: 'Ciberseguridad',
    grad: 'linear-gradient(135deg,#d957c5,#f84f66)',
    solid: '#ec4f7e'
  },
  consultoria: {
    name: 'Consultoría TI',
    grad: 'linear-gradient(135deg,#fec959,#fd5856)',
    solid: '#fe8a57'
  },
  infra: {
    name: 'Infraestructura TI',
    grad: 'linear-gradient(135deg,#0056e9,#02b8ea)',
    solid: '#0288ea'
  },
  cloud: {
    name: 'Soluciones Cloud',
    grad: 'linear-gradient(135deg,#b461f7,#5650a8)',
    solid: '#8a5cf0'
  },
  smart: {
    name: 'Soluciones Inteligentes',
    grad: 'linear-gradient(90deg,#aecf40,#7ccc85)',
    solid: '#7ba428'
  }
};

/**
 * TIBOX ServiceCard — business-unit tile. Carries the unit's gradient
 * accent bar + badge icon, title, description and a quiet CTA.
 * Pass `badgeSrc` (path to the unit's logo-*.svg) for the icon.
 */
function ServiceCard({
  unit = 'infra',
  title,
  description,
  cta = 'Conocer más',
  badgeSrc = null,
  onDark = false,
  onClick,
  style = {}
}) {
  const u = UNIT[unit] || UNIT.infra;
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    variant: onDark ? 'glass' : 'light',
    interactive: true,
    padding: "0",
    onClick: onClick,
    style: {
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '5px',
      background: u.grad
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '54px',
      height: '54px',
      borderRadius: 'var(--radius-md)',
      display: 'grid',
      placeItems: 'center',
      flex: 'none',
      background: onDark ? 'rgba(255,255,255,0.06)' : 'var(--gray-50)',
      border: onDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid var(--border-subtle)'
    }
  }, badgeSrc ? /*#__PURE__*/React.createElement("img", {
    src: badgeSrc,
    alt: "",
    style: {
      width: '36px',
      height: '32px',
      objectFit: 'contain'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: '24px',
      height: '24px',
      borderRadius: '6px',
      background: u.grad
    }
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '20px',
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
      margin: 0,
      color: onDark ? '#ffffff' : 'var(--text-heading)'
    }
  }, title || u.name)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '15.5px',
      lineHeight: 1.6,
      margin: 0,
      color: onDark ? 'var(--navy-100)' : 'var(--text-body)'
    }
  }, description), cta && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-5)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: '14px',
      color: u.solid
    }
  }, cta, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: '16px',
      transform: 'translateY(0.5px)'
    }
  }, "\u2192"))));
}
Object.assign(__ds_scope, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ServiceCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Stat.jsx
try { (() => {
/**
 * TIBOX Stat — a single proof point (value + label).
 * Value uses the cube gradient text on dark, solid cyan on light.
 */
function Stat({
  value,
  label,
  onDark = false,
  align = 'left',
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '44px',
      lineHeight: 1,
      letterSpacing: '-0.02em',
      ...(onDark ? {
        background: 'var(--grad-title)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent'
      } : {
        color: 'var(--brand-cyan-700)'
      })
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '8px',
      fontFamily: 'var(--font-sans)',
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: '0.01em',
      lineHeight: 1.4,
      color: onDark ? 'var(--navy-100)' : 'var(--text-muted)'
    }
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Stat.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TIBOX Input — labelled text field with helper / error states and
 * an optional leading icon. Cyan focus ring matches the brand.
 */
function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  helper,
  error,
  required = false,
  disabled = false,
  iconLeft = null,
  id,
  style = {},
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const inputId = id || (label ? 'in-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const borderColor = error ? 'var(--danger)' : focused ? 'var(--brand-cyan)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '7px',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '14px',
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--danger)',
      marginLeft: 3
    }
  }, "*")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 14,
      display: 'inline-flex',
      color: 'var(--text-muted)',
      pointerEvents: 'none'
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    required: required,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'var(--font-sans)',
      fontSize: '16px',
      color: 'var(--text-heading)',
      height: '48px',
      padding: iconLeft ? '0 16px 0 42px' : '0 16px',
      background: disabled ? 'var(--gray-100)' : 'var(--white)',
      border: '2px solid ' + borderColor,
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      boxShadow: focused && !error ? '0 0 0 4px var(--focus-ring)' : 'none',
      transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)'
    }
  }, rest))), (error || helper) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '13px',
      color: error ? 'var(--danger)' : 'var(--text-muted)'
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Approach.jsx
try { (() => {
// TIBOX marketing site — value props + monitoring panel
function Approach() {
  const values = [{
    icon: 'shield-check',
    t: 'Continuidad operacional',
    d: 'Infraestructura redundante y monitoreo proactivo para que tu negocio nunca se detenga.'
  }, {
    icon: 'lock',
    t: 'Seguridad de la información',
    d: 'Protección por capas, cumplimiento y respuesta ante incidentes en tiempo real.'
  }, {
    icon: 'headset',
    t: 'Soporte cercano',
    d: 'Un equipo consultivo que conoce tu empresa y responde cuando lo necesitas.'
  }, {
    icon: 'trending-up',
    t: 'Mejora continua',
    d: 'Optimizamos procesos con automatización e inteligencia aplicada a tus datos.'
  }];
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("section", {
    id: "nosotros",
    style: {
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--section-y) var(--container-pad)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Un socio, no un proveedor"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(2rem,3.4vw,2.75rem)',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      margin: '16px 0 0'
    }
  }, "Tecnolog\xEDa confiable, gestionada de principio a fin"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-body)',
      fontSize: 18,
      lineHeight: 1.6,
      margin: '16px 0 36px'
    }
  }, "Actuamos como tu \xE1rea de TI extendida: diagnosticamos, implementamos y monitoreamos, para que tu equipo se concentre en hacer crecer el negocio."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 22
    }
  }, values.map(v => /*#__PURE__*/React.createElement("div", {
    key: v.t,
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      flex: 'none',
      borderRadius: 'var(--radius-md)',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--brand-cyan-700)',
      background: 'rgba(0,200,250,0.12)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": v.icon,
    style: {
      width: 22,
      height: 22
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      margin: 0,
      color: 'var(--text-heading)'
    }
  }, v.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15.5,
      lineHeight: 1.55,
      margin: '5px 0 0',
      color: 'var(--text-muted)'
    }
  }, v.d)))))), /*#__PURE__*/React.createElement(MonitorPanel, null)));
}
function MonitorPanel() {
  const rows = [{
    name: 'Servidor principal',
    meta: 'Santiago · DC1',
    status: 'Operativo',
    tone: 'success'
  }, {
    name: 'Firewall perimetral',
    meta: 'Reglas activas',
    status: 'Protegido',
    tone: 'cyan'
  }, {
    name: 'Respaldo cloud',
    meta: 'Última sync 04:12',
    status: 'Operativo',
    tone: 'success'
  }, {
    name: 'Nodo de red — Sucursal',
    meta: 'Latencia 18ms',
    status: 'Mantención',
    tone: 'warning'
  }];
  const dot = {
    success: '#16b364',
    cyan: '#00c8fa',
    warning: '#ffb300'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -30,
      borderRadius: 28,
      zIndex: 0,
      background: 'var(--grad-corporate)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "tbx-grid-overlay",
    style: {
      position: 'absolute',
      inset: -30,
      borderRadius: 28,
      zIndex: 0,
      opacity: .6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      padding: 8
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "glass",
    padding: "22px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      color: '#fff',
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "activity",
    style: {
      width: 18,
      height: 18,
      color: 'var(--brand-cyan)'
    }
  }), "Monitoreo en tiempo real"), /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    soft: false
  }, "En l\xEDnea")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10
    }
  }, rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.name,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '13px 15px',
      borderRadius: 12,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.09)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: dot[r.tone],
      boxShadow: '0 0 10px ' + dot[r.tone]
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#fff',
      fontWeight: 600,
      fontSize: 14.5
    }
  }, r.name), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--navy-200)',
      fontSize: 12.5
    }
  }, r.meta))), /*#__PURE__*/React.createElement("span", {
    style: {
      color: dot[r.tone],
      fontWeight: 700,
      fontSize: 13
    }
  }, r.status)))))));
}
window.Approach = Approach;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Approach.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Contact.jsx
try { (() => {
// TIBOX marketing site — CTA + contact form (interactive)
function Contact({
  panelRef
}) {
  const [sent, setSent] = React.useState(false);
  const [form, setForm] = React.useState({
    nombre: '',
    empresa: '',
    email: '',
    mensaje: ''
  });
  const set = k => e => setForm({
    ...form,
    [k]: e.target.value
  });
  const submit = e => {
    e.preventDefault();
    setSent(true);
  };
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("section", {
    id: "contacto",
    ref: panelRef,
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--grad-corporate)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tbx-grid-overlay",
    style: {
      position: 'absolute',
      inset: 0,
      opacity: .6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      width: 520,
      height: 520,
      borderRadius: '50%',
      left: -160,
      top: -160,
      background: 'radial-gradient(circle, rgba(0,200,250,0.18), transparent 65%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--section-y) var(--container-pad)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    onDark: true
  }, "Conversemos"), /*#__PURE__*/React.createElement("h2", {
    style: {
      color: '#fff',
      fontSize: 'clamp(2rem,3.6vw,3rem)',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      margin: '16px 0 0',
      lineHeight: 1.1
    }
  }, "\xBFListo para optimizar la tecnolog\xEDa de tu empresa?"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--navy-100)',
      fontSize: 18,
      lineHeight: 1.6,
      margin: '18px 0 28px',
      maxWidth: 460
    }
  }, "Agenda una asesor\xEDa sin costo. Analizamos tu situaci\xF3n actual y te proponemos un plan tecnol\xF3gico a la medida de tu negocio."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 14
    }
  }, [['mail', 'contacto@tibox.cl'], ['phone', '+56 2 2345 6789'], ['map-pin', 'Santiago, Chile']].map(([ic, tx]) => /*#__PURE__*/React.createElement("div", {
    key: tx,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      color: 'var(--navy-100)',
      fontSize: 15.5
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": ic,
    style: {
      width: 18,
      height: 18,
      color: 'var(--brand-cyan)'
    }
  }), tx)))), /*#__PURE__*/React.createElement(Card, {
    variant: "light",
    padding: "28px",
    style: {
      borderRadius: 'var(--radius-xl)'
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '30px 10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      margin: '0 auto 18px',
      borderRadius: '50%',
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(22,179,100,0.12)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check",
    style: {
      width: 30,
      height: 30,
      color: 'var(--success)'
    }
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      margin: 0
    }
  }, "\xA1Solicitud enviada!"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      margin: '10px 0 22px',
      fontSize: 15.5
    }
  }, "Gracias, ", form.nombre || 'estimado', ". Un especialista de TIBOX te contactar\xE1 en menos de 24 horas."), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => {
      setSent(false);
      setForm({
        nombre: '',
        empresa: '',
        email: '',
        mensaje: ''
      });
    }
  }, "Enviar otra consulta")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nombre",
    placeholder: "Tu nombre",
    value: form.nombre,
    onChange: set('nombre'),
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Empresa",
    placeholder: "Tu empresa",
    value: form.empresa,
    onChange: set('empresa'),
    required: true
  })), /*#__PURE__*/React.createElement(Input, {
    label: "Correo corporativo",
    type: "email",
    placeholder: "tu@empresa.cl",
    value: form.email,
    onChange: set('email'),
    required: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, "\xBFC\xF3mo podemos ayudarte?"), /*#__PURE__*/React.createElement("textarea", {
    value: form.mensaje,
    onChange: set('mensaje'),
    rows: 3,
    placeholder: "Cu\xE9ntanos brevemente sobre tu proyecto",
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      color: 'var(--text-heading)',
      padding: '12px 16px',
      border: '2px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      resize: 'vertical'
    },
    onFocus: e => {
      e.target.style.borderColor = 'var(--brand-cyan)';
      e.target.style.boxShadow = '0 0 0 4px var(--focus-ring)';
    },
    onBlur: e => {
      e.target.style.borderColor = 'var(--border-default)';
      e.target.style.boxShadow = 'none';
    }
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    onClick: submit
  }, "Solicitar asesor\xEDa gratuita")))));
}
window.Contact = Contact;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
// TIBOX marketing site — footer
function Footer() {
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const cols = [{
    h: 'Servicios',
    items: ['Infraestructura TI', 'Ciberseguridad', 'Soluciones Cloud', 'Consultoría TI', 'Analítica TI', 'Soluciones Inteligentes']
  }, {
    h: 'Empresa',
    items: ['Nosotros', 'Casos de éxito', 'Partners', 'Trabaja con nosotros']
  }, {
    h: 'Recursos',
    items: ['Blog', 'Centro de ayuda', 'Estado de servicios', 'Contacto']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--navy-950)',
      borderTop: '1px solid rgba(255,255,255,0.08)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '64px var(--container-pad) 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr repeat(3,1fr)',
      gap: 40
    },
    className: "tbx-foot-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-tibox.png",
    alt: "TIBOX",
    style: {
      height: 30,
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--navy-200)',
      fontSize: 14.5,
      lineHeight: 1.6,
      maxWidth: 280
    }
  }, "Tu socio tecnol\xF3gico en Chile. Infraestructura, seguridad y soluciones gestionadas para la continuidad de tu empresa."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 20
    }
  }, ['linkedin', 'instagram', 'youtube'].map(s => /*#__PURE__*/React.createElement("a", {
    key: s,
    href: "#",
    style: {
      width: 38,
      height: 38,
      borderRadius: 10,
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": s,
    style: {
      width: 17,
      height: 17
    }
  }))))), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("h5", {
    style: {
      color: '#fff',
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      margin: '0 0 16px'
    }
  }, c.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'grid',
      gap: 11
    }
  }, c.items.map(i => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--navy-200)',
      fontSize: 14.5,
      textDecoration: 'none'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--brand-cyan)',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--navy-200)'
  }, i))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48,
      paddingTop: 24,
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      color: 'var(--navy-300)',
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 TIBOX SpA. Todos los derechos reservados."), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--navy-300)',
      textDecoration: 'none'
    }
  }, "Privacidad"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--navy-300)',
      textDecoration: 'none'
    }
  }, "T\xE9rminos")))));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
// TIBOX marketing site — sticky header / nav
function Header({
  onContact
}) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = document.querySelector('[data-scroll]') || window;
    const onScroll = () => {
      const y = el === window ? window.scrollY : el.scrollTop;
      setScrolled(y > 12);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);
  const links = ['Servicios', 'Soluciones', 'Nosotros', 'Casos'];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: scrolled ? 'rgba(2,18,51,0.82)' : 'transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      transition: 'all var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '16px var(--container-pad)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-tibox.png",
    alt: "TIBOX",
    style: {
      height: 30
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 30,
      alignItems: 'center'
    },
    className: "tbx-navlinks"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: '#' + l.toLowerCase(),
    style: {
      color: 'rgba(255,255,255,0.82)',
      fontSize: 15,
      fontWeight: 600,
      textDecoration: 'none',
      transition: 'color var(--dur-fast)'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--brand-cyan)',
    onMouseLeave: e => e.currentTarget.style.color = 'rgba(255,255,255,0.82)'
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: onContact
  }, "Agenda una asesor\xEDa"))));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
// TIBOX marketing site — hero (navy corporate surface)
function Hero({
  onContact
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--grad-corporate)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tbx-grid-overlay",
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.7
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      width: 620,
      height: 620,
      borderRadius: '50%',
      right: -160,
      top: -200,
      background: 'radial-gradient(circle, rgba(0,200,250,0.22), transparent 65%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      width: 420,
      height: 420,
      borderRadius: '50%',
      left: -140,
      bottom: -200,
      background: 'radial-gradient(circle, rgba(255,103,7,0.14), transparent 65%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'clamp(5rem,11vw,8.5rem) var(--container-pad) clamp(3.5rem,6vw,5rem)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    onDark: true
  }, "Socio tecnol\xF3gico para empresas"), /*#__PURE__*/React.createElement("h1", {
    style: {
      color: '#fff',
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.04,
      fontSize: 'clamp(2.6rem, 5.6vw, 4.4rem)',
      margin: '20px 0 0'
    }
  }, "Tecnolog\xEDa que impulsa la ", /*#__PURE__*/React.createElement("span", {
    className: "tbx-gradient-text"
  }, "continuidad"), " de tu empresa"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--navy-100)',
      fontSize: 'clamp(1.05rem,1.6vw,1.3rem)',
      lineHeight: 1.6,
      margin: '24px 0 0',
      maxWidth: 620
    }
  }, "En TIBOX optimizamos los procesos de tu organizaci\xF3n con infraestructura, ciberseguridad y soluciones cloud gestionadas de principio a fin. Profesionales, seguras y a tu medida."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginTop: 36,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: onContact
  }, "Agenda una asesor\xEDa"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "lg",
    onDark: true
  }, "Conoce nuestros servicios"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
      gap: 28,
      marginTop: 'clamp(3rem,6vw,5rem)',
      paddingTop: 36,
      borderTop: '1px solid rgba(255,255,255,0.12)',
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "99.9%",
    label: "Disponibilidad garantizada",
    onDark: true
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "< 15 min",
    label: "Tiempo de respuesta",
    onDark: true
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "24/7",
    label: "Monitoreo y soporte",
    onDark: true
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "+15 a\xF1os",
    label: "Acompa\xF1ando empresas",
    onDark: true
  }))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Services.jsx
try { (() => {
// TIBOX marketing site — services grid (6 business units)
const SERVICES = [{
  unit: 'infra',
  badge: 'logo-infraestructura.png',
  title: 'Infraestructura TI',
  desc: 'Servidores, redes y data center con monitoreo y continuidad operacional 24/7.'
}, {
  unit: 'ciber',
  badge: 'logo-ciberseguridad.png',
  title: 'Ciberseguridad',
  desc: 'Protección, monitoreo y respuesta ante incidentes para resguardar tu información.'
}, {
  unit: 'cloud',
  badge: 'logo-soluciones-cloud.png',
  title: 'Soluciones Cloud',
  desc: 'Migración, gestión y optimización de entornos cloud escalables y seguros.'
}, {
  unit: 'consultoria',
  badge: 'logo-consultoria-ti.png',
  title: 'Consultoría TI',
  desc: 'Acompañamiento estratégico para alinear la tecnología con tus objetivos de negocio.'
}, {
  unit: 'analitica',
  badge: 'logo-analitica.png',
  title: 'Analítica TI',
  desc: 'Datos convertidos en decisiones con dashboards y reportería inteligente.'
}, {
  unit: 'smart',
  badge: 'logo-soluciones-inteligentes.png',
  title: 'Soluciones Inteligentes',
  desc: 'Automatización e inteligencia artificial aplicada a tus procesos.'
}];
function Services() {
  return /*#__PURE__*/React.createElement("section", {
    id: "servicios",
    style: {
      background: 'var(--surface-muted)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--section-y) var(--container-pad)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      maxWidth: 680,
      margin: '0 auto 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Nuestros servicios")), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(2rem,3.4vw,2.75rem)',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      margin: '16px 0 0'
    }
  }, "Soluciones tecnol\xF3gicas para cada \xE1rea de tu empresa"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-body)',
      fontSize: 18,
      lineHeight: 1.6,
      margin: '16px 0 0'
    }
  }, "Cada unidad de negocio trabaja como un equipo especializado, con un enfoque consultivo y orientado a resultados medibles.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
      gap: 24
    }
  }, SERVICES.map(s => /*#__PURE__*/React.createElement(ServiceCard, {
    key: s.unit,
    unit: s.unit,
    title: s.title,
    description: s.desc,
    badgeSrc: '../../assets/' + s.badge,
    onClick: () => {}
  })))));
}
window.Services = Services;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Services.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Input = __ds_scope.Input;

})();
