# Prototipo navegable — photo.patriciobet.dev

**Estado:** en revisión (Gate 1 no abierto hasta cerrar Gate 0)
**Fase:** 01 — Producto y UX
**Fecha:** 17 de noviembre de 2026
**Alcance:** artefacto de revisión de diseño. **No es código de producción.**

---

## 1. Qué es

Un prototipo estático, sin build y sin dependencias, que permite recorrer las
pantallas y estados definidos en [`sitemap.md`](../sitemap.md) y
[`wireframes/`](../wireframes/README.md), en español e inglés, con contenido demo
o vacío.

Sirve para validar:

- jerarquía, navegación y tono editorial;
- estados vacíos y estados sin resultados;
- ficha de foto, lightbox, detalle de video y búsqueda;
- formulario de contacto, validación y confirmación;
- panel de administración simplificado (dashboard, medios, publicar);
- tema claro/oscuro, responsive y foco de teclado.

No sirve para validar: autenticación, subida real, procesamiento de medios,
persistencia, SEO técnico ni rendimiento de producción.

---

## 2. Cómo abrirlo

Abrir directamente en un navegador moderno:

```text
docs/02-ux/prototipo/index.html
```

No necesita servidor. Si el navegador bloquea `localStorage` en `file://`, el
prototipo sigue funcionando sin recordar idioma, tema o modo.

Rutas por hash:

| Ruta | Pantalla |
|---|---|
| `#/` | Home |
| `#/fotos` | Galería de fotos |
| `#/fotos/{slug}` | Detalle de foto |
| `#/videos` | Galería de videos |
| `#/videos/{slug}` | Detalle de video |
| `#/colecciones` | Colecciones |
| `#/colecciones/{slug}` | Colección |
| `#/sobre-mi` | Sobre mí |
| `#/contacto` | Contacto |
| `#/buscar` | Búsqueda |
| `#/privacidad`, `#/terminos`, `#/accesibilidad`, `#/creditos`, `#/rss` | Estados legales pendientes |
| `#/admin`, `#/admin/media`, `#/admin/publish` | Panel simplificado |

La barra amarilla superior es del prototipo, no del sitio:

- **Contenido: demo/vacío** alterna el catálogo;
- **EN/ES** cambia el idioma;
- **Tema** cicla oscuro → claro → sistema;
- **Admin** abre el panel.

---

## 3. Contenido demo

No hay fotografías ni videos reales. Las piezas son degradados CSS abstractos,
marcados con la etiqueta `DEMO`, y el manifest
([`assets/demo/manifest.json`](../../../assets/demo/manifest.json)) sigue vacío.
Ninguna pieza se atribuye a Patricio Betancourt. La ficha muestra
"Demostración (no es obra del autor)".

Cuando exista contenido real, se reemplazan los objetos de `data.js` por datos
del build y se retiran los badges.

---

## 4. Archivos

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Shell, header, footer, `<dialog>` del lightbox, skip link. |
| `styles.css` | Tokens del design system, layout, estados, responsive, print. |
| `data.js` | Diccionarios ES/EN y catálogo demo. |
| `views.js` | Vistas públicas en plantillas de cadena. |
| `admin.js` | Vistas del panel simplificado. |
| `app.js` | Estado, rutas hash, tema, idioma, lightbox, formulario y simulación de publicación. |

Sin frameworks, sin red, sin analítica, sin cookies.

---

## 5. Validación ejecutada

**Fecha:** 17 de noviembre de 2026.

| Prueba | Método | Resultado |
|---|---|---|
| Sintaxis JS | `node --check` en los 4 archivos | PASA |
| Claves i18n | 194 claves usadas; paridad ES/EN de 212 claves | 0 faltantes, 0 diferencias |
| Render de rutas | Chrome headless vía CDP, 15 rutas | 0 excepciones, 0 errores de consola |
| Rutas inexistentes | `#/fotos/no-existe`, `#/404` | Estado 404, sin error |
| Modo vacío | Home y `/fotos/` con 0 piezas | Estados vacíos completos, sin tarjetas |
| Idioma | Toggle EN | `lang=en`, copy y título en inglés |
| Lightbox | Abrir, flecha derecha, Escape | Foco atrapado en el diálogo; vuelve al disparador |
| Formulario | Envío vacío y envío válido | 4 errores con foco en el primero; confirmación con foco |
| Búsqueda | «luz» y «zzzz» | 2 resultados y estado sin resultados |
| Teclado | Skip link, menú, filtros, lightbox | Navegable; foco visible |
| axe-core 4.10.2 | WCAG 2.0/2.1/2.2 A y AA en 15 rutas, lightbox y vacío | 0 violaciones |
| Contraste manual | Tokens de texto/fondo en ambos temas | Mínimo 5.73:1 (AA) |
| Móvil | 390 × 844 en home, fotos y admin | Sin desbordes horizontales |

Limitaciones de la evidencia:

- axe no puede medir contraste sobre degradados; se verificó la paleta, no cada
  píxel de las piezas demo;
- no se probó con NVDA/VoiceOver reales;
- el foco del lightbox se probó con activación programática y teclado, no con
  lector de pantalla;
- no hay pruebas en Safari/iOS.

Estas pruebas no sustituyen el Gate 1 ni la auditoría de accesibilidad de S8.

---

## 6. Limitaciones conocidas

- La autenticación es simulada: el panel es público en el prototipo.
- La subida solo cuenta archivos; no valida ni envía nada.
- La publicación simula 1,4 s; no hay build ni releases.
- La búsqueda es un `indexOf` sobre el catálogo demo, no Pagefind.
- El video es un reproductor simulado; no hay `<video>` ni HLS.
- Los textos legales son avisos de "pendiente"; no son los definitivos.
- El correo alternativo no se muestra: falta la decisión `D-10`.
- La bio es un borrador sin validar por el autor.

---

## 7. Reglas para modificarlo

- No añadir dependencias ni red: el prototipo debe abrir con doble clic.
- Todo texto visible va en `data.js`, en ES y EN.
- Todo control debe funcionar con teclado y tener nombre accesible.
- Las piezas demo llevan badge `DEMO` y no se atribuyen al autor.
- No incluir datos personales, correos, tokens, rutas locales ni capturas con
  información sensible.
- Si cambia un flujo, actualizar primero el wireframe o el SRS; el prototipo no
  es fuente de verdad.

---

## 8. Siguiente paso

1. Cerrar los P1/P2 del
   [reporte de revisión](../../04-calidad/reportes/sprint-0-revision-srs.md).
2. Aprobación del usuario del Gate 0.
3. Revisión del prototipo contra los criterios del Gate 1.
4. Convertir las decisiones aprobadas en componentes reales en S6.
