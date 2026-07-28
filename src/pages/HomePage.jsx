import { HeroSlider, CategoryBlocks, ContentGrid } from '../components/Hero.jsx';
import { ServicesV2, ContactFormSection } from '../components/Services.jsx';

// Página única del portal (ruta "/"). Se renderiza dentro de PortalLayout
// vía <Outlet/>. Antes vivía directamente en src/App.jsx.
//
// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): "Tu Opinión" dejó
// de ser una sección aparte — ahora vive como la columna derecha del bloque
// de Contacto, renderizada dentro de ContactFormSection (Services.jsx). El
// ancla de navegación #section-opinion sigue existiendo, solo que ahora
// envuelve directamente esa columna en vez de esta sección completa.
export function HomePage() {
  return (
    <>
      <div id="section-hero"><HeroSlider /></div>
      <CategoryBlocks />
      <ContentGrid />
      <div id="section-services"><ServicesV2 /></div>
      <div id="section-contact"><ContactFormSection /></div>
    </>
  );
}
