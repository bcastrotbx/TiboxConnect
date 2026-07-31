// Datos de ejemplo de las oficinas mostradas en el bloque de contacto
// (mapas). El catálogo de servicios en sí ahora vive en la tabla real
// `services` — ver src/services/serviceCatalogService.js.

export const OFFICES_MAP = {
  santiago: {
    label: 'Santiago',
    address: 'Av. Pdte. Kennedy 5600, Oficina 1506, Vitacura',
    lat: -33.4052, lng: -70.5884,
    osmEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=-70.602,-33.413,-70.574,-33.398&layer=mapnik&marker=-33.4052,-70.5884',
  },
  curico: {
    label: 'Curicó',
    address: 'Jesús Pons 421',
    lat: -34.9854, lng: -71.2392,
    osmEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=-71.252,-35.000,-71.227,-34.971&layer=mapnik&marker=-34.9854,-71.2392',
  },
  lima: {
    label: 'Lima, Miraflores',
    address: 'Grimaldo del Solar 162, URB LEURO INT. 407, Miraflores',
    lat: -12.1289, lng: -77.0267,
    osmEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=-77.042,-12.138,-77.012,-12.119&layer=mapnik&marker=-12.1289,-77.0267',
  },
};
