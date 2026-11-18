# photo.patriciobet.dev

Portfolio de fotografía y video de **Patricio Betancourt**.

> **Estado:** Fase 0 — SRS v1.1 en revisión. Este repositorio todavía no contiene
> código de producción. La documentación es la fuente de verdad hasta que el SRS,
> la UX y la arquitectura estén aprobados.

---

## Qué es

Un sitio público bilingüe (ES/EN), editorial y cinematográfico, con:

- galerías de fotos y videos;
- páginas de detalle con lightbox y reproductor accesible;
- colecciones, etiquetas, búsqueda local y filtros;
- SEO técnico completo: sitemap de imágenes/videos, hreflang, JSON-LD y RSS;
- panel de administración privado para subir, procesar, organizar y publicar;
- pipeline de medios con `sharp` + FFmpeg, variantes AVIF/WebP/JPEG y HLS;
- despliegue autoalojado en un servidor propio, sin puertos de entrada a Internet.

El sitio debe funcionar correctamente **sin fotos ni videos publicados**: los
estados vacíos son parte de v1, no un caso excepcional.

---

## Arquitectura (objetivo)

```text
Internet
  ├── photo.patriciobet.dev ──────┐
  ├── admin-photo.patriciobet.dev ┤
  │                               └── Cloudflare (DNS, WAF, TLS, Access)
  │                                         │
  │                                         └── Cloudflare Tunnel (saliente)
  │                                                   │
  │                                          Servidor propio (laptop antigua)
  │                                          Ubuntu Server LTS + Docker
  │                                          ├── Caddy (sitio + admin)
  │                                          ├── API NestJS
  │                                          ├── PostgreSQL
  │                                          ├── Redis + BullMQ
  │                                          ├── Media Worker (FFmpeg)
  │                                          ├── Builder (Astro)
  │                                          └── Backups (restic)
  │
  ├── cdn-photo.patriciobet.dev ──> Cloudflare R2 (derivados inmutables)
  └── contacto ───────────────────> Cloudflare Worker + Turnstile + email
```

**Decisiones clave:**

- El servidor es una laptop antigua que permanece encendida, **sin UPS**.
  La aplicación debe tolerar apagones y reinicios sin corromper datos ni dejar
  publicaciones a medias. Ver `docs/03-arquitectura/` y los requisitos `DEP-*`.
- La seguridad es autogestionada: **Cloudflare Tunnel + Access + passkeys**,
  host endurecido, sin SSH público, sin puertos abiertos y con auditoría.
- Los medios se sirven desde R2; el servidor no entrega archivos pesados.
- El sitio público es estático y se publica por releases atómicas.

---

## Documentación

| Documento | Contenido |
|---|---|
| [SRS v1.1](docs/00-gestion/srs-v1.1.md) | Requisitos completos, correcciones y criterios de aceptación |
| [Cambios v1.1](docs/00-gestion/cambios-srs.md) | Qué cambió respecto al borrador v1.0 |
| [Decisiones](docs/00-gestion/decisiones.md) | Decisiones de arquitectura, producto y operación |
| [Riesgos](docs/00-gestion/riesgos.md) | Registro de riesgos y mitigaciones |
| [Plan de sprints](docs/00-gestion/plan-sprints.md) | Fases, agentes y gates |
| [Índice de documentación](docs/README.md) | Mapa completo por fases |
| [AGENTS.md](AGENTS.md) | Reglas para agentes y colaboradores |
| [SECURITY.md](SECURITY.md) | Política de seguridad y secretos |

---

## Estructura del repositorio

```text
docs/          Documentación por fases (fuente de verdad)
apps/          web, admin, api, media-worker, builder, contact-worker
packages/      db, contracts, ui, media-core, config
infra/         Docker, Cloudflare, Caddy, scripts, runner
tests/         e2e, integration, fixtures, performance, security, a11y
assets/        assets de demo con procedencia declarada
```

La documentación se organiza por fases; el código se organiza por dominio para
evitar mover archivos en cada sprint.

---

## Seguridad

- **Nunca** se commitea `.env`, tokens, claves, certificados ni backups.
- El archivo `.env.example` solo contiene nombres y valores vacíos.
- Los secretos reales viven en `.env.local` (ignorado), Docker secrets o el
  gestor de secretos del servidor.
- El admin se protege con Cloudflare Access + passkey WebAuthn; no hay registro
  público ni contraseñas.
- El servidor no expone puertos de entrada: todo entra por Cloudflare Tunnel.
- Antes de cada push se ejecutan `gitleaks` y las pruebas de CI.

Si encuentras una vulnerabilidad, no abras un issue público: usa el canal privado
del repositorio o el formulario de contacto del sitio.

---

## Licencia

- **Código:** privado y propietario hasta que se decida lo contrario.
- **Contenido visual:** © Patricio Betancourt. Todos los derechos reservados.
- Los assets de demostración se identifican como tales y no representan la obra
  del autor. Ver `assets/demo/README.md` cuando exista.

---

## Hoja de ruta

1. **Fase 0:** SRS v1.1, decisiones, riesgos, plan y repositorio.
2. **Fase 1:** UX — sitemap, flujos, wireframes, prototipo y design system.
3. **Fase 2:** Arquitectura — SAD/C4, ADR, modelo de datos, OpenAPI, seguridad,
   backups, observabilidad y plan de pruebas.
4. **Fases 3–10:** implementación, pruebas independientes, despliegue, UAT y
   manuales.

No se escribe código de producción hasta que las fases 0–2 estén aprobadas.
