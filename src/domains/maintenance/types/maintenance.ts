export type MaintenanceType = "AA" | "EXTINTORES" | "DDD" | "TANQUES";

export interface Maintenance {
  id: string;
  type: MaintenanceType;
  location: string;
  units: number;
  provider: string;
  performedAt?: Date;
  dueAt?: Date;
  notes?: string;
}
