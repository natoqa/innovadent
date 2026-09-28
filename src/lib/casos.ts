import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Formato = CollectionEntry<'casos'>['data']['formato'];

export interface FotoCaso {
  foto?: ImageMetadata;
  alt?: string;
  etiqueta?: string;
}

/**
 * Un caso listo para pintar. Los campos opcionales de texto quedan vacíos en
 * los casos de muestra: el componente dibuja una barra gris en su lugar, nunca
 * un dato inventado.
 */
export interface VistaCaso {
  id: string;
  numero: string;
  titulo?: string;
  tratamiento: { id: string; nombre: string };
  especialista?: string;
  duracion?: string;
  sesiones?: string;
  formato: Formato;
  fotos: FotoCaso[];
  motivo?: string;
  diagnostico?: string;
  plan: string[];
  /** Hueco de maqueta: se ve en gris hasta que el cliente entregue casos. */
  muestra: boolean;
}

export const numeroCaso = (n: number) => String(n).padStart(2, '0');

export const describirFormato = (formato: Formato, fotos: number) =>
  formato === 'antes-despues'
    ? 'Antes y después'
    : formato === 'secuencia'
      ? `Secuencia de ${fotos} etapas`
      : fotos === 1
        ? '1 fotografía'
        : `${fotos} fotografías`;

export const vistaDeCaso = async (caso: CollectionEntry<'casos'>): Promise<VistaCaso> => {
  const c = caso.data;
  const tratamiento = await getEntry(c.tratamiento);
  const especialista = await getEntry(c.especialista);

  return {
    id: caso.id,
    numero: numeroCaso(c.orden),
    titulo: c.titulo,
    tratamiento: { id: c.tratamiento.id, nombre: tratamiento?.data.nombre ?? '' },
    especialista: especialista?.data.nombre,
    duracion: c.duracion,
    sesiones: c.sesiones,
    formato: c.formato,
    fotos: c.fotos,
    motivo: c.motivo,
    diagnostico: c.diagnostico,
    plan: c.plan,
    muestra: false,
  };
};

/**
 * Formatos de la maqueta, en orden: así el cliente ve los tres modos de
 * presentar un caso antes de entregar el primero.
 */
const FORMATOS_MUESTRA: { formato: Formato; fotos: FotoCaso[] }[] = [
  { formato: 'antes-despues', fotos: [{ etiqueta: 'Antes' }, { etiqueta: 'Después' }] },
  {
    formato: 'secuencia',
    fotos: [{ etiqueta: 'Inicio' }, { etiqueta: 'Etapa intermedia' }, { etiqueta: 'Final' }],
  },
  {
    formato: 'fotos',
    fotos: [
      { etiqueta: 'Foto principal del caso' },
      { etiqueta: 'Detalle' },
      { etiqueta: 'Control' },
    ],
  },
];

/**
 * Todos los casos publicados. Sin ninguno, un caso de muestra por especialidad
 * para revisar la maqueta con el cliente.
 */
export const casosParaMostrar = async (): Promise<VistaCaso[]> => {
  const casos = (await getCollection('casos')).sort((a, b) => a.data.orden - b.data.orden);

  if (casos.length > 0) {
    // El destacado va primero; el resto conserva su orden.
    const destacado = casos.find((caso) => caso.data.destacado) ?? casos[0];
    const ordenados = [destacado, ...casos.filter((caso) => caso !== destacado)];
    return Promise.all(ordenados.map((caso) => vistaDeCaso(caso!)));
  }

  const tratamientos = (await getCollection('tratamientos')).sort(
    (a, b) => a.data.orden - b.data.orden,
  );

  return tratamientos.map((tratamiento, i) => {
    const modelo = FORMATOS_MUESTRA[i % FORMATOS_MUESTRA.length]!;
    return {
      id: `muestra-${tratamiento.id}`,
      numero: numeroCaso(i + 1),
      tratamiento: { id: tratamiento.id, nombre: tratamiento.data.nombre },
      formato: modelo.formato,
      fotos: modelo.fotos,
      plan: [],
      muestra: true,
    };
  });
};
