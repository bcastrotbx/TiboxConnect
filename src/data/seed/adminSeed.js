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
