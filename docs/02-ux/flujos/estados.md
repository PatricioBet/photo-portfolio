# Estados: vacío, carga, error y borde

**Objetivo:** que el sitio y el admin se vean intencionales en todos los estados,
no solo cuando hay contenido perfecto.

---

## 1. Matriz de estados

| Vista | Vacío | Carga | Error | Borde |
|---|---|---|---|---|
| Home | Sin medios publicados. | Imagen/3D progresivo. | Fallback estático. | Solo videos, solo fotos, 1 elemento. |
| `/fotos/` | Sin fotos. | Skeletons con proporción. | Fallback de marca. | 0 resultados de filtro. |
| `/videos/` | Sin videos. | Posters/skeletons. | Poster fallback. | Video no listo. |
| `/colecciones/` | Sin colecciones. | Skeletons. | Fallback. | Colección vacía no pública. |
| Detalle foto | — | LCP prioritario; placeholder. | 410/404. | Imagen faltante, sin relacionados. |
| Detalle video | — | Poster + metadata. | Poster/estado. | Sin subtítulos, sin HLS. |
| `/buscar/` | Sin consulta. | Índice cargando. | Pagefind no carga. | Sin resultados. |
| Contacto | — | Enviando. | Error de envío. | Rate limit, Turnstile falla. |
| Admin media | Sin archivos. | Subiendo/procesando. | Job fallido. | Duplicados, papelera. |
| Admin colecciones | Sin colecciones. | Guardando. | Fallo de guardado. | Colección sin elementos. |
| Admin releases | Sin releases. | Build en curso. | Build fallido. | Rollback no disponible. |
| Admin backups | Sin copias. | Copia en curso. | Copia fallida. | Copia vieja. |
| 404 | — | — | Página 404. | URL con mayúsculas/espacios. |
| 410 | — | — | Página 410. | Contenido restaurado. |
| 503 | — | — | Mantenimiento. | `Retry-After` ausente. |

---

## 2. Estados vacíos públicos

### 2.1 Home sin medios

```text
EL ARCHIVO SE ESTÁ PREPARANDO
Fotografías y videos llegarán pronto.
Mientras tanto, puedes conocer mi trabajo de desarrollo.

[Ver fotos]  [Sobre mí]  [Contacto]
```

- No se muestra una cuadrícula vacía.
- No se muestra “en construcción” ni un spinner.
- El hero y el about siguen siendo útiles.
- El bloque de trabajo se reemplaza por una pieza editorial con textura/foto
  abstracta de marca.

**EN:**

```text
THE ARCHIVE IS BEING PREPARED
Photographs and videos will arrive soon.
In the meantime, you can explore my development work.
```

### 2.2 Galería sin fotos

```text
AÚN NO HAY FOTOGRAFÍAS PUBLICADAS
Estoy preparando la primera selección. Vuelve pronto o explora los videos.

[Ver videos]  [Sobre mí]
```

### 2.3 Galería sin videos

```text
AÚN NO HAY VIDEOS PUBLICADOS
La primera pieza audiovisual está en preparación.

[Ver fotos]  [Sobre mí]
```

### 2.4 Sin colecciones

```text
LAS COLECCIONES SE ESTÁN ORGANIZANDO
Mientras tanto, puedes ver todas las fotos y videos.
```

### 2.5 Búsqueda sin consulta

```text
¿QUÉ ESTÁS BUSCANDO?
Busca por título, descripción, colección o etiqueta.

Sugerencias: [Fotos] [Videos] [Colecciones]
```

### 2.6 Búsqueda sin resultados

```text
NO ENCONTRAMOS RESULTADOS PARA «{query}»
Prueba con otra palabra o quita los filtros.

[Limpiar filtros]  [Ver todas las fotos]  [Ver todos los videos]
```

### 2.7 Filtros sin resultados

```text
NINGUNA PIEZA COINCIDE CON ESTOS FILTROS
Estás viendo: {filtros}. Prueba quitando uno o vuelve a todo.

[Quitar filtros]  [Ver todo]
```

### 2.8 Etiqueta/colección vacía

- No se genera página pública si no tiene elementos publicados.
- La URL responde 404 (nunca existió) o 410 (se retiró).
- No se muestra una lista vacía indexable.

---

## 3. Estados vacíos del admin

### 3.1 Primera vez

```text
TU ARCHIVO ESTÁ LISTO PARA EMPEZAR
No hay fotos ni videos todavía. El sitio público ya funciona con estados vacíos.

[Subir primera foto]  [Crear colección]  [Configurar passkey de respaldo]
```

### 3.2 Biblioteca vacía

```text
NO HAY ARCHIVOS
Arrastra fotos o videos aquí, o usa el selector.

[Subir archivos]
```

### 3.3 Papelera vacía

```text
LA PAPELERA ESTÁ VACÍA
Los elementos borrados se conservan 30 días antes de purgarse.
```

### 3.4 Sin colecciones

```text
AÚN NO HAY COLECCIONES
Agrupa fotos y videos por serie, lugar o proyecto.

[Crear colección]
```

### 3.5 Sin jobs

```text
NO HAY TRABAJOS EN COLA
Las subidas y los builds aparecerán aquí.
```

### 3.6 Sin releases

```text
AÚN NO HAY RELEASES
Publica tu primer elemento para generar una versión del sitio.
```

### 3.7 Sin backups

```text
AÚN NO HAY COPIAS DE SEGURIDAD
Configura el primer backup antes de publicar.

[Configurar backup]  [Ver runbook]
```

### 3.8 Sin actividad

```text
SIN ACTIVIDAD REGISTRADA
Las acciones del admin se registrarán aquí.
```

---

## 4. Estados de carga

| Elemento | Patrón | Regla |
|---|---|---|
| Imagen | Placeholder de color/ThumbHash + `aspect-ratio`. | Sin salto de layout. |
| Cuadrícula | Skeletons con la misma proporción. | Máximo 6; luego contenido. |
| Video | Poster + metadata. | No autoplay. |
| Página | Contenido estático primero. | No pantalla en blanco. |
| Subida | Progreso por archivo + estado. | Pausar/reanudar. |
| Job | Estado + tiempo + etapa. | Sin spinner infinito. |
| Build | Estado + duración + logs. | No bloquea el admin. |
| Búsqueda | “Buscando…” en `aria-live`. | No bloquea navegación. |
| Formulario | Botón deshabilitado + “Enviando…”. | No duplica envíos. |

**Reglas:**

- Un skeleton no dura más de lo necesario; si falla, se convierte en error.
- No se muestra un spinner global que tape el contenido.
- El progreso es real, no una animación falsa.
- La carga no impide usar el teclado.

---

## 5. Errores públicos

### 5.1 404

```text
NO ENCONTRAMOS ESTA PÁGINA
Puede que el enlace esté mal o que la pieza haya cambiado de URL.

[Ir al inicio]  [Ver fotos]  [Buscar]
```

### 5.2 410

```text
ESTA PIEZA YA NO ESTÁ PUBLICADA
El autor retiró este contenido. Puedes explorar lo que sí está disponible.

[Ver fotos]  [Ver videos]  [Inicio]
```

### 5.3 500

```text
ALGO SALIÓ MAL
No pudimos cargar esta página. Intenta de nuevo en unos minutos.

[Reintentar]  [Inicio]  Código: {traceId}
```

- Sin stack traces, rutas internas ni datos personales.
- `traceId` visible para soporte.

### 5.4 503

```text
SITIO EN MANTENIMIENTO
Estamos actualizando el sitio. Vuelve en unos minutos.

[Reintentar]  Reintentar en: {Retry-After}
```

### 5.5 403 (admin)

```text
NO TIENES ACCESO
Esta cuenta no está autorizada. Si crees que es un error, revisa Cloudflare
Access o contacta al administrador.
```

- Sin revelar si el recurso existe.

### 5.6 Rate limit (contacto)

```text
DEMASIADOS INTENTOS
Espera unos minutos antes de enviar otro mensaje.

[Volver]  [Usar correo alternativo]
```

### 5.7 Sin conexión

```text
SIN CONEXIÓN
No pudimos enviar el mensaje. Revisa tu conexión e inténtalo de nuevo.
Tu texto se conserva.
```

---

## 6. Errores del admin

| Error | Mensaje | Acción |
|---|---|---|
| Job fallido | “No pudimos procesar el archivo”. | Ver causa, reintentar, descargar log seguro. |
| Build fallido | “No se publicó. La versión actual sigue viva”. | Ver logs, corregir, reintentar. |
| Guardado en conflicto | “Otra pestaña cambió este elemento”. | Recargar o revisar diferencias. |
| Sin espacio | “El disco está lleno”. | Limpiar/prune; alerta. |
| R2 no disponible | “El almacenamiento no responde”. | Reintentar; no se pierde el original. |
| Backup fallido | “La última copia falló”. | Reintentar; revisar runbook. |
| Sesión expirada | “Tu sesión expiró”. | Volver a entrar. |
| Sin permiso | “No autorizado”. | Revisar Access/passkey. |

---

## 7. Estados parciales

- **Algunas imágenes fallan:** se muestran fallbacks; el resto sigue.
- **Un video no está listo:** poster + estado; no se rompe la cuadrícula.
- **Un job falla:** los demás continúan; el fallido se puede reintentar.
- **Un build falla:** la release anterior sigue; no se publica a medias.
- **R2 lento:** se muestra progreso; no se cancela por timeout corto.
- **Redis caído:** lectura sigue; escrituras se encolan o avisan.
- **DB lenta:** el sitio público sirve estático; el admin espera.

---

## 8. Accesibilidad de estados

- `aria-live="polite"` para éxito, error y resultados de búsqueda.
- `role="alert"` solo para errores que requieren atención inmediata.
- El foco se mueve al mensaje de error del formulario.
- El foco vuelve al disparador al cerrar un diálogo.
- Los estados no dependen solo del color.
- Los skeletons tienen `aria-hidden="true"` y un texto alternativo para SR.
- Los botones deshabilitados explican por qué.
- Los tiempos de espera se anuncian sin countdown agresivo.

---

## 9. Copy: reglas

- Español claro, sin exclamaciones ni “¡Ups!”.
- Sin culpar al usuario.
- Explicar qué pasó y qué hacer.
- Una acción principal por estado.
- No prometer tiempos que no se cumplen.
- EN con el mismo significado, no traducción literal rara.
- No usar “contenido” para hablar de personas.

---

## 10. Criterios de aceptación

- [ ] AC-01: home/listados vacíos completos.
- [ ] AC-07: upload interrumpido con reanudación.
- [ ] AC-08: apagón con job reconciliado.
- [ ] AC-09: build fallido sin tocar `current`.
- [ ] AC-11: despublicar con 410.
- [ ] AC-19: upload malicioso rechazado con causa.
- [ ] AC-21: contacto con rate limit.
- [ ] AC-28: 404/301 reales.
- [ ] AC-32: disco lleno con mensaje claro.
- [ ] AC-33: R2 caído sin corrupción.
- [ ] AC-34: Redis caído sin pérdida.
- [ ] AC-37: estados accesibles.
