// Datos de ejemplo del catálogo de servicios TIBOX y de las oficinas
// mostradas en el bloque de contacto. Sin backend real todavía — ver
// src/services/serviceCatalogService.js.

export const servicesV2 = [
  { id:'infra', label:'Infraestructura TI', desc:'Redes, servidores y conectividad que sostienen tu operación.', gradient:'var(--u-infra-g)', logo:'/assets/logo-infraestructura.png', icon:'network',
    detail:{
      fullName:'Infraestructura TI & NOC',
      intro:'Soporte TI integral y un Centro de Operaciones de Red (NOC) que monitorea y administra tu infraestructura para garantizar continuidad operacional.',
      groups:[
        {name:'Soporte TI',items:['Soporte onsite y remoto','Mesa de ayuda y resolución de incidentes','Servicio técnico','Gestión de infraestructura']},
        {name:'NOC — Centro de Operaciones de Red',items:['Monitoreo y administración de infraestructura TI','Administración y optimización de plataformas cloud','Administración de servidores en HA','Administración de redes y comunicaciones','Gestión de backups y Recuperación ante Desastres (DRP)','Administración y monitoreo de firewall']},
      ],
    }},
  { id:'ciber', label:'Ciberseguridad', desc:'Protección activa, auditorías y cumplimiento normativo 24/7.', gradient:'var(--u-ciber-g)', logo:'/assets/logo-ciberseguridad.png', icon:'lock',
    detail:{
      fullName:'Ciberseguridad & SOC',
      intro:'Protección activa de tu organización con un SOC que vigila, detecta y responde ante amenazas las 24 horas.',
      groups:[
        {name:'Servicios',items:['Seguridad perimetral: firewall y antivirus empresarial','Gestión y monitoreo de seguridad (SOC)','Ethical hacking y penetration testing','Inteligencia de amenazas y detección de incidentes con IA','Implementación de seguridad Zero Trust','Automatización de respuesta a incidentes (SOAR)','Seguridad en la nube (SASE)']},
      ],
    }},
  { id:'cloud', label:'Soluciones Cloud', desc:'Migraciones, arquitectura multi-cloud y soporte local cercano.', gradient:'var(--u-cloud-g)', logo:'/assets/logo-soluciones-cloud.png', icon:'cloud',
    detail:{
      fullName:'Soluciones Cloud',
      intro:'Administración, migración y optimización de tus entornos en la nube, con foco en continuidad, costos y cumplimiento.',
      groups:[
        {name:'Servicios',items:['Administración y monitoreo de máquinas virtuales','Administración de respaldos en la nube','Administración de escritorios virtuales','Disaster recovery y continuidad operativa','Migración e implementación de correos M365 & Google Workspace','Licenciamiento Microsoft 365 y Google Workspace','Gestión y soporte para entornos IaaS, PaaS y SaaS','Optimización de costos cloud (FinOps)','Cloud Security Posture Management (CSPM)']},
      ],
    }},
  { id:'analitica', label:'Analítica TI', desc:'BI, dashboards en tiempo real e inteligencia operacional.', gradient:'var(--u-analitica-g)', logo:'/assets/logo-analitica.png', icon:'trending-up',
    detail:{
      fullName:'Analítica de Datos & Inteligencia Artificial',
      intro:'Convierte tus datos en decisiones: plataformas de BI, modelos predictivos e inteligencia artificial aplicada a tu negocio.',
      groups:[
        {name:'Servicios',items:['Gestión de plataformas de BI empresarial','Consultoría en Business Intelligence (BI)','Arquitectura cloud para datos','Gobierno y gestión de datos','Analítica predictiva y modelos de machine learning','MLOps para empresas: escalabilidad de IA','Chatbot de inteligencia artificial (IA)','IA como servicio para empresas']},
      ],
    }},
  { id:'consultoria', label:'Consultoría TI', desc:'Roadmaps tecnológicos, gestión de proveedores y estrategia.', gradient:'var(--u-consultoria-g)', logo:'/assets/logo-consultoria-ti.png', icon:'layers',
    detail:{
      fullName:'Consultoría TI & Transformación Digital',
      intro:'Acompañamiento estratégico para alinear la tecnología con los objetivos de tu organización y acelerar su transformación digital.',
      groups:[
        {name:'Servicios',items:['Assessment y diagnóstico TI','Consultoría estratégica en TI y transformación digital','Optimización y mejora continua de procesos TI','Elaboración de políticas y procedimientos TI','Gestión de riesgos y cumplimiento normativo en TI','Análisis e informes de ciberataques y seguridad','Adopción de IA y automatización empresarial','Matriz de riesgos sobre activos TI']},
      ],
    }},
  { id:'smart', label:'Soluciones Inteligentes', desc:'Automatización, IA aplicada y soluciones a medida.', gradient:'var(--u-smart-g)', logo:'/assets/logo-soluciones-inteligentes.png', icon:'cpu',
    detail:{
      fullName:'Soluciones Inteligentes & Automatización',
      intro:'Desarrollo y automatización a medida: desde sitios y aplicaciones web hasta IoT, RPA y gemelos digitales.',
      groups:[
        {name:'Servicios',items:['Diseño y desarrollo de sitios web empresariales','Desarrollo de aplicaciones web','Intranet y portales corporativos en SharePoint Online','Sistemas de gestión documental en SharePoint Online','Implementación de proyectos IoT e industria 4.0','Automatización con Robotic Process Automation (RPA)','Digital Twins — gemelos digitales']},
      ],
    }},
];

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
