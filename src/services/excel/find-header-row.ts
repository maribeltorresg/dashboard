export function findHeaderRow(rows: any[][], header_candidates: string[]) {
  return rows.findIndex((row) => {
    const normalized = row.map((cell) => String(cell).trim().toUpperCase());

    return header_candidates.every((candidate) =>
      normalized.includes(candidate),
    );
  });
}

// export function findHeaderRow(rows: any[][]) {
//   return rows.findIndex((row) =>
//     row.some(
//       (cell: string) =>
//         typeof cell === "string" && cell.toUpperCase().includes("AGENCIA"),
//     ),
//   );
// }
