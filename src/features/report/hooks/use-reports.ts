"use client";

import { useQuery } from "@tanstack/react-query";
import { reportApi, type ReportsFilter } from "../api/report.api";

export function reportsQueryKey(filter: ReportsFilter) {
  return ["reports", filter] as const;
}

export function useReports(filter: ReportsFilter = {}, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: reportsQueryKey(filter),
    queryFn: () => reportApi.list(filter),
    enabled: options?.enabled,
  });
}
