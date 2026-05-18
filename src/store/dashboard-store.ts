import { create } from "zustand";
import type { MaintenanceRecord } from "@/types/maintenance";

interface DashboardState {
  rows: MaintenanceRecord[];
  fileName: string | null;
  loaded: boolean;

  setRows: (rows: MaintenanceRecord[]) => void;
  setFileName: (name: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  rows: [],
  fileName: null,
  loaded: false,

  setRows: (rows) =>
    set({
      rows,
      loaded: true,
    }),

  setFileName: (name) =>
    set({
      fileName: name,
    }),
}));
