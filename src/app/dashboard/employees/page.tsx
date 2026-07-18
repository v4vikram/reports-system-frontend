"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore, useHasPermission } from "@/features/auth";
import {
  CreateEmployeeDialog,
  EmployeeTable,
  PERMISSIONS,
  USER_VIEW_PERMISSIONS,
  useEmployees,
} from "@/features/employee";

export default function EmployeesPage() {
  const status = useAuthStore((state) => state.status);
  const hasPermission = useHasPermission();
  const canView = USER_VIEW_PERMISSIONS.some((key) => hasPermission(key));
  const canCreate = hasPermission(PERMISSIONS.USERS_CREATE);
  const authResolved = status === "authenticated" || status === "unauthenticated";

  const { data: employees, isLoading } = useEmployees({ enabled: canView });
  const [createOpen, setCreateOpen] = useState(false);

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
          <CardTitle>Employees</CardTitle>
          <CardDescription>You don&apos;t have permission to view this page.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Employees</CardTitle>
          <CardDescription>Manage staff accounts, roles, and access.</CardDescription>
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <PlusIcon /> New employee
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <EmployeeTable employees={employees ?? []} />
        )}
      </CardContent>

      <CreateEmployeeDialog open={createOpen} onOpenChange={setCreateOpen} />
    </Card>
  );
}
