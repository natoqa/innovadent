/**
 * Punto único de configuración de GSAP. Los plugins se registran aquí y
 * solo aquí; las páginas importan desde este módulo, nunca desde 'gsap'.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { EASE_GSAP } from './easings';

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: EASE_GSAP.salida, duration: 0.9 });

export { gsap, ScrollTrigger, SplitText };
