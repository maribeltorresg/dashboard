export function findTableEndByDensity(
  rows: any[][],
  startRow: number, // cabecera
  minDensity = 5,
) {
  let lastValidRow = startRow;

  for (let i = startRow; i < rows.length; i++) {
    const density = rows[i].filter((cell) => {
      return String(cell).trim() !== "";
    }).length;

    if (density >= minDensity) {
      lastValidRow = i;
    } else {
      break;
    }
  }

  return lastValidRow;
}

export function findTableEnd(
  rows: any[][],
  headers: string[],
  startRow: number,
  requiredHeaders: string[],
  maxEmptyRows = 2,
) {
  // Mapear nombres de columnas a índices
  const requiredIndexes = requiredHeaders.map((header) => {
    const index = headers.indexOf(header);

    if (index === -1) {
      throw new Error(`Header no encontrado: ${header}`);
    }

    return index;
  });

  let lastValidRow = startRow;
  let emptyStreak = 0;

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i] || [];

    const isValidRow = requiredIndexes.every((colIndex) => {
      const value = row[colIndex];

      return String(value ?? "").trim() !== "";
    });

    if (isValidRow) {
      lastValidRow = i;
      emptyStreak = 0;
    } else {
      emptyStreak++;

      if (emptyStreak >= maxEmptyRows) {
        break;
      }
    }
  }

  return lastValidRow;
}
