/**
 * Datos de la clínica. Fuente única: ningún teléfono, dirección ni horario
 * se escribe dentro de un componente.
 *
 * Los marcadores [PENDIENTE: …] no se muestran en el sitio: el dato se omite
 * hasta que el cliente lo entregue. No se rellenan por aproximación.
 */

export type DiaSchema =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface Horario {
  /** Etiqueta legible: "Lunes a viernes", "Sábados". */
  dias: string;
  /** Los mismos días en inglés de schema.org, para openingHoursSpecification. */
  diasSchema: DiaSchema[];
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
  /**
   * URL de inserción de Street View frente a la fachada, tal como la da
   * Google en "Compartir > Insertar un mapa". Solo el valor de src.
   */
  vistaCalle: string | null;
  estacionamiento: boolean | null;
}

export const SITIO = {
  nombre: 'Innovadent',
  /** Línea bajo el logotipo. */
  bajada: 'Centro odontológico integral',
  descripcion:
    'Centro odontológico en Trujillo desde 2006. Ortodoncia, endodoncia, periodoncia e implantología, rehabilitación oral, cirugía bucal y odontopediatría.',
  idioma: 'es-PE',
  locale: 'es_PE',

  /** Dominio de producción. Sin él no se emiten canonical, OG ni sitemap. */
  url: null as string | null,

  /** 2006–2026: el aniversario es el eje narrativo del sitio. */
  fundacion: 2006,
  aniversario: 2026,

  /**
   * Total histórico de pacientes atendidos, entregado por la clínica.
   * Se formatea con Intl en el componente: aquí vive el número, no su forma.
   */
  pacientes: 15399,

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
    // Posición de la cámara de Street View frente a la fachada, entregada por
    // la clínica el 22-09-2026. Es la calle, no el interior del local.
    latitud: -8.116867021853317,
    longitud: -79.03130160450394,
    mapa: null,
    vistaCalle:
      'https://www.google.com/maps/embed?pb=!3m2!1ses!2spe!4v1790124364562!5m2!1ses!2spe!6m8!1m7!1siFFAwkB_w14oIH2031Tozg!2m2!1d-8.116867021853317!2d-79.03130160450394!3f80.31016311233914!4f3.778219078890558!5f0.7820865974627469',
    estacionamiento: true,
  } satisfies Sede,

  horarios: [
    {
      dias: 'Lunes a viernes',
      diasSchema: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      apertura: '09:00',
      cierre: '20:00',
    },
    { dias: 'Sábados', diasSchema: ['Saturday'], apertura: '09:00', cierre: '17:00' },
  ] satisfies Horario[],

  redes: {
    facebook: null as string | null,
    instagram: null as string | null,
    tiktok: null as string | null,
    youtube: null as string | null,
  },

  /**
   * Opciones del formulario de reserva. El `valor` viaja al servidor y al CRM;
   * la `etiqueta` es lo que lee el paciente. Los motivos siguen las seis
   * especialidades reales de la clínica, no la lista antigua de la documentación.
   */
  reserva: {
    motivos: [
      { valor: 'primera-evaluacion', etiqueta: 'Primera evaluación' },
      { valor: 'ortodoncia', etiqueta: 'Ortodoncia y ortopedia maxilar' },
      { valor: 'endodoncia', etiqueta: 'Endodoncia' },
      { valor: 'periodoncia-implantes', etiqueta: 'Periodoncia e implantología' },
      { valor: 'rehabilitacion', etiqueta: 'Rehabilitación oral' },
      { valor: 'cirugia', etiqueta: 'Cirugía bucal y maxilofacial' },
      { valor: 'odontopediatria', etiqueta: 'Odontopediatría' },
      { valor: 'urgencia', etiqueta: 'Urgencia' },
    ],
    horarios: [
      { valor: 'manana', etiqueta: 'Mañana' },
      { valor: 'tarde', etiqueta: 'Tarde' },
      { valor: 'indiferente', etiqueta: 'Sin preferencia' },
    ],
  },

  /** Valoración de Google: se copia de la ficha real, nunca se estima. */
  google: {
    ficha: null as string | null,
    valoracion: null as number | null,
    resenas: null as number | null,
  },
} as const;

export type Sitio = typeof SITIO;
