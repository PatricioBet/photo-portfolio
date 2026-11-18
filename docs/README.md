# Documentación — photo.patriciobet.dev

Índice y mapa de fases. La documentación se escribe **antes** del código y se
actualiza en el mismo PR que el cambio.

## Mapa de fases

| Fase | Carpeta | Objetivo | Gate |
|---|---|---|---|
| 0 | `docs/00-gestion/` | SRS v1.1, decisiones, riesgos, alcance, plan, trazabilidad | SRS aprobado; repo protegido; cero secretos |
| 1 | `docs/01-producto/`, `docs/02-ux/` | Casos de uso, criterios, sitemap, flujos, wireframes, prototipo, design system | Prototipo navegable aprobado |
| 2 | `docs/03-arquitectura/`, `docs/04-calidad/` | SAD/C4, ADR, modelo de datos, OpenAPI, pipeline, seguridad, infraestructura, backups, observabilidad, plan de pruebas | Revisión de arquitectura/seguridad; OpenAPI válido |
| 3–9 | `apps/`, `packages/`, `infra/`, `tests/` | Implementación por verticales, pruebas independientes y hardening | Gates de sprint |
| 10 | `docs/05-operacion/`, `docs/04-calidad/reportes/` | Manuales, UAT, auditorías y release | `v1.0.0` con evidencia |

## Índice

### 00 — Gestión

- [SRS v1.1](00-gestion/srs-v1.1.md)
- [Cambios v1.1](00-gestion/cambios-srs.md)
- [Decisiones](00-gestion/decisiones.md)
- [Riesgos](00-gestion/riesgos.md)
- [Glosario](00-gestion/glosario.md)
- [Plan de sprints](00-gestion/plan-sprints.md)
- [Trazabilidad](00-gestion/trazabilidad.md)
- [Skills](00-gestion/skills.md)

### 01 — Producto

Estado: **en revisión** (Gate 0 rechazado; ver reporte de sprint 0).

- [Actores y casos de uso](01-producto/actores-casos-uso.md)
- [Criterios de aceptación y UAT](01-producto/criterios-aceptacion.md)
- [Contenido y copy ES/EN](01-producto/contenido-copy-es-en.md)
- [Legal, privacidad y licencias](01-producto/legal-privacidad.md)

### 02 — UX

Estado: **en revisión**. El prototipo está validado técnicamente, pero el Gate 1
no se abre hasta cerrar el Gate 0.

- [Sitemap](02-ux/sitemap.md)
- [Flujos](02-ux/flujos/README.md)
- [Wireframes](02-ux/wireframes/README.md)
- [Prototipo navegable](02-ux/prototipo/README.md)
- [Design system](02-ux/design-system.md)
- [Accesibilidad](02-ux/accesibilidad.md)

### 03 — Arquitectura

- `03-arquitectura/sad.md` (pendiente)
- `03-arquitectura/c4/` (pendiente)
- `03-arquitectura/adr/` (pendiente)
- `03-arquitectura/modelo-datos.md` (pendiente)
- `03-arquitectura/api/openapi.yaml` (pendiente)
- `03-arquitectura/pipeline-medios.md` (pendiente)
- `03-arquitectura/seguridad.md` (pendiente)
- `03-arquitectura/infraestructura.md` (pendiente)
- `03-arquitectura/despliegue.md` (pendiente)
- `03-arquitectura/backups-dr.md` (pendiente)
- `03-arquitectura/observabilidad.md` (pendiente)

### 04 — Calidad

- `04-calidad/plan-pruebas.md` (pendiente)
- `04-calidad/matriz-pruebas.md` (pendiente)
- `04-calidad/presupuestos-rendimiento.md` (pendiente)
- `04-calidad/checklist-seguridad.md` (pendiente)
- `04-calidad/plan-uat.md` (pendiente)
- [Revisión independiente SRS v1.1](04-calidad/reportes/sprint-0-revision-srs.md) —
  **rechazado para Gate 0**
- `04-calidad/reportes/` (el resto se genera por sprint)

### 05 — Operación

- `05-operacion/manual-usuario.md` (pendiente)
- `05-operacion/manual-despliegue.md` (pendiente)
- `05-operacion/runbook.md` (pendiente)
- `05-operacion/recuperacion.md` (pendiente)
- `05-operacion/mantenimiento.md` (pendiente)

### 06 — Fases

- [Fase 00 — Gestión](06-fases/fase-00-gestion.md)
- [Fase 01 — Producto y UX](06-fases/fase-01-ux.md)
- `06-fases/fase-02-arquitectura.md` (pendiente)

### Assets

- [Política de assets demo](../assets/demo/README.md)
- [Manifest demo](../assets/demo/manifest.json)
- [Esquema del manifest](../assets/demo/manifest.schema.json)

## Convenciones

- Requisitos con ID (`RF-P01`, `SEG-05`, `DEP-12`, etc.) y prioridad M/S/C.
- Diagramas en Mermaid cuando sea posible.
- Enlaces relativos.
- Sin secretos, correos personales ni rutas locales.
- Cada documento indica su estado: `borrador`, `en revisión`, `aprobado` o
  `obsoleto`.
