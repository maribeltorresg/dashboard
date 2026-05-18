import { useState } from "react";

import { parseExcelFile } from "@/services/excel/parse-excel";

export function useExcelUpload() {
  const [loading, setLoading] = useState(false);

  async function process(file: File) {
    setLoading(true);

    try {
      return await parseExcelFile(file);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    process,
  };
}
