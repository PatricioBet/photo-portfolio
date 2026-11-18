# Cambios del SRS v1.0 → v1.1 → v1.2

Este documento registra las correcciones y adiciones introducidas en el SRS
v1.1. El SRS v1.0 es el borrador pegado en la conversación del 17 de noviembre
de 2026; el texto original terminaba en la sección 8.3.

---

## 1.1 Correcciones del SRS v1.1 → v1.2 (Gate 0)

El SRS v1.1 fue rechazado en el Gate 0 por 4 P1 y 14 P2. El SRS v1.2 aplica las
correcciones y registra 7 decisiones (D-23 a D-30). Se añaden 9 requisitos nuevos
(BCK-21–23, A11Y-23–28) y se corrigen prioridades, estados y referencias.

### P1 cerrados

| P1 | Corrección en v1.2 | Decisión |
|---|---|---|
| RAM/`tmpfs` insuficiente | DEP-01: mínimo 8 GB RAM (ideal 16 GB). | D-23 |
| LUKS vs arranque desatendido | DEP-03: LUKS2 + TPM2 auto-unlock; DEP-12: fallback manual documentado. | D-28 |
| Backup "inmutable" sin Object Lock | BCK-21–23: Object Lock, credenciales separadas, custodia de claves. | D-29 |
| Fallback Windows contradictorio | DEP-02: Ubuntu Server LTS único; Windows no soportado. | D-24 |

### P2 cerrados (principales)

| P2 | Corrección en v1.2 |
|---|---|
| Rutas incompletas | §4.1.1: inventario de 26 rutas públicas con ES/EN. |
| Prioridades contradictorias | RF-P46/P53/P60/P62/P63 M→S; RF-A27 M→S; RF-P46/P53 S→M. |
| RF-A24 IA de metadatos | M→C; PRIV-13 desactivado; D-26. |
| Doble identidad Access | SEG-02: una sola identidad Access. |
| Passkeys CLI vs UI | RF-A03: bootstrap CLI + enrollment UI con reauth. |
| Demo al lanzar | RF-P91/RF-P92/RF-A48: lanzamiento vacío; D-25. |
| gitleaks inexistente | SEG-40: planificado, no activo; D-30. |
| Brechas WCAG | A11Y-23–28: 6 nuevos requisitos AA. |
| Riesgos incompletos | R-26 a R-33 añadidos; R-06 marcado planificado. |
| RF-A30 sin `trashed` | Añadido estado `trashed` con transiciones. |
| AC-16 mapeado a RF-P56 | Corregido: puertos, no RF-P56. |
| AC-24 mapeado a RF-P56 | Corregido: reduced motion/WebGL. |
| AC-40 demo al lanzar | Corregido: lanzamiento vacío. |
| AC-23 captions | Actualizado: subtítulos `.vtt` obligatorios. |

### Requisitos nuevos

| ID | Requisito |
|---|---|
| BCK-21 | Object Lock en bucket de backups. |
| BCK-22 | Credenciales separadas para escritura sin borrado. |
| BCK-23 | Custodia de claves de cifrado off-host. |
| A11Y-23 | Audiodescripción o texto alternativo (WCAG 1.2.5 AA). |
| A11Y-24 | Foco no oculto por cabecera fija (WCAG 2.4.11 AA). |
| A11Y-25 | Alternativa a arrastre (WCAG 2.5.7 AA). |
| A11Y-26 | Mecanismos de ayuda consistentes (WCAG 3.2.6 A). |
| A11Y-27 | No repetir información (WCAG 3.3.7 A). |
| A11Y-28 | Autenticación sin capacidades cognitivas de prueba (WCAG 3.3.8 AA). |

### Prioridades corregidas

| ID | Antes | Después | Motivo |
|---|---|---|---|
| RF-P46 | S | M | RSS es esencial para SEO. |
| RF-P53 | S | M | Galería 3D esencial para experiencia. |
| RF-P60 | S | M | Hover preview esencial para UX. |
| RF-P62 | S | M | Programar publicación esencial. |
| RF-P63 | S | M | Export esencial para portabilidad. |
| RF-A27 | S | M | Cursor personalizado esencial. |
| RF-P46 (Pagefind) | M | S | Pagefind es nice-to-have. |
| RF-A24 | M | C | IA fuera de v1. |

### Decisiones nuevas (D-23 a D-30)

Ver [`decisiones.md`](decisiones.md). Las 7 decisiones bloqueantes para el
re-diseño de arquitectura y despliegue.

---

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

## 5. Decisiones que siguen abiertas

1. Correo público de contacto y proveedor de envío.
2. Confirmación del hardware del servidor (CPU, RAM, disco, batería, BIOS).
3. Confirmación de instalación de Ubuntu Server LTS (o Windows con Docker).
4. Licencia final del contenido y del código.
5. Personas identificables y autorizaciones.
6. Colecciones iniciales y si se usarán assets demo al lanzar.
7. Proveedor de backups externo (R2/B2) y RPO/RTO definitivos.
8. Si se quiere una página de estado externa.

## 6. Interpretación de "sin backup"

En este documento “sin backup” significa **sin respaldo eléctrico (UPS)**. Los
backups de datos siguen siendo obligatorios: PostgreSQL, originales, configuración
y releases. Un apagón no debe usarse como excusa para no respaldar.
