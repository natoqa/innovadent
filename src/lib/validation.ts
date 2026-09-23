import { z } from 'astro/zod';
import { SITIO } from '../config/site';

type Opciones = readonly { valor: string }[];

const valores = <T extends Opciones>(opciones: T) =>
  opciones.map((opcion) => opcion.valor) as [T[number]['valor'], ...T[number]['valor'][]];

/** Deja solo los dígitos nacionales: quita espacios, guiones y el prefijo +51. */
export const normalizarTelefono = (entrada: string) => {
  const digitos = entrada.replace(/\D/g, '');
  return digitos.length === 11 && digitos.startsWith('51') ? digitos.slice(2) : digitos;
};

export const esquemaReserva = z.object({
  nombre: z
    .string({ error: 'Escribe tu nombre para saber a quién llamar.' })
    .trim()
    .min(2, 'Escribe tu nombre para saber a quién llamar.')
    .max(80, 'El nombre es demasiado largo. Basta con nombre y apellido.'),

  // Celular de 9 dígitos que empieza por 9, o fijo de Trujillo con o sin el 0.
  telefono: z
    .string({ error: 'Escribe un número para poder confirmar tu cita.' })
    .transform(normalizarTelefono)
    .refine((numero) => /^(9\d{8}|0?44\d{6})$/.test(numero), {
      error: 'Escribe un celular de 9 dígitos, por ejemplo 987 654 321, o un fijo con el 044.',
    }),

  motivo: z.enum(valores(SITIO.reserva.motivos), {
    error: 'Elige el motivo que más se acerque a tu consulta.',
  }),

  horario: z.enum(valores(SITIO.reserva.horarios), {
    error: 'Elige en qué momento del día te conviene más.',
  }),

  consentimiento: z.literal('si', {
    error: 'Para enviar la reserva necesitamos tu autorización para usar estos datos.',
  }),
});

export type Reserva = z.infer<typeof esquemaReserva>;
export type CampoReserva = keyof Reserva;
export type ErroresReserva = Partial<Record<CampoReserva, string>>;

type Resultado = { valido: true; datos: Reserva } | { valido: false; errores: ErroresReserva };

export const validarReserva = (formulario: FormData): Resultado => {
  const texto = (campo: string) => {
    const valor = formulario.get(campo);
    return typeof valor === 'string' ? valor : undefined;
  };

  const resultado = esquemaReserva.safeParse({
    nombre: texto('nombre'),
    telefono: texto('telefono'),
    motivo: texto('motivo'),
    horario: texto('horario'),
    consentimiento: texto('consentimiento'),
  });

  if (resultado.success) return { valido: true, datos: resultado.data };

  const errores: ErroresReserva = {};
  for (const problema of resultado.error.issues) {
    const campo = problema.path[0] as CampoReserva;
    errores[campo] ??= problema.message;
  }
  return { valido: false, errores };
};
