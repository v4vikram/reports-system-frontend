"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Client } from "@/features/client";
import type { Event } from "../types";

interface AllEventsTableProps {
  events: Event[];
  clients?: Client[];
}

// Flat, cross-client, view-only listing — editing an event stays scoped to
// its own client's page (event-table.tsx), since each row here can belong to
// a different client and there's no single clientId context to hang a
// create/edit dialog off of. "View" drills into the existing per-client
// event detail page, which already has Edit/Delete.
export function AllEventsTable({ events, clients }: AllEventsTableProps) {
  function clientName(event: Event) {
    return clients?.find((client) => client.id === event.clientId)?.name ?? "—";
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>
              <Link
                href={`/dashboard/clients/${event.clientId}/events/${event.id}`}
                className="font-medium hover:underline"
              >
                {event.title}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">{clientName(event)}</TableCell>
            <TableCell className="text-muted-foreground">
              {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "—"}
            </TableCell>
            <TableCell>
              <Badge variant={event.isActive ? "default" : "destructive"}>
                {event.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
