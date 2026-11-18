# Actores y casos de uso

**Estado:** borrador para aprobación
**Fase:** 01 — Producto
**Fecha:** 17 de noviembre de 2026
**Fuente:** [`SRS v1.1`](../00-gestion/srs-v1.1.md), secciones 1.5, 2, 4, 5, 19 y 20
**No introduce requisitos nuevos.** Si un caso de uso necesita algo que el SRS no
tiene, se detiene y se actualiza el SRS primero.

---

## 1. Propósito

Traducir los requisitos del SRS a casos de uso verificables, con actor, flujo,
errores y criterio de aceptación. Este documento es la base de:

- las pruebas E2E de `tests/e2e/`;
- el plan de UAT de `docs/04-calidad/plan-uat.md`;
- el copy y los estados de la fase de UX;
- la estimación de los sprints S3–S10.

---

## 2. Actores

| Actor | Quién es | Puede | No puede | Requisitos |
|---|---|---|---|---|
| Visitante | Público, reclutadores, clientes, otros fotógrafos. | Leer, navegar, buscar, cambiar idioma/tema, enviar el formulario. | Escribir, ver borradores, acceder al admin, descargar originales. | `RF-P01`–`RF-P93`, `AC-01`–`AC-07`, `AC-21`–`AC-29`, `AC-36`–`AC-39` |
| Administrador | Patricio, único admin. | Subir, organizar, publicar, despublicar, reprocesar, restaurar, auditar. | Saltarse Access/passkey, publicar sin metadatos, borrar sin reauth. | `RF-A01`–`RF-A50`, `AC-07`–`AC-15`, `AC-30`–`AC-35`, `AC-39` |
| Rastreador | Googlebot, Bingbot, bots de OG/Twitter. | Crawlear páginas indexables, sitemaps y feeds. | Ver admin, previews privadas, borradores o demo. | `RF-P01`–`RF-P09`, `SEO-01`–`SEO-30` |
| Atacante | Automatizado o manual. | Intentar lo que cualquier cliente externo puede intentar. | Entrar sin Access + passkey, subir archivos, ejecutar código, enumerar el admin. | `SEG-01`–`SEG-47`, `AC-12`–`AC-20` |
| Operador | systemd, Docker, Tunnel, backups, monitor. | Arrancar, reconciliar, respaldar, restaurar, alertar. | Cambiar contenido sin pasar por el admin. | `OPS-01`–`OPS-30`, `BCK-01`–`BCK-20`, `DEP-01`–`DEP-30` |

El visitante y el rastreador son **solo lectura**. No hay cuentas de visitante, comentarios,
"me gusta", carrito ni descargas de originales en v1 (`RF-P37`, `LEG-12`).

---

## 3. Convenciones

- **Precondición:** estado necesario antes de empezar.
- **Flujo principal:** camino esperado, sin errores.
- **Alternos:** variantes válidas (vacío, sin resultados, sin JS).
- **Errores:** lo que puede fallar y cómo se recupera.
- **Postcondición:** estado verificable al terminar.
- **Evidencia:** cómo se prueba, no solo que "funciona".

Todo caso de uso debe funcionar con el sitio **vacío** salvo que su naturaleza
implique contenido (p. ej. abrir una foto concreta).

---

## 4. Catálogo resumido

| ID | Caso de uso | Actor | Resultado | SRS | AC |
|---|---|---|---|---|---|
| CU-01 | Entender la home en 5 s. | Visitante | Identidad, hero, CTAs. | `RF-P10`, `RF-P14` | `AC-01`, `AC-25` |
| CU-02 | Recorrer galería y abrir una foto. | Visitante | Listado → detalle → lightbox. | `RF-P20`–`RF-P34` | `AC-02`, `AC-04`, `AC-22` |
| CU-03 | Ver un video adaptado a su conexión. | Visitante | Poster → reproducción → calidad. | `RF-P50`–`RF-P58` | `AC-05`, `AC-06`, `AC-23` |
| CU-04 | Buscar o filtrar. | Visitante | Resultados reales o estado sin resultados. | `RF-P22`, `RF-P60`–`RF-P63` | `AC-29` |
| CU-05 | Contactar. | Visitante | Mensaje enviado o error recuperable. | `RF-P71`–`RF-P75` | `AC-21` |
| CU-06 | Cambiar idioma y tema. | Visitante | Página equivalente; preferencia guardada. | `RF-P16`, `RF-P41`–`RF-P45` | `AC-36` |
| CU-07 | Compartir una pieza. | Visitante | OG/Twitter correctos; enlace copiado. | `RF-P35`, `SEO-10`–`SEO-19` | `AC-26` |
| CU-08 | Iniciar sesión. | Admin | Access + passkey; sesión `__Host-`. | `RF-A01`–`RF-A06` | `AC-12`–`AC-14` |
| CU-09 | Subir archivos. | Admin | Cola, progreso, reanudación. | `RF-A10`–`RF-A17` | `AC-07`, `AC-19` |
| CU-10 | Completar metadatos y organizar. | Admin | Borrador listo para publicar. | `RF-A20`–`RF-A29` | `AC-02`, `AC-03` |
| CU-11 | Publicar, despublicar y borrar. | Admin | Build, 301/410, papelera. | `RF-A30`–`RF-A38` | `AC-09`–`AC-11` |
| CU-12 | Reprocesar. | Admin | Nuevas variantes sin romper URLs. | `RF-A40` | `AC-02`, `AC-08` |
| CU-13 | Revisar estado y auditoría. | Admin | Dashboard y actividad. | `RF-A41`, `RF-A42`, `OPS-07` | `AC-32`–`AC-34` |
| CU-14 | Ver el sitio vacío. | Visitante | Estados vacíos editoriales. | `RF-P06`–`RF-P09` | `AC-01` |
| CU-15 | Cargar/descargar demo. | Admin | Demo aislado, sin atribución falsa. | `RF-P90`–`RF-P93`, `RF-A47` | `AC-39` |
| CU-16 | Recuperar el acceso. | Admin | Recovery code, nueva passkey. | `RF-A03`, `RF-A49` | `AC-15` |
| CU-17 | Recuperar el servicio tras un apagón. | Operador | Arranque y reconciliación. | `OPS-01`–`OPS-30`, `DEP-12` | `AC-08`, `AC-09` |
| CU-18 | Restaurar desde backup. | Operador | Sitio y datos íntegros. | `BCK-01`–`BCK-20` | `AC-30`, `AC-31` |

---

## 5. Detalle: visitante

### CU-01 — Entender la home

| Campo | Contenido |
|---|---|
| **Precondición** | Ninguna; funciona con 0 medios. |
| **Flujo principal** | 1. Abre `/`. 2. Ve nombre, disciplina, una línea de enfoque y CTAs. 3. Elige "Ver fotos", "Ver videos" o "Sobre mí". |
| **Alternos** | Sin WebGL/Save-Data/reduced-motion: fondo estático. Sin JS: el contenido y los enlaces siguen. Con 0 medios: estado vacío editorial. |
| **Errores** | Imagen de hero no carga: degradado de marca, sin icono roto. |
| **Postcondición** | El visitante sabe quién es el autor y cómo explorar el trabajo. |
| **Evidencia** | Test de 5 s con 5 personas; Lighthouse; E2E con DB vacía. |

### CU-02 — Recorrer galería y abrir una foto

| Campo | Contenido |
|---|---|
| **Precondición** | Al menos una foto publicada (si no, CU-14). |
| **Flujo principal** | 1. Abre `/fotos/`. 2. Filtra u ordena. 3. Pulsa una miniatura. 4. Lee la ficha. 5. Amplía en lightbox. 6. Navega con flechas. 7. Cierra con Esc. |
| **Alternos** | Filtros sin resultados: explicación y "quitar filtros". Foto retirada: 410. Slug cambiado: 301. |
| **Errores** | Variante no disponible: fallback de marca + ficha. Imagen lenta: placeholder con proporción; CLS 0. |
| **Postcondición** | El foco vuelve a la miniatura que abrió el lightbox. |
| **Evidencia** | E2E teclado + lector; `AC-04`, `AC-22`; test HTTP de 301/410. |

### CU-03 — Ver un video

| Campo | Contenido |
|---|---|
| **Precondición** | Video procesado con poster y al menos una rendition. |
| **Flujo principal** | 1. Abre `/videos/{slug}/`. 2. Ve poster y duración. 3. Pulsa play. 4. Cambia calidad si hace falta. 5. Activa subtítulos si existen. |
| **Alternos** | `prefers-reduced-motion`/Save-Data: sin preview ni autoplay. Safari/iOS: reproducción nativa. Video > 3 min: HLS con selector. |
| **Errores** | Video no listo: poster + estado + enlace alternativo. Codec no soportado: enlace de descarga del derivado permitido o mensaje. |
| **Postcondición** | El video no se descargó completo antes de la interacción (`RF-P58`). |
| **Evidencia** | Network test; `AC-05`, `AC-06`, `AC-23`. |

### CU-04 — Buscar o filtrar

| Campo | Contenido |
|---|---|
| **Precondición** | Índice Pagefind generado por idioma. |
| **Flujo principal** | 1. Abre `/buscar/`. 2. Escribe una consulta. 3. Ve resultados con tipo y extracto. 4. Abre uno. |
| **Alternos** | Sin consulta: sugerencias. Sin resultados: explicación y enlaces. Pagefind no carga: navegación normal. |
| **Errores** | Índice desactualizado: se reconstruye en el build; no se muestra contenido despublicado. |
| **Postcondición** | La búsqueda no mezcla ES/EN ni indexa borradores. |
| **Evidencia** | `AC-29`; crawl de `noindex,follow` en `/buscar/`. |

### CU-05 — Contactar

| Campo | Contenido |
|---|---|
| **Precondición** | Worker de contacto y Turnstile configurados. |
| **Flujo principal** | 1. Abre `/contacto/`. 2. Completa nombre, correo, mensaje y consentimiento. 3. Envía. 4. Ve confirmación accesible. |
| **Alternos** | Sin JS: formulario nativo con validación y respuesta del servidor. Turnstile no carga: alternativa por correo autorizado. |
| **Errores** | Validación: error junto al campo y foco. Rate limit: mensaje claro. Red: conserva el texto y ofrece reintento. |
| **Postcondición** | Se envía un correo; el mensaje **no** se guarda en la DB (`PRIV-05`). |
| **Evidencia** | `AC-21`; E2E de error y reintento; revisión de red. |

### CU-06 — Cambiar idioma y tema

| Campo | Contenido |
|---|---|
| **Precondición** | Traducción EN completa del elemento para generar su página. |
| **Flujo principal** | 1. Pulsa EN. 2. Llega a la página equivalente en `/en/`. 3. Pulsa el tema. 4. Se aplica sin flash. |
| **Alternos** | Sin traducción EN: el enlace no se ofrece; no hay página a medias. Sin JS: el tema sigue el sistema. |
| **Errores** | Preferencia corrupta en `localStorage`: vuelve al sistema sin romper. |
| **Postcondición** | Preferencia de tema guardada sin cookies; idioma sin redirección automática. |
| **Evidencia** | `AC-36`; E2E de hreflang recíproco; inspección de cookies. |

### CU-07 — Compartir una pieza

| Campo | Contenido |
|---|---|
| **Precondición** | Página publicada con OG image 1200×630. |
| **Flujo principal** | 1. Pulsa "Compartir". 2. Web Share API o copiar enlace. 3. El enlace pegado muestra título, descripción e imagen. |
| **Alternos** | Sin Web Share: copiar enlace con confirmación. |
| **Errores** | Portapapeles bloqueado: selecciona el texto para copiar manualmente. |
| **Postcondición** | La vista previa social no muestra borradores ni demo no autorizado. |
| **Evidencia** | Validador OG/Twitter; `AC-26`. |

### CU-14 — Ver el sitio vacío

| Campo | Contenido |
|---|---|
| **Precondición** | 0 medios publicados. |
| **Flujo principal** | 1. Abre `/`. 2. Ve hero, estado vacío editorial, about y contacto. 3. Abre `/fotos/` y `/videos/`. 4. Comprueba sitemap, RSS y 404. |
| **Alternos** | Solo fotos, solo videos, una colección o un elemento: el layout no se rompe. |
| **Errores** | Ninguno: el vacío es un estado válido, no un error. |
| **Postcondición** | No hay soft-404, spinner infinito, cuadrícula vacía ni "en construcción". |
| **Evidencia** | `AC-01`; build con DB vacía; captura ES/EN. |

---

## 6. Detalle: administrador

### CU-08 — Iniciar sesión

| Campo | Contenido |
|---|---|
| **Precondición** | Identidad autorizada en Access; al menos una passkey registrada por CLI. |
| **Flujo principal** | 1. Abre `admin-photo.patriciobet.dev`. 2. Access autentica. 3. La app valida el JWT. 4. Pulsa "Usar passkey". 5. WebAuthn verifica. 6. Sesión `__Host-`. |
| **Alternos** | Dispositivo perdido: recovery code de un solo uso. |
| **Errores** | Sin Access: 403 genérico. JWT inválido: 401. Passkey fallida: mensaje genérico + rate limit + alerta. |
| **Postcondición** | Sesión de 30 min de inactividad / 12 h absolutas; se revoca al cerrar. |
| **Evidencia** | `AC-12`–`AC-14`; tests de cookie y JWT. |

### CU-09 — Subir archivos

| Campo | Contenido |
|---|---|
| **Precondición** | Sesión válida; R2 y worker disponibles. |
| **Flujo principal** | 1. `/media/new`. 2. Arrastra hasta 20 archivos. 3. Validación previa. 4. Subida multiparte con progreso. 5. Job en cola. 6. Estado listo o error. |
| **Alternos** | Cierra el navegador: al volver, reanudar o descartar. Reinicio del servidor: sesión y partes persisten. Duplicado: avisa, no bloquea. |
| **Errores** | Tipo/tamaño: motivo exacto. R2 caído: reintento sin perder el original. Job fallido: causa + `traceId`. |
| **Postcondición** | Un archivo procesado y listo, sin duplicados por reintento. |
| **Evidencia** | `AC-07`, `AC-19`; tests de idempotencia y apagón. |

### CU-10 — Completar metadatos

| Campo | Contenido |
|---|---|
| **Precondición** | Archivo en estado listo. |
| **Flujo principal** | 1. Abre el detalle. 2. Completa ES y EN. 3. Ajusta punto focal. 4. Asigna colección, etiquetas, licencia. 5. Guarda. |
| **Alternos** | Edición por lotes; reordenar con teclado o arrastre. |
| **Errores** | Conflicto de versión: aviso, no pisa. Falta alt ES: no permite publicar. Slug duplicado: sugiere otro. |
| **Postcondición** | Borrador válido y publicable; GPS ausente. |
| **Evidencia** | `AC-02`, `AC-03`; test de dos pestañas. |

### CU-11 — Publicar, despublicar y borrar

| Campo | Contenido |
|---|---|
| **Precondición** | Metadatos válidos y procesamiento listo. |
| **Flujo principal** | 1. "Publicar". 2. Build en cola. 3. `current` cambia al final. 4. Purga de caché, sitemap y RSS. |
| **Alternos** | Cambios en 60 s: un solo build. Rollback a una de las 3 últimas releases. Despublicar: 410 o 301. |
| **Errores** | Build falla: `current` intacto, logs y `traceId`. Disco lleno: mensaje y alerta. |
| **Postcondición** | Versión viva coherente; lo despublicado fuera de listados, feeds, sitemap y búsqueda. |
| **Evidencia** | `AC-09`–`AC-11`; medición ≤ 3 min. |

### CU-12 — Reprocesar

| Campo | Contenido |
|---|---|
| **Precondición** | Elemento existente con derivados. |
| **Flujo principal** | 1. Selecciona uno o varios. 2. "Reprocesar". 3. Job idempotente. 4. Al completar, cambia la referencia de forma atómica. |
| **Alternos** | Falla a medias: la versión publicada sigue viva. |
| **Errores** | Nuevo set incompleto: no se publica parcial. |
| **Postcondición** | URLs estables; original intacto. |
| **Evidencia** | `AC-08`; test de idempotencia. |

### CU-13 — Revisar estado y auditoría

| Campo | Contenido |
|---|---|
| **Precondición** | Sesión válida. |
| **Flujo principal** | 1. Dashboard. 2. Revisa jobs, build, backup, disco y seguridad. 3. Abre actividad y filtra/exporta. |
| **Alternos** | Alertas persistentes para backup fallido, disco > 80 %, cola atascada. |
| **Errores** | Métrica no disponible: "sin datos", no un cero engañoso. |
| **Postcondición** | El admin conoce el estado sin leer logs del servidor. |
| **Evidencia** | `AC-32`–`AC-34`; inspección de dashboard. |

### CU-15 — Cargar/descargar demo

| Campo | Contenido |
|---|---|
| **Precondición** | Manifest con procedencia y licencia. |
| **Flujo principal** | 1. Ajustes → Contenido demo. 2. Confirmación con conteo. 3. Pipeline normal con `is_demo=true`. 4. Descargar demo deja el sitio vacío si no hay reales. |
| **Alternos** | Ejecución en staging sin tocar producción. |
| **Errores** | Manifest inválido: se rechaza antes de encolar. |
| **Postcondición** | Ningún demo se atribuye al autor; se puede retirar sin romper el sitio. |
| **Evidencia** | `AC-39`; validación de esquema; E2E de retiro. |

### CU-16 — Recuperar el acceso

| Campo | Contenido |
|---|---|
| **Precondición** | Recovery codes vigentes o acceso físico al servidor. |
| **Flujo principal** | 1. "Usar código de recuperación". 2. Código de un solo uso. 3. Acceso temporal. 4. Registrar nueva passkey. 5. Revocar la perdida. 6. Regenerar códigos. |
| **Alternos** | Sin códigos: CLI en el servidor; nunca por correo. |
| **Errores** | Código usado o inválido: rechazo genérico + rate limit + alerta. |
| **Postcondición** | Acceso recuperado y sesiones comprometidas revocadas. |
| **Evidencia** | `AC-15`; test de un solo uso. |

---

## 7. Detalle: operación

### CU-17 — Recuperar el servicio tras un apagón

| Campo | Contenido |
|---|---|
| **Precondición** | Corte eléctrico abrupto en cualquier fase. |
| **Flujo principal** | 1. Vuelve la energía. 2. systemd/Docker arrancan con `restart: unless-stopped`. 3. Postgres recupera WAL. 4. La API reconcilia jobs `processing` → `interrupted`. 5. El sitio sirve la última release válida. 6. Se alerta de lo pendiente. |
| **Alternos** | Corte durante un build: `current` intacto. Corte durante un backup: se reintenta. |
| **Errores** | Disco corrupto: restore desde backup (CU-18) y reporte. |
| **Postcondición** | Sin variantes parciales, sin release a medias, sin jobs zombis. |
| **Evidencia** | `AC-08`, `AC-09`; prueba de apagón documentada. |

### CU-18 — Restaurar desde backup

| Campo | Contenido |
|---|---|
| **Precondición** | Backup cifrado verificado y runbook disponible. |
| **Flujo principal** | 1. Se detecta pérdida. 2. Se aprovisiona entorno limpio. 3. Restore de DB, medios y configuración. 4. Verificación de integridad. 5. DNS/Tunnel apuntan al nuevo entorno. |
| **Alternos** | Restore parcial de una colección o un elemento. |
| **Errores** | Backup corrupto: se usa el anterior; se documenta el gap. |
| **Postcondición** | Sitio y admin operativos; RTO ≤ 4 h, RPO ≤ 24 h. |
| **Evidencia** | `AC-30`, `AC-31`; simulacro trimestral. |

---

## 8. Casos límite obligatorios

Estos no son "nice to have": si fallan, el sprint no pasa.

| Caso | Comportamiento esperado | Requisito |
|---|---|---|
| JS desactivado | Contenido, imágenes, navegación, SEO y contacto alternativo funcionan. | `RF-P47` |
| Sin WebGL / Save-Data / reduced-motion | Versión estática; sin 3D, autoplay ni preview. | `RF-P10`, `RF-P55`, `A11Y-11` |
| Impresión | Foto y ficha legibles sin navegación. | `RF-P39` |
| Foto vertical/panorámica/cuadrada | Sin deformación ni CLS. | `RF-P20`, `AC-04` |
| Subida interrumpida | Reanudar/descartar sin duplicados. | `RF-A15`, `RF-A17` |
| Dos pestañas del admin | No se pisa el cambio de la otra. | `RF-A21` |
| 0 medios | Home, listados, sitemap y RSS válidos. | `RF-P06`, `RF-P07` |
| Todos los medios despublicados | El sitio sigue funcionando. | `RF-P19`, `RF-P38` |
| Disco lleno / R2 caído / Redis caído | Mensajes claros, reintentos, sin corrupción. | `AC-32`–`AC-34` |
| Corte de energía en job o build | Nada parcial publicado. | `AC-08`, `AC-09` |
| Acceso directo por IP/puerto | Rechazado; solo Tunnel. | `AC-16` |
| Fuerza bruta | Rate limit, Access, passkey, alerta. | `AC-12`, `AC-21` |

---

## 9. Fuera de alcance de v1

- Cuentas de visitante, comentarios, favoritos, "me gusta".
- Venta de prints, licencias o suscripciones (`LEG-12`).
- Subida de contenido por terceros.
- App móvil nativa.
- Múltiples administradores o roles.
- Traducciones distintas de ES/EN.
- Analítica con cookies o publicidad.
- Búsqueda semántica o IA sobre el contenido.
- Programación de publicación (`RF-A39`, prioridad S) y PiP (`RF-P56`, C).

Si el usuario pide uno de estos, se registra como cambio de alcance y se actualiza
el SRS antes de implementarlo.

---

## 10. Trazabilidad CU → sprint

| CU | Sprint | Agente principal | Prueba |
|---|---|---|---|
| CU-01, CU-14 | S6 | Frontend | E2E vacío + Lighthouse |
| CU-02 | S4/S6 | Frontend + Media | E2E lightbox + HTTP |
| CU-03 | S5/S6 | Media + Frontend | E2E video + red |
| CU-04 | S6 | Frontend | E2E búsqueda ES/EN |
| CU-05 | S8 | Frontend + DevOps | E2E contacto + rate limit |
| CU-06 | S6 | Frontend | E2E i18n/tema |
| CU-07 | S6 | Frontend + SEO | Validador OG |
| CU-08, CU-16 | S3 | Backend + Security | E2E auth + recovery |
| CU-09, CU-10 | S4 | Backend + Media | E2E subida + metadatos |
| CU-11, CU-12 | S7 | Backend + DevOps | E2E build/rollback/reproceso |
| CU-13 | S7 | Backend + DevOps | Inspección dashboard |
| CU-15 | S7 | Backend + Media | E2E demo |
| CU-17 | S9 | DevOps | Prueba de apagón |
| CU-18 | S9 | DevOps | Restore en limpio |

---

## 11. Preguntas abiertas

| # | Pregunta | Impacto | Dueño |
|---|---|---|---|
| 1 | ¿El usuario confirma la bio y el enfoque fotográfico? | Copy de home/about. | Product analyst |
| 2 | ¿Habrá colecciones iniciales o se lanza vacío? | CU-01, CU-14. | Usuario |
| 3 | ¿Se publica el correo o solo el formulario? | CU-05, `RF-P75`. | Usuario |
| 4 | ¿Se lanza con demo o se retiran antes? | CU-15, `AC-39`. | Usuario |
| 5 | ¿Licencia del contenido: todos los derechos reservados o CC? | `LEG-01`, `LEG-02`. | Usuario |

Ninguna de estas preguntas cambia los flujos; cambian el contenido y el momento
del lanzamiento.
