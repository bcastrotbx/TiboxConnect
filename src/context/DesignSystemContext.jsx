import React from 'react';

// _ds_bundle.js (design system compilado, fuera de alcance) espera un
// window.React global heredado del setup CDN original (ver Fase 1). En la
// Fase 1, admin/index.html cargaba el bundle vía <script> síncrono ANTES
// del módulo de React, así que window.React siempre estaba listo a tiempo.
// Ahora que el admin vive dentro de la misma app que el portal (Fase 2), el
// bundle ya no se carga incondicionalmente para todo el sitio — se inyecta
// aquí, una sola vez, la primera vez que se monta una ruta /admin/*, y los
// componentes que necesitan Badge/Card/etc. lo obtienen vía useDesignSystem()
// en lugar de leerlo una sola vez a nivel de módulo (que se habría evaluado
// antes de que el script terminara de cargar).
const DS_BUNDLE_SRC = '/_ds/tibox-design-system-6dc0b329-c94d-4910-ab21-cacb54c8cc56/_ds_bundle.js';
const DS_GLOBAL_KEY = 'TIBOXDesignSystem_6dc0b3';
const DS_SCRIPT_ID = 'tibox-ds-bundle';

const DesignSystemContext = React.createContext({});

export function DesignSystemProvider({ children }) {
  const [ds, setDs] = React.useState(() => window[DS_GLOBAL_KEY] || {});

  React.useEffect(() => {
    if (window[DS_GLOBAL_KEY]) { setDs(window[DS_GLOBAL_KEY]); return; }
    window.React = React;
    const existing = document.getElementById(DS_SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => setDs(window[DS_GLOBAL_KEY] || {}));
      return;
    }
    const script = document.createElement('script');
    script.id = DS_SCRIPT_ID;
    script.src = DS_BUNDLE_SRC;
    script.onload = () => setDs(window[DS_GLOBAL_KEY] || {});
    document.head.appendChild(script);
  }, []);

  return <DesignSystemContext.Provider value={ds}>{children}</DesignSystemContext.Provider>;
}

export function useDesignSystem() {
  return React.useContext(DesignSystemContext);
}
