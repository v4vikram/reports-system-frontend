"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "../api/event.api";
import type { EventFormValues } from "../validation";

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<EventFormValues> & { isActive?: boolean } }) =>
      eventApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
