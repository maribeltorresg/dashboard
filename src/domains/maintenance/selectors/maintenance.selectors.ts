import { useMemo } from "react";
import { useMaintenanceStore } from "../store/maintenance.store";

import {
  computeMaintenanceKpis,
  computeMaintenanceKpisByType,
} from "../services/compute-maintenance-kpis";

export function useMaintenanceKpis() {
  const maintenances = useMaintenanceStore((state) => state.maintenances);

  return useMemo(() => {
    return computeMaintenanceKpis(maintenances);
  }, [maintenances]);
}

export function useMaintenanceKpisByType() {
  const maintenances = useMaintenanceStore((state) => state.maintenances);

  return useMemo(() => {
    return computeMaintenanceKpisByType(maintenances);
  }, [maintenances]);
}
