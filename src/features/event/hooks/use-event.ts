"use client";

import { useQuery } from "@tanstack/react-query";
import { eventApi } from "../api/event.api";

export function useEvent(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => eventApi.getById(id),
    enabled: options?.enabled ?? !!id,
  });
}
