import type { CollectionEntry } from 'astro:content';

/**
 * Los espacios de la sede se presentan por zona, en el orden en que un
 * paciente los recorre. Cada foto declara su zona en `src/content/espacios/`.
 */
export const ZONAS = [
  {
    clave: 'consultorios',
    nombre: 'Consultorios',
    nota: 'Donde se hace la consulta y el tratamiento de cada especialidad.',
  },
  {
    clave: 'imagen',
    nombre: 'Diagnóstico por imagen',
    nota: 'Radiografías y tomografías que se revisan antes de explicarte el diagnóstico.',
  },
  {
    clave: 'recepcion',
    nombre: 'Recepción y esterilización',
    nota: 'Donde se te recibe y donde se prepara el instrumental antes de cada atención.',
  },
] as const;

/** Solo las zonas con fotos, cada una con sus espacios por orden. */
export function agruparPorZona(espacios: CollectionEntry<'espacios'>[]) {
  return ZONAS.map((zona) => ({
    ...zona,
    espacios: espacios
      .filter((espacio) => espacio.data.zona === zona.clave)
      .sort((a, b) => a.data.orden - b.data.orden),
  })).filter((zona) => zona.espacios.length > 0);
}

export const SIZES_ESPACIO = '(min-width: 1024px) 30vw, (min-width: 768px) 32vw, 50vw';
