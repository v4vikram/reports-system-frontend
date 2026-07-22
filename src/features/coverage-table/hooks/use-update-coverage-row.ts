"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { coverageRowApi } from "../api/coverage-row.api";
import type { CoverageRowFormValues } from "../validation";

export function useUpdateCoverageRow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CoverageRowFormValues> }) =>
      coverageRowApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coverage-tables"] });
    },
  });
}
