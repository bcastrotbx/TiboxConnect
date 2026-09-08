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
//
// Ajuste posterior (ver docs/phases/FASE-15-CARGA-EVENTOS-HISTORICOS.md,
// "Hallazgo real: límite de tamaño de request de /api/upload-image"):
// Vercel le pone un límite de ~4.5MB al cuerpo de un request a una función
// serverless — un límite de la PLATAFORMA, no configurable desde acá. El
// chequeo de 8MB de este archivo (MAX_SIZE_BYTES) nunca llega a aplicarse
// para archivos entre 4.5MB y 8MB: Vercel los rechaza con un 413 genérico
// antes de que el código de la función corra. Pasó en la carga de eventos
// históricos con 13 fotos (PNG de 4.5-5.8MB) — se recomprimieron a mano con
// `sips` antes de subirlas. Esta función ahora hace esa misma compresión
// automáticamente en el navegador, para cualquier imagen que se pasaría del
// límite real de la plataforma, sin que el usuario tenga que hacer nada.

// Ajuste posterior (pedido de Braulio): el archivo descargable de una
// infografía ("Imagen de la infografía", antes "Link de la publicación" —
// un campo de texto donde se pegaba a mano cualquier URL) ahora se sube
// como archivo por este mismo servicio, y puede ser una imagen o un PDF —
// antes solo se aceptaban imágenes. application/pdf no se puede comprimir
// con el <canvas> de compressImage() (no es una imagen decodificable por
// createImageBitmap), así que un PDF que supere SAFE_UPLOAD_BYTES se
// rechaza directo en vez de intentar comprimirlo — ver MAX_PDF_BYTES más
// abajo.
const ALLOWED_TYPES = { 'image/jpeg': true, 'image/png': true, 'image/webp': true, 'application/pdf': true };
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB — límite "oficial" que se le muestra al usuario si aun así no entra (solo imágenes, que sí se comprimen)
// Margen de seguridad bajo el límite real de Vercel (~4.5MB) — cualquier
// imagen por encima de esto se comprime antes de intentar subirla.
const SAFE_UPLOAD_BYTES = 4 * 1024 * 1024; // 4MB
// Los PDF no pasan por compressImage(), así que su límite es directamente
// el margen de seguridad de Vercel — no el de 8MB que sí alcanzan las
// imágenes gracias a la compresión previa.
const MAX_PDF_BYTES = SAFE_UPLOAD_BYTES; // 4MB
const MAX_DIMENSION = 2000; // px, lado más largo — de sobra para cualquier uso del portal
const JPEG_QUALITY = 0.82; // mismo criterio de calidad que se usó a mano con `sips` en la carga de eventos

export class InvalidImageError extends Error {}

// Redimensiona (si excede MAX_DIMENSION) y re-codifica a JPEG con
// JPEG_QUALITY, usando un <canvas> — todo en el navegador, sin backend.
// Solo se llama cuando el archivo original ya supera SAFE_UPLOAD_BYTES; si
// el resultado comprimido sigue siendo muy pesado (imagen extremadamente
// grande), igual se sube — el chequeo de MAX_SIZE_BYTES de más abajo es el
// que finalmente decide si se rechaza con un mensaje claro para el usuario.
async function compressImage(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));
  if (!blob) return file; // si por lo que sea el canvas falla, se sigue con el archivo original

  const newName = (file.name || 'imagen').replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], newName, { type: 'image/jpeg' });
}

export async function uploadPortalImage(file) {
  if (!file) {
    throw new InvalidImageError('No se seleccionó ningún archivo.');
  }
  if (!ALLOWED_TYPES[file.type]) {
    throw new InvalidImageError('Formato no permitido. Usa una imagen JPG, PNG, WEBP o un PDF.');
  }

  const isPdf = file.type === 'application/pdf';
  let toUpload = file;

  if (isPdf) {
    // Sin compresión posible — el límite es directo (ver MAX_PDF_BYTES).
    if (file.size > MAX_PDF_BYTES) {
      throw new InvalidImageError('El PDF supera el tamaño máximo permitido (4MB) — a diferencia de las imágenes, los PDF no se comprimen automáticamente. Reduce su tamaño antes de subirlo.');
    }
  } else {
    if (file.size > SAFE_UPLOAD_BYTES) {
      try {
        toUpload = await compressImage(file);
      } catch {
        // Si la compresión falla por lo que sea (navegador sin soporte de
        // createImageBitmap, imagen corrupta, etc.), se sigue con el archivo
        // original — el chequeo de MAX_SIZE_BYTES de abajo decide si se
        // rechaza con un mensaje claro.
        toUpload = file;
      }
    }

    if (toUpload.size > MAX_SIZE_BYTES) {
      throw new InvalidImageError('La imagen supera el tamaño máximo permitido (8MB), incluso después de comprimirla. Prueba con una imagen más liviana.');
    }
  }

  const response = await fetch('/api/upload-image', {
    method: 'POST',
    headers: {
      'Content-Type': toUpload.type,
      'X-Filename': encodeURIComponent(toUpload.name || 'imagen.jpg'),
    },
    body: toUpload,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.url) {
    throw new Error(data?.error || 'No se pudo subir la imagen.');
  }

  return data.url;
}
