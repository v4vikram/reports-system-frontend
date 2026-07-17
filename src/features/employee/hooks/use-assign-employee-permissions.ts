"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../api/employee.api";
import { EMPLOYEES_QUERY_KEY } from "./use-employees";

export function useAssignEmployeePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permissionIds }: { id: string; permissionIds: string[] }) =>
      employeeApi.assignPermissions(id, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
    },
  });
}
