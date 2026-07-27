import { HeroSlider, CategoryBlocks, ContentGrid } from '../components/Hero.jsx';
import { ServicesV2, ContactFormSection } from '../components/Services.jsx';
import { OpinionPanel } from '../components/OpinionPanel.jsx';

// Página única del portal (ruta "/"). Se renderiza dentro de PortalLayout
// vía <Outlet/>. Antes vivía directamente en src/App.jsx.
export function HomePage() {
  return (
    <>
      <div id="section-hero"><HeroSlider /></div>
      <CategoryBlocks />
      <ContentGrid />
      <div id="section-services"><ServicesV2 /></div>
      <div id="section-contact"><ContactFormSection /></div>
      <div id="section-opinion"><OpinionPanel /></div>
    </>
  );
}
