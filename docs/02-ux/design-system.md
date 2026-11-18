# Design system

**Estado:** borrador para aprobación
**Fase:** 01 — UX
**Base:** [`sitemap.md`](sitemap.md), [`wireframes/`](wireframes/) y SRS sección 7

---

## 1. Dirección creativa

- **Editorial y cinematográfico.** La foto manda; el marco desaparece.
- **Contraste alto, ruido bajo.** Fondo oscuro neutro por defecto; modo claro
  “papel”.
- **Un solo acento.** El índigo `#6366f1` conecta con el portfolio de desarrollo,
  pero el texto usa variantes con contraste AA.
- **Movimiento con propósito.** Nada se mueve si no ayuda a entender.
- **El vacío también se diseña.** Los estados vacíos tienen composición, copy y
  una acción; no son un fallback.

---

## 2. Tokens de color

### 2.1 Tema oscuro (por defecto)

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `--bg` | `#0b0b0d` | Fondo base. | — |
| `--surface` | `#141417` | Tarjetas, cabecera. | — |
| `--surface-2` | `#1c1c21` | Hover, campos. | — |
| `--text` | `#f4f1ea` | Texto principal. | 17,43:1 sobre `--bg`. |
| `--text-muted` | `#a8a29e` | Texto secundario. | 7,80:1. |
| `--border` | `#2a2a31` | Separadores decorativos. | — |
| `--border-strong` | `#6b6b75` | Bordes de campos y controles. | 3,73:1. |
| `--accent` | `#6366f1` | Acento de marca, decorativo. | 4,40:1 (solo grande/UI). |
| `--accent-text` | `#a5b4fc` | Enlaces y texto de acento. | 9,86:1. |
| `--accent-hover` | `#c7d2fe` | Hover de enlaces. | 13,18:1. |
| `--accent-solid` | `#a5b4fc` | Botón primario (fondo). | Texto `#111` 9,47:1. |
| `--focus` | `#a5b4fc` | Anillo de foco. | 9,86:1. |
| `--danger` | `#fca5a5` | Errores/texto. | 8,6:1 aprox. |
| `--success` | `#86efac` | Éxito/texto. | 12,5:1 aprox. |
| `--warning` | `#fbbf24` | Advertencia/iconos. | 11,78:1. |

### 2.2 Tema claro

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `--bg` | `#f7f4ee` | Fondo base. | — |
| `--surface` | `#ffffff` | Tarjetas. | — |
| `--surface-2` | `#efeae1` | Hover, campos. | — |
| `--text` | `#17161a` | Texto principal. | 16,40:1. |
| `--text-muted` | `#5f5a52` | Texto secundario. | 6,23:1. |
| `--border` | `#d8d1c6` | Separadores. | — |
| `--border-strong` | `#8a8378` | Bordes de campos. | 3,42:1. |
| `--accent` | `#4f46e5` | Acento y enlaces. | 5,73:1. |
| `--accent-text` | `#4f46e5` | Enlaces/texto. | 5,73:1. |
| `--accent-hover` | `#3730a3` | Hover. | 9,05:1. |
| `--accent-solid` | `#4f46e5` | Botón primario. | Texto `#fff` 6,29:1. |
| `--focus` | `#4f46e5` | Anillo de foco. | 5,73:1. |
| `--danger` | `#b91c1c` | Errores. | 6,4:1 aprox. |
| `--success` | `#15803d` | Éxito. | 5,1:1 aprox. |
| `--warning` | `#92400e` | Advertencia. | 7,1:1 aprox. |

**Reglas:**

- Ningún texto esencial usa `--accent` `#6366f1` sobre fondo oscuro si es
  pequeño; se usa `--accent-text`.
- El color nunca es el único indicador de estado; se añade texto o icono.
- Los bordes de campos cumplen 3:1; los decorativos no necesitan.
- Las imágenes no llevan texto quemado.

---

## 3. Tipografía

| Rol | Fuente | Peso | Uso |
|---|---|---|---|
| Display | Fraunces (OFL) | 400/500/600 | Títulos, hero, citas. |
| Texto | Inter (OFL) | 400/500/600 | Cuerpo, UI, admin. |
| Mono | ui-monospace | 400 | Códigos, logs, `traceId`. |

- Autoalojadas, WOFF2, subset latino, `font-display: swap`.
- Preload solo de la display usada en el hero (1 archivo).
- Fallback: `Georgia, 'Times New Roman', serif` e `Inter, system-ui, sans-serif`.
- Ajustar métricas de fallback con `size-adjust` para evitar CLS.
- Máximo 2 familias y 4 archivos.

### Escala

| Token | Tamaño | Line-height | Uso |
|---|---|---|---|
| `--text-xs` | 12 px | 1.5 | Metadatos, badges. |
| `--text-sm` | 14 px | 1.5 | Ayuda, admin. |
| `--text-base` | 16 px | 1.6 | Cuerpo. |
| `--text-lg` | 18 px | 1.6 | Introducciones. |
| `--text-xl` | 20 px | 1.4 | Subtítulos. |
| `--text-2xl` | 24 px | 1.3 | Títulos de sección. |
| `--text-3xl` | 32 px | 1.2 | Títulos de página. |
| `--text-4xl` | 40 px | 1.15 | Detalle. |
| `--text-5xl` | 56 px | 1.1 | Hero. |
| `--text-6xl` | 72 px | 1.05 | Hero grande. |
| `--text-7xl` | 96 px | 1.0 | Solo display. |

- `clamp()` para display: `clamp(2.5rem, 6vw, 6rem)`.
- Ancho de línea: 60–68 caracteres.
- No justificar texto.
- No usar mayúsculas sostenidas en párrafos.

---

## 4. Espaciado, grid y layout

| Token | Valor |
|---|---|
| `--space-1` | 4 px |
| `--space-2` | 8 px |
| `--space-3` | 12 px |
| `--space-4` | 16 px |
| `--space-6` | 24 px |
| `--space-8` | 32 px |
| `--space-12` | 48 px |
| `--space-16` | 64 px |
| `--space-24` | 96 px |
| `--space-32` | 128 px |

- Grid de 12 columnas; `max-width: 1440px`; gutter 24 px (16 px móvil).
- Contenedor de texto: `max-width: 68ch`.
- Secciones: 96–128 px de separación en desktop; 48–64 px en móvil.
- Breakpoints: 480, 768, 1024, 1440, 1920.

### Radios y bordes

| Token | Valor | Uso |
|---|---|---|
| `--radius-none` | 0 | Fotos, tablas. |
| `--radius-sm` | 2 px | Inputs, chips. |
| `--radius-md` | 4 px | Botones, tarjetas. |
| `--radius-lg` | 8 px | Modales. |
| `--radius-full` | 9999 px | Avatares, pills. |

- Sombras mínimas; en oscuro se usan bordes y contraste.
- Sin glassmorphism ni degradados llamativos.

---

## 5. Iconografía

- Estilo lineal, 1,5 px de trazo, 20/24 px.
- Iconos de una familia consistente (Lucide o equivalente OFL/ISC).
- Siempre con texto o `aria-label`; nunca solo icono para acciones ambiguas.
- No se usan emojis como iconos de UI.
- Los iconos decorativos llevan `aria-hidden="true"`.

---

## 6. Componentes

### 6.1 Botones

| Variante | Fondo | Texto | Uso |
|---|---|---|---|
| Primario | `--accent-solid` | `#111` / `#fff` | Acción principal. |
| Secundario | transparente + borde | `--text` | Acción secundaria. |
| Ghost | transparente | `--accent-text` | Enlaces de acción. |
| Peligro | `--danger` | `#111`/`#fff` | Borrar, purgar. |

- Altura mínima 44 px; padding 12×20.
- Estados: normal, hover, focus-visible, active, disabled, loading.
- `disabled` explica por qué; no se usa para ocultar errores.
- Loading mantiene el ancho y muestra “Guardando…”.

### 6.2 Enlaces

- Subrayado visible en cuerpo; en navegación no, pero con hover/focus.
- `:focus-visible` con anillo de 2 px + offset 2 px.
- Enlaces externos con icono y texto accesible.
- Nunca “clic aquí”.

### 6.3 Chips y filtros

- Altura 32–36 px; área táctil ≥ 44 px con padding invisible.
- Estado activo con borde + check, no solo color.
- “Limpiar filtros” siempre visible si hay filtros activos.
- Los chips son enlaces reales cuando navegan; botones cuando filtran en cliente.

### 6.4 Tarjetas de medio

- Imagen con `aspect-ratio` real y `width`/`height`.
- Título y metadatos debajo; no sobre la imagen.
- Hover: zoom 1,03 y elevación sutil; sin mover el layout.
- Video: icono de reproducción + duración.
- Foco: anillo alrededor de toda la tarjeta.
- La tarjeta entera es un enlace; no hay acciones anidadas.

### 6.5 Lightbox

- `<dialog>` o rol `dialog` con `aria-modal`.
- Fondo casi opaco; la foto es lo único brillante.
- Controles: cerrar, anterior, siguiente, zoom, compartir.
- Teclado: flechas, `+`/`-`, `Esc`, `Home`/`End`.
- Foco atrapado y devuelto al disparador.
- Anuncio a SR: “Foto 3 de 12, título…”.
- Carga bajo demanda; no precargar todas las originales.

### 6.6 Reproductor de video

- `<video>` nativo + controles propios accesibles.
- Poster siempre; `preload=metadata`; `playsinline`.
- Botones: play/pausa, progreso, volumen, calidad, pantalla completa.
- Subtítulos con `<track>`; transcripción en texto.
- Sin autoplay con sonido; sin preview con reduced-motion.
- En error: poster + mensaje + enlace alternativo.

### 6.7 Formularios

- Label visible arriba; placeholder solo como ayuda.
- Ayuda antes del campo; error después, asociado con `aria-describedby`.
- Ancho mínimo 44 px de alto; no se usa solo borde inferior.
- Estados: normal, focus, error, disabled, éxito.
- El error resume el problema y cómo corregirlo.
- No se valida en cada tecla de forma agresiva; al salir o enviar.

### 6.8 Estados vacíos

- Título, texto breve, una acción principal y, si aplica, una secundaria.
- Ilustración/textura discreta, no una foto falsa.
- No “en construcción”.
- No ocupa toda la pantalla si hay navegación útil.
- Copy en ES/EN.

### 6.9 Skeletons

- Forma y proporción del contenido final.
- Animación de pulso lenta; se desactiva con reduced-motion.
- `aria-hidden="true"` + texto para SR.
- Nunca sustituyen un error; si falla, se convierten en error.

### 6.10 Alertas y toasts

- Alertas persistentes para errores que requieren acción.
- Toasts para confirmaciones no críticas; desaparecen en 5 s.
- `role="alert"` solo para errores; `aria-live="polite"` para el resto.
- No se usa toast para un backup fallido; va al dashboard.

### 6.11 Badges

- “Demo”: visible en admin y preview; en producción solo si el usuario decide.
- “Publicado”, “Borrador”, “Procesando”, “Error”: texto + color + icono.
- Nunca solo color.

### 6.12 Paginación

- Enlaces reales “Anterior/Siguiente” y números.
- Página actual con `aria-current="page"`.
- No se muestra si hay 0 o 1 página.
- Enlace a la primera/última si hay muchas.

### 6.13 Admin shell

- Sidebar colapsable; estado activo con `aria-current`.
- Contenido principal con `main` y un solo `h1`.
- Tablas con encabezados, caption y scroll accesible.
- Acciones destructivas separadas visualmente.
- El admin puede ser denso, pero no ilegible.

---

## 7. Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--duration-fast` | 150 ms | Hover, focus. |
| `--duration-base` | 250 ms | Entradas pequeñas. |
| `--duration-slow` | 400 ms | Revelados. |
| `--duration-slower` | 600 ms | Hero, lightbox. |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Principal. |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Transiciones. |

- Solo `transform` y `opacity`.
- Nada de animar `width`, `height`, `top`, `left`.
- Stagger ≤ 80 ms.
- `prefers-reduced-motion: reduce` desactiva parallax, pin, 3D animado y
  autoplay; deja solo fundidos mínimos o ninguno.
- Las animaciones empiezan después del LCP; el contenido es visible sin JS.

---

## 8. Imágenes y medios

- Formatos: AVIF, WebP, JPEG de respaldo.
- `srcset`/`sizes` según layout; nunca ampliar.
- `width`/`height` o `aspect-ratio` siempre.
- LCP: una sola imagen con `fetchpriority=high`, sin lazy.
- Resto: `loading=lazy`, `decoding=async`.
- Focal point para miniaturas/OG; el detalle no se recorta.
- Placeholder: color dominante + ThumbHash.
- Poster de video obligatorio.
- Sin marcas de agua visibles por defecto.

---

## 9. Voz y tono

- Español claro, directo, sin grandilocuencia.
- Inglés natural, no traducción literal.
- Primera persona para el about; segunda para el contacto.
- Sin “¡Hola!” ni exclamaciones en estados de error.
- Sin promesas de premios, clientes o exposiciones no verificadas.
- Sin tecnicismos innecesarios en el sitio público.
- En el admin, precisión: “Job #123 falló en la etapa de transcodificación”.

---

## 10. Accesibilidad del sistema

- Contraste AA en ambos temas (ver tablas).
- Foco visible con anillo de 2 px y offset.
- Áreas táctiles ≥ 44×44 px.
- `prefers-reduced-motion` respetado.
- No se usa color como único indicador.
- Tipografía escalable hasta 200 % sin romper.
- Formularios con labels y errores asociados.
- Medios con subtítulos/transcripción cuando hay voz.
- Probado con axe, teclado y NVDA/VoiceOver.

---

## 11. Implementación

```css
:root {
  color-scheme: dark;
  --bg: #0b0b0d;
  --surface: #141417;
  --surface-2: #1c1c21;
  --text: #f4f1ea;
  --text-muted: #a8a29e;
  --border: #2a2a31;
  --border-strong: #6b6b75;
  --accent: #6366f1;
  --accent-text: #a5b4fc;
  --accent-hover: #c7d2fe;
  --accent-solid: #a5b4fc;
  --focus: #a5b4fc;
  --danger: #fca5a5;
  --success: #86efac;
  --warning: #fbbf24;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --space-32: 128px;
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}

@media (prefers-color-scheme: light) {
  :root {
    color-scheme: light;
    --bg: #f7f4ee;
    --surface: #ffffff;
    --surface-2: #efeae1;
    --text: #17161a;
    --text-muted: #5f5a52;
    --border: #d8d1c6;
    --border-strong: #8a8378;
    --accent: #4f46e5;
    --accent-text: #4f46e5;
    --accent-hover: #3730a3;
    --accent-solid: #4f46e5;
    --focus: #4f46e5;
    --danger: #b91c1c;
    --success: #15803d;
    --warning: #92400e;
  }
}

:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}
```

- El tema se aplica antes del primer pintado con un script mínimo en `<head>`.
- No se usan cookies para el tema; `localStorage`.
- Los tokens viven en `packages/ui` cuando exista el código.

---

## 12. Pendientes

- [ ] Validar paleta con el usuario.
- [ ] Verificar licencias de Fraunces, Inter e iconos.
- [ ] Prototipo navegable con tokens.
- [ ] Medir contraste final en navegador.
- [ ] Definir componentes exactos de `packages/ui`.
