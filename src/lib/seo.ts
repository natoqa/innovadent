import { SITIO } from '../config/site';

const pendiente = (valor: string | null | undefined): valor is null | undefined =>
  !valor || valor.startsWith('[PENDIENTE');

/** URL absoluta de una ruta. Sin dominio de producción no hay URL que inventar. */
export const urlAbsoluta = (ruta: string) => (SITIO.url ? new URL(ruta, SITIO.url).href : null);

const idClinica = () => {
  const inicio = urlAbsoluta('/');
  return inicio ? `${inicio}#clinica` : undefined;
};

/** El fijo cuando exista; mientras tanto, el número confirmado de WhatsApp. */
const telefono = () => {
  const { telefono: fijo, whatsapp } = SITIO.contacto;
  if (!pendiente(fijo)) return fijo;
  return whatsapp ? `+${whatsapp}` : undefined;
};

/** Home: `Dentist`, que en schema.org ya es LocalBusiness y MedicalOrganization. */
export const esquemaClinica = () => {
  const { sede, horarios, redes } = SITIO;
  const sameAs = Object.values(redes).filter((red): red is string => Boolean(red));

  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': idClinica(),
    name: SITIO.nombre,
    description: pendiente(SITIO.descripcion) ? undefined : SITIO.descripcion,
    url: urlAbsoluta('/') ?? undefined,
    telephone: telefono(),
    email: pendiente(SITIO.contacto.correo) ? undefined : SITIO.contacto.correo,
    foundingDate: String(SITIO.fundacion),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${sede.calle}, ${sede.distrito}`,
      addressLocality: sede.ciudad,
      addressRegion: sede.region,
      postalCode: sede.codigoPostal ?? undefined,
      addressCountry: 'PE',
    },
    geo:
      sede.latitud !== null && sede.longitud !== null
        ? { '@type': 'GeoCoordinates', latitude: sede.latitud, longitude: sede.longitud }
        : undefined,
    hasMap: sede.mapa ?? undefined,
    openingHoursSpecification: horarios
      .filter((horario) => horario.apertura && horario.cierre)
      .map((horario) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: horario.diasSchema,
        opens: horario.apertura,
        closes: horario.cierre,
      })),
    sameAs: sameAs.length ? sameAs : undefined,
  };
};

interface PaginaTratamiento {
  nombre: string;
  descripcion: string;
  ruta: string;
}

/** Landings: `MedicalWebPage`, publicada por la clínica de la home. */
export const esquemaTratamiento = ({ nombre, descripcion, ruta }: PaginaTratamiento) => ({
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  name: nombre,
  description: descripcion,
  url: urlAbsoluta(ruta) ?? undefined,
  inLanguage: SITIO.idioma,
  specialty: 'https://schema.org/Dentistry',
  about: { '@type': 'MedicalEntity', name: nombre },
  publisher: { '@type': 'Dentist', '@id': idClinica(), name: SITIO.nombre },
});
