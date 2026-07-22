"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { coverageTableApi, type UpdateCoverageTableInput } from "../api/coverage-table.api";

export function useUpdateCoverageTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCoverageTableInput }) =>
      coverageTableApi.update(id, input),
    onSuccess: () => {
      // Partial match invalidates every sectionId-scoped variant in one call.
      queryClient.invalidateQueries({ queryKey: ["coverage-tables"] });
    },
  });
}
