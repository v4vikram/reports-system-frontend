"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { coverageTableApi } from "../api/coverage-table.api";

export function useDeleteCoverageTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => coverageTableApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coverage-tables"] });
    },
  });
}
