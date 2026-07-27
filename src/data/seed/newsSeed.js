// Datos de ejemplo de noticias/tendencias del sector. Sin backend real
// todavía — ver src/services/newsService.js.

export const NEWS_CATS = [
  { id:'all',           label:'Todas',          color:'var(--navy-900)' },
  { id:'microsoft',     label:'Microsoft',      color:'#0050C8' },
  { id:'google',        label:'Google',         color:'#EA4335' },
  { id:'ia',            label:'IA',             color:'#6a3ed0' },
  { id:'ciberseguridad',label:'Ciberseguridad', color:'#c0221a' },
  { id:'cloud',         label:'Cloud',          color:'#0891b2' },
  { id:'productividad', label:'Productividad',  color:'#0d8a4e' },
  { id:'automatizacion',label:'Automatización', color:'#FF6707' },
  { id:'normativas',    label:'Normativas TI',  color:'#5b6470' },
];

export const newsItems = [
  {id:1, cat:'ia',            source:'Microsoft', date:'10 Jun 2026', title:'Copilot suma agentes autónomos para automatizar flujos de trabajo en empresas'},
  {id:2, cat:'ciberseguridad',source:'ENISA',     date:'08 Jun 2026', title:'El ransomware como servicio crece un 40% y apunta a la cadena de suministro'},
  {id:3, cat:'cloud',         source:'AWS',        date:'05 Jun 2026', title:'Nuevas regiones cloud en Latinoamérica reducen la latencia para Chile'},
  {id:4, cat:'google',        source:'Google',     date:'03 Jun 2026', title:'Gemini se integra de forma nativa en Workspace para todas las cuentas business'},
  {id:5, cat:'normativas',    source:'BCN Chile',  date:'01 Jun 2026', title:'Entra en vigencia la Ley Marco de Ciberseguridad: qué deben cumplir las empresas'},
  {id:6, cat:'automatizacion',source:'Gartner',    date:'28 May 2026', title:'La hiperautomatización será prioridad de inversión TI para el 65% de las organizaciones'},
  {id:7, cat:'microsoft',     source:'Microsoft', date:'26 May 2026', title:'Windows Server 2025 refuerza la seguridad con aislamiento basado en hardware'},
  {id:8, cat:'productividad', source:'Forrester',  date:'22 May 2026', title:'Equipos que adoptan IA generativa recuperan hasta 11 horas semanales por persona'},
];

export const featuredNews = {
  cat:'ciberseguridad',
  img:'/assets/news-featured.jpg',
  date:'11 Jun 2026',
  readtime:'6 min de lectura',
  title:'Ley Marco de Ciberseguridad en Chile: la guía práctica para preparar a tu empresa',
  excerpt:'Analizamos los plazos, las obligaciones por sector y los controles mínimos que tu organización debe implementar para cumplir con la nueva normativa, sin frenar la operación.',
  url:'https://www.tibox.cl/eventos',
};
