"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "../api/event.api";
import { eventsQueryKey } from "./use-events";
import type { EventFormValues } from "../validation";

export function useUpdateEvent(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<EventFormValues> & { isActive?: boolean } }) =>
      eventApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsQueryKey(clientId) });
    },
  });
}
