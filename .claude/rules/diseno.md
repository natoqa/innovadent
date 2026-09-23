---
paths:
  - "src/components/**/*.astro"
  - "src/layouts/**/*.astro"
  - "src/pages/**/*.astro"
  - "src/styles/**/*.css"
---

# Diseño

**`src/styles/global.css` es la fuente de verdad.** Los tokens viven ahí. Este documento explica cómo usarlos y qué no hacer con ellos. Si algo de aquí contradice el CSS, manda el CSS y avísame.

## Principio rector

Tres colores. Todo lo demás son tintes y sombras. Proporción 60-30-10: el neutro domina, la tinta estructura, el verde dirige.

El color lo ponen las fotografías clínicas; la interfaz se aparta. Toda fotografía clínica se monta sobre `--color-tinta-800`.

## Color

### La regla crítica

**El verde es superficie, no tinta.** `--color-verde` da 2.47:1 sobre el fondo, así que **nunca** se usa como color de texto ni de enlace sobre claro.

| Situación | Token correcto |
|---|---|
| Fondo de botón primario | `--color-verde`, texto encima en `--color-tinta` |
| Hover del botón | `--color-verde-600` |
| Active del botón | `--color-verde-800` |
| Texto o enlace sobre claro | `--color-verde-700` |
| Texto o enlace dentro de `.zona-oscura` | `--color-verde-200` |
| Anillo de foco, tinte suave, ámbito Kids | `--color-verde-100` |

### Uso del resto

- Fondo de página: `--color-fondo`. Fichas, formularios y tarjetas: `--color-superficie`.
- Secciones alternas y hover suave: `--color-franja`. Líneas de ficha y campos: `--color-borde`.
- Texto principal `--color-tinta`, secundario `--color-grafito`. `--color-neblina` da 3.29:1: **solo a 24px o más, o decorativo**. Nunca en texto pequeño.
- `--color-tinta-700` para elevación dentro de zona oscura.
- Los estados no introducen color nuevo: `--color-exito` sale de la paleta, y el error se comunica con texto, no con color.

### Prohibido

- Degradados, en cualquier elemento.
- Sombras difusas decorativas. La elevación se comunica con fondo y borde de 1px.
- Introducir cualquier color fuera de los tokens. Si algo parece necesitar un cuarto color, es que el diseño está mal resuelto. Kids lo demuestra: no añade color, invierte la proporción y sube el verde del 10% al 30%.
- Usar `--color-verde` como texto sobre claro. Es el error más fácil de cometer y el más visible.

## Tipografía

Una sola superfamilia variable: **Archivo**, ejes wght y wdth. Titulares en ancho expandido (`--font-display`), cuerpo en ancho normal (`--font-sans`).

### Escala

Fluida con `clamp()`. Los titulares llevan tracking negativo por diseño; el cuerpo no lo lleva.

| Token | Uso |
|---|---|
| `--text-hero` | Solo el titular del hero. Una vez por sitio. |
| `--text-display` | Titular de sección |
| `--text-titulo` | Subsección, nombre de tratamiento |
| `--text-subtitulo` | Entradilla, cita de testimonio |
| `--text-cuerpo-lg` | Párrafo destacado, primer párrafo de sección |
| `--text-cuerpo` | Texto corrido |
| `--text-menor` | Ficha clínica, pie de foto, navegación |
| `--text-dato` | Metadato, etiqueta de campo |

`h1`, `h2` y `h3` ya heredan `--font-display` con peso 600 y `text-wrap: balance` desde la capa base. No redeclarar.

### Cifras

Toda cifra clínica (años, meses, número de caso, duración de tratamiento) usa `font-variant-numeric: tabular-nums lining-nums`, ya aplicado a `.cifra`, `table` y `time`. Esto es lo que reemplaza al monospace. **Nunca usar una tipografía monoespaciada para datos.**

### Prohibido

- Etiquetas en MAYÚSCULAS con letter-spacing. Es el tell más común de página generada.
- Resaltar una sola palabra del titular en otro color, itálica o peso distinto.
- Flechas `→` pegadas al texto de botones y enlaces.
- Metadatos unidos con puntos medios (`A · B · C`).
- Em dashes como separador decorativo.
- Title Case. Sentence case en todo: botones, navegación, títulos.
- Introducir una segunda familia tipográfica.

## Layout

- Ancho de contenido `--container-ancho`. `--container-sangre` solo para bloques a sangre. Texto corrido limitado a `--container-texto`.
- Alineación **izquierda** por defecto. El texto centrado se reserva para el hero.
- Ritmo vertical con `--spacing-seccion` y `--spacing-seccion-sm`, alternando entre secciones. No usar el mismo valor en todas.
- Objetivo táctil mínimo 48px, ya fijado en `.accion`.

### Radios jerárquicos

La estructura no se redondea, la fotografía sí.

| Token | Dónde |
|---|---|
| `--radius-nada` | Secciones, contenedores, franjas |
| `--radius-accion` | Botones |
| `--radius-campo` | Campos de formulario |
| `--radius-foto` | Toda imagen clínica, vía `.foto` |

**Aplicar el mismo radio a todo es un tell.** El radio codifica qué tipo de elemento es.

### No convertir todo en tarjetas

Especialistas, tecnología y tratamientos son contenidos distintos y deben verse distintos. Si tres secciones seguidas son una grilla de tarjetas con el mismo tratamiento visual, el diseño falló.

Marcadores numerados (01 / 02 / 03) **solo** donde el contenido es realmente una secuencia: el proceso paso a paso de las landings y la línea de tiempo.

## Componentes base

Ya existen en `global.css`. Usarlos antes de crear nada:

| Clase | Para |
|---|---|
| `.accion` | Acción primaria. `.accion--secundaria` para la variante |
| `.ficha` | Datos de caso y tratamiento, formato historia clínica |
| `.enlace` | Enlace de texto, con su variante dentro de `.zona-oscura` |
| `.foto` | Contenedor de fotografía clínica |
| `.zona-oscura` | Sección sobre `--color-tinta-800` |
| `.kids` | Ámbito Innovadent Kids |
| `.cifra` | Números alineados en columna |

La `.ficha` presenta los datos como historia clínica: etiqueta a la izquierda en `--color-grafito`, valor a la derecha en `--color-tinta`, cifras alineadas. Sin mayúsculas, sin monospace.

**Máximo dos secciones con `.zona-oscura` en toda la home**, para que el contraste signifique algo.

## Estructura de la home

En este orden, correspondiendo al documento de solicitud de contenido:

1. **Hero** — foto o video a pantalla completa, titular en `--text-hero`, acción de reserva
2. **Manifiesto** — historia en pocas palabras, contraste foto histórica / foto actual
3. **Áreas clínicas** — índice de las 6 especialidades
4. **Casos clínicos** — antes/después
5. **Especialistas** — equipo con retrato y credenciales
6. **Tecnología** — equipamiento enfocado en el beneficio al paciente, no en especificaciones
7. **Línea de tiempo** — hitos 2006–2026
8. **Testimonios** — video y texto, más la valoración de Google
9. **Innovadent Kids** — ámbito `.kids`
10. **Sede y contacto** — dirección, horarios, fachada, mapa
11. **Formulario de reserva**

## Landings de tratamiento

Seis páginas (ortodoncia y ortopedia maxilar, endodoncia, periodoncia e implantología, rehabilitación oral, cirugía bucal y maxilofacial, odontopediatría; carillas y diseño de sonrisa van dentro de rehabilitación oral), misma estructura en `layouts/Tratamiento.astro`, con 9 bloques:

problema que resuelve · indicaciones · alternativas · proceso paso a paso · beneficios · especialista responsable · tecnología utilizada · casos clínicos relacionados · fotografía representativa

## Escritura en la interfaz

- El botón dice qué va a ocurrir: "Reservar mi cita", no "Enviar".
- Una acción conserva el mismo nombre en todo el flujo.
- Los errores explican qué pasó y cómo arreglarlo. Sin disculpas, sin vaguedad.
- Verbos simples, sin relleno, sin lenguaje comercial.