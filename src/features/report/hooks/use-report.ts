"use client";

import { useQuery } from "@tanstack/react-query";
import { reportApi } from "../api/report.api";

export function useReport(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: () => reportApi.getById(id),
    enabled: options?.enabled ?? !!id,
  });
}
