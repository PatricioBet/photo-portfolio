# Assets de demostración

**Estado:** carpeta preparada, sin assets todavía.
**Uso:** exclusivamente demostración, pruebas y prototipo.
**No son obra de Patricio Betancourt.**

---

## 1. Regla principal

Un asset demo **nunca** se presenta como fotografía o video real del autor. Si se
publica temporalmente para probar el sitio, debe:

1. estar marcado `is_demo: true` en la base de datos;
2. tener procedencia y licencia registradas en `manifest.json`;
3. poder retirarse sin romper el sitio;
4. retirarse antes del lanzamiento, salvo decisión explícita del usuario.

El sitio debe funcionar con **cero assets**. Los demo no son un requisito para
construir; son una ayuda para revisar el diseño.

---

## 2. Estructura

```text
assets/demo/
├── README.md          Este documento
├── manifest.json      Procedencia, licencia, hash y estado
├── images/            Fotos demo (JPEG/PNG/WebP)
├── video/             Clips demo (MP4/WebM)
└── posters/           Posters de video (JPEG/WebP)
```

Los archivos se nombran `demo-###.<ext>` con tres dígitos y un ID estable. No se
renombran después de registrarlos; si se reemplazan, se crea un ID nuevo y se
marca `replaced_by` en el anterior.

---

## 3. Fuentes permitidas

| Fuente | Licencia | Atribución | Nota |
|---|---|---|---|
| Generación con IA (herramienta interna u API oficial) | Según proveedor | Declarar como IA | Registrar modelo, prompt y fecha. |
| Unsplash (descarga manual) | Unsplash License | No obligatoria en descarga | No usar la API para evitar obligaciones de hotlink; verificar términos. |
| Pexels (descarga manual) | Pexels License | No obligatoria en descarga | La emisión de claves API está pausada; descargar manualmente. |
| Pixabay (descarga manual) | Content License | No obligatoria | No implicar que el contenido es propio. |
| Coverr (video) | Coverr License | No obligatoria en descarga | Verificar que el clip no sea preview premium. |
| Mixkit (video) | Free vs Restricted | Según clip | Revisar clip por clip; no mezclar licencias. |
| Openverse | Varía por ítem | Según ítem | Revisar la fuente original y la licencia exacta. |

**Prohibido:** imágenes de Google, capturas de sitios, fotos de personas sin
permiso, marcas/logos, contenido de Pinterest, bancos sin licencia clara y
cualquier archivo cuya procedencia no se pueda demostrar.

---

## 4. Manifest

Cada asset tiene una entrada en [`manifest.json`](manifest.json):

```json
{
  "id": "demo-001",
  "file": "images/demo-001.jpg",
  "sha256": "…",
  "mime": "image/jpeg",
  "width": 1600,
  "height": 1067,
  "status": "demo",
  "source": {
    "provider": "openai",
    "url": null,
    "creator": null,
    "creator_url": null,
    "retrieved_at": "2026-11-17"
  },
  "license": {
    "name": "Proveedor: términos de uso",
    "url": "https://…",
    "attribution_required": false,
    "attribution_text": null
  },
  "generation": {
    "model": "…",
    "prompt": "…",
    "seed": null,
    "generated_at": "2026-11-17",
    "tool_version": "…"
  },
  "digital_source_type": "trainedAlgorithmicMedia",
  "replaced_by": null,
  "notes": "Fixture de demostración; no es trabajo del autor."
}
```

Campos obligatorios: `id`, `file`, `sha256`, `mime`, dimensiones, `status`,
`source.provider`, `license.name`, `license.url` y `digital_source_type`.

Valores de `digital_source_type` (IPTC):

- `trainedAlgorithmicMedia`: generado por IA.
- `compositeWithTrainedAlgorithmicMedia`: editado con IA.
- `digitalCapture`: capturado con cámara.
- `compositeSynthetic`: mezcla.

Para video se añaden `duration_seconds`, `codec`, `width`, `height` y `poster`.

---

## 5. Cómo añadir un asset

1. **Elegir fuente**: generar con IA o descargar de una fuente permitida.
2. **Verificar licencia**: guardar URL, fecha y texto de la licencia.
3. **Revisar contenido**: sin personas identificables, marcas, logos, texto
   legible ni datos personales.
4. **Limpiar metadatos**: eliminar GPS y EXIF sensible.
5. **Calcular hash**: `sha256sum` o `Get-FileHash`.
6. **Registrar** la entrada en `manifest.json`.
7. **Probar** el pipeline y el sitio en modo demo.
8. **Revisar** que no se atribuya al autor y que se pueda borrar.

Para video: extraer poster, verificar duración y códec, y no pasar URLs remotas a
FFmpeg. Descargar primero.

---

## 6. Cómo retirar un asset

1. Marcar `replaced_by` con el ID del reemplazo o `null` si se elimina.
2. Cambiar `status` a `retired`.
3. Borrar el archivo del repositorio y del almacenamiento.
4. Ejecutar el comando de limpieza de demo.
5. Verificar que el sitio vuelve al estado vacío sin errores.

---

## 7. Integración con el pipeline

- Los demo usan el **mismo** pipeline que el contenido real: validación,
  re-codificación, variantes, poster y hashes.
- No existe una carpeta “especial” que evite validaciones.
- El build de producción excluye `assets/demo/` salvo que se active el modo demo
  de forma explícita.
- Un guard de CI falla si un asset con `status: demo` aparece en el bundle de
  producción.

---

## 8. Seguridad

- No se aceptan archivos de usuarios para demo.
- No se ejecutan scripts descargados.
- No se suben archivos a servicios externos sin decisión.
- Los archivos se validan por firma real y se re-codifican.
- No se publican originales; solo derivados.
- No se incluyen capturas con correos, IPs, tokens ni datos personales.

---

## 9. Estado actual

- `images/`, `video/` y `posters/` están vacías.
- `manifest.json` tiene `assets: []`.
- No se ha generado ni descargado ningún asset.
- La generación se hará en el sprint 6, después de aprobar el estado vacío en UX.

---

## 10. Referencias

- Unsplash License: <https://unsplash.com/license>
- Pexels License: <https://www.pexels.com/license/>
- Pixabay Content License: <https://pixabay.com/service/license-summary/>
- Coverr License: <https://coverr.co/license>
- Mixkit Licenses: <https://mixkit.co/license/>
- Openverse: <https://openverse.org/>
- IPTC Digital Source Type: <https://cv.iptc.org/newscodes/digitalsourcetype/>
- C2PA: <https://c2pa.org/>
