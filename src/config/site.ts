/**
 * Datos de la clínica. Fuente única: ningún teléfono, dirección ni horario
 * se escribe dentro de un componente.
 *
 * Los marcadores [PENDIENTE: …] son deliberadamente visibles. Se sustituyen
 * cuando el cliente entregue el dato; no se rellenan por aproximación.
 */

export interface Horario {
  /** Etiqueta legible: "Lunes a viernes", "Sábados". */
  dias: string;
  /** Formato 24h "HH:MM". `null` mientras no haya dato. */
  apertura: string | null;
  cierre: string | null;
}

export interface Sede {
  calle: string;
  distrito: string;
  ciudad: string;
  region: string;
  pais: string;
  codigoPostal: string | null;
  /** Coordenadas para el JSON-LD de LocalBusiness. */
  latitud: number | null;
  longitud: number | null;
  /** Enlace a la ficha de Google Maps. */
  mapa: string | null;
  estacionamiento: boolean | null;
}

export const SITIO = {
  nombre: 'Innovadent',
  descripcion: '[PENDIENTE: descripción de una línea para meta description]',
  idioma: 'es-PE',
  locale: 'es_PE',

  /** Dominio de producción. Sin él no se emiten canonical, OG ni sitemap. */
  url: null as string | null,

  /** 2006–2026: el aniversario es el eje narrativo del sitio. */
  fundacion: 2006,
  aniversario: 2026,

  contacto: {
    telefono: '[PENDIENTE: teléfono fijo]',
    celular: '[PENDIENTE: celular]',
    /** Solo dígitos con prefijo de país, para el enlace wa.me. */
    whatsapp: '51998255979' as string | null,
    /** El mismo número como se lee, para mostrarlo en pantalla. */
    whatsappTexto: '998 255 979' as string | null,
    correo: '[PENDIENTE: correo de contacto]',
    /** Destinatario de la notificación de cada reserva (fase 5). */
    correoReservas: '[PENDIENTE: correo que recibe las reservas]',
  },

  sede: {
    calle: 'Calle Argentina 113',
    distrito: 'Urb. El Recreo',
    ciudad: 'Trujillo',
    region: 'La Libertad',
    pais: 'Perú',
    codigoPostal: null,
    latitud: null,
    longitud: null,
    mapa: null,
    estacionamiento: true,
  } satisfies Sede,

  /** El mapeo a openingHours del JSON-LD se hace en fase 7, sobre estos valores. */
  horarios: [
    { dias: 'Lunes a viernes', apertura: '09:00', cierre: '20:00' },
    { dias: 'Sábados', apertura: '09:00', cierre: '17:00' },
  ] satisfies Horario[],

  redes: {
    facebook: null as string | null,
    instagram: null as string | null,
    tiktok: null as string | null,
    youtube: null as string | null,
  },

  /** Valoración de Google: se copia de la ficha real, nunca se estima. */
  google: {
    ficha: null as string | null,
    valoracion: null as number | null,
    resenas: null as number | null,
  },
} as const;

export type Sitio = typeof SITIO;
