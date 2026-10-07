/** Las cuatro categorías del equipamiento, en el orden en que se presentan. */
export const CATEGORIAS = [
  {
    clave: 'diagnostico',
    nombre: 'Diagnóstico',
    nota: 'Lo que se usa para examinar antes de decidir.',
  },
  {
    clave: 'planificacion',
    nombre: 'Planificación',
    nota: 'Lo que ayuda a preparar el tratamiento antes de empezarlo.',
  },
  {
    clave: 'tratamiento',
    nombre: 'Tratamiento',
    nota: 'Lo que se usa en el sillón, durante la atención.',
  },
  {
    clave: 'seguridad',
    nombre: 'Seguridad',
    nota: 'Lo que protege al paciente y al equipo en cada consulta.',
  },
] as const;

export type ClaveCategoria = (typeof CATEGORIAS)[number]['clave'];
