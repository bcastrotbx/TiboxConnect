// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): subida directa de
// imágenes de galería de evento a la Biblioteca de Medios de WordPress
// (tibox.cl), vía el endpoint intermedio propio /api/upload-event-image
// (Vercel Serverless Function, ver api/upload-event-image.js) — el
// navegador nunca ve la clave secreta ni llama a WordPress directamente.
// Alternativa a Application Passwords de WordPress (descartadas por
// Braulio, problemas para activarlas en el sitio) y a subir a Supabase
// Storage (que la galería ya dejó de usar, ver ajuste anterior "de subida
// a Supabase Storage a enlaces").

const ALLOWED_TYPES = { 'image/jpeg': true, 'image/png': true, 'image/webp': true };
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB — mismo límite en el endpoint intermedio y en el snippet de WordPress

export class InvalidImageError extends Error {}

export async function uploadEventImageToWordpress(file) {
  if (!file) {
    throw new InvalidImageError('No se seleccionó ningún archivo.');
  }
  if (!ALLOWED_TYPES[file.type]) {
    throw new InvalidImageError('Formato no permitido. Usa una imagen JPG, PNG o WEBP.');
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new InvalidImageError('La imagen supera el tamaño máximo permitido (8MB).');
  }

  const response = await fetch('/api/upload-event-image', {
    method: 'POST',
    headers: {
      'Content-Type': file.type,
      'X-Filename': encodeURIComponent(file.name || 'imagen.jpg'),
    },
    body: file,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.url) {
    throw new Error(data?.error || 'No se pudo subir la imagen a WordPress.');
  }

  return data.url;
}
