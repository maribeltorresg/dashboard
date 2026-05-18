import type { Maintenance } from "@/domains/maintenance/types/maintenance";
import { parseExcelDate } from "../parse-date";

export function mapExtintoresRow(row: any): Maintenance {
  return {
    id: crypto.randomUUID(),
    type: "EXTINTORES",
    location: row["AGENCIA"] || "",
    units: row["TOTAL"],
    provider: row["PROVEEDOR"] || "",
    performedAt: parseExcelDate(row["F._RECARGA_SEGUN_AC"]),
    dueAt: parseExcelDate(row["F._EXPIRACION"]),
    notes: "",
  };
}
