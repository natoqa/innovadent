/**
 * Lenguaje de movimiento del sitio. Cada sección declara en el HTML qué tipo
 * de revelado le corresponde con `data-mov`, y este módulo lo ejecuta con las
 * mismas curvas y duraciones en todas partes. Así la página se mueve como un
 * conjunto y no como once efectos distintos.
 *
 *   data-mov="titulo"       Líneas que suben desde detrás de una máscara.
 *   data-mov="texto"        Aparición por opacidad, sin desplazamiento.
 *   data-mov="filas"        Cada hijo se dibuja de izquierda a derecha.
 *   data-mov="grupo"        Retratos: se revelan por tandas, desde abajo.
 *   data-mov="palabras"     Cita que se ilumina palabra a palabra con el scroll.
 *   data-mov="profundidad"  Desplazamiento vertical ligado al scroll (escritorio).
 *   data-mov-fotos          Toda `.foto` dentro se revela desde abajo.
 *
 * Modificadores: `data-mov-retraso` (segundos) y `data-mov-solo-movil` para
 * lo que en escritorio ya anima otra coreografía, como el titular de Casos.
 *
 * Con movimiento reducido no se ejecuta nada: el contenido queda como llega
 * del servidor. Sin JavaScript, igual.
 */
import { gsap, ScrollTrigger, SplitText } from './gsap';
import { EASE_GSAP } from './easings';

const INICIO = 'top 85%';

const todos = <T extends Element = HTMLElement>(raiz: ParentNode, selector: string) =>
  [...raiz.querySelectorAll<T>(selector)] as T[];

const retraso = (elemento: HTMLElement) => Number(elemento.dataset.movRetraso ?? 0);

/** El clip respeta el radio del elemento para no mostrar esquinas rectas. */
const recorte = (elemento: HTMLElement, arriba: string, derecha = '0%') => {
  const radio = getComputedStyle(elemento).borderRadius;
  const redondeo = radio && radio !== '0px' ? ` round ${radio}` : '';
  return `inset(${arriba} ${derecha} 0% 0%${redondeo})`;
};

function titulos(raiz: ParentNode, escritorio: boolean) {
  for (const titulo of todos(raiz, '[data-mov="titulo"]')) {
    if (escritorio && titulo.hasAttribute('data-mov-solo-movil')) continue;

    SplitText.create(titulo, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (partido) => {
        // Con line-height ajustado la máscara cortaría tildes y descendentes.
        gsap.set(partido.masks, { paddingBlock: '0.15em', marginBlock: '-0.15em' });

        return gsap.from(partido.lines, {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.08,
          delay: retraso(titulo),
          scrollTrigger: { trigger: titulo, start: INICIO, once: true },
        });
      },
    });
  }
}

function textos(raiz: ParentNode, escritorio: boolean) {
  for (const texto of todos(raiz, '[data-mov="texto"]')) {
    if (escritorio && texto.hasAttribute('data-mov-solo-movil')) continue;

    gsap.from(texto, {
      opacity: 0,
      duration: 1,
      delay: 0.25 + retraso(texto),
      ease: EASE_GSAP.suave,
      scrollTrigger: { trigger: texto, start: INICIO, once: true },
    });
  }
}

/** Estado inicial de una foto: cerrada desde abajo, antes de que llegue. */
function ocultarFoto(foto: HTMLElement) {
  gsap.set(foto, { clipPath: recorte(foto, '100%') });
}

/** Una foto se abre de abajo arriba mientras la imagen se asienta. */
function revelarFoto(foto: HTMLElement, demora = 0) {
  const interior = foto.querySelector<HTMLElement>('img, iframe, video');
  const linea = gsap.timeline({ delay: demora });

  linea.to(foto, { clipPath: recorte(foto, '0%'), duration: 1.3, ease: EASE_GSAP.ambas, clearProps: 'clipPath' });

  if (interior) {
    linea.fromTo(interior, { scale: 1.15 }, { scale: 1, duration: 1.8, clearProps: 'scale' }, 0);
  }

  return linea;
}

/** Textos de una pieza que no están dentro de su foto. */
const textosDe = (pieza: HTMLElement) =>
  todos(pieza, 'h3, p').filter((texto) => !texto.closest('.foto'));

function fotos(raiz: ParentNode) {
  for (const region of todos(raiz, '[data-mov-fotos]')) {
    todos(region, '.foto').forEach((foto, i) => {
      ocultarFoto(foto);

      ScrollTrigger.create({
        trigger: foto,
        start: INICIO,
        once: true,
        onEnter: () => revelarFoto(foto, i === 0 ? 0 : 0.12),
      });
    });
  }
}

function grupos(raiz: ParentNode) {
  for (const grupo of todos(raiz, '[data-mov="grupo"]')) {
    const piezas = todos(grupo, ':scope > *');

    for (const pieza of piezas) {
      const foto = pieza.querySelector<HTMLElement>('.foto');
      if (foto) ocultarFoto(foto);
      gsap.set(textosDe(pieza), { opacity: 0 });
    }

    // Los que entran juntos en pantalla se revelan como una tanda, con un
    // pequeño escalonado; no cada tarjeta por su cuenta.
    ScrollTrigger.batch(piezas, {
      start: INICIO,
      once: true,
      onEnter: (tanda) => {
        (tanda as HTMLElement[]).forEach((pieza, i) => {
          const foto = pieza.querySelector<HTMLElement>('.foto');
          const demora = i * 0.08;

          if (foto) revelarFoto(foto, demora);
          gsap.to(textosDe(pieza), {
            opacity: 1,
            duration: 0.8,
            delay: demora + 0.45,
            stagger: 0.06,
            ease: EASE_GSAP.suave,
          });
        });
      },
    });
  }
}

function filas(raiz: ParentNode) {
  for (const contenedor of todos(raiz, '[data-mov="filas"]')) {
    const hijos = todos(contenedor, ':scope > *');

    gsap.fromTo(
      hijos,
      { clipPath: 'inset(0% 100% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1,
        stagger: 0.07,
        delay: retraso(contenedor),
        ease: EASE_GSAP.ambas,
        clearProps: 'clipPath',
        scrollTrigger: { trigger: contenedor, start: INICIO, once: true },
      },
    );
  }
}

function palabras(raiz: ParentNode) {
  for (const cita of todos(raiz, '[data-mov="palabras"]')) {
    SplitText.create(cita, {
      type: 'words',
      autoSplit: true,
      onSplit: (partido) =>
        // Lineal: la cita avanza con el dedo, no con una curva propia.
        gsap.fromTo(
          partido.words,
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: cita, start: 'top 80%', end: 'bottom 45%', scrub: true },
          },
        ),
    });
  }
}

function profundidad(raiz: ParentNode) {
  for (const elemento of todos(raiz, '[data-mov="profundidad"]')) {
    const intensidad = Number(elemento.dataset.movIntensidad ?? 60);

    gsap.fromTo(
      elemento,
      { y: intensidad },
      {
        y: -intensidad,
        ease: 'none',
        scrollTrigger: { trigger: elemento, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  }
}

export function iniciarMovimiento(raiz: ParentNode = document) {
  const mm = gsap.matchMedia();

  mm.add(
    {
      movimiento: '(prefers-reduced-motion: no-preference)',
      escritorio: '(min-width: 64rem)',
    },
    (contexto) => {
      const movimiento = Boolean(contexto.conditions?.movimiento);
      const escritorio = Boolean(contexto.conditions?.escritorio);
      if (!movimiento) return;

      titulos(raiz, escritorio);
      textos(raiz, escritorio);
      fotos(raiz);
      grupos(raiz);
      filas(raiz);
      palabras(raiz);
      if (escritorio) profundidad(raiz);
    },
  );

  return mm;
}
