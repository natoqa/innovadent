/** Condición de media y ancho CSS que ocupa el marco en ese caso. */
export type Regla = [media: string, ancho: string];

/**
 * `sizes` para un retrato con `object-cover`. Si la foto es más apaisada que su
 * marco, se amplía para cubrirlo y se muestra más ancha que el marco: el valor
 * lo declara para que el navegador pida una copia con píxeles suficientes.
 */
export function tamanosRetrato(
  retrato: { width: number; height: number },
  proporcionMarco: number,
  reglas: Regla[],
) {
  const factor = Math.max(1, retrato.width / retrato.height / proporcionMarco);
  return reglas
    .map(([media, ancho]) => `${media} ${factor === 1 ? ancho : `calc(${ancho} * ${factor.toFixed(2)})`}`.trim())
    .join(', ');
}
