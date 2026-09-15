import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Esquemas de contenido. Lo que no está aquí no llega a la plantilla.
 *
 * Los campos obligatorios son los que una landing no puede renderizar sin
 * mentir: alternativas, proceso e indicaciones. Si falta uno, falla el build.
 */

const paso = z.object({
  titulo: z.string(),
  descripcion: z.string(),
});

const tratamientos = defineCollection({
  loader: glob({ base: './src/content/tratamientos', pattern: '**/*.md' }),
  schema: z.object({
    orden: z.number().int().positive(),
    nombre: z.string(),
    titular: z.string(),
    /** Una línea para el índice de la home. No es el titular. */
    resumen: z.string(),

    // Los nueve bloques de la landing
    problema: z.string(),
    atendemos: z.array(z.string()).min(1),
    indicaciones: z.string(),
    /** Obligatorio: ningún procedimiento se presenta como la única opción. */
    alternativas: z.array(z.string()).min(1),
    proceso: z.array(paso).min(1),
    beneficios: z.string(),
    tecnologia: z.array(z.string()).default([]),
    /** Cómo está formado el equipo de esa área. Sin nombres hasta tenerlos. */
    equipo: z.string().optional(),
    cierre: z.string().optional(),

    especialistas: z.array(z.string()).default([]),
    casos: z.array(z.string()).default([]),

    seo: z.object({
      titulo: z.string(),
      descripcion: z.string(),
    }),
  }),
});

const hitos = defineCollection({
  loader: glob({ base: './src/content/hitos', pattern: '**/*.md' }),
  schema: z.object({
    anio: z.number().int().min(2006).max(2026).nullable(),
    titular: z.string(),
    descripcion: z.string(),
    /** false mientras el cliente no confirme la fecha o el nombre exacto. */
    verificado: z.boolean().default(false),
  }),
});

export const collections = { tratamientos, hitos };
