"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi, type CreateRoleInput } from "../api/employee.api";
import { ROLES_QUERY_KEY } from "./use-roles";

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRoleInput) => employeeApi.createRole(input),
    onSuccess: () => {
      // Refresh the roles list so the new role appears in every role picker.
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    },
  });
}
