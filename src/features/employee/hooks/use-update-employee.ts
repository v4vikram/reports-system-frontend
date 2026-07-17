"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../api/employee.api";
import { EMPLOYEES_QUERY_KEY } from "./use-employees";

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      employeeApi.update(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
    },
  });
}
