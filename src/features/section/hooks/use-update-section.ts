"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sectionApi } from "../api/section.api";
import type { SectionFormValues } from "../validation";

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<SectionFormValues & { order: number }> }) =>
      sectionApi.update(id, input),
    onSuccess: () => {
      // Partial match invalidates every reportId-scoped variant in one call.
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
}
