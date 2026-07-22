"use client";

import { useQuery } from "@tanstack/react-query";
import { coverageTableApi } from "../api/coverage-table.api";

export function coverageTablesQueryKey(sectionId: string) {
  return ["coverage-tables", sectionId] as const;
}

export function useCoverageTables(sectionId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: coverageTablesQueryKey(sectionId),
    queryFn: () => coverageTableApi.list(sectionId),
    enabled: options?.enabled,
  });
}
