"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "../api/client.api";
import type { ClientFormValues } from "../validation";
import { CLIENTS_QUERY_KEY } from "./use-clients";

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<ClientFormValues> & { isActive?: boolean };
    }) => clientApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });
}
