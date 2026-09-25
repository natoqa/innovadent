import { RESEND_API_KEY, CORREO_REMITENTE } from 'astro:env/server';
import { SITIO } from '../config/site';
import type { Lead } from './crm/adapter';

const etiqueta = (lista: readonly { valor: string; etiqueta: string }[], valor: string) =>
  lista.find((opcion) => opcion.valor === valor)?.etiqueta ?? valor;

/** Para logs: nunca el teléfono completo. */
export const telefonoOculto = (telefono: string) => `***${telefono.slice(-3)}`;

const destinatario = () => {
  const correo = SITIO.contacto.correoReservas;
  return correo.startsWith('[PENDIENTE') ? null : correo;
};

const redactar = (lead: Lead) => {
  const motivo = etiqueta(SITIO.reserva.motivos, lead.motivo);
  const horario = etiqueta(SITIO.reserva.horarios, lead.horario);
  const fecha = new Intl.DateTimeFormat(SITIO.idioma, {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'America/Lima',
  }).format(new Date(lead.recibido));

  return {
    asunto: `Reserva web de ${lead.nombre}: ${motivo}`,
    texto: [
      `Nombre: ${lead.nombre}`,
      `Teléfono: ${lead.telefono}`,
      `Motivo: ${motivo}`,
      `Prefiere: ${horario}`,
      '',
      `Recibida el ${fecha}.`,
      `Consentimiento de tratamiento de datos otorgado en el formulario.`,
      lead.origen ? `Enviada desde ${lead.origen}` : null,
      `Referencia: ${lead.id}`,
    ]
      .filter((linea) => linea !== null)
      .join('\n'),
  };
};

/**
 * Notifica cada reserva a la clínica. Es el registro que funciona desde el
 * primer día, con o sin CRM, así que si falla el paciente tiene que saberlo.
 *
 * Sin configurar, en desarrollo solo se registra en consola; en producción es
 * un error, porque una reserva que no llega a nadie es un paciente perdido.
 */
export const notificarReserva = async (lead: Lead) => {
  const para = destinatario();

  if (!para || !RESEND_API_KEY || !CORREO_REMITENTE) {
    if (import.meta.env.DEV) {
      console.info(
        `[correo] sin configurar; reserva ${lead.id} (${lead.motivo}, ${telefonoOculto(lead.telefono)}) no enviada`,
      );
      return;
    }
    throw new Error('el envío de correo no está configurado');
  }

  const { asunto, texto } = redactar(lead);

  const respuesta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': lead.id,
    },
    body: JSON.stringify({ from: CORREO_REMITENTE, to: [para], subject: asunto, text: texto }),
    signal: AbortSignal.timeout(8000),
  });

  if (!respuesta.ok) {
    throw new Error(`el proveedor de correo respondió ${respuesta.status}`);
  }
};
