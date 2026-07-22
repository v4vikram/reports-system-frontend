"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { coverageTableApi } from "../api/coverage-table.api";
import type { CoverageTableFormValues } from "../validation";

export function useCreateCoverageTable(sectionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CoverageTableFormValues & { order?: number }) =>
      coverageTableApi.create(sectionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coverage-tables", sectionId] });
    },
  });
}
