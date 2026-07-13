"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, type RegisterInput } from "../api/auth.api";
import { useAuthStore } from "../store/auth-store";
import { AUTH_ME_QUERY_KEY } from "./use-current-user";

export function useRegister() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: ({ user }) => {
      setUser(user);
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, user);
    },
  });
}
