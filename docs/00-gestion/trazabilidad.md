# Matriz de trazabilidad

**Estado:** en revisión
**Versión:** 1.2
**Fecha:** 17 de noviembre de 2026
**Fuente:** [`srs-v1.2.md`](srs-v1.2.md) y [`plan-sprints.md`](plan-sprints.md)

---

## 1. Reglas

- Todo requisito del SRS tiene una fila en esta matriz.
- Todo requisito `M` debe tener al menos una prueba o evidencia y un escenario de
  aceptación asociado.
- Todo PR debe citar los IDs que cubre.
- Un requisito no se considera cubierto por la existencia de código: se cubre
  cuando la evidencia está en `docs/04-calidad/reportes/`.
- Si cambia un requisito, se actualiza el SRS, esta matriz y el plan de pruebas
  en el mismo PR.
- Los IDs no se reutilizan. Un requisito eliminado se marca `obsoleto`, no se
  borra del historial.

---

## 2. Épicas y cobertura

| Épica | Requisitos | Sprint | Escenarios de aceptación | Evidencia |
|---|---|---|---|---|
| Sitio vacío y navegación base | RF-P01–RF-P09, RF-P19, RF-P20–RF-P29, RF-P40–RF-P47 | S6 | AC-01, AC-24, AC-28, AC-36 | Build vacío, crawl, Lighthouse, E2E sin JS. |
| Home y contenido destacado | RF-P10–RF-P18 | S6/S8 | AC-01, AC-24, AC-25 | Lighthouse, E2E de fallback, revisión visual. |
| Galerías y listados | RF-P20–RF-P29 | S6 | AC-01, AC-04, AC-25, AC-27 | E2E, crawl, Lighthouse. |
| Detalle de foto | RF-P30–RF-P39 | S6 | AC-02, AC-03, AC-04, AC-22, AC-38 | E2E, HTML, print CSS, a11y. |
| Detalle de video | RF-P50–RF-P58 | S6 | AC-05, AC-06, AC-23, AC-24 | E2E, ffprobe, network, a11y. |
| Búsqueda | RF-P60–RF-P63 | S6 | AC-29 | E2E ES/EN, sin JS. |
| Sobre mí, contacto y privacidad | RF-P70–RF-P75 | S8 | AC-21 | E2E, security, legal review. |
| Idioma y compatibilidad | RF-P40–RF-P47 | S6 | AC-24, AC-36 | Matriz de navegadores, hreflang, E2E. |
| Assets demo | RF-P90–RF-P93, RF-M46, RF-M47, RF-A47 | S6/S7 | AC-39, AC-40 | Manifest, revisión, E2E de borrado. |
| Autenticación y sesión | RF-A01–RF-A09, SEG-01–SEG-10 | S3 | AC-12, AC-13, AC-14, AC-15, AC-18 | E2E, tests de JWT/cookies, revisión. |
| Subida de archivos | RF-A10–RF-A17 | S4/S5 | AC-07, AC-08, AC-19 | E2E, tests de reanudación, fixtures. |
| Metadatos y organización | RF-A20–RF-A29 | S4 | AC-02, AC-03 | E2E, tests de concurrencia. |
| Publicación y releases | RF-A30–RF-A39, DEP-13–DEP-16 | S7 | AC-09, AC-10, AC-11 | E2E, build fallido, rollback. |
| Mantenimiento del admin | RF-A40–RF-A50 | S7/S9 | AC-31, AC-32, AC-33, AC-34 | Panel, E2E, runbooks. |
| Pipeline de fotos | RF-M01–RF-M16 | S4 | AC-02, AC-03, AC-04, AC-19 | Fixtures, presupuestos, `exiftool`. |
| Pipeline de videos | RF-M20–RF-M32 | S5 | AC-05, AC-06, AC-08, AC-20 | ffprobe, benchmark, sandbox. |
| Almacenamiento y colas | RF-M40–RF-M51 | S3/S4 | AC-07, AC-08, AC-32, AC-33, AC-34 | Config R2, tests de corte. |
| Animaciones y 3D | RF-V01–RF-V18 | S8 | AC-24, AC-25 | Bundle, FPS, fallback, a11y. |
| Rendimiento | RNF-R01–RNF-R13 | S6/S8 | AC-25 | Lighthouse, bundles, CWV. |
| Datos y contenido | DAT-01–DAT-20 | S3/S7 | AC-02, AC-11, AC-30, AC-36 | Migraciones, tests, restore. |
| Seguridad de aplicación | SEG-25–SEG-40 | S3/S8 | AC-12–AC-21 | ZAP, tests, escaneos. |
| Host y red | SEG-11–SEG-24 | S9 | AC-16, AC-17 | `nmap`, UFW, revisión. |
| Auditoría e incidentes | SEG-41–SEG-47 | S9 | AC-16, AC-35 | Alertas, runbook, simulación. |
| Backups y DR | BCK-01–BCK-20 | S9 | AC-30, AC-31, AC-32 | `restic check`, restore medido. |
| Object Lock | BCK-21–BCK-23 | S9 | AC-30, AC-31 | Object Lock config, restore test. |
| SEO | SEO-01–SEO-25 | S6/S9 | AC-26, AC-27, AC-28 | Crawl, validadores, Search Console. |
| Privacidad | PRIV-01–PRIV-15 | S8/S10 | AC-21 | Auditoría de red, legal review. |
| Accesibilidad | A11Y-01–A11Y-28 | S6/S8 | AC-22, AC-23, AC-37 | axe, teclado, lector. |
| Legal | LEG-01–LEG-18 | S10 | AC-39, AC-40 | Checklist legal, manifest. |
| Observabilidad | OPS-01–OPS-30 | S9 | AC-31, AC-32, AC-33, AC-34 | Dashboard, alertas, runbooks. |
| Despliegue | DEP-01–DEP-30 | S9 | AC-08, AC-09, AC-16, AC-31 | Prueba de apagón, restore, headers. |
| Versiones y fuentes | VER-01–VER-12 | S0/S3 | — | Lockfile, SBOM, revisión. |
| Aceptación | AC-01–AC-40 | S10 | Todos | Reporte de release. |

---

## 3. Criterios de aceptación

| ID | Escenario | Requisitos principales | Sprint |
|---|---|---|---|
| AC-01 | Sitio con 0 medios. | RF-P06–RF-P09, RF-P19, SEO-17, DAT-17 | S6 |
| AC-02 | Publicar primera foto. | RF-A10–RF-A39, RF-M01–RF-M16, DEP-29 | S4/S7 |
| AC-03 | EXIF GPS/orientación. | RF-M01, RF-M08, RF-P32, LEG-14 | S4 |
| AC-04 | Formatos extremos. | RF-P20, RF-P30, RF-M03 | S6 |
| AC-05 | Video 1080p 2 min. | RF-M20–RF-M32, RF-P50–RF-P58 | S5 |
| AC-06 | Video > 3 min. | RF-M24, RF-P54 | S5 |
| AC-07 | Upload interrumpido. | RF-A15–RF-A17, RF-M41 | S4 |
| AC-08 | Apagón durante procesamiento. | RF-M30, RF-M48–RF-M51, BCK-12–BCK-15 | S9 |
| AC-09 | Apagón durante build. | RF-A37, DEP-13–DEP-15, BCK-15 | S7/S9 |
| AC-10 | Rollback. | RF-A36, DEP-14 | S7 |
| AC-11 | Despublicar. | RF-A34, RF-P38, SEO-10, DAT-18 | S7 |
| AC-12 | Login sin Access/passkey. | SEG-01–SEG-05, RF-A02 | S3 |
| AC-13 | JWT inválido. | SEG-03, RF-A06 | S3 |
| AC-14 | Sesión expirada. | SEG-06–SEG-08, RF-A04 | S3 |
| AC-15 | Pérdida de passkey. | SEG-04–SEG-05, RF-A49 | S3 |
| AC-16 | Escaneo de puertos. | SEG-11–SEG-13, SEG-47, DEP-07 | S9 |
| AC-17 | Headers/TLS. | SEG-22, SEG-35–SEG-36, DEP-17 | S8/S9 |
| AC-18 | Admin noindex. | RF-A01, SEG-10, SEO-23 | S3 |
| AC-19 | Upload malicioso. | RF-M12, SEG-29–SEG-32 | S4 |
| AC-20 | FFmpeg playlist remota. | RF-M21, SEG-32 | S5 |
| AC-21 | Contacto spam. | RF-P71–RF-P73, SEG-33, SEG-38 | S8 |
| AC-22 | Lightbox teclado/SR. | RF-P34, A11Y-08 | S6 |
| AC-23 | Video teclado/captions. | RF-P50–RF-P54, A11Y-07, A11Y-23 | S6 |
| AC-24 | Reduced motion/Save-Data/WebGL. | RF-P10, RF-P13, RF-V07, RF-V13 | S6/S8 |
| AC-25 | Lighthouse móvil. | RNF-R01–RNF-R13 | S6/S8 |
| AC-26 | SEO. | SEO-01–SEO-25 | S6 |
| AC-27 | Tag < 8. | RF-P24, SEO-13 | S6 |
| AC-28 | 404/301. | RF-P05, RF-P38, SEO-10 | S6 |
| AC-29 | Búsqueda ES/EN. | RF-P60–RF-P63 | S6 |
| AC-30 | Backup/restore DB. | BCK-01–BCK-08 | S9 |
| AC-31 | Restore completo. | BCK-07–BCK-18, DEP-26 | S9 |
| AC-32 | Disco lleno. | OPS-06, OPS-10, RF-M32 | S9 |
| AC-33 | R2 caído. | OPS-03, RF-M29 | S9 |
| AC-34 | Redis caído. | OPS-03, OPS-17 | S9 |
| AC-35 | Admin móvil. | RF-A08, RF-A45, A11Y-17 | S7 |
| AC-36 | i18n incompleto. | RF-P41, SEO-08, DAT-02 | S6 |
| AC-37 | Accesibilidad. | A11Y-01–A11Y-22 | S8 |
| AC-38 | Impresión. | RF-P39, A11Y-19 | S6 |
| AC-39 | Assets demo. | RF-P90–RF-P93, RF-M46–RF-M47, LEG-08–LEG-09 | S7 |
| AC-40 | Lanzamiento. | RF-A48, RF-P91, RF-P92, LEG-01–LEG-18, DEP-22–DEP-30 | S10 |

---

## 4. Inventario completo de requisitos

| ID | P | Sección del SRS | Sprint | Verificación |
|---|---|---|---|---|
| RF-P01 | M | 4.1 URLs, estados y navegación base | S6 | Crawl de rutas y E2E. |
| RF-P02 | M | 4.1 URLs, estados y navegación base | S6 | Crawl EN + hreflang. |
| RF-P03 | M | 4.1 URLs, estados y navegación base | S6 | Test de redirects. |
| RF-P04 | M | 4.1 URLs, estados y navegación base | S6 | Crawl + canonical. |
| RF-P05 | M | 4.1 URLs, estados y navegación base | S6 | Test HTTP + visual. |
| RF-P06 | M | 4.1 URLs, estados y navegación base | S6 | Build + E2E con DB vacía. |
| RF-P07 | M | 4.1 URLs, estados y navegación base | S6 | CI build empty. |
| RF-P08 | M | 4.1 URLs, estados y navegación base | S6 | Test de publicación + Lighthouse. |
| RF-P09 | M | 4.1 URLs, estados y navegación base | S6 | Test de assets faltantes. |
| RF-P19 | M | 4.1 URLs, estados y navegación base | S6 | Tests de estados. |
| RF-P10 | M | 4.2 Home | S6/S8 | Lighthouse + fallback E2E. |
| RF-P11 | M | 4.2 Home | S6/S8 | Test de contenido. |
| RF-P12 | M | 4.2 Home | S6/S8 | Test de contenido. |
| RF-P13 | M | 4.2 Home | S6/S8 | E2E + performance. |
| RF-P14 | M | 4.2 Home | S6/S8 | Visual + links. |
| RF-P15 | M | 4.2 Home | S6/S8 | Visual + links. |
| RF-P16 | M | 4.2 Home | S6/S8 | E2E + a11y. |
| RF-P17 | M | 4.2 Home | S6/S8 | Inspección de datos + visual. |
| RF-P18 | M | 4.2 Home | S6/S8 | E2E de reemplazo. |
| RF-P20 | M | 4.3 Galerías y listados | S6 | Lighthouse + inspección. |
| RF-P21 | M | 4.3 Galerías y listados | S6 | Test sin JS. |
| RF-P22 | M | 4.3 Galerías y listados | S6 | Crawl + E2E. |
| RF-P23 | M | 4.3 Galerías y listados | S6 | Crawl + E2E. |
| RF-P24 | M | 4.3 Galerías y listados | S6 | Test de meta robots. |
| RF-P25 | M | 4.3 Galerías y listados | S6 | E2E + inspección. |
| RF-P26 | S | 4.3 Galerías y listados | S6 | Test visual. |
| RF-P27 | S | 4.3 Galerías y listados | S6 | E2E. |
| RF-P28 | M | 4.3 Galerías y listados | S6 | Test de borde. |
| RF-P29 | S | 4.3 Galerías y listados | S6 | Lighthouse. |
| RF-P30 | M | 4.4 Detalle de foto | S6 | Lighthouse + HTML + visual. |
| RF-P31 | M | 4.4 Detalle de foto | S6 | Visual + datos. |
| RF-P32 | S | 4.4 Detalle de foto | S6 | Test de metadatos. |
| RF-P33 | M | 4.4 Detalle de foto | S6 | E2E. |
| RF-P34 | M | 4.4 Detalle de foto | S6 | E2E + a11y. |
| RF-P35 | S | 4.4 Detalle de foto | S6 | E2E. |
| RF-P36 | C | 4.4 Detalle de foto | S6 | Futuro. |
| RF-P37 | M | 4.4 Detalle de foto | S6 | Inspección. |
| RF-P38 | M | 4.4 Detalle de foto | S6 | Test HTTP. |
| RF-P39 | M | 4.4 Detalle de foto | S6 | Print CSS. |
| RF-P50 | M | 4.5 Detalle de video | S6 | E2E + a11y. |
| RF-P51 | M | 4.5 Detalle de video | S6 | HTML + E2E. |
| RF-P52 | M | 4.5 Detalle de video | S6 | E2E + red. |
| RF-P53 | M | 4.5 Detalle de video | S6 | E2E. |
| RF-P54 | S | 4.5 Detalle de video | S6 | Test de duración. |
| RF-P55 | M | 4.5 Detalle de video | S6 | E2E. |
| RF-P56 | C | 4.5 Detalle de video | S6 | Futuro. |
| RF-P57 | M | 4.5 Detalle de video | S6 | Test de error. |
| RF-P58 | M | 4.5 Detalle de video | S6 | Network test. |
| RF-P60 | M | 4.6 Búsqueda | S6 | E2E. |
| RF-P61 | M | 4.6 Búsqueda | S6 | E2E. |
| RF-P62 | M | 4.6 Búsqueda | S6 | Meta robots. |
| RF-P63 | M | 4.6 Búsqueda | S6 | Test sin JS. |
| RF-P70 | M | 4.7 Sobre mí, contacto y privacidad | S8 | Visual + contenido. |
| RF-P71 | M* | 4.7 Sobre mí, contacto y privacidad | S8 | E2E + security. |
| RF-P72 | M | 4.7 Sobre mí, contacto y privacidad | S8 | E2E + a11y. |
| RF-P73 | M | 4.7 Sobre mí, contacto y privacidad | S8 | Test de rate limit. |
| RF-P74 | M | 4.7 Sobre mí, contacto y privacidad | S8 | Legal review. |
| RF-P75 | M | 4.7 Sobre mí, contacto y privacidad | S8 | Inspección. |
| RF-P40 | M | 4.8 Idioma, navegación y compatibilidad | S6 | Links. |
| RF-P41 | M | 4.8 Idioma, navegación y compatibilidad | S6 | Test i18n. |
| RF-P42 | M | 4.8 Idioma, navegación y compatibilidad | S6 | E2E. |
| RF-P43 | M | 4.8 Idioma, navegación y compatibilidad | S6 | a11y. |
| RF-P44 | S | 4.8 Idioma, navegación y compatibilidad | S6 | Feature detection. |
| RF-P45 | M | 4.8 Idioma, navegación y compatibilidad | S6 | Matriz de pruebas. |
| RF-P46 | M | 4.8 Idioma, navegación y compatibilidad | S6 | Validación XML. |
| RF-P47 | M | 4.8 Idioma, navegación y compatibilidad | S6 | Test sin JS. |
| RF-P90 | M* | 4.9 Assets y contenido demo | S6 | Inspección. |
| RF-P91 | M* | 4.9 Assets y contenido demo | S6 | Revisión. |
| RF-P92 | M* | 4.9 Assets y contenido demo | S6 | E2E. |
| RF-P93 | S | 4.9 Assets y contenido demo | S6 | E2E. |
| RF-A01 | M | 5.1 Acceso y sesión | S3 | Headers + crawl. |
| RF-A02 | M | 5.1 Acceso y sesión | S3 | E2E de login. |
| RF-A03 | M | 5.1 Acceso y sesión | S3 | Test CLI + DB. |
| RF-A04 | M | 5.1 Acceso y sesión | S3 | Tests de sesión. |
| RF-A05 | M | 5.1 Acceso y sesión | S3 | E2E. |
| RF-A06 | M | 5.1 Acceso y sesión | S3 | Tests con JWT inválido. |
| RF-A07 | M | 5.1 Acceso y sesión | S3 | E2E. |
| RF-A08 | M | 5.1 Acceso y sesión | S3 | Responsive + E2E. |
| RF-A09 | M | 5.1 Acceso y sesión | S3 | Inspección + test. |
| RF-A10 | M | 5.2 Subida | S4/S5 | E2E. |
| RF-A11 | M | 5.2 Subida | S4/S5 | E2E. |
| RF-A12 | M | 5.2 Subida | S4/S5 | Tests de límites. |
| RF-A13 | M | 5.2 Subida | S4/S5 | Test. |
| RF-A14 | M | 5.2 Subida | S4/S5 | E2E. |
| RF-A15 | M | 5.2 Subida | S4/S5 | Test de reanudación. |
| RF-A16 | M | 5.2 Subida | S4/S5 | Test de apagón. |
| RF-A17 | M | 5.2 Subida | S4/S5 | Test. |
| RF-A20 | M | 5.3 Metadatos y organización | S4 | E2E. |
| RF-A21 | M | 5.3 Metadatos y organización | S4 | Test de dos pestañas. |
| RF-A22 | M | 5.3 Metadatos y organización | S4 | E2E. |
| RF-A23 | M | 5.3 Metadatos y organización | S4 | E2E. |
| RF-A24 | C | 5.3 Metadatos y organización | S4 | Decisión + test. |
| RF-A25 | M | 5.3 Metadatos y organización | S4 | Visual + pipeline. |
| RF-A26 | M | 5.3 Metadatos y organización | S4 | E2E. |
| RF-A27 | M | 5.3 Metadatos y organización | S4 | E2E. |
| RF-A28 | M | 5.3 Metadatos y organización | S4 | Formulario + DB. |
| RF-A29 | M | 5.3 Metadatos y organización | S4 | Test. |
| RF-A30 | M | 5.4 Publicación | S7 | E2E. |
| RF-A31 | M | 5.4 Publicación | S7 | Test de validación. |
| RF-A32 | M | 5.4 Publicación | S7 | E2E + tiempo. |
| RF-A33 | M | 5.4 Publicación | S7 | E2E. |
| RF-A34 | M | 5.4 Publicación | S7 | Test HTTP. |
| RF-A35 | M | 5.4 Publicación | S7 | E2E. |
| RF-A36 | M | 5.4 Publicación | S7 | E2E. |
| RF-A37 | M | 5.4 Publicación | S7 | Test de fallo. |
| RF-A38 | M | 5.4 Publicación | S7 | Test. |
| RF-A39 | S | 5.4 Publicación | S7 | Test. |
| RF-A40 | M | 5.5 Mantenimiento y operación | S7/S9 | E2E. |
| RF-A41 | M | 5.5 Mantenimiento y operación | S7/S9 | Inspección. |
| RF-A42 | M | 5.5 Mantenimiento y operación | S7/S9 | E2E. |
| RF-A43 | S | 5.5 Mantenimiento y operación | S7/S9 | Test. |
| RF-A44 | S | 5.5 Mantenimiento y operación | S7/S9 | Test. |
| RF-A45 | M | 5.5 Mantenimiento y operación | S7/S9 | a11y + responsive. |
| RF-A46 | M | 5.5 Mantenimiento y operación | S7/S9 | E2E. |
| RF-A47 | M | 5.5 Mantenimiento y operación | S7/S9 | E2E. |
| RF-A48 | M | 5.5 Mantenimiento y operación | S7/S9 | Inspección. |
| RF-A49 | M | 5.5 Mantenimiento y operación | S7/S9 | E2E. |
| RF-A50 | M | 5.5 Mantenimiento y operación | S7/S9 | Inspección. |
| RF-M01 | M | 6.2 Fotos | S4 | Fixture con orientación. |
| RF-M02 | M | 6.2 Fotos | S4 | Inspección de color. |
| RF-M03 | M | 6.2 Fotos | S4 | Test de variantes. |
| RF-M04 | M | 6.2 Fotos | S4 | Inspección visual + pesos. |
| RF-M05 | M | 6.2 Fotos | S4 | Test de presupuesto. |
| RF-M06 | M | 6.2 Fotos | S4 | Inspección HTML/DB. |
| RF-M07 | M | 6.2 Fotos | S4 | Test. |
| RF-M08 | M | 6.2 Fotos | S4 | `exiftool` + test. |
| RF-M09 | M | 6.2 Fotos | S4 | Config + test. |
| RF-M10 | S | 6.2 Fotos | S4 | Spike + test. |
| RF-M11 | C | 6.2 Fotos | S4 | Futuro. |
| RF-M12 | M | 6.2 Fotos | S4 | Fixtures maliciosos. |
| RF-M13 | M | 6.2 Fotos | S4 | Test. |
| RF-M14 | M | 6.2 Fotos | S4 | Test de fallo. |
| RF-M15 | M | 6.2 Fotos | S4 | Test. |
| RF-M16 | M | 6.2 Fotos | S4 | CI empty. |
| RF-M20 | M | 6.3 Videos | S5 | Fixtures. |
| RF-M21 | M | 6.3 Videos | S5 | Test con playlist remota. |
| RF-M22 | M | 6.3 Videos | S5 | ffprobe + pesos. |
| RF-M23 | C | 6.3 Videos | S5 | Futuro. |
| RF-M24 | S | 6.3 Videos | S5 | Test. |
| RF-M25 | M | 6.3 Videos | S5 | Test. |
| RF-M26 | M | 6.3 Videos | S5 | Test. |
| RF-M27 | M | 6.3 Videos | S5 | Test. |
| RF-M28 | M | 6.3 Videos | S5 | Benchmark. |
| RF-M29 | M | 6.3 Videos | S5 | Test. |
| RF-M30 | M | 6.3 Videos | S5 | Test de corte. |
| RF-M31 | M | 6.3 Videos | S5 | Test. |
| RF-M32 | M | 6.3 Videos | S5 | Test de carga. |
| RF-M40 | M | 6.4 Almacenamiento y colas | S3 | Config R2. |
| RF-M41 | M | 6.4 Almacenamiento y colas | S3 | Config + test. |
| RF-M42 | M | 6.4 Almacenamiento y colas | S3 | Headers. |
| RF-M43 | M | 6.4 Almacenamiento y colas | S3 | Test CORS. |
| RF-M44 | M | 6.4 Almacenamiento y colas | S3 | Inspección. |
| RF-M45 | M | 6.4 Almacenamiento y colas | S3 | Revisión de IAM. |
| RF-M46 | M | 6.4 Almacenamiento y colas | S3 | Inspección. |
| RF-M47 | M | 6.4 Almacenamiento y colas | S3 | Test. |
| RF-M48 | M | 6.4 Almacenamiento y colas | S3 | Test de corte. |
| RF-M49 | M | 6.4 Almacenamiento y colas | S3 | Test. |
| RF-M50 | M | 6.4 Almacenamiento y colas | S3 | Test de carga. |
| RF-M51 | M | 6.4 Almacenamiento y colas | S3 | Test. |
| RF-V01 | M | 7.2 Animaciones con scroll | S8 | Visual + license review. |
| RF-V02 | S | 7.2 Animaciones con scroll | S8 | Test de INP. |
| RF-V03 | S | 7.2 Animaciones con scroll | S8 | Feature detection. |
| RF-V04 | M | 7.2 Animaciones con scroll | S8 | Code review + performance. |
| RF-V05 | M | 7.2 Animaciones con scroll | S8 | Inspección. |
| RF-V06 | M | 7.2 Animaciones con scroll | S8 | Test sin JS. |
| RF-V07 | M | 7.2 Animaciones con scroll | S8 | E2E. |
| RF-V08 | M | 7.2 Animaciones con scroll | S8 | a11y. |
| RF-V09 | M | 7.2 Animaciones con scroll | S8 | a11y. |
| RF-V10 | M | 7.3 Three.js | S8 | Benchmark. |
| RF-V11 | S | 7.3 Three.js | S8 | Test. |
| RF-V12 | M | 7.3 Three.js | S8 | Bundle analysis. |
| RF-V13 | M | 7.3 Three.js | S8 | E2E con flags. |
| RF-V14 | M | 7.3 Three.js | S8 | Test. |
| RF-V15 | M | 7.3 Three.js | S8 | Test CORS. |
| RF-V16 | M | 7.3 Three.js | S8 | a11y. |
| RF-V17 | S | 7.3 Three.js | S8 | Test simulado. |
| RF-V18 | C | 7.3 Three.js | S8 | Futuro. |
| RNF-R01 | M | 8.2 Requisitos | S6/S8 | Headers. |
| RNF-R02 | M | 8.2 Requisitos | S6/S8 | Headers. |
| RNF-R03 | M | 8.2 Requisitos | S6/S8 | Cloudflare/Caddy. |
| RNF-R04 | M | 8.2 Requisitos | S6/S8 | Lighthouse. |
| RNF-R05 | M | 8.2 Requisitos | S6/S8 | Network. |
| RNF-R06 | M | 8.2 Requisitos | S6/S8 | Lighthouse. |
| RNF-R07 | M | 8.2 Requisitos | S6/S8 | CI. |
| RNF-R08 | M | 8.2 Requisitos | S6/S8 | Network. |
| RNF-R09 | M | 8.2 Requisitos | S6/S8 | Network. |
| RNF-R10 | S | 8.2 Requisitos | S6/S8 | Inspección. |
| RNF-R11 | M | 8.2 Requisitos | S6/S8 | Lighthouse empty. |
| RNF-R12 | M | 8.2 Requisitos | S6/S8 | CI. |
| RNF-R13 | M | 8.2 Requisitos | S6/S8 | Network. |
| DAT-01 | M | 9.2 Reglas de contenido | S3/S7 | Migración + test. |
| DAT-02 | M | 9.2 Reglas de contenido | S3/S7 | Test i18n. |
| DAT-03 | M | 9.2 Reglas de contenido | S3/S7 | Test DB + HTTP. |
| DAT-04 | M | 9.2 Reglas de contenido | S3/S7 | Test. |
| DAT-05 | M | 9.2 Reglas de contenido | S3/S7 | Test DB. |
| DAT-06 | M | 9.2 Reglas de contenido | S3/S7 | Test. |
| DAT-07 | M | 9.2 Reglas de contenido | S3/S7 | Test. |
| DAT-08 | M | 9.2 Reglas de contenido | S3/S7 | Test. |
| DAT-09 | M | 9.2 Reglas de contenido | S3/S7 | Test visual. |
| DAT-10 | M | 9.2 Reglas de contenido | S3/S7 | Test. |
| DAT-11 | M | 9.2 Reglas de contenido | S3/S7 | Test. |
| DAT-12 | M | 9.2 Reglas de contenido | S3/S7 | Test. |
| DAT-13 | M | 9.2 Reglas de contenido | S3/S7 | Test. |
| DAT-14 | M | 9.2 Reglas de contenido | S3/S7 | CI. |
| DAT-15 | M | 9.2 Reglas de contenido | S3/S7 | Inspección. |
| DAT-16 | M | 9.2 Reglas de contenido | S3/S7 | Config + test. |
| DAT-17 | M | 9.2 Reglas de contenido | S3/S7 | CI. |
| DAT-18 | M | 9.2 Reglas de contenido | S3/S7 | Test. |
| DAT-19 | M | 9.2 Reglas de contenido | S3/S7 | Test. |
| DAT-20 | M | 9.2 Reglas de contenido | S3/S7 | Revisión. |
| SEG-01 | M | 10.2 Autenticación y autorización | S3 | E2E + revisión. |
| SEG-02 | M | 10.2 Autenticación y autorización | S3 | Config + test. |
| SEG-03 | M | 10.2 Autenticación y autorización | S3 | Tests con tokens inválidos. |
| SEG-04 | M | 10.2 Autenticación y autorización | S3 | Test WebAuthn. |
| SEG-05 | M | 10.2 Autenticación y autorización | S3 | Test. |
| SEG-06 | M | 10.2 Autenticación y autorización | S3 | Tests de cookie. |
| SEG-07 | M | 10.2 Autenticación y autorización | S3 | E2E. |
| SEG-08 | M | 10.2 Autenticación y autorización | S3 | E2E. |
| SEG-09 | M | 10.2 Autenticación y autorización | S3 | Tests. |
| SEG-10 | M | 10.2 Autenticación y autorización | S3 | Headers + crawl. |
| SEG-11 | M | 10.3 Hardening del host y red | S9 | Inventario. |
| SEG-12 | M | 10.3 Hardening del host y red | S9 | `nmap` externo. |
| SEG-13 | M | 10.3 Hardening del host y red | S9 | Config. |
| SEG-14 | M | 10.3 Hardening del host y red | S9 | Logs. |
| SEG-15 | M | 10.3 Hardening del host y red | S9 | Config. |
| SEG-16 | M | 10.3 Hardening del host y red | S9 | Config. |
| SEG-17 | M | 10.3 Hardening del host y red | S9 | Config. |
| SEG-18 | M | 10.3 Hardening del host y red | S9 | Checklist. |
| SEG-19 | M | 10.3 Hardening del host y red | S9 | Revisión compose. |
| SEG-20 | M | 10.3 Hardening del host y red | S9 | Compose. |
| SEG-21 | M | 10.3 Hardening del host y red | S9 | Compose. |
| SEG-22 | M | 10.3 Hardening del host y red | S9 | Config. |
| SEG-23 | M | 10.3 Hardening del host y red | S9 | Revisión. |
| SEG-24 | M | 10.3 Hardening del host y red | S9 | Test. |
| SEG-25 | M | 10.4 Seguridad de aplicación | S3/S8 | Tests. |
| SEG-26 | M | 10.4 Seguridad de aplicación | S3/S8 | Code review + tests. |
| SEG-27 | M | 10.4 Seguridad de aplicación | S3/S8 | Tests + ZAP. |
| SEG-28 | M | 10.4 Seguridad de aplicación | S3/S8 | Tests. |
| SEG-29 | M | 10.4 Seguridad de aplicación | S3/S8 | Tests. |
| SEG-30 | M | 10.4 Seguridad de aplicación | S3/S8 | Tests. |
| SEG-31 | M | 10.4 Seguridad de aplicación | S3/S8 | Fixtures. |
| SEG-32 | M | 10.4 Seguridad de aplicación | S3/S8 | Tests. |
| SEG-33 | M | 10.4 Seguridad de aplicación | S3/S8 | Tests de carga. |
| SEG-34 | M | 10.4 Seguridad de aplicación | S3/S8 | Tests. |
| SEG-35 | M | 10.4 Seguridad de aplicación | S3/S8 | Headers + browser. |
| SEG-36 | M | 10.4 Seguridad de aplicación | S3/S8 | securityheaders.com. |
| SEG-37 | M | 10.4 Seguridad de aplicación | S3/S8 | Tests. |
| SEG-38 | M | 10.4 Seguridad de aplicación | S3/S8 | Test. |
| SEG-39 | M | 10.4 Seguridad de aplicación | S3/S8 | CI. |
| SEG-40 | M | 10.4 Seguridad de aplicación | S3/S8 | CI. **Bloqueado** hasta configurar remoto. |
| SEG-41 | M | 10.5 Monitoreo, auditoría e incidentes | S9 | Test de alerta. |
| SEG-42 | M | 10.5 Monitoreo, auditoría e incidentes | S9 | Test. |
| SEG-43 | M | 10.5 Monitoreo, auditoría e incidentes | S9 | Revisión. |
| SEG-44 | M | 10.5 Monitoreo, auditoría e incidentes | S9 | Simulacro. |
| SEG-45 | M | 10.5 Monitoreo, auditoría e incidentes | S9 | Informe. |
| SEG-46 | S | 10.5 Monitoreo, auditoría e incidentes | S9 | Informe. |
| SEG-47 | M | 10.5 Monitoreo, auditoría e incidentes | S9 | `nmap`/curl. |
| BCK-01 | M | 11.3 Requisitos | S9 | Log + inspección. |
| BCK-02 | M | 11.3 Requisitos | S9 | Inspección. |
| BCK-03 | M | 11.3 Requisitos | S9 | Inspección. |
| BCK-04 | M | 11.3 Requisitos | S9 | Config. |
| BCK-05 | M | 11.3 Requisitos | S9 | Log. |
| BCK-06 | M | 11.3 Requisitos | S9 | Reporte. |
| BCK-07 | M | 11.3 Requisitos | S9 | Reporte. |
| BCK-08 | M | 11.3 Requisitos | S9 | Simulacro. |
| BCK-09 | M | 11.3 Requisitos | S9 | Test. |
| BCK-10 | M | 11.3 Requisitos | S9 | Escaneo. |
| BCK-11 | M | 11.3 Requisitos | S9 | Test. |
| BCK-12 | M | 11.3 Requisitos | S9 | Test de corte. |
| BCK-13 | M | 11.3 Requisitos | S9 | Test. |
| BCK-14 | M | 11.3 Requisitos | S9 | Test. |
| BCK-15 | M | 11.3 Requisitos | S9 | Test. |
| BCK-16 | M | 11.3 Requisitos | S9 | Documento + simulacro. |
| BCK-17 | M | 11.3 Requisitos | S9 | Revisión. |
| BCK-18 | M | 11.3 Requisitos | S9 | Simulacro. |
| BCK-19 | S | 11.3 Requisitos | S9 | Test. |
| BCK-20 | M | 11.3 Requisitos | S9 | Inspección. |
| BCK-21 | M | 11.3 Object Lock | S9 | Config de bucket + test. |
| BCK-22 | M | 11.3 Object Lock | S9 | Credenciales separadas. |
| BCK-23 | M | 11.3 Object Lock | S9 | Custodia off-host. |
| SEO-01 | M | 12.1 Requisitos | S6/S9 | Crawl + meta. |
| SEO-02 | M | 12.1 Requisitos | S6/S9 | Crawl. |
| SEO-03 | M | 12.1 Requisitos | S6/S9 | Test. |
| SEO-04 | M | 12.1 Requisitos | S6/S9 | Validadores. |
| SEO-05 | M | 12.1 Requisitos | S6/S9 | Schema validator. |
| SEO-06 | M | 12.1 Requisitos | S6/S9 | XML validation. |
| SEO-07 | M | 12.1 Requisitos | S6/S9 | Crawl. |
| SEO-08 | M | 12.1 Requisitos | S6/S9 | Matriz hreflang. |
| SEO-09 | M | 12.1 Requisitos | S6/S9 | E2E. |
| SEO-10 | M | 12.1 Requisitos | S6/S9 | Tests HTTP. |
| SEO-11 | M | 12.1 Requisitos | S6/S9 | Inspección. |
| SEO-12 | M | 12.1 Requisitos | S6/S9 | Crawl. |
| SEO-13 | M | 12.1 Requisitos | S6/S9 | Test. |
| SEO-14 | M | 12.1 Requisitos | S6/S9 | Revisión. |
| SEO-15 | M | 12.1 Requisitos | S6/S9 | Validator. |
| SEO-16 | M | 12.1 Requisitos | S6/S9 | XML validation. |
| SEO-17 | M | 12.1 Requisitos | S6/S9 | Crawl empty. |
| SEO-18 | M | 12.1 Requisitos | S6/S9 | Inspección. |
| SEO-19 | M | 12.1 Requisitos | S6/S9 | Test sin JS. |
| SEO-20 | M | 12.1 Requisitos | S6/S9 | Inspección. |
| SEO-21 | S | 12.1 Requisitos | S6/S9 | Log. |
| SEO-22 | M | 12.1 Requisitos | S6/S9 | Setup. |
| SEO-23 | M | 12.1 Requisitos | S6/S9 | Crawl. |
| SEO-24 | M | 12.1 Requisitos | S6/S9 | Revisión. |
| SEO-25 | M | 12.1 Requisitos | S6/S9 | CI. |
| PRIV-01 | M | Sección 13 | S10 | Inspección de red. |
| PRIV-02 | M | Sección 13 | S10 | Network. |
| PRIV-03 | M | Sección 13 | S10 | Cookie audit. |
| PRIV-04 | M | Sección 13 | S10 | Legal review. |
| PRIV-05 | M | Sección 13 | S10 | Inspección. |
| PRIV-06 | M | Sección 13 | S10 | Política. |
| PRIV-07 | M | Sección 13 | S10 | Revisión. |
| PRIV-08 | M | Sección 13 | S10 | Config. |
| PRIV-09 | M | Sección 13 | S10 | Legal. |
| PRIV-10 | M | Sección 13 | S10 | Runbook. |
| PRIV-11 | M | Sección 13 | S10 | Legal. |
| PRIV-12 | M | Sección 13 | S10 | Legal. |
| PRIV-13 | M | Sección 13 | S10 | Config. |
| PRIV-14 | M | Sección 13 | S10 | Runbook. |
| PRIV-15 | M | Sección 13 | S10 | Proceso. |
| A11Y-01 | M | Sección 14 | S10 | Teclado manual + axe. |
| A11Y-02 | M | Sección 14 | S10 | Inspección. |
| A11Y-03 | M | Sección 14 | S10 | axe. |
| A11Y-04 | M | Sección 14 | S10 | axe. |
| A11Y-05 | M | Sección 14 | S10 | axe + manual. |
| A11Y-06 | M | Sección 14 | S10 | Revisión. |
| A11Y-07 | M | Sección 14 | S10 | E2E + manual. |
| A11Y-08 | M | Sección 14 | S10 | E2E + SR. |
| A11Y-09 | M | Sección 14 | S10 | axe + E2E. |
| A11Y-10 | M | Sección 14 | S10 | Inspección. |
| A11Y-11 | M | Sección 14 | S10 | E2E. |
| A11Y-12 | M | Sección 14 | S10 | E2E. |
| A11Y-13 | M | Sección 14 | S10 | Mobile audit. |
| A11Y-14 | M | Sección 14 | S10 | Manual. |
| A11Y-15 | M | Sección 14 | S10 | Revisión. |
| A11Y-16 | M | Sección 14 | S10 | E2E. |
| A11Y-17 | M | Sección 14 | S10 | Manual + axe. |
| A11Y-18 | M | Sección 14 | S10 | axe. |
| A11Y-19 | M | Sección 14 | S10 | Print. |
| A11Y-20 | M | Sección 14 | S10 | Reporte. |
| A11Y-21 | M | Sección 14 | S10 | Página + crawl. |
| A11Y-22 | M | Sección 14 | S10 | Revisión. |
| A11Y-23 | M | Sección 14 | S10 | E2E + revisión de contenido. |
| A11Y-24 | M | Sección 14 | S10 | Test de foco + inspección. |
| A11Y-25 | M | Sección 14 | S10 | E2E + teclado. |
| A11Y-26 | M | Sección 14 | S10 | Revisión. |
| A11Y-27 | M | Sección 14 | S10 | Revisión. |
| A11Y-28 | M | Sección 14 | S10 | E2E + revisión de flujos. |
| LEG-01 | M | Sección 15 | S10 | Footer. |
| LEG-02 | M | Sección 15 | S10 | Test. |
| LEG-03 | M | Sección 15 | S10 | Test. |
| LEG-04 | M | Sección 15 | S10 | Inspección. |
| LEG-05 | M* | Sección 15 | S10 | Checklist. |
| LEG-06 | M* | Sección 15 | S10 | Checklist. |
| LEG-07 | M | Sección 15 | S10 | Checklist. |
| LEG-08 | M | Sección 15 | S10 | Manifest + revisión. |
| LEG-09 | M | Sección 15 | S10 | Manifest + UI. |
| LEG-10 | M | Sección 15 | S10 | Links. |
| LEG-11 | M | Sección 15 | S10 | Documento. |
| LEG-12 | M | Sección 15 | S10 | Alcance. |
| LEG-13 | M | Sección 15 | S10 | Revisión. |
| LEG-14 | M | Sección 15 | S10 | `exiftool`. |
| LEG-15 | M | Sección 15 | S10 | Legal review. |
| LEG-16 | M | Sección 15 | S10 | Inspección. |
| LEG-17 | M | Sección 15 | S10 | Página. |
| LEG-18 | M | Sección 15 | S10 | Changelog. |
| OPS-01 | M | Sección 16 | S10 | Inspección. |
| OPS-02 | M | Sección 16 | S10 | Test. |
| OPS-03 | M | Sección 16 | S10 | E2E. |
| OPS-04 | M | Sección 16 | S10 | Config. |
| OPS-05 | M | Sección 16 | S10 | Test. |
| OPS-06 | M | Sección 16 | S10 | Test. |
| OPS-07 | M | Sección 16 | S10 | Inspección. |
| OPS-08 | M | Sección 16 | S10 | Config. |
| OPS-09 | M | Sección 16 | S10 | Dashboard. |
| OPS-10 | M | Sección 16 | S10 | Config. |
| OPS-11 | M | Sección 16 | S10 | Calendario. |
| OPS-12 | M | Sección 16 | S10 | CI. |
| OPS-13 | M | Sección 16 | S10 | Test. |
| OPS-14 | M | Sección 16 | S10 | Documentos. |
| OPS-15 | M | Sección 16 | S10 | Reporte. |
| OPS-16 | M | Sección 16 | S10 | Documento. |
| OPS-17 | M | Sección 16 | S10 | Test. |
| OPS-18 | M | Sección 16 | S10 | Test. |
| OPS-19 | M | Sección 16 | S10 | Dashboard. |
| OPS-20 | M | Sección 16 | S10 | Test. |
| OPS-21 | M | Sección 16 | S10 | Inspección. |
| OPS-22 | M | Sección 16 | S10 | Inspección. |
| OPS-23 | M | Sección 16 | S10 | Revisión. |
| OPS-24 | M | Sección 16 | S10 | CI/manual. |
| OPS-25 | M | Sección 16 | S10 | Runbook. |
| OPS-26 | S | Sección 16 | S10 | Futuro. |
| OPS-27 | M | Sección 16 | S10 | Inspección. |
| OPS-28 | M | Sección 16 | S10 | Config. |
| OPS-29 | M | Sección 16 | S10 | Inspección. |
| OPS-30 | M | Sección 16 | S10 | Test de carga. |
| VER-01 | M | 17.1 Política de versiones | S0/S3 | `pnpm-lock.yaml`. |
| VER-02 | M | 17.1 Política de versiones | S0/S3 | Compose/CI. |
| VER-03 | M | 17.1 Política de versiones | S0/S3 | Documento. |
| VER-04 | M | 17.1 Política de versiones | S0/S3 | Checklist. |
| VER-05 | M | 17.1 Política de versiones | S0/S3 | Legal. |
| VER-06 | M | 17.1 Política de versiones | S0/S3 | Spike. |
| VER-07 | M | 17.1 Política de versiones | S0/S3 | Matriz. |
| VER-08 | M | 17.1 Política de versiones | S0/S3 | DNS/TLS. |
| VER-09 | M | 17.1 Política de versiones | S0/S3 | Test de entrega. |
| VER-10 | M | 17.1 Política de versiones | S0/S3 | CI. |
| VER-11 | M | 17.1 Política de versiones | S0/S3 | Revisión. |
| VER-12 | M | 17.1 Política de versiones | S0/S3 | Checklist. |
| DEP-01 | M | 18.1 Hardware y sistema | S9 | Inventario. |
| DEP-02 | M | 18.1 Hardware y sistema | S9 | `lsb_release`. |
| DEP-03 | M | 18.1 Hardware y sistema | S9 | `lsblk`. |
| DEP-04 | M | 18.1 Hardware y sistema | S9 | Test. |
| DEP-05 | M | 18.1 Hardware y sistema | S9 | Test de corte. |
| DEP-06 | M | 18.1 Hardware y sistema | S9 | `ip a`, `timedatectl`. |
| DEP-07 | M | 18.1 Hardware y sistema | S9 | `ufw status`, `nmap`. |
| DEP-08 | M | 18.1 Hardware y sistema | S9 | `systemctl`. |
| DEP-09 | M | 18.1 Hardware y sistema | S9 | `systemctl status`. |
| DEP-10 | M | 18.1 Hardware y sistema | S9 | `dig`, curl. |
| DEP-11 | M | 18.1 Hardware y sistema | S9 | Test. |
| DEP-12 | M | 18.1 Hardware y sistema | S9 | Test de corte. |
| DEP-13 | M | 18.1 Hardware y sistema | S9 | Test. |
| DEP-14 | M | 18.1 Hardware y sistema | S9 | Test. |
| DEP-15 | M | 18.1 Hardware y sistema | S9 | Test. |
| DEP-16 | M | 18.1 Hardware y sistema | S9 | Test HTTP. |
| DEP-17 | M | 18.1 Hardware y sistema | S9 | securityheaders. |
| DEP-18 | M | 18.1 Hardware y sistema | S9 | Headers. |
| DEP-19 | M | 18.1 Hardware y sistema | S9 | Test. |
| DEP-20 | M | 18.1 Hardware y sistema | S9 | Runbook. |
| DEP-21 | M | 18.1 Hardware y sistema | S9 | Inspección. |
| DEP-22 | M | 18.1 Hardware y sistema | S9 | Test. |
| DEP-23 | M | 18.1 Hardware y sistema | S9 | Test. |
| DEP-24 | M | 18.1 Hardware y sistema | S9 | Config. |
| DEP-25 | M | 18.1 Hardware y sistema | S9 | Calendario. |
| DEP-26 | M | 18.1 Hardware y sistema | S9 | Simulacro. |
| DEP-27 | M | 18.1 Hardware y sistema | S9 | Escaneo. |
| DEP-28 | M | 18.1 Hardware y sistema | S9 | Test. |
| DEP-29 | M | 18.1 Hardware y sistema | S9 | Cronómetro. |
| DEP-30 | M | 18.1 Hardware y sistema | S9 | Reporte. |

---

## 5. Requisitos condicionados y bloqueados

Al cierre de este documento no hay requisitos `M` sin al menos una prueba o
evidencia planificada. Las decisiones abiertas del SRS (hardware, correo,
licencia, personas identificables, colecciones y demo) bloquean la aprobación
final, no la trazabilidad.

| Requisito | Condición/Bloqueo | Acción |
|---|---|---|
| RF-P71, PRIV-05, SEG-38 | Falta confirmar correo/proveedor (`D-10`). | Decidir antes de S8. |
| DEP-01–DEP-04 | Falta inventario del servidor. | Completar antes de S9. |
| LEG-01–LEG-18 | Falta decisión de licencia y personas identificables. | Resolver antes de S10. |
| RF-P90–RF-P93 | Falta decidir si se lanza con demo (`D-11`). | Resolver antes de S6. |
| LEG-05, LEG-06 | Condicionado a `D-27` (personas identificables). | Resolver antes de publicar. |
| SEG-40 | gitleaks planificado, no activo (`D-30`). | Configurar remoto y `.gitleaks.toml`. |

## 5b. Requisitos condicionados a decisión abierta

| ID | Condición | Decisión | Estado |
|---|---|---|---|
| RF-P71 | Confirmar correo/proveedor | `D-10` | Abierta |
| LEG-05 | Personas identificables | `D-27` | Abierta |
| LEG-06 | Menores: autorización tutor | `D-27` | Abierta |
| RF-P90 | Decidir demo/licencia | `D-11` | Propuesta |
| RF-P91 | Decidir demo/licencia | `D-11` | Propuesta |
| RF-P92 | Decidir demo/licencia | `D-11` | Propuesta |

---

## 6. Mantenimiento

- El orquestador revisa esta matriz al inicio y al cierre de cada sprint.
- QA añade la evidencia real en `docs/04-calidad/reportes/`.
- El release manager verifica que todos los `M` tengan evidencia antes del tag.
- Cualquier requisito nuevo entra por rama `docs/srs-*` y actualiza esta matriz.
