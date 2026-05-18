import type { Maintenance } from "@/domains/maintenance/types/maintenance";
import { parseExcelDate } from "../parse-date";

export function mapDddRow(row: any): Maintenance {
  return {
    id: crypto.randomUUID(),
    type: "DDD",
    location: row["FUMIGACION,_DESINFECCION_Y_DESRATIZACION"] || "",
    units: 1,
    provider: row["EJECUTADO"] || "",
    performedAt: parseExcelDate(row["F._FUMIGACION_SEGUN_AC"]),
    dueAt: parseExcelDate(row["F._CADUCIDAD"]),
    notes: "",
  };
}
