import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardStore } from "@/store/dashboard-store";
import { parseExcelFile } from "@/services/excel/parse-excel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMaintenanceStore } from "@/domains/maintenance/store/maintenance.store";

export default function UploadPage() {
  const navigate = useNavigate();
  const setFileName = useDashboardStore((state) => state.setFileName);
  const setMaintenances = useMaintenanceStore((state) => state.setMaintenances);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const rows = await parseExcelFile(file);

      // setRows(rows);
      setFileName(file.name);
      setMaintenances(rows);

      navigate("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Card className="w-112.5 p-8 bg-slate-900 border-slate-800">
        <div className="space-y-6 text-center">
          <div>
            <h1 className="text-3xl font-bold text-white">PAM Dashboard</h1>

            <p className="text-slate-400 mt-2">Carga tu archivo Excel</p>
          </div>

          <label>
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFile}
            />

            <Button
              className="w-full cursor-pointer"
              disabled={loading}
              asChild
            >
              <span>{loading ? "Procesando..." : "Abrir archivo Excel"}</span>
            </Button>
          </label>
        </div>
      </Card>
    </div>
  );
}
