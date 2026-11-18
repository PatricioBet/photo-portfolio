# SRS — Portfolio de Fotografía y Video

**Sitio:** `photo.patriciobet.dev`  
**Autor:** Patricio Betancourt  
**Versión:** 1.2 (remediación de la revisión independiente)  
**Fecha:** 17 de noviembre de 2026  
**Estado:** borrador normativo — pendiente de aprobación del usuario y de
re-revisión independiente  
**Reemplaza a:** SRS v1.1 (revisado y rechazado para el Gate 0); conserva v1.0
como historial

---

## Registro de cambios

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 2026-11-17 | Borrador inicial: secciones 0–8.3. |
| 1.1 | 2026-11-17 | Correcciones del usuario; secciones 9–20 completas; servidor propio sin UPS; seguridad autogestionada; dominio confirmado; estados vacíos; plan de assets demo; backups; criterios de aceptación. |
| 1.2 | 2026-11-17 | Cierra los 4 P1 y 14 P2 de [`sprint-0-revision-srs.md`](../04-calidad/reportes/sprint-0-revision-srs.md): presupuesto de memoria, LUKS/TPM2, Object Lock y credenciales separadas, Ubuntu único, inventario de rutas, prioridades sin dependencias `M`→`S`, una sola identidad de Access, passkeys CLI + UI, lanzamiento vacío, criterios WCAG 2.2 AA faltantes, riesgos y estados `trashed`. Añade `BCK-21`–`BCK-23` y `A11Y-23`–`A11Y-28`. |

Los detalles de los cambios están en
[`cambios-srs.md`](cambios-srs.md). Las decisiones están en
[`decisiones.md`](decisiones.md). Los riesgos están en
[`riesgos.md`](riesgos.md). La versión revisada se conserva en
[`srs-v1.1.md`](srs-v1.1.md) para trazabilidad histórica.

---

## 0. Cómo usar este documento

### 0.1 Convenciones

- **M (imprescindible):** obligatorio en v1. Sin esto no hay lanzamiento.
- **M condicionado:** `M` cuya aceptación depende de una decisión abierta
  registrada (`D-10`, `D-11`, `D-25`, `D-27`). Sigue siendo obligatorio, pero su
  verificación no puede cerrarse hasta que la decisión esté aprobada. Se marca en
  la trazabilidad con la columna “decisión bloqueante”.
- **S (recomendado):** backlog posterior a v1. No se implementa en v1 salvo que
  se promueva primero a `M` en este SRS y en la matriz.
- **C (opcional/futuro):** diseñado para no estorbar; no se implementa en v1.
- Prefijos:
  - `RF-P` requisito funcional público.
  - `RF-A` requisito funcional del admin.
  - `RF-M` requisito del pipeline de medios.
  - `RF-V` requisito visual, animación o 3D.
  - `RNF-R` requisito no funcional de rendimiento.
  - `DAT` datos y contenido.
  - `SEG` seguridad.
  - `BCK` backups y continuidad.
  - `SEO` posicionamiento.
  - `PRIV` privacidad y analítica.
  - `A11Y` accesibilidad.
  - `LEG` legal y licencias.
  - `OPS` observabilidad y operación.
  - `DEP` despliegue.
  - `VER` versiones y fuentes.
  - `AC` escenario de aceptación.
- “Debe” es obligatorio; “debería” es recomendado; “puede” es opcional.
- Cada requisito debe poder verificarse con una prueba o evidencia. La matriz está
  en [`trazabilidad.md`](trazabilidad.md); los escenarios de aceptación, en §19.3.
- **Rangos de IDs:** los huecos (`RF-P48`–`RF-P49`, `RF-P59`, `RF-A18`–`RF-A19`,
  `RF-M17`–`RF-M19`, etc.) son rangos reservados por prefijo, no requisitos
  perdidos. Los IDs no se reutilizan; un requisito retirado se marca `obsoleto`
  en la matriz.
- **Regla de prioridades:** ningún `M` puede depender de un `S` o de un `C`. Un
  requisito que se necesite para cumplir un `M` debe ser `M`. La comprobación se
  automatiza en CI sobre el SRS y `trazabilidad.md`.

### 0.2 Fuente de verdad

Este SRS es la fuente de verdad funcional. La arquitectura, la UX, el OpenAPI y
los ADR no pueden contradecirlo. Si hay conflicto, se actualiza el SRS mediante
una rama y una revisión; no se resuelve “en el código”.

### 0.3 Supuestos y datos que faltan

Los supuestos y decisiones abiertas están en la sección 1.7 y en
[`decisiones.md`](decisiones.md). Si un supuesto es falso, se actualiza el SRS
antes de implementar.

---

## 1. Introducción

### 1.1 Propósito

Definir de forma completa y verificable qué debe hacer, cómo debe comportarse y
cómo debe protegerse el portfolio de fotografía y video de Patricio Betancourt,
para construirlo sin ambigüedades y validarlo con criterios de aceptación.

### 1.2 Alcance de v1

Dentro de v1:

- sitio público bilingüe ES/EN, estático, con islas interactivas;
- panel de administración privado;
- API y base de datos;
- pipeline de optimización de fotos y videos;
- almacenamiento en R2 y entrega por CDN;
- SEO técnico, accesibilidad y rendimiento medibles;
- seguridad autogestionada y host hardening;
- despliegue autoalojado en un servidor propio (laptop antigua);
- backups, recuperación, observabilidad y monitoreo;
- estados vacíos y contenido demo reemplazable.

Fuera de v1 (diseñado para no estorbar):

- tienda o venta de prints;
- comentarios, likes o cuentas de visitantes;
- blog;
- app nativa;
- archivos RAW;
- edición avanzada de imágenes en el navegador;
- multi-admin o roles;
- CMS headless;
- búsqueda server-side;
- service worker;
- Web Monetization, pagos o suscripciones.

### 1.3 Objetivos medibles

| Objetivo | Métrica | Verificación |
|---|---|---|
| Rendimiento | LCP ≤ 2,0 s, INP ≤ 200 ms, CLS ≤ 0,05 en p75 móvil 4G. | Lighthouse CI + RUM/PSI. |
| Lighthouse | ≥ 95 en galerías y detalle; ≥ 90 en home con 3D. | Lighthouse móvil. |
| SEO | 100 % de páginas públicas indexables con datos estructurados válidos, sitemap de imágenes/videos y hreflang ES/EN. | Crawl + validadores + tests. |
| Seguridad | Solo el admin puede escribir; sin puertos de entrada; headers A/A+; admin con Access + passkey. | Escaneo externo + checklist + tests. |
| Costo | Servicios variables de pocos USD/mes para ~100 GB. | Facturación + dashboard. |
| Operación | Publicar una foto nueva en ≤ 3 min desde la subida, sin tocar código. | Prueba E2E cronometrada. |
| Disponibilidad | El sitio se recupera solo tras un apagón o reinicio. | Prueba de corte + monitor externo. |
| Vacío | El sitio se ve completo y publica correctamente con 0 fotos/videos. | Build + E2E de estado vacío. |

### 1.4 Glosario

Ver [`glosario.md`](glosario.md). Los términos clave son LCP/INP/CLS, CDN, R2,
presigned URL, passkey/WebAuthn, SSG, CSP/HSTS, SSRF, HLS, WAL, RPO/RTO y STRIDE.

### 1.5 Datos tomados del portfolio de desarrollo

Revisado `https://www.patriciobet.dev/` y el perfil público de GitHub:

- **Identidad:** Patricio Betancourt, desarrollador Full Stack y científico de
  datos, Ingeniería en Ciencias de la Computación (Universidad Nacional de Loja),
  mención en Sistemas Inteligentes, Loja, Ecuador.
- **Enlaces:** `https://github.com/PatricioBet` y
  `https://www.linkedin.com/in/patricio-betancourt/`.
- **Stack del portfolio actual:** React + Vite + Tailwind; también hay un
  `portfolioV2` en Astro. Se reutilizan tokens, selector de idioma y tema.
- **Marca:** color `#6366f1`, logo PB, ES por defecto, EN en `/en`, modo claro y
  oscuro, imagen OG 1200×630.
- **SEO:** canonical sin `www` (`https://patriciobet.dev`), robots con
  `max-image-preview:large`, Open Graph/Twitter completos, `locale es_ES`.
- **Infraestructura:** el dominio pasa por Cloudflare; se aprovecha para DNS,
  WAF, Tunnel, Access y R2.
- **Subdominios:** ya existe el patrón `star-recs.patriciobet.dev`; encaja
  `photo.patriciobet.dev`.
- **Interenlace obligatorio (RF-P40):** “Fotografía” desde el portfolio de
  desarrollo y “Desarrollo” desde el nuevo sitio.
- **Correo:** está ofuscado en el sitio. No se publica hasta confirmar la
  decisión `D-10`.

La bio de fotografía se redactará en la fase de contenido, adaptando la identidad
real sin inventar premios, clientes, exposiciones ni equipo.

### 1.6 Supuestos

1. Un único administrador (Patricio) y **una sola identidad** en Cloudflare
   Access. No hay registro público ni segunda identidad de respaldo; el
   break-glass son los recovery codes y una passkey adicional del mismo usuario.
2. Servidor propio: laptop antigua, siempre encendida, **sin UPS**, con Ubuntu
   Server LTS. Windows no es un objetivo soportado en v1 (`D-24`).
3. DNS de `patriciobet.dev` en Cloudflare.
4. Volumen inicial ≤ 500 fotos y ≤ 30 videos; crecimiento ≤ 100 GB en 2 años.
5. Idiomas: español (principal) e inglés.
6. No hay assets reales al inicio. El **lanzamiento es vacío**; los demo se usan
   solo en desarrollo/staging y nunca entran al build de producción (`D-25`).
7. El servidor puede apagarse por corte eléctrico; la aplicación debe recuperarse.
8. El correo de contacto se define por entorno; no se hardcodea.

### 1.7 Decisiones abiertas y condicionadas

| # | Decisión | Estado | Impacto | Dueño | Cierre |
|---|---|---|---|---|---|
| 1 | CPU/RAM/disco/batería exactos del servidor. | abierta | Límites de video y concurrencia; `DEP-01`. | Usuario/DevOps | Antes de S2 |
| 2 | Sistema operativo del servidor. | **decidida: Ubuntu Server LTS único** (`D-24`) | Autoarranque, systemd, seguridad, LUKS. | Usuario | Gate 0 |
| 3 | Correo público y proveedor de email. | abierta (`D-10`) | `RF-P71`, `RF-P47`, `PRIV-05`, `SEG-38`. | Usuario | Antes de S8 |
| 4 | Licencia final del contenido/código. | propuesta: todos los derechos reservados (`D-11`) | `LEG-01`, `LEG-02`, `LEG-16`, `AC-40`. | Usuario | Antes de S10 |
| 5 | Marca de agua visible. | propuesta: no | Pipeline de imagen. | Usuario | S4 |
| 6 | Personas identificables y autorizaciones. | abierta (`D-27`) | `LEG-05`, `LEG-06`, `PRIV-11`. | Usuario | Antes de publicar |
| 7 | ¿RAW? | propuesta: no en v1 | Formatos aceptados. | Usuario | S4 |
| 8 | Colecciones iniciales. | abierta | Navegación y contenido. | Usuario | Antes de S6 |
| 9 | ¿Se lanza con assets demo o vacío? | **decidida: lanzar vacío; demo solo dev/staging** (`D-25`) | `RF-A48`, `AC-40`, `RF-P90`–`P93`. | Usuario | Gate 0 |
| 10 | Proveedor de backups externo y RPO/RTO. | propuesta: R2 + Object Lock + copia B2; RPO 24 h, RTO 4 h (`D-29`) | Operación y ransomware. | Usuario/DevOps | Antes de S9 |
| 11 | Presupuesto de memoria del servidor. | **decidida: 8 GB mínimo, 16 GB ideal** (`D-23`) | Worker, `tmpfs` de video y concurrencia. | Usuario | Gate 0 |
| 12 | Cifrado de disco y arranque desatendido. | **decidida: LUKS2 + TPM2; recuperación manual documentada** (`D-28`) | `DEP-03`, `DEP-12`, `AC-08`. | Usuario/DevOps | Gate 0 |
| 13 | Metadatos asistidos por IA. | **decidida: fuera de v1** (`D-26`) | `RF-A24` pasa a `C`; `PRIV-13`. | Usuario | Gate 0 |
| 14 | Alta y rotación de passkeys. | **decidida: bootstrap CLI + enrollment en UI con reauth** (`D-27`) | `RF-A03`, `RF-A07`, `RF-A49`. | Usuario | Gate 0 |
| 15 | Identidad de respaldo en Access. | **decidida: no existe**; una sola identidad (`D-12`, `D-27`) | `SEG-02`, `AC-12`. | Usuario | Gate 0 |
| 16 | Inmutabilidad y custodia de backups. | **decidida: Object Lock + credenciales separadas** (`D-29`) | `BCK-21`–`BCK-23`, `AC-30`. | Usuario/DevOps | Gate 0 |

### 1.8 Principios de diseño

- **Las fotos son las protagonistas.** El marco, la tipografía y la animación no
  compiten con la imagen.
- **El sitio vacío también es un estado de diseño.** Debe verse intencional,
  editorial y útil, no como un error.
- **La seguridad no se delega.** Cloudflare ayuda, pero el host, los secretos, los
  backups y las actualizaciones son responsabilidad del proyecto.
- **Nada se publica a medias.** Releases atómicas, variantes completas y rollback.
- **La resistencia al apagón es un requisito funcional.** No es un “nice to have”.

---

## 2. Actores y casos de uso

### 2.1 Actores

- **Visitante:** anónimo (reclutadores, clientes, público). Solo lectura.
- **Administrador:** Patricio. Único con acceso de escritura.
- **Rastreadores:** Googlebot, Bingbot y bots de redes sociales.
- **Atacante:** automatizado o manual; busca acceso, datos, recursos o denegación.
- **Operador/servidor:** systemd, Docker, Cloudflare Tunnel, backups y monitoreo.

### 2.2 Casos de uso

| ID | Caso de uso | Actor | Resultado |
|---|---|---|---|
| CU-01 | Ver la home y entender en 5 s quién es y qué hace. | Visitante | Identidad, hero, CTAs. |
| CU-02 | Navegar colecciones y abrir una foto. | Visitante | Galería → detalle. |
| CU-03 | Ver un video adaptado a su conexión. | Visitante | Reproductor/HLS. |
| CU-04 | Buscar o filtrar por colección, etiqueta, tipo y año. | Visitante | Resultados reales. |
| CU-05 | Contactar desde el sitio. | Visitante | Mensaje enviado. |
| CU-06 | Cambiar idioma y tema. | Visitante | ES/EN, claro/oscuro. |
| CU-07 | Compartir una foto/video con vista previa correcta. | Visitante | OG/Twitter. |
| CU-08 | Iniciar sesión de forma segura. | Admin | Access + passkey. |
| CU-09 | Subir uno o muchos archivos y ver progreso. | Admin | Cola y estados. |
| CU-10 | Completar metadatos ES/EN y organizar. | Admin | Borrador listo. |
| CU-11 | Publicar, despublicar, editar y borrar. | Admin | Build/release. |
| CU-12 | Reprocesar un archivo. | Admin | Nuevas variantes. |
| CU-13 | Revisar actividad y estado del sistema. | Admin | Auditoría/status. |
| CU-14 | Ver el sitio sin contenido. | Visitante | Estado vacío editorial. |
| CU-15 | Cargar/descargar contenido demo. | Admin | Demo sin tocar producción. |
| CU-16 | Recuperar el acceso tras perder un dispositivo. | Admin | Recovery code/passkey. |
| CU-17 | Recuperar el servicio tras un apagón. | Operador | Arranque y reconciliación. |
| CU-18 | Restaurar desde backup. | Operador | Sitio y datos recuperados. |

### 2.3 Casos límite que deben funcionar

- JavaScript desactivado: contenido, imágenes, navegación y SEO funcionan; video
  sin autoplay; sin 3D.
- Sin WebGL, Save-Data, `prefers-reduced-motion`, 2G/3G: versión estática ligera.
- Impresión: detalle imprime foto y ficha.
- Imágenes verticales, panorámicas > 3:1 y cuadradas: sin deformación ni CLS.
- Subida interrumpida, archivo corrupto, servidor reiniciado: error claro y
  reanudación sin duplicados.
- Dos pestañas del admin: el último guardado no pisa cambios (versión optimista).
- Cero fotos/videos publicados: home, listados, sitemap y RSS válidos.
- Todas las fotos despublicadas o en papelera: el sitio sigue funcionando.
- Disco lleno, R2 caído, Redis caído, Postgres reiniciando: mensajes claros,
  reintentos y recuperación; no corrupción.
- Corte de energía durante un job o un build: no se publica nada parcial.
- Acceso directo por IP o puerto: rechazado; solo Tunnel.
- Fuerza bruta/login: rate limit, Access, passkey, alertas.

---

## 3. Arquitectura

### 3.1 Dominios

| Origen | Función | Protección |
|---|---|---|
| `photo.patriciobet.dev` | Sitio público estático. | Cloudflare CDN/WAF; sin admin. |
| `cdn-photo.patriciobet.dev` | Medios derivados en R2. | Bucket público de solo lectura; CORS restringido. |
| `admin-photo.patriciobet.dev` | Panel y API. | Cloudflare Access + passkey; noindex; sin enlaces públicos. |
| `contacto` (ruta del sitio) | Formulario. | Cloudflare Worker + Turnstile + rate limit. |

### 3.2 Despliegue autoalojado

```text
Visitante
  └── photo.patriciobet.dev
        └── Cloudflare (DNS, TLS, WAF, caché)
              └── Cloudflare Tunnel (conexión saliente)
                    └── Servidor propio (laptop antigua, Ubuntu Server LTS)
                          ├── Caddy :8080 (sitio + admin + API)
                          ├── API NestJS :3000
                          ├── PostgreSQL :5432
                          ├── Redis :6379
                          ├── Media Worker
                          ├── Builder
                          ├── backup (restic)
                          └── monitorización local
```

- El servidor **no abre puertos** a Internet. Cloudflare Tunnel inicia la conexión.
- El sitio público se sirve desde `releases/<fecha>/` y `current` es un symlink
  atómico.
- Los medios se sirven desde R2, nunca desde el servidor.
- El admin está en un origen separado para aislar cookies y XSS.
- El servidor debe arrancar solo y recuperar los servicios sin login manual.
- No se usa Cloudflare Pages en v1 (`D-03`).

### 3.3 Componentes

| Componente | Tecnología | Función |
|---|---|---|
| Sitio público | Astro (SSG) + islas React | HTML estático, SEO, JS mínimo. |
| Animación/3D | GSAP + ScrollTrigger, Lenis opcional, Three.js | Sección 7. |
| Admin | React + Vite + TypeScript | Subida, metadatos, publicación. |
| API | NestJS + Drizzle ORM | Auth, medios, builds, jobs. |
| Base de datos | PostgreSQL | Metadatos, traducciones, auditoría. |
| Cola | Redis + BullMQ | Procesamiento asíncrono. |
| Worker de medios | Node.js + sharp + FFmpeg/ffprobe | Validar, optimizar, variantes. |
| Almacenamiento | R2 privado + público | Originales/cuarentena y derivados. |
| CDN/WAF/DNS | Cloudflare | Caché, TLS, reglas, Turnstile. |
| Acceso | Cloudflare Tunnel + Access | Sin puertos; primer factor. |
| Contacto | Worker + Turnstile + email | Formulario sin endpoint en el servidor. |
| Búsqueda | Pagefind | Índice estático en el navegador. |
| Observabilidad | Uptime externo, logs JSON, Sentry opcional | Sección 16. |
| Backups | restic + rclone | Sección 11. |
| Servidor web | Caddy | Releases, headers, proxy, 410. |

### 3.4 Flujos

**Flujo A — Subida y publicación**

1. Admin entra por Access + passkey.
2. Arrastra archivos. Por cada uno pide una URL firmada (tipo/tamaño, 10 min) y
   sube directo a R2 `incoming/`. >100 MB usa multiparte con reintentos.
3. La API crea un job. El worker descarga, valida firma real, re-codifica, quita
   metadatos sensibles, genera variantes y las sube a `photo-public`.
4. El admin completa título, alt, descripción, colección, etiquetas y focal point.
   El elemento queda en borrador.
5. Publicar marca publicado y encola build.
6. El builder genera una release nueva, cambia `current` de forma atómica, purga
   caché y avisa a buscadores (IndexNow opcional).

**Flujo B — Visita**

DNS → Cloudflare (caché/WAF) → si hay hit responde CDN; si no, Tunnel → Caddy →
release actual. Medios desde `cdn-photo` (R2), nunca desde el servidor.

**Flujo C — Contacto**

Navegador → Worker (Turnstile + rate limit + validación) → proveedor de email →
bandeja. El servidor no recibe escritura pública.

**Flujo D — Apagón**

Corte → servidor se apaga (o batería permite shutdown) → al volver la energía,
BIOS arranca, systemd inicia Docker, contenedores con `restart: unless-stopped`,
Postgres recupera WAL, el worker reconcilia jobs `processing` a `queued`/`error`,
el builder no cambia `current` si no terminó, Caddy sirve la última release válida.

### 3.5 Resistencia a apagones

Requisitos de alto nivel (detalle en sección 18):

- `restart: unless-stopped` y healthchecks.
- Postgres con WAL, `fsync` y `synchronous_commit=on`.
- Escrituras atómicas: archivo temporal + `fsync` + `rename`.
- Jobs idempotentes con clave de idempotencia y estado persistido.
- Reconciliación al arranque: jobs en `processing` se marcan `interrupted` y se
  reencolan o fallan con causa.
- Releases atómicas: `current` solo cambia al final.
- Limpieza de temporales y multipart huérfanos.
- Pruebas de corte en el gate de despliegue.
- Backups diarios y restore probado.

### 3.6 Alternativas consideradas

| Alternativa | Motivo de descarte |
|---|---|
| Cloudflare Images + Stream | Menos código, pero costo variable y dependencia; no se eligió en v1. |
| CMS headless | Amplía superficie y mantenimiento; el admin propio es suficiente. |
| Next.js con ISR | Más JS del necesario para contenido; Astro gana en LCP. |
| Cloudflare Pages | El usuario corrigió que el servidor es propio; se descarta en v1. |
| Servir medios desde el servidor | Ancho de banda, CPU y riesgo; R2/CDN es mejor. |
| Kubernetes | Sobredimensionado para un servidor y un admin. |

### 3.7 Límites de confianza

Internet → Cloudflare → Tunnel → Caddy → API/admin; worker → R2; contacto →
Worker → email. El servidor no confía en la red; la API valida Access JWT y su
propia sesión. El detalle está en la sección 10.

---

## 4. Requisitos funcionales — sitio público

### 4.1 URLs, estados y navegación base

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-P01 | M | Rutas ES completas según la tabla §4.1.1: home, fotos, videos, colecciones, etiquetas, sobre mí, contacto, legales, búsqueda, paginación, 404/410/503, RSS, sitemap y robots. | Crawl de rutas y E2E. |
| RF-P02 | M | Rutas EN equivalentes con slugs traducidos según §4.1.1, incluida `/en/` y `/en/tags/`; solo se generan si el contenido EN está completo. | Crawl EN + hreflang. |
| RF-P03 | M | Slugs en minúsculas, ASCII, con guiones y palabras clave (`/fotos/atardecer-en-el-valle/`). Al cambiar un slug se guarda el anterior y se responde 301. | Test de redirects. |
| RF-P04 | M | Barra final consistente, sin parámetros de consulta en URLs indexables. | Crawl + canonical. |
| RF-P05 | M | 404 con navegación, buscador y enlaces a lo reciente; código HTTP 404 real. | Test HTTP + visual. |
| RF-P06 | M | Con cero medios publicados, home, `/fotos/`, `/videos/`, `/colecciones/`, `/etiquetas/` y `/en/` renderizan estados vacíos editoriales, completos y navegables. | Build + E2E con DB vacía. |
| RF-P07 | M | El build con cero medios termina correctamente y genera home, about, contact, privacy, terms, accessibility, credits, 404, sitemap, robots y RSS válidos. | CI build empty. |
| RF-P08 | M | Al publicar el primer medio, las secciones aparecen sin romper layout ni provocar CLS > 0,05. | Test de publicación + Lighthouse. |
| RF-P09 | M | Si falta un poster, avatar, imagen OG o thumb, se usa un fallback de marca; nunca se muestra un icono roto. | Test de assets faltantes. |
| RF-P19 | M | Solo se publican elementos en estado `published`; borradores, archivados y papelera no aparecen en HTML, sitemap, RSS ni búsqueda. | Tests de estados. |

#### 4.1.1 Inventario normativo de rutas

Esta tabla es la fuente única del inventario de rutas públicas. `RF-P01`/`RF-P02`
la referencian; el sitemap de UX debe coincidir exactamente.

| Ruta ES | Ruta EN | Plantilla | Indexable | En sitemap | Nota |
|---|---|---|---|---|---|
| `/` | `/en/` | Home | sí | sí | Estado vacío editorial. |
| `/fotos/` | `/en/photos/` | Galería | sí | sí | Página 1 canónica. |
| `/fotos/pagina/{n}/` | `/en/photos/page/{n}/` | Galería paginada | sí | sí | `n ≥ 2`; 36 por página. |
| `/fotos/{slug}/` | `/en/photos/{slug}/` | Detalle de foto | sí | sí | 410/301 si se retira. |
| `/videos/` | `/en/videos/` | Galería de video | sí | sí | Página 1 canónica. |
| `/videos/pagina/{n}/` | `/en/videos/page/{n}/` | Galería paginada | sí | sí | `n ≥ 2`; 36 por página. |
| `/videos/{slug}/` | `/en/videos/{slug}/` | Detalle de video | sí | sí | 410/301 si se retira. |
| `/colecciones/` | `/en/collections/` | Listado | sí | sí | Estado vacío si no hay. |
| `/colecciones/{slug}/` | `/en/collections/{slug}/` | Detalle | sí | sí | |
| `/etiquetas/` | `/en/tags/` | Índice de etiquetas | sí | sí | Solo etiquetas con ≥ 1 publicado; estado vacío si no hay. |
| `/etiquetas/{slug}/` | `/en/tags/{slug}/` | Etiqueta | condicional | condicional | `noindex,follow` con < 8 elementos. |
| `/buscar/` | `/en/search/` | Búsqueda | no | no | `noindex,follow`; Pagefind. |
| `/sobre-mi/` | `/en/about/` | Sobre mí | sí | sí | |
| `/contacto/` | `/en/contact/` | Contacto | sí | sí | Alternativa sin JS. |
| `/privacidad/` | `/en/privacy/` | Legal | sí | sí | |
| `/terminos/` | `/en/terms/` | Legal | sí | sí | |
| `/accesibilidad/` | `/en/accessibility/` | Legal | sí | sí | Declaración `A11Y-21`. |
| `/creditos/` | `/en/credits/` | Legal | sí | sí | Licencias y atribuciones. |
| `/404/` | `/en/404/` | Error | no | no | Código 404 real; navegación útil. |
| `/410/` | `/en/410/` | Retirado | no | no | Código 410 real. |
| `/503/` | `/en/503/` | Mantenimiento | no | no | `Retry-After`; no indexable. |
| `/rss.xml` | `/en/rss.xml` | Feed | — | — | Solo `published`; válido con 0 elementos. |
| `/sitemap.xml` | — | Índice de sitemaps | — | — | Páginas, imágenes y videos. |
| `/robots.txt` | — | Robots | — | — | Sitemap; no lista el admin. |

Reglas:

- El admin vive en `admin-photo.patriciobet.dev` y **no** forma parte de este
  inventario público.
- La barra final es consistente. Las rutas sin barra redirigen 301 a la canónica.
- `404`, `410` y `503` se sirven con su código HTTP real en cualquier ruta no
  válida; las rutas de plantilla existen para pruebas y enlaces internos.
- Las páginas EN solo se generan si el contenido EN está completo (`RF-P41`);
  si no, no se enlazan ni entran en hreflang.

---

### 4.2 Home

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-P10 | M | Hero con título, subtítulo, CTAs “Ver fotos” y “Ver videos”, y fondo 3D interactivo. Sin WebGL/Save-Data/reduced-motion: imagen estática AVIF/WebP ≤ 150 KB, candidata a LCP. | Lighthouse + fallback E2E. |
| RF-P11 | M | Trabajos destacados: 8–12 elementos (fotos/videos) elegidos y ordenados por el admin. Si hay menos, se muestran los disponibles; si hay 0, estado vacío. | Test de contenido. |
| RF-P12 | M | Colecciones: tarjetas con portada, título y cantidad de elementos; si no hay colecciones, estado vacío editorial. | Test de contenido. |
| RF-P13 | M | Reel destacado: video corto en bucle, silenciado, autoplay solo al ser visible, pausa al salir, botón de sonido y enlace a su página. Respeta reduced-motion/Save-Data. | E2E + performance. |
| RF-P14 | M | Sobre mí breve con retrato, enlaces al portfolio de desarrollo, GitHub y LinkedIn. | Visual + links. |
| RF-P15 | M | Bloque de contacto con CTA y enlace alternativo. | Visual + links. |
| RF-P16 | M | Cabecera fija con navegación (Fotos, Videos, Colecciones, Sobre mí, Contacto), selector ES/EN y conmutador de tema. El tema sigue la preferencia del sistema; la elección manual se guarda en `localStorage` (sin cookies) y se aplica antes del primer pintado. | E2E + a11y. |
| RF-P17 | M | Los assets demo se identifican internamente (`is_demo`) y nunca se presentan como obra real del autor. | Inspección de datos + visual. |
| RF-P18 | M | Sustituir un asset demo por uno real no requiere cambiar código ni redeploy; solo metadatos y pipeline. | E2E de reemplazo. |

### 4.3 Galerías y listados

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-P20 | M | Cuadrícula tipo mosaico o filas justificadas que respeta la proporción real. Cada imagen declara `width`/`height` o `aspect-ratio`; CLS 0. | Lighthouse + inspección. |
| RF-P21 | M | Cada miniatura es un `<a href>` real a su detalle, no un botón con JS. | Test sin JS. |
| RF-P22 | M | Filtros por colección, etiqueta, tipo y año; orden por fecha u orden manual. Los filtros principales son páginas reales indexables; las combinaciones libres se filtran en cliente. | Crawl + E2E. |
| RF-P23 | M | Paginación real con enlaces, 36 elementos por página (`/fotos/pagina/2/`); sin `rel=prev/next` obligatorio; enlaces rastreables. “Ver más” es mejora progresiva. | Crawl + E2E. |
| RF-P24 | M | Páginas de etiqueta con menos de 8 elementos llevan `noindex,follow` para evitar contenido delgado. | Test de meta robots. |
| RF-P25 | M | Miniaturas de video con icono de reproducción y duración. Vista previa silenciosa de 3–5 s solo con hover y sin Save-Data. | E2E + inspección. |
| RF-P26 | S | Estados: cargando (color dominante/ThumbHash), vacío (“sin resultados”) y error. | Test visual. |
| RF-P27 | M | Si no hay resultados, se explica qué filtros quitar y se ofrece volver a todo; no se muestra una cuadrícula vacía sin contexto. | E2E. |
| RF-P28 | M | Un listado con 0 elementos no genera paginación rota ni enlaces a páginas inexistentes. | Test de borde. |
| RF-P29 | S | Las imágenes de listado usan `loading=lazy`, `decoding=async` y `sizes` correcto; la primera fila puede usar prioridad alta. | Lighthouse. |

### 4.4 Detalle de foto

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-P30 | M | Imagen principal responsive (`srcset` AVIF/WebP/JPEG), `fetchpriority=high`, sin lazy-loading por ser LCP. La foto se muestra sin recortes; el recorte solo aplica a miniaturas/OG según focal point. | Lighthouse + HTML + visual. |
| RF-P31 | M | Ficha: título, descripción, fecha, colección, etiquetas, crédito y licencia. | Visual + datos. |
| RF-P32 | S | Datos de captura opcionales: cámara, lente, focal, apertura, obturación, ISO. Se guardan en DB al procesar; GPS nunca se publica. Ubicación solo texto libre si se escribe. | Test de metadatos. |
| RF-P33 | M | Anterior/siguiente dentro de la colección y 3–6 relacionados; si no hay, se omite la sección. | E2E. |
| RF-P34 | M | Lightbox (PhotoSwipe o `<dialog>` propio): zoom, gestos táctiles, teclado (flechas/Esc), foco atrapado, anuncio a lector de pantalla y cierre que devuelve el foco. Carga bajo demanda al primer clic. | E2E + a11y. |
| RF-P35 | S | Compartir con Web Share API y botón de copiar enlace como alternativa. | E2E. |
| RF-P36 | C | Zoom profundo por teselas para imágenes muy grandes (OpenSeadragon + libvips). | Futuro. |
| RF-P37 | M | No se ofrece descarga del original. La página lo comunica con honestidad: la protección real es baja resolución publicada, autoría y licencia. | Inspección. |
| RF-P38 | M | Si la foto fue despublicada/borrada, su URL responde 410 o 301 según la regla definida; no muestra un detalle vacío. | Test HTTP. |
| RF-P39 | M | Impresión: la página imprime la foto y su ficha sin navegación ni controles. | Print CSS. |

### 4.5 Detalle de video

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-P50 | M | Reproductor sobre `<video>` nativo con controles accesibles propios: play/pausa, progreso, volumen, pantalla completa y velocidad. Teclado completo. | E2E + a11y. |
| RF-P51 | M | `poster` siempre presente (AVIF/WebP/JPEG), `preload=metadata`, `playsinline`; nunca autoplay con sonido. | HTML + E2E. |
| RF-P52 | M | Calidad automática según ancho/conexión y selector manual 480p/720p/1080p. | E2E + red. |
| RF-P53 | M | Subtítulos `.vtt` con `<track>` en todo video con voz. La transcripción textual es opcional, pero si existe se enlaza. Un video con voz no se publica sin subtítulos. | E2E + validación de publicación. |
| RF-P54 | S | Si dura más de 3 min, se sirve HLS (hls.js; Safari nativo). | Test de duración. |
| RF-P55 | M | Con reduced-motion o Save-Data no hay autoplay ni preview en hover. | E2E. |
| RF-P56 | C | Picture-in-Picture. | Futuro. |
| RF-P57 | M | Si el video no está listo, el detalle muestra poster, estado y enlace alternativo; no un reproductor roto. | Test de error. |
| RF-P58 | M | El video no se descarga completo hasta que el usuario interactúa (excepto hero/reel visibles). Se admiten peticiones Range. | Network test. |

### 4.6 Búsqueda

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-P60 | M | Búsqueda en el navegador con Pagefind sobre títulos, descripciones, etiquetas y colecciones. Índice por idioma activo, sin servidor. | E2E. |
| RF-P61 | M | Estado vacío de búsqueda: explica que no hay resultados y sugiere filtros/navegación. | E2E. |
| RF-P62 | M | La página de resultados de búsqueda es `noindex,follow`; no compite con las páginas de contenido. | Meta robots. |
| RF-P63 | M | Si Pagefind no carga, la navegación y el contenido siguen funcionando y la búsqueda muestra un aviso con enlaces alternativos. | Test sin JS/fallo de red. |

### 4.7 Sobre mí, contacto y privacidad

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-P70 | M | Sobre mí: retrato, bio ES/EN, enfoque artístico, equipo opcional, exposiciones/publicaciones opcionales y enlaces. | Visual + contenido. |
| RF-P71 | M* | Formulario: nombre, correo, mensaje y consentimiento. Anti-spam con Turnstile y honeypot. Validación en cliente y Worker. Alternativa visible con enlace de correo. Condicionado a `D-10` (correo/proveedor). | E2E + security. |
| RF-P72 | M | Mensajes de éxito/error accesibles (`aria-live`), sin recargar la página. | E2E + a11y. |
| RF-P73 | M | Límite: 3 mensajes por IP por hora y 5 000 caracteres por mensaje. | Test de rate limit. |
| RF-P74 | M | Página de privacidad con finalidad, base legal, retención, derechos y contacto. | Legal review. |
| RF-P75 | M | El correo de contacto no se muestra en texto plano ofuscado de forma engañosa; se usa el formulario o un enlace `mailto:` autorizado. | Inspección. |

### 4.8 Idioma, navegación y compatibilidad

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-P40 | M | Interenlace con el portfolio de desarrollo en ambos sentidos (cabecera/pie). | Links. |
| RF-P41 | M | Todo el texto visible existe en ES y EN. Si falta la traducción EN de un elemento, su página EN no se genera ni entra en hreflang; no se mezclan idiomas. | Test i18n. |
| RF-P42 | M | No hay redirección automática por idioma del navegador; se ofrece un aviso discreto para cambiar. | E2E. |
| RF-P43 | M | Enlace “saltar al contenido”, migas de pan en detalle, foco visible y restauración de scroll. | a11y. |
| RF-P44 | S | View Transitions como mejora progresiva y prefetch al hover/ver el enlace. | Feature detection. |
| RF-P45 | M | Navegadores: últimas 2 versiones de Chrome, Edge, Firefox y Safari, e iOS Safari 16+. Los demás reciben versión sin animaciones. | Matriz de pruebas. |
| RF-P46 | M | Feed RSS `/rss.xml` con lo último publicado; `/en/rss.xml` si hay EN. Válido también con 0 elementos. | Validación XML. |
| RF-P47 | M | El sitio funciona con JavaScript desactivado para contenido, imágenes, navegación, SEO y contacto alternativo. | Test sin JS. |

### 4.9 Assets y contenido demo

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-P90 | M* | Los assets demo tienen procedencia, licencia, hash y prompt/fuente en `assets/demo/README.md` (reemplaza `manifest.json`). Condicionado a `D-11` (licencia). | Inspección. |
| RF-P91 | M* | Los assets demo no se atribuyen a Patricio ni se presentan como fotografías reales. El build de producción rechaza cualquier elemento con `is_demo=true`; en staging se marcan visiblemente como "demo". Condicionado a `D-11`. | Revisión + test de build. |
| RF-P92 | M* | Se pueden eliminar todos los demo y el sitio sigue funcionando (vuelve al estado vacío). Condicionado a `D-11`. | E2E. |
| RF-P93 | S | Los demo se pueden cargar/descargar desde un comando del admin, sin tocar la base de producción real. | E2E. |
---

## 5. Requisitos funcionales — panel de administración

### 5.1 Acceso y sesión

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-A01 | M | El panel vive solo en `admin-photo.patriciobet.dev`, sin enlaces desde el sitio público, con `X-Robots-Tag: noindex` y sin listarse en `robots.txt`. | Headers + crawl. |
| RF-A02 | M | Dos factores encadenados: Cloudflare Access (identidad autorizada) y passkey WebAuthn en la app. No hay contraseñas, registro ni “olvidé mi contraseña”. | E2E de login. |
| RF-A03 | M | Bootstrap de la primera passkey solo por CLI en el servidor, con enlace de un solo uso de 15 min. Las passkeys adicionales y la rotación se hacen en la UI del admin con reauth < 5 min. Mínimo 2 passkeys y 10 recovery codes de un solo uso, guardados como hash argon2id. | Test CLI + E2E de alta/rotación. |
| RF-A04 | M | Cookie `__Host-`, HttpOnly, Secure, SameSite=Strict, sin `Domain`. Caduca a 30 min de inactividad y 12 h absolutas. Acciones destructivas exigen reauth < 5 min. | Tests de sesión. |
| RF-A05 | M | Cerrar sesión la revoca en el servidor; existe “cerrar todas las sesiones”. | E2E. |
| RF-A06 | M | La API valida en cada petición el JWT de Access (firma, audiencia, expiración) además de la sesión propia; no confía solo en el Tunnel. | Tests con JWT inválido. |
| RF-A07 | M | El admin tiene estado vacío/onboarding: subir primera foto, crear colección, verificar passkey y recovery codes, revisar backup. El alta inicial de passkey se hace por CLI; el onboarding no promete crearla desde cero en la UI. | E2E. |
| RF-A08 | M | El admin es usable desde móvil, incluida la subida desde el teléfono. | Responsive + E2E. |
| RF-A09 | M | Registro de auditoría de solo lectura: acción, objeto, fecha, IP (truncada/hasheada salvo investigación de seguridad) y user agent. | Inspección + test. |

### 5.2 Subida

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-A10 | M | Arrastrar/soltar, selector y pegado, hasta 20 archivos, concurrencia 3, progreso por archivo, pausar, reanudar, cancelar y reintento con backoff. | E2E. |
| RF-A11 | M | Vista previa local inmediata y validación previa en cliente (tipo/tamaño). No sustituye la validación del servidor. | E2E. |
| RF-A12 | M | Fotos: JPEG, PNG, WebP, AVIF, TIFF (HEIC si el worker lo soporta), ≤ 50 MB y 200 MP. Videos: MP4, MOV, WebM, ≤ 2 GB, 10 min, ≤ 3840×2160. Cada rechazo muestra el motivo exacto. | Tests de límites. |
| RF-A13 | M | Detección de duplicados por SHA-256 del original: avisa, no bloquea. | Test. |
| RF-A14 | M | Estados: subiendo → en cola → procesando → listo o error (con causa legible y Reintentar). Actualización en vivo por SSE o sondeo. | E2E. |
| RF-A15 | M | Si el navegador se cierra a mitad de una subida multiparte, al volver se ofrece reanudar o descartar; partes huérfanas se limpian a las 24 h. | Test de reanudación. |
| RF-A16 | M | La subida sobrevive a un reinicio del servidor: la sesión y las partes se persisten; al volver se puede reanudar o limpiar. | Test de apagón. |
| RF-A17 | M | Reintentos idempotentes: no se crean duplicados por reintentar la misma subida. | Test. |

### 5.3 Metadatos y organización

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-A20 | M | Por idioma: título, alt, descripción y slug (autogenerado/editable). Comunes: fecha de captura (EXIF editable), colecciones, etiquetas, ubicación en texto, licencia, crédito, destacado, orden manual y equipo. | E2E. |
| RF-A21 | M | Concurrencia optimista con número de versión; si cambió desde que se abrió, el guardado falla con aviso y no pisa cambios. | Test de dos pestañas. |
| RF-A22 | M | Edición por lotes: colección, etiquetas, licencia o estado a una selección. | E2E. |
| RF-A23 | M | Reordenar arrastrando: elementos de colección, colecciones y destacados. Toda acción de arrastre tiene alternativa con botones “subir/bajar” o “mover a posición”, usable con teclado y lector de pantalla. | E2E + a11y. |
| RF-A24 | C | Sugerencia de alt/etiquetas con IA: **fuera de v1** (`D-26`). No se envía ninguna imagen a servicios externos. Si se reevalúa, será opt-in por imagen, con proveedor, DPA, retención y consentimiento documentados. | Decisión + revisión de privacidad. |
| RF-A25 | M | Punto focal para que los recortes (miniaturas/OG) no corten el sujeto. | Visual + pipeline. |
| RF-A26 | M | Poster de video: elegir fotograma con slider o subir imagen. | E2E. |
| RF-A27 | M | Subida de subtítulos `.vtt` por idioma; obligatoria antes de publicar un video con voz. | E2E + validación. |
| RF-A28 | M | Marcar asset como demo y registrar procedencia/licencia. | Formulario + DB. |
| RF-A29 | M | Validación de metadatos: no publicar sin título/alt ES; si habrá EN, exigir EN. | Test. |

### 5.4 Publicación

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-A30 | M | Estados: `draft`, `published`, `archived`, `trashed`. Transiciones: `draft → published`, `published → archived`, `published/archived → trashed`, `trashed → draft` (restaurar), `trashed → purged` (definitivo con reauth). Programar publicación (`publish_at`) es S. | E2E de transiciones. |
| RF-A31 | M | Para publicar: procesamiento listo, título/alt ES, EN si tendrá página EN, slug único y colección válida. | Test de validación. |
| RF-A32 | M | “Publicar cambios” encola un build. Cambios en 60 s se agrupan en un solo build. Estado visible (en cola, construyendo, publicado, error) y enlace a la versión viva. | E2E + tiempo. |
| RF-A33 | M | Vista previa privada de borrador con datos reales, `noindex`, solo dentro del admin/Access. | E2E. |
| RF-A34 | M | Despublicar/borrar retira de listados, feeds y sitemaps; la URL responde 410 o 301 según regla. | Test HTTP. |
| RF-A35 | M | Borrado en dos pasos: papelera 30 días y borrado definitivo con reauth; elimina derivados/original y deja auditoría. | E2E. |
| RF-A36 | M | Rollback a una de las 3 últimas releases con un clic; confirma y registra. | E2E. |
| RF-A37 | M | Si el build falla, la release actual sigue viva y el admin muestra el error y los logs. | Test de fallo. |
| RF-A38 | M | Publicar con 0 medios no rompe el build; el admin muestra el estado vacío. | Test. |
| RF-A39 | S | Programar publicación por fecha con zona horaria y cancelación. | Test. |

### 5.5 Mantenimiento y operación

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-A40 | M | Reprocesar uno o todos con nuevos ajustes; idempotente; las URLs no cambian hasta que el nuevo derivado esté completo. | E2E. |
| RF-A41 | M | Panel de estado: jobs/errores, espacio R2 vs cuota, última copia, último build y duración. | Inspección. |
| RF-A42 | M | Auditoría de solo lectura con filtros y exportación. | E2E. |
| RF-A43 | S | Exportar metadatos JSON/CSV y ZIP temporal de originales de una colección. | Test. |
| RF-A44 | S | Modo mantenimiento: página 503 con `Retry-After`. | Test. |
| RF-A45 | M | Admin usable en móvil y accesible (WCAG 2.2 AA). | a11y + responsive. |
| RF-A46 | M | Onboarding en estado vacío con checklist y enlaces a subir/configurar. | E2E. |
| RF-A47 | M | Cargar/descargar contenido demo solo en desarrollo/staging, sin tocar la base de producción. El comando se niega a ejecutarse si `NODE_ENV=production`. | E2E + test de guarda. |
| RF-A48 | M | Checklist de lanzamiento: build de producción sin demo (o sitio vacío aprobado), contenido real si existe, backups con Object Lock, passkeys, SEO y seguridad. | Inspección + CI. |
| RF-A49 | M | Ajustes de seguridad: listar/revocar sesiones, passkeys, regenerar recovery codes, ver auditoría. | E2E. |
| RF-A50 | M | Estado de backups y enlace al procedimiento de restore; alerta si el último backup falló. | Inspección. |

---

## 6. Pipeline de medios

### 6.1 Principios

- Nunca se sirve el original. Todo se re-codifica para neutralizar archivos
  políglotas o con cargas ocultas.
- Los derivados son inmutables y su nombre incluye un hash de contenido:
  `{id}/{tipo}-{ancho}-{hash8}.{ext}`. Se cachean un año con `immutable`.
- Todo job es idempotente y atómico: o se generan todas las variantes, o no se
  publica ninguna.
- El pipeline es el mismo para contenido demo y real; solo cambia la marca
  `is_demo` y la procedencia.
- Un apagón no puede dejar una variante a medias ni un `current` roto.

### 6.2 Fotos

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-M01 | M | Aplicar orientación EXIF a los píxeles y luego eliminarla. | Fixture con orientación. |
| RF-M02 | M | Convertir a sRGB e incrustar el perfil. Display P3 queda como C. | Inspección de color. |
| RF-M03 | M | Anchos: 320, 640, 960, 1280, 1920 y 2560 px. Nunca se amplía por encima del original. | Test de variantes. |
| RF-M04 | M | Formatos/calidad inicial: AVIF 50–60, WebP 78, JPEG progresivo mozjpeg 80 como respaldo (hasta 1920 px). | Inspección visual + pesos. |
| RF-M05 | M | Presupuesto AVIF: 320–640 ≤ 40 KB; 1280 ≤ 180 KB; 1920 ≤ 350 KB; 2560 ≤ 600 KB. Si se excede, baja calidad un paso y reintenta (mínimo AVIF 40). | Test de presupuesto. |
| RF-M06 | M | Placeholders: color dominante y ThumbHash guardados en DB e insertados en HTML. | Inspección HTML/DB. |
| RF-M07 | M | Imagen social 1200×630 JPEG ≤ 300 KB, recortada con punto focal. | Test. |
| RF-M08 | M | Eliminar EXIF/IPTC/XMP de derivados. Reescribir solo autor, copyright y título. Datos de captura a DB. GPS descartado siempre. | `exiftool` + test. |
| RF-M09 | M | Límites del worker: `limitInputPixels` 200 MP, 60 s/imagen, concurrencia 2, contenedor con 2 GB de memoria. | Config + test. |
| RF-M10 | S | HEIC/HEIF solo si libvips tiene libheif y decoder HEVC; si no, se rechaza con mensaje claro y se pide exportar a JPEG. | Spike + test. |
| RF-M11 | C | Teselas DZI para zoom profundo con libvips. | Futuro. |
| RF-M12 | M | Validar firma real/magic bytes, decodificar y re-codificar. Rechazar políglotas, truncados y bombas de descompresión. | Fixtures maliciosos. |
| RF-M13 | M | Nombres inmutables con hash de contenido; reprocesar no cambia URLs ya publicadas hasta que el nuevo set esté completo. | Test. |
| RF-M14 | M | Publicación atómica: manifest de variantes completo antes de actualizar la DB/HTML. | Test de fallo. |
| RF-M15 | M | Registrar procedencia/licencia de assets demo en DB y manifest. | Test. |
| RF-M16 | M | El pipeline acepta 0 assets y no falla el build. | CI empty. |

### 6.3 Videos

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-M20 | M | Validar con ffprobe: contenedor mov/mp4/webm, un stream de video, ≤ 2 audio, ≤ 10 min, ≤ 3840×2160, ≤ 60 fps. Descartar data/attachments/subtítulos incrustados. | Fixtures. |
| RF-M21 | M | FFmpeg seguro: entrada solo local en tmpfs, `-protocol_whitelist file`, `-nostdin`, sin red, timeout 30 min, límites CPU/memoria. | Test con playlist remota. |
| RF-M22 | M | MP4 H.264 High, yuv420p, `+faststart`, GOP ~2 s: 1080p ~5 Mbps, 720p ~2,5 Mbps, 480p ~1 Mbps. Audio AAC 128 kbps. Sin ampliar. | ffprobe + pesos. |
| RF-M23 | C | AV1/VP9 WebM antes del MP4. | Futuro. |
| RF-M24 | S | HLS para > 3 min: 3 renditions, fMP4 4–6 s, master, hls.js/Safari. | Test. |
| RF-M25 | M | Poster AVIF/WebP/JPEG a 640/1280/1920 px. | Test. |
| RF-M26 | M | Preview hover 3–5 s, 480p, sin audio, ≤ 600 KB. | Test. |
| RF-M27 | M | Loop de fondo (hero/reel): 720p sin audio, ≤ 3 MB. | Test. |
| RF-M28 | M | Objetivo: video 2 min 1080p ≤ 10 min en 2 vCPU. Medir y ajustar preset. | Benchmark. |
| RF-M29 | M | Si falla cualquier variante, job en error con log y no se publica nada parcial. | Test. |
| RF-M30 | M | Job interrumpido por apagón se marca `interrupted` y se reencola/falla con causa; no queda `processing` eterno. | Test de corte. |
| RF-M31 | M | Limpieza de temporales y archivos parciales al arranque y por antigüedad. | Test. |
| RF-M32 | M | Backpressure: si la cola/CPU está saturada, se limita concurrencia y se informa al admin; no se tumba el servidor. | Test de carga. |

### 6.4 Almacenamiento y colas

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-M40 | M | Dos buckets: `photo-private` (`incoming/`, `originals/`) y `photo-public` (derivados). Solo el público tiene dominio personalizado. Listado de objetos deshabilitado. | Config R2. |
| RF-M41 | M | Lifecycle: lo que quede en `incoming/` se borra a las 24 h. | Config + test. |
| RF-M42 | M | Derivados con `Cache-Control: public, max-age=31536000, immutable`. | Headers. |
| RF-M43 | M | CORS del bucket público limitado a `https://photo.patriciobet.dev` y al origen de preview. Necesario para Three.js. | Test CORS. |
| RF-M44 | M | Originales siempre en bucket privado; fuente de verdad para reprocesar y backups. | Inspección. |
| RF-M45 | M | Tokens R2 separados y de mínimo privilegio: API solo firma `incoming/`; worker lee `incoming/`/`originals/` y escribe `public/`; backup solo su bucket. | Revisión de IAM. |
| RF-M46 | M | Manifest de assets demo con procedencia, licencia, hash, prompt/fuente y `replaced_by`. | Inspección. |
| RF-M47 | M | Demo y real usan el mismo pipeline; no hay carpeta “especial” que evite validación. | Test. |
| RF-M48 | M | Reconciliación al arranque: jobs `processing` → `interrupted`/`queued`, uploads multipart huérfanos, releases incompletas. | Test de corte. |
| RF-M49 | M | Publicación atómica de variantes: el manifest se escribe completo y luego se referencia; nunca se enlaza una variante inexistente. | Test. |
| RF-M50 | M | Límites de CPU/memoria/tiempo y cola con reintentos/backoff; no hay bucles infinitos. | Test de carga. |
| RF-M51 | M | Limpieza de originales temporales, previews y multipart huérfanos tras un corte o fallo. | Test. |

---

## 7. Diseño visual, animaciones y 3D

### 7.1 Dirección creativa

Estilo cinematográfico y editorial; las fotos son lo más llamativo.

- Fondo oscuro neutro por defecto; modo claro “papel”.
- Acento único `#6366f1` (foco, enlaces, detalles) para conectar con el portfolio
  de desarrollo.
- Tipografía: una serif de display con carácter (Fraunces o Instrument Serif) y
  una sans neutra (Inter o Geist). Máximo 2 familias y 3–4 pesos, autoalojadas,
  WOFF2, subset latino, `font-display: swap`, preload solo del título y fallback
  con `size-adjust`.
- Layout de 12 columnas, mucho espacio, esquinas rectas o radio 2–4 px, sin
  sombras pesadas. Las fotos no se recortan en el detalle.
- Microinteracciones sobrias: zoom 1,03 en hover, fundidos, revelados. Cursor
  personalizado solo en escritorio con puntero fino (C).

### 7.2 Animaciones con scroll

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-V01 | M | GSAP + ScrollTrigger para revelados, parallax suave, pin en home y contadores. Verificar licencia vigente. | Visual + license review. |
| RF-V02 | S | Lenis para scroll suave; se desactiva con reduced-motion y en táctil; respeta anclas/teclado/buscar. Si empeora INP, se elimina. | Test de INP. |
| RF-V03 | S | CSS scroll-driven animations como mejora progresiva; GSAP es la base. | Feature detection. |
| RF-V04 | M | Solo se animan `transform` y `opacity`; prohibido `width`, `height`, `top`, `left`. `will-change` solo durante la animación. | Code review + performance. |
| RF-V05 | M | Duración 400–900 ms, easing token único, stagger ≤ 80 ms. | Inspección. |
| RF-V06 | M | Animaciones después del LCP (`requestIdleCallback`). Estado inicial visible: si JS falla, nada queda oculto; la clase la añade el script. | Test sin JS. |
| RF-V07 | M | `prefers-reduced-motion: reduce`: sin parallax, pin ni 3D animado; solo fundidos mínimos o nada. | E2E. |
| RF-V08 | M | El contenido y los enlaces existen fuera del canvas; el canvas es decorativo (`aria-hidden`). | a11y. |
| RF-V09 | M | Ninguna animación bloquea scroll, foco, teclado o lectura. | a11y. |

### 7.3 Three.js

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RF-V10 | M | Hero WebGL: planos con texturas de fotos destacadas y distorsión por shader que reacciona al puntero/scroll. Objetivo 60 fps en gama media. | Benchmark. |
| RF-V11 | S | Ruta opcional `/explorar/` con galería 3D navegable; `noindex` porque el contenido ya existe en HTML. | Test. |
| RF-V12 | M | Carga: isla `client:idle`/`client:visible`, import dinámico, tree-shaking, chunk ≤ 200 KB gz, hasta 8 texturas ≤ 1280 px AVIF/WebP progresivas. | Bundle analysis. |
| RF-V13 | M | Activación solo con WebGL2, sin reduced-motion, sin Save-Data, conexión distinta de 2G/3G y ≥ 4 núcleos. Si no, imagen estática. | E2E con flags. |
| RF-V14 | M | Pausar render con pestaña oculta o canvas fuera de pantalla; DPR ≤ 2; liberar geometrías/materiales/texturas (`dispose`); manejar `webglcontextlost` con fallback. | Test. |
| RF-V15 | M | Texturas con `crossOrigin=anonymous` y CORS en R2. | Test CORS. |
| RF-V16 | M | Canvas decorativo (`aria-hidden`); texto/enlaces fuera del canvas. | a11y. |
| RF-V17 | S | Degradación: si FPS medio < 40 durante 2 s, baja resolución, luego quita efecto y luego muestra estático. | Test simulado. |
| RF-V18 | C | Si Three.js no cabe, usar OGL o shader propio. | Futuro. |

### 7.4 Componentes y responsivo

- Componentes: cabecera, hero, tarjeta de foto, mosaico, lightbox, reproductor,
  chips de filtro, migas, pie, avisos/toasts, estados vacíos, skeletons.
- Cada componente define estados: normal, hover, foco, activo, deshabilitado,
  cargando, vacío, error.
- Breakpoints: 480, 768, 1024, 1440 y 1920+; mobile-first con 1, 2, 3 y 4
  columnas; áreas táctiles ≥ 44 px; `sizes` correcto.
- El estado vacío tiene diseño propio: título, texto breve, CTA y, si aplica,
  enlaces a “Sobre mí”/“Contacto”. No se muestra una cuadrícula vacía.
- Los estados de error no exponen stack traces, rutas internas ni datos
  personales.

---

## 8. Rendimiento

### 8.1 Presupuestos verificados en CI

| Recurso | Presupuesto |
|---|---|
| HTML de una página | ≤ 30 KB gz |
| CSS total | ≤ 60 KB gz (crítico en línea ≤ 14 KB) |
| JS inicial sin 3D | ≤ 100 KB gz |
| JS inicial home sin chunk 3D | ≤ 160 KB gz |
| Chunk 3D diferido | ≤ 200 KB gz |
| Fuentes | ≤ 100 KB total |
| Imágenes del primer viewport | ≤ 400 KB |
| Imagen LCP móvil | ≤ 150 KB |
| Peticiones hasta primer render | < 25 |
| TTFB con caché CDN | ≤ 200 ms p75 |

### 8.2 Requisitos

| ID | P | Requisito | Verificación |
|---|---|---|---|
| RNF-R01 | M | HTML estático en CDN: navegador `max-age=0, must-revalidate`; CDN `s-maxage=1 día`; purga al publicar. | Headers. |
| RNF-R02 | M | Assets con hash: `max-age=31536000, immutable`. | Headers. |
| RNF-R03 | M | Brotli precomprimido con gzip de respaldo, HTTP/2 y HTTP/3, Early Hints. | Cloudflare/Caddy. |
| RNF-R04 | M | Imágenes `picture` AVIF/WebP/JPEG, `srcset`/`sizes`, lazy/async salvo LCP, width/height siempre, `fetchpriority=high` en una sola. | Lighthouse. |
| RNF-R05 | M | Video: `preload=none` en listados, `metadata` en detalle; solo poster hasta interacción; Range. | Network. |
| RNF-R06 | M | Fuentes autoalojadas, subset, un preload y fallback con ajuste de métricas. | Lighthouse. |
| RNF-R07 | M | Islas `client:visible`/`client:idle`; GSAP solo core + ScrollTrigger; bundle analysis por PR. | CI. |
| RNF-R08 | M | Preconnect a `cdn-photo`; prefetch de siguiente página al hover/ver. | Network. |
| RNF-R09 | M | Sin scripts de terceros bloqueantes; analítica ligera sin cookies con `defer`; Turnstile solo en contacto. | Network. |
| RNF-R10 | S | Sin service worker en v1. | Inspección. |
| RNF-R11 | M | El estado vacío no carga imágenes pesadas ni JS de 3D innecesario; LCP ≤ 1,5 s. | Lighthouse empty. |
| RNF-R12 | M | La home con 3D cumple ≥ 90 Lighthouse móvil; galerías/detalle ≥ 95. | CI. |
| RNF-R13 | M | El servidor no se usa para entregar medios; R2/CDN. | Network. |

### 8.3 Medición

- Lighthouse CI en cada PR con los presupuestos; el PR falla si se exceden.
- Datos reales: web-vitals a analítica sin cookies o Cloudflare Web Analytics;
  Core Web Vitals de Search Console.
- Revisión manual con PageSpeed Insights y WebPageTest antes de cada lanzamiento,
  CPU 4× más lenta y Slow 4G.
- Medición del build vacío y del build con contenido.
- Medición del tiempo de publicación end-to-end (subida → live) ≤ 3 min para foto.

---

## 9. Datos y contenido

### 9.1 Entidades principales

- `admin_user`, `passkey_credential`, `recovery_code`, `session`,
  `webauthn_challenge`.
- `media_asset`, `media_translation`, `media_variant`, `media_capture`,
  `media_poster`, `media_caption`.
- `collection`, `collection_translation`, `collection_item`.
- `tag`, `tag_translation`, `media_tag`.
- `upload_session`, `upload_part`, `job`, `build`, `release`, `redirect`,
  `setting`, `audit_log`.
- `demo_asset` o campos `is_demo`/`provenance` en `media_asset`.

### 9.2 Reglas de contenido

| ID | P | Requisito | Verificación |
|---|---|---|---|
| DAT-01 | M | Cada medio tiene un tipo (`photo`/`video`), estado (`draft`/`published`/`archived`/`trashed`), versión optimista y timestamps UTC. | Migración + test. |
| DAT-02 | M | Traducciones por locale (`es`, `en`) con título, alt, descripción y slug. No se mezclan idiomas en una página. | Test i18n. |
| DAT-03 | M | Slug único por locale; si cambia, se inserta un redirect 301 y se conserva el anterior. | Test DB + HTTP. |
| DAT-04 | M | `media_asset.checksum_sha256` único o indexado; duplicados se avisan, no se bloquean. | Test. |
| DAT-05 | M | Relaciones con integridad referencial; borrar una colección no borra medios, solo sus vínculos. | Test DB. |
| DAT-06 | M | Borrado lógico (papelera) con `deleted_at`; purga definitiva solo con reauth y auditoría. | Test. |
| DAT-07 | M | Datos de captura en tabla separada; GPS nunca se almacena ni se publica. | Test. |
| DAT-08 | M | `is_demo` y `provenance` (fuente, licencia, autor, URL, hash) obligatorios para assets demo. | Test. |
| DAT-09 | M | `focal_x`/`focal_y` normalizados 0–1; usados por miniaturas/OG. | Test visual. |
| DAT-10 | M | `dominant_color` y `thumbhash` generados por el pipeline y guardados. | Test. |
| DAT-11 | M | `publish_at` opcional con zona horaria; un elemento programado no aparece hasta la fecha. | Test. |
| DAT-12 | M | `sort_order` por colección y destacados; reordenar es transaccional. | Test. |
| DAT-13 | M | `audit_log` inmutable (append-only) con actor, acción, objeto, IP truncada/hasheada, UA y timestamp; retención y acceso restringidos. | Test. |
| DAT-14 | M | Migraciones versionadas y reproducibles; CI aplica desde cero y prueba rollback lógico. | CI. |
| DAT-15 | M | Datos de contacto no se almacenan en la DB; el Worker envía y descarta. | Inspección. |
| DAT-16 | M | Retención: papelera 30 días; logs 30 días; auditoría 1 año; backups 30 días/12 meses. | Config + test. |
| DAT-17 | M | El build con 0 medios produce páginas válidas y no inserta filas “fantasma”. | CI. |
| DAT-18 | M | El contenido demo se puede borrar en bloque sin afectar contenido real. | Test. |
| DAT-19 | M | Exportación de metadatos JSON/CSV conserva IDs, slugs y traducciones. | Test. |
| DAT-20 | M | No se guardan secretos ni tokens en tablas de contenido; solo referencias/variables de entorno. | Revisión. |

---

## 10. Seguridad

> Prioridad del proyecto: **evitar accesos no deseados** y recuperar el servicio
> tras un apagón. La seguridad es autogestionada; Cloudflare ayuda, pero no
> sustituye el hardening del host ni la revisión de código.

### 10.1 Modelo de amenazas

**Activos:** acceso al admin, passkeys, sesiones, originales, derivados, tokens
R2, base de datos, backups, dominio/DNS, TLS, formulario de contacto, builds,
reputación del sitio y datos personales (correo del visitante, IP en logs).

**Actores:** atacante externo automatizado, bot de spam, atacante manual,
visitante curioso, persona con acceso físico al servidor, dependencia/servicio
de terceros comprometido, error humano del admin.

**Límites de confianza:**

```text
Internet → Cloudflare → Tunnel → Caddy → API/Admin
                                  ├→ Postgres/Redis
                                  ├→ Worker → R2
                                  └→ Builder → releases
Contacto → Worker → email
```

**STRIDE (resumen):**

| Amenaza | Ejemplo | Control principal |
|---|---|---|
| Spoofing | Robo de sesión/passkey, JWT falso. | Access + WebAuthn, JWT validado, cookies `__Host-`, reauth. |
| Tampering | Modificar metadatos, variantes o releases. | AuthZ, versiones optimistas, hashes, releases atómicas, auditoría. |
| Repudiation | Negar una acción destructiva. | Auditoría append-only con IP/UA. |
| Information disclosure | Filtrar originales, tokens, backups, PII. | Buckets privados, tokens acotados, cifrado, logs sin PII. |
| Denial of service | Inundar contacto, uploads o API. | WAF, rate limits, Turnstile, límites de recursos, cola. |
| Elevation of privilege | Pasar de visitante a admin. | Sin registro, Access, passkey, sin IDOR, mínimo privilegio. |

### 10.2 Autenticación y autorización

| ID | P | Requisito | Verificación |
|---|---|---|---|
| SEG-01 | M | El único mecanismo de acceso al admin es Cloudflare Access + passkey WebAuthn. No hay contraseñas, registro público ni reset por email. | E2E + revisión. |
| SEG-02 | M | Access permite **solo** la identidad de Patricio. No existe una segunda identidad de respaldo; el break-glass son los recovery codes y una segunda passkey del mismo usuario. Cualquier alta futura de una identidad externa exige ADR, aprobación y runbook de revocación. | Config + test de acceso denegado. |
| SEG-03 | M | La API valida el JWT de Access (`iss`, `aud`, `exp`, firma JWKS) en cada request, además de la sesión propia. | Tests con tokens inválidos. |
| SEG-04 | M | Passkeys: mínimo 2 (principal + respaldo), `userVerification=required`, challenge de un solo uso con TTL, origen/RP ID exactos. | Test WebAuthn. |
| SEG-05 | M | Recovery codes: 10, un solo uso, hash argon2id, mostrados una vez, regenerables con reauth. | Test. |
| SEG-06 | M | Sesión `__Host-`, HttpOnly, Secure, SameSite=Strict, sin Domain; idle 30 min, absoluta 12 h. | Tests de cookie. |
| SEG-07 | M | Acciones destructivas (purga, passkeys, export, restore) exigen reauth < 5 min. | E2E. |
| SEG-08 | M | Logout revoca en servidor; “cerrar todas las sesiones” invalida todas. | E2E. |
| SEG-09 | M | No hay IDOR: cada recurso se autoriza por sesión/rol, no solo por ID. | Tests. |
| SEG-10 | M | El admin no se enlaza desde el sitio público; `X-Robots-Tag: noindex`; no se lista en robots.txt. | Headers + crawl. |

### 10.3 Hardening del host y red

| ID | P | Requisito | Verificación |
|---|---|---|---|
| SEG-11 | M | Ubuntu Server LTS, mínimo de paquetes, sin escritorio ni servicios innecesarios. | Inventario. |
| SEG-12 | M | UFW: denegar entrada por defecto; solo Tunnel saliente; sin puertos HTTP/SSH públicos. | `nmap` externo. |
| SEG-13 | M | SSH deshabilitado o solo por clave y bind a localhost/Tunnel; sin login root. | Config. |
| SEG-14 | M | `unattended-upgrades` para parches de seguridad; ventana y reinicio controlado. | Logs. |
| SEG-15 | M | `fail2ban`/protección de fuerza bruta en servicios locales expuestos al host. | Config. |
| SEG-16 | M | `auditd` y integridad (AIDE) para binarios/config crítica; logs locales rotados. | Config. |
| SEG-17 | M | Disco cifrado (LUKS) si el hardware lo permite; BIOS con password y arranque desde disco interno. | Config. |
| SEG-18 | M | Acceso físico restringido; servidor en lugar seguro, con batería y ventilación. | Checklist. |
| SEG-19 | M | Docker: contenedores non-root, `cap_drop: ALL` cuando sea posible, `no-new-privileges`, sin socket, sin `privileged`, sin `network_mode: host`. | Revisión compose. |
| SEG-20 | M | Redes Docker separadas (frontend/backend/worker); solo Caddy expone al Tunnel. | Compose. |
| SEG-21 | M | Límites de CPU/memoria/PIDs y logs rotados por contenedor; sin unbounded. | Compose. |
| SEG-22 | M | NTP sincronizado; TLS solo en Cloudflare/Caddy; HSTS. | Config. |
| SEG-23 | M | Secretos en archivos `600` o Docker secrets; no en imágenes, compose versionado ni variables globales visibles. | Revisión. |
| SEG-24 | M | Backup cifrado y probado; el servidor no puede descifrar backups de otro servidor sin la clave. | Test. |

### 10.4 Seguridad de aplicación

| ID | P | Requisito | Verificación |
|---|---|---|---|
| SEG-25 | M | Validación de entrada en cliente y servidor; rechazo de tipos/tamaños/valores fuera de rango. | Tests. |
| SEG-26 | M | SQL parametrizado/ORM; sin concatenación de SQL con input. | Code review + tests. |
| SEG-27 | M | XSS: escape por defecto, sanitización de HTML permitido, CSP estricta. | Tests + ZAP. |
| SEG-28 | M | CSRF: SameSite=Strict + comprobación de Origin + cabecera personalizada en mutaciones. | Tests. |
| SEG-29 | M | SSRF: no se aceptan URLs remotas para medios; FFmpeg solo archivo local; sin fetches a IPs privadas. | Tests. |
| SEG-30 | M | Path traversal/zip slip: nombres de archivo generados, no confiar en el nombre original; extracción segura. | Tests. |
| SEG-31 | M | Upload: firma real, decodificación, re-codificación, límites, cuarentena, sin ejecución, bucket privado. | Fixtures. |
| SEG-32 | M | FFmpeg: `-protocol_whitelist file`, `-nostdin`, sin red, timeout, límites, contenedor aislado. | Tests. |
| SEG-33 | M | Rate limits: login/reauth, uploads, builds, export, contacto (3/IP/h) y endpoints costosos. | Tests de carga. |
| SEG-34 | M | CORS del API solo `https://admin-photo.patriciobet.dev`; R2 solo orígenes permitidos. | Tests. |
| SEG-35 | M | CSP con `default-src 'self'`, sin `unsafe-inline` en producción; Turnstile y R2 allowlisted. Report-Only primero. | Headers + browser. |
| SEG-36 | M | Headers: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP, `frame-ancestors`. | securityheaders.com. |
| SEG-37 | M | Errores genéricos al cliente; logs internos con `traceId`; sin stack traces ni rutas. | Tests. |
| SEG-38 | M | Email: validar destinatario, evitar header injection, SPF/DKIM/DMARC, no rebotar contenido arbitrario. | Test. |
| SEG-39 | M | Dependencias: lockfile, `pnpm --frozen-lockfile`, OSV/Trivy/Semgrep, SBOM, pin de digests. | CI. |
| SEG-40 | M | Secret scanning: gitleaks pre-commit + CI + GitHub push protection. | CI. **Bloqueado** hasta configurar remoto y `.gitleaks.toml`. |

### 10.5 Monitoreo, auditoría e incidentes

| ID | P | Requisito | Verificación |
|---|---|---|---|
| SEG-41 | M | Alertas de login fallido, uso de recovery code, cambio de passkey, purga, restore y errores 5xx. | Test de alerta. |
| SEG-42 | M | Auditoría append-only de acciones admin y eventos de seguridad. | Test. |
| SEG-43 | M | Logs sin secretos/PII; IP truncada o hasheada si no se necesita completa. | Revisión. |
| SEG-44 | M | Runbook de incidente: contener, rotar, revocar, restaurar, notificar, postmortem. | Simulacro. |
| SEG-45 | M | Escaneo externo periódico: puertos, headers, TLS, rutas admin, exposición de `.env`/`.git`. | Informe. |
| SEG-46 | S | Prueba de penetración básica anual o antes de cambios grandes. | Informe. |
| SEG-47 | M | El servidor no responde a IP directa ni a puertos no autorizados; solo Cloudflare. | `nmap`/curl. |

### 10.6 Riesgos residuales aceptados

- Sin UPS, el sitio puede caer; la seguridad de datos se cubre con backups.
- Un solo admin: si pierde todos los factores, la recuperación es física/CLI.
- Cloudflare es un proveedor crítico; se documenta su configuración y se puede
  migrar DNS.
- El hardware antiguo puede fallar; el plan de recuperación usa otro equipo.
- La seguridad física del hogar no es perfecta; se usan LUKS, BIOS y backups.

---

## 11. Backups, continuidad y recuperación

> “Sin backup” en la corrección del usuario significa **sin UPS/respaldo
> eléctrico**. Los backups de datos son obligatorios.

### 11.1 Objetivos

- **RPO:** 24 h en v1 (pérdida máxima aceptable de datos).
- **RTO:** 4 h para restaurar el sitio público y el admin en hardware nuevo.
- **Retención:** 30 copias diarias + 12 mensuales; papelera 30 días.
- **Cifrado:** restic con contraseña en gestor de secretos; nunca en git.
- **Offsite:** R2 (bucket de backups) + B2 u otro proveedor; no solo el mismo
  servidor.

### 11.2 Qué se respalda

| Elemento | Frecuencia | Método |
|---|---|---|
| PostgreSQL | diaria + antes de migraciones | `pg_dump` comprimido + restic. |
| Originales de medios | continuo (R2) + inventario diario | R2 versioning + restic/rclone. |
| Configuración del servidor | en cada cambio | repo + `/etc` relevante + compose. |
| Releases construidas | por release | retención local 3 + backup. |
| Secretos | al rotar | gestor de contraseñas, no backup automático. |
| Manifests/demo | en cada cambio | git + R2. |

### 11.3 Requisitos

| ID | P | Requisito | Verificación |
|---|---|---|---|
| BCK-01 | M | Backup diario automático de PostgreSQL, originales, configuración y releases. | Log + inspección. |
| BCK-02 | M | Backups cifrados en reposo y en tránsito; contraseña fuera del servidor. | Inspección. |
| BCK-03 | M | Copia offsite en un proveedor/bucket distinto del servidor. | Inspección. |
| BCK-04 | M | Retención 30 diarios + 12 mensuales; limpieza automática. | Config. |
| BCK-05 | M | Verificación de integridad (`restic check`) semanal. | Log. |
| BCK-06 | M | Restore de PostgreSQL probado mensualmente en un entorno limpio. | Reporte. |
| BCK-07 | M | Restore completo (sitio + DB + medios) probado trimestralmente. | Reporte. |
| BCK-08 | M | El restore no requiere la laptop de desarrollo ni secretos en git. | Simulacro. |
| BCK-09 | M | Si el backup falla, alerta al admin y estado rojo en el panel. | Test. |
| BCK-10 | M | Los backups no se sirven por HTTP ni se exponen en el sitio. | Escaneo. |
| BCK-11 | M | El servidor puede arrancar y servir la última release aunque la DB tarde en recuperar; el admin espera. | Test. |
| BCK-12 | M | Postgres con WAL y `fsync`; recuperación tras corte sin corrupción. | Test de corte. |
| BCK-13 | M | Los jobs interrumpidos se reconcilian; no se pierden originales ya subidos a R2. | Test. |
| BCK-14 | M | Los uploads multipart incompletos se pueden reanudar o limpiar. | Test. |
| BCK-15 | M | El `current` de releases solo cambia al final; un build interrumpido no lo toca. | Test. |
| BCK-16 | M | Runbook de recuperación en hardware nuevo, con tiempos medidos. | Documento + simulacro. |
| BCK-17 | M | Copia de la configuración de Cloudflare (DNS, Tunnel, Access, R2) documentada y versionada sin secretos. | Revisión. |
| BCK-18 | M | Plan de recuperación si el servidor es robado/incendiado: nuevo hardware, claves, DNS y restore. | Simulacro. |
| BCK-19 | S | Página de estado externa o aviso de mantenimiento si el sitio cae. | Test. |
| BCK-20 | M | El admin muestra última copia, tamaño, duración y resultado. | Inspección. |
| BCK-21 | M | El bucket offsite de backups tiene **Object Lock** habilitado con retención mínima de 30 días. El servidor no puede desactivar la retención, borrar objetos ni sobrescribir una copia existente. | Config + intento de borrado denegado. |
| BCK-22 | M | Credenciales separadas por función: la del servidor solo escribe backups nuevos y no puede borrar ni cambiar Object Lock; la de restore es de solo lectura y se custodia fuera del servidor. El token de admin de R2 no vive en el servidor. | Revisión IAM + tests de denegación. |
| BCK-23 | M | La contraseña de restic y la credencial de restore se custodian en dos ubicaciones offline (gestor de secretos + sobre sellado/escrow), con procedimiento de acceso y rotación. Un simulacro trimestral restaura sin usar el servidor caído ni la laptop de desarrollo. | Checklist de custodia + simulacro. |

### 11.4 Escenarios de desastre

1. **Apagón breve:** arranque automático, WAL, reconciliación; sin restore.
2. **Apagón durante un job:** job `interrupted`, reintento; sin variante parcial.
3. **Disco corrupto:** restaurar DB + originales + releases en disco nuevo.
4. **Servidor robado/perdido:** hardware nuevo, claves del gestor, restore offsite,
   DNS/Tunnel reconfigurados.
5. **Ransomware:** aislar, restaurar desde el backup con Object Lock/offsite,
   rotar claves y verificar que el servidor no podía borrar las copias.
6. **Borrado accidental:** papelera 30 días; si se purgó, restore del backup.
7. **R2 comprometido:** rotar tokens, restaurar originales desde backup, revisar
   integridad.
8. **Cloudflare/DNS caído:** acceso local de emergencia y runbook.

---

## 12. SEO y metadatos

### 12.1 Requisitos

| ID | P | Requisito | Verificación |
|---|---|---|---|
| SEO-01 | M | Todas las páginas públicas canónicas son indexables (`index,follow`) salvo tags < 8, búsqueda, preview y admin. | Crawl + meta. |
| SEO-02 | M | Canonical absoluto sin `www` y sin parámetros, coherente con hreflang. | Crawl. |
| SEO-03 | M | `title` único y descriptivo; `meta description` útil; un solo `h1` por página. | Test. |
| SEO-04 | M | Open Graph y Twitter Card completos; imagen 1200×630 ≤ 300 KB. | Validadores. |
| SEO-05 | M | JSON-LD: `Person`, `WebSite`, `CollectionPage`, `ImageObject`, `VideoObject`, `BreadcrumbList` según página. | Schema validator. |
| SEO-06 | M | Sitemap index + sitemap de páginas + sitemap de imágenes + sitemap de videos. | XML validation. |
| SEO-07 | M | Sitemap solo con URLs 200, canónicas, publicadas y con traducción completa. | Crawl. |
| SEO-08 | M | hreflang ES/EN recíproco + `x-default`; solo pares completos. | Matriz hreflang. |
| SEO-09 | M | Sin redirección automática por idioma; selector visible. | E2E. |
| SEO-10 | M | 404 real con contenido útil; 410 para contenido retirado; 301 para slugs cambiados. | Tests HTTP. |
| SEO-11 | M | `robots.txt` con `max-image-preview:large`, sitemap y sin bloquear assets necesarios; no lista el admin. | Inspección. |
| SEO-12 | M | Paginación con enlaces reales; página 1 canónica; no indexar combinaciones infinitas de filtros. | Crawl. |
| SEO-13 | M | Tags < 8 elementos `noindex,follow`; tags con contenido suficiente indexables. | Test. |
| SEO-14 | M | Imágenes con alt descriptivo, título y contexto; no keyword stuffing. | Revisión. |
| SEO-15 | M | Video: `VideoObject` con thumbnail, duration, uploadDate, contentUrl; poster real. | Validator. |
| SEO-16 | M | RSS válido con últimos publicados; no incluye borradores. | XML validation. |
| SEO-17 | M | Estado vacío: home con contenido editorial, sitemap sin URLs vacías, sin soft-404. | Crawl empty. |
| SEO-18 | M | `lang` correcto (`es`, `en`) y `dir=ltr`; fechas/números localizados. | Inspección. |
| SEO-19 | M | Enlaces internos reales (`<a href>`), sin depender de JS. | Test sin JS. |
| SEO-20 | M | Interenlace con `patriciobet.dev` y `sameAs` en `Person`. | Inspección. |
| SEO-21 | S | IndexNow al publicar; opcional y con fallo silencioso. | Log. |
| SEO-22 | M | Search Console/Bing configurados; sitemap enviado; monitorización de cobertura. | Setup. |
| SEO-23 | M | No se indexan previews, admin, API, búsqueda ni páginas de error. | Crawl. |
| SEO-24 | M | El contenido demo nunca entra al build de producción ni se indexa; si se usa en staging, lleva `noindex` y etiqueta visible. | Revisión + build. |
| SEO-25 | M | Pruebas de SEO en CI: canonical, hreflang, JSON-LD, sitemap, 404/410. | CI. |

### 12.2 Notas

- El SEO de imágenes depende de páginas de detalle reales, no solo del lightbox.
- Los títulos/alt se escriben a mano. No hay IA de metadatos en v1 (`D-26`);
  cualquier sugerencia futura requerirá decisión, DPA y consentimiento.
- No se persiguen rich results como fin; los datos estructurados deben describir
  contenido real.
- El estado vacío no debe generar un sitemap vacío inválido ni una home “en
  construcción” sin valor.

---

## 13. Analítica y privacidad

| ID | P | Requisito | Verificación |
|---|---|---|---|
| PRIV-01 | M | Analítica sin cookies (Cloudflare Web Analytics o equivalente), sin fingerprints ni venta de datos. | Inspección de red. |
| PRIV-02 | M | Sin scripts de publicidad, redes sociales ni trackers de terceros en v1. | Network. |
| PRIV-03 | M | La única cookie propia es la sesión del admin, esencial y `__Host-`. | Cookie audit. |
| PRIV-04 | M | No se muestra banner de cookies si solo hay cookies esenciales; revisar legalmente antes de lanzar. | Legal review. |
| PRIV-05 | M | El formulario de contacto recoge nombre, correo, mensaje y consentimiento; no guarda el mensaje en la DB. | Inspección. |
| PRIV-06 | M | El email del visitante se usa solo para responder; no se añade a listas ni se comparte. | Política. |
| PRIV-07 | M | Logs sin PII innecesaria; IP truncada/hasheada cuando no se necesite completa. | Revisión. |
| PRIV-08 | M | Retención: mensajes en el proveedor de email según su política; logs 30 días; auditoría 1 año. | Config. |
| PRIV-09 | M | Página de privacidad con finalidad, base legal, retención, derechos y contacto. | Legal. |
| PRIV-10 | M | Derechos de acceso/rectificación/supresión: procedimiento documentado y plazo. | Runbook. |
| PRIV-11 | M | Datos de menores: no se publican sin autorización; formulario no dirigido a menores. | Legal. |
| PRIV-12 | M | Proveedores (Cloudflare, email, backups) con DPA y región razonable; documentado. | Legal. |
| PRIV-13 | M | No se envían imágenes a servicios de IA sin decisión explícita y consentimiento documentado (`D-26`). En v1 está desactivado; `RF-A24` es `C`. | Config + inspección. |
| PRIV-14 | M | El admin puede exportar/borrar datos de contacto si el proveedor lo permite. | Runbook. |
| PRIV-15 | M | Cambios de privacidad se registran en el changelog y se comunican si afectan derechos. | Proceso. |

---

## 14. Accesibilidad

Objetivo: **WCAG 2.2 nivel AA** en sitio público y admin.

| ID | P | Requisito | Verificación |
|---|---|---|---|
| A11Y-01 | M | Todo el sitio es navegable por teclado, sin trampas de foco. | Teclado manual + axe. |
| A11Y-02 | M | Foco visible con contraste suficiente; no se elimina el outline sin reemplazo. El foco no queda oculto por cabeceras fijas (scroll padding / inset). | Inspección + test de foco. |
| A11Y-03 | M | Enlace “saltar al contenido” y landmarks (`header`, `nav`, `main`, `footer`). | axe. |
| A11Y-04 | M | Jerarquía de encabezados correcta; un `h1` por página. | axe. |
| A11Y-05 | M | Contraste de texto ≥ 4,5:1 (grande ≥ 3:1) en ambos temas. | axe + manual. |
| A11Y-06 | M | Imágenes con alt significativo; decorativas con alt vacío. | Revisión. |
| A11Y-07 | M | Videos con voz: subtítulos `.vtt` obligatorios antes de publicar. Si hay información visual no conveyida en el audio, se ofrece audiodescripción o texto alternativo (1.2.5 AA). Controles etiquetados. | E2E + manual. |
| A11Y-08 | M | Lightbox: `<dialog>`/role correcto, foco atrapado, Esc, flechas, anuncio SR y retorno de foco. | E2E + SR. |
| A11Y-09 | M | Formularios con labels, instrucciones, errores asociados y `aria-live`. | axe + E2E. |
| A11Y-10 | M | Mensajes de éxito/error no dependen solo del color. | Inspección. |
| A11Y-11 | M | `prefers-reduced-motion` respetado en scroll, 3D, reel y transiciones. | E2E. |
| A11Y-12 | M | Sin autoplay con sonido; el usuario controla media. | E2E. |
| A11Y-13 | M | Áreas táctiles ≥ 44×44 px; no acciones solo hover. | Mobile audit. |
| A11Y-14 | M | Zoom 200 % y 400 % sin pérdida de contenido ni scroll horizontal innecesario. | Manual. |
| A11Y-15 | M | Texto legible, sin imágenes de texto para contenido esencial. | Revisión. |
| A11Y-16 | M | Estados vacíos y errores anunciados y comprensibles. | E2E. |
| A11Y-17 | M | El admin (subida, metadatos, publicación) es usable con teclado y lector. | Manual + axe. |
| A11Y-18 | M | Tablas/listas de datos con encabezados y relaciones correctas. | axe. |
| A11Y-19 | M | Impresión accesible: ficha y foto legibles en blanco y negro. | Print. |
| A11Y-20 | M | Pruebas con axe en CI y revisión manual con NVDA/VoiceOver por release. | Reporte. |
| A11Y-21 | M | Declaración de accesibilidad con limitaciones conocidas, enlazada en el footer y en `/accesibilidad/`. | Página + crawl. |
| A11Y-22 | M | No se usan CAPTCHA inaccesibles; Turnstile tiene alternativa/contacto. | Revisión. |
| A11Y-23 | M | Audiodescripción o texto alternativo para información visual no conveyida en el audio (WCAG 1.2.5 AA). | E2E + revisión de contenido. |
| A11Y-24 | M | El foco no queda oculto por cabeceras fijas o paneles; `scroll-padding` o equivalente asegura que el elemento enfocado sea visible. (WCAG 2.4.11 AA) | Test de foco + inspección. |
| A11Y-25 | M | Toda interacción por arrastre tiene alternativa con botones o teclado (WCAG 2.5.7 AA). | E2E + teclado. |
| A11Y-26 | M | Los mecanismos de ayuda son consistentes en todas las páginas y aparecen en el mismo orden relativo (WCAG 3.2.6 A). | Revisión. |
| A11Y-27 | M | No se pide al usuario que ingrese la misma información dos veces salvo que sea esencial para el resultado (WCAG 3.3.7 A). | Revisión. |
| A11Y-28 | M | La autenticación no exige capacidades cognitivas de prueba (memoria, cálculo, secuencia); las passkeys y recovery codes cumplen (WCAG 3.3.8 AA). | E2E + revisión de flujos. |

---

## 15. Legal y licencias

| ID | P | Requisito | Verificación |
|---|---|---|---|
| LEG-01 | M | Copyright visible: “© Patricio Betancourt. Todos los derechos reservados.” salvo decisión contraria. | Footer. |
| LEG-02 | M | Licencia por elemento (todos los derechos reservados / CC) editable y visible en la ficha. | Test. |
| LEG-03 | M | Sin marca de agua visible por defecto; autoría en metadatos y página de créditos. | Test. |
| LEG-04 | M | No se publican originales ni RAW; solo derivados. | Inspección. |
| LEG-05 | M* | Personas identificables: modelo de autorización/consentimiento antes de publicar. Condicionado a `D-27` (personas identificables). | Checklist. |
| LEG-06 | M* | Menores: autorización de tutor; sin datos sensibles. Condicionado a `D-27`. | Checklist. |
| LEG-07 | M | Lugares privados/propiedad: permiso cuando corresponda. | Checklist. |
| LEG-08 | M | Assets demo: licencia verificada, atribución si aplica, y no se presentan como obra del autor. | Manifest + revisión. |
| LEG-09 | M | Contenido generado por IA: se declara cuando la ley/plataforma lo requiera y no se atribuye como fotografía real. | Manifest + UI. |
| LEG-10 | M | Política de privacidad y términos de uso enlazados en el footer. | Links. |
| LEG-11 | M | Procedimiento de takedown/DMCA o equivalente, con contacto. | Documento. |
| LEG-12 | M | No se venden prints ni licencias en v1; si se añade, revisar impuestos/consentimiento. | Alcance. |
| LEG-13 | M | Fuentes e imágenes con licencia compatible; no usar stock “free” sin verificar términos. | Revisión. |
| LEG-14 | M | Metadatos de autoría/copyright reescritos en derivados; GPS eliminado. | `exiftool`. |
| LEG-15 | M | Accesibilidad y privacidad no se prometen como certificación legal; se declara el esfuerzo razonable. | Legal review. |
| LEG-16 | M | Registro de licencias/atribuciones en `docs/01-producto/legal-privacidad.md` y `assets/demo/manifest.json`. | Inspección. |
| LEG-17 | M | Contacto legal y responsable del tratamiento identificado en la política. | Página. |
| LEG-18 | M | Cambios legales se versionan y se registran. | Changelog. |

---

## 16. Observabilidad y operación

| ID | P | Requisito | Verificación |
|---|---|---|---|
| OPS-01 | M | Logs estructurados JSON con `timestamp`, `level`, `service`, `traceId`, `route`, `status`, `duration`; sin secretos/PII. | Inspección. |
| OPS-02 | M | `traceId` propagado en API, worker, builder y errores mostrados al admin. | Test. |
| OPS-03 | M | Healthchecks: `/health/live`, `/health/ready`, `/health/deps` (DB, Redis, R2). | E2E. |
| OPS-04 | M | Monitor externo (fuera del servidor) para sitio público y admin; alerta si caen. | Config. |
| OPS-05 | M | Heartbeat del backup y de los jobs; alerta si no hay señal en 24 h/1 h. | Test. |
| OPS-06 | M | Alertas a email/Telegram: sitio caído, 5xx, backup fallido, disco > 80 %, cola atascada, Tunnel caído, certificado/TLS. | Test. |
| OPS-07 | M | Dashboard de estado en admin: jobs, errores, R2, DB, disco, memoria, última release, backup. | Inspección. |
| OPS-08 | M | Logs rotados y retenidos 30 días; no llenan el disco. | Config. |
| OPS-09 | M | Métricas de duración de jobs, build, publicación y errores por tipo. | Dashboard. |
| OPS-10 | M | Capacidad: alertas de disco, memoria, CPU, temperatura; presupuesto de crecimiento. | Config. |
| OPS-11 | M | Parches de seguridad mensuales (o críticos inmediatos) con ventana y rollback. | Calendario. |
| OPS-12 | M | Actualizaciones de dependencias e imágenes con lockfile/digest y pruebas. | CI. |
| OPS-13 | M | Mantenimiento programado con aviso y modo 503 si aplica. | Test. |
| OPS-14 | M | Runbooks: apagón, disco lleno, DB caída, Redis caída, R2 403, Tunnel caído, build fallido, backup fallido, passkey perdida, incidente. | Documentos. |
| OPS-15 | M | SLO interno: sitio público 99 % mensual (sin UPS), admin best-effort; se mide y se reporta. | Reporte. |
| OPS-16 | M | Postmortem sin culpa para incidentes P1/P2; acciones con dueño y fecha. | Documento. |
| OPS-17 | M | El sitio puede servir la última release aunque el admin/DB estén caídos. | Test. |
| OPS-18 | M | El admin muestra una página de mantenimiento clara si la DB no está lista. | Test. |
| OPS-19 | M | Monitorización de la cola: jobs pendientes, fallidos, reintentos, edad del más antiguo. | Dashboard. |
| OPS-20 | M | Alertas de seguridad: login fallido repetido, recovery code usado, cambio de passkey, purga, restore. | Test. |
| OPS-21 | M | Registro de builds con duración, commit, versión y estado. | Inspección. |
| OPS-22 | M | Registro de releases con rollback y verificación. | Inspección. |
| OPS-23 | M | Documentación de la topología y dependencias externas actualizada. | Revisión. |
| OPS-24 | M | Prueba sintética de publicación (subida pequeña → live) antes de cada release. | CI/manual. |
| OPS-25 | M | El operador (Patricio) tiene un checklist de “sitio caído” de 5 minutos. | Runbook. |
| OPS-26 | S | Página de estado pública con últimos incidentes. | Futuro. |
| OPS-27 | M | No se depende de la laptop de desarrollo para operar el servidor. | Inspección. |
| OPS-28 | M | Reloj NTP y zonas horarias correctas en logs, publicación y backups. | Config. |
| OPS-29 | M | Los errores del worker muestran la etapa exacta y un enlace al log seguro. | Inspección. |
| OPS-30 | M | Capacidad de video: si el servidor no puede con 4K, se rechaza con mensaje claro o se encola, no se cae. | Test de carga. |

---

## 17. Fuentes, versiones y verificación de servicios

### 17.1 Política de versiones

| ID | P | Requisito | Verificación |
|---|---|---|---|
| VER-01 | M | Usar la última versión estable de cada dependencia al iniciar; fijarla con lockfile. | `pnpm-lock.yaml`. |
| VER-02 | M | Imágenes Docker fijadas por digest, no por `latest` flotante. | Compose/CI. |
| VER-03 | M | Registrar versiones efectivas en `docs/03-arquitectura/versiones.md` al implementar. | Documento. |
| VER-04 | M | Verificar precios, cuotas y límites de Cloudflare/R2/Access/Tunnel/Turnstile/Workers antes de contratar. | Checklist. |
| VER-05 | M | Verificar licencia vigente de GSAP y de cualquier plugin antes de usarlo comercialmente. | Legal. |
| VER-06 | M | Verificar soporte HEIC de libvips/sharp antes de prometerlo; si no, rechazar con mensaje. | Spike. |
| VER-07 | M | Verificar soporte de navegadores (últimas 2 versiones + iOS Safari 16+) y degradación. | Matriz. |
| VER-08 | M | Verificar el certificado de Cloudflare para subdominios de un nivel; no asumir comodines profundos. | DNS/TLS. |
| VER-09 | M | Verificar el proveedor de email (SPF/DKIM/DMARC, límites, coste). | Test de entrega. |
| VER-10 | M | Generar SBOM y registrar licencias de dependencias. | CI. |
| VER-11 | M | No hardcodear versiones en el SRS; las decisiones concretas van en ADR/lockfile. | Revisión. |
| VER-12 | M | Revisar que las fuentes citadas sigan vigentes antes de cada release mayor. | Checklist. |

### 17.2 Fuentes de referencia

- Cloudflare: documentación de Tunnel, Access, R2, Turnstile, WAF, cache rules,
  límites y precios.
- Astro, React, Vite, NestJS, Drizzle, PostgreSQL, Redis, BullMQ, sharp, FFmpeg,
  Caddy, restic.
- Pagefind, PhotoSwipe, GSAP, Three.js, hls.js.
- Google Search Central: imágenes, video, hreflang, datos estructurados,
  Core Web Vitals.
- W3C: WCAG 2.2, HTML, ARIA.
- MDN: WebAuthn, CSP, cookies, `__Host-`.
- IPTC/C2PA para procedencia de assets (ver `assets/demo/README.md`).
- Unsplash/Pexels/Pixabay/Coverr/Mixkit/Openverse: licencias y términos; verificar
  clip por clip.

---

## 18. Despliegue en servidor propio

### 18.1 Hardware y sistema

| ID | P | Requisito | Verificación |
|---|---|---|---|
| DEP-01 | M | Servidor: mínimo 4 vCPU, **8 GB RAM** (ideal 16 GB), 60 GB SSD; 4 GB o menos impide el pipeline de video (`D-23`). | Inventario. |
| DEP-02 | M | **Ubuntu Server LTS único objetivo**; Windows no soportado en v1 (`D-24`). | `lsb_release`. |
| DEP-03 | M | Disco con **LUKS2 + TPM2 auto-unlock** (`D-28`); ext4; volumen separado para datos; `noatime`. | `lsblk`, `systemd-cryptenroll`. |
| DEP-04 | M | Batería del laptop en buen estado; si existe, actúa como UPS temporal y permite shutdown limpio al 10 %. | Test. |
| DEP-05 | M | BIOS: “Restore on AC power loss” = Power On; arranque desde disco interno; password de BIOS. | Test de corte. |
| DEP-06 | M | Red por Ethernet si es posible; IP local fija; NTP; DNS interno. | `ip a`, `timedatectl`. |
| DEP-07 | M | UFW activo; sin puertos HTTP/SSH públicos; solo Tunnel saliente. | `ufw status`, `nmap`. |
| DEP-08 | M | Docker Engine + Compose plugin; usuario de despliegue no root; Docker habilitado al arranque. | `systemctl`. |
| DEP-09 | M | Cloudflare Tunnel como servicio systemd/contenedor con token; reconexión automática. | `systemctl status`. |
| DEP-10 | M | DNS: `photo`, `admin-photo`, `cdn-photo` proxied; TLS válido; HSTS. | `dig`, curl. |
| DEP-11 | M | El servidor no depende de la laptop de desarrollo para arrancar ni servir. | Test. |
| DEP-12 | M | El servidor arranca sin login manual; LUKS auto-desbloquea por TPM2. Fallback manual documentado (indisponibilidad hasta 5 min; `D-28`). | Test de corte + test TPM. |
| DEP-13 | M | El sitio público se sirve desde `releases/` con `current` atómico; Caddy no sirve una release incompleta. | Test. |
| DEP-14 | M | Se conservan las 3 últimas releases; rollback en un comando y en el admin. | Test. |
| DEP-15 | M | Si no hay release válida, Caddy sirve una página 503 de mantenimiento, no un directorio vacío. | Test. |
| DEP-16 | M | `410 Gone` y redirects 301 se resuelven con un mapa generado/Caddy; probados. | Test HTTP. |
| DEP-17 | M | Cabeceras de seguridad en Caddy/API; CSP Report-Only → enforce. | securityheaders. |
| DEP-18 | M | Caché: HTML `max-age=0, must-revalidate`; assets hash `immutable`; purga al publicar. | Headers. |
| DEP-19 | M | Build corre en el servidor con límites de CPU/memoria; si falla, no toca `current`. | Test. |
| DEP-20 | M | Migraciones de DB antes de arrancar la API nueva; backup previo; rollback documentado. | Runbook. |
| DEP-21 | M | Secretos en `.env` con `600` o Docker secrets; no en git; rotación documentada. | Inspección. |
| DEP-22 | M | Backups configurados y probados antes de abrir al público. | Test. |
| DEP-23 | M | Monitor externo configurado; alertas probadas. | Test. |
| DEP-24 | M | Logs rotados; disco monitorizado; alerta al 80 %. | Config. |
| DEP-25 | M | Actualizaciones de seguridad y ventana de mantenimiento documentadas. | Calendario. |
| DEP-26 | M | Runbook de recuperación a hardware nuevo con tiempos medidos. | Simulacro. |
| DEP-27 | M | El servidor no expone `.env`, `.git`, backups, DB ni puertos de administración. | Escaneo. |
| DEP-28 | M | Cloudflare Access configurado antes de exponer el admin. | Test. |
| DEP-29 | M | Prueba de publicación end-to-end ≤ 3 min para foto. | Cronómetro. |
| DEP-30 | M | Prueba de corte de energía en cada release mayor. | Reporte. |

### 18.2 Secuencia de despliegue

1. Instalar Ubuntu Server, actualizar, crear usuario de despliegue, LUKS, UFW,
   NTP, Docker, Cloudflare Tunnel.
2. Clonar el repo en `/srv/photo/app` (sin `.env`), crear `.env` desde
   `.env.example`, generar secretos, permisos `600`.
3. `docker compose build`, migraciones, `docker compose up -d`, healthchecks.
4. Crear admin/passkeys por CLI; verificar Access + passkey.
5. Configurar R2 buckets, CORS, lifecycle, tokens; probar subida.
6. Configurar Caddy, releases, `current`, headers, 410/redirects.
7. Configurar Cloudflare DNS/Tunnel/Access/WAF/Turnstile/cache.
8. Primer build con 0 medios; verificar home/listados vacíos, sitemap, RSS, 404.
9. Publicar un asset demo; verificar pipeline, variantes, OG y rollback.
10. Configurar restic + offsite; ejecutar backup y restore de prueba.
11. Configurar monitor externo, alertas, dashboard; probar apagón.
12. Checklist de lanzamiento y tag `v1.0.0`.

### 18.3 Prueba de apagón

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | Subir una foto y empezar procesamiento. | Job `processing`. |
| 2 | Cortar energía abruptamente. | Servidor se apaga. |
| 3 | Restaurar energía. | BIOS arranca, systemd/Docker levantan. |
| 4 | Esperar healthchecks. | Postgres recupera WAL; Caddy sirve última release. |
| 5 | Revisar job. | `interrupted`/`queued`, sin variante parcial. |
| 6 | Reintentar/reanudar. | Job termina; no duplica. |
| 7 | Revisar DB/originales. | Sin corrupción; checksums OK. |
| 8 | Medir RTO. | ≤ 4 h (ideal < 15 min para sitio público). |

### 18.4 Recuperación en hardware nuevo

1. Conseguir hardware equivalente o mejor.
2. Instalar Ubuntu Server, Docker, Cloudflare Tunnel, claves del gestor.
3. Clonar repo, restaurar `.env`/secretos desde el gestor.
4. Restaurar PostgreSQL desde restic.
5. Verificar originales en R2; restaurar releases o reconstruir.
6. Apuntar DNS/Tunnel al nuevo servidor.
7. Smoke tests, headers, passkey, publicación, backups.
8. Documentar tiempos reales y brechas.

---

## 19. Criterios de aceptación y verificación

### 19.1 Definition of Done

Un requisito está terminado cuando:

- cumple su criterio de aceptación y los casos de error/vacío;
- tiene pruebas automatizadas o evidencia manual documentada;
- pasa CI (lint, tipos, unit, integración, build, e2e, secret scan);
- tiene revisión independiente y QA;
- cumple accesibilidad, i18n y rendimiento;
- no introduce secretos ni datos personales;
- actualiza docs y trazabilidad;
- tiene rollback documentado;
- fue aprobado en el gate correspondiente.

### 19.2 Gates de release

1. **Gate de documentación:** SRS v1.1 aprobado, UX y arquitectura revisadas.
2. **Gate de seguridad:** threat model, headers, auth, uploads, host hardening,
   escaneo externo y checklist sin P1.
3. **Gate de rendimiento:** Lighthouse/CWV dentro de presupuesto.
4. **Gate de accesibilidad:** axe + teclado + lector + WCAG AA.
5. **Gate de SEO:** sitemaps, hreflang, JSON-LD, 404/410, canonical.
6. **Gate de resiliencia:** apagón, restore, rollback, disco lleno.
7. **Gate de operación:** backups, monitorización, alertas, runbooks.
8. **Gate de UAT:** usuario aprueba flujos y manuales.

### 19.3 Escenarios de aceptación

| ID | Escenario | Criterio |
|---|---|---|
| AC-01 | Sitio con 0 medios. | Home/listados vacíos completos; sitemap/RSS válidos; 404; sin errores. |
| AC-02 | Publicar primera foto. | Subida → variantes → metadatos → publish → live ≤ 3 min. |
| AC-03 | Foto con EXIF GPS/orientación. | Orientación correcta; GPS ausente; autoría presente. |
| AC-04 | Foto panorámica/vertical/cuadrada. | Sin deformación ni CLS. |
| AC-05 | Video 1080p 2 min. | Renditions, poster, reproducción, pesos; ≤ 10 min de proceso. |
| AC-06 | Video > 3 min. | HLS y selector de calidad. |
| AC-07 | Upload interrumpido por cierre de navegador. | Reanudar/descartar; sin duplicados. |
| AC-08 | Apagón durante procesamiento. | Job reconciliado; sin variante parcial. |
| AC-09 | Apagón durante build. | `current` intacto; build fallido visible. |
| AC-10 | Rollback. | 3 releases; un clic; sitio vuelve. |
| AC-11 | Despublicar. | 410/301; fuera de listados/sitemap/RSS; contenido `trashed` oculto. |
| AC-12 | Login sin Access o sin passkey. | Rechazado; no hay bypass. |
| AC-13 | JWT Access inválido/expirado. | 401; no se confía en Tunnel. |
| AC-14 | Sesión inactiva 30 min / absoluta 12 h. | Expira; reauth para destructivo. |
| AC-15 | Pérdida de passkey. | Recovery code; registrar nueva; revocar vieja. |
| AC-16 | Escaneo externo de puertos. | Solo 443 Cloudflare; 80 bloqueado; IP directa no responde ni banner. |
| AC-17 | Headers/TLS. | A/A+ securityheaders/Observatory; HSTS. |
| AC-18 | Admin noindex/no enlazado. | `X-Robots-Tag`, sin links, no en robots. |
| AC-19 | Upload malicioso. | Rechazado; sin ejecución; log. |
| AC-20 | FFmpeg con playlist remota. | Rechazado; sin red. |
| AC-21 | Contacto spam/rate limit. | Turnstile/honeypot; 3/IP/h; mensaje claro. |
| AC-22 | Lightbox teclado/SR. | Foco atrapado, Esc, flechas, retorno. |
| AC-23 | Video teclado/captions. Controles accesibles; `.vtt` presentes y sincronizados; `prefers-reduced-motion` respetado. | E2E + manual. |
| AC-24 | Reduced motion/Save-Data/WebGL. Estático; sin autoplay/3D; `prefers-reduced-motion` desactiva transiciones; sin WebGL. | E2E. |
| AC-25 | Lighthouse móvil. | Home ≥ 90; galerías/detalle ≥ 95; CWV. |
| AC-26 | SEO. | Sitemap imágenes/videos, hreflang, JSON-LD válidos. |
| AC-27 | Tag < 8. | `noindex,follow`. |
| AC-28 | 404/301. | Códigos reales; redirects. |
| AC-29 | Búsqueda ES/EN. | Índice correcto; sin mezclar idiomas. |
| AC-30 | Backup/restore DB. | Restore en limpio; datos íntegros. |
| AC-31 | Restore completo en hardware nuevo. | Sitio + admin + medios; RTO ≤ 4 h. |
| AC-32 | Disco lleno. | Alerta; jobs fallan con causa; sitio sigue. |
| AC-33 | R2 caído. | Admin muestra error; sitio sirve caché; no corrupción. |
| AC-34 | Redis caído. | API sigue para lectura; jobs se encolan al volver. |
| AC-35 | Admin móvil. | Subida y metadatos usables. |
| AC-36 | i18n incompleto. | Página EN no se genera; no hreflang. |
| AC-37 | Accesibilidad. | axe + teclado + SR sin P1/P2. |
| AC-38 | Impresión. | Foto + ficha legibles. |
| AC-39 | Assets demo. | Manifest, licencia, reemplazo, sin atribución falsa. |
| AC-40 | Lanzamiento. | Checklist completo; contenido real; **sitio vacío** (sin demo); backups verificados; sin `is_demo=true` en build. |

### 19.4 Evidencia

Cada AC se registra en `docs/04-calidad/reportes/` con:

- fecha, commit, entorno;
- pasos reproducibles;
- resultado esperado/observado;
- capturas o logs sin secretos;
- responsable (agente);
- decisión (pasa/falla/bloquea).

### 19.5 Pruebas mínimas por release

- Unit + integración + E2E.
- Seguridad: OSV, Trivy, Semgrep, ZAP baseline, escaneo externo.
  - `gitleaks` pre-commit + CI: **planificado, no activo** (`SEG-40`); pendiente
    de configuración de remoto y `.gitleaks.toml`.
- Rendimiento: Lighthouse, bundle, imágenes, video, TTFB.
- Accesibilidad: axe, teclado, lector, `prefers-reduced-motion`.
- SEO: crawl, sitemap, hreflang, JSON-LD, 404/410.
- Resiliencia: apagón, restore, rollback, disco lleno.
- UAT de flujos principales y estados vacíos.

---

## 20. Roadmap, riesgos y control de cambios

### 20.1 Prioridades

- **v1:** todos los M; S seleccionados si no comprometen M.
- **S candidatos:** Pagefind, share, HLS, hover preview, programar publicación,
  export, mantenimiento, View Transitions, PWA? (no), PiP.
- **M elevados a S:** RSS (`RF-P46`); galería 3D (`RF-P53`); hover preview (`RF-P60`),
  programar (`RF-P62`), export (`RF-P63`).
- **M movidos a S:** Pagefind (`RF-P27`); cursor personalizado (`RF-A27`).
- **C diferidos:** zoom por teselas, AV1/VP9, P3, IA de metadatos (`RF-A24`).
- **Requisitos condicionados a decisión abierta:** ver tabla §1.7 y matriz de
  condicionales (`D-10`, `D-11`, `D-27`).

### 20.2 Fases

| Fase | Entregable | Gate |
|---|---|---|
| 0 | SRS v1.2, decisiones (D-23–D-30), riesgos, plan, repo | Aprobación del usuario |
| 1 | UX: sitemap, flujos, wireframes, prototipo, design system | Prototipo aprobado |
| 2 | Arquitectura, datos, OpenAPI, seguridad, backups, test plan | Revisión técnica/seguridad |
| 3 | Fundaciones, auth (passkey CLI+UI), CI, Docker | Login/passkey E2E |
| 4 | Fotos | Pipeline + presupuestos |
| 5 | Videos | Pipeline + sandbox (worker 2 GB RAM) |
| 6 | Sitio público | Lighthouse/SEO/E2E + WCAG AA |
| 7 | Admin/publicación | ≤ 3 min + concurrencia + trashed |
| 8 | Contacto/hardening | Fallbacks + WCAG + CSP |
| 9 | Despliegue/backups/monitorización | Producción + Object Lock + restore |
| 10 | UAT/manuales/release | `v1.0.0` + lanzamiento vacío |

### 20.3 Riesgos

Ver [`riesgos.md`](riesgos.md). Los principales: apagón sin UPS, pérdida de datos,
acceso no autorizado, hardware antiguo, disco lleno, assets demo, SEO, CWV y
alcance.

### 20.4 Decisiones abiertas

Ver sección 1.7 y [`decisiones.md`](decisiones.md). Las bloqueantes para
implementar: hardware/OS (`D-23/24`), correo y proveedor (`D-10`), licencia
(`D-11`), personas identificables (`D-27`), colecciones y demo al lanzar (`D-25`).
Las decisiones D-23 a D-30 están registradas y pendientes de aprobación del usuario.

### 20.5 Control de cambios

- Cambios de requisitos: issue + rama `docs/srs-*` + revisión + actualización de
  trazabilidad.
- Cambios de arquitectura: ADR nuevo o superseded, nunca editar el ADR anterior
  sin marcar historial.
- Cambios de alcance: aprobación explícita del usuario.
- Cambios de seguridad: revisión de security + prueba de regresión.
- Cambios de API: OpenAPI primero, contract tests, versión si es breaking.
- Cambios de datos: migración reversible + backup + prueba en staging.

### 20.6 Aprobación

Este SRS v1.2 se considera aprobado cuando:

- el usuario aprueba las decisiones D-23 a D-30 y confirma las correcciones del Gate 0;
- no hay contradicciones entre secciones;
- la matriz de trazabilidad cubre los 438 requisitos (429 originales + 9 nuevos);
- arquitectura y UX pueden derivarse sin ambigüedad;
- security y QA revisan la versión;
- re-revisión independiente confirma cierre de P1 y P2.

Firma: ______________________  Fecha: __________





