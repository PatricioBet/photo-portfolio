# Fase 00 — Gestión

**Estado:** en revisión (gate pendiente)
**Inicio:** 17 de noviembre de 2026
**Responsable:** Orquestador
**Revisores:** Product analyst, Security, Tech writer y un revisor independiente
**Siguiente fase:** [`fase-01-ux.md`](fase-01-ux.md) (pendiente)

---

## 1. Objetivo

Dejar el proyecto listo para diseñar y construir sin ambigüedades: requisitos
completos, decisiones registradas, riesgos visibles, repositorio limpio y un plan
de sprints con gates verificables.

La fase 0 **no escribe código de producción**. Su entregable es documentación
aprobable y un repositorio seguro.

---

## 2. Alcance

### Dentro

- SRS v1.1 completo (secciones 0–20).
- Correcciones del usuario incorporadas: servidor propio sin UPS, seguridad
  autogestionada, dominio, assets demo y estados vacíos.
- Decisiones, riesgos, glosario y cambios respecto a v1.0.
- Plan de sprints, roles de agentes y Definition of Done.
- Matriz de trazabilidad de los 429 requisitos.
- Registro de skills y política de revisión.
- Estructura del repositorio, `.gitignore`, `.env.example`, `AGENTS.md` y
  `SECURITY.md`.
- Política de assets demo y manifest vacío.

### Fuera

- Código de la aplicación.
- Prototipo UX.
- Arquitectura detallada.
- Contratación de servicios o compra de dominios.
- Publicación en producción.

---

## 3. Entregables

| Entregable | Archivo | Estado |
|---|---|---|
| SRS v1.1 | [`docs/00-gestion/srs-v1.1.md`](../00-gestion/srs-v1.1.md) | completo, en revisión |
| Cambios v1.0 → v1.1 | [`docs/00-gestion/cambios-srs.md`](../00-gestion/cambios-srs.md) | completo |
| Decisiones | [`docs/00-gestion/decisiones.md`](../00-gestion/decisiones.md) | completo |
| Riesgos | [`docs/00-gestion/riesgos.md`](../00-gestion/riesgos.md) | completo |
| Glosario | [`docs/00-gestion/glosario.md`](../00-gestion/glosario.md) | completo |
| Plan de sprints | [`docs/00-gestion/plan-sprints.md`](../00-gestion/plan-sprints.md) | completo |
| Trazabilidad | [`docs/00-gestion/trazabilidad.md`](../00-gestion/trazabilidad.md) | completo |
| Skills | [`docs/00-gestion/skills.md`](../00-gestion/skills.md) | completo |
| Assets demo | [`assets/demo/README.md`](../../assets/demo/README.md) | completo |
| Manifest demo | [`assets/demo/manifest.json`](../../assets/demo/manifest.json) | vacío, listo |
| Reglas de agentes | [`AGENTS.md`](../../AGENTS.md) | completo |
| Seguridad | [`SECURITY.md`](../../SECURITY.md) | completo |
| Índice de documentación | [`docs/README.md`](../README.md) | completo |

---

## 4. Correcciones del usuario incorporadas

| Corrección | Dónde se refleja |
|---|---|
| El servidor no es la laptop de desarrollo, es una laptop más antigua siempre encendida. | SRS 1.6, 3.2, 18.1; `D-01`; `DEP-01`–`DEP-30`. |
| No hay UPS; debe soportar apagones. | SRS 3.5, 11, 18.3; `D-04`; `BCK-12`–`BCK-15`; `DEP-12`, `DEP-30`. |
| La seguridad es autogestionada y prioritaria. | SRS 10; `D-05`; `SEG-01`–`SEG-47`; `SECURITY.md`. |
| Dominio `photo.patriciobet.dev`. | SRS 3.1; `D-02`; `.env.example`. |
| Assets creados o buscados con licencia. | SRS 4.9, 6.4, 15; `D-07`, `D-21`; `assets/demo/`. |
| El sitio debe funcionar sin fotos ni videos. | SRS 1.3, 4.1, 9.2, 12, 19; `D-06`; `RF-P06`–`RF-P09`; `AC-01`. |
| Información pública del autor. | SRS 1.5; enlaces a GitHub y LinkedIn; sin publicar el correo ofuscado. |

---

## 5. Verificación de la fase

### 5.1 SRS

- [x] Secciones 0–20 completas (el borrador v1.0 terminaba en 8.3).
- [x] 429 requisitos con ID único.
- [x] 40 escenarios de aceptación (`AC-01`–`AC-40`).
- [x] Sin IDs duplicados.
- [x] Interenlace `RF-P40` coherente con el texto de la sección 1.5.
- [x] Estados vacíos, demo, backups, seguridad y apagones cubiertos.
- [x] Decisiones abiertas listadas y con impacto.
- [ ] Revisión independiente del SRS contra el borrador v1.0 y las correcciones.
- [ ] Aprobación del usuario.

### 5.2 Repositorio

- [x] `.gitignore` protege `.env`, claves, backups, datos y medios privados.
- [x] `.env.example` solo contiene nombres y valores vacíos.
- [x] Sin secretos en los archivos creados (revisión manual).
- [ ] `gitleaks` en pre-commit y CI (se instala en el sprint 3).
- [ ] Repositorio remoto en GitHub y protección de `main`.
- [ ] Ramas y PRs configurados.

### 5.3 Planificación

- [x] Plan de sprints S0–S10.
- [x] Roles de agentes y permisos.
- [x] Matriz de trazabilidad completa.
- [x] Registro de skills y checklist de revisión.
- [x] Riesgos con mitigación y propietario.

### 5.4 Assets

- [x] Política de procedencia y licencia.
- [x] Manifest con esquema y estado vacío.
- [x] Regla de no atribuir demo al autor.
- [ ] Assets demo generados o seleccionados (sprint 6).

---

## 6. Decisiones abiertas que bloquean la siguiente fase

| # | Decisión | Bloquea | Propuesta |
|---|---|---|---|
| 1 | Hardware del servidor (CPU, RAM, disco, batería, BIOS). | S2/S9 | Inventariar antes de arquitectura de despliegue. |
| 2 | Ubuntu Server LTS vs Windows + Docker. | S2/S9 | Ubuntu Server LTS. |
| 3 | Correo público y proveedor. | S8 | Formulario + proveedor transaccional; no publicar aún. |
| 4 | Licencia del contenido y del código. | S10 | Todos los derechos reservados. |
| 5 | Personas identificables y autorizaciones. | S10 | Checklist legal antes de publicar. |
| 6 | Colecciones iniciales. | S1/S6 | Definir en UX/contenido. |
| 7 | ¿Lanzar con assets demo o esperar? | S6 | Estados vacíos primero; demo opcional. |
| 8 | Proveedor de backups externo. | S9 | R2 + B2; RPO 24 h, RTO 4 h. |

Ninguna de estas decisiones impide empezar UX y arquitectura, pero sí impiden
cerrar el gate de release.

---

## 7. Riesgos de la fase

| Riesgo | Estado | Mitigación |
|---|---|---|
| El SRS creció y puede tener contradicciones. | abierto | Revisión independiente y matriz de trazabilidad. |
| El alcance incluye S y C que retrasan v1. | abierto | M primero; C fuera; revisión por sprint. |
| El usuario no ha confirmado hardware ni correo. | abierto | Registrar como decisión abierta y no inventar. |
| Los assets demo pueden confundirse con obra real. | abierto | Manifest, `is_demo`, revisión y retiro antes de lanzar. |
| No hay repo remoto todavía. | abierto | Instalar/autenticar `gh` y crear el repo. |
| `gitleaks` no está instalado localmente. | abierto | Instalarlo en S3 y ejecutar escaneo manual mientras tanto. |

---

## 8. Evidencia

| Evidencia | Comando / archivo | Resultado |
|---|---|---|
| Conteo de requisitos | Parseo de tablas del SRS | 429 IDs únicos. |
| Duplicados | Agrupación por ID | 0 duplicados. |
| Cobertura de trazabilidad | Comparación SRS vs matriz | 429/429, 0 faltantes. |
| Secretos | Revisión manual de archivos | Sin valores reales; `.env.example` vacío. |
| Estado Git | `git status` | Repositorio inicializado; commits pendientes. |

Los comandos y resultados completos se guardan en
`docs/04-calidad/reportes/` cuando se ejecute el gate.

---

## 9. Gate de fase

La fase 0 se cierra cuando:

- [ ] El revisor independiente confirma que el SRS cubre las correcciones y no
  tiene contradicciones P1/P2.
- [ ] El usuario aprueba el alcance, las decisiones abiertas y el plan.
- [ ] El repositorio tiene commit inicial y rama de trabajo.
- [ ] No hay secretos en el historial.
- [ ] La matriz de trazabilidad cubre todos los `M`.
- [ ] Los riesgos P1 tienen mitigación y propietario.

**Resultado:** pendiente.

---

## 10. Siguiente fase

[`Fase 01 — UX`](fase-01-ux.md): sitemap, flujos, wireframes, prototipo y
design system. No se escribe código de producción hasta que el prototipo esté
aprobado.
