# Índice de documentación — TIBOX Connect

Documentación del proceso de migración y estabilización del prototipo TIBOX Connect.

## Fases

- [Fase 00 — Preparación y diagnóstico](phases/FASE-00-PREPARACION.md) — inventario del estado actual, riesgos y prerequisitos antes de tocar código.
- [Fase 01 — Migración a React + Vite](phases/FASE-01-MIGRACION-VITE.md) — conversión del prototipo CDN/Babel a una app Vite real, sin cambiar diseño ni comportamiento visual.
- [Fase 01B — Ajustes visuales y de texto (Paula)](phases/FASE-01B-AJUSTES-VISUALES-PAULA.md) — 8 ajustes de texto/UX pedidos por negocio sobre eventos, servicios, videoteca, infografías, noticias y contacto, sin tocar el modelo de datos ni conectar backend.
- [Fase 02 — Rutas, layouts y datos hardcodeados](phases/FASE-02-RUTAS-Y-DATOS.md) — rutas reales con react-router-dom, admin unificado en la misma app (mapeo completo de sus 10 secciones a las nuevas URLs), datos movidos a `src/data/seed/` detrás de `src/services/*`, estados de carga/vacío/error. Sin Supabase, sin login todavía.
- [Fase 03 — Conexión base a Supabase](phases/FASE-03-SUPABASE-SETUP.md) — `.env.local`/`.env.example`, cliente en `src/lib/supabase.js` con validación explícita de variables faltantes. Sin tablas, sin autenticación, sin conectar `src/services/*` todavía.

## Decisiones de arquitectura (ADR)

- [ADR-004 — Sin registro/login público de usuarios finales](decisions/ADR-004-SIN-REGISTRO-PUBLICO.md) — el portal será público sin cuenta; la autenticación se reserva solo para administradores, con invitación de administradores adicionales en una fase futura. Reemplaza la sección 4.2 del plan maestro para la Fase 5.

## Otros documentos

- [README.md](../README.md) — estado actual del proyecto, cómo abrirlo, qué es real y qué es solo visual.

## Convención

Cada fase vive en `docs/phases/FASE-NN-NOMBRE.md` y documenta: objetivo, hallazgos, comandos ejecutados, riesgos y qué queda pendiente para la fase siguiente. Este índice se actualiza a medida que se agregan fases nuevas.
