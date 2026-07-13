"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientFormDialog, ClientTable, PERMISSIONS, useClients } from "@/features/client";
import { useAuthStore } from "@/features/auth";

export default function ClientsPage() {
  const { data: clients, isLoading } = useClients();
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const canViewAll = hasPermission(PERMISSIONS.CLIENTS_VIEW_ALL);
  const canCreate = hasPermission(PERMISSIONS.CLIENTS_CREATE);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Clients</CardTitle>
          <CardDescription>
            {canViewAll ? "Every client, and who it's assigned to." : "Clients assigned to you."}
          </CardDescription>
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
  );
}
