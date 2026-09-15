# CLAUDE.md — Innovadent 2026

## Contexto

Sitio web de **Innovadent**, centro odontológico en Trujillo, Perú. Desarrollado por **InnKode**. El hito de los 20 años (2006–2026) es el eje narrativo del sitio.

Es una plataforma de captación de pacientes, no un folleto. El éxito se mide en reservas completadas.

Audiencia: personas de Trujillo entre 28 y 55 años buscando un odontólogo de confianza, muchas veces con miedo al dentista o una mala experiencia previa. Llegan por Google, en celular, y deciden en menos de un minuto si la clínica les parece seria.

De ahí la decisión de fondo: el sitio transmite **competencia clínica y calma**. La confianza se construye con evidencia (casos reales, credenciales, años, tecnología), no con adjetivos.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Astro 7.3.2 (híbrido: estático + endpoints server) |
| Estilos | Tailwind CSS v4 (CSS-first con `@theme`) |
| Animación | GSAP 3 + ScrollTrigger, sobre scroll nativo |
| Contenido | Astro Content Collections |
| Formulario | Astro API Route + Zod |
| Tipografía | `@fontsource-variable/archivo`, importada desde `global.css` |
| Deploy | Vercel con `@astrojs/vercel` y `output: "server"` |

```bash
pnpm dev          # servidor local
pnpm build        # build de producción
pnpm preview      # previsualizar el build
pnpm astro check  # verificación de tipos
```

### Reglas de stack

- **Cero componentes React/Vue/Svelte.** Todo en `.astro`. Este sitio no tiene estado complejo.
- **Cero JavaScript en el cliente por defecto.** Si un componente lo necesita, `<script>` dentro del `.astro`. Islas (`client:*`) solo si el formulario termina requiriéndolo.
- **No instalar dependencias sin preguntar.** Ni UI, ni iconos, ni carruseles, ni utilidades. Proponer y esperar confirmación.
- Iconos: SVG inline en `src/components/ui/Icon.astro`.
- Las fuentes se instalan por Fontsource y se importan desde `src/styles/global.css`. No existe `public/fonts/`.

## Estructura

```
src/
├── assets/          # imágenes procesadas por astro:assets
├── components/
│   ├── ui/          # primitivos: Boton, Campo, Etiqueta, Icon, Figura
│   ├── sections/    # bloques de la home, uno por sección
│   ├── treatment/   # bloques de las landings de tratamiento
│   ├── motion/      # wrappers de animación
│   └── seo/         # Meta, JsonLd
├── content/         # tratamientos, especialistas, casos, hitos, testimonios, tecnologia
├── layouts/         # Base.astro, Tratamiento.astro
├── lib/
│   ├── motion/      # gsap.ts, easings.ts, scroll.ts
│   ├── crm/         # adapter.ts, noop.ts, innovadent.ts
│   └── mail.ts · validation.ts · seo.ts
├── pages/
│   ├── index.astro
│   ├── tratamientos/[slug].astro
│   └── api/reserva.ts
├── styles/global.css
└── config/site.ts
```

- **Todo dato de la clínica vive en `src/config/site.ts`.** Dirección, teléfonos, WhatsApp, horarios, redes, correo. Nunca hardcodear un teléfono dentro de un componente.
- **Todo contenido editorial vive en `src/content/`.** El cliente entrega el material por partes; las colecciones permiten ir llenando sin tocar componentes.
- Un componente por sección. No crear un `Section.astro` genérico configurable por props: cada sección tiene su propio diseño.
- Archivos y componentes en **PascalCase**. Slugs de contenido en **kebab-case**. Código en español (variables, funciones, comentarios).

## Reglas por área

El detalle vive en `.claude/rules/`, que se carga según los archivos que toques:

| Archivo | Cubre |
|---|---|
| `diseno.md` | Paleta, tipografía, layout, estructura de secciones |
| `animacion.md` | GSAP, curvas, duraciones, reduced motion |
| `contenido-clinico.md` | Restricciones legales y editoriales del contenido de salud |
| `formulario-crm.md` | `/api/reserva`, consentimiento, adaptador CRM |
| `seo-accesibilidad.md` | Metadatos, JSON-LD, rendimiento, AA |

Si vas a crear archivos nuevos en un área, lee su regla antes de empezar.

## Cómo trabajar

- **Entrega por fases.** Completa una fase, para y espera a que la pruebe. No adelantes trabajo de la siguiente.
- **Archivos completos, no diffs parciales.** Al modificar un archivo, entrégalo entero.
- Antes de crear un componente, revisa si ya existe algo en `src/components/ui/`.
- Si una instrucción de este documento choca con lo que pido en el chat, **dímelo** en vez de elegir en silencio.
- Si tomas una decisión de diseño que no está cubierta, propónla y explica por qué en una o dos líneas.
- Nada de comentarios explicando lo obvio.

### Fases

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

## Prohibido

Nunca debe aparecer en este repositorio:

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
- Teléfonos, direcciones u horarios fuera de `site.ts`
- Dependencias instaladas sin consultar
- `transition: all`
- `ease-in` en animaciones de interfaz
- Smooth-scroll por librería (Lenis, Locomotive y similares). ScrollTrigger trabaja sobre el scroll nativo del navegador