import * as icons from 'lucide-react';

// Converts the kebab-case names used throughout the original prototype
// ("chevron-right", "grid-3x3") into the PascalCase export names lucide-react
// uses ("ChevronRight", "Grid3x3"), so every existing <i data-lucide="..."/>
// call site becomes <Icon name="..."/> without hand-mapping ~150 icon names.
function toPascalCase(name) {
  return name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
}

export function Icon({ name, ...props }) {
  const Component = icons[toPascalCase(name)];
  if (!Component) return null;
  return <Component {...props} />;
}
