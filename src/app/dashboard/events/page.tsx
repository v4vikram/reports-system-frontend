"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PermissionGate, useHasPermission } from "@/features/auth";
import { PERMISSIONS as CLIENT_PERMISSIONS, useClients } from "@/features/client";
import { AllEventsTable, useEvents } from "@/features/event";

// Flat, cross-client complement to the Client → Events drill-down — same
// permission as viewing a client, since events have no keys of their own.
export default function EventsPage() {
  const hasPermission = useHasPermission();
  const canView = hasPermission(CLIENT_PERMISSIONS.CLIENTS_READ);

  const { data: events, isLoading } = useEvents(undefined, { enabled: canView });
  const { data: clients } = useClients({ enabled: canView });

  return (
    <PermissionGate title="Events" canView={canView}>
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>
            Every event you can see, across all clients. Open one for its reports, or open a client to
            manage its events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (events?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">No events found.</p>
          ) : (
            <AllEventsTable events={events ?? []} clients={clients} />
          )}
        </CardContent>
      </Card>
    </PermissionGate>
  );
}
