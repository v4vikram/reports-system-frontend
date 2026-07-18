"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "../api/event.api";
import type { EventFormValues } from "../validation";

export function useCreateEvent(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: EventFormValues) => eventApi.create(clientId, input),
    onSuccess: () => {
      // Partial match invalidates every filtered variant (this client's list,
      // and the flat cross-client list) in one call.
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
