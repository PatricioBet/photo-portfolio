# Cambios del SRS v1.0 → v1.1

Este documento registra las correcciones y adiciones introducidas en el SRS
v1.1. El SRS v1.0 es el borrador pegado en la conversación del 17 de noviembre
de 2026; el texto original terminaba en la sección 8.3.

## 1. Correcciones del usuario

| Tema | SRS v1.0 | SRS v1.1 |
|---|---|---|
| Servidor | “Servidor propio Linux (VPS)” genérico. | Laptop antigua propia, siempre encendida, **sin UPS**, con Ubuntu Server LTS. Ver `D-01`, `D-04`, `DEP-*`. |
| Apagones | No se trataban. | Requisitos explícitos de autoarranque, recuperación, idempotencia, WAL, releases atómicas y pruebas de corte. |
| Seguridad | Sección 10 incompleta. | Sección 10 completa: modelo de amenazas, host hardening, Access/passkeys, sin puertos, secretos, cadena de suministro, incidentes y criterios `SEG-*`. |
| Dominio | `photo.patriciobet.dev` propuesto. | Confirmado. Subdominios `admin-photo` y `cdn-photo` confirmados. |
| Assets | No había plan. | Assets demo generados o de licencia libre, con manifest de procedencia, `is_demo` y reemplazo. Ver `assets/demo/`. |
| Sitio vacío | No se contemplaba. | Nuevos requisitos `RF-P06`–`RF-P09`, `RF-A46`–`RF-A48`, `DAT-*` y pruebas de build con cero medios. |
| Backup | Sección 11 incompleta. | Backups obligatorios (datos), aunque no haya respaldo eléctrico. Ver `BCK-*`. |
| Despliegue | VPS genérico. | Autoalojado en laptop; systemd, Docker Compose, Caddy, Tunnel, sin puertos abiertos. Ver sección 18. |
| Correo | Decisión abierta. | Sigue abierta; se usa `CONTACT_TO_EMAIL` y no se publica hasta confirmar. `D-10`. |

## 2. Secciones nuevas o completadas

- **9. Datos y contenido:** entidades, traducciones, slugs, integridad, retención,
  modo demo y reglas de estado vacío.
- **10. Seguridad:** STRIDE, límites de confianza, auth, sesiones, hardening del
  host, uploads, FFmpeg, headers, secretos, supply chain, rate limits, auditoría e
  incidentes.
- **11. Backups y continuidad:** RPO/RTO, qué se respalda, cifrado, offsite,
  restauración y escenarios de desastre.
- **12. SEO:** indexabilidad, metadatos, JSON-LD, sitemaps de imágenes/videos,
  hreflang, canonical, 301/410, robots, RSS y estado vacío.
- **13. Analítica y privacidad:** analítica sin cookies, datos de contacto,
  retención, logs y derechos.
- **14. Accesibilidad:** WCAG 2.2 AA, teclado, lector de pantalla, movimiento,
  formularios, medios y admin.
- **15. Legal y licencias:** copyright, licencia, marca de agua, personas
  identificables, menores, privacidad y takedown.
- **16. Observabilidad y operación:** logs, métricas, healthchecks, uptime,
  alertas, capacidad, parches y runbooks.
- **17. Fuentes y versiones:** verificación de servicios, licencias y versiones
  estables con lockfile.
- **18. Despliegue:** servidor, energía, disco, red, Cloudflare, Docker,
  autoarranque, despliegue, rollback y aceptación.
- **19. Criterios de aceptación:** DoD, gates, escenarios `AC-*`, matriz de
  verificación y evidencia.
- **20. Roadmap y decisiones abiertas.**

## 3. Requisitos nuevos

| ID | Requisito |
|---|---|
| RF-P06 | Home y listados funcionan con cero medios publicados. |
| RF-P07 | Build, sitemap y RSS válidos con cero medios. |
| RF-P08 | Aparición progresiva de secciones al publicar, sin CLS. |
| RF-P09 | Fallbacks de imagen/OG/poster; nunca iconos rotos. |
| RF-P17 | Assets demo marcados y con procedencia. |
| RF-P18 | Sustitución de demo por contenido real sin cambiar código. |
| RF-A46 | Onboarding del admin en estado vacío. |
| RF-A47 | Carga/descarga de contenido demo sin tocar producción. |
| RF-A48 | Checklist de lanzamiento con contenido real. |
| RF-M46 | Validación y registro de procedencia de assets demo. |
| RF-M47 | Pipeline idéntico para demo y contenido real. |
| RF-M48 | Reconciliación de jobs interrumpidos al arranque. |
| RF-M49 | Publicación atómica de variantes. |
| RF-M50 | Límites de recursos y backpressure. |
| RF-M51 | Limpieza de temporales y uploads huérfanos tras un corte. |
| SEG-* | Seguridad completa (ver sección 10). |
| DEP-* | Despliegue y resiliencia (ver sección 18). |
| BCK-* | Backups y recuperación (ver sección 11). |
| SEO-* | SEO técnico (ver sección 12). |
| A11Y-* | Accesibilidad (ver sección 14). |
| OPS-* | Observabilidad y operación (ver sección 16). |
| AC-* | Escenarios de aceptación (ver sección 19). |

## 4. Decisiones que siguen abiertas

1. Correo público de contacto y proveedor de envío.
2. Confirmación del hardware del servidor (CPU, RAM, disco, batería, BIOS).
3. Confirmación de instalación de Ubuntu Server LTS (o Windows con Docker).
4. Licencia final del contenido y del código.
5. Personas identificables y autorizaciones.
6. Colecciones iniciales y si se usarán assets demo al lanzar.
7. Proveedor de backups externo (R2/B2) y RPO/RTO definitivos.
8. Si se quiere una página de estado externa.

## 5. Interpretación de “sin backup”

En este documento “sin backup” significa **sin respaldo eléctrico (UPS)**. Los
backups de datos siguen siendo obligatorios: PostgreSQL, originales, configuración
y releases. Un apagón no debe usarse como excusa para no respaldar.
