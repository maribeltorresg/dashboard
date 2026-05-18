export type ServiceType = "AA" | "EXTINTORES" | "DDD" | "TANQUES";

export interface MaintenanceRecord {
  id: string;
  type: ServiceType;
  status: string;
  location: string;
  provider: string;
  performedAt?: Date;
  dueAt?: Date;
  notes: string;
}
