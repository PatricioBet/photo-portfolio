# Flujos UX

Índice de flujos de la fase 01. Cada flujo describe el camino feliz, los errores,
los estados vacíos y los criterios de aceptación.

| Flujo | Archivo | Actor | Requisitos |
|---|---|---|---|
| Visitante | [`visitante.md`](visitante.md) | Visitante | RF-P01–RF-P93 |
| Administrador | [`admin.md`](admin.md) | Patricio | RF-A01–RF-A50 |
| Estados | [`estados.md`](estados.md) | Ambos | RF-P06–RF-P09, RF-P32, RF-A07, RF-A46 |
| Recuperación | [`admin.md#11-recuperación`](admin.md#11-recuperación) | Patricio | RF-A03, RF-A49, SEG-04–SEG-05 |

## Convenciones

- `→` acción del usuario; `⇒` respuesta del sistema.
- Los tiempos son objetivos, no promesas absolutas.
- Todo error tiene causa legible, acción posible y `traceId` si es del servidor.
- Todo estado vacío tiene contexto, no solo “no hay nada”.
- Ningún flujo requiere JavaScript para leer o navegar.
