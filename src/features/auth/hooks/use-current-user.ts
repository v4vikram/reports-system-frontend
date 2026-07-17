"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth-store";

export const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const setStatus = useAuthStore((state) => state.setStatus);

  const query = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: authApi.getMe,
    retry: false,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data);
    } else if (query.isError) {
      setUser(null);
    } else if (query.isPending) {
      setStatus("loading");
    }
  }, [query.isSuccess, query.isError, query.isPending, query.data, setUser, setStatus]);

  return query;
}
