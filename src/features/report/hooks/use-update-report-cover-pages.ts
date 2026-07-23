"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportApi } from "../api/report.api";
import type { CoverPage } from "../types";

export function useUpdateReportCoverPages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, coverPages }: { id: string; coverPages: CoverPage[] }) =>
      reportApi.updateCoverPages(id, coverPages),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
