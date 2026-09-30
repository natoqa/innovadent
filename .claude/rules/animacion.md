---
paths:
  - "src/lib/motion/**/*.ts"
  - "src/components/motion/**/*.astro"
  - "src/components/sections/**/*.astro"
---

# Animación

El sitio está animado de punta a punta, pero con **un solo lenguaje de movimiento**: cada sección usa el revelado que corresponde a lo que muestra, con las mismas curvas y duraciones. Decisión del cliente (29-09-2026), que reemplaza la regla anterior de "solo dos momentos coreografiados".

## Lenguaje de movimiento — `src/lib/motion/revelar.ts`

Las secciones no escriben GSAP para revelarse: declaran `data-mov` en el HTML y el módulo lo ejecuta. `src/components/motion/Movimiento.astro` lo activa, al final de cada página que lo usa.

| Atributo | Para | Movimiento |
|---|---|---|
| `data-mov="titulo"` | Titulares de sección | Líneas que suben desde detrás de una máscara (la firma del sitio) |
| `data-mov="texto"` | Entradillas, párrafos | Solo opacidad, sin desplazamiento |
| `data-mov-fotos` | Región con `.foto` | Clip de abajo arriba, la imagen se asienta de 1.15 a 1 |
| `data-mov="grupo"` | Retratos | Se revelan por tandas (`ScrollTrigger.batch`), nombres después |
| `data-mov="filas"` | Listas, filas con borde | Cada fila se dibuja de izquierda a derecha |
| `data-mov="palabras"` | Citas de testimonios | Se ilumina palabra a palabra con el scroll |
| `data-mov="profundidad"` | Una foto o columna | Parallax vertical con `scrub`, solo escritorio |

Si una sección necesita algo nuevo, se agrega un tipo al módulo; no se escribe una animación suelta en el componente.

## Coreografías propias

Siguen con su código: la entrada del hero, la rueda de áreas clínicas (con la subida de Casos), el comparador antes/después, las cifras que cuentan, la línea de tiempo que se llena y el parallax de `/especialistas`. En escritorio el titular de Casos lo anima la rueda: su encabezado usa `movimiento="solo-movil"`.

La barra de navegación se oculta al bajar y vuelve al subir. Se queda quieta sobre el hero, con un menú abierto, con el foco dentro y sobre las zonas `data-barra-fija` (las secciones fijadas que calculan su margen contando con ella).

## Reglas duras

- El formulario de reserva no se anima.
- **Prohibido el fade-and-slide-up genérico.** Es la firma visual de una página generada por IA. El texto aparece por opacidad o por máscara de líneas, nunca deslizándose.
- **Prohibido animar cada tarjeta por su cuenta al entrar en viewport.** Las piezas que entran juntas se revelan como tanda.
- Todo revelado ocurre una sola vez (`once: true`). Solo el parallax y la cita palabra a palabra van ligados al scroll.
- Las micro-interacciones (hover, foco, `:active`) se hacen con **transiciones CSS**, nunca con GSAP.
- Nunca animar propiedades que provocan layout (`width`, `height`, `top`, `margin`). Solo `transform`, `opacity` y `clip-path`.
- Nunca `transition: all`. Especificar la propiedad: `transition: transform 200ms var(--ease-salida)`.

## Curvas — `src/lib/motion/easings.ts`

```ts
export const EASE = {
  salida: 'cubic-bezier(0.23, 1, 0.32, 1)',   // elementos que entran o salen
  ambas:  'cubic-bezier(0.77, 0, 0.175, 1)',  // movimiento o morph en pantalla
  suave:  'cubic-bezier(0.32, 0.72, 0, 1)',   // menú móvil, acordeones
} as const;
```

Exponer las mismas curvas como variables CSS en `global.css` para usarlas desde transiciones.

**Nunca `ease-in` en interfaz.** Arranca lento justo en el instante que el usuario está mirando, y hace sentir lenta la página. Un desplegable con `ease-in` a 300ms *se percibe* más lento que uno con `ease-out` a los mismos 300ms.

## Duraciones

| Elemento | Duración |
|---|---|
| Feedback de botón (`:active`) | 100–160 ms |
| Hover, cambios de color | 150–200 ms |
| Acordeón, menú móvil | 200–280 ms |
| Secuencia del hero | hasta 1200 ms (es marketing, no interfaz) |

Todo lo que sea interfaz se queda **bajo 300 ms**.

## Detalles que importan

- Nada entra desde `scale(0)`. En el mundo real nada aparece de la nada: partir de `scale(0.95)` con `opacity: 0`.
- Los botones responden a la pulsación: `transform: scale(0.97)` en `:active`.
- La salida es más rápida que la entrada.
- `transform-origin` de un popover apunta a su disparador, no al centro. Los modales sí se quedan centrados.
- Stagger entre 30 y 80 ms. Nunca bloquear la interacción mientras corre.
- Para elementos que se disparan rápido y repetidamente, usar transiciones CSS en vez de keyframes: los keyframes reinician desde cero al interrumpirse, las transiciones reencaminan suave.

## Implementación

- Registrar plugins una sola vez en `src/lib/motion/gsap.ts`.
- Toda animación dentro de `gsap.context()` con su `revert()` correspondiente.
- Usar `gsap.matchMedia()` para diferenciar móvil de escritorio.
- Importar GSAP solo en las páginas que lo usan. No en el layout base.

## Accesibilidad de la animación

Con `prefers-reduced-motion: reduce` se conservan opacidad y color, y se elimina **todo desplazamiento**. No es "cero animación", es "sin movimiento".

```css
@media (prefers-reduced-motion: reduce) {
  /* sin transform, sin translate, sin parallax */
}
```

Hover solo tras `@media (hover: hover) and (pointer: fine)`. En táctil el hover se dispara al tocar y produce falsos positivos.
