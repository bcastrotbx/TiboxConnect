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
  const match = /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.exec(url || '');
  return match ? match[1].toLowerCase() : 'jpg';
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
  const filename = `${sanitizeFilename(title)}.${guessExtension(url)}`;
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error('No se pudo leer la imagen');
    const blob = await res.blob();
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
