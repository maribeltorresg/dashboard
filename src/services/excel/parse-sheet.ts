import * as XLSX from "xlsx";
import { findHeaderRow } from "./find-header-row";
import {
  findTableEnd,
  findTableEndByDensity,
} from "./find-table-end-by-density";
import { normalizeHeader } from "./normalize-sheet";

export function parseDynamicSheet(
  worksheet: XLSX.WorkSheet,
  header_candidates: string[],
) {
  // Convierte hoja a matriz
  const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    raw: true,
    defval: "",
  });

  // console.table(rows);

  // Detectar fila header
  const headerRowIndex = findHeaderRow(rows, header_candidates);
  if (headerRowIndex === -1) {
    throw new Error("No se encontró header válido");
  }

  // console.log(headerRowIndex);

  // Headers Crudos - Trim y Mayusculas
  const headers = rows[headerRowIndex]; /*.map(
    (h: string) => h?.toString().trim().toUpperCase() ?? "",
  )*/

  // console.log(headers);

  // Detectar fin de la tabla por densidad
  // const tableEnd = findTableEndByDensity(rows, headerRowIndex + 1);
  const tableEnd = findTableEnd(
    rows,
    headers,
    headerRowIndex + 1,
    header_candidates,
  );

  // console.log(tableEnd);

  // Data
  const dataRows = rows.slice(headerRowIndex + 1, tableEnd + 1);

  // Convertir a JSON manualmente
  const result = dataRows
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) => {
      const obj: Record<string, any> = {};

      headers.forEach((header, index) => {
        obj[normalizeHeader(header)] = row[index];
      });

      return obj;
    });

  return result;
}
