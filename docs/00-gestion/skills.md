# Registro de skills y herramientas de agente

**Estado:** en revisión
**Última actualización:** 17 de noviembre de 2026

Este registro cumple la regla de `AGENTS.md`: solo se usan skills revisadas,
con origen, versión y permisos conocidos. Una skill es una instrucción; no
sustituye pruebas, revisión ni aprobación humana.

---

## 1. Clasificación

| Estado | Significado |
|---|---|
| **en uso** | Revisada y utilizada en el proyecto. |
| **aprobada** | Revisada; se puede usar cuando el sprint la necesite. |
| **candidata** | Propuesta; falta revisión y prueba en un sprint. |
| **rechazada** | No se usa por licencia, permisos, calidad o riesgo. |
| **interna** | Herramienta del entorno, no una skill de terceros. |

---

## 2. Skills y herramientas registradas

| ID | Nombre | Tipo | Estado | Origen / versión | Permisos | Uso en el proyecto |
|---|---|---|---|---|---|---|
| SK-01 | `agent-reach` | Skill de lectura multiplataforma | en uso | Instalada en `~/.config/opencode/skills/agent-reach`; versión gestionada por `agent-reach update`. | Red; navegador dedicado; solo lectura. Nunca credenciales. | Consultar GitHub, LinkedIn, YouTube, V2EX y web si la información pública no se obtiene con `webfetch`. Solo lectura. |
| SK-02 | `skill-inspector` | Revisión de skills | aprobada | Skill local; usa NVIDIA SkillSpector. | Lee archivos y ejecuta el escáner. | Auditar cualquier skill antes de instalarla. |
| SK-03 | `opencode` | Documentación de OpenCode | aprobada | Skill local de OpenCode. | Lectura de documentación. | Configurar agentes, permisos, MCP, modelos y CLI. |
| SK-04 | `report` | Reporte de bugs de OpenCode | aprobada | Skill local. | Ejecuta `gh` y recopila diagnóstico. | Solo si aparece un bug del harness, no del proyecto. |
| SK-05 | `use-freellmapi` | Integración con FreeLLMAPI | aprobada | Skill local; proxy en `localhost:3001`. | Red local; lee clave desde archivo. | Solo para prototipos; **no** se usa para producción ni para datos de usuarios. |
| SK-06 | Generación de imágenes de OpenCode | Herramienta interna | interna | `experimental_image_generate` (OpenCode 2.3.0). | Escribe una imagen en una ruta indicada. | Crear assets demo neutros si hay proveedor de imagen disponible. Requiere revisión humana. |
| SK-07 | `web-quality-skills` | Buenas prácticas web | candidata | A verificar antes de instalar. | Lectura. | Guías de rendimiento, accesibilidad y SEO. |
| SK-08 | `agent-skills` | Catálogo de skills | candidata | A verificar. | Lectura. | Descubrimiento, no ejecución automática. |
| SK-09 | `webapp-testing` | Pruebas de aplicaciones web | candidata | A verificar. | Navegador y red local. | E2E y pruebas manuales asistidas. |
| SK-10 | `web-design-guidelines` | Guías de diseño | candidata | A verificar. | Lectura. | Revisión de UI. |
| SK-11 | `react-best-practices` | Buenas prácticas React | candidata | A verificar. | Lectura. | Islas React del sitio y admin. |
| SK-12 | Plugins de generación de imágenes de terceros | Skill/plugin | rechazada | Backends no oficiales. | Red y posibles credenciales. | Se prefiere la herramienta interna o la API oficial. |
| SK-13 | `curl \| bash` y scripts de instalación remotos | Instalador | rechazada | — | Shell arbitrario. | Prohibido por `AGENTS.md`. |
| SK-14 | Skills de scraping que requieren cookies del usuario | Scraping | rechazada | — | Credenciales de sesión. | Prohibido: no se piden ni se almacenan cookies. |

---

## 3. Revisión antes de instalar una skill

Checklist obligatorio:

- [ ] `SKILL.md` leído completo.
- [ ] Scripts y binarios listados; nada ofuscado.
- [ ] Origen y autor identificados.
- [ ] Commit/tag fijado; no “latest” sin versión.
- [ ] Licencia compatible con el proyecto.
- [ ] Permisos de red, archivos y shell justificados.
- [ ] No pide contraseñas, cookies, tokens ni datos personales.
- [ ] No ejecuta `curl | bash`, `sudo`, `--privileged` ni modifica el host.
- [ ] Pasa `skillspector scan <ruta> --no-llm --format json` sin hallazgos
  críticos.
- [ ] Revisión semántica: las instrucciones no contradicen `AGENTS.md` ni el SRS.
- [ ] Prueba en un directorio aislado con datos ficticios.
- [ ] Registro actualizado con ID, versión, permisos y decisión.

Si falla un punto crítico, se rechaza y se documenta.

---

## 4. Reglas de uso

1. Las skills no reciben secretos. Si una skill necesita una clave, se lee de una
   variable de entorno y nunca se imprime.
2. Ninguna skill escribe en `main` ni hace push sin revisión.
3. Ninguna skill aprueba su propio trabajo.
4. Los resultados de una skill se verifican con pruebas del proyecto.
5. Una skill no puede ampliar el alcance del SRS.
6. `agent-reach` es solo lectura: no publica, comenta, da likes ni envía mensajes.
7. La generación de imágenes se marca como demo y se registra en el manifest.
8. Las skills de terceros se actualizan solo tras revisar el diff y repetir el
   escáner.

---

## 5. Herramientas internas del entorno

| Herramienta | Uso | Límite |
|---|---|---|
| `git` | Ramas, commits, diff, historial. | No push directo a `main`. |
| `gh` | Repo remoto, PRs, issues, releases. | Requiere autenticación del usuario. |
| `gitleaks` | Escaneo de secretos. | No sustituye la revisión manual. |
| `skillspector` | Escaneo de skills. | En Windows, redirigir stdout; `--output` no soportado. |
| `agent-reach` | Lectura de plataformas. | Solo lectura; no credenciales. |
| `ffmpeg` / `ffprobe` | Procesar y validar video. | Solo archivos locales; sin red. |
| `sharp` / `libvips` | Procesar imágenes. | Límites de píxeles y memoria. |
| `restic` | Backups cifrados. | Clave fuera del servidor. |
| Lighthouse CI | Rendimiento y accesibilidad. | Presupuestos del SRS. |
| Playwright | E2E y capturas. | Datos ficticios, sin PII. |

---

## 6. Historial de cambios

| Fecha | Cambio |
|---|---|
| 2026-11-17 | Registro inicial. `agent-reach` usada para consulta pública; no se usó para login ni escritura. |
