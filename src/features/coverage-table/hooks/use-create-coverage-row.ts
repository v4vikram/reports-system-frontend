"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { coverageRowApi } from "../api/coverage-row.api";
import type { CoverageRowFormValues } from "../validation";

export function useCreateCoverageRow(coverageTableId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CoverageRowFormValues) => coverageRowApi.create(coverageTableId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coverage-tables"] });
    },
  });
}
