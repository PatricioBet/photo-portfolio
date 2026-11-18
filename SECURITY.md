# Security Policy

## Alcance

Este repositorio contiene el código y la documentación del portfolio
`photo.patriciobet.dev`, incluyendo el panel de administración, la API, el worker
de medios y la infraestructura de despliegue.

## Reportar una vulnerabilidad

**No abras un issue público** con detalles de una vulnerabilidad.

Usa uno de estos canales:

1. El canal privado de seguridad del repositorio (GitHub Security Advisory).
2. El formulario de contacto del sitio, indicando que es un reporte de seguridad.

Incluye:

- descripción del problema;
- pasos para reproducirlo;
- impacto estimado;
- versión/commit afectado;
- evidencia sin datos personales ni secretos.

No incluyas tokens, contraseñas, cookies ni datos de terceros. Si necesitas
compartir un secreto para demostrar el problema, primero coordina el canal.

## Tiempos orientativos

- Acuse de recibo: 72 horas.
- Evaluación inicial: 7 días.
- Corrección crítica: lo antes posible, con ventana de mantenimiento si aplica.

## Política de secretos

- `.env`, `.env.local`, tokens, claves, certificados y backups **nunca** se
  commitean.
- `.env.example` solo contiene nombres y valores vacíos.
- Los secretos de producción viven en el servidor con permisos restringidos
  (`chmod 600`), Docker secrets o un gestor de secretos.
- Los tokens de Cloudflare/R2 son de mínimo privilegio y separados por función.
- Si un secreto se filtra: se rota inmediatamente, se revocan sesiones/tokens y
  se limpia el historial si ya se publicó.
- `gitleaks` corre en pre-commit y en CI. GitHub push protection debe estar
  activado.

## Controles de seguridad del proyecto

- Cloudflare Tunnel: el servidor no expone puertos de entrada.
- Cloudflare Access + passkey WebAuthn para el admin.
- Sin registro público, sin contraseñas, sin “olvidé mi contraseña”.
- Cookies `__Host-`, `HttpOnly`, `Secure`, `SameSite=Strict`.
- CSRF, CORS, CSP, HSTS, rate limits y validación de entrada.
- Uploads re-codificados, validados y escaneados; FFmpeg sin red.
- Backups cifrados y restore probado.
- Host hardening: UFW, SSH deshabilitado o solo por Tunnel, actualizaciones
  automáticas, auditoría y mínimo privilegio.
- Dependencias con lockfile, OSV/Trivy/Semgrep y SBOM.

## Fuera de alcance

- Ingeniería social.
- Ataques físicos al servidor.
- Denegación de servicio volumétrica contra Cloudflare.
- Vulnerabilidades en servicios de terceros (se reportan a su proveedor).

## Divulgación

No se divulgan detalles públicamente hasta que exista una corrección o mitigación
acordada. Se dará crédito si el reportero lo solicita.
