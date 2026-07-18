"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteEventDialog } from "./delete-event-dialog";
import { EventFormDialog } from "./event-form-dialog";
import type { Event } from "../types";

interface EventTableProps {
  clientId: string;
  events: Event[];
  canUpdate: boolean;
  canDelete: boolean;
}

export function EventTable({ clientId, events, canUpdate, canDelete }: EventTableProps) {
  const [editTarget, setEditTarget] = useState<Event | undefined>(undefined);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const canManage = canUpdate || canDelete;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            {canManage && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <Link
                  href={`/dashboard/clients/${clientId}/events/${event.id}`}
                  className="font-medium hover:underline"
                >
                  {event.title}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "—"}
              </TableCell>
              <TableCell>
                <Badge variant={event.isActive ? "default" : "destructive"}>
                  {event.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              {canManage && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {canUpdate && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditTarget(event);
                          setFormOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    {canDelete && (
                      <Button variant="outline" size="sm" onClick={() => setDeleteTarget(event)}>
                        Delete
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EventFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditTarget(undefined);
        }}
        clientId={clientId}
        event={editTarget}
      />

      <DeleteEventDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        clientId={clientId}
        event={deleteTarget}
      />
    </>
  );
}
