# Fase 00 — Gestión

**Estado:** en revisión (gate pendiente)
**Inicio:** 17 de noviembre de 2026
**Responsable:** Orquestador
**Revisores:** Product analyst, Security, Tech writer y un revisor independiente
**Siguiente fase:** [`fase-01-ux.md`](fase-01-ux.md) (aprobada, pendiente re-revisión)

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

- SRS v1.2 completo (secciones 0–20): 438 requisitos (429 + 9 nuevos).
- Correcciones del usuario incorporadas: servidor propio sin UPS, seguridad
  autogestionada, dominio, assets demo y estados vacíos.
- Correcciones del Gate 0: 4 P1 y 14 P2 remediados en SRS v1.2.
- Decisiones (D-01 a D-30), riesgos (R-01 a R-33), glosario y cambios.
- Plan de sprints, roles de agentes y Definition of Done.
- Matriz de trazabilidad de los 438 requisitos.
- Registro de skills y política de revisión.
- Estructura del repositorio, `.gitignore`, `.env.example`, `AGENTS.md` y
  `SECURITY.md`.
- Política de assets demo y `assets/demo/README.md`.

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
| SRS v1.2 | [`docs/00-gestion/srs-v1.2.md`](../00-gestion/srs-v1.2.md) | completo, re-revisión pendiente |
| SRS v1.1 (rechazado) | [`docs/00-gestion/srs-v1.1.md`](../00-gestion/srs-v1.1.md) | histórico |
| Cambios v1.0→v1.1→v1.2 | [`docs/00-gestion/cambios-srs.md`](../00-gestion/cambios-srs.md) | completo |
| Decisiones (D-01–D-30) | [`docs/00-gestion/decisiones.md`](../00-gestion/decisiones.md) | completo |
| Riesgos (R-01–R-33) | [`docs/00-gestion/riesgos.md`](../00-gestion/riesgos.md) | completo |
| Glosario | [`docs/00-gestion/glosario.md`](../00-gestion/glosario.md) | completo |
| Plan de sprints | [`docs/00-gestion/plan-sprints.md`](../00-gestion/plan-sprints.md) | completo |
| Trazabilidad | [`docs/00-gestion/trazabilidad.md`](../00-gestion/trazabilidad.md) | pendiente regenerar (438 filas) |
| Skills | [`docs/00-gestion/skills.md`](../00-gestion/skills.md) | completo |
| Assets demo | [`assets/demo/README.md`](../../assets/demo/README.md) | completo |
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

- [x] Secciones 0–20 completas (v1.2: 438 requisitos + 9 nuevos).
- [x] 438 requisitos con ID único (429 originales + BCK-21–23 + A11Y-23–28).
- [x] 40 escenarios de aceptación (`AC-01`–`AC-40`) corregidos.
- [x] Sin IDs duplicados.
- [x] Interenlace `RF-P40` coherente con el texto de la sección 1.5.
- [x] Estados vacíos, demo, backups, seguridad y apagones cubiertos.
- [x] Decisiones abiertas listadas y con impacto (D-23 a D-30 registradas).
- [x] Correcciones del Gate 0: 4 P1 y 14 P2 remediados.
- [ ] Re-revisión independiente del SRS v1.2 contra informe de revisión.
- [ ] Aprobación del usuario (D-23 a D-30).

### 5.2 Repositorio

- [x] `.gitignore` protege `.env`, claves, backups, datos y medios privados.
- [x] `.env.example` solo contiene nombres y valores vacíos.
- [x] Sin secretos en los archivos creados (revisión manual).
- [ ] `gitleaks` en pre-commit y CI (**planificado, no activo** `D-30`; `SEG-40` bloqueado).
- [ ] Repositorio remoto en GitHub y protección de `main`.
- [ ] Ramas y PRs configurados.

### 5.3 Planificación

- [x] Plan de sprints S0–S10 (ajustado a SRS v1.2).
- [x] Roles de agentes y permisos.
- [ ] Matriz de trazabilidad completa (**pendiente regenerar**: 438 filas).
- [x] Registro de skills y checklist de revisión.
- [x] Riesgos con mitigación y propietario (R-26 a R-33).

### 5.4 Assets

- [x] Política de procedencia y licencia.
- [x] `assets/demo/README.md` con procedencia y licencia.
- [x] Regla de no atribuir demo al autor.
- [ ] Assets demo generados o seleccionados (sprint 6).

---

## 6. Decisiones abiertas que bloquean la siguiente fase

| # | Decisión | Bloquea | Propuesta |
|---|---|---|---|
| 1 | Hardware del servidor (CPU, RAM, disco, batería, BIOS). | S2/S9 | **Decidida:** mínimo 8 GB RAM, Ubuntu LTS (`D-23/24`). |
| 2 | Ubuntu Server LTS vs Windows + Docker. | S2/S9 | **Decidida:** Ubuntu Server LTS único (`D-24`). |
| 3 | Correo público y proveedor. | S8 | Abierta (`D-10`); formulario + proveedor transaccional. |
| 4 | Licencia del contenido y del código. | S10 | Propuesta (`D-11`); todos los derechos reservados. |
| 5 | Personas identificables y autorizaciones. | S10 | Abierta (`D-27`); checklist legal antes de publicar. |
| 6 | Colecciones iniciales. | S1/S6 | Abierta; definir en UX/contenido. |
| 7 | ¿Lanzar con assets demo o esperar? | S6 | **Decidida:** lanzamiento vacío; demo solo staging (`D-25`). |
| 8 | Proveedor de backups externo. | S9 | Abierta; R2 + B2; RPO 24 h, RTO 4 h; Object Lock (`D-29`). |

Ninguna de estas decisiones impide empezar UX y arquitectura, pero sí impiden
cerrar el gate de release.

---

## 7. Riesgos de la fase

| Riesgo | Estado | Mitigación |
|---|---|---|
| El SRS creció y puede tener contradicciones. | abierto | Revisión independiente y matriz de trazabilidad. |
| El alcance incluye S y C que retrasan v1. | abierto | M primero; C fuera; revisión por sprint. |
| El usuario no ha confirmado hardware ni correo. | abierto | **Hardware decidido** (`D-23/24`); correo abierto (`D-10`). |
| Los assets demo pueden confundirse con obra real. | abierto | Lanzamiento vacío (`D-25`); demo solo staging. |
| No hay repo remoto todavía. | abierto | Instalar/autenticar `gh` y crear el repo. |
| `gitleaks` no está instalado localmente. | abierto | **Planificado, no activo** (`D-30`); `SEG-40` bloqueado. |
| Re-revisión independiente bloquea el gate. | abierto | Programar tras editar SRS v1.2 completo. |

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

- [ ] El revisor independiente confirma que el SRS v1.2 cubre las correcciones
  del Gate 0 y no tiene contradicciones P1/P2.
- [ ] El usuario aprueba las decisiones D-23 a D-30, el alcance y el plan.
- [ ] El repositorio tiene commits iniciales y rama de trabajo.
- [ ] No hay secretos en el historial.
- [ ] La matriz de trazabilidad cubre los 438 requisitos (`M` verificados).
- [ ] Los riesgos P1 tienen mitigación y propietario.
- [ ] Re-revisión independiente aprueba el SRS v1.2.

**Resultado:** pendiente (Gate 0 rechazado; re-revisión pendiente).

---

## 10. Siguiente fase

[`Fase 01 — UX`](fase-01-ux.md): sitemap, flujos, wireframes, prototipo y
design system. No se escribe código de producción hasta que el prototipo esté
aprobado.
