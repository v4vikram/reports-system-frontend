"use client";

import type { ReactNode } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "../store/auth-store";

interface PermissionGateProps {
  /** Heading shown on both the loading skeleton and the "no permission" card. */
  title: string;
  /** Whether the current user may view this page — compute with useHasPermission. */
  canView: boolean;
  children: ReactNode;
}

// Shared shell for every permission-gated dashboard page: a loading skeleton
// while auth is still resolving (avoids a false "you don't have permission"
// flash on refresh, before /me has responded), then either the real content
// or a permission-denied card. This used to be copy-pasted per page — some
// pages checked the loading state, some didn't, which meant the ones that
// skipped it could flash the denied card for a moment on every hard refresh.
export function PermissionGate({ title, canView, children }: PermissionGateProps) {
  const status = useAuthStore((state) => state.status);
  const authResolved = status === "authenticated" || status === "unauthenticated";

  if (!authResolved) {
    return (
      <div className="grid gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!canView) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>You don&apos;t have permission to view this page.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return <>{children}</>;
}
