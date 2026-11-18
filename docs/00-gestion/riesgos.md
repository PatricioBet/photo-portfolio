# Registro de riesgos

Escala: probabilidad e impacto `baja`, `media`, `alta`, `crítica`. El propietario
es el rol que debe vigilarlo, no necesariamente quien lo ejecuta.

| ID | Riesgo | Prob. | Impacto | Mitigación | Propietario | Estado |
|---|---|---|---|---|---|---|
| R-01 | El servidor se apaga por corte de energía (no hay UPS) y queda corrupto o a medias. | alta | alto | WAL, escrituras atómicas, jobs idempotentes, reconciliación al arranque, `restart: unless-stopped`, pruebas de corte. | DevOps | abierto |
| R-02 | El servidor no vuelve a arrancar tras el corte (BIOS, disco, Docker, systemd). | media | crítico | “Restore on AC power loss”, autoarranque de Docker/systemd, watchdog, monitor externo, runbook de recuperación. | DevOps | abierto |
| R-03 | Pérdida de datos por fallo de disco, robo o ransomware. | media | crítico | Backups restic cifrados fuera del servidor, R2 versioning, restore trimestral, LUKS, acceso físico restringido. | DevOps | abierto |
| R-04 | Acceso no autorizado al admin por configuración incorrecta de Access/Tunnel. | media | crítico | Access obligatorio, JWT validado, sin puertos abiertos, pruebas externas, alertas de login, least privilege. | Security | abierto |
| R-05 | Robo o pérdida de passkey/dispositivo y bloqueo del admin. | media | alto | 2 passkeys, 10 recovery codes, CLI bootstrap, identidad Access de respaldo, procedimiento documentado. | Security | abierto |
| R-06 | Fuga de secretos en git, logs, capturas o PRs. | media | crítico | Gitleaks, push protection, `.env` ignorado, tokens acotados, rotación, revisión de PRs. | Security | abierto |
| R-07 | Upload malicioso: políglota, bomba de descompresión, FFmpeg con playlist remota. | media | alto | Validación real, re-codificación, límites de píxeles/tiempo, FFmpeg sin red y con protocol whitelist, contenedor aislado. | Media/Security | abierto |
| R-08 | XSS/CSRF/IDOR en admin o metadatos. | media | alto | CSP, SameSite=Strict, Origin check, validación, autorización por recurso, pruebas adversariales. | Backend/Security | abierto |
| R-09 | Hardware antiguo insuficiente para video 4K o muchos jobs. | alta | medio | Límites de entrada, concurrencia 1, presets, cola, benchmark y mensajes claros; no prometer 4K rápido. | Media/DevOps | abierto |
| R-10 | Disco lleno por originales, temporales, logs o imágenes Docker. | alta | alto | Cuotas, lifecycle de `incoming/`, limpieza de temporales, alertas al 80 %, prune controlado, backups fuera. | DevOps | abierto |
| R-11 | El sitio se ve vacío o roto antes de subir contenido. | alta | medio | Requisitos de estado vacío, datos demo opcionales, build con cero medios, pruebas E2E. | Frontend/QA | abierto |
| R-12 | Assets demo se confunden con obra real o tienen licencia dudosa. | media | alto | Manifest de procedencia, `is_demo`, revisión de licencia, reemplazo antes de lanzamiento. | Product/Legal | abierto |
| R-13 | Costos de R2/transferencia superan el presupuesto. | baja | medio | Presupuestos de imagen, caché immutable, lifecycle, alertas de uso, ~100 GB estimado. | DevOps | abierto |
| R-14 | SEO deficiente: duplicados, hreflang mal, sitemap vacío o imágenes sin indexar. | media | alto | Pruebas de SEO en CI, crawl, validadores, canonical/hreflang, sitemap de imágenes/videos. | SEO | abierto |
| R-15 | Core Web Vitals fuera de presupuesto por 3D, fuentes o JS. | media | alto | LCP estático, islas, presupuesto de bundles, fallback sin WebGL, Lighthouse CI. | Perf | abierto |
| R-16 | Accesibilidad incompleta (lightbox, video, formularios, admin). | media | alto | WCAG 2.2 AA, axe, teclado, lector de pantalla, pruebas manuales y CI. | A11y | abierto |
| R-17 | Pérdida de la traducción EN o mezcla de idiomas. | media | medio | Modelo de contenido bilingüe, validación de completitud, no generar EN incompleto. | Product/Frontend | abierto |
| R-18 | Correo de contacto mal configurado (SPF/DKIM/DMARC) y mensajes no llegan. | media | alto | Verificar dominio, proveedor, pruebas de entrega, alternativa `mailto:`. | DevOps | abierto |
| R-19 | Dependencias o imágenes Docker vulnerables. | alta | medio | Lockfile, OSV/Trivy, actualizaciones programadas, SBOM, pin de digests. | Security | abierto |
| R-20 | Windows Update/energía interrumpen el servidor si se usa Windows en lugar de Ubuntu. | media | alto | Preferir Ubuntu Server; si Windows, horas activas, autoarranque, Docker Desktop y pruebas. | DevOps | abierto |
| R-21 | Caída prolongada por Tunnel/DNS/Cloudflare mal configurado. | baja | alto | Configuración versionada, pruebas de humo, monitor externo, runbook y acceso local de emergencia. | DevOps | abierto |
| R-22 | El usuario no tiene assets reales al lanzar. | alta | medio | Modo demo, estados vacíos, contenido editorial provisional y carga posterior sin redeploy de código. | Product | abierto |
| R-23 | Alcance excesivo (S/C) retrasa v1. | alta | alto | v1 = todos los M; S solo con capacidad; C diferido; revisión en cada sprint. | Orquestador | abierto |
| R-24 | Falta de aprobación del usuario bloquea merges. | media | medio | Aprobación por sprint/release, no por PR; PRs pequeños y demos. | Orquestador | abierto |
| R-25 | El servidor no tiene backup eléctrico y el sitio público cae; impacto reputacional/SEO. | alta | medio | Aceptado en v1; monitorización, cache de Cloudflare, página de estado y plan de UPS futuro. | DevOps | abierto |
