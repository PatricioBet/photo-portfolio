# Apps

Aplicaciones desplegables del portfolio. Cada una tiene su propio `package.json`,
`Dockerfile` y pruebas.

| App | Estado | Responsabilidad |
|---|---|---|
| `web/` | pendiente | Sitio público Astro (SSG) con islas React. |
| `admin/` | pendiente | Panel privado React/Vite. |
| `api/` | pendiente | API NestJS, auth, medios y builds. |
| `media-worker/` | pendiente | Procesamiento de fotos y videos. |
| `builder/` | pendiente | Generación de releases Astro. |
| `contact-worker/` | pendiente | Formulario de contacto en Cloudflare Worker. |

Reglas:

- No se escribe código hasta que UX y arquitectura estén aprobadas.
- Cada app se construye y prueba en CI.
- Ninguna app abre puertos públicos; todo entra por Cloudflare Tunnel.
- Los secretos se inyectan por entorno, nunca se commitean.
