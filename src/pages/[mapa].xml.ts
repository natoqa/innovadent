import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { urlAbsoluta } from '../lib/seo';
import { SITIO } from '../config/site';

export const prerender = true;

/**
 * sitemap.xml. La ruta es dinámica solo para poder no existir: sin dominio
 * de producción en site.ts no hay URLs absolutas, y un sitemap con un
 * dominio inventado es peor que ninguno.
 */
export const getStaticPaths = () => (SITIO.url ? [{ params: { mapa: 'sitemap' } }] : []);

export const GET: APIRoute = async () => {
  const tratamientos = (await getCollection('tratamientos')).sort(
    (a, b) => a.data.orden - b.data.orden,
  );

  // Solo lo indexable: privacidad y los resultados de reserva llevan noindex.
  const rutas = [
    '/',
    '/tratamientos',
    ...tratamientos.map((tratamiento) => `/tratamientos/${tratamiento.id}`),
    '/especialistas',
    '/contacto',
  ];

  const entradas = rutas.map((ruta) => `  <url><loc>${urlAbsoluta(ruta)}</loc></url>`).join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entradas}
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
