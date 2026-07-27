# ADR-004 — Sin registro/login público de usuarios finales

**Estado:** Aceptada
**Fecha:** 2026-07-23
**Contexto de la decisión:** Fase 01B (ajustes visuales de Paula), a petición explícita de Braulio

## Contexto

El plan maestro del proyecto describía originalmente, en su sección 4.2, un flujo de registro y login públicos para usuarios finales del portal TIBOX Connect (clientes de TIBOX creando cuenta para acceder al contenido). Este documento no está versionado en este repositorio — es referencia externa al equipo de negocio/producto — por lo que este ADR no reproduce su contenido original, solo documenta que lo reemplaza.

Braulio indicó explícitamente, durante la Fase 01B, que esa sección queda redefinida: **el portal completo será público** (sin barrera de registro/login para consultarlo) y **la autenticación se reserva exclusivamente para administradores** del panel `/admin/`.

## Decisión

1. El portal (`/`) **no tendrá registro ni login públicos** para usuarios finales. Todo el contenido (videos, infografías, noticias, eventos, servicios) es de acceso público sin cuenta.
2. La autenticación **solo aplica al panel de administración** (`/admin/`) — hoy simulada (usuario "Alejandro Díaz" hardcodeado, sin backend real; ver Fase 0 y Fase 1), pendiente de implementación real en una fase futura.
3. Se agregará, en una fase futura, una función para que un administrador **invite a otros administradores adicionales** (multi-admin), reemplazando cualquier flujo de auto-registro.
4. Esto reemplaza lo descrito en la sección 4.2 del plan maestro original para la Fase 5.

## Consecuencias

- El sidebar del portal muestra hoy una sesión de ejemplo ("Carlos Mora — Empresa Modelo S.A.") que ya no representa un "usuario registrado" en el sentido de una cuenta creada por registro público — es contenido de ejemplo del prototipo visual, sin relación con esta decisión de producto. Se documenta para evitar confusión futura entre "usuario de ejemplo en la UI" y "modelo de autenticación real".
- Cualquier trabajo futuro de autenticación (Fase 5 o posterior) debe implementarse **solo** para el panel admin: login de administrador + invitación de administradores adicionales. No debe construirse un flujo de registro/login para el público general.
- No se requiere en esta fase ni en la Fase 2 (rutas) ningún guardrail de "usuario no autenticado" en las rutas del portal público — todas las rutas del portal son abiertas por diseño.
- El sistema de "Agregar usuario" (invitar administradores) queda explícitamente fuera de alcance de la Fase 01B — ver pendientes en [FASE-01B-AJUSTES-VISUALES-PAULA.md](../phases/FASE-01B-AJUSTES-VISUALES-PAULA.md).

## Referencias

- [Fase 00 — Preparación](../phases/FASE-00-PREPARACION.md) — documenta el usuario de ejemplo "Carlos Mora" y el admin "Alejandro Díaz" como datos hardcodeados sin autenticación real.
- [Fase 01B — Ajustes visuales de Paula](../phases/FASE-01B-AJUSTES-VISUALES-PAULA.md) — fase en la que se registró esta decisión.
