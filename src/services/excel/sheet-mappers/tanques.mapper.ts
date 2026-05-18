import type { Maintenance } from "@/domains/maintenance/types/maintenance";
import { parseExcelDate } from "../parse-date";

export function mapTanquesRow(row: any): Maintenance {
  return {
    id: crypto.randomUUID(),
    type: "TANQUES",
    location: row["LIMPIEZAS_TANQUE_ELEVADO"] || "",
    units: row["CANT."],
    provider: row["EJECUTADO"] || "",
    performedAt: parseExcelDate(row["F._EJECUCION_SEGUN_AC"]),
    dueAt: parseExcelDate(row["F._CADUCIDAD"]),
    notes: "",
  };
}
