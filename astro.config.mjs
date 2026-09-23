// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // `site` queda pendiente del dominio de producción. Sin él, Base.astro omite
  // el canonical en vez de emitir uno inventado.
  output: 'server',
  adapter: vercel(),
  env: {
    schema: {
      // Opcionales para que el build no falle antes de tener cuenta de correo.
      // En producción, sin ellas, /api/reserva responde con error y ofrece WhatsApp.
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CORREO_REMITENTE: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
