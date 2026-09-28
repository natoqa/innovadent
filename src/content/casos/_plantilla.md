---
# Plantilla: copia este archivo sin el guion bajo, por ejemplo
# ortodoncia-apinamiento-superior.md, y rellena cada campo.
#
# Un caso solo se publica con el consentimiento informado FIRMADO del
# paciente. Si consentimiento no es true, el build falla a propósito.
#
# Las fotos van en esta misma carpeta, tomadas en la clínica. Nunca stock
# ni imágenes generadas.

orden: 1
titulo: Corrección de apiñamiento en la arcada superior
tratamiento: ortodoncia-y-ortopedia-maxilar   # slug de src/content/tratamientos
especialista: nombre-apellido                  # slug de src/content/especialistas
duracion: 14 meses
sesiones: 16 controles                         # opcional
destacado: false                               # true para abrir la página de casos

# Cómo se muestran las fotos:
#   antes-despues  exactamente dos fotos, antes y después, mismo encuadre
#   secuencia      dos o más etapas en orden, cada una con etiqueta
#   fotos          registro libre; la primera es la principal
formato: secuencia
fotos:
  - foto: ./nombre-caso-inicio.jpg
    alt: Arcada superior con incisivos superpuestos y canino fuera de la línea
    etiqueta: Inicio
  - foto: ./nombre-caso-mes-6.jpg
    alt: Arcada superior con brackets, incisivos parcialmente alineados
    etiqueta: Mes 6
  - foto: ./nombre-caso-final.jpg
    alt: Arcada superior alineada, con los incisivos en su posición
    etiqueta: Final

# Recorrido del caso. Todo opcional, pero es lo que le da sentido a las fotos.
motivo: El paciente llegó porque los dientes superiores se montaban y le costaba limpiarlos.
diagnostico: Apiñamiento moderado en la arcada superior, sin alteración de la mordida.
plan:
  - Ortodoncia fija superior
  - Controles mensuales
  - Retención con placa al terminar

consentimiento: true

# Solo si el paciente es menor de edad:
# menor: true
# autorizacionPadres: true
---
