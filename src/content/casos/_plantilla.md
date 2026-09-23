---
# Plantilla: copia este archivo sin el guion bajo, por ejemplo
# ortodoncia-apinamiento-superior.md, y rellena cada campo.
#
# Un caso solo se publica con el consentimiento informado FIRMADO del
# paciente. Si consentimiento no es true, el build falla a propósito.
#
# Las fotos van en esta misma carpeta, tomadas en la clínica, con el mismo
# encuadre antes y después. Nunca stock ni imágenes generadas.

orden: 1
titulo: Corrección de apiñamiento en la arcada superior
tratamiento: ortodoncia-y-ortopedia-maxilar   # slug de src/content/tratamientos
especialista: nombre-apellido                  # slug de src/content/especialistas
duracion: 14 meses
antes: ./nombre-caso-antes.jpg
despues: ./nombre-caso-despues.jpg
altAntes: Arcada superior con incisivos superpuestos y canino fuera de la línea
altDespues: Arcada superior alineada, con los incisivos en su posición
consentimiento: true

# Solo si el paciente es menor de edad:
# menor: true
# autorizacionPadres: true
---
