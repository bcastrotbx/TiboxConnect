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
