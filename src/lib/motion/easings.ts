/**
 * Curvas del sitio. Las de CSS por defecto son demasiado débiles.
 * Nunca ease-in en interfaz: arranca lento justo cuando el usuario mira.
 */
export const EASE = {
  salida: 'cubic-bezier(0.23, 1, 0.32, 1)', // elementos que entran o salen
  ambas: 'cubic-bezier(0.77, 0, 0.175, 1)', // movimiento o morph en pantalla
  suave: 'cubic-bezier(0.32, 0.72, 0, 1)', // menú móvil, acordeones
} as const;

/**
 * Equivalentes en la nomenclatura de GSAP. Evitan cargar CustomEase solo
 * para reproducir las mismas curvas que ya están en global.css.
 */
export const EASE_GSAP = {
  salida: 'power4.out',
  ambas: 'power3.inOut',
  suave: 'power2.out',
} as const;
