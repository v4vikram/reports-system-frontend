"use client";

import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "../api/employee.api";

export const PERMISSIONS_QUERY_KEY = ["permissions"] as const;

export function usePermissions(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: PERMISSIONS_QUERY_KEY,
    queryFn: employeeApi.listPermissions,
    enabled: options?.enabled,
  });
}
