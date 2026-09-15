---
paths:
  - "src/pages/api/**/*.ts"
  - "src/lib/crm/**/*.ts"
  - "src/lib/validation.ts"
  - "src/lib/mail.ts"
  - "src/components/sections/Reserva.astro"
---

# Formulario y CRM

El cliente está desarrollando un CRM propio y quiere el formulario conectado. **Ese CRM aún no existe.** La arquitectura debe funcionar sin él.

## Flujo

```
Formulario → POST /api/reserva
               ├─ valida (Zod)
               ├─ verifica consentimiento
               ├─ notifica a la clínica (correo)   ← funciona desde el día 1
               ├─ registra el lead
               └─ adapter.enviar(lead)             ← hoy NoopAdapter
```

## Reglas

- El formulario **siempre** apunta a `/api/reserva`. Nunca dispara un correo ni un servicio externo directamente desde el cliente.
- `src/lib/crm/adapter.ts` define la interfaz `LeadAdapter`. Hoy se usa `NoopAdapter`. Cuando el cliente entregue su API, se implementa `InnovadentAdapter` y se cambia una línea. **No escribir el adaptador real hasta tener su documentación.**
- **Si el adaptador falla, la petición sigue siendo exitosa.** El lead ya quedó guardado y notificado. Nunca perder un paciente porque su CRM se cayó. El fallo se registra, no se propaga al usuario.
- El adaptador corre con timeout. Nunca dejar al paciente esperando por un servicio de terceros.

## Campos

Nombre, teléfono, motivo de consulta, preferencia de horario.

- Motivos: primera evaluación, estética dental, ortodoncia, implantes y rehabilitación, endodoncia, cirugía oral, odontopediatría, urgencia.
- Horario: mañana, tarde, indiferente.
- Ambas listas salen de `src/config/site.ts`, no hardcodeadas en el componente.

## Consentimiento

**Checkbox obligatorio, sin marcar por defecto, con enlace a `/privacidad`.** Los datos se transferirán a un tercero (el CRM del cliente) y eso exige consentimiento explícito bajo la Ley 29733 de Protección de Datos Personales del Perú.

El endpoint rechaza cualquier petición sin consentimiento, aunque el checkbox haya sido eludido en el cliente.

## Seguridad

- Campo honeypot oculto. Si viene lleno, se descarta en silencio con respuesta 200.
- Límite de tasa por IP.
- Nada de CAPTCHA.
- Validación en el servidor siempre, aunque exista en el cliente.
- No registrar el teléfono completo en logs.

## Estados

Reposo, enviando, éxito, error de campo, error de servidor. Todos implementados.

- El botón dice "Reservar mi cita", no "Enviar".
- Mientras envía, el botón se deshabilita y cambia de texto.
- El error de servidor da una alternativa: el número de WhatsApp de la clínica.
- El mensaje de éxito dice qué pasa después, no solo "gracias".
