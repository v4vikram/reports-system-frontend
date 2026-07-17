"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../api/employee.api";
import { EMPLOYEES_QUERY_KEY } from "./use-employees";

export function useAssignEmployeeRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roleIds }: { id: string; roleIds: string[] }) =>
      employeeApi.assignRoles(id, roleIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
    },
  });
}
