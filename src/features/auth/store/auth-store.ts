import { create } from "zustand";
import type { AuthUser } from "../types";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  setUser: (user: AuthUser | null) => void;
  setStatus: (status: AuthStatus) => void;
  hasPermission: (key: string) => boolean;
  hasRole: (name: string) => boolean;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: "idle",
  setUser: (user) => set({ user, status: user ? "authenticated" : "unauthenticated" }),
  setStatus: (status) => set({ status }),
  hasPermission: (key) => get().user?.permissions.includes(key) ?? false,
  hasRole: (name) => get().user?.roles.some((role) => role.name === name) ?? false,
  reset: () => set({ user: null, status: "unauthenticated" }),
}));
