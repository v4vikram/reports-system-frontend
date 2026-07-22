"use client";

import { useQuery } from "@tanstack/react-query";
import { sectionApi } from "../api/section.api";

export function sectionsQueryKey(reportId: string) {
  return ["sections", reportId] as const;
}

export function useSections(reportId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: sectionsQueryKey(reportId),
    queryFn: () => sectionApi.list(reportId),
    enabled: options?.enabled,
  });
}
