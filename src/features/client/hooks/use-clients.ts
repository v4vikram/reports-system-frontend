"use client";

import { useQuery } from "@tanstack/react-query";
import { clientApi } from "../api/client.api";

export const CLIENTS_QUERY_KEY = ["clients"] as const;

export function useClients(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: CLIENTS_QUERY_KEY,
    queryFn: clientApi.list,
    enabled: options?.enabled,
  });
}
