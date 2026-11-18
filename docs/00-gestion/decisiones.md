# Decisiones del proyecto

Estados: **aceptada** (confirmada por el usuario o el SRS), **propuesta** (a
validar en la fase correspondiente), **abierta** (falta información).

| ID | Estado | Decisión | Motivo | Consecuencias |
|---|---|---|---|---|
| D-01 | aceptada | El sitio se autoaloja en una **laptop antigua** que permanece encendida, no en la laptop de desarrollo. | Corrección del usuario. | El servidor es el único origen del sitio y del admin; hay que endurecerlo y hacerlo resiliente. |
| D-02 | aceptada | Dominio principal: `photo.patriciobet.dev`. Subdominios: `admin-photo.patriciobet.dev` y `cdn-photo.patriciobet.dev`. | SRS y corrección del usuario. | Certificados, cookies, CORS, Access y SEO se configuran por origen separado. |
| D-03 | aceptada | **No se usa Cloudflare Pages en v1.** El sitio público se sirve desde el servidor propio mediante Caddy y releases atómicas. | El usuario corrige que el servidor es propio; se mantiene el control y el aprendizaje de operación. | Si el servidor se apaga, el sitio público se cae; se mitiga con reinicio automático, caché y monitorización. |
| D-04 | aceptada | El servidor **no tiene UPS**. La aplicación debe soportar apagones y reinicios abruptos sin corromper datos ni publicar estados parciales. | Corrección del usuario. | Requisitos `DEP-*`, jobs idempotentes, WAL, escrituras atómicas, reconciliación al arranque y pruebas de corte. |
| D-05 | aceptada | La seguridad es **autogestionada** y es prioridad de v1. | Corrección del usuario. | Cloudflare Tunnel + Access + passkeys, host hardening, sin puertos abiertos, auditoría, backups cifrados y respuesta a incidentes. |
| D-06 | aceptada | El sitio debe funcionar **sin fotos ni videos publicados**. | Corrección del usuario. | Estados vacíos editoriales, build válido con cero medios, sitemap/RSS válidos y onboarding del admin. |
| D-07 | aceptada | Los assets de demo serán **generados o de licencia libre verificada**, marcados como demostración y reemplazables. | Corrección del usuario. | No se atribuye obra falsa al autor; se guarda procedencia y licencia; se pueden borrar sin romper el sitio. |
| D-08 | propuesta | Stack: Astro + islas React, admin React/Vite, API NestJS, Drizzle, PostgreSQL, Redis/BullMQ, sharp, FFmpeg, Caddy, R2, Cloudflare. | SRS v1.0. | Monorepo TypeScript; lockfile; versiones estables fijadas. |
| D-09 | propuesta | Sistema operativo del servidor: **Ubuntu Server LTS** sin escritorio. Windows solo para desarrollo. | Estabilidad, systemd, Docker, seguridad y consumo menor. | Requiere confirmar compatibilidad del hardware y acceso físico para instalarlo. |
| D-10 | abierta | Correo público de contacto y proveedor de envío. | El SRS lo deja abierto; el sitio lo ofusca. | Se usa `CONTACT_TO_EMAIL` por entorno; no se publica hasta confirmar. |
| D-11 | propuesta | Contenido con **todos los derechos reservados**; sin marca de agua visible; autoría en metadatos; sin RAW en v1. | SRS. | Licencia y copyright visibles; RAW se exporta antes de subir. |
| D-12 | aceptada | Un solo administrador; **no hay registro público** ni contraseñas. | SRS y superficie de ataque mínima. | Access + passkey + recovery codes; alta por CLI. |
| D-13 | propuesta | Backups **obligatorios** aunque no haya UPS: PostgreSQL, originales, configuración y releases. | “Sin backup” se interpreta como sin respaldo eléctrico, no sin respaldo de datos. | restic cifrado a R2/B2; restore trimestral; RPO/RTO definidos. |
| D-14 | propuesta | Sin CMS, sin service worker, sin comentarios/likes/cuentas de visitantes/tienda/blog en v1. | SRS. | Menos superficie de ataque y mantenimiento. |
| D-15 | propuesta | Analítica sin cookies (Cloudflare Web Analytics) y sin scripts de terceros bloqueantes. | Privacidad y rendimiento. | Sin banner de cookies salvo que cambie la ley/proveedor. |
| D-16 | propuesta | Build y publicación por **releases atómicas** en el servidor, conservando 3 versiones y rollback. | SRS RF-A36 y operación sin downtime. | `current` es un symlink que solo cambia al final; el build falla sin tocar la versión viva. |
| D-17 | propuesta | Docker Compose + systemd; sin Kubernetes. | Un solo servidor, simplicidad y recursos limitados. | Servicios con `restart: unless-stopped`, healthchecks y límites. |
| D-18 | propuesta | Documentación en español; código, commits y nombres técnicos en inglés; UI ES/EN. | Consistencia y revisión. | Traducciones obligatorias antes de publicar una página EN. |
| D-19 | propuesta | El servidor no expone SSH ni puertos HTTP. La administración remota va por Cloudflare Tunnel + Access. | Seguridad autogestionada. | Si Tunnel falla, se accede físicamente o por red local controlada. |
| D-20 | propuesta | Cabeceras de seguridad en Caddy/API y reglas WAF en Cloudflare; CSP primero en Report-Only y luego enforce. | Evitar romper el sitio y lograr A/A+ en scanners. | Se prueban en staging antes de producción. |
| D-21 | propuesta | Assets de demo: imágenes generadas con IA o stock libre; videos cortos generados/stock; nunca se presentan como fotos reales del autor. | No hay archivos reales todavía. | `assets/demo/manifest.json` con procedencia, licencia, prompt/fuente y hash. |
| D-22 | propuesta | El correo de contacto se gestiona con Cloudflare Turnstile + Worker + proveedor de email; no se almacena el mensaje en la base de datos. | Menos datos personales y menos superficie. | Rate limit 3/IP/hora; logs sin PII; respuesta por email. |
| D-23 | decidida | Hardware mínimo: **8 GB RAM** (ideal 16 GB); worker + tmpfs video = 4 GB de presupuesto de memoria. | P1 RAM/`tmpfs` insuficiente. | DEP-01 actualizado; S5 requiere worker 2 GB; no se puede reducir a 4 GB. |
| D-24 | decidida | **Ubuntu Server LTS único objetivo**; Windows no soportado en v1. | P1 fallback Windows contradictorio. | DEP-02 simplificado; R-20 eliminado; S9 solo Ubuntu. |
| D-25 | decidida | **Lanzamiento vacío**; demo solo en dev/staging; build de producción rechaza `is_demo=true`. | P2 demo al lanzar. | RF-P91 actualizado; AC-40; S6/S7/S10 ajustados. |
| D-26 | decidida | **IA de metadatos fuera de v1** (`RF-A24` pasa a C); `PRIV-13` desactivado por defecto. | P2 IA vs privacidad. | SEO-24; PRIV-13; RF-A24 prioridad C. |
| D-27 | decidida | **Bootstrap passkeys por CLI**; enrollment/rotación en UI con reauth; una sola identidad Access; break-glass con recovery codes. | P2 doble identidad Access; P2 passkeys CLI vs UI. | RF-A03; RF-A07; SEG-02; AC-12/15. |
| D-28 | decidida | **LUKS2 con TPM2 auto-unlock** + recovery key off-host; fallback manual documentado (indisponibilidad hasta 5 min). | P1 LUKS vs arranque desatendido. | DEP-03; DEP-12; R-03/R-05 actualizados. |
| D-29 | decidida | **Object Lock** en bucket de backups + credenciales separadas (escritura sin borrado); restore off-host. | P1 backup "inmutable" sin Object Lock. | BCK-21–23; DEP-28 actualizado. |
| D-30 | decidida | **gitleaks planificado, no activo** (`SEG-40` bloqueado); `.pre-commit-config.yaml` añadido cuando se configure remoto. | P2 gitleaks inexistente. | SEG-40; SECURITY.md; plan-sprints. |
