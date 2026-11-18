# Infraestructura

Configuración del servidor propio, Cloudflare y operación.

| Área | Estado | Contenido |
|---|---|---|
| `docker/` | pendiente | Compose de desarrollo y producción, límites y healthchecks. |
| `caddy/` | pendiente | Sitio, releases, headers, 410 y redirects. |
| `cloudflare/` | pendiente | Tunnel, Access, DNS, WAF, cache rules y Turnstile. |
| `scripts/` | pendiente | Backup, restore, release, healthcheck y rotación. |
| `systemd/` | pendiente | Autoarranque, Tunnel y tareas programadas. |
| `monitoring/` | pendiente | Uptime, alertas y dashboard. |

Reglas:

- Sin `ports:` públicos; solo bind a `127.0.0.1` en desarrollo.
- Sin `privileged`, `network_mode: host` ni socket de Docker en apps.
- Secretos en archivos `600` o Docker secrets; nunca en compose versionado.
- Todo servicio con `restart: unless-stopped` y healthcheck.
- Los backups se cifran y se prueban antes de producción.
