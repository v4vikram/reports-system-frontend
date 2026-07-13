"use client";

import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "../api/employee.api";

export const ROLES_QUERY_KEY = ["roles"] as const;

export function useRoles() {
  return useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: employeeApi.listRoles,
  });
}
