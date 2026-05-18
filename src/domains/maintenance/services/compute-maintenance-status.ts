import dayjs from "dayjs";
import type { Maintenance } from "../types/maintenance";

export type MaintenanceStatus = "HEALTHY" | "DUE_SOON" | "OVERDUE";

const DUE_SOON_DAYS = 30 * 2;

export function computeMaintenanceStatus(
  maintenance: Maintenance,
): MaintenanceStatus {
  if (!maintenance.dueAt) {
    return "HEALTHY";
  }

  const today = dayjs();

  const dueAt = dayjs(maintenance.dueAt);

  if (dueAt.isBefore(today, "day")) {
    return "OVERDUE";
  }

  const daysRemaining = dueAt.diff(today, "day");

  if (daysRemaining <= DUE_SOON_DAYS) {
    return "DUE_SOON";
  }

  return "HEALTHY";
}
