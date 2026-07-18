"use client";

import { useQuery } from "@tanstack/react-query";
import { eventApi } from "../api/event.api";

export function eventsQueryKey(clientId?: string) {
  return ["events", { clientId: clientId ?? null }] as const;
}

// clientId omitted fetches events across every client the actor can see
// (the flat /dashboard/events page).
export function useEvents(clientId?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: eventsQueryKey(clientId),
    queryFn: () => eventApi.list(clientId),
    enabled: options?.enabled,
  });
}
