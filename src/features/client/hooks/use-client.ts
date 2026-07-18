"use client";

import { useQuery } from "@tanstack/react-query";
import { clientApi } from "../api/client.api";

export function useClient(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => clientApi.getById(id),
    enabled: options?.enabled ?? !!id,
  });
}
