"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientFormDialog, ClientTable, PERMISSIONS, useClients } from "@/features/client";
import { PermissionGate, useHasPermission } from "@/features/auth";

export default function ClientsPage() {
  const hasPermission = useHasPermission();
  const canView = hasPermission(PERMISSIONS.CLIENTS_READ);
  const canCreate = hasPermission(PERMISSIONS.CLIENTS_CREATE);
  const { data: clients, isLoading } = useClients({ enabled: canView });
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <PermissionGate title="Clients" canView={canView}>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Clients</CardTitle>
            <CardDescription>Every client, and who it&apos;s assigned to.</CardDescription>
          </div>
          {canCreate && (
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <PlusIcon /> New client
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
          ) : (clients?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">No clients yet.</p>
          ) : (
            <ClientTable clients={clients ?? []} />
          )}
        </CardContent>

        <ClientFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      </Card>
    </PermissionGate>
  );
}
