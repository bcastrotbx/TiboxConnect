// Ajuste posterior: generalizado desde wordpressUploadService.js (que solo
// servía a la galería de fotos de eventos) para que cualquier imagen de
// contenido del portal — Noticias, Videos y Webinars, Infografías, Portada,
// banner/logo de eventos — suba al mismo destino:
// comunidad.tiboxlab.cl/imagenes-portal/, vía el endpoint intermedio propio
// /api/upload-image (Vercel Serverless Function, ver api/upload-image.js).
// El navegador nunca ve la clave secreta (WP_UPLOAD_SECRET) ni llama a ese
// subdominio directamente.
//
// Por qué no Supabase Storage (que Noticias/Infografías/Portada seguían
// usando hasta este ajuste): mismo criterio que ya se aplicó a la galería
// de eventos — se centraliza todo en un solo destino administrado por
// Braulio, sin gastar cuota de Storage del proyecto Supabase.

const ALLOWED_TYPES = { 'image/jpeg': true, 'image/png': true, 'image/webp': true };
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB — mismo límite en el endpoint intermedio y en el snippet de WordPress

export class InvalidImageError extends Error {}

export async function uploadPortalImage(file) {
  if (!file) {
    throw new InvalidImageError('No se seleccionó ningún archivo.');
  }
  if (!ALLOWED_TYPES[file.type]) {
    throw new InvalidImageError('Formato no permitido. Usa una imagen JPG, PNG o WEBP.');
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new InvalidImageError('La imagen supera el tamaño máximo permitido (8MB).');
  }

  const response = await fetch('/api/upload-image', {
    method: 'POST',
    headers: {
      'Content-Type': file.type,
      'X-Filename': encodeURIComponent(file.name || 'imagen.jpg'),
    },
    body: file,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.url) {
    throw new Error(data?.error || 'No se pudo subir la imagen.');
  }

  return data.url;
}
