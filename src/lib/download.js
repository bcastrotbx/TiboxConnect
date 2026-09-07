// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): descarga real de
// infografías. `thumbnail_url` casi siempre apunta a un dominio externo
// (Storage de Supabase u otro host de imágenes) que no necesariamente envía
// cabeceras CORS pensadas para permitir que JS lea el contenido de la
// imagen — sin esas cabeceras, `fetch()` falla o la respuesta queda
// "opaca" (no se puede convertir a blob). Se intenta primero la descarga
// forzada vía blob (mejor experiencia: el navegador la guarda directo con
// el nombre que le damos); si eso falla por CORS o cualquier otro motivo,
// se cae a abrir la imagen en una pestaña nueva — el usuario igual puede
// guardarla desde ahí con "Guardar imagen como…", sin ningún mensaje de
// error confuso de por medio.
// Mismo criterio que makeSlug (lib/slugify.js): recorre codepoints en vez
// de escribir el rango unicode de marcas diacríticas combinantes
// (U+0300–U+036F) como literal en el código fuente.
function stripDiacritics(text) {
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code >= 0x0300 && code <= 0x036f) continue;
    out += ch;
  }
  return out;
}

function sanitizeFilename(title) {
  const normalized = stripDiacritics((title || 'infografia').toLowerCase().normalize('NFD'));
  const base = normalized.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return base || 'infografia';
}

function guessExtension(url) {
  const match = /\.(png|jpe?g|webp|gif|svg|pdf|docx?|xlsx?|pptx?)(\?|$)/i.exec(url || '');
  return match ? match[1].toLowerCase() : null;
}

// Ajuste posterior (pedido de Braulio): el "Link de la publicación" que se
// pega en el admin ya no es siempre una imagen — puede ser un PDF, y no
// siempre trae la extensión en la URL (p.ej. un link de Drive o de otro
// gestor de archivos). Antes se asumía "jpg" a ciegas si la URL no calzaba
// con el patrón de imagen, lo que dejaba un PDF descargado como
// "archivo.jpg" (se abre igual, pero con el ícono/extensión equivocada).
// Ahora, si la URL no trae una extensión reconocible, se usa el
// Content-Type real de la respuesta para decidir la extensión.
const MIME_EXTENSIONS = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
};

function extensionFromMime(mime) {
  const clean = (mime || '').split(';')[0].trim().toLowerCase();
  return MIME_EXTENSIONS[clean] || null;
}

// Ajuste posterior (auditoría de bugs, ver docs/AUDITORIA-2026-08-17.md): el
// llamador mostraba "Descarga iniciada" de forma incondicional, sin esperar
// a que esta función terminara ni revisar si de verdad funcionó — con el
// fallback de pestaña nueva bloqueado por el navegador (posible: al haber
// un `await` de por medio, algunos navegadores retiran el "user activation"
// que permite abrir pestañas sin tratarlo como popup), el usuario veía un
// check de éxito sin haber recibido nada. Ahora devuelve `{ ok, method }`
// para que el llamador pueda reflejar el resultado real.
export async function downloadImageWithFallback(url, title) {
  if (!url) return { ok: false, method: 'none' };
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error('No se pudo leer el archivo');
    const blob = await res.blob();
    const extension = guessExtension(url) || extensionFromMime(blob.type) || 'jpg';
    const filename = `${sanitizeFilename(title)}.${extension}`;
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    return { ok: true, method: 'blob' };
  } catch {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    return { ok: Boolean(win), method: 'tab' };
  }
}
