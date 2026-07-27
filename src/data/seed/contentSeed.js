// Datos de ejemplo de videoteca e infografías. Sin backend real todavía —
// ver src/services/contentService.js.

export const VIDEO_CATS = [
  { id:'all',     label:'Todos',                   color:'var(--navy-900)' },
  { id:'copilot', label:'Microsoft Copilot',       color:'#6a3ed0' },
  { id:'ciber',   label:'Webinars Ciberseguridad', color:'#c0221a' },
  { id:'m365',    label:'Microsoft 365',           color:'#0050C8' },
  { id:'cloudia', label:'Cloud e IA',              color:'#0891b2' },
  { id:'eventos', label:'Eventos TIBOX',           color:'#FF6707' },
];

export const videoItems = [
  {id:1, cat:'copilot', libCat:'ia',    thumb:'/assets/video-copilot.jpg', title:'Microsoft Copilot: productividad con IA en tu día a día', dur:'24 min', date:'28 May 2026'},
  {id:2, cat:'ciber',   libCat:'ciber', thumb:'/assets/video-ciber.jpg',   title:'Webinar: cómo blindar tu empresa ante ransomware',        dur:'52 min', date:'15 May 2026'},
  {id:3, cat:'m365',    libCat:'cloud', thumb:'/assets/video-m365.jpg',    title:'Microsoft 365: colaboración segura en Teams y SharePoint',dur:'31 min', date:'09 May 2026'},
  {id:4, cat:'cloudia', libCat:'cloud', thumb:'/assets/video-cloud.jpg',   title:'Cloud e IA: arquitecturas inteligentes en Azure',         dur:'41 min', date:'02 May 2026'},
  {id:5, cat:'eventos', libCat:'infra', thumb:'/assets/video-evento.jpg',  title:'TIBOX Summit 2026: los highlights del evento',            dur:'18 min', date:'24 Abr 2026'},
  {id:6, cat:'cloudia', libCat:'ia',    thumb:'/assets/video-ia.jpg',      title:'IA generativa aplicada a procesos de negocio',            dur:'36 min', date:'18 Abr 2026'},
  {id:7, cat:'ciber',   libCat:'ciber', thumb:'/assets/video-webinar.jpg', title:'Webinar: Zero Trust en la práctica',                      dur:'47 min', date:'11 Abr 2026'},
  {id:8, cat:'copilot', libCat:'ia',    thumb:'/assets/video-copilot.jpg', title:'Copilot Studio: crea tu propio agente de IA',             dur:'22 min', date:'04 Abr 2026'},
  {id:9, cat:'m365',    libCat:'cloud', thumb:'/assets/video-m365.jpg',    title:'Automatiza tareas con Power Automate y Microsoft 365',    dur:'29 min', date:'28 Mar 2026'},
  {id:10,cat:'eventos', libCat:'infra', thumb:'/assets/video-evento.jpg',  title:'TIBOX Talks: tendencias tecnológicas 2026',               dur:'33 min', date:'21 Mar 2026'},
];

export const LIB_CATS = [
  { id:'all',      label:'Todos' },
  { id:'ia',       label:'IA' },
  { id:'ciber',    label:'Ciberseguridad' },
  { id:'cloud',    label:'Cloud' },
  { id:'infra',    label:'Infraestructura' },
  { id:'webinars', label:'Webinars' },
];

export const INFO_CATS = [
  { id:'all',          label:'Todas' },
  { id:'seguridad',    label:'Seguridad' },
  { id:'phishing',     label:'Phishing' },
  { id:'respaldos',    label:'Respaldos' },
  { id:'productividad',label:'Productividad' },
];

export const CHANNELS = {
  linkedin:  { label:'LinkedIn',  icon:'briefcase', color:'#0A66C2' },
  instagram: { label:'Instagram', icon:'camera',    color:'#C13584' },
  mailing:   { label:'Mailing',   icon:'mail',      color:'#0050C8' },
};

export const infogs = [
  { id:1, img:'/assets/info-2.jpg', cat:'seguridad',     channel:'instagram', title:'¿Tu plan de ciberseguridad se enfoca en prevención o en respuesta?',
    summary:'Hoy la pregunta no es si te atacarán, sino cuán rápido podrás responder. Un SOC reduce drásticamente el tiempo de detección y contención.' },
  { id:2, img:'/assets/info-3.jpg', cat:'seguridad',     channel:'linkedin',  title:'Los ciberataques no se toman feriados',
    summary:'Los fines de semana largos concentran el mayor riesgo: si nadie está monitoreando, una brecha puede pasar inadvertida durante días.' },
  { id:3, img:'/assets/info-4.jpg', cat:'phishing',      channel:'mailing',   title:'Reconoce un correo de phishing antes de hacer clic',
    summary:'Remitentes que imitan dominios, urgencia artificial y enlaces acortados. Cuatro señales para detectar el fraude a tiempo.' },
  { id:4, img:'/assets/info-2.jpg', cat:'phishing',      channel:'linkedin',  title:'Phishing dirigido: la amenaza silenciosa al directorio',
    summary:'El spear phishing apunta a ejecutivos con mensajes hechos a medida. La capacitación y el MFA son tu mejor defensa.' },
  { id:5, img:'/assets/info-4.jpg', cat:'respaldos',     channel:'mailing',   title:'Respaldos 3-2-1: tu última línea de defensa',
    summary:'Tres copias, en dos medios distintos, una fuera de sitio. La regla que mantiene tu negocio operativo tras un incidente.' },
  { id:6, img:'/assets/info-3.jpg', cat:'respaldos',     channel:'linkedin',  title:'Recuperación ante desastres: ¿tu empresa está lista?',
    summary:'Un plan de DRP probado convierte una caída crítica en una interrupción controlada y medida en minutos, no en días.' },
  { id:7, img:'/assets/info-1.jpg', cat:'productividad', channel:'linkedin',  title:'La transformación digital fracasa por falta de estrategia',
    summary:'En 2026 el éxito no dependerá de qué nube elijas, sino del partner que la implemente y la gestione contigo.' },
  { id:8, img:'/assets/info-1.jpg', cat:'productividad', channel:'instagram', title:'Más productividad con IA, sin más complejidad',
    summary:'Copilot y la automatización liberan horas de trabajo repetitivo para que tu equipo se enfoque en lo que aporta valor.' },
];
