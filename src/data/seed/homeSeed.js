// Datos de ejemplo de la portada del portal (hero slider y bloques de
// categoría). Sin backend real todavía — ver src/services/homeService.js.

export const SLIDES = [
  {
    id: 1,
    eyebrow: 'INFOGRAFÍAS',
    title: 'Información que se',
    titleAccent: 'entiende al instante',
    desc: 'Piezas visuales, simples y fáciles de compartir sobre ciberseguridad, cloud y productividad — seleccionadas por nuestros expertos.',
    cta: 'Ver infografías',
    ctaIcon: 'layout-grid',
    tag: 'Contenido visual',
    bg: '/assets/hero-slider-1.jpg',
  },
  {
    id: 2,
    eyebrow: 'NOTICIAS DE LA INDUSTRIA',
    title: 'Mantente al día con',
    titleAccent: 'el sector tecnológico',
    desc: 'Las novedades de Microsoft, Google, cloud, IA, ciberseguridad y normativas TI que impactan a tu organización, en un solo lugar.',
    cta: 'Leer noticias',
    ctaIcon: 'rss',
    tag: 'Actualidad TI',
    bg: '/assets/hero-slider-2.jpg',
  },
  {
    id: 3,
    eyebrow: 'PRÓXIMOS EVENTOS',
    title: 'Conecta con',
    titleAccent: 'expertos TI',
    desc: 'Webinars, talleres presenciales y demos en vivo con especialistas en infraestructura, cloud, ciberseguridad y automatización.',
    cta: 'Ver agenda completa',
    ctaIcon: 'calendar',
    tag: 'Eventos & Webinars',
    bg: '/assets/hero-slider-3.jpg',
  },
  {
    id: 4,
    eyebrow: 'TU OPINIÓN CUENTA',
    title: 'Queremos saber',
    titleAccent: 'tu opinión',
    desc: 'Tu experiencia guía la evolución de TIBOX Connect. Cuéntanos qué contenido te sirve y qué te gustaría ver en el portal.',
    cta: 'Compartir mi opinión',
    ctaIcon: 'message-circle',
    tag: 'Feedback',
    bg: '/assets/hero-universe.jpg',
  },
];

export const CATS = [
  { id:'explora',   icon:'film',           label:'Explora',       sub:'Videos y Webinars',  count:'240+ recursos',   scrollTarget:'videos'  },
  { id:'noticias',  icon:'rss',            label:'Noticias',      sub:'Sector Tecnológico', count:'Actualizado hoy', scrollTarget:'news'    },
  { id:'eventos',   icon:'calendar-check', label:'Eventos',       sub:'Agenda y Webinars',  count:'8 próximos',      scrollTarget:'events'  },
  { id:'opinion',   icon:'message-circle', label:'Tu Opinión',    sub:'Comparte tu voz',    count:'Nuevo: encuesta', scrollTarget:'opinion' },
];
