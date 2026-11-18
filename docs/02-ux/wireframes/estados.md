# Wireframes de estados

Referencia visual de estados vacíos, carga y error. El copy completo está en
[`flujos/estados.md`](../flujos/estados.md).

---

## 1. Home vacía

```text
┌──────────────────────────────────────────────────────────────┐
│ PB  Fotos  Videos  Colecciones  Sobre mí  Contacto   ES·EN ◐│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  PATRICIO BETANCOURT                                         │
│  Fotografía y video                                          │
│  ···                                                         │
│  [Ver fotos] [Ver videos]                                    │
│                                                              │
│  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  EL ARCHIVO SE ESTÁ PREPARANDO                               │
│  Fotografías y videos llegarán pronto.                       │
│  Mientras tanto, puedes conocer mi trabajo de desarrollo.    │
│  [Sobre mí] [Contacto] [Desarrollo]                          │
├──────────────────────────────────────────────────────────────┤
│  SOBRE MÍ                                                    │
│  ┌────────┐  ··· bio breve ···                                │
│  │  ▣     │  [Desarrollo] [GitHub] [LinkedIn]                │
│  └────────┘                                                  │
├──────────────────────────────────────────────────────────────┤
│  ¿TRABAJAMOS JUNTOS?                            [Contacto]   │
└──────────────────────────────────────────────────────────────┘
```

- Sin cuadrícula vacía, sin spinner, sin “en construcción”.
- La sección de trabajo se sustituye por una pieza editorial.
- El resto de la home sigue siendo útil.

---

## 2. Galería vacía

```text
┌──────────────────────────────────────────────────────────────┐
│ FOTOS                                                        │
│ ··· introducción editorial ···                                │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  AÚN NO HAY FOTOGRAFÍAS PUBLICADAS                     │  │
│  │  Estoy preparando la primera selección.                │  │
│  │  [Ver videos]  [Sobre mí]                              │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

- No hay paginación ni filtros vacíos.
- El enlace a videos evita un callejón sin salida.

---

## 3. Sin resultados de filtros

```text
┌──────────────────────────────────────────────────────────────┐
│ FOTOS                                                        │
│ [Todas] [Colección: Viajes ×] [Año: 2025 ×]                  │
│                                                              │
│  NINGUNA PIEZA COINCIDE CON ESTOS FILTROS                    │
│  Estás viendo: Colección “Viajes”, año 2025.                 │
│  [Quitar filtros]  [Ver todo]                                │
└──────────────────────────────────────────────────────────────┘
```

- Se nombran los filtros activos.
- Una acción principal: quitar filtros.

---

## 4. Skeletons de galería

```text
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ ░░░░░░░ │ │ ░░░░░░░ │ │ ░░░░░░░ │ │ ░░░░░░░ │
│ ░░░░░░░ │ │ ░░░░░░░ │ │ ░░░░░░░ │ │ ░░░░░░░ │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

- Misma proporción que la imagen final; sin salto de layout.
- Máximo 6 skeletons; luego se reemplazan por contenido o error.
- `aria-hidden="true"` + texto “Cargando fotos” para lectores.

---

## 5. 404

```text
┌──────────────────────────────────────────────────────────────┐
│ PB  Fotos  Videos  Colecciones  Sobre mí  Contacto           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  404                                                         │
│  NO ENCONTRAMOS ESTA PÁGINA                                  │
│  Puede que el enlace esté mal o que la pieza haya cambiado.  │
│                                                              │
│  [Ir al inicio]  [Ver fotos]  [Buscar]                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

- Código HTTP 404 real.
- Sin `noindex` en la página de error; no se incluye en sitemap.

---

## 6. 410

```text
┌──────────────────────────────────────────────────────────────┐
│  410                                                         │
│  ESTA PIEZA YA NO ESTÁ PUBLICADA                             │
│  El autor retiró este contenido.                             │
│  [Ver fotos]  [Ver videos]  [Inicio]                         │
└──────────────────────────────────────────────────────────────┘
```

- No se muestra un detalle vacío.
- No se redirige a la home en silencio.

---

## 7. 503

```text
┌──────────────────────────────────────────────────────────────┐
│  SITIO EN MANTENIMIENTO                                      │
│  Estamos actualizando el sitio. Vuelve en unos minutos.      │
│  [Reintentar]   Reintentar en: 5 min                         │
└──────────────────────────────────────────────────────────────┘
```

- `Retry-After` real.
- Sin navegación que dependa del backend caído.

---

## 8. Error de subida

```text
┌──────────────────────────────────────────────────────────────┐
│  SUBIR ARCHIVOS                                              │
│                                                              │
│  foto-001.jpg   ███████░░░ 70%  [Reanudar] [Cancelar]        │
│  ⚠ Se perdió la conexión. Se conservaron las partes.         │
│                                                              │
│  video-002.mp4  ✗ El archivo supera los 10 minutos.          │
│  [Elegir otro]                                               │
└──────────────────────────────────────────────────────────────┘
```

- El error explica el motivo exacto.
- La reanudación conserva el progreso.
- No se duplica al reintentar.

---

## 9. Conflicto de edición

```text
┌──────────────────────────────────────────────────────────────┐
│  ⚠ OTRA PESTAÑA CAMBIÓ ESTE ELEMENTO                         │
│  Tu versión es la 6; la actual es la 7.                      │
│  [Recargar y revisar]  [Ver diferencias]  [Cancelar]         │
└──────────────────────────────────────────────────────────────┘
```

- No se sobrescribe en silencio.
- El foco va al aviso.
- Los cambios locales no se pierden hasta decidir.

---

## 10. Alerta de backup

```text
┌──────────────────────────────────────────────────────────────┐
│  ⚠ LA ÚLTIMA COPIA FALLÓ                                     │
│  Última copia correcta: hace 36 h.                           │
│  [Reintentar]  [Ver runbook]  [Ver log]                      │
└──────────────────────────────────────────────────────────────┘
```

- Visible en el dashboard y en la sección de backups.
- No se oculta con un toast que desaparece.

---

## 11. Diálogo modal accesible

```text
┌──────────────────────────────────────────────┐
│  Confirmar rollback                     [×]  │
│                                              │
│  Volverás a la release 2026-11-16-2.         │
│  La versión actual seguirá disponible.       │
│                                              │
│  [Cancelar]                [Confirmar]       │
└──────────────────────────────────────────────┘
```

- Foco atrapado; Esc cierra; foco vuelve al disparador.
- La acción destructiva se nombra, no “OK”.
- Si requiere reauth, se pide antes de confirmar.

---

## 12. Offline

```text
┌──────────────────────────────────────────────┐
│  SIN CONEXIÓN                                │
│  No pudimos enviar el mensaje.               │
│  Tu texto se conserva.                       │
│  [Reintentar]                                │
└──────────────────────────────────────────────┘
```

- No se pierde el contenido del formulario.
- El aviso no depende del color.
