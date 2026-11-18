# Plan de sprints y asignación de agentes

**Estado:** borrador para aprobación
**Versión:** 1.0
**Fecha:** 17 de noviembre de 2026
**Fuente de verdad:** [`srs-v1.1.md`](srs-v1.1.md)

---

## 1. Cómo se trabaja

- Un sprint = un objetivo verificable, no una lista de tareas.
- Cada sprint produce: documentación, código, pruebas, evidencia y un reporte
  en `docs/04-calidad/reportes/`.
- Ningún sprint se cierra sin revisión independiente. El autor no aprueba su
  propio trabajo.
- Los requisitos `M` van primero. Los `S` entran solo si no comprometen un `M`.
  Los `C` no se implementan en v1.
- Si un requisito es ambiguo, se detiene el sprint y se actualiza el SRS/ADR.
- Cada sprint termina con un gate y una decisión explícita: **pasa**, **pasa con
  deuda registrada** o **no pasa**.

### 1.1 Definition of Ready

Un sprint puede empezar cuando:

- los requisitos tienen ID, prioridad y criterio de verificación;
- las dependencias de sprints anteriores están cerradas;
- las decisiones abiertas que lo bloquean están resueltas;
- existe un entorno local reproducible;
- el alcance cabe en el sprint (si no, se divide).

### 1.2 Definition of Done

- Criterios de aceptación cumplidos, incluidos vacío y error.
- Pruebas unitarias, integración y E2E según corresponda.
- CI verde: lint, tipos, unit, integración, build, e2e, gitleaks, SBOM.
- Revisión independiente y QA de aceptación.
- Accesibilidad, i18n, rendimiento y SEO verificados si aplica.
- Documentación y trazabilidad actualizadas.
- Sin secretos, datos personales ni artefactos generados en el diff.
- Rollback documentado.
- Reporte de sprint con evidencia.

### 1.3 Regla de capacidad

| Tipo | Regla |
|---|---|
| M | Obligatorio; bloquea el release. |
| S | Solo si quedan ≥ 20 % de capacidad y no hay riesgo para M. |
| C | Se documenta, no se implementa. |
| Deuda | Se registra con dueño, impacto y sprint objetivo. |

---

## 2. Agentes y responsabilidades

| Agente | Rol | Escribe | Aprueba |
|---|---|---|---|
| Orquestador | Planifica, asigna, desbloquea, cuida el alcance. | `docs/00-gestion/` | Gates de sprint |
| Product analyst | Casos de uso, criterios, contenido, copy. | `docs/01-producto/` | Contenido |
| UX designer | Sitemap, flujos, wireframes, prototipo, design system. | `docs/02-ux/` | UX |
| Arquitecto | SAD/C4, ADR, datos, API, seguridad, despliegue. | `docs/03-arquitectura/` | Arquitectura |
| Backend | API, DB, auth, contratos. | `apps/api/`, `packages/db/`, `packages/contracts/` | — |
| Frontend | Sitio público, admin, UI. | `apps/web/`, `apps/admin/`, `packages/ui/` | — |
| Media | Pipeline de fotos/video. | `apps/media-worker/`, `packages/media-core/` | — |
| DevOps | Infra, Docker, Cloudflare, backups, CI. | `infra/`, `.github/` | — |
| QA | Plan y ejecución de pruebas. | `tests/`, reportes | QA |
| Security | Threat model, escaneos, checklist. | Solo reportes | Seguridad |
| Performance | Lighthouse, bundles, CWV. | Solo reportes | Rendimiento |
| Accessibility | axe, teclado, lector, WCAG. | Solo reportes | Accesibilidad |
| SEO | Crawl, sitemaps, datos estructurados. | Solo reportes | SEO |
| Tech writer | Manuales y runbooks. | `docs/05-operacion/` | Documentación |
| Revisor independiente | Audita el sprint completo. | Reporte | Revisión |
| Release manager | Tags, release notes, evidencia. | `docs/04-calidad/reportes/` | Release |

El orquestador puede actuar como revisor de un sprint que no escribió, pero nunca
de su propio trabajo. Para cada gate se elige un revisor distinto al autor.

---

## 3. Mapa de fases y sprints

| Sprint | Fase | Objetivo | Gate |
|---|---|---|---|
| S0 | 0 — Gestión | SRS v1.1, decisiones, riesgos, plan, repo y skills. | SRS aprobado; cero secretos. |
| S1 | 1 — UX | Sitemap, flujos, wireframes, prototipo y design system. | Prototipo navegable aprobado. |
| S2 | 2 — Arquitectura | SAD/C4, ADR, datos, OpenAPI, pipeline, seguridad, backups, pruebas. | Revisión técnica y de seguridad. |
| S3 | 3 — Fundaciones | Monorepo, CI, Docker, DB, auth, Access, passkeys, salud. | Login E2E; CI verde. |
| S4 | 4 — Fotos | Subida, pipeline, variantes, metadatos, lightbox. | Foto publicada E2E. |
| S5 | 5 — Videos | ffprobe, transcodificación, poster, HLS, reproductor. | Video publicado E2E. |
| S6 | 6 — Sitio público | Home, listados, detalle, búsqueda, SEO, estados vacíos. | Lighthouse/SEO/E2E vacío y lleno. |
| S7 | 7 — Publicación y admin | Builds, releases, rollback, operación, demo. | Publicar ≤ 3 min; rollback. |
| S8 | 8 — Experiencia y hardening | 3D, animaciones, contacto, accesibilidad, CSP. | Fallbacks + WCAG AA. |
| S9 | 9 — Producción | Servidor, Tunnel, backups, monitorización, apagón. | Producción + restore. |
| S10 | 10 — UAT y release | UAT, manuales, auditorías, tag `v1.0.0`. | Aprobación del usuario. |

Cada sprint tiene una rama corta y un PR. La rama se borra tras el merge por
rebase. `main` solo recibe commits revisados.

---

## 4. Detalle de sprints

### Sprint 0 — Gestión

**Rama:** `docs/srs-v1.1`

**Objetivo:** dejar el proyecto listo para diseñar sin ambigüedades.

**Entregables:**

- SRS v1.1 completo y revisado.
- Decisiones, riesgos, glosario y cambios.
- Plan de sprints, trazabilidad y registro de skills.
- `README.md`, `AGENTS.md`, `SECURITY.md`, `.env.example`, `.gitignore`.
- Repositorio Git inicializado con commits atómicos.
- Assets demo: política y manifest vacío.

**Agentes:** orquestador, product analyst, security (revisión), tech writer,
revisor independiente.

**Gate:**

- [ ] El SRS cubre las correcciones del usuario.
- [ ] No hay IDs duplicados ni referencias rotas.
- [ ] No hay secretos ni datos personales.
- [ ] El usuario aprueba el alcance y las decisiones abiertas.

### Sprint 1 — UX

**Rama:** `docs/ux-v1`

**Objetivo:** convertir requisitos en una experiencia navegable y aprobable.

**Entregables:**

- Sitemap ES/EN, arquitectura de información y navegación.
- Flujos: visitante, foto, video, búsqueda, contacto, login, subida,
  publicación, recuperación.
- Wireframes de baja fidelidad de todas las páginas y estados (vacío, carga,
  error, sin resultados).
- Prototipo navegable (Figma o HTML estático) con ES/EN y temas.
- Design system: color, tipografía, espaciado, componentes, movimiento.
- Documento de accesibilidad y criterios visuales.
- Copy ES/EN de estados vacíos y navegación.

**Agentes:** UX designer, product analyst, accessibility (revisión), frontend
(spike), revisor independiente.

**Gate:** prototipo aprobado por el usuario; sin lorem ipsum; estados vacíos
diseñados; contraste y foco verificados.

### Sprint 2 — Arquitectura

**Rama:** `docs/arquitectura-v1`

**Objetivo:** definir cómo se construye y se opera sin decisiones implícitas.

**Entregables:**

- SAD y diagramas C4 (contexto, contenedores, componentes, despliegue).
- ADRs de stack, auth, almacenamiento, releases, backups y hosting.
- Modelo de datos y migraciones iniciales.
- OpenAPI 3.1 completo de la API admin.
- Diseño del pipeline de medios y de la cola.
- Threat model, hardening del host y configuración de Cloudflare.
- Plan de backups/DR y observabilidad.
- Plan de pruebas, matriz y presupuestos de rendimiento.
- Plan de assets demo y procedencia.

**Agentes:** arquitecto, backend, frontend, media, DevOps, security,
performance, accessibility, SEO, revisor independiente.

**Gate:** revisión de arquitectura y seguridad; OpenAPI válido; threat model
aprobado; ningún P1 abierto.

### Sprint 3 — Fundaciones

**Rama:** `feat/foundations`

**Objetivo:** tener un esqueleto desplegable con autenticación real.

**Entregables:**

- Monorepo, lint, tipos, tests, CI y pre-commit.
- Docker Compose de desarrollo y producción.
- PostgreSQL, Redis, migraciones y seeds mínimos.
- API NestJS con healthchecks, logs y errores.
- Cloudflare Access + passkey WebAuthn + recovery codes.
- Sesiones, CSRF, CORS, headers y rate limits base.
- Admin shell con login, logout y estado vacío.
- Backups locales de prueba.

**Agentes:** backend, frontend, DevOps, security, QA, revisor independiente.

**Gate:** login E2E con y sin Access; sesión expira; CI verde; escaneo sin P1.

### Sprint 4 — Fotos

**Rama:** `feat/photo-pipeline`

**Objetivo:** subir una foto real y verla publicada con calidad y seguridad.

**Entregables:**

- Subida directa a R2 con URL firmada y multiparte.
- Validación real, re-codificación y variantes AVIF/WebP/JPEG.
- Placeholders, focal point, OG y metadatos.
- Metadatos ES/EN, colecciones, etiquetas y versiones optimistas.
- Lightbox accesible y detalle de foto.
- Reproceso y reconciliación de jobs.
- Pruebas con archivos maliciosos y apagón.

**Agentes:** backend, media, frontend, QA, security, performance, accessibility,
revisor independiente.

**Gate:** foto publicada E2E ≤ 3 min; presupuestos de imagen; GPS eliminado;
lightbox accesible.

### Sprint 5 — Videos

**Rama:** `feat/video-pipeline`

**Objetivo:** publicar videos cortos sin tumbar el servidor.

**Entregables:**

- ffprobe, validación y límites.
- Transcodificación 1080p/720p/480p, poster y preview.
- HLS para videos largos.
- Reproductor accesible con subtítulos.
- Cola con concurrencia 1 y backpressure.
- Pruebas de duración, formato, red y apagón.

**Agentes:** media, frontend, backend, QA, performance, accessibility, revisor
independiente.

**Gate:** video 2 min ≤ 10 min de proceso; reproducción en Safari/Chrome; sin
autoplay con sonido; sin red en FFmpeg.

### Sprint 6 — Sitio público

**Rama:** `feat/public-site`

**Objetivo:** un sitio editorial completo, rápido y indexable, con o sin
contenido.

**Entregables:**

- Home, fotos, videos, colecciones, etiquetas, about, contacto, privacidad,
  búsqueda y 404.
- Estados vacíos, carga y error.
- SEO: canonical, hreflang, JSON-LD, sitemaps, RSS, robots.
- Búsqueda Pagefind.
- i18n ES/EN y temas.
- Presupuestos de rendimiento y Lighthouse CI.
- E2E con 0 medios y con contenido.

**Agentes:** frontend, product analyst, SEO, performance, accessibility, QA,
revisor independiente.

**Gate:** Lighthouse ≥ 95 en galerías/detalle; ≥ 90 en home; sitemap válido con
0 y con N medios; sin JS funciona el contenido.

### Sprint 7 — Publicación y administración

**Rama:** `feat/publishing`

**Objetivo:** que publicar sea seguro, atómico y reversible.

**Entregables:**

- Builder Astro y releases atómicas.
- Estado de build, logs y rollback.
- Publicar/despublicar/borrar con 301/410.
- Checklist de lanzamiento y onboarding del admin.
- Carga/descarga de contenido demo.
- Panel de estado y auditoría.
- Pruebas de concurrencia y fallo de build.

**Agentes:** backend, frontend, DevOps, QA, security, revisor independiente.

**Gate:** publicar ≤ 3 min; rollback de 3 releases; build fallido no toca
`current`; demo no contamina producción.

### Sprint 8 — Experiencia y hardening

**Rama:** `feat/experience-hardening`

**Objetivo:** el acabado cinematográfico sin sacrificar acceso, seguridad ni
velocidad.

**Entregables:**

- Three.js del hero con fallbacks y degradación.
- GSAP/ScrollTrigger, reduced-motion y presupuesto de JS.
- Contacto con Turnstile, honeypot y rate limit.
- CSP Report-Only → enforce, headers y escaneo.
- Auditoría WCAG 2.2 AA y correcciones.
- Pruebas con lector de pantalla y teclado.

**Agentes:** frontend, media, security, accessibility, performance, QA, revisor
independiente.

**Gate:** 3D no bloquea LCP; WCAG AA sin P1/P2; contacto resiste spam; CSP sin
violaciones críticas.

### Sprint 9 — Producción

**Rama:** `infra/production`

**Objetivo:** operar el servidor propio sin UPS de forma segura y recuperable.

**Entregables:**

- Ubuntu Server, LUKS, UFW, Docker, Tunnel y Caddy.
- DNS, Access, R2, Turnstile y cache rules.
- Backups restic + offsite + restore probado.
- Monitorización externa, alertas y dashboard.
- Prueba de apagón y de recuperación en hardware nuevo.
- Runbooks de operación e incidentes.
- Manual de despliegue.

**Agentes:** DevOps, security, backend, QA, tech writer, release manager,
revisor independiente.

**Gate:** sitio y admin en producción; restore ≤ 4 h; apagón documentado; sin
puertos abiertos; backup verificado.

### Sprint 10 — UAT y release

**Rama:** `release/v1.0.0`

**Objetivo:** validar con el usuario y publicar `v1.0.0` con evidencia.

**Entregables:**

- UAT de flujos principales y estados vacíos.
- Manual de usuario y manual de despliegue finales.
- Auditorías de seguridad, rendimiento, accesibilidad y SEO.
- Corrección de hallazgos y regresión.
- Release notes, tag y checklist firmado.
- Plan de mantenimiento y próximos pasos.

**Agentes:** QA, product analyst, tech writer, security, performance,
accessibility, SEO, release manager, revisor independiente.

**Gate:** aprobación del usuario; cero P1/P2; manuales entregados; tag
`v1.0.0`.

---

## 5. Mejora continua

Después de cada sprint se ejecuta un ciclo corto:

1. **Demo** del incremento al usuario.
2. **Revisión independiente** contra SRS y criterios.
3. **Pruebas adversariales** (seguridad, vacío, error, apagón).
4. **Medición** (rendimiento, accesibilidad, SEO, tiempos).
5. **Corrección** de hallazgos P1/P2 en el mismo sprint si es posible.
6. **Reporte** con evidencia y deuda registrada.
7. **Retrospectiva:** qué se aprende y qué se cambia en el siguiente sprint.

Los hallazgos P1 bloquean el merge. Los P2 deben tener dueño y fecha. Los P3 se
registran como deuda.

### 5.1 Sprints de mejora posteriores a v1

| Sprint | Tema | Requisitos candidatos |
|---|---|---|
| S11 | Rendimiento avanzado | AVIF óptimo, HLS, cache, CWV reales. |
| S12 | Accesibilidad y contenido | Declaración, subtítulos, traducciones. |
| S13 | Operación | Página de estado, métricas históricas, capacidad. |
| S14 | Producto | Prints, licencias, colecciones privadas (solo si se aprueba). |

---

## 6. Riesgos del plan

| Riesgo | Mitigación |
|---|---|
| El alcance crece y retrasa v1. | M primero; S con capacidad; C fuera. |
| El usuario no puede aprobar a tiempo. | Gates por sprint, demos cortas, decisiones registradas. |
| El hardware no soporta video 4K. | Límites, cola, mensajes claros y benchmark temprano. |
| La seguridad se pospone. | S3 incluye auth y hardening; S8/S9 auditorías. |
| El sitio vacío se ve pobre. | S1 lo diseña; S6 lo prueba con 0 medios. |
| Los assets demo se confunden con obra real. | Manifest, `is_demo`, revisión y retiro antes de lanzar. |
| El servidor se apaga. | S9 prueba apagón, restore y autoarranque. |

---

## 7. Aprobación

| Gate | Responsable | Fecha | Resultado |
|---|---|---|---|
| S0 — Gestión | Usuario + revisor | pendiente | pendiente |
| S1 — UX | Usuario + revisor | pendiente | pendiente |
| S2 — Arquitectura | Arquitecto + security | pendiente | pendiente |
| S3 — Fundaciones | QA + security | pendiente | pendiente |
| S4 — Fotos | QA + performance | pendiente | pendiente |
| S5 — Videos | QA + performance | pendiente | pendiente |
| S6 — Sitio público | QA + SEO + a11y | pendiente | pendiente |
| S7 — Publicación | QA + security | pendiente | pendiente |
| S8 — Experiencia | QA + a11y | pendiente | pendiente |
| S9 — Producción | DevOps + security | pendiente | pendiente |
| S10 — Release | Usuario | pendiente | pendiente |
