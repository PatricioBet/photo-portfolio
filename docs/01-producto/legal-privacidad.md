# Legal, privacidad y licencias

**Estado:** borrador para revisión legal
**Fase:** 01 — Producto
**Fecha:** 17 de noviembre de 2026
**Base:** [`SRS v1.1`](../00-gestion/srs-v1.1.md), secciones 13 y 15
**Aviso:** este documento **no es asesoría legal**. Antes de publicar debe revisarlo
una persona con conocimiento de la normativa aplicable en Ecuador y, si hay
visitantes en la UE, del RGPD.

---

## 1. Alcance

Aplica a:

- `https://photo.patriciobet.dev` (sitio público);
- `https://admin-photo.patriciobet.dev` (panel privado);
- el formulario de contacto y su Worker;
- los backups y la infraestructura autoalojada.

No aplica a `patriciobet.dev` ni a otros subdominios, que tienen sus propias
políticas.

---

## 2. Responsable del tratamiento

| Campo | Valor | Estado |
|---|---|---|
| Nombre | Patricio Betancourt | confirmado en el SRS. |
| País | Ecuador | confirmado en el SRS (Loja). |
| Correo de privacidad | **pendiente** | no publicar hasta decidir `D-10`. |
| Dirección postal | **no se publica** | se ofrece contacto por el formulario. |
| Delegado de protección de datos | no aplica en v1 | revisar si cambia el volumen. |

Mientras no exista un correo dedicado, el canal para ejercer derechos es el
formulario de contacto, indicando "Privacidad" en el asunto. El formulario no
guarda el mensaje en la base de datos; se envía al proveedor de correo.

---

## 3. Datos que se tratan

### 3.1 Visitantes

| Dato | Origen | Finalidad | Obligatorio | Retención |
|---|---|---|---|---|
| Nombre | Formulario. | Responder. | Sí. | Según proveedor de correo; objetivo 12 meses. |
| Correo | Formulario. | Responder. | Sí. | Ídem. |
| Mensaje | Formulario. | Responder. | Sí. | Ídem; no se guarda en la DB. |
| Consentimiento | Formulario. | Base legal. | Sí. | Con el mensaje. |
| IP truncada/hasheada | Servidor/Worker. | Seguridad y rate limit. | Automático. | 30 días en logs. |
| User agent | Servidor/Worker. | Seguridad y compatibilidad. | Automático. | 30 días en logs. |
| Token de Turnstile | Formulario. | Anti-spam. | Automático. | No se almacena. |
| Métricas agregadas | Cloudflare Web Analytics. | Saber qué se visita. | Automático. | Según proveedor; sin identificar personas. |

No se recogen:

- datos de salud, ideología, religión, orientación sexual ni biométricos;
- ubicación GPS del visitante;
- identificadores publicitarios;
- grabaciones de sesión ni mapas de calor;
- contenido de otras pestañas.

### 3.2 Administrador

| Dato | Finalidad | Retención |
|---|---|---|
| Identidad de Cloudflare Access | Autenticación. | Según Access. |
| Clave pública de passkey | Autenticación. | Mientras la passkey exista. |
| Hash de recovery codes (argon2id) | Recuperación. | Hasta regeneración o uso. |
| Sesión `__Host-` | Mantener la sesión. | 30 min de inactividad / 12 h absolutas. |
| Auditoría: acción, objeto, fecha, IP truncada, UA | Seguridad y trazabilidad. | 1 año. |
| Logs de aplicación | Operación y errores. | 30 días. |

No se guardan contraseñas. No hay registro público de administradores.

### 3.3 Contenido publicado

- Fotografías y videos propios, o demo con licencia.
- Metadatos de autoría y copyright reescritos en los derivados.
- GPS eliminado de todos los derivados.
- Personas identificables: solo con autorización documentada.
- Menores: solo con autorización de su tutor.

---

## 4. Bases legales

| Tratamiento | Base | Nota |
|---|---|---|
| Responder un mensaje de contacto | Consentimiento del visitante. | Se marca una casilla; no se preselecciona. |
| Seguridad, rate limit y prevención de abuso | Interés legítimo. | Proporcional; IP truncada. |
| Auditoría del admin | Interés legítimo y obligación de seguridad. | Solo acciones administrativas. |
| Analítica agregada sin cookies | Interés legítimo. | Sin perfilado ni venta. |
| Backups | Interés legítimo y continuidad del servicio. | Cifrados y con retención limitada. |

Si la normativa local exige otra base o un aviso adicional, se actualiza antes
de publicar.

---

## 5. Cookies y almacenamiento local

| Elemento | Tipo | Finalidad | Duración | ¿Requiere consentimiento? |
|---|---|---|---|---|
| `__Host-session` | Cookie esencial del admin. | Sesión. | 30 min / 12 h. | No: esencial y solo tras login. |
| Tema | `localStorage`. | Recordar claro/oscuro/sistema. | Hasta borrar. | No: preferencia, no identifica. |
| Idioma | `localStorage` o URL. | Recordar ES/EN. | Hasta borrar. | No. |

- **No hay cookies de analítica, publicidad ni redes sociales.**
- No se muestra banner si solo hay cookies esenciales; revisar antes de lanzar
  (`PRIV-04`).
- El visitante puede borrar `localStorage` sin perder el acceso al contenido.

---

## 6. Destinatarios y encargados

| Proveedor | Servicio | Datos | Estado |
|---|---|---|---|
| Cloudflare | DNS, Tunnel, Access, WAF, R2, Web Analytics. | IP, headers, métricas, medios. | DPA y región por confirmar. |
| Backblaze B2 | Backup externo cifrado. | Copia cifrada de DB y medios. | DPA y región por confirmar. |
| Proveedor de correo | Envío del formulario. | Nombre, correo, mensaje. | **Pendiente de elegir** (`D-10`). |
| GitHub | Código y CI. | Código; sin datos de visitantes. | Público/privado por definir. |
| Monitor externo | Uptime. | Ping al sitio; sin contenido. | Pendiente. |

Reglas:

- No se venden ni se ceden datos a terceros con fines publicitarios.
- Los backups se cifran antes de salir del servidor.
- Los proveedores deben ofrecer DPA o términos equivalentes.
- Si un proveedor implica transferencia internacional, se documenta la garantía.
- No se envían imágenes a servicios de IA sin decisión y consentimiento
  (`PRIV-13`).

---

## 7. Retención

| Dato | Retención | Destrucción |
|---|---|---|
| Mensajes de contacto | Según proveedor; objetivo 12 meses. | Borrado en el proveedor. |
| Logs de aplicación | 30 días. | Rotación automática. |
| Auditoría | 1 año. | Borrado controlado. |
| Backups | 30 diarios + 12 mensuales. | Expiración y borrado seguro. |
| Medios originales | Mientras el elemento exista. | Papelera 30 días + purga. |
| Derivados | Mientras el elemento exista. | Purga al borrar. |
| Sesiones | 30 min / 12 h. | Expiración y revocación. |
| Recovery codes | Hasta uso o regeneración. | Hash eliminado. |

Un backup puede contener datos ya borrados hasta que expire; se documenta en la
política y en el runbook de restore.

---

## 8. Derechos de las personas

El visitante puede solicitar:

- acceso a sus datos;
- rectificación;
- supresión;
- oposición al tratamiento;
- portabilidad, si aplica;
- retirada del consentimiento.

**Procedimiento:**

1. Enviar la solicitud por el formulario con el asunto "Privacidad".
2. Se verifica la identidad por el correo de origen.
3. Se responde en el plazo legal aplicable; objetivo interno: 15 días hábiles.
4. Se registra la solicitud y el resultado sin guardar más datos de los necesarios.
5. Si se deniega, se explica el motivo.

Limitaciones:

- No se puede borrar lo que deba conservarse por seguridad o ley.
- Un backup puede tardar hasta 30 días en expirar.
- La supresión de un mensaje ya enviado depende del proveedor de correo.

---

## 9. Seguridad

- TLS obligatorio; HSTS.
- Admin detrás de Cloudflare Access + passkey.
- Sin puertos de entrada; solo Tunnel.
- Principio de mínimo privilegio.
- Backups cifrados y verificados.
- Auditoría append-only.
- Rate limits y Turnstile en contacto.
- Sin secretos en el repositorio.
- Respuesta a incidentes documentada en `SECURITY.md`.

Si ocurre una brecha que afecte derechos, se evalúa la notificación a las
personas y a la autoridad según la ley aplicable.

---

## 10. Menores

- El sitio no está dirigido a menores.
- No se recogen datos de menores a sabiendas.
- No se publican fotos de menores sin autorización del tutor.
- Si se detecta un dato de un menor sin autorización, se retira y se documenta.

---

## 11. Términos de uso (resumen)

- El contenido es obra de Patricio Betancourt salvo donde se indique.
- **Todos los derechos reservados** por defecto (`LEG-01`); una pieza puede tener
  otra licencia visible en su ficha.
- No se concede licencia implícita por ver el sitio.
- No se permite la descarga masiva, el raspado automatizado ni el uso comercial
  sin permiso escrito.
- Los rastreadores legítimos pueden indexar las páginas públicas según
  `robots.txt`; el admin, previews y búsqueda están excluidos.
- No se venden prints ni licencias en v1 (`LEG-12`).
- El sitio se ofrece "tal cual"; se procura disponibilidad, pero no se garantiza
  ininterrupción.
- Los enlaces externos tienen sus propias condiciones.

---

## 12. Licencias y atribuciones

| Elemento | Licencia | Estado |
|---|---|---|
| Fotografías y videos del autor | Todos los derechos reservados. | Propuesta; confirmar. |
| Código del sitio | **Pendiente**. | Propuesta: privado o MIT; decidir. |
| Fuente Fraunces | SIL Open Font License 1.1. | Verificar archivo. |
| Fuente Inter | SIL Open Font License 1.1. | Verificar archivo. |
| Iconos Lucide | ISC. | Verificar versión. |
| Assets demo | Según manifest. | Vacío todavía. |
| Three.js | MIT. | Verificar versión. |
| Astro, React, NestJS | MIT. | Verificar lockfile. |

- Las atribuciones obligatorias se muestran en `/creditos/`.
- Los assets demo registran fuente, licencia y hash en
  [`manifest.json`](../../assets/demo/manifest.json).
- Nunca se atribuye un demo al autor (`LEG-08`).
- El contenido generado por IA se declara cuando corresponda (`LEG-09`).

---

## 13. Takedown y reclamaciones

Para reportar:

- uso no autorizado de una obra;
- una persona identificable sin consentimiento;
- un error de atribución;
- contenido ilegal.

**Canal:** formulario de contacto con asunto "Legal" (correo dedicado pendiente).

**Proceso:**

1. Acuse de recibo.
2. Verificación de la reclamación.
3. Retiro temporal o corrección.
4. Respuesta con la decisión.
5. Registro del caso.

No se promete un plazo legal específico hasta que exista revisión legal.

---

## 14. Cambios

- Cada cambio se versiona con fecha y resumen.
- Los cambios que afecten derechos se comunican en el sitio.
- El historial vive en el repositorio y en el changelog.

| Versión | Fecha | Cambio |
|---|---|---|
| 0.1 | 2026-11-17 | Borrador inicial. |

---

## 15. Pendientes antes de publicar

- [ ] Revisión legal profesional.
- [ ] Definir correo de privacidad y contacto legal (`D-10`).
- [ ] Confirmar licencia del contenido y del código.
- [ ] Confirmar DPA y región de Cloudflare, B2 y correo.
- [ ] Decidir si se necesita banner de cookies (probablemente no).
- [ ] Redactar la versión EN.
- [ ] Publicar `/privacidad/`, `/terminos/`, `/accesibilidad/` y `/creditos/`.
- [ ] Verificar que el formulario no guarda el mensaje en la DB.
- [ ] Verificar que los logs no contienen PII innecesaria.
- [ ] Probar el procedimiento de derechos con una solicitud simulada.
- [ ] Registrar la licencia de cada dependencia y fuente.

---

## 16. Texto base para la página pública

**ES (borrador):**

```text
Privacidad

Este sitio no usa cookies de analítica ni publicidad. La única cookie es la
sesión del administrador, y solo existe después de iniciar sesión.

Si me escribes por el formulario, uso tu nombre, correo y mensaje únicamente para
responderte. El mensaje no se guarda en la base de datos del sitio; se envía a mi
proveedor de correo. No te añado a listas ni comparto tus datos con terceros.

Puedes pedir acceso, corrección o eliminación de tus datos escribiendo por el
formulario con el asunto "Privacidad".

Responsable: Patricio Betancourt, Ecuador.
Última actualización: 17 de noviembre de 2026.
```

**EN:** pendiente de traducción y revisión.

No se publica hasta completar los pendientes de la sección 15.
