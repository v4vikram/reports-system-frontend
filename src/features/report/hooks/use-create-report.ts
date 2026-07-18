"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportApi } from "../api/report.api";
import type { ReportFormValues } from "../validation";

export function useCreateReport(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReportFormValues) => reportApi.create(eventId, input),
    onSuccess: () => {
      // Partial match invalidates every filtered variant (flat list,
      // event-scoped list, client-scoped list) in one call.
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
