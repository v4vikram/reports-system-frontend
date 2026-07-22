"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sectionApi } from "../api/section.api";
import type { SectionFormValues } from "../validation";
import { sectionsQueryKey } from "./use-sections";

export function useCreateSection(reportId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SectionFormValues & { order?: number }) => sectionApi.create(reportId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectionsQueryKey(reportId) });
    },
  });
}
