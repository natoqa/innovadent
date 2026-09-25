import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
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

/**
 * La relación entre profesional y área vive en un solo sitio: el tratamiento
 * declara quién lo realiza. El equipo de cada especialista se deriva de ahí,
 * así no hay dos listas que mantener sincronizadas.
 */
const especialistas = defineCollection({
  loader: glob({ base: './src/content/especialistas', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      orden: z.number().int().positive(),
      nombre: z.string(),
      titulo: z.string().default('Cirujano dentista'),
      especialidad: z.string(),
      /** Número del Colegio Odontológico del Perú. Se guarda como texto: es un identificador, no una cifra que se opere. */
      colegiatura: z.string().regex(/^\d+$/),
      /** Registro Nacional de Especialistas. Solo lo tienen los que lo declararon. */
      rne: z.string().regex(/^\d+$/).optional(),
      /** Universidad, posgrado, sociedades. Vacío hasta que el cliente lo entregue. */
      formacion: z.array(z.string()).default([]),
      retrato: image().optional(),
    }),
});

/**
 * El resto del personal: asistencia, recepción y administración. Colección
 * aparte, no una variante de `especialistas`, y esa separación es lo que
 * impide publicar a alguien como colegiado odontológico sin serlo.
 *
 * `titulo` es la formación de la persona y `rol` la función que cumple en la
 * clínica. No siempre coinciden: aquí hay una cirujana dentista trabajando
 * como asistente dental.
 */
const equipo = defineCollection({
  loader: glob({ base: './src/content/equipo', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      orden: z.number().int().positive(),
      grupo: z.enum(['asistentes', 'apoyos', 'recepcion', 'administracion']),
      nombre: z.string(),
      titulo: z.string(),
      rol: z.string(),
      /** Colegiatura no odontológica. Nunca se muestra junto a las clínicas. */
      colegiatura: z.string().regex(/^\d+$/).optional(),
      retrato: image().optional(),
    }),
});

const tratamientos = defineCollection({
  loader: glob({ base: './src/content/tratamientos', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z
      .object({
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

        /** Un slug inexistente rompe el build, no pasa en silencio. */
        especialistas: z.array(reference('especialistas')).default([]),

        seo: z.object({
          titulo: z.string(),
          descripcion: z.string(),
        }),

        /**
         * Fotografía representativa, tomada en la clínica. Se usa en el índice de
         * áreas de la home y en el cierre de la landing. Opcional hasta que llegue.
         */
        foto: image().optional(),
        altFoto: z.string().min(10).optional(),
        /** Si en la foto aparece un menor, sin autorización de los padres no compila. */
        fotoConMenores: z.boolean().default(false),
        autorizacionPadres: z.literal(true).optional(),
      })
      .refine((t) => !t.foto || Boolean(t.altFoto), {
        message: 'Una foto necesita altFoto que describa lo que se ve.',
        path: ['altFoto'],
      })
      .refine((t) => !t.fotoConMenores || t.autorizacionPadres === true, {
        message: 'Una foto con menores necesita autorizacionPadres: true.',
        path: ['autorizacionPadres'],
      }),
});

const hitos = defineCollection({
  loader: glob({ base: './src/content/hitos', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z
      .object({
        anio: z.number().int().min(2006).max(2026).nullable(),
        titular: z.string(),
        descripcion: z.string(),
        /** false mientras el cliente no confirme la fecha o el nombre exacto. */
        verificado: z.boolean().default(false),
        /** Foto de archivo del hito, si la clínica la tiene. Se muestra en gris. */
        foto: image().optional(),
        altFoto: z.string().min(10).optional(),
      })
      .refine((hito) => !hito.foto || Boolean(hito.altFoto), {
        message: 'Una foto necesita altFoto que describa lo que se ve.',
        path: ['altFoto'],
      }),
});

/**
 * Las tres colecciones que siguen esperan material del cliente. Los archivos
 * que empiezan por guion bajo (_plantilla.md) documentan los campos y el
 * cargador los ignora.
 */
const sinPlantillas = '**/[!_]*.md';

/**
 * Un caso sin consentimiento informado firmado no compila: `consentimiento`
 * solo admite `true`. Si el paciente es menor, además se exige la autorización
 * de los padres. La relación con el tratamiento vive aquí, no en la landing.
 */
const casos = defineCollection({
  loader: glob({ base: './src/content/casos', pattern: sinPlantillas }),
  schema: ({ image }) =>
    z
      .object({
        orden: z.number().int().positive(),
        titulo: z.string(),
        tratamiento: reference('tratamientos'),
        especialista: reference('especialistas'),
        /** Como lo diría la ficha: "14 meses", "3 sesiones". */
        duracion: z.string(),
        antes: image(),
        despues: image(),
        /** Describen lo que se ve clínicamente, no "foto antes". */
        altAntes: z.string().min(10),
        altDespues: z.string().min(10),
        consentimiento: z.literal(true),
        menor: z.boolean().default(false),
        autorizacionPadres: z.literal(true).optional(),
      })
      .refine((caso) => !caso.menor || caso.autorizacionPadres === true, {
        message: 'Un caso de un menor necesita autorizacionPadres: true.',
        path: ['autorizacionPadres'],
      }),
});

const testimonios = defineCollection({
  loader: glob({ base: './src/content/testimonios', pattern: sinPlantillas }),
  schema: z
    .object({
      orden: z.number().int().positive(),
      /** Nombre o iniciales, como el paciente autorizó que aparezca. */
      autor: z.string(),
      texto: z.string().optional(),
      /** Ruta dentro de public/, por ejemplo "/video/testimonio-ana.mp4". */
      video: z.string().startsWith('/').optional(),
      autorizacion: z.literal(true),
      tratamiento: reference('tratamientos').optional(),
    })
    .refine((testimonio) => testimonio.texto || testimonio.video, {
      message: 'Un testimonio necesita texto o video.',
    }),
});

/**
 * Fotos del ámbito Innovadent Kids. Todas muestran menores: la autorización de
 * los padres es obligatoria en cada una, no opcional.
 */
const kids = defineCollection({
  loader: glob({ base: './src/content/kids', pattern: sinPlantillas }),
  schema: ({ image }) =>
    z.object({
      orden: z.number().int().positive(),
      foto: image(),
      alt: z.string().min(10),
      autorizacionPadres: z.literal(true),
    }),
});

/** Se muestra el beneficio para el paciente; equipo y marca van como dato. */
const tecnologia = defineCollection({
  loader: glob({ base: './src/content/tecnologia', pattern: sinPlantillas }),
  schema: z.object({
    orden: z.number().int().positive(),
    equipo: z.string(),
    marca: z.string(),
    categoria: z.enum(['diagnostico', 'planificacion', 'tratamiento', 'seguridad']),
    beneficio: z.string(),
  }),
});

export const collections = {
  tratamientos,
  especialistas,
  equipo,
  hitos,
  casos,
  testimonios,
  tecnologia,
  kids,
};
