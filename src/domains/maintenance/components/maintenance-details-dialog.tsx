import dayjs from "dayjs";

import type { Maintenance } from "../types/maintenance";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { computeMaintenanceStatus } from "../services/compute-maintenance-status";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: any;
  maintenances: Maintenance[];
}

export function MaintenanceDetailsDialog({
  open,
  onOpenChange,
  title,
  maintenances,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3/4! h-3/4 flex flex-col overflow-hidden p-0 bg-slate-200 border-4 border-slate-400">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl text-slate-600">{title}</DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            {maintenances.length}{" "}
            {maintenances.length === 1 ? "registro" : "registros"}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="min-h-0">
          {/* min-w-275 para forzar scroll horizontal */}
          <div>
            <Table className="font-semibold">
              <TableHeader className="sticky top-0 bg-slate-100 z-10 uppercase inset-shadow-2xs">
                <TableRow>
                  <TableHead className="font-bold text-center">Tipo</TableHead>
                  <TableHead className="font-bold text-center">
                    Estado
                  </TableHead>
                  <TableHead className="font-bold">Agencia</TableHead>
                  <TableHead className="font-bold text-center">
                    Unidades
                  </TableHead>
                  <TableHead className="font-bold text-center">
                    Proveedor
                  </TableHead>
                  <TableHead className="font-bold text-center">
                    Ejecución
                  </TableHead>
                  <TableHead className="font-bold text-center">
                    Próx. ejecución
                  </TableHead>
                  <TableHead className="font-bold">Certificado</TableHead>
                  <TableHead className="font-bold">Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenances.map((maintenance) => {
                  const status = computeMaintenanceStatus(maintenance);

                  return (
                    <TableRow key={maintenance.id}>
                      <TableCell className="whitespace-nowrap text-center">
                        {maintenance.type}
                      </TableCell>

                      <TableCell>
                        <div
                          className={cn(
                            "rounded-full py-1 px-4 uppercase text-xs font-bold ",
                            "tracking-wide text-center",
                            status === "HEALTHY"
                              ? "bg-green-100 text-green-500"
                              : status === "DUE_SOON"
                                ? "bg-amber-100 text-amber-500"
                                : "bg-red-100 text-red-500",
                          )}
                        >
                          {status === "HEALTHY"
                            ? "Al dia"
                            : status === "DUE_SOON"
                              ? "Proximo"
                              : "Fuera de plazo"}
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        {maintenance.location || "-"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-center">
                        {maintenance.units || "-"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-center">
                        {maintenance.provider || "-"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-center">
                        {maintenance.performedAt
                          ? dayjs(maintenance.performedAt).format("DD/MM/YYYY")
                          : "-"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-center">
                        {maintenance.dueAt
                          ? dayjs(maintenance.dueAt).format("DD/MM/YYYY")
                          : "-"}
                      </TableCell>

                      <TableCell className="max-w-75 truncate">
                        <a
                          href="/docs/manual.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Abrir PDF
                        </a>
                      </TableCell>

                      <TableCell className="max-w-75 truncate">
                        {/* {maintenance.notes || <div className="text-center">-</div>} */}
                        {maintenance.notes || "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
