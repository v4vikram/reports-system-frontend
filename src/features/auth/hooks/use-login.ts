"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, type LoginInput } from "../api/auth.api";
import { useAuthStore } from "../store/auth-store";
import { AUTH_ME_QUERY_KEY } from "./use-current-user";

export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: ({ user }) => {
      setUser(user);
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, user);
    },
  });
}
