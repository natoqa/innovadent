---
paths:
  - "src/lib/motion/**/*.ts"
  - "src/components/motion/**/*.astro"
  - "src/components/sections/**/*.astro"
---

# Animación

GSAP está aquí para **un momento orquestado**, no para decorar cada sección.

## Reglas duras

- **Dos momentos coreografiados en todo el sitio: la entrada del hero y la rueda de áreas clínicas.** Todo lo demás es discreto. La rueda es excepción aprobada por el cliente: solo desde 1024px, sin ella en móvil, tablet ni con movimiento reducido. Incluye su salida: Casos clínicos sube sobre la rueda y su titular entra por líneas al ritmo de esa subida. No es un tercer momento ni un permiso para animar la entrada de otras secciones. No abrir un tercero.
- **Excepción aprobada por el cliente: la entrada del comparador antes/después.** El cuadro espera oculto; al entrar en pantalla aparece (opacidad y escala desde 0.96) y, una sola vez, la línea recorre de "solo antes" a la mitad. El barrido es demostrativo (enseña el resultado y que se puede arrastrar). Se detiene ante cualquier gesto. Con movimiento reducido solo queda el fundido de opacidad. No sirve de precedente para animar la entrada de otros elementos.
- **Prohibido el fade-and-slide-up genérico en cada sección al hacer scroll.** Es la firma visual de una página generada por IA.
- **Prohibido animar cada tarjeta al entrar en viewport.**
- Las micro-interacciones (hover, foco, `:active`) se hacen con **transiciones CSS**, nunca con GSAP.
- Nunca animar propiedades que provocan layout (`width`, `height`, `top`, `margin`). Solo `transform` y `opacity`.
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
