import { computeMaintenanceStatus } from "@/domains/maintenance/services/compute-maintenance-status";
import type { Maintenance } from "@/domains/maintenance/types/maintenance";
import { useMemo, useState } from "react";

// asumes que ya existe
// computeMaintenanceStatus(maintenance) => "HEALTHY" | "DUE_SOON" | "OVERDUE"

export function ComplianceByAgencyChart({
  maintenances,
}: {
  maintenances: Maintenance[];
}) {
  const [tooltip, setTooltip] = useState<any>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  });

  const data = useMemo(() => {
    const map = new Map();

    for (const item of maintenances) {
      const location = item.location;

      const status = computeMaintenanceStatus(item);
      const isCompliant = status === "HEALTHY" || status === "DUE_SOON";

      if (!map.has(location)) {
        map.set(location, {
          location,
          total: 0,
          compliant: 0,
        });
      }

      const entry = map.get(location);
      entry.total += 1;
      entry.compliant += isCompliant ? 1 : 0;
    }

    return Array.from(map.values())
      .map((d) => ({
        ...d,
        rate: d.total === 0 ? 0 : d.compliant / d.total,
      }))
      .sort((a, b) => b.rate - a.rate);
  }, [maintenances]);

  const showTooltip = (e: any, d: any) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top,
      data: d,
    });
  };

  const moveTooltip = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setTooltip((prev: any) => ({
      ...prev,
      x: rect.left + rect.width / 2,
      y: rect.top,
    }));
  };

  const hideTooltip = () => {
    setTooltip((prev: any) => ({ ...prev, visible: false, data: null }));
  };

  return (
    <div className="w-full font-semibold">
      {/* Tooltip global */}
      {tooltip.visible && tooltip.data && (
        <div
          className="fixed z-50 px-3 py-2 rounded-lg bg-gray-900 text-white text-xs shadow-xl pointer-events-none transition-all duration-150"
          style={{
            left: tooltip.x,
            top: tooltip.y - 10,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-semibold mb-1">{tooltip.data.location}</div>
          <div className="text-gray-200">
            {Math.round(tooltip.data.rate * 100)}% cumplimiento
          </div>
          <div className="text-gray-400">
            {tooltip.data.compliant}/{tooltip.data.total} mantenimientos
          </div>
        </div>
      )}

      {/* Header */}
      {/* <h3 className="text-2xl">Cumplimiento por Agencia</h3> */}

      {/* Chart container */}
      <div className="relative">
        <div className="flex overflow-x-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {data.map((d) => {
            const height = Math.max(d.rate * 100, 4);

            return (
              <div
                key={d.location}
                className="flex flex-col items-center justify-end p-0.5"
                onMouseEnter={(e) => showTooltip(e, d)}
                onMouseMove={(e) => moveTooltip(e)}
                onMouseLeave={hideTooltip}
              >
                {/* value label */}
                {/* <div className="text-xs text-slate-400">
                  {Math.round(d.rate * 100)}%
                </div> */}

                {/* bar */}
                <div className="relative w-2 h-30 flex items-end">
                  {/* background bar */}
                  <div className="absolute inset-0 bg-slate-400/20" />

                  {/* filled bar */}
                  <div
                    className="relative w-full rounded-t-full bg-linear-to-t from-green-600 via-green-500 to-green-400 shadow-sm transition-all duration-500"
                    style={{ height: `${height}%` }}
                  />
                </div>

                {/* label */}
                {/* <div className="h-10 p-1 text-xs text-center text-slate-700 leading-tight">
                  <span className="line-clamp-2">{d.location}</span>
                </div> */}

                {/* meta */}
                {/* <div className="text-[10px] text-gray-400 mt-1">
                  {d.compliant}/{d.total}
                </div> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
