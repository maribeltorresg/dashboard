import type { Maintenance } from "../types/maintenance";
import {
  computeMaintenanceStatus,
  type MaintenanceStatus,
} from "../services/compute-maintenance-status";

type FilterStatus = MaintenanceStatus | "COMPLIANT";

export function selectMaintenancesByStatus(
  maintenances: Maintenance[],
  filters: {
    type?: string[];
    status?: FilterStatus[];
  },
) {
  return maintenances.filter((maintenance) => {
    const maintenanceStatus = computeMaintenanceStatus(maintenance);

    const statusMatch =
      !filters.status?.length ||
      filters.status.some((status) => {
        // COMPLIANT = HEALTHY + DUE_SOON
        if (status === "COMPLIANT") {
          return (
            maintenanceStatus === "HEALTHY" || maintenanceStatus === "DUE_SOON"
          );
        }

        return maintenanceStatus === status;
      });

    const typeMatch =
      !filters.type?.length || filters.type.includes(maintenance.type);

    return statusMatch && typeMatch;
  });
}
