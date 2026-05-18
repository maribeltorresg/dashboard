import { create } from "zustand";
import type { Maintenance } from "../types/maintenance";

interface MaintenanceStore {
  maintenances: Maintenance[];
  setMaintenances: (maintenances: Maintenance[]) => void;
}

export const useMaintenanceStore = create<MaintenanceStore>((set) => ({
  maintenances: [],
  setMaintenances: (maintenances) =>
    set({
      maintenances,
    }),
}));
