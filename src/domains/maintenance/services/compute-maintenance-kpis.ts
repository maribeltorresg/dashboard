import type { Maintenance, MaintenanceType } from "../types/maintenance";
import { computeMaintenanceStatus } from "./compute-maintenance-status";

// export interface MaintenanceKpis {
//   total: number;
//   healthy: number;
//   dueSoon: number;
//   overdue: number;
//   complianceRate: number;
// }

// export interface MaintenanceKpi {
//   status: string;
//   total: number;
//   rate: number;
//   condition: string;
// }

// export interface MaintenanceKpis {
//   byStatus: MaintenanceKpi[];
//   total: number;
// }

// export function emptyKpis(): MaintenanceKpis {
//   return {
//     byStatus: [
//       {
//         status: "compliant",
//         total: 0,
//         rate: 0,
//         condition: "critical",
//       },
//       {
//         status: "healthy",
//         total: 0,
//         rate: 0,
//         condition: "critical",
//       },
//       {
//         status: "dueSoon",
//         total: 0,
//         rate: 0,
//         condition: "critical",
//       },
//       {
//         status: "overdue",
//         total: 0,
//         rate: 0,
//         condition: "critical",
//       },
//     ],
//     total: 0,
//   };
// }

// kpis.complianceRate =
//   kpis.total === 0
//     ? 0
//     : Number((((kpis.healthy + kpis.dueSoon) / kpis.total) * 100).toFixed(0));

export type MaintenanceKpiCondition = "ok" | "alert" | "critical";

export interface MaintenanceKpi {
  status: string;
  total: number;
  rate: number;
  condition: string; // MaintenanceKpiCondition;
}

export const emptyKpi = (): MaintenanceKpi => ({
  status: "",
  total: 0,
  rate: 0,
  condition: "",
});

export function computeMaintenanceKpis(
  maintenances: Maintenance[],
): MaintenanceKpi[] {
  const kpis = [];
  const maintenancesTotal = maintenances.length;

  let compliantTotal = 0;
  let healthyTotal = 0;
  let dueSoonTotal = 0;
  let overdueTotal = 0;

  for (const maintenance of maintenances) {
    const status = computeMaintenanceStatus(maintenance);
    if (status === "HEALTHY") {
      healthyTotal++;
    }
    if (status === "DUE_SOON") {
      dueSoonTotal++;
    }
    if (status === "OVERDUE") {
      overdueTotal++;
    }
  }

  compliantTotal = healthyTotal + dueSoonTotal;

  const compliantRate =
    maintenancesTotal === 0
      ? 0
      : Number(((compliantTotal / maintenancesTotal) * 100).toFixed(2));
  const healthyRate =
    maintenancesTotal === 0
      ? 0
      : Number(((healthyTotal / maintenancesTotal) * 100).toFixed(2));
  const dueSoonRate =
    maintenancesTotal === 0
      ? 0
      : Number(((dueSoonTotal / maintenancesTotal) * 100).toFixed(2));
  const overdueRate =
    maintenancesTotal === 0
      ? 0
      : Number(((overdueTotal / maintenancesTotal) * 100).toFixed(2));

  kpis.push({
    status: "compliant",
    total: compliantTotal,
    rate: compliantRate,
    condition:
      compliantRate >= 95 ? "ok" : compliantRate >= 85 ? "alert" : "critical",
  });
  kpis.push({
    status: "healthy",
    total: healthyTotal,
    rate: healthyRate,
    condition:
      healthyRate >= 95 ? "ok" : healthyRate >= 85 ? "alert" : "critical",
  });
  kpis.push({
    status: "dueSoon",
    total: dueSoonTotal,
    rate: dueSoonRate,
    condition:
      dueSoonRate === 0 ? "ok" : dueSoonRate <= 25 ? "alert" : "critical",
  });
  kpis.push({
    status: "overdue",
    total: overdueTotal,
    rate: overdueRate,
    condition:
      // overdueRate === 0 ? "ok" : overdueRate <= 15 ? "alert" : "critical",
      overdueRate === 0 ? "ok" : "critical",
  });

  return kpis;
}

// export function computeMaintenanceKpis(
//   maintenances: Maintenance[],
// ): MaintenanceKpis {
//   const kpis = emptyKpis();

//   kpis.total = maintenances.length;

//   for (const maintenance of maintenances) {
//     const status = computeMaintenanceStatus(maintenance);

//     if (status === "HEALTHY") {
//       kpis.healthy++;
//     }

//     if (status === "DUE_SOON") {
//       kpis.dueSoon++;
//     }

//     if (status === "OVERDUE") {
//       kpis.overdue++;
//     }
//   }

//   kpis.complianceRate =
//     kpis.total === 0
//       ? 0
//       : Number((((kpis.healthy + kpis.dueSoon) / kpis.total) * 100).toFixed(0));

//   return kpis;
// }

export function computeMaintenanceKpisByType(maintenances: Maintenance[]) {
  const grouped: Record<MaintenanceType, Maintenance[]> = {
    AA: [],
    EXTINTORES: [],
    DDD: [],
    TANQUES: [],
  };

  for (const maintenance of maintenances) {
    grouped[maintenance.type].push(maintenance);
  }

  return {
    AA: computeMaintenanceKpis(grouped.AA),
    EXTINTORES: computeMaintenanceKpis(grouped.EXTINTORES),
    DDD: computeMaintenanceKpis(grouped.DDD),
    TANQUES: computeMaintenanceKpis(grouped.TANQUES),
  };
}
