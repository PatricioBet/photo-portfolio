# Criterios de aceptación y UAT

**Estado:** borrador para aprobación
**Fase:** 01 — Producto
**Fecha:** 17 de noviembre de 2026
**Fuente:** [`SRS v1.1`](../00-gestion/srs-v1.1.md), secciones 19 y 20
**Uso:** gate de sprint, QA de aceptación, UAT y release.

---

## 1. Regla general

Un criterio se cumple cuando existe **evidencia reproducible**, no cuando "se ve
bien". La evidencia se guarda en `docs/04-calidad/reportes/` con:

- comando ejecutado o pasos manuales;
- resultado esperado y obtenido;
- captura o log cuando aplique;
- commit y release probados;
- responsable y fecha.

Sin evidencia, el criterio queda **no verificado** y bloquea el release si es `M`.

---

## 2. Definition of Done

- [ ] Criterios de aceptación del sprint cumplidos, incluidos vacío y error.
- [ ] Pruebas unitarias, de integración y E2E según corresponda.
- [ ] CI verde: lint, tipos, unit, integración, build, e2e, `gitleaks`, SBOM.
- [ ] Revisión independiente aprobada (autor ≠ revisor).
- [ ] QA de aceptación aprobado.
- [ ] Accesibilidad, i18n, rendimiento y SEO verificados si aplica.
- [ ] Documentación y trazabilidad actualizadas en el mismo PR.
- [ ] Sin secretos, datos personales ni artefactos generados en el diff.
- [ ] Rollback documentado.
- [ ] Reporte de sprint con evidencia.

---

## 3. Gates

| Gate | Cuándo | Criterio de paso | Bloquea |
|---|---|---|---|
| G0 | Fin de S0 | SRS aprobado; repo limpio; cero secretos. | Diseño y código. |
| G1 | Fin de S1 | Prototipo navegable aprobado; estados completos. | Arquitectura visual. |
| G2 | Fin de S2 | SAD, ADR, OpenAPI y seguridad revisados. | Implementación. |
| G3 | Fin de S3 | Login E2E; CI verde; DB y migraciones. | Subida. |
| G4 | Fin de S4 | Foto publicada E2E; EXIF y variantes. | Video. |
| G5 | Fin de S5 | Video publicado E2E; poster y HLS. | Sitio público. |
| G6 | Fin de S6 | Vacío y lleno; Lighthouse y SEO. | Publicación. |
| G7 | Fin de S7 | Publicar ≤ 3 min; rollback; demo. | Hardening. |
| G8 | Fin de S8 | WCAG AA; CSP; contacto. | Producción. |
| G9 | Fin de S9 | Producción; backups; prueba de apagón. | Release. |
| G10 | Fin de S10 | UAT, manuales, auditorías, `v1.0.0`. | Nada: cierra. |

---

## 4. Escenarios de aceptación

La columna **Evidencia** indica qué se ejecuta; la columna **Sprint** indica
cuándo debe pasar por primera vez. Todos son `M` salvo los marcados `S`.

| ID | Escenario | Criterio verificable | Evidencia | Sprint |
|---|---|---|---|---|
| AC-01 | Sitio con 0 medios. | Home y listados con estados vacíos completos; sitemap/RSS válidos; 404 real; sin errores de consola. | Build con DB vacía + E2E + capturas ES/EN. | S6 |
| AC-02 | Publicar la primera foto. | Subida → variantes → metadatos → publish → live en ≤ 3 min. | E2E cronometrado + release. | S4 |
| AC-03 | Foto con EXIF GPS y orientación. | Orientación correcta; GPS ausente en todos los derivados; autoría presente. | `exiftool` + inspección. | S4 |
| AC-04 | Foto panorámica, vertical y cuadrada. | Sin deformación ni CLS > 0,05. | Lighthouse + comparación visual. | S4/S6 |
| AC-05 | Video 1080p de 2 min. | Renditions, poster, reproducción y pesos correctos; proceso ≤ 10 min. | `ffprobe` + E2E + cronómetro. | S5 |
| AC-06 | Video > 3 min. | HLS y selector de calidad funcionan. | E2E + red. | S5 |
| AC-07 | Upload interrumpido por cierre del navegador. | Reanudar o descartar; sin duplicados. | E2E de reanudación. | S4 |
| AC-08 | Apagón durante procesamiento. | Job reconciliado; ninguna variante parcial publicada. | Prueba de corte + logs. | S7/S9 |
| AC-09 | Apagón durante build. | `current` intacto; build fallido visible. | Prueba de corte + admin. | S7 |
| AC-10 | Rollback. | Con 3 releases, un clic vuelve a la anterior. | E2E + verificación HTTP. | S7 |
| AC-11 | Despublicar. | Responde 410 o 301; fuera de listados, sitemap, RSS y búsqueda. | E2E + crawl. | S7 |
| AC-12 | Login sin Access o sin passkey. | Rechazado; no existe bypass. | Tests negativos. | S3 |
| AC-13 | JWT de Access inválido o expirado. | 401; la API no confía solo en el Tunnel. | Test con JWT manipulado. | S3 |
| AC-14 | Sesión inactiva 30 min / absoluta 12 h. | Expira; acciones destructivas piden reauth. | Test de tiempo + E2E. | S3 |
| AC-15 | Pérdida de passkey. | Recovery code de un solo uso; nueva passkey; revocar la vieja. | E2E de recuperación. | S3 |
| AC-16 | Escaneo externo de puertos. | Solo 443 de Cloudflare; la IP directa no responde. | `nmap` externo + reglas firewall. | S9 |
| AC-17 | Headers y TLS. | A/A+ en securityheaders/Observatory; HSTS. | Escaneo + config. | S9 |
| AC-18 | Admin noindex y no enlazado. | `X-Robots-Tag`, sin enlaces públicos, fuera de `robots.txt`. | Crawl + headers. | S3/S6 |
| AC-19 | Upload malicioso. | Rechazado sin ejecución; log seguro. | Fixtures maliciosos + antivirus. | S4 |
| AC-20 | FFmpeg con playlist remota. | Rechazado; el worker no tiene red. | Test de sandbox. | S5 |
| AC-21 | Contacto con spam o rate limit. | Turnstile/honeypot; 3/IP/h; mensaje claro. | Test de carga + E2E. | S8 |
| AC-22 | Lightbox con teclado y lector. | Foco atrapado, Esc, flechas, retorno al disparador. | E2E + NVDA/VoiceOver. | S4/S6 |
| AC-23 | Video con teclado y captions. | Controles accesibles; subtítulos sincronizados. | E2E + lector. | S5 |
| AC-24 | Reduced-motion, Save-Data o sin WebGL. | Versión estática; sin autoplay ni 3D. | Emulación + E2E. | S8 |
| AC-25 | Lighthouse móvil. | Home ≥ 90; galerías y detalle ≥ 95; CWV en verde. | Lighthouse CI. | S6 |
| AC-26 | SEO. | Sitemaps de imágenes/videos, hreflang y JSON-LD válidos. | Validadores + crawl. | S6 |
| AC-27 | Etiqueta con < 8 elementos. | `noindex,follow`. | Test de meta robots. | S6 |
| AC-28 | 404 y 301. | Códigos reales; redirects de slugs. | Test HTTP. | S6 |
| AC-29 | Búsqueda ES/EN. | Índice correcto por idioma; no mezcla. | E2E de búsqueda. | S6 |
| AC-30 | Backup/restore de DB. | Restore en entorno limpio; datos íntegros. | Simulacro + checksums. | S9 |
| AC-31 | Restore completo en hardware nuevo. | Sitio, admin y medios operativos; RTO ≤ 4 h. | Simulacro cronometrado. | S9 |
| AC-32 | Disco lleno. | Alerta; jobs fallan con causa; el sitio sigue. | Prueba con cuota. | S9 |
| AC-33 | R2 caído. | Admin muestra error; el sitio sirve caché; sin corrupción. | Corte controlado. | S9 |
| AC-34 | Redis caído. | La API sigue para lectura; jobs se encolan al volver. | Corte controlado. | S9 |
| AC-35 | Admin móvil. | Subida y metadatos usables desde el teléfono. | Prueba en dispositivo real. | S4 |
| AC-36 | i18n incompleto. | La página EN no se genera; no entra en hreflang. | Test de build. | S6 |
| AC-37 | Accesibilidad. | axe + teclado + lector sin P1/P2. | Reporte de a11y. | S8 |
| AC-38 | Impresión. | Foto y ficha legibles en blanco y negro. | Print a PDF. | S6 |
| AC-39 | Assets demo. | Manifest, licencia, reemplazo y borrado; sin atribución falsa. | Validación de esquema + E2E. | S7 |
| AC-40 | Lanzamiento. | Checklist completo; contenido real; demo fuera; backups verificados. | Reporte de release. | S10 |

---

## 5. Criterios de rechazo automático

Un release se rechaza sin discusión si:

- hay un `P1` de seguridad abierto;
- hay secretos en el repositorio o en logs;
- el sitio no arranca con 0 medios;
- un build fallido cambia `current`;
- se publica un asset demo como obra real;
- el admin es accesible sin Access o sin passkey;
- un restore de prueba falla;
- hay violaciones de accesibilidad P1/P2 en flujos principales;
- el formulario de contacto pierde el mensaje o lo guarda en la DB;
- el copyright o la licencia no están visibles.

---

## 6. Pruebas mínimas por release

| Tipo | Comando / herramienta | Frecuencia | Bloquea |
|---|---|---|---|
| Lint y tipos | `pnpm lint && pnpm typecheck` | Cada PR. | Sí |
| Unitarias | `pnpm test:unit` | Cada PR. | Sí |
| Integración | `pnpm test:integration` | Cada PR que toque DB/cola/R2/FFmpeg. | Sí |
| E2E | `pnpm test:e2e` | Cada PR funcional. | Sí |
| Seguridad | `gitleaks`, `pnpm audit`, headers | Cada PR / release. | Sí |
| A11y | `axe` + teclado | Cada PR / release. | Sí (P1/P2) |
| Rendimiento | Lighthouse CI | Cada PR de frontend. | Sí (presupuesto) |
| SEO | Crawl + validadores | Cada release. | Sí |
| Backup/restore | Simulacro | Trimestral y antes de release. | Sí |
| Apagón | Corte controlado | Antes de release y tras cambios de infra. | Sí |

---

## 7. Checklist de UAT

### 7.1 Visitante

- [ ] La home explica quién es y qué hace en menos de 5 segundos.
- [ ] Con 0 medios, el sitio se ve intencional y navegable.
- [ ] La galería respeta proporciones y no salta.
- [ ] El detalle se lee, se amplía y se cierra solo con teclado.
- [ ] El video no arranca solo con sonido.
- [ ] La búsqueda encuentra y no mezcla idiomas.
- [ ] El formulario confirma y conserva el texto si falla.
- [ ] ES/EN y tema claro/oscuro funcionan sin recargar de más.
- [ ] Los enlaces a GitHub, LinkedIn y desarrollo son correctos.
- [ ] La impresión de un detalle es legible.

### 7.2 Admin

- [ ] Sin Access no hay acceso; sin passkey tampoco.
- [ ] La sesión expira y se revoca al cerrar.
- [ ] Subir 20 archivos muestra progreso por archivo.
- [ ] Cerrar el navegador y volver ofrece reanudar.
- [ ] Los metadatos ES/EN validan antes de publicar.
- [ ] Dos pestañas no se pisan.
- [ ] Publicar tarda ≤ 3 min y se ve el estado.
- [ ] Un build fallido no cambia la versión viva.
- [ ] El rollback funciona y queda auditado.
- [ ] Despublicar responde 410/301 y limpia sitemap/RSS.
- [ ] El dashboard alerta backup viejo y disco lleno.
- [ ] Cargar y descargar demo no toca contenido real.

### 7.3 Operación

- [ ] El servidor arranca solo tras un corte.
- [ ] Postgres recupera y los jobs se reconcilian.
- [ ] El backup corre, se cifra y se verifica.
- [ ] El restore en limpio cumple RTO/RPO.
- [ ] El monitor externo alerta si el sitio cae.
- [ ] El acceso directo por IP está cerrado.
- [ ] Los logs no contienen secretos ni PII innecesaria.

---

## 8. Plantilla de evidencia

```text
Reporte: <sprint / release>
Commit: <sha>
Entorno: <local / staging / producción>
Fecha: <ISO-8601>
Ejecutó: <agente / persona>

Caso: AC-XX <nombre>
Pasos: <comandos o pasos>
Esperado: <resultado>
Obtenido: <resultado>
Evidencia: <ruta a captura/log>
Veredicto: PASA / FALLA / BLOQUEADO
```

---

## 9. Trazabilidad

Cada `AC` debe poder rastrearse a:

- uno o más `RF`, `RNF`, `SEG`, `BCK`, `SEO`, `A11Y`, `LEG`, `OPS` o `DEP`;
- un sprint del [`plan de sprints`](../00-gestion/plan-sprints.md);
- una prueba en `tests/` o un paso de UAT;
- un reporte en `docs/04-calidad/reportes/`.

La matriz completa está en
[`trazabilidad.md`](../00-gestion/trazabilidad.md). Si un `AC` no tiene requisito
o prueba, se corrige antes del gate.
