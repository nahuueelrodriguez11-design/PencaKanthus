/**
 * Calcula los puntos obtenidos en una predicción según las reglas oficiales de Penca Mundial Kanthus.
 * 
 * Reglas:
 * - Resultado exacto: 5 puntos
 * - Acertar ganador o empate: 3 puntos
 * - Participar del pronóstico: 1 punto
 */
export function calculatePoints(
  predGolesA: number,
  predGolesB: number,
  oficialGolesA: number,
  oficialGolesB: number
): number {
  // 1. Resultado exacto
  if (predGolesA === oficialGolesA && predGolesB === oficialGolesB) {
    return 5;
  }

  // Determinar el resultado de la predicción (quién gana o si es empate)
  const predGanadorA = predGolesA > predGolesB;
  const predGanadorB = predGolesB > predGolesA;
  const predEmpate = predGolesA === predGolesB;

  // Determinar el resultado oficial
  const oficialGanadorA = oficialGolesA > oficialGolesB;
  const oficialGanadorB = oficialGolesB > oficialGolesA;
  const oficialEmpate = oficialGolesA === oficialGolesB;

  // 2. Acertar ganador o empate
  if (
    (predGanadorA && oficialGanadorA) ||
    (predGanadorB && oficialGanadorB) ||
    (predEmpate && oficialEmpate)
  ) {
    return 3;
  }

  // 3. Participar del pronóstico pero no acertar
  return 1;
}
