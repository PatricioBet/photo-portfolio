# Tests

Pruebas independientes del portfolio. No contienen código de producción.

| Carpeta | Estado | Contenido |
|---|---|---|
| `unit/` | pendiente | Lógica pura de API, media-core y utilidades. |
| `integration/` | pendiente | DB, cola, R2, FFmpeg y build. |
| `e2e/` | pendiente | Flujos de visitante, admin y estados vacíos. |
| `security/` | pendiente | Auth, uploads, headers, CSRF, SSRF y rate limits. |
| `performance/` | pendiente | Lighthouse, bundles, imágenes y video. |
| `a11y/` | pendiente | axe, teclado y lector de pantalla. |
| `fixtures/` | pendiente | Archivos de prueba, incluidos maliciosos. |

Reglas:

- Datos ficticios; nunca datos reales de usuarios.
- Los fixtures maliciosos se documentan y no se ejecutan fuera del sandbox.
- Cada prueba referencia el ID del SRS que cubre.
- La evidencia se guarda en `docs/04-calidad/reportes/`.
