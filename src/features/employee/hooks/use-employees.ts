"use client";

import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "../api/employee.api";

export const EMPLOYEES_QUERY_KEY = ["employees"] as const;

export function useEmployees(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: EMPLOYEES_QUERY_KEY,
    queryFn: employeeApi.list,
    enabled: options?.enabled,
  });
}
