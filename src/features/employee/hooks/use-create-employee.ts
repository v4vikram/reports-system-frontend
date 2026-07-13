"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi, type CreateEmployeeInput } from "../api/employee.api";
import { EMPLOYEES_QUERY_KEY } from "./use-employees";

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEmployeeInput) => employeeApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
    },
  });
}
