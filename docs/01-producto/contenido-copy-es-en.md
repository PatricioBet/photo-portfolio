# Contenido y copy ES/EN

**Estado:** borrador para aprobación
**Fase:** 01 — Producto
**Fecha:** 17 de noviembre de 2026
**Base:** [`SRS v1.1`](../00-gestion/srs-v1.1.md) y [`design-system.md`](../02-ux/design-system.md)
**Regla:** nada de *lorem ipsum*. Todo texto visible existe en ES y EN.

---

## 1. Voz y tono

- Español claro, directo, sin grandilocuencia ni exclamaciones.
- Inglés natural; no traducción literal.
- Primera persona en "Sobre mí"; segunda persona en el contacto.
- Sin promesas de premios, clientes, exposiciones o equipo no verificados.
- Sin "¡Hola!", "¡Ups!" ni culpar al usuario.
- Sin tecnicismos innecesarios en el sitio público.
- En el admin, precisión: qué pasó, qué se conserva y qué hacer.
- Los estados vacíos se leen como una decisión editorial, no como un error.

### Términos preferidos

| Evitar | Usar |
|---|---|
| Contenido (para personas) | Personas, obra, piezas. |
| "En construcción" | "El archivo se está preparando". |
| "Haz clic aquí" | Texto descriptivo del destino. |
| "Error 500" a secas | "Algo salió mal" + `traceId`. |
| "Foto" para un video | "Pieza", "video", "fotografía" según corresponda. |
| "Gratis" si no lo es | "Sin costo" solo si aplica. |

---

## 2. Identidad

### 2.1 Nombres

| Elemento | ES | EN |
|---|---|---|
| Nombre | Patricio Betancourt | Patricio Betancourt |
| Disciplina | Fotografía y video | Photography and video |
| Marca corta | PB | PB |
| Sitio de desarrollo | Desarrollo | Development |
| Admin | Administración | Admin |

### 2.2 Titular de la home

**ES**

```text
Patricio Betancourt
Fotografía y video
```

**Subtítulo propuesto (validar con el autor):**

```text
Un archivo personal de imágenes y movimiento.
```

```text
EN: A personal archive of images and motion.
```

No se afirma experiencia, especialidad ni trayectoria que el usuario no haya
confirmado.

---

## 3. Navegación y pie

| Clave | ES | EN |
|---|---|---|
| `nav.photos` | Fotos | Photos |
| `nav.videos` | Videos | Videos |
| `nav.collections` | Colecciones | Collections |
| `nav.about` | Sobre mí | About |
| `nav.contact` | Contacto | Contact |
| `nav.search` | Buscar | Search |
| `nav.home` | Inicio | Home |
| `nav.skip` | Saltar al contenido | Skip to content |
| `nav.menu` | Menú | Menu |
| `nav.close` | Cerrar | Close |
| `nav.theme` | Cambiar tema | Change theme |
| `nav.language` | Idioma: Español | Language: English |
| `footer.privacy` | Privacidad | Privacy |
| `footer.terms` | Términos | Terms |
| `footer.accessibility` | Accesibilidad | Accessibility |
| `footer.credits` | Créditos | Credits |
| `footer.rss` | RSS | RSS |
| `footer.development` | Desarrollo | Development |
| `footer.copyright` | © Patricio Betancourt. Todos los derechos reservados. | © Patricio Betancourt. All rights reserved. |
| `footer.selfhosted` | Sitio autoalojado | Self-hosted site |

El enlace "Desarrollo" apunta a `https://patriciobet.dev` (`RF-P40`). El enlace
"Fotografía" en el portfolio de desarrollo es el interenlace de vuelta.

---

## 4. Home

### 4.1 Hero

**ES**

```text
Patricio Betancourt
Fotografía y video

Un archivo personal de imágenes y movimiento.

[Ver fotos]  [Ver videos]
```

**EN**

```text
Patricio Betancourt
Photography and video

A personal archive of images and motion.

[View photos]  [View videos]
```

- El `h1` es el nombre; el resto no compite con él.
- El fondo 3D es decorativo y no contiene texto.

### 4.2 Secciones

| Sección | ES | EN |
|---|---|---|
| Destacados | Trabajos destacados | Selected work |
| Colecciones | Colecciones | Collections |
| Reel | Reel destacado | Featured reel |
| Sobre mí | Sobre mí | About |
| Contacto | ¿Trabajamos juntos? | Let's work together |
| Ver todo | Ver todo | View all |
| Leer más | Leer más | Read more |

### 4.3 Estado vacío de la home

**ES**

```text
EL ARCHIVO SE ESTÁ PREPARANDO
Fotografías y videos llegarán pronto.
Mientras tanto, puedes conocer mi trabajo de desarrollo.

[Sobre mí]  [Contacto]  [Desarrollo]
```

**EN**

```text
THE ARCHIVE IS BEING PREPARED
Photographs and videos will arrive soon.
In the meantime, you can explore my development work.

[About]  [Contact]  [Development]
```

- No se usa "en construcción".
- No hay spinner ni cuadrícula vacía.

---

## 5. Listados y estados

### 5.1 Galería de fotos

| Estado | ES | EN |
|---|---|---|
| Título | Fotos | Photos |
| Introducción (propuesta) | Una selección de imágenes, sin recortes ni ruido. | A selection of images, without crops or noise. |
| Vacío | AÚN NO HAY FOTOGRAFÍAS PUBLICADAS | NO PHOTOGRAPHS PUBLISHED YET |
| Vacío, ayuda | Estoy preparando la primera selección. Vuelve pronto o explora los videos. | I'm preparing the first selection. Come back soon or explore the videos. |
| Vacío, acciones | [Ver videos] [Sobre mí] | [View videos] [About] |
| Sin resultados | NINGUNA PIEZA COINCIDE CON ESTOS FILTROS | NO WORK MATCHES THESE FILTERS |
| Sin resultados, ayuda | Estás viendo: {filtros}. Prueba quitando uno o vuelve a todo. | You're viewing: {filters}. Try removing one or go back to everything. |
| Sin resultados, acciones | [Quitar filtros] [Ver todo] | [Clear filters] [View all] |

### 5.2 Galería de videos

| Estado | ES | EN |
|---|---|---|
| Título | Videos | Videos |
| Introducción (propuesta) | Piezas breves, en movimiento. | Short pieces, in motion. |
| Vacío | AÚN NO HAY VIDEOS PUBLICADOS | NO VIDEOS PUBLISHED YET |
| Vacío, ayuda | La primera pieza audiovisual está en preparación. | The first audiovisual piece is in preparation. |
| Vacío, acciones | [Ver fotos] [Sobre mí] | [View photos] [About] |

### 5.3 Colecciones

| Estado | ES | EN |
|---|---|---|
| Título | Colecciones | Collections |
| Vacío | LAS COLECCIONES SE ESTÁN ORGANIZANDO | COLLECTIONS ARE BEING ORGANIZED |
| Vacío, ayuda | Mientras tanto, puedes ver todas las fotos y videos. | In the meantime, you can view all photos and videos. |
| Conteo | {n} piezas | {n} pieces |

### 5.4 Filtros

| Clave | ES | EN |
|---|---|---|
| `filter.all` | Todas | All |
| `filter.collection` | Colección | Collection |
| `filter.tag` | Etiqueta | Tag |
| `filter.year` | Año | Year |
| `filter.type` | Tipo | Type |
| `filter.sort` | Orden | Sort |
| `filter.recent` | Recientes | Recent |
| `filter.oldest` | Más antiguas | Oldest |
| `filter.manual` | Orden manual | Manual order |
| `filter.clear` | Limpiar filtros | Clear filters |
| `filter.results` | {n} resultados | {n} results |

---

## 6. Detalle de foto

| Clave | ES | EN |
|---|---|---|
| `photo.previous` | Anterior | Previous |
| `photo.next` | Siguiente | Next |
| `photo.enlarge` | Ampliar | Enlarge |
| `photo.share` | Compartir | Share |
| `photo.copy` | Copiar enlace | Copy link |
| `photo.copied` | Enlace copiado | Link copied |
| `photo.related` | Relacionados | Related |
| `photo.date` | Fecha | Date |
| `photo.collection` | Colección | Collection |
| `photo.tags` | Etiquetas | Tags |
| `photo.credit` | Crédito | Credit |
| `photo.license` | Licencia | License |
| `photo.rights` | © Patricio Betancourt. Todos los derechos reservados. | © Patricio Betancourt. All rights reserved. |
| `photo.noDownload` | El original no está disponible para descarga. | The original is not available for download. |
| `photo.lightbox` | Foto {i} de {n}: {título} | Photo {i} of {n}: {title} |

La ficha no se inventa: si un dato no existe, se omite. El GPS nunca se publica.

---

## 7. Detalle de video

| Clave | ES | EN |
|---|---|---|
| `video.play` | Reproducir | Play |
| `video.pause` | Pausar | Pause |
| `video.mute` | Silenciar | Mute |
| `video.unmute` | Activar sonido | Unmute |
| `video.quality` | Calidad | Quality |
| `video.fullscreen` | Pantalla completa | Full screen |
| `video.captions` | Subtítulos | Captions |
| `video.transcript` | Transcripción | Transcript |
| `video.duration` | Duración | Duration |
| `video.notReady` | Este video todavía se está preparando. | This video is still being prepared. |
| `video.fallback` | Ver la versión anterior | View the previous version |

- Sin autoplay con sonido.
- Si no hay voz, no se prometen subtítulos que no existen.

---

## 8. Búsqueda

**ES**

```text
BUSCAR
( Busca por título, descripción, colección o etiqueta… )
[Todo] [Fotos] [Videos] [Colecciones]
```

**Sin consulta:**

```text
¿QUÉ ESTÁS BUSCANDO?
Busca por título, descripción, colección o etiqueta.

Sugerencias: [Fotos] [Videos] [Colecciones]
```

**Sin resultados:**

```text
NO ENCONTRAMOS RESULTADOS PARA «{query}»
Prueba con otra palabra o quita los filtros.

[Limpiar filtros] [Ver todas las fotos] [Ver todos los videos]
```

**EN**

```text
SEARCH
( Search by title, description, collection or tag… )
[All] [Photos] [Videos] [Collections]

NO RESULTS FOR "{query}"
Try another word or clear the filters.

[Clear filters] [View all photos] [View all videos]
```

---

## 9. Sobre mí

### 9.1 Propuesta de estructura

```text
SOBRE MÍ

[retrato]

[Bio de 3–4 párrafos]

ENFOQUE
[Qué busca la mirada; sin grandilocuencia]

EQUIPO (opcional, solo si es real)

ENLACES
[Desarrollo] [GitHub] [LinkedIn]
```

### 9.2 Borrador de bio (validar con el autor)

**ES**

```text
Soy Patricio Betancourt. Trabajo en desarrollo de software y ciencia de datos, y
la fotografía es la otra forma en que miro: composición, luz y tiempo.

Este espacio reúne imágenes y piezas de video que he ido guardando. No es un
catálogo comercial ni una retrospectiva: es un archivo que crece cuando tengo
algo que valga la pena mostrar.

Cuando no estoy detrás de una cámara, estoy construyendo software. Puedes ver
ese trabajo en patriciobet.dev.
```

**EN**

```text
I'm Patricio Betancourt. I work in software development and data science, and
photography is the other way I look: composition, light and time.

This space gathers images and video pieces I've been keeping. It's not a
commercial catalogue or a retrospective: it's an archive that grows when I have
something worth showing.

When I'm not behind a camera, I'm building software. You can see that work at
patriciobet.dev.
```

**Advertencias:**

- No afirmar "fotógrafo profesional", premios, clientes, exposiciones ni equipo.
- No publicar el retrato hasta tener una foto real autorizada.
- No publicar el correo hasta confirmar `D-10`.

---

## 10. Contacto

### 10.1 Introducción

**ES**

```text
CONTACTO
¿Tienes un proyecto o una pregunta? Escríbeme.
```

**EN**

```text
CONTACT
Do you have a project or a question? Write to me.
```

### 10.2 Formulario

| Campo | ES | EN | Notas |
|---|---|---|---|
| Nombre | Nombre | Name | `autocomplete="name"`, obligatorio. |
| Correo | Correo | Email | `autocomplete="email"`, `inputmode="email"`. |
| Mensaje | Mensaje | Message | Máx. 5 000; contador visible. |
| Consentimiento | Acepto la política de privacidad. | I accept the privacy policy. | Enlace a `/privacidad/`. |
| Enviar | Enviar mensaje | Send message | Deshabilitado solo si explica por qué. |
| Enviando | Enviando… | Sending… | `aria-live="polite"`. |

**Ayuda bajo el mensaje:**

```text
Máximo 5 000 caracteres. No incluyas datos sensibles.
```

**Alternativa:**

```text
¿Prefieres correo? [enlace autorizado]
```

El enlace de correo no se publica hasta que el usuario lo confirme. Mientras
tanto, el prototipo muestra un botón deshabilitado con la nota interna
"correo pendiente".

### 10.3 Errores

| Situación | ES | EN |
|---|---|---|
| Campo vacío | Escribe tu {campo}. | Enter your {field}. |
| Correo inválido | Revisa el correo: falta el formato nombre@dominio. | Check the email: it needs the name@domain format. |
| Mensaje largo | El mensaje supera los 5 000 caracteres. | The message exceeds 5,000 characters. |
| Sin consentimiento | Necesito tu consentimiento para responder. | I need your consent to reply. |
| Turnstile | No pudimos verificar que eres una persona. Intenta de nuevo o usa el correo alternativo. | We couldn't verify you're a person. Try again or use the alternate email. |
| Rate limit | Demasiados intentos. Espera unos minutos antes de enviar otro mensaje. | Too many attempts. Wait a few minutes before sending another message. |
| Red | No pudimos enviar el mensaje. Revisa tu conexión; tu texto se conserva. | We couldn't send the message. Check your connection; your text is preserved. |

### 10.4 Éxito

```text
✓ Mensaje enviado
Gracias por escribir. Te responderé al correo que indicaste.

[Volver al inicio]
```

```text
✓ Message sent
Thanks for writing. I'll reply to the email you provided.

[Back to home]
```

`aria-live="polite"`, foco al mensaje, sin recargar.

---

## 11. Errores públicos

| Código | ES | EN |
|---|---|---|
| 404 | NO ENCONTRAMOS ESTA PÁGINA — Puede que el enlace esté mal o que la pieza haya cambiado de URL. [Ir al inicio] [Ver fotos] [Buscar] | WE COULDN'T FIND THIS PAGE — The link may be wrong or the piece may have a new URL. [Go home] [View photos] [Search] |
| 410 | ESTA PIEZA YA NO ESTÁ PUBLICADA — El autor retiró este contenido. [Ver fotos] [Ver videos] [Inicio] | THIS PIECE IS NO LONGER PUBLISHED — The author removed this content. [View photos] [View videos] [Home] |
| 500 | ALGO SALIÓ MAL — No pudimos cargar esta página. Intenta de nuevo en unos minutos. [Reintentar] [Inicio] Código: {traceId} | SOMETHING WENT WRONG — We couldn't load this page. Try again in a few minutes. [Retry] [Home] Code: {traceId} |
| 503 | SITIO EN MANTENIMIENTO — Estamos actualizando el sitio. Vuelve en unos minutos. Reintentar en: {Retry-After} | SITE UNDER MAINTENANCE — We're updating the site. Come back in a few minutes. Retry in: {Retry-After} |
| 403 admin | NO TIENES ACCESO — Esta cuenta no está autorizada. | NO ACCESS — This account is not authorized. |
| Offline | SIN CONEXIÓN — No pudimos enviar el mensaje. Tu texto se conserva. [Reintentar] | OFFLINE — We couldn't send the message. Your text is preserved. [Retry] |

Sin stack traces, rutas internas ni datos personales.

---

## 12. Admin (microcopy clave)

| Clave | ES |
|---|---|
| `admin.login.title` | ADMINISTRACIÓN DE FOTOGRAFÍA |
| `admin.login.passkey` | Usar passkey |
| `admin.login.recovery` | Usar código de recuperación |
| `admin.login.secure` | Sesión segura · Sin contraseñas |
| `admin.onboarding.title` | TU ARCHIVO ESTÁ LISTO PARA EMPEZAR |
| `admin.onboarding.body` | No hay fotos ni videos todavía. El sitio público ya funciona con estados vacíos. |
| `admin.upload.title` | SUBIR ARCHIVOS |
| `admin.upload.drop` | Arrastra fotos o videos aquí, o selecciona archivos. |
| `admin.upload.resume` | Reanudar |
| `admin.upload.discard` | Descartar |
| `admin.upload.duplicate` | Ya existe un archivo igual. ¿Continuar o descartar? |
| `admin.media.empty` | NO HAY ARCHIVOS — Arrastra fotos o videos aquí, o usa el selector. |
| `admin.media.trashEmpty` | LA PAPELERA ESTÁ VACÍA — Los elementos borrados se conservan 30 días. |
| `admin.publish.title` | PUBLICAR |
| `admin.publish.pending` | Cambios pendientes: {n} |
| `admin.publish.building` | Construyendo… |
| `admin.publish.failed` | No se publicó. La versión actual sigue viva. |
| `admin.publish.done` | Publicado en {tiempo}. |
| `admin.rollback.title` | Confirmar rollback |
| `admin.rollback.body` | Volverás a la release {release}. La versión actual seguirá disponible. |
| `admin.conflict` | Otra pestaña cambió este elemento. Tu versión es la {v}; la actual es la {v+1}. |
| `admin.backup.failed` | LA ÚLTIMA COPIA FALLÓ — Última copia correcta: hace {n} h. |
| `admin.demo.load` | Cargar demo |
| `admin.demo.remove` | Descargar demo |
| `admin.demo.warning` | Se crearán {n} elementos marcados como demo. No se atribuyen al autor. |
| `admin.error.trace` | Código: {traceId} |

Las acciones destructivas se nombran: "Borrar definitivamente", no "OK".

---

## 13. Metadatos SEO

| Página | `title` ES | `description` ES |
|---|---|---|
| Home | Patricio Betancourt — Fotografía y video | Archivo personal de fotografías y videos de Patricio Betancourt. |
| Fotos | Fotos — Patricio Betancourt | Selección de fotografías de Patricio Betancourt. |
| Videos | Videos — Patricio Betancourt | Piezas de video de Patricio Betancourt. |
| Colecciones | Colecciones — Patricio Betancourt | Series y colecciones de fotografía y video. |
| Sobre mí | Sobre mí — Patricio Betancourt | Quién es Patricio Betancourt y cómo trabaja. |
| Contacto | Contacto — Patricio Betancourt | Escríbeme para proyectos, encargos o preguntas. |
| Búsqueda | Buscar — Patricio Betancourt | Busca en el archivo de fotografía y video. |

- `title` ≤ 60 caracteres; `description` ≤ 155.
- EN equivalente, no traducción automática visible.
- Las páginas de detalle usan el título de la pieza + marca.
- OG image 1200×630 con la pieza o fallback de marca.

---

## 14. Textos alternativos

- Describen sujeto, acción y contexto; no repiten el título.
- No empiezan con "imagen de" ni "foto de".
- Si la foto es abstracta, describen lo relevante (luz, textura, composición).
- Decorativas: `alt=""`.
- Un alt inventado es peor que uno pendiente: si no se conoce la foto, se marca
  `alt pendiente` y no se publica.

**Ejemplo:**

```text
Bien:  "Olas rompiendo contra una roca negra al amanecer, niebla baja."
Mal:   "Foto de olas."
Mal:   "atardecer.jpg"
```

---

## 15. Pending de contenido

| # | Elemento | Estado | Dueño |
|---|---|---|---|
| 1 | Bio y enfoque fotográfico | propuesta, sin validar. | Usuario |
| 2 | Retrato del autor | no existe. | Usuario |
| 3 | Correo público | no decidido (`D-10`). | Usuario |
| 4 | Colecciones iniciales | no definidas. | Usuario |
| 5 | Licencia del contenido | propuesta: todos los derechos reservados. | Usuario |
| 6 | Equipo/cámara | no inventar. | Usuario |
| 7 | Assets demo | manifest vacío. | Media |
| 8 | Textos legales | borrador en [`legal-privacidad.md`](legal-privacidad.md). | Legal |

Ningún texto pendiente se sustituye por *lorem ipsum* ni por una afirmación
inventada. Si falta, la sección se omite o se muestra el estado vacío.
