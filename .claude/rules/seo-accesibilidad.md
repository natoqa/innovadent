---
paths:
  - "src/pages/**/*"
  - "src/layouts/**/*.astro"
  - "src/components/seo/**/*.astro"
  - "src/lib/seo.ts"
---

# SEO, rendimiento y accesibilidad

## SEO

- Una sola `<h1>` por página. Jerarquía de encabezados sin saltos.
- Cada landing de tratamiento con su `title`, `description` y `canonical` propios. Nunca reutilizar los de la home.
- JSON-LD:
  - Home: `Dentist` con `LocalBusiness` — dirección, geo, horarios, teléfono, rango de precios omitido.
  - Landings: `MedicalWebPage`.
  - Donde haya preguntas frecuentes: `FAQPage`.
- Los datos del JSON-LD salen de `src/config/site.ts`. Una sola fuente de verdad.
- Contenido orientado a intención local: "ortodoncia en Trujillo", no "ortodoncia". Sin relleno de palabras clave.
- `sitemap.xml` y `robots.txt` generados en el build.
- Open Graph e imagen social por página.

## Rendimiento

Presupuesto:

| Métrica | Objetivo |
|---|---|
| LCP en 4G | < 2.5 s |
| CLS | 0 |
| JS en la home | < 100 KB |

- Imágenes siempre con `astro:assets`. AVIF con respaldo WebP, `width` y `height` explícitos.
- `loading="lazy"` en todo salvo la imagen del hero, que va con `fetchpriority="high"`.
- Fuentes self-hosted en `.woff2`, con `preload` solo del peso del titular del hero.
- GSAP importado únicamente en las páginas que lo usan.
- Si hay video en el hero: silenciado, `playsinline`, póster estático que carga primero, y no se descarga en conexiones lentas ni con datos limitados.

## Accesibilidad

- Contraste mínimo AA (4.5:1 en texto normal). `--color-neblina` (3.29:1) solo a 24px o más o como decoración, nunca en texto pequeño.
- Foco visible siempre: `outline` de 2px en `--color-verde` con `outline-offset: 3px`, ya fijado en `global.css`. Nunca `outline: none` sin sustituto.
- Todo campo con `<label>` asociado. Nada de placeholders haciendo de etiqueta.
- Navegación completa por teclado, incluido el menú móvil. El foco queda atrapado dentro del menú abierto y vuelve al disparador al cerrar.
- Área táctil mínima de 44×44px. Los enlaces de texto sueltos usan `.objetivo-tactil`, que la aplica solo con puntero táctil.
- `skip link` al contenido principal en el layout base.
- El `alt` describe el contenido clínico real. Nunca vacío en fotos de contenido; vacío solo en decorativas.
- El video del hero lleva control de pausa accesible.
- `lang="es-PE"` en el `<html>`.
