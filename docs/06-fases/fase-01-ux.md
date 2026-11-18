# Fase 01 — Producto y UX

**Estado:** en revisión. Entregables escritos y prototipo validado técnicamente;
el Gate 1 no se abre hasta cerrar el Gate 0.
**Depende de:** aprobación de la [Fase 00](fase-00-gestion.md).
**Bloqueo actual:** [revisión independiente del SRS](../04-calidad/reportes/sprint-0-revision-srs.md)
rechazó el Gate 0 con 4 P1 y 14 P2.
**Siguiente fase:** `fase-02-arquitectura.md` (pendiente).

---

## Objetivo

Convertir los requisitos del SRS en una experiencia navegable, accesible y
aprobable antes de escribir código de producción.

## Entregables

| Entregable | Archivo | Estado | Evidencia |
|---|---|---|---|
| Sitemap ES/EN | [`sitemap.md`](../02-ux/sitemap.md) | en revisión | Commit `3ebbd18`. |
| Flujos de visitante y admin | [`flujos/`](../02-ux/flujos/README.md) | en revisión | Commit `3ebbd18`. |
| Wireframes y estados | [`wireframes/`](../02-ux/wireframes/README.md) | en revisión | Commit `c1322a7`. |
| Design system | [`design-system.md`](../02-ux/design-system.md) | en revisión | Commit `a2f3258`. |
| Accesibilidad | [`accesibilidad.md`](../02-ux/accesibilidad.md) | en revisión | Commit `a2f3258`. |
| Casos de uso | [`actores-casos-uso.md`](../01-producto/actores-casos-uso.md) | en revisión | Commit `857df73`. |
| Criterios y UAT | [`criterios-aceptacion.md`](../01-producto/criterios-aceptacion.md) | en revisión | Commit `11be2c8`. |
| Copy ES/EN | [`contenido-copy-es-en.md`](../01-producto/contenido-copy-es-en.md) | en revisión | Commit `46b1f0a`. |
| Legal y privacidad | [`legal-privacidad.md`](../01-producto/legal-privacidad.md) | en revisión | Commit `6d9f9f3`; falta revisión legal. |
| Prototipo navegable | [`prototipo/`](../02-ux/prototipo/README.md) | en revisión | 15 rutas, 0 errores de consola, 0 violaciones axe; ver README del prototipo. |

## Correcciones pendientes que afectan a esta fase

| Hallazgo | Impacto en UX | Acción |
|---|---|---|
| P2-1 | Rutas legales, `/etiquetas/`, paginación y home EN no están en `RF-P01`. | Completar inventario antes de aprobar el sitemap. |
| P2-2 / P2-3 | El alcance real de v1 no coincide con las prioridades. | Revisar qué se prototipa y qué se difiere. |
| P2-6 | Passkey por CLI vs onboarding en UI. | Decidir el flujo del panel. |
| P2-8 | Demo al lanzar o sitio vacío. | Decidir si el prototipo demo representa el lanzamiento. |
| P2-10 | Faltan criterios WCAG AA en el SRS. | Completar checklist y requisitos. |
| P2-12 | Falta el estado `trashed` en `RF-A30`. | Añadir el flujo de papelera al panel. |
| P2-13 | Alt con IA vs privacidad. | No prototipar la sugerencia IA hasta decidir. |

## Gate

- [ ] Gate 0 aprobado (bloqueado por los P1/P2 del reporte).
- [ ] Prototipo navegable aprobado por el usuario.
- [ ] Todos los estados (vacío, carga, error, sin resultados) diseñados.
- [x] Contraste, foco, teclado y movimiento revisados en el prototipo.
- [x] Copy ES/EN sin lorem ipsum.
- [ ] Sin decisiones de arquitectura tomadas por conveniencia visual.
- [ ] Revisión independiente del prototipo (autor ≠ revisor).
- [ ] Prueba con NVDA/VoiceOver y Safari/iOS.

## Evidencia técnica del prototipo

- `node --check` en `data.js`, `views.js`, `admin.js` y `app.js`: pasa.
- 194 claves `t()` usadas; 212 claves por idioma; 0 faltantes; paridad ES/EN.
- Chrome headless: 15 rutas sin errores de consola ni excepciones.
- axe-core 4.10.2 (WCAG 2.0/2.1/2.2 A y AA): 0 violaciones en 15 rutas,
  lightbox abierto y modo vacío.
- Contraste manual de tokens: mínimo 5.73:1.
- Formulario: 4 errores con foco en el primero; confirmación con `aria-live` y
  foco en el mensaje.
- Lightbox: foco atrapado, flechas, Escape y retorno al disparador.
- 390 × 844: home, fotos y admin sin desbordes.

Repetir estas pruebas en cada cambio del prototipo; no sustituyen la auditoría de
accesibilidad de S8.
