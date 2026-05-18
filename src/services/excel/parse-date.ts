import * as XLSX from "xlsx";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const SUPPORTED_FORMATS = [
  // dd/MM/yyyy
  "DD/MM/YYYY",
  "D/M/YYYY",

  // dd/MM/yy
  "DD/MM/YY",
  "D/M/YY",

  // dd.MM.yyyy
  "DD.MM.YYYY",
  "D.M.YYYY",

  // dd.MM.yy
  "DD.MM.YY",
  "D.M.YY",
] as const;

export function parseExcelDate(
  value: unknown
): Date | undefined {

  if (
    value == null ||
    value === ""
  ) {
    return undefined;
  }

  // Native Date
  if (value instanceof Date) {
    return dayjs(value).isValid()
      ? value
      : undefined;
  }

  // Excel serial date
  if (typeof value === "number") {

    const parsed =
      XLSX.SSF.parse_date_code(
        value
      );

    if (!parsed) {
      return undefined;
    }

    const date = dayjs(
      new Date(
        parsed.y,
        parsed.m - 1,
        parsed.d
      )
    );

    return date.isValid()
      ? date.toDate()
      : undefined;
  }

  // String parsing
  if (typeof value === "string") {

    const raw = value.trim();

    if (!raw) {
      return undefined;
    }

    // Strict parsing against known formats
    for (const format of SUPPORTED_FORMATS) {

      const parsed = dayjs(
        raw,
        format,
        true // strict mode
      );

      if (parsed.isValid()) {
        return parsed.toDate();
      }
    }

    // Final ISO/native fallback
    const fallback = dayjs(raw);

    if (fallback.isValid()) {
      return fallback.toDate();
    }
  }

  return undefined;
}