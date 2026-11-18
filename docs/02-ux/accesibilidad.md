# Accesibilidad

**Objetivo:** WCAG 2.2 nivel AA en el sitio público y en el admin.
**Estado:** borrador para aprobación
**Base:** SRS sección 14 y [`design-system.md`](design-system.md)

---

## 1. Principios

- La accesibilidad se diseña, no se parchea al final.
- El contenido funciona sin JavaScript, sin color y sin movimiento.
- Las fotos y videos tienen alternativas textuales útiles, no decorativas.
- El admin también es una interfaz de usuario: debe ser usable con teclado y
  lector de pantalla.
- Las pruebas automáticas son un piso, no el techo.

---

## 2. Checklist WCAG 2.2 AA

### 2.1 Perceptible

- [ ] 1.1.1 Contenido no textual: alt en imágenes, nombres en iconos, texto
  alternativo en medios.
- [ ] 1.2.1–1.2.5 Medios: subtítulos, transcripción, audiodescripción cuando
  aplique, controles.
- [ ] 1.3.1 Información y relaciones: HTML semántico, listas, tablas, labels.
- [ ] 1.3.2 Secuencia significativa.
- [ ] 1.3.3 Características sensoriales: no “el botón de la derecha”.
- [ ] 1.3.4 Orientación: no bloquear vertical/horizontal.
- [ ] 1.3.5 Identificar el propósito de los campos.
- [ ] 1.4.1 Uso del color: no como único indicador.
- [ ] 1.4.3 Contraste mínimo 4,5:1 (texto normal), 3:1 (grande).
- [ ] 1.4.4 Redimensionar texto hasta 200 %.
- [ ] 1.4.5 Imágenes de texto: evitar; si son necesarias, alt.
- [ ] 1.4.10 Reflow a 320 px sin scroll horizontal.
- [ ] 1.4.11 Contraste no textual 3:1 en controles y foco.
- [ ] 1.4.12 Espaciado de texto sin pérdida.
- [ ] 1.4.13 Contenido en hover/focus: descartable, hoverable, persistente.

### 2.2 Operable

- [ ] 2.1.1 Teclado: todo funciona.
- [ ] 2.1.2 Sin trampas de foco.
- [ ] 2.1.4 Atajos de una tecla: se pueden desactivar o reasignar.
- [ ] 2.2.1 Tiempo ajustable: sesión admin avisa antes de expirar.
- [ ] 2.2.2 Pausar/detener/ocultar movimiento.
- [ ] 2.3.1 Sin destellos > 3 por segundo.
- [ ] 2.4.1 Saltar bloques.
- [ ] 2.4.2 Título de página.
- [ ] 2.4.3 Orden de foco.
- [ ] 2.4.4 Propósito de los enlaces.
- [ ] 2.4.5 Múltiples vías: navegación, búsqueda, sitemap.
- [ ] 2.4.6 Encabezados y etiquetas descriptivos.
- [ ] 2.4.7 Foco visible.
- [ ] 2.4.11 Foco no oculto por cabecera fija.
- [ ] 2.5.1 Gestos: alternativa con un puntero.
- [ ] 2.5.2 Cancelación de puntero.
- [ ] 2.5.3 Etiqueta en el nombre.
- [ ] 2.5.4 Activación por movimiento: alternativa.
- [ ] 2.5.7 Movimientos de arrastre: alternativa (reordenar con botones).
- [ ] 2.5.8 Tamaño del objetivo ≥ 24×24 px (ideal 44×44).

### 2.3 Comprensible

- [ ] 3.1.1 Idioma de la página (`lang`).
- [ ] 3.1.2 Idioma de las partes.
- [ ] 3.2.1 Al recibir foco no cambia el contexto.
- [ ] 3.2.2 Al introducir datos no cambia el contexto.
- [ ] 3.2.3 Navegación consistente.
- [ ] 3.2.4 Identificación consistente.
- [ ] 3.2.6 Ayuda consistente.
- [ ] 3.3.1 Identificación de errores.
- [ ] 3.3.2 Etiquetas e instrucciones.
- [ ] 3.3.3 Sugerencia de corrección.
- [ ] 3.3.4 Prevención de errores (legales/financieros).
- [ ] 3.3.7 Entrada redundante: no pedir dos veces lo mismo.
- [ ] 3.3.8 Autenticación accesible: passkey/recovery sin puzzle cognitivo.

### 2.4 Robusto

- [ ] 4.1.2 Nombre, función, valor.
- [ ] 4.1.3 Mensajes de estado (`aria-live`).
- [ ] HTML válido y sin IDs duplicados.
- [ ] ARIA usado solo cuando HTML no alcanza.

---

## 3. Teclado

| Contexto | Tecla | Acción |
|---|---|---|
| Global | Tab / Shift+Tab | Navegar; foco visible. |
| Global | Enter / Space | Activar enlace/botón. |
| Cabecera | Esc | Cerrar menú móvil. |
| Lightbox | ← / → | Foto anterior/siguiente. |
| Lightbox | + / - | Zoom. |
| Lightbox | Esc | Cerrar y devolver foco. |
| Lightbox | Home / End | Primera/última. |
| Video | Space / K | Play/pausa. |
| Video | ← / → | Retroceder/avanzar 5 s. |
| Video | ↑ / ↓ | Volumen. |
| Video | M | Silenciar. |
| Video | F | Pantalla completa. |
| Video | C | Subtítulos. |
| Formulario | Enter | Enviar (si es el botón primario). |
| Admin | Ctrl/Cmd+S | Guardar (si no interfiere). |
| Admin | Esc | Cerrar modal sin guardar. |

- No se usan atajos de una sola tecla en el sitio público sin posibilidad de
  desactivarlos.
- El foco nunca queda atrapado fuera de un diálogo.
- Al cerrar un diálogo, el foco vuelve al disparador.

---

## 4. Foco

- Anillo de 2 px, offset 2 px, color `--focus`.
- Visible en ambos temas y sobre imágenes.
- La cabecera fija no tapa el elemento enfocado; `scroll-margin-top`.
- `:focus-visible` para teclado; no se elimina el outline sin reemplazo.
- En el lightbox, el foco se mueve al título y se anuncia la posición.
- En errores de formulario, el foco va al primer campo con error o al resumen.

---

## 5. Lectores de pantalla

- Un `h1` por página; jerarquía sin saltos.
- Landmarks: `header`, `nav`, `main`, `footer`, `aside` si aplica.
- Enlaces con texto descriptivo; sin “leer más” repetidos sin contexto.
- Imágenes: alt describe la foto; no repite el título.
- Decorativas: `alt=""`.
- Videos: `<track kind="captions">`; transcripción enlazada.
- Lightbox: `role="dialog"`, `aria-modal`, `aria-labelledby`, anuncio de
  posición.
- Cambios dinámicos: `aria-live="polite"` para resultados/estado; `alert` para
  errores críticos.
- Tablas del admin: `<caption>`, `<th scope>`.
- Formularios: label, `aria-describedby`, `aria-invalid`, resumen de errores.

---

## 6. Contraste y color

- Texto normal ≥ 4,5:1; grande ≥ 3:1.
- Componentes y foco ≥ 3:1.
- Enlaces en cuerpo subrayados; el color no es el único indicador.
- Estados con texto/icono además de color.
- Paleta validada en [`design-system.md`](design-system.md).
- Revisar con simulador de daltonismo, no solo contraste.

---

## 7. Movimiento y media

- `prefers-reduced-motion: reduce`:
  - sin parallax, pin, 3D animado, autoplay, preview en hover;
  - transiciones mínimas o ninguna;
  - el contenido sigue accesible.
- Sin autoplay con sonido.
- Video con controles; pausa disponible.
- Sin destellos ni movimiento brusco.
- El reel de la home se pausa al salir del viewport y con reduced-motion.

---

## 8. Formularios

- Labels visibles y asociados.
- Campos obligatorios marcados con texto, no solo asterisco.
- Instrucciones antes del campo; errores después.
- `autocomplete` correcto (`name`, `email`).
- No se pide repetir correo si no es necesario.
- El mensaje se conserva si falla el envío.
- Turnstile tiene alternativa o contacto por correo.
- El botón de enviar no se deshabilita sin explicar por qué.

---

## 9. Imágenes y medios

- Alt: describe sujeto, acción y contexto; no “imagen de”.
- Si la foto es abstracta, describir lo relevante.
- No usar el título como alt automático sin revisar.
- Fotos decorativas: `alt=""`.
- OG image: no necesita alt visible, pero sí texto alternativo en metadatos.
- Video: poster con alt; subtítulos; transcripción.
- Audio: transcripción.

---

## 10. Admin accesible

- Login con passkey: instrucciones claras; alternativa recovery.
- Subida: dropzone con botón; no solo drag & drop.
- Progreso: `role="progressbar"` con valor; texto.
- Tablas: headers, caption, acciones por fila con contexto.
- Reordenar: botones “subir/bajar” además de arrastrar.
- Estados: `aria-live`; no solo color.
- Modales: foco atrapado; Esc; devolver foco.
- Sesión: aviso antes de expirar; opción de extender.
- Errores: causa y acción; `traceId` copiable.

---

## 11. Pruebas

| Tipo | Herramienta | Frecuencia |
|---|---|---|
| Automática | axe-core / Playwright | Cada PR. |
| Teclado | Manual | Cada sprint. |
| Lector | NVDA (Windows) / VoiceOver (macOS/iOS) | Cada release. |
| Contraste | axe + manual | Cada cambio de token. |
| Zoom/reflow | Navegador 200/400 % | Cada release. |
| Reduced motion | Emulación | Cada sprint. |
| Formularios | Manual + axe | Cada cambio. |
| Admin | Manual + axe | Cada sprint. |

**Criterio de salida:** cero violaciones P1/P2 de axe; flujos principales
completables solo con teclado; lectura comprensible con NVDA/VoiceOver.

---

## 12. Limitaciones conocidas

- El 3D del hero es decorativo; no aporta información.
- La fotografía puede ser visualmente compleja; el alt debe compensar.
- El video sin voz no necesita subtítulos, pero sí título/descripción.
- La accesibilidad perfecta no se certifica; se documenta el esfuerzo razonable.
- El admin usa atajos; se documentan y se pueden desactivar.

---

## 13. Criterios de aceptación

- [ ] AC-22: lightbox accesible.
- [ ] AC-23: video accesible.
- [ ] AC-24: reduced motion.
- [ ] AC-35: admin móvil.
- [ ] AC-37: axe + teclado + lector sin P1/P2.
- [ ] AC-38: impresión legible.
