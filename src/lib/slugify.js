// Genera un slug único a partir de un título, para content_items.slug y
// events.slug (ambos unique not null). No se expone como campo editable en
// los formularios del admin — es un identificador interno, no un dato de
// negocio que el admin necesite decidir.

// Quita las marcas diacríticas combinantes (U+0300–U+036F) que deja
// normalize('NFD') al descomponer letras acentuadas (á -> a + ´), sin
// depender de escribir el rango unicode literal en el código fuente.
function stripDiacritics(text) {
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code >= 0x0300 && code <= 0x036f) continue;
    out += ch;
  }
  return out;
}

export function makeSlug(title) {
  const normalized = stripDiacritics((title || '').toString().toLowerCase().normalize('NFD'));
  const base = normalized.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'sin-titulo';
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}
