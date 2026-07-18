"use client";

import { useAuthStore } from "../store/auth-store";

// Subscribe to `user` so the component re-renders when permissions load
// (e.g. after /me resolves on a page refresh). Selecting the store's stable
// `hasPermission` function directly does NOT re-render on user change — its
// reference never changes — which left nav links/gated UI stuck hidden after
// a refresh until some unrelated re-render happened to occur.
export function useHasPermission(): (key: string) => boolean {
  const user = useAuthStore((state) => state.user);
  return (key) => user?.permissions.includes(key) ?? false;
}

export function useHasRole(): (name: string) => boolean {
  const user = useAuthStore((state) => state.user);
  return (name) => user?.roles.some((role) => role.name === name) ?? false;
}
