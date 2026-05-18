import * as XLSX from "xlsx";
import { SHEET_NAMES } from "./constants";

import { parseDynamicSheet } from "./parse-sheet";
import type { Maintenance } from "@/domains/maintenance/types/maintenance";

import { mapAARow } from "./sheet-mappers/aa.mapper";
import { mapExtintoresRow } from "./sheet-mappers/extintores.mapper";
import { mapDddRow } from "./sheet-mappers/ddd.mapper";
import { mapTanquesRow } from "./sheet-mappers/tanques.mapper";

export async function parseExcelFile(file: File): Promise<Maintenance[]> {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
    cellDates: true, // probando
  });

  const aaSheet = workbook.Sheets[SHEET_NAMES.AA];
  const extintoresSheet = workbook.Sheets[SHEET_NAMES.EXTINTORES];
  const dddSheet = workbook.Sheets[SHEET_NAMES.DDD];
  const tanquesSheet = workbook.Sheets[SHEET_NAMES.TANQUES];

  const aa = parseDynamicSheet(aaSheet, ["ITEM", "TIPO", "AGENCIAS"]);
  const extintores = parseDynamicSheet(extintoresSheet, [
    "ITEM",
    "TIPO",
    "AGENCIA",
  ]); // , "ESTADO"
  const ddd = parseDynamicSheet(dddSheet, [
    "ITEM",
    "TIPO",
    "FUMIGACION, DESINFECCION  Y DESRATIZACION",
  ]);
  const tanques = parseDynamicSheet(tanquesSheet, [
    "ITEM",
    "TIPO",
    "LIMPIEZAS TANQUE ELEVADO",
  ]);

  // console.table(aa[0]);
  // console.table(aa.map(mapAARow));

  return [
    ...aa.map(mapAARow),
    ...extintores.map(mapExtintoresRow),
    ...ddd.map(mapDddRow),
    ...tanques.map(mapTanquesRow),
  ];
}
