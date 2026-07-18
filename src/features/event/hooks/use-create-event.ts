"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "../api/event.api";
import { eventsQueryKey } from "./use-events";
import type { EventFormValues } from "../validation";

export function useCreateEvent(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: EventFormValues) => eventApi.create(clientId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsQueryKey(clientId) });
    },
  });
}
