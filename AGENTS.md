# AGENTS.md — reglas de trabajo del proyecto

Este documento aplica a **todos los agentes** (orquestador, desarrollo, QA,
seguridad, rendimiento, accesibilidad, documentación y revisión) que trabajen en
`photo-portfolio`.

La fuente de verdad es, en este orden:

1. `docs/00-gestion/srs-v1.1.md`
2. `docs/00-gestion/decisiones.md`
3. `docs/03-arquitectura/` y `docs/03-arquitectura/api/openapi.yaml`
4. `docs/02-ux/` (prototipo aprobado)
5. `AGENTS.md` y `SECURITY.md`

Si hay conflicto, se detiene el trabajo y se escala al orquestador. No se inventan
requisitos ni se cambia el alcance por conveniencia.

---

## 1. Principios

- **Seguridad primero.** El servidor es propio, sin UPS y con seguridad
  autogestionada. Un atajo inseguro no es aceptable aunque ahorre tiempo.
- **Documentación antes que código.** Si un requisito no está claro, se actualiza
  el SRS/ADR antes de implementar.
- **Cambios pequeños y verificables.** Ramas cortas, commits atómicos, PRs
  revisables y pruebas independientes.
- **Nada de secretos en el repositorio.** Ni en código, ni en docs, ni en
  capturas, ni en logs, ni en mensajes de commit.
- **El sitio debe funcionar vacío.** Cero fotos/videos publicados es un estado
  válido de v1 y debe verse intencional, no roto.
- **Accesibilidad y rendimiento son requisitos, no extras.** Se verifican en CI
  y en los gates de sprint.

---

## 2. Permisos por rol

| Rol | Puede escribir | No puede |
|---|---|---|
| Orquestador | `docs/00-gestion/`, planificación | Código de producción sin asignar |
| Product analyst | `docs/00-gestion/`, `docs/01-producto/` | Código, infraestructura |
| UX designer | `docs/02-ux/` | `apps/`, `packages/`, `infra/` |
| Arquitecto | `docs/03-arquitectura/` | Implementación directa sin rama |
| Backend | `apps/api/`, `packages/db/`, `packages/contracts/` | `apps/web/`, `apps/admin/`, `infra/` |
| Frontend | `apps/web/`, `apps/admin/`, `packages/ui/` | `apps/api/`, `infra/` |
| Media | `apps/media-worker/`, `packages/media-core/` | API, frontend, infra |
| DevOps | `infra/`, `.github/`, scripts de despliegue | Lógica de producto |
| QA | `tests/` y reportes | Código de producción |
| Security / Perf / A11y / SEO | Solo lectura + reportes | Cambios directos |
| Tech writer | `docs/05-operacion/`, `README.md` | Código de producción |
| Release manager | Tags, releases, reportes | Código de producción |

Los auditores y revisores se configuran en **solo lectura**. El que implementa no
aprueba su propio trabajo.

---

## 3. Flujo de trabajo en Git

### Ramas

- `main` está protegida. No se hace push directo.
- Ramas cortas:
  - `docs/srs-v1.1`
  - `feat/auth-passkeys`
  - `feat/photo-pipeline`
  - `fix/upload-resume`
  - `test/e2e-lightbox`
  - `infra/cloudflare-tunnel`
  - `security/csp-headers`
- Una rama = un objetivo. Si crece demasiado, se divide.

### Commits

- Conventional Commits, en inglés, con scope:
  - `chore(repo): initialize project structure`
  - `docs(srs): add v1.1 requirements catalog`
  - `docs(security): add threat model and host hardening`
  - `feat(api): add passkey authentication`
  - `test(api): cover optimistic concurrency`
  - `fix(media): reject polyglot uploads`
- Cada commit debe compilar y pasar sus pruebas.
- No se mezclan refactors masivos con cambios funcionales.
- No se commitean archivos generados, `.env`, datos de runtime ni backups.

### Pull requests

Cada PR debe incluir:

- qué y por qué;
- requisitos del SRS que cubre;
- criterios de aceptación;
- evidencia de pruebas (comandos y resultados);
- capturas si hay UI;
- checklist de seguridad;
- impacto de rendimiento;
- docs actualizadas;
- plan de rollback si aplica.

El merge es **rebase and merge** para conservar commits atómicos. Se borra la rama.

### Aprobación

- CI verde.
- Revisión independiente (agente distinto al autor).
- QA de aceptación para cambios funcionales.
- Security/perf/a11y cuando aplique.
- Aprobación del usuario en el gate de sprint o release.
- Nunca se mergea con un P1 abierto.

---

## 4. Seguridad operativa para agentes

- **Nunca** leer, imprimir, copiar ni pedir el contenido de `.env`, `.env.local`,
  tokens, claves, cookies o credenciales reales.
- Para desarrollo, usar credenciales locales de MinIO/Postgres/Redis, no las de
  producción.
- No ejecutar `curl`/`wget` contra URLs internas ni servicios del host.
- No instalar dependencias sin lockfile; no ejecutar `curl | bash`.
- No desactivar `gitleaks`, TLS, CSP, CORS, rate limits ni validaciones para
  “hacer que funcione”.
- No exponer puertos en Docker (`ports:`) salvo en desarrollo local y con bind a
  `127.0.0.1`.
- No montar el socket de Docker dentro de contenedores de aplicación.
- No usar `--privileged`, `network_mode: host` ni `user: root` sin justificación
  y aprobación del arquitecto/security.
- No ejecutar FFmpeg con URLs, playlists remotas o protocolos de red.
- No subir archivos de usuarios a servicios externos sin consentimiento.
- No commitear capturas que muestren correos, IPs, tokens o datos personales.

Si un secreto se filtra:

1. Detener el trabajo.
2. Rotar el secreto inmediatamente.
3. Revocar sesiones/tokens afectados.
4. Limpiar el historial con `git filter-repo` si ya se pusheó.
5. Documentar el incidente en `docs/04-calidad/reportes/`.

---

## 5. Pruebas y Definition of Done

Toda feature debe incluir:

- pruebas unitarias de la lógica nueva;
- pruebas de integración si toca DB, cola, R2 o FFmpeg;
- prueba E2E si cambia un flujo de usuario;
- casos de error, vacío y reintento;
- verificación de accesibilidad (teclado, foco, labels, contraste);
- verificación de i18n ES/EN;
- verificación de rendimiento si afecta el presupuesto;
- actualización de docs y trazabilidad.

**Definition of Done:**

- [ ] Criterios de aceptación cumplidos.
- [ ] CI verde (lint, tipos, unit, integración, build, e2e, secret scan).
- [ ] Revisión independiente aprobada.
- [ ] QA de aceptación aprobado.
- [ ] Sin secretos ni datos personales en el diff.
- [ ] Accesibilidad y rendimiento verificados.
- [ ] Documentación y trazabilidad actualizadas.
- [ ] Rollback documentado.
- [ ] Aprobación del usuario en el gate correspondiente.

---

## 6. Resiliencia del servidor

El servidor no tiene UPS. Todo cambio debe asumir apagón abrupto:

- escrituras atómicas y `fsync` donde corresponda;
- jobs idempotentes y reintentables;
- reconciliación al arranque;
- releases atómicas (`current` solo cambia al final);
- base de datos con WAL y recuperación;
- contenedores con `restart: unless-stopped`;
- ningún estado crítico solo en memoria o en `tmpfs`;
- pruebas de corte de energía en el gate de despliegue.

---

## 7. Skills y herramientas

- Usar solo skills revisadas y registradas en `docs/00-gestion/skills.md`.
- Antes de instalar una skill de terceros: revisar `SKILL.md`, scripts,
  licencia, permisos de red y pasar `skillspector`/`skill-inspector`.
- Fijar el commit de origen; no instalar “latest” sin registrar versión.
- Las skills son instrucciones: no sustituyen pruebas ni revisión.
- Skills recomendadas: `web-quality-skills`, `agent-skills`, `webapp-testing`,
  `web-design-guidelines`, `react-best-practices`, `opencode`.

---

## 8. Idioma y estilo

- Documentación y UI: **español** (con traducción EN).
- Código, nombres de variables, commits y comentarios técnicos: **inglés**.
- Markdown con líneas ≤ 100 caracteres cuando sea razonable.
- Enlaces relativos y rutas absolutas del repo, no rutas locales de la máquina.
- No incluir correos personales, tokens ni rutas de usuario en docs.

---

## 9. Escalado

Si una tarea es ambigua, grande o toca autenticación, dinero, datos personales,
medios o infraestructura:

1. Detenerse.
2. Escribir la duda en el issue/PR.
3. Proponer 2 opciones con tradeoffs.
4. Escalar al orquestador/arquitecto.
5. No implementar hasta tener decisión registrada.
