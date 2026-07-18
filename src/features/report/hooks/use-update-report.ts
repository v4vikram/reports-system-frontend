"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportApi } from "../api/report.api";
import type { ReportFormValues } from "../validation";

export function useUpdateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ReportFormValues> }) =>
      reportApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
