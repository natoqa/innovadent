# CLAUDE.md — Innovadent 2026

Guía operativa para trabajar en este repositorio. Léela completa antes de escribir código.

---

## 1. Contexto

**Cliente:** Innovadent — Centro Odontológico Integral. Trujillo, Perú.
**Agencia:** InnKode.
**Hito:** 20 años de operación (2006–2026). El aniversario es el eje narrativo del sitio.

**Qué es este sitio:** una plataforma de captación de pacientes. No es un folleto. El éxito se mide en reservas completadas, no en tiempo de permanencia.

**Audiencia real:** personas de Trujillo entre 28 y 55 años buscando un odontólogo en quien confiar, muchas veces con miedo al dentista o con una mala experiencia previa. Llegan por Google o por recomendación, en celular, y deciden en menos de un minuto si esta clínica les parece seria.

**Decisión de diseño que deriva de eso:** el sitio debe transmitir competencia clínica y calma. No emoción, no urgencia, no marketing agresivo. La confianza se construye con evidencia (casos reales, credenciales, años, tecnología), no con adjetivos.

---

## 2. Stack

| Capa | Tecnología |
|---|---|
| Framework | Astro 5 (output híbrido: estático + endpoints server) |
| Estilos | Tailwind CSS v4 (configuración CSS-first con `@theme`) |
| Animación | GSAP 3 + ScrollTrigger |
| Contenido | Astro Content Collections (`src/content/`) |
| Formulario | Astro API Route + validación Zod |
| Deploy | Adaptador Node o Vercel (definir antes de la fase 5) |

### Comandos

```bash
pnpm dev          # servidor local
pnpm build        # build de producción
pnpm preview      # previsualizar el build
pnpm astro check  # verificación de tipos
```

### Reglas de stack

- **Cero componentes React/Vue/Svelte** salvo que se justifique explícitamente. Todo en `.astro`. Este sitio no tiene estado complejo.
- **Cero JavaScript en el cliente por defecto.** Si un componente necesita JS, usa `<script>` en el `.astro`. Las islas (`client:*`) solo para el formulario si termina requiriéndolo.
- **No instalar librerías sin preguntar.** Ni de UI, ni de iconos, ni de carrusel, ni de utilidades. Si crees que hace falta una dependencia, propónla y espera confirmación.
- Iconos: SVG inline en `src/components/ui/Icon.astro`. Nada de paquetes de iconos.

---

## 3. Estructura del proyecto

```
innovadent-web/
├── CLAUDE.md
├── astro.config.mjs
├── public/
│   ├── fonts/                    # fuentes self-hosted (.woff2)
│   ├── favicon/
│   └── robots.txt
├── src/
│   ├── assets/                   # imágenes procesadas por astro:assets
│   │   ├── hero/
│   │   ├── areas/
│   │   ├── casos/
│   │   ├── equipo/
│   │   ├── historia/
│   │   └── sede/
│   ├── components/
│   │   ├── ui/                   # primitivos: Boton, Campo, Etiqueta, Icon, Figura
│   │   ├── sections/             # bloques de la home (uno por sección)
│   │   ├── treatment/            # bloques de las landings de tratamiento
│   │   ├── motion/               # wrappers de animación
│   │   └── seo/                  # Meta, JsonLd
│   ├── content/
│   │   ├── config.ts             # esquemas Zod de todas las colecciones
│   │   ├── tratamientos/         # 6 archivos .md — uno por especialidad
│   │   ├── especialistas/
│   │   ├── casos/                # casos antes/después
│   │   ├── hitos/                # línea de tiempo 2006–2026
│   │   ├── testimonios/
│   │   └── tecnologia/
│   ├── layouts/
│   │   ├── Base.astro            # <html>, meta, fuentes, skip link
│   │   └── Tratamiento.astro     # layout de las 6 landings
│   ├── lib/
│   │   ├── motion/
│   │   │   ├── gsap.ts           # registro de plugins, matchMedia global
│   │   │   ├── easings.ts        # curvas del proyecto
│   │   │   └── scroll.ts         # helpers de ScrollTrigger
│   │   ├── crm/
│   │   │   ├── adapter.ts        # interfaz LeadAdapter
│   │   │   ├── noop.ts           # implementación activa hoy
│   │   │   └── innovadent.ts     # implementación real (pendiente de su API)
│   │   ├── mail.ts               # notificación a la clínica
│   │   ├── validation.ts         # esquema Zod del formulario
│   │   └── seo.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── tratamientos/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── especialistas.astro
│   │   ├── casos.astro
│   │   ├── kids.astro
│   │   ├── contacto.astro
│   │   ├── privacidad.astro
│   │   └── api/
│   │       └── reserva.ts
│   ├── styles/
│   │   └── global.css            # @theme de Tailwind v4 + tokens + reset
│   └── config/
│       └── site.ts               # datos de la clínica en un solo lugar
```

### Reglas de estructura

- **Todo dato de la clínica vive en `src/config/site.ts`.** Dirección, teléfono, WhatsApp, horarios, redes, correo. Nunca hardcodear un número de teléfono dentro de un componente.
- **Todo contenido editorial vive en `src/content/`.** El cliente entrega el material por partes; las colecciones permiten ir llenando sin tocar componentes.
- Un componente de sección por sección. `sections/Hero.astro`, `sections/Manifiesto.astro`, etc. No crear un `Section.astro` genérico configurable por props — cada sección tiene su propio diseño.
- Nombres de archivo y componentes en **PascalCase**. Slugs de contenido en **kebab-case**. Todo el código en español (variables, funciones, comentarios).

---

## 4. Sistema de diseño

### Principio rector

**El color lo ponen las fotografías clínicas. La interfaz es neutra y se aparta.**

Las fotos son reales, tomadas en la clínica, y son la evidencia principal del sitio. Cualquier decoración que compita con ellas está mal. Esto no es minimalismo por moda: es una decisión sobre qué elemento carga el peso.

### Paleta

```css
--color-porcelana: #F6F5F2;  /* fondo base de página */
--color-tiza:      #FFFFFF;  /* superficies elevadas, fondo del formulario */
--color-tinta:     #14201D;  /* texto principal y secciones oscuras */
--color-pizarra:   #5A6663;  /* texto secundario, metadatos */
--color-arena:     #E3DED4;  /* divisores, bordes, estados vacíos */
--color-jade:      #0B6E5F;  /* ÚNICO acento saturado */
```

Reglas de color:

- `--color-jade` se usa **solo** en acciones (botón primario, enlace activo, anillo de foco) y en el indicador de la línea de tiempo. Nunca como fondo decorativo, nunca como color de un título.
- Cero degradados. En ningún elemento.
- Cero sombras decorativas. La elevación se comunica con fondo y borde de 1px en `--color-arena`.
- Las secciones oscuras usan `--color-tinta` como fondo con `--color-porcelana` como texto. Máximo dos secciones oscuras en toda la home, para que el contraste signifique algo.

### Tipografía

Dos familias, claramente distintas:

| Rol | Familia | Uso |
|---|---|---|
| Display | **Newsreader** (variable, optical size) | Titulares, cifras de la línea de tiempo, citas de testimonios |
| Texto / UI | **Geist Sans** | Párrafos, navegación, formularios, etiquetas |

Self-hosted en `public/fonts/` como `.woff2` con `font-display: swap` y `<link rel="preload">` solo para el peso del titular del hero.

Escala tipográfica (base 17px, razón 1.25):

```
--text-xs:   13px / 1.5
--text-sm:   15px / 1.55
--text-base: 17px / 1.65
--text-lg:   21px / 1.5
--text-xl:   27px / 1.35
--text-2xl:  34px / 1.2
--text-3xl:  42px / 1.1
--text-4xl:  53px / 1.05
--text-5xl:  66px / 1.0
```

Reglas tipográficas:

- Medida de línea máxima **68 caracteres**. En texto corrido usar `max-w-[34rem]`.
- Titulares en Newsreader con `font-optical-sizing: auto`. Sin tracking negativo agresivo.
- **Prohibido:** etiquetas en MAYÚSCULAS con letter-spacing (es el tell más común de página generada). Si una sección necesita rótulo, usa texto en caja normal a `--text-sm` en `--color-pizarra`.
- **Prohibido:** resaltar una sola palabra del titular en otro color, itálica o peso distinto.
- **Prohibido:** flechas `→` pegadas al texto de botones y enlaces.
- **Prohibido:** cadenas de metadatos unidas con puntos medios (`A · B · C`).
- Sentence case en todo: botones, navegación, títulos. Nada de Title Case.

### Layout

- Grilla de 12 columnas, ancho máximo de contenido **1180px**, gutter de 24px en móvil y 40px en escritorio.
- Alineación **izquierda** por defecto. El texto centrado se reserva para el hero y nada más.
- Ritmo vertical: las secciones alternan entre 96px y 144px de padding vertical en escritorio, 64px en móvil. No usar el mismo padding en todas.
- **No convertir todo en tarjetas.** Especialistas, tecnología y tratamientos son contenidos distintos y deben verse distintos. Si tres secciones seguidas son una grilla de tarjetas con el mismo border-radius, el diseño falló.
- `border-radius`: 2px en elementos de interfaz (botones, campos), 0px en contenedores de imagen. Un solo radio en todo el sitio es un tell.
- Marcadores numerados (01 / 02 / 03) **solo** donde el contenido es realmente una secuencia: el proceso paso a paso de las landings y la línea de tiempo. En ningún otro lugar.

### Estructura de la home

En este orden, correspondiendo al documento de solicitud de contenido:

1. Hero — foto/video a pantalla completa, mensaje principal, CTA de reserva
2. Manifiesto — historia en pocas palabras, contraste foto histórica / foto actual
3. Áreas clínicas — índice de las 6 especialidades
4. Casos clínicos — antes/después
5. Especialistas — equipo con retrato y credenciales
6. Tecnología — equipamiento enfocado en beneficio al paciente
7. Línea de tiempo — hitos 2006–2026
8. Testimonios — video y texto + valoración de Google
9. Innovadent Kids — identidad visual propia dentro del sistema
10. Sede y contacto — dirección, horarios, fachada, mapa
11. Formulario de reserva

### Landings de tratamiento (6 páginas)

Misma estructura para las seis, definida en `layouts/Tratamiento.astro`, con 9 bloques: problema que resuelve, indicaciones, alternativas, proceso paso a paso, beneficios, especialista responsable, tecnología utilizada, casos clínicos relacionados, fotografía representativa.

---

## 5. Animación

GSAP está aquí para **un momento orquestado**, no para decorar cada sección.

### Reglas duras

- **Un solo momento coreografiado en todo el sitio: la entrada del hero.** Todo lo demás es discreto.
- **Prohibido el fade-and-slide-up genérico en cada sección al hacer scroll.** Es la firma visual de una página generada por IA.
- **Prohibido animar cada tarjeta al entrar en viewport.**
- Las micro-interacciones (hover, foco, `:active`) se hacen con **transiciones CSS**, nunca con GSAP.
- Nunca animar propiedades que provocan layout (`width`, `height`, `top`, `margin`). Solo `transform` y `opacity`.

### Curvas (`src/lib/motion/easings.ts`)

```ts
export const EASE = {
  salida:  'cubic-bezier(0.23, 1, 0.32, 1)',      // elementos que entran
  ambas:   'cubic-bezier(0.77, 0, 0.175, 1)',     // movimiento en pantalla
  suave:   'cubic-bezier(0.32, 0.72, 0, 1)',      // menú móvil, acordeones
} as const;
```

Nunca `ease-in` en interfaz: arranca lento justo cuando el usuario está mirando, y hace sentir lenta la página.

### Duraciones

| Elemento | Duración |
|---|---|
| Feedback de botón (`:active`) | 100–160 ms |
| Hover, cambios de color | 150–200 ms |
| Acordeón, menú móvil | 200–280 ms |
| Secuencia del hero | hasta 1200 ms (es marketing, no interfaz) |

Todo lo que sea interfaz se queda **bajo 300 ms**.

### Implementación

- Registrar plugins una sola vez en `src/lib/motion/gsap.ts`.
- Toda animación dentro de `gsap.context()` con su `revert()` correspondiente.
- Usar `gsap.matchMedia()` para diferenciar móvil/escritorio y para `prefers-reduced-motion`.
- Con `prefers-reduced-motion: reduce`: se conservan opacidad y color, se elimina todo desplazamiento. No es "cero animación", es "sin movimiento".
- Hover solo tras `@media (hover: hover) and (pointer: fine)`.
- Stagger entre 30 y 80 ms. Nunca bloquear la interacción mientras corre un stagger.

---

## 6. Formulario y CRM

El cliente está desarrollando un CRM propio y quiere el formulario conectado. **Ese CRM aún no existe.** La arquitectura debe estar lista sin depender de él.

### Flujo

```
Formulario → POST /api/reserva
               ├─ valida (Zod)
               ├─ verifica consentimiento
               ├─ notifica a la clínica (correo)   ← funciona desde el día 1
               ├─ registra el lead
               └─ adapter.enviar(lead)             ← hoy NoopAdapter
```

### Reglas

- El formulario **siempre** apunta a `/api/reserva`. Nunca dispara un correo o un servicio externo directamente desde el cliente.
- `src/lib/crm/adapter.ts` define la interfaz `LeadAdapter`. Hoy se usa `NoopAdapter`. Cuando el cliente entregue su API, se implementa `InnovadentAdapter` y se cambia una línea. **No escribir el adaptador real hasta tener su documentación.**
- **Si el adaptador falla, la petición sigue siendo exitosa.** El lead ya quedó guardado y notificado. Nunca perder un paciente porque su CRM se cayó.
- Campos del formulario: nombre, teléfono, motivo de consulta, preferencia de horario.
- **Checkbox de consentimiento obligatorio**, sin marcar por defecto, con enlace a `/privacidad`. Los datos se transferirán a un tercero (su CRM) y eso exige consentimiento explícito bajo la Ley 29733 de Protección de Datos Personales del Perú.
- Anti-spam: campo honeypot + límite de tasa por IP. Nada de CAPTCHA.
- Estados del formulario completos: reposo, enviando, éxito, error de campo, error de servidor. El mensaje de error dice qué pasó y cómo arreglarlo, sin disculpas ni vaguedad.
- El botón dice qué va a ocurrir: "Reservar mi cita", no "Enviar".

---

## 7. Contenido clínico

Este es un sitio de salud. El contenido tiene restricciones que no son negociables.

- **Cero afirmaciones médicas absolutas.** Nada de "garantizamos", "resultados permanentes", "sin dolor", "el mejor de Trujillo".
- **Cero imágenes generadas por IA** en cualquier contexto clínico. Fotos reales de la clínica o nada.
- **Cero fotos de stock** para representar especialistas, pacientes, instalaciones o resultados.
- Un caso antes/después solo se publica con consentimiento informado firmado. Si el campo `consentimiento` de un caso no es `true`, el caso no se renderiza. Hacerlo cumplir en el esquema de la colección, no solo en la plantilla.
- Cada tratamiento debe mencionar alternativas. No presentar un procedimiento como la única opción.
- Los testimonios llevan nombre o iniciales, con autorización.
- Mientras no llegue el contenido real: usar texto marcador **evidentemente falso** (`[PENDIENTE: historia de la clínica]`). Nunca inventar credenciales, cifras de pacientes, años de experiencia ni nombres de especialistas. Un dato inventado que se filtre a producción es un problema legal para el cliente.

---

## 8. SEO y rendimiento

- Una sola `<h1>` por página. Jerarquía de encabezados sin saltos.
- Cada landing de tratamiento con su `title`, `description` y `canonical` propios.
- JSON-LD: `Dentist` con `LocalBusiness` en la home (dirección, geo, horarios, teléfono), `MedicalWebPage` en las landings, `FAQPage` donde haya preguntas frecuentes.
- Contenido orientado a intención local: "ortodoncia en Trujillo", no "ortodoncia". Sin relleno de palabras clave.
- `sitemap.xml` y `robots.txt` generados en el build.
- Imágenes: siempre `astro:assets`, formato AVIF con respaldo WebP, `width`/`height` explícitos, `loading="lazy"` salvo la del hero.
- El `alt` describe el contenido clínico real. Nunca vacío en fotos de contenido.
- Presupuesto: **LCP bajo 2.5s en 4G**, **CLS 0**, menos de 100KB de JS en la home.
- GSAP se importa solo en las páginas que lo usan.

---

## 9. Accesibilidad

- Contraste mínimo AA (4.5:1 en texto normal). Verificar `--color-pizarra` sobre `--color-porcelana` antes de usarlo en texto pequeño.
- Foco visible siempre, con `outline` de 2px en `--color-jade` y `outline-offset: 2px`. Nunca `outline: none` sin sustituto.
- Todo campo con `<label>` asociado. Nada de placeholders haciendo de etiqueta.
- Navegación completa por teclado, incluido el menú móvil.
- Área táctil mínima de 44×44px.
- `skip link` al contenido principal en el layout base.
- Si hay video en el hero: silenciado, con `playsinline`, y con control de pausa accesible.

---

## 10. Cómo trabajar conmigo

- **Entrega por fases.** Completa una fase, para y espera a que la pruebe antes de seguir. No adelantes trabajo de la fase siguiente.
- **Archivos completos, no diffs parciales.** Cuando modifiques un archivo, entrégalo entero.
- Antes de crear un componente nuevo, revisa si ya existe algo en `src/components/ui/`.
- Si una instrucción de este documento choca con lo que te pido en el chat, **dímelo** en vez de elegir en silencio.
- Si vas a tomar una decisión de diseño que este documento no cubre, propónla y explica por qué, en una o dos líneas.
- Nada de comentarios explicando lo obvio. Comenta solo lo que no se deduce del código.

### Fases previstas

| Fase | Contenido |
|---|---|
| 1 | Configuración base, tokens en `global.css`, fuentes, layout, `site.ts` |
| 2 | Primitivos de UI y esqueleto de secciones con contenido marcador |
| 3 | Home completa, secciones 1 a 11 |
| 4 | Landings de tratamiento y colecciones de contenido |
| 5 | Formulario, `/api/reserva`, correo, consentimiento |
| 6 | Animación GSAP y pulido |
| 7 | SEO, rendimiento, accesibilidad |
| 8 | Integración CRM — **solo cuando el cliente entregue API documentada y credenciales de prueba** |

---

## 11. Lista de lo prohibido

Referencia rápida de lo que nunca debe aparecer en este repositorio:

- Degradados de cualquier tipo
- Sombras difusas decorativas bajo tarjetas
- Etiquetas en MAYÚSCULAS con letter-spacing sobre los títulos
- Una palabra del titular resaltada en otro color
- Flechas `→` en el texto de botones y enlaces
- Metadatos unidos con puntos medios (`A · B · C`)
- El mismo `border-radius` aplicado a todo
- Fade-up al hacer scroll en cada sección
- Tres secciones seguidas resueltas como grilla de tarjetas idénticas
- Imágenes de stock o generadas por IA
- Datos clínicos, credenciales o cifras inventadas
- Promesas de resultado o superlativos comerciales
- Teléfonos, direcciones u horarios hardcodeados fuera de `site.ts`
- Dependencias instaladas sin consultar
- `transition: all`
- `ease-in` en animaciones de interfaz