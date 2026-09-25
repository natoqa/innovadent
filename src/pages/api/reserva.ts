import type { APIRoute } from 'astro';
import { validarReserva, type ErroresReserva } from '../../lib/validation';
import { notificarReserva, telefonoOculto } from '../../lib/mail';
import { entregarAlCrm, type Lead } from '../../lib/crm/adapter';

export const prerender = false;

/** Estados que entiende Reserva.astro por JSON, o /reserva/[estado] sin JavaScript. */
export type Estado = 'enviada' | 'revisar' | 'limite' | 'error';

const VENTANA_MS = 10 * 60 * 1000;
const MAXIMO_POR_VENTANA = 5;

/**
 * Límite por IP en memoria. En Vercel cada instancia lleva su propia cuenta,
 * así que frena el abuso repetido desde una IP, no un ataque distribuido.
 */
const intentos = new Map<string, number[]>();

const superaLimite = (ip: string) => {
  const ahora = Date.now();
  const recientes = (intentos.get(ip) ?? []).filter((momento) => ahora - momento < VENTANA_MS);

  if (recientes.length >= MAXIMO_POR_VENTANA) {
    intentos.set(ip, recientes);
    return true;
  }

  recientes.push(ahora);
  intentos.set(ip, recientes);
  return false;
};

const responder = (
  peticion: Request,
  estado: Estado,
  codigo: number,
  errores?: ErroresReserva,
) => {
  const quiereJson = peticion.headers.get('accept')?.includes('application/json');

  if (quiereJson) {
    return Response.json({ estado, errores }, { status: codigo });
  }

  // Sin JavaScript el navegador envía el formulario normal. El resultado se
  // muestra en una página estática propia: la home se prerenderiza y no puede
  // leer parámetros de la URL.
  return new Response(null, {
    status: 303,
    headers: { Location: `/reserva/${estado}` },
  });
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let formulario: FormData;
  try {
    formulario = await request.formData();
  } catch {
    return responder(request, 'revisar', 400);
  }

  // Trampa para bots: un humano no ve este campo. Se descarta sin avisar.
  if (formulario.get('sitio_web')) {
    return responder(request, 'enviada', 200);
  }

  const resultado = validarReserva(formulario);
  if (!resultado.valido) {
    return responder(request, 'revisar', 400, resultado.errores);
  }

  if (superaLimite(clientAddress)) {
    return responder(request, 'limite', 429);
  }

  const recibido = new Date().toISOString();
  const { consentimiento: _, ...datos } = resultado.datos;

  const lead: Lead = {
    ...datos,
    id: crypto.randomUUID(),
    recibido,
    consentimiento: { otorgado: true, fecha: recibido },
    origen: request.headers.get('referer'),
  };

  try {
    await notificarReserva(lead);
  } catch (error) {
    const motivo = error instanceof Error ? error.message : String(error);
    console.error(`[reserva] ${lead.id} sin notificar: ${motivo}`);
    return responder(request, 'error', 500);
  }

  console.info(
    `[reserva] ${lead.id} registrada: ${lead.motivo}, ${lead.horario}, ${telefonoOculto(lead.telefono)}`,
  );

  await entregarAlCrm(lead);

  return responder(request, 'enviada', 200);
};
