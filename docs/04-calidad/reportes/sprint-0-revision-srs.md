# Revisión independiente — SRS v1.1 y Gate 0

**Proyecto:** `photo-portfolio`  
**Revisor:** revisor independiente (rol)  
**Fecha:** 17 de noviembre de 2026  
**Rama revisada:** `docs/ux-v1` @ `6d9f9f3`; SRS v1.1 en `docs/srs-v1.1` @ `f926d93`  
**Alcance:** SRS v1.1, decisiones, riesgos, cambios, plan de sprints,
trazabilidad, skills, fase 00, `README.md`, `AGENTS.md`, `SECURITY.md`,
assets demo, `.gitignore` y `.env.example`. UX y producto se usan como
contraste, no como fuente de verdad.  
**Restricción:** revisión de solo lectura. Este informe es la única escritura.

---

## 1. Veredicto

**RECHAZADO para el Gate 0.** No se aprueba el SRS v1.1 ni el merge de las ramas
de gestión a `main` en su estado actual.

La estructura es sólida: secciones 0–20 completas, 429 requisitos con ID único,
429 filas de trazabilidad sin faltantes ni duplicados, `RF-P40` correctamente
definido como interenlace, dominio consistente y una cobertura amplia de
seguridad, estados vacíos y backups. El problema no es la cantidad ni la
organización: son las contradicciones P1 en los ejes que el usuario corrigió
(servidor propio sin UPS y seguridad autogestionada).

Motivos que bloquean:

- **P1-1:** el mínimo de 4 GB de RAM no soporta un worker de 2 GB más una
  entrada de video de hasta 2 GB en `tmpfs`.
- **P1-2:** LUKS y el arranque desatendido tras un corte son incompatibles sin
  TPM/clevis, y el SRS no define ese desbloqueo.
- **P1-3:** el SRS afirma un “backup inmutable” que ningún requisito exige; las
  credenciales de escritura del backup viven en el servidor.
- **P1-4:** el fallback a Windows contradice `D-09` y deja varios `M` de Linux
  sin equivalente definido.

---

## 2. Verificaciones que pasan

- **Secciones 0–20:** presentes y completas (SRS de 1397 líneas).
- **Conteo:** 429 requisitos, 429 únicos, 0 duplicados; 40 escenarios `AC-01`–
  `AC-40`, 40 únicos.
- **Trazabilidad:** 429 filas, 429 únicas, 0 faltantes, 0 extra, 0 duplicadas;
  las 429 prioridades del SRS coinciden con las de la matriz.
- **`RF-P40`:** definido en `docs/00-gestion/srs-v1.1.md:465` y descrito como
  interenlace obligatorio en `docs/00-gestion/srs-v1.1.md:142`. No es un ID
  duplicado ni una referencia huérfana.
- **Dominio:** `photo.patriciobet.dev`, `admin-photo.patriciobet.dev` y
  `cdn-photo.patriciobet.dev` son consistentes en `docs/00-gestion/srs-v1.1.md:3`,
  `docs/00-gestion/decisiones.md:9` y `.env.example:13-15`.
- **“Sin backup”:** correctamente interpretado como **sin UPS**, no como ausencia
  de backups de datos, en `docs/00-gestion/srs-v1.1.md:900` y
  `docs/00-gestion/decisiones.md:20`.
- **`.env`:** ignorado por `.gitignore:5-7`; `.env.example` solo contiene nombres
  y valores vacíos. No se detectaron valores reales por inspección manual, pero
  eso **no** equivale a un escaneo de secretos (ver P2-9).
- **Estado vacío:** hay requisitos explícitos de build, home, listados, sitemap,
  RSS, 404 y onboarding del admin (`RF-P06`–`RF-P09`, `RF-A38`, `RF-A46`,
  `AC-01`), aunque con las reservas de P2-1 y P2-3.
- **Assets demo:** política, manifest vacío, esquema, `is_demo`, procedencia,
  licencia, reemplazo y retiro están cubiertos (`assets/demo/README.md`,
  `assets/demo/manifest.json`, `assets/demo/manifest.schema.json`,
  `RF-P90`–`RF-P93`, `RF-M46`, `LEG-08`).

---

## 3. Hallazgos P1

### P1-1 — El dimensionamiento de RAM no soporta el pipeline definido

**Ubicación:** `docs/00-gestion/srs-v1.1.md:1163`, `:587`, `:601`, `:506`,
`:848`.

**Problema:** `DEP-01` fija un mínimo de **4 GB de RAM**. En la misma máquina
deben convivir PostgreSQL, Redis, API, Caddy, el builder y los workers. `RF-M09`
asigna **2 GB** al contenedor del worker de imágenes; `RF-M21` exige entrada de
video “solo local en `tmpfs`” y `RF-A12` permite videos de hasta **2 GB**; el
worker de video no tiene un presupuesto de memoria explícito. Un archivo de 2 GB
en `tmpfs` consume 2 GB de RAM del host, además del límite del worker y del resto
de servicios. En el mejor caso el job falla; en el peor, el OOM killer mata
PostgreSQL o Caddy, y el sitio queda caído justo después de un corte eléctrico,
que es el escenario que el usuario pidió soportar.

**Evidencia:** `DEP-01` (4 GB mínimo), `RF-M09` (2 GB de worker), `RF-M21`
(`tmpfs`), `RF-A12` (video ≤ 2 GB), `SEG-21` (límites por contenedor) y la prueba
de apagón de `docs/00-gestion/srs-v1.1.md:1211-1219`, que no mide memoria.

**Corrección recomendada:** subir `DEP-01` a **8 GB mínimo / 16 GB ideal**, o
rediseñar el pipeline para entrada desde disco con `tmpfs` acotado (por ejemplo,
512 MB–1 GB) y streaming por bloques. Añadir una prueba de carga con el peor caso
—video de 2 GB + foto de 200 MP concurrentes— y un presupuesto de memoria por
servicio. Actualizar `R-09`/`R-10` y el runbook de disco lleno.

### P1-2 — LUKS y arranque desatendido son incompatibles sin TPM/clevis

**Ubicación:** `docs/00-gestion/srs-v1.1.md:1165`, `:844`, `:1174`, `:1167`,
`:1217`.

**Problema:** `DEP-03` y `SEG-17` piden LUKS “si el hardware lo permite”, mientras
`DEP-12` exige que el servidor arranque **sin login manual y sin intervención**
tras un corte. Un disco LUKS con passphrase pide la clave en el arranque; sin
TPM2/clevis, alguien tiene que escribirla. El SRS no menciona TPM, clevis, tang
ni una clave de desbloqueo automático. Si se instala LUKS, el sitio puede quedar
caído hasta que una persona llegue al servidor; si no se instala, se debilita la
seguridad que el usuario pidió priorizar.

**Evidencia:** `DEP-03` y `SEG-17` (LUKS), `DEP-12` (arranque sin intervención),
`DEP-05` (BIOS “Power On”), paso 3 de la prueba de apagón en
`docs/00-gestion/srs-v1.1.md:1217` (“BIOS arranca, systemd/Docker levantan”).
No hay requisito de TPM2, PCR, clevis ni clave de recuperación.

**Corrección recomendada:** decidir y documentar una de estas opciones:

1. **TPM2 + `systemd-cryptenroll`/clevis** con política de PCR y clave de
   recuperación sellada fuera del servidor; probar arranque en frío real.
2. **LUKS manual** y aceptar que el arranque deja de ser desatendido; esto
   contradice la corrección del usuario, así que exige aprobación explícita y un
   cambio consciente de `DEP-12`.
3. **Sin LUKS** en v1, con riesgo residual explícito y compensaciones físicas.

Sea cual sea la opción, la prueba de corte debe verificar el arranque completo y,
si hay LUKS, el desbloqueo automático; guardar la clave de recuperación con
custodia documentada.

### P1-3 — El “backup inmutable” no tiene requisito de inmutabilidad

**Ubicación:** `docs/00-gestion/srs-v1.1.md:954`, `:927`, `:928`, `:851`,
`docs/00-gestion/riesgos.md:10`.

**Problema:** el escenario de ransomware dice “restaurar desde backup
inmutable/offsite”, pero `BCK-01`–`BCK-20` no exigen Object Lock, retención
inmutable ni una credencial de backup sin permiso de borrado. `BCK-02` protege la
confidencialidad con una contraseña fuera del servidor, pero el job de backup
necesita una credencial de escritura **en el servidor**. Si el servidor se
compromete, esa credencial puede sobrescribir o borrar el repositorio; el cifrado
no impide el borrado. `R-03` menciona ransomware, pero su mitigación no incluye
inmutabilidad ni separación de credenciales. El control que el SRS afirma puede
fallar exactamente cuando se necesita.

**Evidencia:** `docs/00-gestion/srs-v1.1.md:954` (backup inmutable), `:927`
(contraseña fuera del servidor), `:928` (offsite), `:851` (`SEG-24`), `:919`
(secretos en gestor), `docs/00-gestion/riesgos.md:10` (`R-03`). No hay
`Object Lock`, `compliance mode`, `append-only` ni “credencial sin delete” en
`BCK-*`.

**Corrección recomendada:** añadir requisitos equivalentes a:

- `BCK-21`: Object Lock/immutabilidad en el bucket de backups, retención 30
  diarios + 12 mensuales, modo compliance.
- `BCK-22`: credencial de backup separada, solo escritura/append, sin permiso de
  borrado; cuenta o proyecto distinto del R2 de producción.
- `BCK-23`: custodia y escrow de la contraseña de restic; recuperación sin el
  servidor ni la laptop de desarrollo.

Probar el escenario “servidor comprometido intenta borrar backups” y registrar
la evidencia. Actualizar `R-03`/`R-06` y el runbook de ransomware.

### P1-4 — El fallback a Windows contradice `D-09` y deja `M` sin equivalente

**Ubicación:** `docs/00-gestion/srs-v1.1.md:153-154`, `:1164`, `:167`;
`docs/00-gestion/decisiones.md:16`; requisitos Linux en `:838`, `:841`, `:843`,
`:1165`, `:1169`, `:1170`.

**Problema:** el supuesto 2 del SRS y `DEP-02` permiten “Windows + Docker si no es
viable Linux”. `D-09` dice que Windows es **solo para desarrollo**. Además,
varios `M` están escritos para Linux y no tienen equivalente Windows:
`SEG-11` (Ubuntu Server), `DEP-03` (LUKS/ext4), `DEP-07` (UFW), `DEP-08`
(systemd/Docker al arranque), `SEG-14` (`unattended-upgrades`) y `SEG-16`
(`auditd`/AIDE). Si se elige Windows, el SRS no dice cómo cumplirlos; si se elige
Ubuntu, el fallback es una fuente de verdad en conflicto.

**Evidencia:** `docs/00-gestion/srs-v1.1.md:153-154`, `:1164`, `:167`;
`docs/00-gestion/decisiones.md:16` (`D-09`); lista de requisitos Linux citada.
No hay anexo Windows ni matriz de controles equivalentes.

**Corrección recomendada:** hacer de **Ubuntu Server LTS el único objetivo de v1**
y mover Windows a “solo desarrollo” o a un `C`/spike separado. Alternativa: crear
un ADR Windows con matriz de equivalencias y criterios de aceptación propios, y
degradar los `M` Linux que no apliquen. Actualizar supuesto 2, `DEP-02`, `D-09` y
la decisión abierta 2.

---

## 4. Hallazgos P2

### P2-1 — Inventario de rutas incompleto e inconsistente

**Ubicación:** `docs/00-gestion/srs-v1.1.md:372-373`, `:377`, `:378`, `:471`,
`:1072`, `:1065`, `:1054`; `docs/02-ux/sitemap.md:40-42`, `:54-57`, `:66-68`,
`:80-97`.

**Problema:** `RF-P01`/`RF-P02` no incluyen `/terminos/`, `/creditos/`,
`/accesibilidad/`, la home `/en/`, la paginación ni el índice `/etiquetas/`.
`RF-P06` sí exige un estado vacío para `/etiquetas/`, pero esa ruta no está en
`RF-P01` ni tiene plantilla en el sitemap. `LEG-10` exige privacidad y términos en
el footer; `LEG-03` exige página de créditos; el sitemap las lista como
indexables. `A11Y-21` deja la declaración de accesibilidad en `S`, aunque el
sitemap la pone en el footer y el plan la difiere a S12. El crawl de `AC-01`,
`AC-26` y `AC-28` no puede derivar un conjunto estable de rutas.

**Evidencia:** rutas ES/EN en `docs/00-gestion/srs-v1.1.md:372-373`; estados
vacíos en `:377`; sitemap con legales, paginación y EN en
`docs/02-ux/sitemap.md:54-57`, `:66-68`, `:80-97`; obligaciones legales en
`:1072`, `:1065`; `A11Y-21` en `:1054`.

**Corrección recomendada:** convertir el inventario de rutas en una tabla
normativa completa (ES/EN, paginación, índice de etiquetas, legales, 404/410/503,
RSS/sitemap). Decidir si `/etiquetas/` existe y añadirla a `RF-P01`/sitemap, o
quitarla de `RF-P06`. Alinear la prioridad de `A11Y-21` y de las páginas legales
con el footer y el plan de sprints.

### P2-2 — `§20.1` contradice las prioridades reales de los requisitos

**Ubicación:** `docs/00-gestion/srs-v1.1.md:1337-1341`, `:406`, `:378`, `:983`,
`:471`, `:670`, `:1113`, `:944`, `:521`.

**Problema:** el roadmap dice que “v1 = todos los M” y lista candidatos `S` y `C`,
pero varias entradas no coinciden con la tabla:

- “hover preview” aparece como `S`, pero `RF-P25` es `M` y `RF-M26` es `M`.
- “RSS” aparece como `S`, pero `RF-P07` es `M` y `SEO-16` es `M`.
- “galería 3D `/explorar/`” aparece como `C`, pero `RF-V11` es `S`.
- “página de estado pública” aparece como `C`, pero `OPS-26` y `BCK-19` son `S`.
- “IA de metadatos” aparece como `C`, pero `RF-A24` es `S`.

El alcance de v1 no se puede determinar leyendo el roadmap: el roadmap y la tabla
de requisitos del mismo SRS dicen cosas distintas.

**Evidencia:** lista en `:1337-1341`; requisitos citados en `:406`, `:378`,
`:983`, `:471`, `:670`, `:1113`, `:944`, `:521`.

**Corrección recomendada:** generar `§20.1` desde la tabla de requisitos (o
eliminarla y referenciar `trazabilidad.md`). Resolver cada caso: promover a `M`,
degradar a `S`/`C` o quitar del roadmap. Añadir una comprobación automática que
falle si una prioridad del roadmap no coincide con el SRS.

### P2-3 — Requisitos `M` que dependen de funciones `S`

**Ubicación:** `docs/00-gestion/srs-v1.1.md:378`, `:471`, `:446`, `:445`,
`:1291`, `:434`, `:1040`; `docs/00-gestion/plan-sprints.md:374`.

**Problema:** “v1 = todos los M” no se cumple si un `M` necesita un `S`:

- `RF-P07` (`M`) exige un build con **RSS válido**, pero `RF-P46` (RSS) es `S`.
- `RF-P61` (`M`) exige estado vacío de búsqueda, pero `RF-P60` (Pagefind) es `S`.
- `AC-23` exige subtítulos como criterio de aceptación, pero `RF-P53`
  (subtítulos) es `S`; `plan-sprints.md:374` los difiere a S12, mientras
  `A11Y-07` (`M`) los pide “cuando haya voz”.

Si se difiere el `S`, el `M` o el `AC` falla; si se implementa el `S`, deja de ser
opcional. La prioridad no describe el alcance real.

**Evidencia:** `RF-P07` en `:378`; `RF-P46` en `:471`; `RF-P61` en `:446`;
`RF-P60` en `:445`; `AC-23` en `:1291`; `RF-P53` en `:434`; `A11Y-07` en
`:1040`; plan en `docs/00-gestion/plan-sprints.md:374`.

**Corrección recomendada:** promover RSS y subtítulos a `M`, o quitar RSS de
`RF-P07` y subtítulos de `AC-23`/`A11Y-07` con una regla explícita (“solo si hay
voz y el asset los declara”). Definir el comportamiento de `/buscar/` cuando
Pagefind no está. Actualizar trazabilidad y presupuesto de v1.

### P2-4 — La sección 5 de trazabilidad se contradice y los sprints no coinciden

**Ubicación:** `docs/00-gestion/trazabilidad.md:547`, `:549-552`, `:556-559`,
`:54-57`, `:417-431`, `:432-453`, `:472-501`.

**Problema:** la sección se titula “Requisitos sin cobertura conocida”, pero el
texto afirma que “no hay requisitos `M` sin al menos una prueba o evidencia
planificada” y, justo después, lista requisitos bloqueados. La tabla no distingue
“sin cobertura” de “cobertura planificada pero no verificable”. Además, la tabla
resumen dice `OPS` en `S9`, `A11Y` en `S6/S8` y `PRIV` en `S8/S10`, mientras las
filas individuales asignan `S10` a `OPS-01`–`OPS-30`, `A11Y-01`–`A11Y-22` y
`PRIV-01`–`PRIV-15`. No se sabe si `S6/S8` es implementación y `S10` verificación,
o si una de las dos tablas está mal.

**Evidencia:** título y texto en `:547-552`; tabla de bloqueos en `:556-559`;
resumen en `:54-57`; filas `PRIV` en `:417-431`, `A11Y` en `:432-453`, `OPS` en
`:472-501`.

**Corrección recomendada:** renombrar la sección a “Requisitos con evidencia
bloqueada” y separar “cobertura planificada” de “evidencia disponible”. Alinear
las columnas de sprint con la tabla resumen o añadir dos columnas (implementación
y verificación). Añadir una comprobación que compare prioridad, sprint y `AC` de
cada fila con el SRS.

### P2-5 — `AC-24` apunta a `RF-P56`, que es PiP y no tiene relación

**Ubicación:** `docs/00-gestion/trazabilidad.md:91`;
`docs/00-gestion/srs-v1.1.md:437`, `:436`, `:469`;
`docs/01-producto/criterios-aceptacion.md:89`.

**Problema:** `AC-24` es “Reduced motion/Save-Data/WebGL ausente”, pero la matriz
lo mapea a `RF-P56` (Picture-in-Picture, prioridad `C`). Faltan los requisitos que
sí aplican: `RF-P55` (sin autoplay/preview con reduced-motion), `RF-P44` (View
Transitions) y, según el caso, `RF-P10`/`RF-P13`. El criterio de aceptación queda
imposible de verificar con esa trazabilidad.

**Evidencia:** `AC-24` en `trazabilidad.md:91`; `RF-P56` en
`srs-v1.1.md:437`; `RF-P55` en `:436`; `RF-P44` en `:469`; criterio en
`docs/01-producto/criterios-aceptacion.md:89`.

**Corrección recomendada:** reemplazar `RF-P56` por `RF-P55`, `RF-P44`,
`RF-P10`, `RF-P13` y `RF-V07`/`RF-V13`; alinear el sprint con la fila del SRS
(`S6/S8`) y añadir la prueba de “sin WebGL + reduced-motion + Save-Data” al
reporte de `AC-24`.

### P2-6 — Un solo admin, identidad de respaldo y alta de passkey se contradicen

**Ubicación:** `docs/00-gestion/srs-v1.1.md:152`, `:824`, `:492`, `:496`;
`docs/00-gestion/decisiones.md:19`; `docs/02-ux/sitemap.md:263-264`;
`docs/02-ux/flujos/admin.md:54`.

**Problema:** hay dos conflictos:

1. `D-12` y el supuesto 1 dicen “un solo administrador”; `SEG-02` permite
   “opcionalmente, una identidad de respaldo” de Access. No hay decisión, dueño,
   procedimiento de alta ni revocación para esa segunda identidad. Una identidad
   de respaldo mal configurada amplía la superficie de acceso sin que el modelo
   de amenazas la cubra.
2. `RF-A03` dice que el alta de passkeys es **solo por CLI**; `RF-A07` y el
   onboarding de UX piden “configura tu passkey” dentro del admin. El
   implementador no sabe si el paso es CLI, UI o ambos.

**Evidencia:** `:152` (un admin), `:824` (`SEG-02`), `decisiones.md:19`
(`D-12`), `:492` (`RF-A03`, CLI), `:496` (`RF-A07`, onboarding), sitemap
`:263-264`, flujo `admin.md:54`.

**Corrección recomendada:** decidir si `SEG-02` existe. Si existe, documentar
identidad, aprobación, onboarding, revocación y runbook de break-glass; si no,
eliminarla y dejar `D-12` como única verdad. Para passkeys, definir: bootstrap por
CLI + enrollment/rotación autenticada en UI con reauth, o mantener todo por CLI y
cambiar el onboarding a “verifica passkey y recovery codes”.

### P2-7 — Decisiones abiertas bloquean `M` que el SRS ya declara v1

**Ubicación:** `docs/00-gestion/srs-v1.1.md:162-174`, `:1337`, `:455`, `:472`,
`:1067-1068`, `:555`, `:478-481`; `docs/00-gestion/decisiones.md:17-19`;
`docs/06-fases/fase-00-gestion.md:121-135`.

**Problema:** el SRS dice “v1 = todos los M”, pero hay `M` cuya aceptación depende
de decisiones abiertas: `RF-P71` (contacto) necesita `D-10` (correo/proveedor);
`RF-P47` (contacto sin JS) también; `LEG-05`/`LEG-06` (consentimientos) dependen
de personas identificables; `RF-A48`/`AC-40` dependen de contenido real y de la
decisión demo; `RF-P90`–`RF-P92` dependen del manifest/licencia y `RF-P93` es el
`S` asociado. El gate 0 puede aprobar el alcance, pero no puede declarar “todos
los M” verificables.

**Evidencia:** decisiones abiertas en `:162-174`; “todos los M” en `:1337`;
`RF-P71` en `:455`; `RF-P47` en `:472`; `LEG-05`/`LEG-06` en `:1067-1068`;
`RF-A48` en `:555`; demo en `:478-481`; `D-10` en `decisiones.md:17`; fase 00 en
`:121-135`.

**Corrección recomendada:** añadir a trazabilidad una columna “decisión
bloqueante” y marcar los `M` condicionados (`M | D-10`, etc.). Resolver antes del
Gate 0 las que afectan al alcance (correo, licencia, demo, personas) o aprobar
explícitamente el SRS “con condiciones” y un calendario de cierre. No declarar
“todos los M” sin esa matriz.

### P2-8 — “Lanzar con demo” y “demo fuera al lanzar” son incompatibles

**Ubicación:** `docs/00-gestion/srs-v1.1.md:158`, `:174`, `:554-555`, `:479`,
`:1308`; `assets/demo/README.md:17`.

**Problema:** el supuesto 6 dice que no habrá assets reales al inicio y que se
usarán demo; `RF-A48` (`M`) exige un checklist de lanzamiento con “contenido real,
demo fuera”; `AC-40` repite “demo fuera”; `RF-A47` (`M`) permite cargar/descargar
demo; `assets/demo/README.md:17` dice retirarlos antes del lanzamiento “salvo
decisión explícita”. Si no hay contenido real, `RF-A48`/`AC-40` no pueden pasar;
si se queda el demo, se incumple la regla de no presentarlo como obra real.
No hay un estado de lanzamiento válido definido para “sitio vacío con demo de
desarrollo”.

**Evidencia:** `:158` (supuesto 6), `:174` (decisión 9), `:554` (`RF-A47`),
`:555` (`RF-A48`), `:479` (`RF-P91`), `:1308` (`AC-40`), README `:17`.

**Corrección recomendada:** decidir la **decisión abierta 9** (demo al lanzar) de
forma explícita:

- **Lanzar vacío:** sitio editorial sin fotos/videos, demo solo en desarrollo y
  staging; `RF-A48`/`AC-40` se cumplen retirando demo.
- **Lanzar con demo:** permitir demo en producción con etiqueta “demo” visible,
  disclaimer legal y `noindex`; cambiar `RF-P91`/`RF-A48`/`AC-40` y el manifest.

La primera opción es la coherente con la corrección “el sitio debe funcionar
vacío”. Actualizar el checklist y la UI.

### P2-9 — Se afirman `gitleaks` y CI que todavía no existen

**Ubicación:** `SECURITY.md:45-46`, `README.md:104`,
`docs/00-gestion/srs-v1.1.md:872`, `docs/06-fases/fase-00-gestion.md:99-100`,
`:148`; `docs/00-gestion/plan-sprints.md:37`.

**Problema:** `SECURITY.md` dice “`gitleaks` corre en pre-commit y en CI”; `README`
dice que se ejecuta antes de cada push; `SEG-40` es `M`. Pero fase 00 marca
`gitleaks` como no instalado (“se instala en el sprint 3”), no hay
`.pre-commit-config.yaml`, no hay archivos de workflow en `.github/workflows` y no
hay remote configurado. El “cero secretos” de fase 00 se basa en revisión manual.
Si el Gate 0 se aprueba con esas afirmaciones, se está certificando un control
inexistente.

**Evidencia:** afirmaciones en `SECURITY.md:45`, `README.md:104`, `SEG-40`
(`srs:872`), plan `:37`; estado real en `fase-00:100` (“se instala en el sprint
3”), `:148` (“no está instalado localmente”); repo sin workflows, sin pre-commit
y sin remote.

**Corrección recomendada:** elegir una:

1. Implementar ahora `.pre-commit-config.yaml`, workflow de CI y `gitleaks`
   (aunque sea en modo local), ejecutar un escaneo y adjuntar el reporte al gate.
2. Cambiar `SECURITY.md`/`README` a “planificado, no activo”, marcar `SEG-40`
   como bloqueado y no declarar “cero secretos” hasta tener evidencia.

No mergear con la afirmación actual. Un escaneo manual no sustituye `gitleaks`.

### P2-10 — La afirmación WCAG 2.2 AA omite criterios AA

**Ubicación:** `docs/00-gestion/srs-v1.1.md:1030`, `:1040`, `:1035`, `:1046`,
`:520`, `:1054`; `docs/02-ux/accesibilidad.md:57`, `:62`, `:73`, `:78-79`.

**Problema:** el SRS declara WCAG 2.2 AA, pero:

- `A11Y-07` pide subtítulos/transcripción “cuando haya voz”, no descripción de
  audio (1.2.5, AA; y 1.2.3, A).
- `A11Y-02` pide foco visible, pero no “foco no oculto por cabecera fija”
  (2.4.11, AA).
- `A11Y-13` pide áreas táctiles, pero `RF-A23` exige reordenar **arrastrando** sin
  alternativa de botones (2.5.7, AA).
- No hay requisitos de ayuda consistente (3.2.6), entrada redundante (3.3.7) ni
  autenticación accesible (3.3.8).

La checklist de UX sí cubre 2.4.11, 2.5.7, 3.2.6, 3.3.7 y 3.3.8, pero el SRS es
la fuente de verdad y la trazabilidad no los mapea. La conformidad AA no se puede
afirmar todavía.

**Evidencia:** `:1030` (objetivo AA); `A11Y-07` en `:1040`; `A11Y-02` en `:1035`;
`A11Y-13` en `:1046`; `RF-A23` en `:520`; `A11Y-21` en `:1054`; checklist UX en
`docs/02-ux/accesibilidad.md:57`, `:62`, `:73`, `:78-79`.

**Corrección recomendada:** añadir requisitos `A11Y-23`–`A11Y-28` para 1.2.5,
2.4.11, 2.5.7, 3.2.6, 3.3.7 y 3.3.8, con verificación y mapeo a `AC-37`.
Añadir “alternativa de botones para reordenar” a `RF-A23`. Decidir si `A11Y-21`
es `M` (declaración pública) o retirar su enlace del footer.

### P2-11 — El registro de riesgos no refleja los P1/P2 ni los controles reales

**Ubicación:** `docs/00-gestion/riesgos.md:8-32`; en particular `:10` (`R-03`),
`:13` (`R-06`), `:16` (`R-09`), `:17` (`R-10`), `:27` (`R-20`).

**Problema:** faltan riesgos para:

- borrado/sobrescritura de backups con credenciales del servidor (P1-3);
- LUKS vs arranque desatendido (P1-2);
- fallback Windows vs controles Linux (P1-4);
- OOM por RAM/`tmpfs` (P1-1);
- custodia/escrow de la clave de restic y pérdida del único admin;
- CI/`gitleaks` inexistente mientras `R-06` lo usa como mitigación;
- envío de imágenes a un servicio de IA (P2-13).

`R-06` dice “Gitleaks” como mitigación, pero el control no está activo. Eso da una
falsa sensación de cobertura.

**Evidencia:** `riesgos.md:8-32`; `R-03` en `:10`; `R-06` en `:13`; `R-09` en
`:16`; `R-10` en `:17`; `R-20` en `:27`; estado de `gitleaks` en
`docs/06-fases/fase-00-gestion.md:148`.

**Corrección recomendada:** añadir `R-26`–`R-32` con probabilidad, impacto,
mitigación, propietario y fecha; marcar `R-06` como “mitigación planificada, no
activa” hasta que `gitleaks` corra. Revisar `R-03` para incluir Object Lock y
separación de credenciales.

### P2-12 — `RF-A30` omite el estado `trashed` que sí usan `DAT-01` y la UX

**Ubicación:** `docs/00-gestion/srs-v1.1.md:532`, `:759`, `:537`;
`docs/02-ux/flujos/admin.md:99-102`.

**Problema:** `RF-A30` enumera “borrador, publicado, archivado” y deja
“Programar publicación (`publish_at`) es S”. `DAT-01` define
`draft`/`published`/`archived`/`trashed`; `RF-A35` exige papelera de 30 días; el
flujo de admin dibuja `Trashed` con restaurar/purgar. El estado `trashed` falta en
el requisito de estados del admin, así que la aceptación puede no cubrir la
transición a papelera ni la restauración.

**Evidencia:** `RF-A30` en `:532`; `DAT-01` en `:759`; `RF-A35` en `:537`;
diagrama en `docs/02-ux/flujos/admin.md:99-102`.

**Corrección recomendada:** añadir `trashed` a `RF-A30`, definir transiciones
(`published → trashed`, `trashed → draft`, `trashed → purged`) y añadir un `AC`
específico de papelera/restauración (o ampliar `AC-11`). Alinear `DAT-01`, la UX
y las pruebas.

### P2-13 — La sugerencia de alt con IA choca con `PRIV-13`

**Ubicación:** `docs/00-gestion/srs-v1.1.md:521`, `:1022`, `:1341`.

**Problema:** `RF-A24` (`S`) envía una copia de baja resolución a un servicio
externo para sugerir alt/etiquetas. `PRIV-13` (`M`) prohíbe enviar imágenes a
servicios de IA sin decisión explícita y consentimiento. No hay decisión
registrada, proveedor, base legal, retención, DPA ni flujo de consentimiento; el
roadmap además llama “IA de metadatos” `C`. Si se implementa `RF-A24`, se
incumple `PRIV-13`; si no, el `S` no es construible.

**Evidencia:** `RF-A24` en `:521`; `PRIV-13` en `:1022`; “IA de metadatos” en
`:1341`.

**Corrección recomendada:** añadir una decisión explícita (proveedor, finalidad,
consentimiento, retención, DPA) y marcar `RF-A24` como condicionada y desactivada
por defecto; o retirarla de v1. Actualizar `PRIV-13`, el registro de riesgos y la
política de privacidad.

### P2-14 — `AC-16` confunde el borde de Cloudflare con el origen

**Ubicación:** `docs/00-gestion/srs-v1.1.md:1284`, `:1169`, `:884`, `:1171`.

**Problema:** `AC-16` dice “Solo 443 Cloudflare; IP directa no responde”. El
servidor usa Cloudflare Tunnel saliente y no expone 443; el 443 pertenece al
borde de Cloudflare, no al origen. Un escaneo de la IP del servidor debería
mostrar **ningún** puerto alcanzable, no 443. El criterio mezcla dos cosas y puede
pasar o fallar por la razón equivocada (por ejemplo, NAT del ISP en vez de UFW).

**Evidencia:** `AC-16` en `:1284`; `DEP-07` en `:1169`; `SEG-47` en `:884`;
`DEP-09` en `:1171`.

**Corrección recomendada:** reescribir `AC-16` en dos verificaciones:

1. Escaneo externo de la IP del servidor: 0 puertos alcanzables; `ss -tlnp`/UFW
   confirman que solo hay servicios locales y el Tunnel saliente.
2. `photo`/`admin-photo` responden por 443 **en Cloudflare**, con TLS válido y sin
   origen accesible directo.

Separar “Tunnel caído” de “origen expuesto” en el runbook.

---

## 5. Hallazgos P3

### P3-1 — Índices y estados de fase desactualizados

**Ubicación:** `docs/README.md:31-43`, `:79`;
`docs/06-fases/fase-01-ux.md:3`, `:18-25`;
`docs/06-fases/fase-00-gestion.md:160`.

**Problema:** `docs/README.md` marca producto y UX como “pendiente”, pero los
documentos existen (la mayoría ya commiteados; el prototipo está en el árbol sin
trackear). `fase-01-ux.md` dice “pendiente (no iniciada)” y lista entregables
existentes como pendientes. `fase-00` dice “commits pendientes” aunque hay 13
commits. La documentación de estado no permite saber qué está aprobado y qué solo
existe.

**Corrección:** actualizar estados a “en revisión”/“aprobado” según corresponda,
enlazar los archivos nuevos en el índice y corregir la evidencia de Git de fase
00.

### P3-2 — Referencia blanda a un “informe de assets” inexistente

**Ubicación:** `docs/00-gestion/srs-v1.1.md:1151`.

**Problema:** “IPTC/C2PA para procedencia de assets (ver informe de assets)” no
apunta a ningún archivo del repo. `LEG-16` ya resuelve correctamente a
`docs/01-producto/legal-privacidad.md` (existe), pero esta frase queda huérfana.

**Corrección:** enlazar a `assets/demo/README.md` y `assets/demo/manifest.schema.json`,
o crear el informe y referenciarlo.

### P3-3 — IDs no consecutivos sin explicación

**Ubicación:** `docs/00-gestion/srs-v1.1.md:372` (`RF-P48`/`P49` ausentes),
`:431` (`P50` tras `P39`), `:445` (`P60` tras `P58`), `:517` (`A20` tras `A17`),
`:600` (`M20` tras `M16`).

**Problema:** los rangos saltan números. No es un defecto funcional, pero un
lector que verifica “429 requisitos” puede interpretar los huecos como IDs
perdidos. La trazabilidad no explica los rangos reservados.

**Corrección:** añadir una nota en `§0.1` o un anexo con los rangos y los IDs
reservados/retirados, o renumerar solo si no hay dependencias externas.

### P3-4 — `.gitignore` no cubre varios formatos comunes de credenciales

**Ubicación:** `.gitignore:5-21`.

**Problema:** cubre `.env`, `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.crt`, `*.cer`,
`secrets/`, `.dev.vars`, `.wrangler/` y `cloudflared/`, pero no `*.kdbx`,
`id_rsa*`, `id_ed25519*`, `.pgpass`, `.netrc`, `.npmrc`, `*.ovpn`, `.aws/`,
`.azure/` ni `.config/gcloud/`. Un archivo de credencial puede quedar fuera del
patrón y entrar al índice.

**Corrección:** añadir esos patrones y un test de `.gitignore` que verifique que
un archivo señuelo en cada ruta queda ignorado.

### P3-5 — El hash del manifest no normaliza mayúsculas

**Ubicación:** `assets/demo/README.md:119`;
`assets/demo/manifest.schema.json:43`.

**Problema:** el esquema exige `^[a-f0-9]{64}$` (minúsculas). El README recomienda
`sha256sum` o `Get-FileHash`; en PowerShell, `Get-FileHash` devuelve el hash en
mayúsculas por defecto. Un asset registrado siguiendo el README puede fallar la
validación del esquema.

**Corrección:** normalizar a minúsculas en el procedimiento (`ToLowerInvariant()`)
o aceptar `[A-Fa-f0-9]{64}` en el esquema; añadir un script de validación del
manifest a CI.

### P3-6 — `§0.1` remite a una matriz que no está en la sección 19

**Ubicación:** `docs/00-gestion/srs-v1.1.md:51-52`.

**Problema:** dice “La matriz está en la sección 19 y en `trazabilidad.md`”. La
sección 19 contiene escenarios, evidencia y pruebas mínimas, no la matriz de
requisitos. La matriz real está en `trazabilidad.md`.

**Corrección:** cambiar a “La matriz está en `trazabilidad.md`; los escenarios de
aceptación, en `§19.3`”.

### P3-7 — `agent-reach` está “en uso” sin versión fijada ni evidencia de escaneo

**Ubicación:** `docs/00-gestion/skills.md:28`, `:52`.

**Problema:** `SK-01` figura “en uso”, con versión “gestionada por `agent-reach
update`”, pero la propia checklist exige “commit/tag fijado; no ‘latest’ sin
versión”. No hay commit, fecha de escaneo ni resultado de `skillspector`
registrado. Es una skill de terceros con red y navegador; el registro no permite
reproducir qué se revisó.

**Corrección:** fijar commit/tag y versión, registrar fecha y resultado del
escaneo, o degradar a “candidata” hasta completar la revisión.

### P3-8 — Referencia a `SEO-30`, que no existe

**Ubicación:** `docs/01-producto/actores-casos-uso.md:30`.

**Problema:** el caso de uso del rastreador referencia `SEO-01`–`SEO-30`, pero el
SRS define `SEO-01`–`SEO-25`. La referencia rota puede hacer que un requisito
inexistente se dé por cubierto.

**Corrección:** cambiar a `SEO-01`–`SEO-25` y añadir una comprobación de rangos
en la revisión de documentos.

### P3-9 — La fase 00 no registra dos de las ocho correcciones del usuario

**Ubicación:** `docs/06-fases/fase-00-gestion.md:69-77`.

**Problema:** la tabla “Correcciones del usuario incorporadas” tiene 7 filas y no
incluye explícitamente las correcciones 7 (ramas/commits atómicos/pruebas/
aprobación en GitHub) y 8 (nunca commitear `.env`/secretos). Esas reglas están en
`AGENTS.md`/`SECURITY.md`, pero la trazabilidad de la fase no las muestra.

**Corrección:** añadir ambas filas con sus archivos y evidencia, y actualizar el
estado de los checks correspondientes.

---

## 6. Cobertura de las ocho correcciones del usuario

| # | Corrección | Estado | Evidencia | Observación |
|---|---|---|---|---|
| 1 | Servidor propio antiguo siempre encendido, no la laptop de desarrollo | **CUBIERTA** | `decisiones.md:8` (`D-01`); `srs-v1.1.md:153`, `:1173` (`DEP-11`), `:1114` (`OPS-27`) | El hardware real sigue sin inventariar; ver P1-1 y riesgos. |
| 2 | Sin UPS; tolerar apagones y reinicios abruptos | **CUBIERTA** | `decisiones.md:11` (`D-04`); `srs-v1.1.md:159`, `:900`, `BCK-12`–`BCK-15`, `DEP-12`, `DEP-30`, `:1211-1219` | La contradicción LUKS/autoarranque (P1-2) impide cumplirla tal como está. |
| 3 | Seguridad autogestionada, sin accesos no deseados | **CUBIERTA** | `decisiones.md:12` (`D-05`); SRS §10 (`:782-896`), `SEG-01`–`SEG-47`; `SECURITY.md`; `AGENTS.md` §4 | Cobertura amplia; faltan inmutabilidad de backups (P1-3) y evidencia real de `gitleaks` (P2-9). |
| 4 | Dominio `photo.patriciobet.dev` | **CUBIERTA** | `decisiones.md:9` (`D-02`); `srs-v1.1.md:3`, `:138-145`; `.env.example:13-15` | Consistente en SRS, decisiones, env y sitemap. |
| 5 | Assets demo con licencia y procedencia verificables | **CUBIERTA** | `decisiones.md:14` (`D-07`), `:28` (`D-21`); `srs-v1.1.md:478-481`, `:624`; `assets/demo/README.md`; `manifest.json`; `manifest.schema.json` | La política es sólida; ver P2-8 (demo al lanzar) y P3-5 (hash). |
| 6 | Sitio funcional con cero fotos/videos | **PARCIAL** | `srs-v1.1.md:377-378` (`RF-P06`–`P07`), `:540` (`RF-A38`), `:553` (`RF-A46`), `:1269` (`AC-01`) | Faltan rutas completas (`/etiquetas/`, legales, EN) y RSS es `S`; ver P2-1/P2-3. |
| 7 | Ramas, commits atómicos, pruebas y aprobación en GitHub | **PARCIAL** | `AGENTS.md:72`, `:76`, `:101`; `plan-sprints.md:86`, `:98-99`, `:117`; historial de commits atómicos | No hay remote, protección de `main`, PRs ni CI; el flujo no está operativo. |
| 8 | Nunca commitear `.env` ni secretos | **PARCIAL** | `.gitignore:5-21`; `.env.example:1-5`; `SECURITY.md:37-39`; `README.md:97-100` | La prevención documental está; no hay `gitleaks`/pre-commit/CI ni evidencia automatizada. |

---

## 7. Verificación de conteo y trazabilidad

**Método:** extracción de IDs en filas de tabla del SRS y de
`trazabilidad.md`; no se cuentan menciones en prosa. Los IDs `RF-*` usan el
formato `RF-P01` (sin guion antes del número); los demás, `SEG-01`.

| Verificación | Resultado |
|---|---|
| Requisitos en el SRS | **429 filas, 429 únicos, 0 duplicados** |
| Escenarios de aceptación | **40 filas, 40 únicos** (`AC-01`–`AC-40`) |
| Filas normativas totales | **469** (429 requisitos + 40 AC) |
| Filas en `trazabilidad.md` | **429 filas, 429 únicos, 0 duplicados** |
| Requisitos del SRS ausentes en trazabilidad | **0** |
| Filas de trazabilidad que no existen en el SRS | **0** |
| Prioridades SRS vs trazabilidad | **429/429 coinciden** |

**Desglose por prefijo:**

| Prefijo | Cantidad | Prefijo | Cantidad |
|---|---:|---|---:|
| `RF-P` | 70 | `SEO` | 25 |
| `RF-A` | 48 | `PRIV` | 15 |
| `RF-M` | 41 | `A11Y` | 22 |
| `RF-V` | 18 | `LEG` | 18 |
| `RNF-R` | 13 | `OPS` | 30 |
| `DAT` | 20 | `DEP` | 30 |
| `SEG` | 47 | `VER` | 12 |
| `BCK` | 20 | **Total** | **429** |

**Conclusión del conteo:** la aritmética y la cobertura literal son correctas:
429/429, sin faltantes, extra ni duplicados. Eso **no** cura las inconsistencias
semánticas: `§20.1` contradice prioridades (P2-2), hay `M` que dependen de `S`
(P2-3), `AC-24` apunta a `RF-P56` (P2-5) y la sección 5 de trazabilidad se
contradice (P2-4). Un conteo correcto no es una matriz correcta.

---

## 8. Riesgos residuales y decisiones abiertas

| Tema | Estado | Impacto | Gate |
|---|---|---|---|
| Hardware real: CPU, RAM, disco, batería, BIOS | Abierto (decisión 1; `DEP-01`) | P1-1; límites de video y concurrencia | S2/S9 |
| Ubuntu Server vs Windows | Abierto (decisión 2; `D-09`, `DEP-02`) | P1-4; controles Linux sin equivalente | S2 |
| LUKS/TPM/clevis y arranque desatendido | Abierto (P1-2) | El sitio puede no volver tras un corte | S9 |
| Proveedor de backups, Object Lock, custodia de clave | Abierto (decisión 8; `D-13`; P1-3) | Ransomware/borrado de backups | S9/release |
| Correo público y proveedor (`D-10`) | Abierto (decisión 3) | `RF-P71`, `RF-P47`, `PRIV-05`, `SEG-38` | S8 |
| Licencia del contenido/código (`D-11`) | Abierto (decisión 4) | `LEG-01`, `LEG-02`, `LEG-16`, `AC-40` | S10 |
| Personas identificables y consentimientos | Abierto (decisión 6) | `LEG-05`, `LEG-06`, `PRIV-11`, `AC-40` | S10 |
| Colecciones iniciales y demo al lanzar | Abierto | `RF-A48`, `AC-40`, `RF-P90`–`P93` | S6/S10 |
| GitHub remote, protección de `main`, PRs, CI | No configurado | Corrección 7; `gitleaks`, tests y aprobación no operativos | S0/S3 |
| Evidencia de accesibilidad (axe, NVDA, teclado) | No ejecutada | `AC-37`; afirmación WCAG AA | S8/S10 |
| Custodia de la clave de restic y del único admin | No definida | Pérdida de acceso o de backups | S9 |
| Revisión legal, DPA y takedown | Pendiente | `PRIV-12`, `LEG-15`, `LEG-17` | S10 |

Ninguna de estas decisiones impide empezar UX/arquitectura, pero varias bloquean
el cierre del Gate 0 tal como está redactado. `fase-00-gestion.md:134-135` lo
reconoce para el release; el SRS, en cambio, declara “todos los M” sin marcar las
dependencias.

---

## 9. Recomendación de merge

**NO mergear** `docs/srs-v1.1` ni `docs/ux-v1` a `main` todavía. **NO aprobar el
Gate 0.**

Condiciones mínimas para pasar a “aprobado con condiciones”:

1. **Cerrar P1-1–P1-4** con decisiones registradas: RAM/`tmpfs`, TPM/LUKS,
   inmutabilidad de backups y sistema operativo.
2. **Corregir P2-1–P2-14** o aceptarlas con dueño, fecha y riesgo asociado. No se
   puede mergear con P1 abiertos; los P2 sin dueño tampoco.
3. **Regenerar la trazabilidad** después de tocar prioridades, rutas o `AC`:
   mantener el conteo coherente (hoy 429/429; si se añaden requisitos como
   `BCK-21`–`BCK-23` o `A11Y-23`–`A11Y-28`, actualizar SRS y matriz y recontar) y
   añadir una comprobación automática de prioridad, sprint y `AC`.
4. **Alinear el modelo de estados** (`RF-A30`/`DAT-01`/UX) y el criterio `AC-16`.
5. **Resolver la accesibilidad**: requisitos 1.2.5, 2.4.11, 2.5.7, 3.2.6, 3.3.7
   y 3.3.8, o rebajar la afirmación “WCAG 2.2 AA” a “objetivo, pendiente de
   evidencia”.
6. **Implementar o desmentir `gitleaks`/CI**: no se puede afirmar “cero secretos”
   sin un escaneo real. Si no se implementa en S0, marcar el gate como pendiente.
7. **Revisión independiente final** y aprobación del usuario en el gate.

Orden de corrección recomendado:

1. Decisiones de infraestructura (hardware, OS, TPM/LUKS, backups).
2. Rutas, prioridades `M/S/C`, dependencias `M`→`S`, estados y `AC-16`.
3. Trazabilidad (`AC-24`, sección 5, columnas de sprint).
4. Seguridad operativa (`gitleaks`, CI, remote, protección de `main`).
5. Accesibilidad, riesgos y documentación de estado.
6. Re-revisión y aprobación.

El SRS tiene una base aprovechable y el conteo es correcto. El veredicto puede
cambiar a **APROBADO CON CONDICIONES** cuando los P1 estén cerrados y los P2
tengan dueño/fecha; hoy no cumple el criterio de “sin contradicciones P1/P2” que
exige `fase-00-gestion.md:171-172`.

---

## 10. Evidencia de la revisión

- Documentos leídos completos: SRS v1.1, decisiones, riesgos, cambios, plan,
  trazabilidad, skills, fase 00, `README.md`, `AGENTS.md`, `SECURITY.md`,
  assets demo, `.gitignore`, `.env.example`, sitemap, flujos y accesibilidad.
- Conteo y comparación SRS/trazabilidad ejecutados sobre el árbol actual
  (`docs/ux-v1` @ `6d9f9f3`); resultados en la sección 7.
- No se modificó ningún archivo distinto de este informe.
- No se leyeron ni imprimieron secretos, `.env` reales ni credenciales.
