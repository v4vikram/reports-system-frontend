"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../api/employee.api";
import { EMPLOYEES_QUERY_KEY } from "./use-employees";

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
    },
  });
}
