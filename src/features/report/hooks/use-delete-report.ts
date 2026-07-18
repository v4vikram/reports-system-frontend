"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportApi } from "../api/report.api";

export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reportApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
