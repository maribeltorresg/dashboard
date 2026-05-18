import type { Maintenance } from "@/domains/maintenance/types/maintenance";
import { parseExcelDate } from "../parse-date";

export function mapAARow(row: any): Maintenance {
  return {
    id: crypto.randomUUID(),
    type: "AA",
    location: row["AGENCIAS"] || "",
    units: row["TOTAL"],
    provider: "",
    performedAt: parseExcelDate("01/01/2026"),
    dueAt: parseExcelDate("01/04/2026"),
    notes: "Detenido a petición de FC",
  };
}
