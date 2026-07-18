"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "../api/event.api";

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
