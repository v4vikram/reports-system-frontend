"use client";

import { useCurrentUser } from "../hooks/use-current-user";

export function SessionBootstrap() {
  useCurrentUser();
  return null;
}
