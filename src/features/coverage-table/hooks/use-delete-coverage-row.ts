"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { coverageRowApi } from "../api/coverage-row.api";

export function useDeleteCoverageRow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => coverageRowApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coverage-tables"] });
    },
  });
}
