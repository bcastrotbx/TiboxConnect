// Datos de ejemplo exclusivos del panel de administración (dashboard,
// bandejas de contenido, mensajes, opiniones, configuración de portada).
// Sin backend real todavía — ver src/services/adminService.js.

export const DASHBOARD_STATS = [
  { value:'12,480', label:'Visitas al portal (30d)', icon:'trending-up' },
  { value:'86', label:'Nuevas inscripciones a eventos', icon:'calendar-check' },
  { value:'23', label:'Mensajes de contacto pendientes', icon:'mail' },
  { value:'4.6 / 5', label:'Satisfacción promedio', icon:'star' },
];

export const CONTENT_ITEMS = {
  videos: [
    { title:'Copilot para equipos de TI: primeros pasos', cat:'Microsoft 365', status:'Publicado', date:'02 Jul 2026' },
    { title:'Ciberseguridad para PYMES: guía rápida', cat:'Ciberseguridad', status:'Publicado', date:'28 Jun 2026' },
    { title:'Automatización con IA en soporte técnico', cat:'Inteligencia Artificial', status:'Borrador', date:'19 Jun 2026' },
    { title:'Migración a la nube sin downtime', cat:'Cloud', status:'Publicado', date:'11 Jun 2026' },
  ],
  infographics: [
    { title:'6 señales de que necesitas un SOC gestionado', cat:'Ciberseguridad', status:'Publicado', date:'05 Jul 2026' },
    { title:'FinOps en 5 pasos: controla tu gasto cloud', cat:'Cloud', status:'Publicado', date:'30 Jun 2026' },
    { title:'Checklist de continuidad operacional 24/7', cat:'Infraestructura', status:'Programado', date:'20 Jul 2026' },
  ],
  news: [
    { title:'Nueva normativa de ciberseguridad para empresas en Chile', cat:'Regulación', status:'Publicado', date:'10 Jul 2026' },
    { title:'Tendencias IA generativa para 2027', cat:'Innovación', status:'Publicado', date:'01 Jul 2026' },
    { title:'TIBOX certifica su NOC bajo ISO 27001', cat:'Empresa', status:'Borrador', date:'27 Jun 2026' },
  ],
  events: [
    { title:'Webinar: Ciberseguridad para PYMES Chile 2026', cat:'Online', status:'Próximo', date:'19 Jul 2026' },
    { title:'Taller: Implementación SD-WAN en tu empresa', cat:'Presencial', status:'Próximo', date:'24 Jul 2026' },
    { title:'Cumbre TIBOX Cloud & IA 2026', cat:'Presencial', status:'Realizado', date:'28 May 2026' },
  ],
};

CONTENT_ITEMS.recent = [
  { title:'Nueva normativa de ciberseguridad para empresas en Chile', cat:'Noticias', status:'Publicado', date:'10 Jul 2026' },
  { title:'6 señales de que necesitas un SOC gestionado', cat:'Infografías', status:'Publicado', date:'05 Jul 2026' },
  { title:'Copilot para equipos de TI: primeros pasos', cat:'Videos y Webinars', status:'Publicado', date:'02 Jul 2026' },
  { title:'Webinar: Ciberseguridad para PYMES Chile 2026', cat:'Eventos', status:'Próximo', date:'19 Jul 2026' },
  { title:'Automatización con IA en soporte técnico', cat:'Videos y Webinars', status:'Borrador', date:'19 Jun 2026' },
];

export const NOTIFICATIONS = [
  { icon:'mail', tone:'#0050C8', title:'Nuevo mensaje de contacto', desc:'Fernanda Rojas — Constructora Andes', time:'Hace 12 min', unread:true },
  { icon:'calendar-check', tone:'#FF6707', title:'Nueva inscripción a evento', desc:'Webinar: Ciberseguridad para PYMES', time:'Hace 1 h', unread:true },
  { icon:'star', tone:'#FFC600', title:'Nueva opinión de cliente', desc:'Rodrigo Salinas dejó una calificación 5★', time:'Hace 3 h', unread:true },
  { icon:'rss', tone:'#00C8FA', title:'Publicación programada', desc:'"Checklist de continuidad 24/7" se publicará el 20 Jul', time:'Ayer', unread:false },
  { icon:'shield-check', tone:'#16a34a', title:'Respaldo completado', desc:'Copia de seguridad del portal finalizada', time:'Ayer', unread:false },
];

export const MESSAGES = [
  { name:'Fernanda Rojas', email:'fernanda.rojas@constructoraandes.cl', empresa:'Constructora Andes', servicio:'Ciberseguridad', fecha:'12 Jul 2026', estado:'Nuevo',
    mensaje:'Hola, estamos evaluando reforzar la seguridad de nuestra red corporativa tras un intento de phishing reciente. Nos interesa conocer sus planes de SOC gestionado y tiempos de respuesta ante incidentes.' },
  { name:'Marcelo Iturra', email:'m.iturra@logisticasur.cl', empresa:'Grupo Logístico Sur', servicio:'Infraestructura TI', fecha:'11 Jul 2026', estado:'Nuevo',
    mensaje:'Buenas tardes, necesitamos modernizar la conectividad entre 5 sucursales con una solución SD-WAN. ¿Podrían enviarnos una propuesta técnica y comercial?' },
  { name:'Camila Vidal', email:'camila.vidal@retailexpress.cl', empresa:'Retail Express', servicio:'Soluciones Cloud', fecha:'09 Jul 2026', estado:'Respondido',
    mensaje:'Queremos migrar nuestro ERP a la nube antes de fin de año. Nos gustaría agendar una reunión para revisar alternativas y costos estimados.' },
  { name:'Andrés Peña', email:'apena@clinicasanrafael.cl', empresa:'Clínica San Rafael', servicio:'Consultoría TI', fecha:'07 Jul 2026', estado:'Respondido',
    mensaje:'Solicitamos una auditoría de nuestra infraestructura actual para identificar riesgos de continuidad operacional en el área clínica.' },
  { name:'Josefina Muñoz', email:'jmunoz@agroindustrialmaule.cl', empresa:'Agroindustrial Maule', servicio:'Analítica TI', fecha:'03 Jul 2026', estado:'Cerrado',
    mensaje:'Nos gustaría implementar dashboards de producción en tiempo real. ¿Tienen experiencia en el rubro agroindustrial?' },
];

export const OPINIONS = [
  { name:'Rodrigo Salinas', email:'rsalinas@vertice.cl', rating:5, fecha:'10 Jul 2026', mensaje:'Excelente atención del equipo de soporte, resolvieron nuestro incidente de red en menos de una hora. El portal Connect también nos ha facilitado mucho el seguimiento de tickets.' },
  { name:'Valentina Correa', email:'vcorrea@puertoblanco.cl', rating:4, fecha:'08 Jul 2026', mensaje:'Muy buena experiencia general con el equipo TIBOX. Sería ideal tener más webinars grabados disponibles para revisar con el equipo interno.' },
  { name:'Ignacio Bravo', email:'ibravo@textilnorte.cl', rating:5, fecha:'05 Jul 2026', mensaje:'El taller de SD-WAN fue muy práctico y aplicable. Felicitaciones al equipo de eventos por la organización.' },
  { name:'Daniela Contreras', email:'dcontreras@saludintegra.cl', rating:3, fecha:'01 Jul 2026', mensaje:'El servicio es bueno, pero nos gustaría mayor rapidez en las respuestas del formulario de contacto general.' },
];

export const DEFAULT_SERVICES = {
  'Infraestructura TI': { icon:'network', bullets:['Redes, servidores y respaldo gestionados 24/7', 'Monitoreo proactivo con NOC propio', 'SLA de disponibilidad garantizado'] },
  'Ciberseguridad': { icon:'lock', bullets:['SOC gestionado con detección y respuesta', 'Protección de endpoints y correo', 'Cumplimiento normativo y auditorías'] },
  'Soluciones Cloud': { icon:'cloud', bullets:['Migración a Azure / AWS sin downtime', 'Optimización de costos (FinOps)', 'Arquitecturas híbridas y multicloud'] },
  'Analítica TI': { icon:'trending-up', bullets:['Dashboards de operación en tiempo real', 'Modelos predictivos de demanda', 'Integración con tus fuentes de datos'] },
  'Consultoría TI': { icon:'layers', bullets:['Diagnóstico y roadmap tecnológico', 'Acompañamiento en transformación digital', 'Gestión de proyectos TI'] },
  'Soluciones Inteligentes': { icon:'cpu', bullets:['Automatización de procesos con IA', 'Chatbots y asistentes virtuales', 'Integración de modelos generativos'] },
};

export const ICON_LIBRARY = ['network','lock','cloud','trending-up','layers','cpu','shield-check','server','database','wifi','globe','activity','film','rss','calendar-check','message-circle','star','briefcase','settings','users','headphones','zap'];

export const CONTENT_TYPE_CATEGORIES = ['Microsoft 365', 'Ciberseguridad', 'Inteligencia Artificial', 'Cloud', 'Infraestructura', 'Analítica TI', 'Eventos'];

export const DEFAULT_SLIDES = [
  { id:1, title:'Continuidad operacional sin interrupciones', category:'Infraestructura TI', desc:'Redes, servidores y monitoreo 24/7 para que tu operación nunca se detenga.', cta:'Agenda una asesoría', bg:'hero-slider-1.jpg' },
  { id:2, title:'Ciberseguridad que protege tu negocio', category:'Ciberseguridad', desc:'SOC gestionado y respuesta ante incidentes para tu tranquilidad.', cta:'Conoce nuestros servicios', bg:'hero-slider-2.jpg' },
  { id:3, title:'Tecnología que impulsa tu crecimiento', category:'Soluciones Cloud', desc:'Migra a la nube sin downtime y con costos optimizados.', cta:'Solicita una cotización', bg:'hero-slider-3.jpg' },
  { id:4, title:'El universo TIBOX, en expansión constante', category:'Empresa', desc:'Un socio tecnológico que crece junto a tu organización.', cta:'Conversemos', bg:'hero-universe.jpg' },
];

export const DEFAULT_CATS = [
  { id:1, icon:'film', title:'Explora', tag:'Videos y Webinars' },
  { id:2, icon:'rss', title:'Noticias', tag:'Sector Tecnológico' },
  { id:3, icon:'calendar-check', title:'Eventos', tag:'Agenda y Webinars' },
  { id:4, icon:'message-circle', title:'Tu Opinión', tag:'Comparte tu voz' },
];

export const DEFAULT_FORM_FIELDS = [
  { name:'Nombre completo', helper:'Como aparece en tu correo corporativo' },
  { name:'Correo corporativo', helper:'Te responderemos en menos de 24 horas' },
  { name:'Empresa', helper:'Razón social de tu organización' },
  { name:'Teléfono', helper:'Opcional' },
  { name:'Servicio de interés', helper:'Selecciona el área que te interesa' },
  { name:'Mensaje', helper:'Cuéntanos brevemente tu proyecto' },
];
