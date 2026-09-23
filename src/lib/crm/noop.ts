import type { Lead, LeadAdapter } from './adapter';

/** Mientras el CRM del cliente no exista, el lead se queda en el correo a la clínica. */
export class NoopAdapter implements LeadAdapter {
  readonly nombre = 'noop';

  async enviar(_lead: Lead) {}
}
