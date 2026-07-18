"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useHasPermission } from "@/features/auth";
import { USER_VIEW_PERMISSIONS, useEmployees } from "@/features/employee";
import { PERMISSIONS } from "../constants";
import type { Client } from "../types";
import { ClientFormDialog } from "./client-form-dialog";
import { DeleteClientDialog } from "./delete-client-dialog";

export function ClientTable({ clients }: { clients: Client[] }) {
  const hasPermission = useHasPermission();
  const canUpdate = hasPermission(PERMISSIONS.CLIENTS_UPDATE);
  const canDelete = hasPermission(PERMISSIONS.CLIENTS_DELETE);
  const canSeeEmployees = USER_VIEW_PERMISSIONS.some((key) => hasPermission(key));
  const { data: employees } = useEmployees({ enabled: canSeeEmployees });

  const [editTarget, setEditTarget] = useState<Client | undefined>(undefined);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);

  function assigneeName(client: Client) {
    if (!client.assignedUserId) return "Unassigned";
    return employees?.find((employee) => employee.id === client.assignedUserId)?.name ?? "—";
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            {canSeeEmployees && <TableHead>Assigned to</TableHead>}
            <TableHead>Status</TableHead>
            {(canUpdate || canDelete) && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <Link href={`/dashboard/clients/${client.id}`} className="font-medium hover:underline">
                  {client.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{client.company ?? "—"}</TableCell>
              <TableCell className="text-muted-foreground">
                {client.email ?? client.phone ?? "—"}
              </TableCell>
              {canSeeEmployees && <TableCell>{assigneeName(client)}</TableCell>}
              <TableCell>
                <Badge variant={client.isActive ? "default" : "destructive"}>
                  {client.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              {(canUpdate || canDelete) && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {canUpdate && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditTarget(client);
                          setFormOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    {canDelete && (
                      <Button variant="outline" size="sm" onClick={() => setDeleteTarget(client)}>
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

      <ClientFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditTarget(undefined);
        }}
        client={editTarget}
      />

      <DeleteClientDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        client={deleteTarget}
      />
    </>
  );
}
