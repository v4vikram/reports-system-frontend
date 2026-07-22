"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sectionApi } from "../api/section.api";

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sectionApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
}
