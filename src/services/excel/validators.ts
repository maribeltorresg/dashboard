export function validateRequiredColumns(headers: string[], required: string[]) {
  const missing = required.filter((col) => !headers.includes(col));

  if (missing.length > 0) {
    throw new Error(`Faltan columnas: ${missing.join(", ")}`);
  }
}
