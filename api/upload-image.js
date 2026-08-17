// Endpoint intermedio (Vercel Serverless Function) — reenvía la subida de
// cualquier imagen de contenido del portal (Noticias, Videos y Webinars,
// Infografías, Portada, banner/logo/galería de eventos) al endpoint REST
// personalizado en comunidad.tiboxlab.cl (ver
// docs/integrations/wordpress-upload-image-snippet.php), sin que la clave
// secreta (WP_UPLOAD_SECRET) llegue nunca al navegador. El frontend manda
// el archivo en crudo (no multipart) con su tipo real en el header
// Content-Type y el nombre en X-Filename; acá se arma el multipart/form-data
// que ese endpoint espera y se agrega la clave.
//
// Renombrado desde upload-event-image.js (ver
// portalImageUploadService.js): antes era exclusivo de la galería de fotos
// de eventos, ahora es el destino único para toda imagen de contenido del
// admin, reemplazando la subida directa a Supabase Storage que usaban
// Noticias/Infografías/Portada.
//
// Se descartó Application Passwords de WordPress por problemas para
// activarlas en el sitio (pedido de Braulio) — este endpoint + clave
// secreta fija es la alternativa.

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 8 * 1024 * 1024; // 8MB — mismo límite en el snippet de WordPress y en el frontend
const WP_ENDPOINT = 'https://comunidad.tiboxlab.cl/upload-image.php';

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BYTES) {
        req.destroy();
        reject(new Error('TOO_LARGE'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido.' });
    return;
  }

  const contentType = req.headers['content-type'] || '';
  if (!ALLOWED_TYPES.has(contentType)) {
    res.status(400).json({ error: 'Formato no permitido. Usa una imagen JPG, PNG o WEBP.' });
    return;
  }

  const secret = process.env.WP_UPLOAD_SECRET;
  if (!secret) {
    res.status(500).json({ error: 'El servidor no tiene configurada la clave de subida (WP_UPLOAD_SECRET).' });
    return;
  }

  let buffer;
  try {
    buffer = await readRawBody(req);
  } catch (err) {
    if (err.message === 'TOO_LARGE') {
      res.status(413).json({ error: 'La imagen supera el tamaño máximo permitido (8MB).' });
      return;
    }
    res.status(400).json({ error: 'No se pudo leer el archivo enviado.' });
    return;
  }

  if (buffer.length === 0) {
    res.status(400).json({ error: 'El archivo llegó vacío.' });
    return;
  }

  const rawFilename = req.headers['x-filename'];
  let filename = 'imagen.jpg';
  try {
    if (rawFilename) filename = decodeURIComponent(rawFilename);
  } catch {
    // Nombre mal codificado — se usa el genérico de respaldo, no es
    // motivo para rechazar la subida.
  }

  try {
    const form = new FormData();
    form.append('file', new Blob([buffer], { type: contentType }), filename);

    const wpResponse = await fetch(WP_ENDPOINT, {
      method: 'POST',
      headers: { 'X-Tibox-Secret': secret },
      body: form,
    });

    const data = await wpResponse.json().catch(() => null);

    if (!wpResponse.ok || !data?.url) {
      const message = data?.message || 'No se pudo procesar la imagen.';
      res.status(502).json({ error: message });
      return;
    }

    res.status(200).json({ url: data.url });
  } catch {
    res.status(502).json({ error: 'No se pudo conectar con el servidor de imágenes para subir la imagen.' });
  }
}
