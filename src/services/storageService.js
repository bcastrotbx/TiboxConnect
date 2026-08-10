import { supabase } from '../lib/supabase.js';

// Fase 8 (acotada) — subida de imágenes al bucket público content-images.
// Solo administradores pueden subir de verdad (RLS en storage.objects, ver
// supabase/migrations/20260729100200_storage_content_images.sql) — este
// servicio no "protege" nada por sí mismo, es Supabase quien rechaza la
// subida si quien llama no tiene sesión de admin activa.

const BUCKET = 'content-images';
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export class InvalidImageError extends Error {}

function extractStoragePath(url) {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null; // URL externa (ej. Unsplash) — no es nuestra, nunca se toca
  return url.slice(idx + marker.length);
}

// Ajuste posterior (auditoría del panel admin): eliminar o editar un
// contenido/evento no borraba su imagen del bucket `content-images` —
// cada archivo subido queda huérfano para siempre. Se agrega esta limpieza,
// llamada desde adminContentService/adminEventsService después de un
// delete o de un update que reemplaza la imagen. Antes de borrar, confirma
// que ningún otro content_item ni evento siga apuntando a la misma URL —
// "Duplicar" copia thumbnail_url tal cual a la fila nueva, así que dos
// filas pueden compartir legítimamente el mismo archivo. Nunca lanza: un
// archivo huérfano es un problema menor comparado con que falle la
// operación principal (delete/update) por un error de limpieza secundario.
export async function deleteContentImageIfUnused(url) {
  const path = extractStoragePath(url);
  if (!path) return;
  try {
    const [{ count: itemsCount, error: itemsError }, { count: eventsCount, error: eventsError }] = await Promise.all([
      supabase.from('content_items').select('id', { count: 'exact', head: true }).eq('thumbnail_url', url),
      supabase.from('events').select('id', { count: 'exact', head: true }).eq('thumbnail_url', url),
    ]);
    if (itemsError || eventsError) throw itemsError || eventsError;
    if ((itemsCount || 0) > 0 || (eventsCount || 0) > 0) return;
    await supabase.storage.from(BUCKET).remove([path]);
  } catch (err) {
    console.error('No se pudo limpiar la imagen huérfana en Storage:', err);
  }
}

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): borrado directo,
// sin la comprobación de "¿algo más sigue usando esta imagen?" que hace
// deleteContentImageIfUnused. Pensado para la galería de fotos de un
// evento (events.gallery, un array — no una columna 1-a-1 como
// thumbnail_url/partner_logo_url, así que esa comprobación no aplica de la
// misma forma) en dos casos: (a) el admin sube una foto y la elimina de
// nuevo antes de guardar el formulario — nunca llegó a guardarse en
// ninguna fila, así que no hay nada que "esté usándola"; (b) al editar o
// eliminar un evento, se compara la galería anterior contra la nueva y se
// borran las fotos que ya no están (ver adminEventsService.updateEvent/
// deleteEvent) — cada foto de galería es propia de su evento, no se
// comparte entre filas como sí puede pasar con thumbnail_url al duplicar.
export async function deleteContentImageUnconditional(url) {
  const path = extractStoragePath(url);
  if (!path) return;
  try {
    await supabase.storage.from(BUCKET).remove([path]);
  } catch (err) {
    console.error('No se pudo eliminar la imagen de la galería en Storage:', err);
  }
}

export async function uploadContentImage(file) {
  if (!file) {
    throw new InvalidImageError('No se seleccionó ningún archivo.');
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    throw new InvalidImageError('Formato no permitido. Usa una imagen JPG, PNG o WEBP.');
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new InvalidImageError('La imagen supera el tamaño máximo permitido (5MB).');
  }

  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
