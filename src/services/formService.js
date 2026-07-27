import { simulateDelay } from './simulateDelay.js';

// Todos los envíos de esta fase siguen siendo simulados (setTimeout, sin
// backend real ni Supabase) — ver docs/phases/FASE-02-RUTAS-Y-DATOS.md.
// Las firmas ya devuelven Promise<{ ok: boolean }> para que en la Fase 6
// solo cambie la implementación interna (POST real a Supabase), no quién
// llama a estas funciones. `_data` se mantiene en la firma (sin usar
// todavía) para documentar el contrato que tendrá la implementación real.

export function submitContactForm(_data) {
  return simulateDelay({ ok: true }, 1200);
}

export function submitOpinionForm(_data) {
  return simulateDelay({ ok: true }, 1200);
}

// TODO(fase posterior): guardar el lead en un backend real y mostrarlo en
// el panel admin (sección de leads de infografías). Por ahora solo simula
// el envío; el llamador es responsable de recordar el consentimiento de la
// visita actual en sessionStorage.
export function submitInfografiaLead(_data) {
  return simulateDelay({ ok: true }, 900);
}
