import type { Reserva } from '../validation';
import { NoopAdapter } from './noop';

/** Lo que se entrega al CRM. El consentimiento viaja con el lead: es lo que autoriza la transferencia. */
export interface Lead extends Omit<Reserva, 'consentimiento'> {
  id: string;
  recibido: string;
  consentimiento: { otorgado: true; fecha: string };
  /** Página desde la que se envió el formulario. */
  origen: string | null;
}

export interface LeadAdapter {
  readonly nombre: string;
  enviar(lead: Lead): Promise<void>;
}

/**
 * El adaptador activo. Cuando el cliente entregue la API de su CRM, se escribe
 * InnovadentAdapter y se cambia solo esta línea.
 */
export const adaptador: LeadAdapter = new NoopAdapter();

const LIMITE_MS = 4000;

/**
 * Entrega el lead sin que el paciente dependa del CRM: si falla o tarda más
 * del límite, se registra y la reserva sigue adelante.
 */
export const entregarAlCrm = async (lead: Lead) => {
  let temporizador: ReturnType<typeof setTimeout> | undefined;

  const limite = new Promise<never>((_, rechazar) => {
    temporizador = setTimeout(
      () => rechazar(new Error(`sin respuesta en ${LIMITE_MS} ms`)),
      LIMITE_MS,
    );
  });

  try {
    await Promise.race([adaptador.enviar(lead), limite]);
  } catch (error) {
    const motivo = error instanceof Error ? error.message : String(error);
    console.error(`[crm:${adaptador.nombre}] lead ${lead.id} no entregado: ${motivo}`);
  } finally {
    clearTimeout(temporizador);
  }
};
