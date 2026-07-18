"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "../api/event.api";
import { eventsQueryKey } from "./use-events";

export function useDeleteEvent(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsQueryKey(clientId) });
    },
  });
}
