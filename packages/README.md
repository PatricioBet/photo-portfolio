# Packages

Código compartido entre aplicaciones. Sin dependencias circulares.

| Package | Estado | Responsabilidad |
|---|---|---|
| `db/` | pendiente | Esquema Drizzle, migraciones y repositorios. |
| `contracts/` | pendiente | Tipos, validadores y contratos de API. |
| `ui/` | pendiente | Componentes y tokens compartidos. |
| `media-core/` | pendiente | Validación, variantes y FFmpeg seguro. |
| `config/` | pendiente | ESLint, TypeScript, Tailwind y configuración común. |

Reglas:

- Los contratos se derivan del OpenAPI aprobado.
- `media-core` no ejecuta comandos con URLs remotas.
- Los packages no leen secretos directamente; reciben configuración.
