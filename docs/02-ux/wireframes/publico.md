# Wireframes públicos

**Estado:** borrador
**Base:** [`sitemap.md`](../sitemap.md) y [`flujos/visitante.md`](../flujos/visitante.md)

---

## 1. Home — escritorio

```text
┌──────────────────────────────────────────────────────────────────────┐
│ PB  Fotos  Videos  Colecciones  Sobre mí  Contacto     ES·EN  ◐     │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   PATRICIO BETANCOURT                                                │
│   Fotografía y video                                                 │
│   ··· una línea de enfoque ···                                       │
│                                                                      │
│   [Ver fotos]   [Ver videos]                                         │
│                                                                      │
│   ▣▣▣  fondo 3D / imagen estática (decorativa, aria-hidden)          │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ TRABAJOS DESTACADOS                                          [Ver todo]│
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                         │
│ │   ▣    │ │   ▣    │ │   ▣    │ │   ▣    │                         │
│ │ título │ │ título │ │ título │ │ título │                         │
│ └────────┘ └────────┘ └────────┘ └────────┘                         │
├──────────────────────────────────────────────────────────────────────┤
│ COLECCIONES                                                          │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                   │
│ │     ▣        │ │     ▣        │ │     ▣        │                   │
│ │ Colección    │ │ Colección    │ │ Colección    │                   │
│ │ 12 piezas    │ │ 8 piezas     │ │ 5 piezas     │                   │
│ └──────────────┘ └──────────────┘ └──────────────┘                   │
├──────────────────────────────────────────────────────────────────────┤
│ REEL DESTACADO                                                       │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │                              ▣                                   │ │
│ │                         [▶]  [🔇]                                │ │
│ └──────────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────┤
│ SOBRE MÍ                                          [Leer más]         │
│ ┌────────┐  ··· bio breve ···                                        │
│ │  ▣     │  [Desarrollo] [GitHub] [LinkedIn]                        │
│ └────────┘                                                           │
├──────────────────────────────────────────────────────────────────────┤
│ ¿TRABAJAMOS JUNTOS?                              [Contacto]          │
├──────────────────────────────────────────────────────────────────────┤
│ Fotos · Videos · Colecciones · Sobre mí · Contacto                   │
│ Privacidad · Términos · Accesibilidad · Créditos · RSS               │
│ © Patricio Betancourt · Desarrollo · GitHub · LinkedIn                │
└──────────────────────────────────────────────────────────────────────┘
```

**Anotaciones:**

- El `h1` es “Patricio Betancourt”; el subtítulo es un `p`.
- El hero tiene una sola imagen candidata a LCP.
- El canvas 3D es decorativo y no contiene texto ni enlaces.
- Si no hay medios, las secciones 2–4 se sustituyen por el estado vacío
  editorial; “Sobre mí” y “Contacto” permanecen.
- La cabecera es fija; al enfocar un enlace, hace scroll para no taparlo.

### Home — móvil

```text
┌──────────────────────────┐
│ PB              ☰   ◐    │
├──────────────────────────┤
│ PATRICIO BETANCOURT      │
│ Fotografía y video       │
│ ···                      │
│ [Ver fotos] [Ver videos] │
│ ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣        │
├──────────────────────────┤
│ DESTACADOS               │
│ ┌──────────────────────┐ │
│ │         ▣            │ │
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │         ▣            │ │
│ └──────────────────────┘ │
├──────────────────────────┤
│ ···                      │
└──────────────────────────┘
```

- El menú móvil es un diálogo con foco atrapado.
- Las tarjetas ocupan una columna; no hay hover obligatorio.

---

## 2. Galería — escritorio

```text
┌──────────────────────────────────────────────────────────────────────┐
│ PB  Fotos  Videos  Colecciones  Sobre mí  Contacto     ES·EN  ◐     │
├──────────────────────────────────────────────────────────────────────┤
│ FOTOS                                                                │
│ ··· introducción editorial ···                                      │
│                                                                      │
│ [Todas] [Colección ▾] [Etiqueta ▾] [Año ▾]        Orden: [Recientes ▾]│
├──────────────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                     │
│ │   ▣     │ │   ▣     │ │   ▣     │ │   ▣     │                     │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘                     │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                     │
│ │   ▣     │ │   ▣     │ │   ▣     │ │   ▣     │                     │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘                     │
├──────────────────────────────────────────────────────────────────────┤
│              [← Anterior]   Página 2 de 5   [Siguiente →]            │
└──────────────────────────────────────────────────────────────────────┘
```

**Anotaciones:**

- Cada miniatura es un `<a href>` real, no un botón.
- La proporción se conserva; no hay recorte agresivo.
- El filtro principal es una página real; las combinaciones viven en query.
- La primera fila puede usar prioridad alta; el resto `lazy`.
- La paginación es real y rastreable.

### Galería vacía

```text
FOTOS
··· introducción ···

┌────────────────────────────────────────────┐
│ AÚN NO HAY FOTOGRAFÍAS PUBLICADAS          │
│ Estoy preparando la primera selección.     │
│ [Ver videos]  [Sobre mí]                   │
└────────────────────────────────────────────┘
```

---

## 3. Detalle de foto — escritorio

```text
┌──────────────────────────────────────────────────────────────────────┐
│ PB  Fotos  Videos  Colecciones  Sobre mí  Contacto     ES·EN  ◐     │
├──────────────────────────────────────────────────────────────────────┤
│ Inicio / Fotos / Colección / Título                                  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                    ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣                              │
│                    ▣   foto sin recortes   ▣                              │
│                    ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣                              │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ Título de la foto                           [Compartir] [Ampliar]    │
│ ··· descripción ···                                                  │
│ Fecha · Colección · Etiquetas · Crédito · Licencia                   │
├──────────────────────────────────────────────────────────────────────┤
│ Anterior ◀  ···  ▶ Siguiente                                         │
├──────────────────────────────────────────────────────────────────────┤
│ RELACIONADOS                                                         │
│ ┌────────┐ ┌────────┐ ┌────────┐                                     │
│ │   ▣    │ │   ▣    │ │   ▣    │                                     │
│ └────────┘ └────────┘ └────────┘                                     │
├──────────────────────────────────────────────────────────────────────┤
│ © Patricio Betancourt · Todos los derechos reservados                │
└──────────────────────────────────────────────────────────────────────┘
```

**Lightbox:**

```text
┌──────────────────────────────────────────────────────────────────────┐
│ [×]                                                    1 / 12        │
│                                                                      │
│              ◀          ▣▣▣▣▣▣▣▣▣▣▣▣          ▶                     │
│                                                                      │
│ Título · descripción · [Compartir]                                   │
└──────────────────────────────────────────────────────────────────────┘
```

**Anotaciones:**

- La imagen es LCP: `fetchpriority=high`, sin lazy.
- El lightbox usa `<dialog>` o rol equivalente; foco atrapado.
- Esc cierra; flechas navegan; el foco vuelve al disparador.
- “Ampliar” tiene texto visible, no solo un icono.
- No hay botón de descarga del original.

---

## 4. Detalle de video

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Inicio / Videos / Título                                             │
├──────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │                              ▣                                   │ │
│ │                         [▶]                                      │ │
│ │  ─────────────●────────────  01:42 / 03:10                       │ │
│ │  [▶] [🔊] [⚙ 720p] [⛶]                                          │ │
│ └──────────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────┤
│ Título del video                                                     │
│ ··· descripción ···                                                  │
│ Fecha · Colección · Etiquetas · Duración · Licencia                  │
│ [Subtítulos ES] [Subtítulos EN] [Transcripción]                      │
├──────────────────────────────────────────────────────────────────────┤
│ RELACIONADOS                                                         │
└──────────────────────────────────────────────────────────────────────┘
```

**Anotaciones:**

- Los controles son etiquetados y usables con teclado.
- `poster` siempre presente; `preload=metadata`.
- Sin autoplay con sonido.
- El selector de calidad aparece solo si hay varias renditions.
- La transcripción es texto real, no una imagen.

---

## 5. Colección

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Inicio / Colecciones / Colección                                     │
├──────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │                       ▣ portada                                  │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│ COLECCIÓN                                                            │
│ Título                                                               │
│ ··· descripción ···                         12 piezas                │
├──────────────────────────────────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                         │
│ │   ▣    │ │   ▣    │ │   ▣    │ │   ▣    │                         │
│ └────────┘ └────────┘ └────────┘ └────────┘                         │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 6. Búsqueda

```text
┌──────────────────────────────────────────────────────────────────────┐
│ BUSCAR                                                               │
│ ( Busca por título, descripción, colección o etiqueta… )  [Buscar]  │
│ [Todo] [Fotos] [Videos] [Colecciones]                                │
├──────────────────────────────────────────────────────────────────────┤
│ 12 resultados para “atardecer”                                       │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ ▣  Título · Foto · Colección · ··· extracto ···                   │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ ▣  Título · Video · 02:10 · ··· extracto ···                      │ │
│ └──────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

**Sin resultados:**

```text
NO ENCONTRAMOS RESULTADOS PARA «{query}»
Prueba con otra palabra o quita los filtros.
[Limpiar filtros] [Ver todas las fotos] [Ver todos los videos]
```

---

## 7. Sobre mí

```text
┌──────────────────────────────────────────────────────────────────────┐
│ SOBRE MÍ                                                             │
│ ┌────────────┐                                                       │
│ │    ▣       │  ··· bio ES/EN ···                                    │
│ │  retrato   │  ··· enfoque artístico ···                            │
│ └────────────┘                                                       │
│ EQUIPO (opcional)                                                    │
│ ··· cámara, lente, formato ···                                       │
│ ENLACES                                                              │
│ [Desarrollo] [GitHub] [LinkedIn]                                     │
└──────────────────────────────────────────────────────────────────────┘
```

- No se inventan premios, clientes ni exposiciones.
- Si no hay equipo, la sección se omite.

---

## 8. Contacto

```text
┌──────────────────────────────────────────────────────────────────────┐
│ CONTACTO                                                             │
│ ¿Tienes un proyecto o una pregunta? Escríbeme.                       │
│                                                                      │
│ Nombre *         (________________________)                          │
│ Correo *         (________________________)                          │
│ Mensaje *        (________________________)                          │
│                  (________________________)                          │
│                  (máx. 5 000 caracteres)                             │
│ [ ] Acepto la política de privacidad *                               │
│                                                                      │
│ [Enviar mensaje]                                                     │
│                                                                      │
│ ¿Prefieres correo? [enlace autorizado]                               │
└──────────────────────────────────────────────────────────────────────┘
```

**Éxito:**

```text
✓ Mensaje enviado
Gracias por escribir. Te responderé al correo que indicaste.
[Volver al inicio]
```

`aria-live="polite"`, foco al mensaje, sin recargar.

---

## 9. Pie

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Fotos · Videos · Colecciones · Sobre mí · Contacto                   │
│ Privacidad · Términos · Accesibilidad · Créditos · RSS               │
│ © Patricio Betancourt · Todos los derechos reservados                │
│ [Desarrollo] [GitHub] [LinkedIn]                                     │
└──────────────────────────────────────────────────────────────────────┘
```

- El enlace “Desarrollo” es el interenlace obligatorio (`RF-P40`).
- Los enlaces externos indican que salen del sitio si es necesario.

---

## 10. Notas de responsive

| Elemento | 320–767 | 768–1023 | 1024+ |
|---|---|---|---|
| Cabecera | Logo, menú, tema | Logo, menú, tema | Navegación completa |
| Hero | Texto + imagen | Texto + imagen | Texto + 3D/imagen |
| Galería | 1 col | 2 col | 3–4 col |
| Detalle | Columna | Columna | Imagen + ficha lateral |
| Pie | Columna | 2 columnas | 3 columnas |

- La ficha del detalle puede ir debajo de la foto en móvil y al lado en desktop.
- No se oculta información esencial en móvil.
