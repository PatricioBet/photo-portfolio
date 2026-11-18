# Flujo del visitante

**Actores:** visitante anónimo, rastreador, lector de pantalla.
**Objetivo:** entender quién es Patricio, explorar su trabajo y contactarlo sin
fricción, incluso si el sitio aún no tiene medios publicados.

---

## 1. Entradas

| Entrada | Expectativa | Respuesta |
|---|---|---|
| `https://photo.patriciobet.dev/` | Ver identidad y trabajo. | Home con hero, destacados y navegación. |
| Enlace desde `patriciobet.dev` | “Fotografía” del autor. | Home o galería, con interenlace de vuelta. |
| Buscador | Foto/video concreto. | Página de detalle indexada. |
| Red social | Vista previa de una foto/video. | OG/Twitter con imagen y título correctos. |
| Enlace directo a un detalle | Ver la pieza. | Detalle 200 o 410 si se retiró. |
| Búsqueda interna | Encontrar por texto. | `/buscar/` con Pagefind. |
| Modo oscuro/claro | Respetar preferencia. | Tema del sistema o elección guardada. |
| Inglés | Leer en EN. | `/en/` equivalente. |

---

## 2. Camino principal: home → foto

```text
→ Abre /
⇒ Hero con identidad, CTAs y fondo (3D o imagen)
→ “Ver fotos”
⇒ /fotos/ con introducción, filtros y cuadrícula
→ Selecciona una miniatura
⇒ /fotos/{slug}/ con imagen, ficha y relacionados
→ Clic en la imagen
⇒ Lightbox accesible con zoom y navegación
→ Esc o botón cerrar
⇒ Vuelve al detalle con el foco en la miniatura
→ “Contacto”
⇒ /contacto/ con formulario y alternativa
→ Envía mensaje
⇒ Confirmación accesible y respuesta por email
```

**Criterios:**

- La home explica quién es y qué hace en menos de 5 segundos.
- La galería no deforma ni recorta fotos.
- El detalle no muestra el original ni permite descargarlo.
- El lightbox se puede usar con teclado y lector de pantalla.
- El formulario no pierde datos si falla el envío.

---

## 3. Camino: video

```text
→ Abre /videos/
⇒ Cuadrícula con posters, duración e icono de reproducción
→ Selecciona un video
⇒ /videos/{slug}/ con poster, título y ficha
→ Play
⇒ Reproduce con la calidad adecuada; sin autoplay con sonido
→ Activa subtítulos
⇒ <track> visible y sincronizado
→ Pantalla completa o PiP (si está disponible)
⇒ Control accesible; Esc sale
```

**Criterios:**

- `preload=metadata`; no se descarga el video completo antes de interactuar.
- En Safari/iOS funciona sin hls.js.
- Con `prefers-reduced-motion` o Save-Data no hay preview automático.
- Si el video no está listo, se muestra poster y estado, no un reproductor roto.

---

## 4. Camino: búsqueda

```text
→ Abre /buscar/
⇒ Campo con label visible y filtros
→ Escribe “atardecer”
⇒ Resultados con título, tipo y extracto
→ Abre un resultado
⇒ Detalle correspondiente
→ Sin resultados
⇒ Explica qué no se encontró y sugiere quitar filtros o explorar Fotos/Videos
```

**Criterios:**

- El índice es por idioma activo; no mezcla ES/EN.
- La página es `noindex,follow`.
- Sin JavaScript, la navegación y el contenido siguen funcionando.

---

## 5. Camino: sitio vacío (0 medios)

```text
→ Abre /
⇒ Home completa con hero, about y contacto; secciones de trabajo con estado
   vacío editorial: “El archivo se está preparando”.
→ “Ver fotos”
⇒ /fotos/ con introducción y estado vacío; sin cuadrícula rota ni paginación.
→ “Sobre mí”
⇒ Bio y enlaces.
→ “Contacto”
⇒ Formulario operativo.
```

**Criterios:**

- No hay soft-404, ni spinner infinito, ni imágenes rotas.
- Sitemap, RSS y 404 son válidos con 0 medios.
- El estado vacío se ve intencional y no “en construcción”.
- Al publicar el primer medio, las secciones aparecen sin CLS.

---

## 6. Camino: idioma y tema

```text
→ Pulsa EN
⇒ Misma página en /en/...; si no existe traducción, no se ofrece el enlace
→ Pulsa el tema
⇒ Claro/oscuro/sistema; se aplica antes del primer pintado
→ Recarga
⇒ Preferencia conservada en localStorage (sin cookies)
→ Sistema operativo cambia de tema
⇒ Si está en “sistema”, se actualiza
```

**Criterios:**

- Sin redirección automática por navegador.
- El selector conserva la página equivalente.
- El tema no produce flash ni CLS.
- `prefers-color-scheme` y `prefers-reduced-motion` se respetan.

---

## 7. Camino: accesibilidad

| Acción | Resultado |
|---|---|
| Tab desde el inicio | Aparece “Saltar al contenido”. |
| Navegar con Tab | Orden lógico; foco visible; sin trampas. |
| Abrir menú móvil | Foco atrapado; Esc cierra; vuelve al botón. |
| Abrir lightbox | Foco atrapado; flechas navegan; Esc cierra; foco vuelve. |
| Leer con NVDA/VoiceOver | Títulos, alt, labels y anuncios correctos. |
| Reducir movimiento | Sin parallax, pin, 3D animado ni autoplay. |
| Zoom 200/400 % | Sin pérdida de contenido ni scroll horizontal. |
| Imprimir detalle | Foto y ficha legibles; sin navegación. |

---

## 8. Errores y recuperación

| Situación | Respuesta |
|---|---|
| 404 | Página con navegación, búsqueda y enlaces recientes. |
| 410 | “Esta pieza ya no está publicada”; enlaces a lo reciente. |
| 503 | Mantenimiento con `Retry-After` y enlaces mínimos. |
| Imagen no disponible | Fallback de marca; nunca icono roto. |
| Video no disponible | Poster + estado + enlace alternativo. |
| Contacto falla | Mensaje accesible, conserva el texto, ofrece reintento/correo. |
| Sin conexión | Aviso; el contenido ya cargado sigue visible. |
| Rate limit | “Demasiados intentos; espera unos minutos”. |
| JS desactivado | Contenido, imágenes, navegación y enlaces funcionan. |

---

## 9. Interenlace con el portfolio de desarrollo

- Cabecera o pie: “Desarrollo” → `https://patriciobet.dev`.
- En `patriciobet.dev` debe existir “Fotografía” → `https://photo.patriciobet.dev`.
- `Person` JSON-LD incluye `sameAs` con GitHub, LinkedIn y el portfolio.
- El enlace se abre en la misma pestaña salvo que el usuario pida lo contrario.

---

## 10. Analítica y privacidad

- Sin cookies de visitante ni fingerprinting.
- Cloudflare Web Analytics o equivalente, sin datos personales.
- No se registran búsquedas ni mensajes.
- No se muestra banner de cookies si solo hay cookies esenciales del admin.

---

## 11. Criterios de aceptación del flujo

- [ ] AC-01: sitio vacío completo.
- [ ] AC-02: primera foto publicada.
- [ ] AC-22: lightbox accesible.
- [ ] AC-23: video accesible.
- [ ] AC-24: reduced motion/Save-Data.
- [ ] AC-25: Lighthouse.
- [ ] AC-28: 404/301.
- [ ] AC-29: búsqueda ES/EN.
- [ ] AC-36: i18n incompleto.
- [ ] AC-37: accesibilidad.
- [ ] AC-38: impresión.
