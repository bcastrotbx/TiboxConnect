// Datos de ejemplo de eventos. Sin backend real todavía — ver
// src/services/eventService.js, que es el único punto que debería importar
// este archivo (los componentes visuales consumen el servicio, no el seed).

export const MODALIDAD = {
  'Online':     { color:'#0891b2', icon:'wifi' },
  'Presencial': { color:'#0056b3', icon:'map-pin' },
  'Híbrida':    { color:'#6a3ed0', icon:'git-merge' },
};

export const PARTNERS = {
  microsoft: { logo:'/assets/partner-microsoft.svg', name:'Microsoft' },
  azure:     { logo:'/assets/partner-azure.svg',     name:'Microsoft Azure' },
  veeam:     { logo:'/assets/partner-veeam.svg',     name:'Veeam' },
  hpe:       { logo:'/assets/partner-hpe.svg',       name:'HPE' },
};

// `registrationUrl`: URL externa de inscripción al evento. Dato de ejemplo
// por ahora — en una fase futura este campo será editable desde el panel
// admin por evento (ver docs/phases/FASE-01B-AJUSTES-VISUALES-PAULA.md).
export const eventItems = [
  {id:1, day:'19', month:'Jun', title:'Webinar: Ciberseguridad para PYMES Chile 2026', modalidad:'Online', time:'10:00 – 11:30', place:'Microsoft Teams', partner:'microsoft', img:'/assets/video-ciber.jpg',
    registrationUrl:'https://teams.microsoft.com/registration/tibox-ciberseguridad-pymes-2026',
    desc:'Aprende a proteger tu empresa con controles esenciales y un SOC gestionado, sin sobredimensionar tu presupuesto.',
    resena:'En este webinar revisaremos las amenazas más frecuentes que enfrentan las pymes chilenas y cómo construir una defensa por capas realista. El objetivo es que salgas con un checklist de controles esenciales —respaldo, MFA, endpoint y monitoreo— priorizados por impacto y costo. Ideal para gerentes y encargados de TI que buscan elevar su postura de seguridad sin sobredimensionar la inversión.'},
  {id:2, day:'24', month:'Jun', title:'Taller: Implementación SD-WAN en tu empresa', modalidad:'Presencial', time:'09:30 – 13:00', place:'Oficina TIBOX, Vitacura', city:'Santiago', partner:'hpe', img:'/assets/hero-slider-1.jpg',
    registrationUrl:'https://teams.microsoft.com/registration/tibox-taller-sdwan',
    desc:'Sesión práctica para diseñar una red SD-WAN resiliente y optimizar la conectividad entre tus sucursales.',
    resena:'Taller práctico, con casos reales, donde diseñarás una topología SD-WAN resiliente para conectar tus sucursales con mayor disponibilidad y menor costo de enlaces. Abordaremos políticas de tráfico, failover automático y visibilidad de la red. Te llevarás un blueprint aplicable a tu propia operación y las mejores prácticas de despliegue.'},
  {id:3, day:'02', month:'Jul', title:'Demo en vivo: TIBOX NOC, monitoreo 24/7', modalidad:'Online', time:'16:00 – 17:00', place:'Zoom', partner:'azure', img:'/assets/video-cloud.jpg',
    registrationUrl:'https://teams.microsoft.com/registration/tibox-demo-noc',
    desc:'Recorrido por nuestro Centro de Operaciones de Red y cómo anticipamos fallas antes de que te afecten.',
    resena:'Recorreremos en vivo nuestro Centro de Operaciones de Red (NOC) y mostraremos cómo la observabilidad y la automatización nos permiten anticipar incidentes antes de que afecten tu negocio. Verás dashboards reales, flujos de alertamiento y tiempos de respuesta. Pensado para quienes evalúan externalizar o reforzar su monitoreo.'},
  {id:4, day:'10', month:'Jul', title:'Conferencia: Transformación Digital en Retail', modalidad:'Híbrida', time:'08:30 – 13:30', place:'Hotel W, Santiago', city:'Santiago', partner:'microsoft', img:'/assets/video-evento.jpg',
    registrationUrl:'https://teams.microsoft.com/registration/tibox-transformacion-retail',
    desc:'Casos reales de retailers que modernizaron su operación con cloud, datos e inteligencia artificial.',
    resena:'Una mañana de casos reales: retailers que modernizaron su operación con cloud, datos e inteligencia artificial, y los aprendizajes detrás de cada proyecto. Conversaremos sobre experiencia de cliente, eficiencia operativa y cómo construir un roadmap digital sostenible. Incluye espacio de networking con pares de la industria.'},
  {id:5, day:'16', month:'Jul', title:'Webinar: FinOps — optimiza tus costos cloud', modalidad:'Online', time:'11:00 – 12:00', place:'Microsoft Teams', partner:'azure', img:'/assets/video-m365.jpg',
    registrationUrl:'https://teams.microsoft.com/registration/tibox-finops',
    desc:'Estrategias para reducir tu factura cloud sin frenar el crecimiento, con gobernanza y visibilidad de costos.',
    resena:'Aprenderás el marco FinOps para alinear finanzas, tecnología y negocio en torno al gasto cloud. Veremos cómo ganar visibilidad de costos, identificar desperdicio y establecer gobernanza sin frenar el crecimiento. Útil para CFOs, líderes TI y equipos de plataforma que quieren maximizar el retorno de su nube.'},
  {id:6, day:'23', month:'Jul', title:'Taller: Respaldo y recuperación con Veeam', modalidad:'Presencial', time:'09:00 – 12:30', place:'Oficina TIBOX, Curicó', city:'Curicó', partner:'veeam', img:'/assets/info-2.jpg',
    registrationUrl:'https://teams.microsoft.com/registration/tibox-veeam-respaldo',
    desc:'Diseña una estrategia de respaldos 3-2-1 y prueba tu plan de recuperación ante desastres paso a paso.',
    resena:'Taller hands-on para diseñar una estrategia de respaldos 3-2-1 robusta y probar tu plan de recuperación ante desastres paso a paso. Cubriremos políticas de retención, inmutabilidad ante ransomware y pruebas de restauración. Te irás con un plan de continuidad concreto para tu organización.'},
  {id:7, day:'30', month:'Jul', title:'Demo: Chatbots con IA para tu empresa', modalidad:'Online', time:'15:00 – 16:00', place:'Zoom', partner:'azure', img:'/assets/video-ia.jpg',
    registrationUrl:'https://teams.microsoft.com/registration/tibox-chatbots-ia',
    desc:'Cómo desplegar asistentes virtuales con IA generativa integrados a tus sistemas y canales de atención.',
    resena:'Demostración práctica de cómo desplegar asistentes virtuales con IA generativa integrados a tus sistemas y canales de atención. Veremos casos de uso en soporte, ventas y operaciones, y cómo medir su impacto. Pensado para equipos que buscan automatizar la atención sin perder cercanía con el cliente.'},
  {id:8, day:'06', month:'Ago', title:'Mesa redonda: Zero Trust en la práctica', modalidad:'Híbrida', time:'09:00 – 11:30', place:'Oficina TIBOX, Miraflores', city:'Lima', partner:'microsoft', img:'/assets/video-copilot.jpg',
    registrationUrl:'https://teams.microsoft.com/registration/tibox-zero-trust',
    desc:'Expertos comparten cómo adoptar un modelo Zero Trust de forma gradual y medible en tu organización.',
    resena:'Expertos de TIBOX y partners comparten cómo adoptar un modelo Zero Trust de forma gradual y medible, sin paralizar la operación. Discutiremos identidad, segmentación, dispositivos y datos, con métricas para demostrar avance. Incluye preguntas abiertas y casos de la audiencia.'},
];

export const pastEventItems = [
  {id:101, day:'28', month:'May', title:'Cumbre TIBOX Cloud & IA 2026', modalidad:'Presencial', time:'09:00 – 14:00', place:'Hotel W, Santiago', attendees:'180 asistentes', partner:'microsoft',
    img:'/assets/hero-universe.jpg',
    resumen:'Una jornada dedicada a cómo la nube y la inteligencia artificial están redefiniendo la operación de las empresas chilenas.',
    resena:'La Cumbre reunió a líderes de TI de distintos sectores para explorar casos reales de adopción de cloud e IA generativa. Se presentaron arquitecturas de referencia, resultados de proyectos de modernización y un panel sobre gobernanza de datos. Las principales conclusiones apuntaron a que la madurez en datos y la gestión del cambio son los mayores diferenciadores de éxito, por sobre la tecnología misma.',
    gallery:['/assets/info-1.jpg','/assets/video-evento.jpg','/assets/video-cloud.jpg','/assets/hero-slider-2.jpg']},
  {id:102, day:'15', month:'May', title:'Workshop: Ciberseguridad Empresarial', modalidad:'Presencial', time:'09:30 – 13:00', place:'Oficina TIBOX, Vitacura', attendees:'45 asistentes', partner:'microsoft',
    img:'/assets/video-ciber.jpg',
    resumen:'Sesión práctica sobre cómo construir una postura de seguridad por capas y responder ante incidentes reales.',
    resena:'Durante el workshop, los participantes realizaron un ejercicio de simulación de incidente (tabletop) y revisaron controles esenciales de protección. Se abordaron MFA, segmentación, respaldo inmune a ransomware y monitoreo continuo. La conclusión más valorada fue la importancia de practicar el plan de respuesta antes de necesitarlo, y contar con un SOC que reduzca los tiempos de detección.',
    gallery:['/assets/video-copilot.jpg','/assets/info-3.jpg','/assets/video-m365.jpg','/assets/info-4.jpg']},
  {id:103, day:'30', month:'Abr', title:'TIBOX Connect Day Santiago', modalidad:'Híbrida', time:'08:30 – 13:30', place:'Espacio Riesco, Santiago', attendees:'320 asistentes', partner:'azure',
    img:'/assets/video-evento.jpg',
    resumen:'Nuestro encuentro anual de clientes y partners, con charlas, demos y espacios de networking.',
    resena:'Connect Day reunió a clientes y partners en torno a las tendencias que están marcando la transformación digital en Chile. Hubo demostraciones en vivo de monitoreo NOC, automatización e IA, además de un keynote sobre continuidad operacional. Los asistentes destacaron el valor de las conversaciones uno a uno con especialistas y la cercanía del equipo TIBOX.',
    gallery:['/assets/hero-slider-1.jpg','/assets/hero-slider-3.jpg','/assets/info-2.jpg','/assets/video-webinar.jpg']},
  {id:104, day:'18', month:'Abr', title:'Webinar: Continuidad Operacional 24/7', modalidad:'Online', time:'11:00 – 12:00', place:'Microsoft Teams', attendees:'210 asistentes', partner:'veeam',
    img:'/assets/video-webinar.jpg',
    resumen:'Cómo diseñar infraestructura y procesos que mantengan tu negocio operativo ante cualquier imprevisto.',
    resena:'En este webinar revisamos los pilares de la continuidad operacional: redundancia de infraestructura, respaldos probados, monitoreo proactivo y planes de recuperación. Se compartieron métricas de disponibilidad reales y cómo TIBOX las sostiene con su NOC. La conclusión: la continuidad no es un producto, sino una disciplina que combina tecnología, procesos y práctica constante.',
    gallery:['/assets/video-cloud.jpg','/assets/info-1.jpg','/assets/video-ia.jpg','/assets/hero-universe.jpg']},
];
