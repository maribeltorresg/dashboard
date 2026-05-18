import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";

import { useDashboardStore } from "@/store/dashboard-store";
import { useMaintenanceStore } from "@/domains/maintenance/store/maintenance.store";

import { useMaintenanceKpis } from "@/domains/maintenance/selectors/maintenance.selectors";
import { useMaintenanceKpisByType } from "@/domains/maintenance/selectors/maintenance.selectors";

import { HugeiconsIcon } from "@hugeicons/react";

import {
  Alert02Icon,
  CleanIcon,
  FireExtinguisherIcon,
  Flag02Icon,
  MedicalMaskIcon,
  WindTurbineIcon,
  Tick04Icon,
} from "@hugeicons/core-free-icons";

import { parseExcelFile } from "@/services/excel/parse-excel";
import { useMemo, useState } from "react";
import { selectMaintenancesByStatus } from "@/domains/maintenance/selectors/select-maintenances-by-status";
import { MaintenanceDetailsDialog } from "@/domains/maintenance/components/maintenance-details-dialog";
import { Separator } from "@/components/ui/separator";
import type { MaintenanceKpi } from "@/domains/maintenance/services/compute-maintenance-kpis";
import { cn } from "@/lib/utils";
import { ComplianceByAgencyChart } from "@/components/dashboard/charts/compliance-chart";

const Section = ({
  icon,
  title,
  kpis,
  onDrilldown,
}: {
  icon: any;
  title: string;
  kpis: MaintenanceKpi[];
  onDrilldown: any;
}) => (
  <section className="@container mb-12">
    {title && (
      <div className="gap-2 mb-4 font-semibold flex items-center">
        <HugeiconsIcon icon={icon} strokeWidth={2} className="h-8 w-8" />
        <div>
          <h3 className="text-2xl">{title}</h3>
          <span className="text-sm">
            {kpis
              .filter((item) => item.status !== "compliant")
              .reduce((acc, item) => acc + item.total, 0)}{" "}
            registros
          </span>
        </div>
      </div>
    )}
    {/* <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"> */}
    {/* <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5"> */}
    <div className="grid grid-cols-2 @[960px]:grid-cols-4 gap-5">
      {kpis.map(({ status, total, rate, condition }) => {
        const statusTitle =
          status === "compliant"
            ? "Cumplimiento"
            : status === "healthy"
              ? "Al día"
              : status === "dueSoon"
                ? "Próximos"
                : "Fuera de plazo";
        const accent =
          condition === "ok"
            ? "text-green-400"
            : condition === "alert"
              ? "text-amber-400"
              : "text-red-400";

        return (
          <div
            key={status}
            onClick={() => {
              onDrilldown(
                status === "compliant"
                  ? "COMPLIANT"
                  : status === "healthy"
                    ? "HEALTHY"
                    : status === "dueSoon"
                      ? "DUE_SOON"
                      : "OVERDUE",
              );
            }}
          >
            <KpiCard
              icon={
                <HugeiconsIcon
                  icon={
                    condition === "ok"
                      ? Tick04Icon
                      : condition === "alert"
                        ? Alert02Icon
                        : Flag02Icon
                  }
                  strokeWidth={3}
                  className={accent}
                />
              }
              value={
                <>
                  {Number(rate.toFixed(1))}
                  <span className="text-2xl">%</span>
                </>
              }
              title={statusTitle}
              chart={
                <div className="w-2 h-full bg-slate-500 rounded-full overflow-hidden flex items-end mr-4">
                  <div
                    className={cn(
                      "w-full bg-green-200 rounded-t-full",
                      // condition === "ok"
                      //   ? "bg-green-400"
                      //   : condition === "alert"
                      //     ? "bg-amber-400"
                      //     : "bg-red-400",
                    )}
                    style={{
                      height: `${Number(status === "dueSoon" || status === "overdue" ? 100 - (rate > 0 && rate < 10 ? 10 : rate) : rate)}%`,
                    }}
                  ></div>
                </div>
              }
              subtitle={`${total} registros`}
              badge={condition}
              badgeColor={
                condition === "ok"
                  ? "bg-green-500/10 text-green-400"
                  : condition === "alert"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-red-500/10 text-red-400"
              }
              accent={accent}
              glow={
                condition === "ok"
                  ? "hover:shadow-green-500/10"
                  : condition === "alert"
                    ? "hover:shadow-amber-500/10"
                    : "hover:shadow-red-500/10"
              }
            />
          </div>
        );
      })}
    </div>
  </section>
);

export default function DashboardPage() {
  const { fileName, setFileName } = useDashboardStore();
  const { maintenances, setMaintenances } = useMaintenanceStore();

  const kpis = useMaintenanceKpis();
  const kpisByType = useMaintenanceKpisByType();

  const [popupOpened, setPopupOpened] = useState(false);
  const [drilldown, setDrilldown] = useState<{ title: any; filters: any }>({
    title: "",
    filters: {},
  });

  const filteredMaintenances = useMemo(() => {
    return selectMaintenancesByStatus(maintenances, drilldown.filters);
  }, [maintenances, drilldown]);

  function normalize(value: string): string {
    return value.trim().toUpperCase();
  }
  const stats = useMemo(() => {
    const data = maintenances;
    const agencies = new Set<string>();
    const providers = new Set<string>();

    const unitsByType: Record<string, number> = {};

    for (const item of data) {
      const location = normalize(item.location);
      const provider = normalize(item.provider);
      const type = normalize(item.type);

      if (location) agencies.add(location);
      if (provider) providers.add(provider);

      unitsByType[type] = (unitsByType[type] || 0) + (item.units || 0);
    }

    return {
      agenciesCount: agencies.size,
      providersCount: providers.size,
      unitsByType,
    };
  }, [maintenances]);

  return (
    <div className="px-12 py-8 bg-slate-200">
      <MaintenanceDetailsDialog
        title={drilldown.title ?? ""}
        maintenances={filteredMaintenances}
        open={popupOpened}
        onOpenChange={(open) => {
          if (!open) {
            setPopupOpened(false);
          }
        }}
      />

      {/* <code>{JSON.stringify(maintenances)}</code> */}

      <PageHeader
        title="Plan Anual de Mantenimiento"
        description={`Financiera Confianza${fileName ? ` - ${fileName}` : ""}`}
        actions={
          <>
            <label>
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const maintenances = await parseExcelFile(file);
                  setFileName(file.name);
                  setMaintenances(maintenances);
                }}
              />
              <Button variant="destructive" className="px-6 py-4" asChild>
                <span>Cargar Datos</span>
              </Button>
            </label>

            {/* <Button className="px-6 py-4">Generar PDF</Button> */}
          </>
        }
      />

      <div className="flex gap-3 mb-8">
        <div className="rounded-lg bg-white py-2 px-4 text-center flex-1 w-full shrink-0">
          <div className="text-xl">{stats.unitsByType.AA}</div>
          <div className="text-slate-400 text-sm">Aires Acondicionados</div>
        </div>
        <div className="rounded-lg bg-white py-2 px-4 text-center flex-1 w-full shrink-0">
          <div className="text-xl">{stats.unitsByType.EXTINTORES}</div>
          <div className="text-slate-400 text-sm">Extintores</div>
        </div>
        <div className="rounded-lg bg-white py-2 px-4 text-center flex-1 w-full shrink-0">
          <div className="text-xl">{stats.unitsByType.TANQUES}</div>
          <div className="text-slate-400 text-sm">Tanques</div>
        </div>
      </div>

      <div className="mb-8">
        <ComplianceByAgencyChart maintenances={maintenances} />
      </div>

      <div className="flex gap-5">
        <div className="font-semibold flex flex-col gap-4 w-1/2">
          {/* stats */}
          {/* <div className="flex gap-3">
            <div className="rounded-lg bg-white py-2 px-4 text-center flex-1 w-full shrink-0">
              <div className="text-xl">{stats.unitsByType.AA}</div>
              <div className="text-slate-400">Aires</div>
            </div>
            <div className="rounded-lg bg-white py-2 px-4 text-center flex-1 w-full shrink-0">
              <div className="text-xl">{stats.unitsByType.EXTINTORES}</div>
              <div className="text-slate-400">Extintores</div>
            </div>
            <div className="rounded-lg bg-white py-2 px-4 text-center flex-1 w-full shrink-0">
              <div className="text-xl">{stats.unitsByType.TANQUES}</div>
              <div className="text-slate-400">Tanques</div>
            </div>
          </div> */}
          {/* DONA */}
          <div className="h-full flex flex-col items-center justify-center">
            <h3 className="text-2xl mb-6">Por estado</h3>
            <div className="relative w-60 h-60">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `conic-gradient(#22c55e 0% ${kpis[1].rate}%, #f59e0b 0% ${kpis[1].rate + kpis[2].rate}%, #ef4444 0% ${kpis[1].rate + kpis[2].rate + kpis[3].rate}%)`,
                }}
              ></div>
              <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center shadow-inner">
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-800">
                    {kpis[1].total + kpis[2].total + kpis[3].total}
                  </div>
                  <div className="text-slate-500 mt-1">Servicios totales</div>
                </div>
              </div>
            </div>
            <div className="py-4">
              <div className="flex gap-1 items-center">
                <div className="h-4 w-4 rounded-full bg-green-400"></div>
                Al día
                <span className="text-slate-500 text-xs mt-1">
                  ({kpis[1].total})
                </span>
              </div>
              <div className="flex gap-1 items-center">
                <div className="h-4 w-4 rounded-full bg-amber-400"></div>
                {/* Por vencer */}
                Próximos
                <span className="text-slate-500 text-xs mt-1">
                  ({kpis[2].total})
                </span>
              </div>
              <div className="flex gap-1 items-center">
                <div className="h-4 w-4 rounded-full bg-red-400"></div>
                {/* Vencidos */}
                Fuera de plazo
                <span className="text-slate-500 text-xs mt-1">
                  ({kpis[3].total})
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <Section
            icon=""
            title=""
            kpis={kpis}
            onDrilldown={(status: string) => {
              setPopupOpened(true);
              setDrilldown({
                title: (
                  <>
                    {/* Todo
                <span className="text-sm ml-1">
                  (
                  {status === "COMPLIANT"
                    ? "Cumplimiento"
                    : status === "HEALTHY"
                      ? "Al día"
                      : status === "DUE_SOON"
                        ? "Próximos"
                        : "Fuera de plazo"}
                  )
                </span> */}
                  </>
                ),
                filters: {
                  status: [status],
                },
              });
            }}
          />
        </div>
      </div>

      <Separator decorative className="bg-slate-400/50" />
      <br />
      <br />

      <Section
        icon={WindTurbineIcon}
        title="Aires Acondicionados"
        kpis={kpisByType.AA}
        onDrilldown={(status: string) => {
          setPopupOpened(true);
          setDrilldown({
            title: "Aires Acondicionados",
            filters: {
              type: ["AA"],
              status: [status],
            },
          });
        }}
      />
      <br />
      <Section
        icon={FireExtinguisherIcon}
        title="Recarga de Extintores"
        kpis={kpisByType.EXTINTORES}
        onDrilldown={(status: string) => {
          setPopupOpened(true);
          setDrilldown({
            title: "Recarga de Extintores",
            filters: {
              type: ["EXTINTORES"],
              status: [status],
            },
          });
        }}
      />
      <br />
      <Section
        icon={MedicalMaskIcon}
        title="Desinfección, Desinsectación y Desratización (DDD)"
        kpis={kpisByType.DDD}
        onDrilldown={(status: string) => {
          setPopupOpened(true);
          setDrilldown({
            title: "Desinfección, Desinsectación y Desratización (DDD)",
            filters: {
              type: ["DDD"],
              status: [status],
            },
          });
        }}
      />
      <br />
      <Section
        icon={CleanIcon}
        title="Limpieza de Tanques"
        kpis={kpisByType.TANQUES}
        onDrilldown={(status: string) => {
          setPopupOpened(true);
          setDrilldown({
            title: "Limp. Tanq. Elevado",
            filters: {
              type: ["TANQUES"],
              status: [status],
            },
          });
        }}
      />
    </div>
  );
}
