"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHasPermission } from "@/features/auth";
import { PERMISSIONS as CLIENT_PERMISSIONS, useClient } from "@/features/client";
import { EventFormDialog, EventTable, useEvents } from "@/features/event";

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const hasPermission = useHasPermission();
  const canView = hasPermission(CLIENT_PERMISSIONS.CLIENTS_READ);
  const canCreateEvent = hasPermission(CLIENT_PERMISSIONS.CLIENTS_UPDATE);
  const canUpdateEvent = hasPermission(CLIENT_PERMISSIONS.CLIENTS_UPDATE);
  const canDeleteEvent = hasPermission(CLIENT_PERMISSIONS.CLIENTS_DELETE);

  const { data: client, isLoading: clientLoading, isError } = useClient(id, { enabled: canView });
  const { data: events, isLoading: eventsLoading } = useEvents(id, { enabled: canView && !!client });

  const [createOpen, setCreateOpen] = useState(false);

  if (!canView) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client</CardTitle>
          <CardDescription>You don&apos;t have permission to view this page.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (clientLoading) {
    return (
      <div className="grid gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (isError || !client) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client</CardTitle>
          <CardDescription>This client doesn&apos;t exist, or you don&apos;t have access to it.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/clients">Clients</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{client.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>{client.name}</CardTitle>
          <CardDescription>{client.company ?? client.email ?? client.phone ?? "—"}</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Events</CardTitle>
            <CardDescription>Events for this client, and the reports under each one.</CardDescription>
          </div>
          {canCreateEvent && (
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <PlusIcon /> New event
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <div className="grid gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (events?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">No events found.</p>
          ) : (
            <EventTable
              clientId={id}
              events={events ?? []}
              canUpdate={canUpdateEvent}
              canDelete={canDeleteEvent}
            />
          )}
        </CardContent>
      </Card>

      <EventFormDialog open={createOpen} onOpenChange={setCreateOpen} clientId={id} />
    </div>
  );
}
