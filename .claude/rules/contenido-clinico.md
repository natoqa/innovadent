---
paths:
  - "src/content/**/*"
  - "src/components/treatment/**/*.astro"
---

# Contenido clínico

Este es un sitio de salud. El contenido tiene restricciones que no son negociables.

## Restricciones

- **Cero afirmaciones médicas absolutas.** Nada de "garantizamos", "resultados permanentes", "sin dolor", "el mejor de Trujillo", "100% efectivo".
- **Cero imágenes generadas por IA** en cualquier contexto clínico.
- **Cero fotos de stock** para representar especialistas, pacientes, instalaciones o resultados.
- Cada tratamiento debe mencionar **alternativas**. No presentar un procedimiento como la única opción.
- Los testimonios llevan nombre o iniciales, con autorización.
- Lenguaje responsable: describir el procedimiento y sus indicaciones, no vender un resultado.

## Consentimiento

Un caso antes/después solo se publica con consentimiento informado firmado. El esquema de la colección `casos` incluye un campo `consentimiento: z.literal(true)`, de modo que un caso sin él **falla el build**. Hacerlo cumplir en el esquema, no solo en la plantilla.

Las fotos de menores (Innovadent Kids, odontopediatría) requieren autorización de los padres. Mismo tratamiento en el esquema.

## Colecciones

| Colección | Campos mínimos |
|---|---|
| `tratamientos` | slug, nombre, los 9 bloques, especialista, casos relacionados |
| `especialistas` | nombre, especialidad, formación, colegiatura, retrato |
| `casos` | tratamiento, especialista, duración, foto antes, foto después, `consentimiento` |
| `hitos` | año, titular, descripción, foto (opcional) |
| `testimonios` | texto o video, nombre o iniciales, autorización |
| `tecnologia` | equipo, marca, categoría, beneficio para el paciente |

La categoría de `tecnologia` es una de: diagnóstico, planificación, tratamiento, seguridad. El campo que se muestra al paciente es el beneficio, no la especificación técnica.

## Contenido pendiente

El cliente entrega el material por partes. Mientras no llegue:

- Marcar lo que falta con `PENDIENTE` en el código, el contenido o un comentario (`# PENDIENTE: año del hito`). **El marcador no se muestra en la página**: el sitio se revisa con el cliente, así que el componente omite el dato, la fila o la sección hasta que llegue.
- **Nunca inventar** credenciales, cifras de pacientes, años de experiencia, nombres de especialistas, valoraciones de Google ni testimonios. Un dato inventado que llegue a producción es un problema legal para el cliente.
- Si falta un dato para completar un componente, dejar el marcador y decírmelo. No rellenar.
