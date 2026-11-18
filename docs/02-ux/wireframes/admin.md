# Wireframes del admin

**Origen:** `https://admin-photo.patriciobet.dev`
**Estado:** borrador
**Base:** [`flujos/admin.md`](../flujos/admin.md)

---

## 1. Login

```text
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                        PB                                    │
│              ADMINISTRACIÓN DE FOTOGRAFÍA                    │
│                                                              │
│              Acceso protegido por Cloudflare Access          │
│                                                              │
│                    [Usar passkey]                            │
│                                                              │
│              ¿Perdiste tu dispositivo?                       │
│              [Usar código de recuperación]                   │
│                                                              │
│              Sesión segura · Sin contraseñas                 │
└──────────────────────────────────────────────────────────────┘
```

- No hay campo de contraseña ni registro.
- Si Access no autenticó, la app no muestra el botón de passkey.
- El error es genérico; el detalle va al log.
- `noindex` y sin enlaces desde el sitio público.

---

## 2. Dashboard — escritorio

```text
┌────────────┬─────────────────────────────────────────────────────────────┐
│ PB         │  ESTADO                                    Patricio ▾       │
│            ├─────────────────────────────────────────────────────────────┤
│ ▸ Estado   │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│   Medios   │  │ Fotos 12   │ │ Videos 3   │ │ Borradores │ │ Papelera │ │
│   Colecc.  │  │ publicadas │ │ publicados │ │ 4          │ │ 1        │ │
│   Etiquetas│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
│   Publicar │                                                             │
│   Releases │  ┌─────────────────────────────┐ ┌───────────────────────┐ │
│   Actividad│  │ CHECKLIST DE LANZAMIENTO    │ │ ESTADO DEL SISTEMA    │ │
│   Ajustes  │  │ ✓ Passkey de respaldo       │ │ Último build: hace 2h │ │
│            │  │ ✓ Backup activo             │ │ Último backup: hace 6h│ │
│            │  │ ○ Contenido real            │ │ Disco: 42%            │ │
│            │  │ ○ Demo retirado             │ │ Cola: 0               │ │
│            │  └─────────────────────────────┘ └───────────────────────┘ │
│            │                                                             │
│            │  ÚLTIMOS TRABAJOS                                           │
│            │  ┌─────────────────────────────────────────────────────────┐│
│            │  │ foto-001.jpg · procesado · hace 10 min                  ││
│            │  │ video-002.mp4 · en cola · hace 2 min                    ││
│            │  └─────────────────────────────────────────────────────────┘│
└────────────┴─────────────────────────────────────────────────────────────┘
```

- Si el sitio está vacío, el checklist ocupa el centro.
- Las tarjetas de estado son enlaces a la sección correspondiente.
- Las alertas (backup viejo, disco > 80 %, cola atascada) aparecen arriba.

---

## 3. Biblioteca de medios

```text
┌────────────┬─────────────────────────────────────────────────────────────┐
│ PB         │  MEDIOS                          [+ Subir]  [Acciones ▾]   │
│            ├─────────────────────────────────────────────────────────────┤
│ ▸ Estado   │  [Todo] [Fotos] [Videos] [Borradores] [Publicados]         │
│   Medios   │  [Colección ▾] [Etiqueta ▾]        Buscar: (__________)    │
│   ...      ├─────────────────────────────────────────────────────────────┤
│            │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                       │
│            │  │ ▣    │ │ ▣    │ │ ▣    │ │ ▣    │                       │
│            │  │ ☑    │ │ ☐    │ │ ☐    │ │ ☐    │                       │
│            │  │ título│ │ título│ │ título│ │ título│                     │
│            │  │ Foto  │ │ Video│ │ Foto  │ │ Foto  │                     │
│            │  │ ● Pub.│ │ ○ Borr│ │ ◐ Proc│ │ ● Pub.│                     │
│            │  └──────┘ └──────┘ └──────┘ └──────┘                       │
│            │                                                             │
│            │  [Seleccionar todo]  12 seleccionados                       │
│            │  [Aplicar colección] [Aplicar etiqueta] [Publicar] [Borrar] │
│            ├─────────────────────────────────────────────────────────────┤
│            │  Página 1 de 3   [← Anterior] [Siguiente →]                  │
└────────────┴─────────────────────────────────────────────────────────────┘
```

- Cada tarjeta muestra estado, tipo y título; el alt no se muestra.
- La selección múltiple es accesible con teclado.
- “Borrar” va a papelera, no purga.
- Los filtros no recargan la página si hay JS; sin JS, son enlaces.

---

## 4. Subida

```text
┌────────────┬─────────────────────────────────────────────────────────────┐
│ PB         │  SUBIR ARCHIVOS                                             │
│            ├─────────────────────────────────────────────────────────────┤
│            │  ┌───────────────────────────────────────────────────────┐  │
│            │  │  Arrastra fotos o videos aquí                         │  │
│            │  │  o [selecciona archivos]  o pega desde el portapapeles│  │
│            │  │  Fotos: JPEG/PNG/WebP/AVIF/TIFF ≤ 50 MB, 200 MP       │  │
│            │  │  Videos: MP4/MOV/WebM ≤ 2 GB, 10 min, 4K              │  │
│            │  └───────────────────────────────────────────────────────┘  │
│            │                                                             │
│            │  foto-001.jpg   ██████████░░ 82%  [Pausar] [Cancelar]       │
│            │  video-002.mp4  ███░░░░░░░░ 24%  [Pausar] [Cancelar]       │
│            │  foto-003.jpg   ✓ subido  → en cola                         │
│            │  foto-004.jpg   ⚠ duplicado  [Continuar] [Descartar]        │
│            │                                                             │
│            │  [Subir 4 archivos]                                         │
└────────────┴─────────────────────────────────────────────────────────────┘
```

- El progreso es por archivo, no global.
- Reanudar tras cerrar el navegador.
- El duplicado avisa, no bloquea.
- Los errores muestran el motivo exacto.

---

## 5. Detalle de medio

```text
┌────────────┬─────────────────────────────────────────────────────────────┐
│ PB         │  ← Medios   foto-001.jpg            [Vista previa] [Guardar]│
│            ├───────────────────────────┬─────────────────────────────────┤
│            │                           │  ESTADO                         │
│            │        ┌───────────┐      │  ● Publicado                    │
│            │        │           │      │  Versión 7                      │
│            │        │    ▣      │      │  [Despublicar] [Borrar]         │
│            │        │           │      ├─────────────────────────────────┤
│            │        └───────────┘      │  ESPAÑOL                        │
│            │                           │  Título (____________________)  │
│            │        [Punto focal]      │  Alt *  (____________________)  │
│            │        [Poster]           │  Descripción (_______________)  │
│            │                           │  Slug (_______________________) │
│            │                           ├─────────────────────────────────┤
│            │                           │  INGLÉS                         │
│            │                           │  Título (____________________)  │
│            │                           │  Alt *  (____________________)  │
│            │                           ├─────────────────────────────────┤
│            │                           │  ORGANIZACIÓN                   │
│            │                           │  Fecha · Colección · Etiquetas  │
│            │                           │  Licencia · Crédito · Destacado │
│            │                           │  Orden · ¿Demo?                 │
│            └───────────────────────────┴─────────────────────────────────┘
```

- Los campos obligatorios se marcan con `*` y texto, no solo color.
- El alt ES es obligatorio para publicar; EN si habrá página EN.
- El punto focal se ajusta con vista previa de miniatura.
- El conflicto de versión muestra un aviso y no guarda a ciegas.

---

## 6. Colecciones

```text
┌────────────┬─────────────────────────────────────────────────────────────┐
│ PB         │  COLECCIONES                              [+ Nueva]         │
│            ├─────────────────────────────────────────────────────────────┤
│            │  ≡  Nombre            Elementos   Portada      Estado       │
│            │  ≡  Viajes            12          ▣            Publicada    │
│            │  ≡  Retratos          8           ▣            Publicada    │
│            │  ≡  Sin título       0           —            Borrador     │
│            │                                                             │
│            │  Arrastra ≡ para ordenar. Los cambios se guardan solos.     │
└────────────┴─────────────────────────────────────────────────────────────┘
```

- Reordenar con teclado además de arrastrar.
- Una colección sin elementos no se publica.
- Borrar una colección no borra sus medios.

---

## 7. Publicación y releases

```text
┌────────────┬─────────────────────────────────────────────────────────────┐
│ PB         │  PUBLICAR                                                   │
│            ├─────────────────────────────────────────────────────────────┤
│            │  Cambios pendientes: 3                                     │
│            │  [Publicar cambios]                                        │
│            │                                                             │
│            │  Build actual: ● Construyendo (00:42)                      │
│            │  ┌───────────────────────────────────────────────────────┐  │
│            │  │ 12:04  build #128  ✓ 1m 12s  → release 2026-11-17-1  │  │
│            │  │ 11:02  build #127  ✗ 0m 48s  → error de tipo          │  │
│            │  │ 10:15  build #126  ✓ 1m 05s  → release 2026-11-17-0  │  │
│            │  └───────────────────────────────────────────────────────┘  │
│            │                                                             │
│            │  RELEASES VIVAS                                             │
│            │  ● 2026-11-17-1 (actual)   [Ver] [Rollback]                │
│            │  ○ 2026-11-17-0            [Ver] [Rollback]                │
│            │  ○ 2026-11-16-2            [Ver] [Rollback]                │
└────────────┴─────────────────────────────────────────────────────────────┘
```

- Publicar agrupa cambios de 60 s.
- Un build fallido no cambia `current`.
- Rollback pide confirmación y registra actor.
- Los logs no muestran secretos.

---

## 8. Seguridad

```text
┌────────────┬─────────────────────────────────────────────────────────────┐
│ PB         │  SEGURIDAD                                                  │
│            ├─────────────────────────────────────────────────────────────┤
│            │  PASSKEYS                                                   │
│            │  ● MacBook · añadida 2026-11-17 · último uso hoy            │
│            │  ● YubiKey · añadida 2026-11-17 · último uso hace 3 días    │
│            │  [+ Añadir passkey]                                        │
│            │                                                             │
│            │  CÓDIGOS DE RECUPERACIÓN                                    │
│            │  Quedan 8 de 10 · [Regenerar] (requiere reauth)             │
│            │                                                             │
│            │  SESIONES                                                   │
│            │  Este dispositivo · Quito · hace 2 min · [Revocar]          │
│            │  [Cerrar todas las sesiones]                                │
│            │                                                             │
│            │  ÚLTIMOS EVENTOS                                            │
│            │  ✓ Login correcto · hace 2 min                              │
│            │  ⚠ Intento fallido · hace 1 h                               │
└────────────┴─────────────────────────────────────────────────────────────┘
```

- Nunca se muestran códigos después de crearlos.
- Las acciones destructivas piden reauth.
- Los eventos no incluyen secretos.

---

## 9. Backups

```text
┌────────────┬─────────────────────────────────────────────────────────────┐
│ PB         │  BACKUPS                                                    │
│            ├─────────────────────────────────────────────────────────────┤
│            │  Última copia: hoy 03:30 · 2.4 GB · ✓ correcta              │
│            │  Próxima: mañana 03:30                                      │
│            │  Retención: 30 diarias + 12 mensuales                       │
│            │  Offsite: R2 + B2 · ✓ verificado hace 6 días                │
│            │                                                             │
│            │  [Ejecutar ahora]  [Verificar integridad]  [Restore]        │
│            │                                                             │
│            │  HISTORIAL                                                  │
│            │  2026-11-17 03:30  ✓ 2.4 GB  PostgreSQL + medios + config   │
│            │  2026-11-16 03:30  ✓ 2.3 GB  ...                            │
│            │  2026-11-15 03:30  ✗ error de red  [Ver log]                │
└────────────┴─────────────────────────────────────────────────────────────┘
```

- “Restore” exige reauth y confirmación escrita.
- Si el backup falla, alerta visible y enlace al runbook.
- El admin no permite descargar backups por HTTP.

---

## 10. Actividad

```text
┌────────────┬─────────────────────────────────────────────────────────────┐
│ PB         │  ACTIVIDAD                            [Exportar JSON/CSV]   │
│            ├─────────────────────────────────────────────────────────────┤
│            │  Fecha ↓     Acción        Objeto          IP        UA    │
│            │  17/11 12:04 publicar      foto-001        192.0.2.x  ...   │
│            │  17/11 11:02 build_error   build #127      192.0.2.x  ...   │
│            │  17/11 10:15 login         —                192.0.2.x  ...   │
│            └─────────────────────────────────────────────────────────────┘
```

- Solo lectura; append-only.
- IP truncada/hasheada salvo investigación.
- Exportación con permisos y registro.

---

## 11. Admin móvil

```text
┌──────────────────────────┐
│ PB            ☰          │
├──────────────────────────┤
│ ESTADO                   │
│ ┌──────────┐ ┌─────────┐ │
│ │ Fotos 12 │ │ Videos 3│ │
│ └──────────┘ └─────────┘ │
│ ┌──────────────────────┐ │
│ │ Checklist            │ │
│ │ ✓ passkey            │ │
│ │ ✓ backup             │ │
│ │ ○ contenido real     │ │
│ └──────────────────────┘ │
│ [Subir] [Publicar]       │
└──────────────────────────┘
```

- Subida desde cámara/teléfono.
- Acciones principales a un toque, sin hover.
- Tablas se convierten en tarjetas; no scroll horizontal.

---

## 12. Notas de accesibilidad

- El menú lateral es `<nav>` con `aria-current`.
- Las tablas usan `<th scope>` y caption.
- Los formularios tienen label, ayuda y error asociados.
- El foco se mueve al primer error al guardar.
- Los estados se anuncian con `aria-live`.
- Los botones de icono tienen `aria-label`.
- La reautenticación no borra el formulario.
