# Changelog del proyecto

Registro de eventos relevantes que no son parte del trabajo de una fase específica (cambios de infraestructura, propiedad del repositorio, etc.), para que no generen dudas en el futuro.

## 2026-07-26 — Transferencia de propiedad del repositorio en GitHub

El repositorio se transfirió de la cuenta personal `WARISNAKE421` (posteriormente renombrada a `bcastrotibox`) a la cuenta corporativa `bcastrotbx`, como parte de formalizar la propiedad del proyecto bajo TIBOX.

- **Quién:** transferencia realizada manualmente por Braulio Castro directamente en GitHub.
- **Por qué:** formalizar la propiedad del proyecto bajo una cuenta corporativa, en vez de la cuenta personal usada durante el desarrollo inicial.
- **URL del remoto `origin`:** cambió de `https://github.com/WARISNAKE421/TiboxConnect.git` a `https://github.com/bcastrotbx/TiboxConnect.git`. El historial de commits, ramas y el nombre del repositorio (`TiboxConnect`) no cambiaron — solo la cuenta propietaria.
- **Contexto:** el owner original (`WARISNAKE421`) fue confirmado explícitamente con Braulio en la [Fase 00](phases/FASE-00-PREPARACION.md) antes de clonar/trabajar el repositorio. El cambio de propiedad se detectó durante un `git push` de la Fase 3 (el remoto ya apuntaba a `bcastrotbx` en ese momento) y fue confirmado por Braulio como una transferencia intencional, no un error ni una suplantación.
- **Impacto en el trabajo en curso:** ninguno. La rama `feat/react-vite-migration` y todo su historial se conservaron intactos; el trabajo continuó normalmente contra el nuevo remoto.
