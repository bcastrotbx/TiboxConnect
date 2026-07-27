import { createClient } from '@supabase/supabase-js';

// Fase 3: solo deja el cliente creado y disponible. Ningún servicio de
// src/services/* lo usa todavía — eso llega en la Fase 6 (o antes, en la
// Fase 4, si se decide conectar autenticación primero).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '[supabase] Faltan variables de entorno VITE_SUPABASE_URL y/o ' +
    'VITE_SUPABASE_PUBLISHABLE_KEY. Copia .env.example como .env.local en ' +
    'la raíz del proyecto y completa ambos valores (ver ' +
    'docs/phases/FASE-03-SUPABASE-SETUP.md). Sin estas variables, el ' +
    'cliente de Supabase no puede inicializarse.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
