import type { APIRoute } from 'astro';
import { urlAbsoluta } from '../lib/seo';

export const prerender = true;

export const GET: APIRoute = () => {
  const mapa = urlAbsoluta('/sitemap.xml');

  const lineas = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /reserva/',
    mapa ? `\nSitemap: ${mapa}` : null,
  ];

  return new Response(`${lineas.filter((linea) => linea !== null).join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
