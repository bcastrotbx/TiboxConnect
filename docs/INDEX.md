# Índice de documentación — TIBOX Connect

Documentación del proceso de migración y estabilización del prototipo TIBOX Connect.

## Fases

- [Fase 00 — Preparación y diagnóstico](phases/FASE-00-PREPARACION.md) — inventario del estado actual, riesgos y prerequisitos antes de tocar código.
- [Fase 01 — Migración a React + Vite](phases/FASE-01-MIGRACION-VITE.md) — conversión del prototipo CDN/Babel a una app Vite real, sin cambiar diseño ni comportamiento visual.
- [Fase 01B — Ajustes visuales y de texto (Paula)](phases/FASE-01B-AJUSTES-VISUALES-PAULA.md) — 8 ajustes de texto/UX pedidos por negocio sobre eventos, servicios, videoteca, infografías, noticias y contacto, sin tocar el modelo de datos ni conectar backend.
- [Fase 02 — Rutas, layouts y datos hardcodeados](phases/FASE-02-RUTAS-Y-DATOS.md) — rutas reales con react-router-dom, admin unificado en la misma app (mapeo completo de sus 10 secciones a las nuevas URLs), datos movidos a `src/data/seed/` detrás de `src/services/*`, estados de carga/vacío/error. Sin Supabase, sin login todavía.
- [Fase 03 — Conexión base a Supabase](phases/FASE-03-SUPABASE-SETUP.md) — `.env.local`/`.env.example`, cliente en `src/lib/supabase.js` con validación explícita de variables faltantes. Sin tablas, sin autenticación, sin conectar `src/services/*` todavía.
- [Fase 04 — Modelo de datos y Row Level Security](phases/FASE-04-MODELO-DATOS-RLS.md) — 9 tablas + RLS vía migraciones SQL versionadas en `supabase/migrations/`, función `is_admin()`, trigger de perfil sobre `auth.users`, seed de datos idempotente. Sin conectar `src/services/*`, sin login todavía.
- [Fase 05 — Autenticación real de administradores](phases/FASE-05-AUTENTICACION.md) — login/logout real (`supabase.auth`), protección de `/admin/*` vía `AdminRoute`, recuperación de contraseña, invitación de administradores adicionales (Edge Function `invite-admin`). Sin conectar el resto de `src/services/*` todavía.

## Modelo de datos

- [DATA-MODEL.md](DATA-MODEL.md) — esquema completo de tablas, relaciones, RLS y funciones creado en la Fase 4.

## Decisiones de arquitectura (ADR)

- [ADR-004 — Sin registro/login público de usuarios finales](decisions/ADR-004-SIN-REGISTRO-PUBLICO.md) — el portal será público sin cuenta; la autenticación se reserva solo para administradores, con invitación de administradores adicionales en una fase futura. Reemplaza la sección 4.2 del plan maestro para la Fase 5.
- [ADR-005 — Promoción a administrador en el momento de la invitación](decisions/ADR-005-PROMOCION-ADMIN-EN-INVITACION.md) — por qué un administrador invitado recibe `role='admin'` de inmediato, en vez de un segundo paso de aprobación tras aceptar la invitación.

## Otros documentos

- [README.md](../README.md) — estado actual del proyecto, cómo abrirlo, qué es real y qué es solo visual.
- [CHANGELOG.md](CHANGELOG.md) — eventos relevantes que no son parte de una fase específica (cambios de infraestructura, propiedad del repositorio, etc.).

## Convención

Cada fase vive en `docs/phases/FASE-NN-NOMBRE.md` y documenta: objetivo, hallazgos, comandos ejecutados, riesgos y qué queda pendiente para la fase siguiente. Este índice se actualiza a medida que se agregan fases nuevas.
