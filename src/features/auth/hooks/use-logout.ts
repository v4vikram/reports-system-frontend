"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth-store";
import { AUTH_ME_QUERY_KEY } from "./use-current-user";

export function useLogout() {
  const queryClient = useQueryClient();
  const reset = useAuthStore((state) => state.reset);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      reset();
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
    },
  });
}
