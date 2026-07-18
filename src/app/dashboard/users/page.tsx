"use client";

import { PlusIcon, ShieldPlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore, useHasPermission } from "@/features/auth";
import {
  type Client,
  ClientFormDialog,
  PERMISSIONS as CLIENT_PERMISSIONS,
  useClients,
} from "@/features/client";
import {
  CreateRoleDialog,
  EditEmployeeDialog,
  type Employee,
  PERMISSIONS as EMPLOYEE_PERMISSIONS,
  USER_VIEW_PERMISSIONS,
  useEmployees,
} from "@/features/employee";
import { CreateUserDialog } from "./create-user-dialog";

type DirectoryType = "Admin" | "Employee" | "Client" | "Other";

interface DirectoryRow {
  key: string;
  kind: "user" | "client";
  id: string;
  name: string;
  email: string | null;
  type: DirectoryType;
  isActive: boolean;
}

const TYPE_BADGE: Record<DirectoryType, "default" | "secondary" | "outline"> = {
  Admin: "default",
  Employee: "secondary",
  Client: "outline",
  Other: "outline",
};

export default function UsersPage() {
  const status = useAuthStore((state) => state.status);
  const hasPermission = useHasPermission();

  const canViewEmployees = USER_VIEW_PERMISSIONS.some((key) => hasPermission(key));
  const canViewClients = hasPermission(CLIENT_PERMISSIONS.CLIENTS_READ);
  const canCreateEmployee = hasPermission(EMPLOYEE_PERMISSIONS.USERS_CREATE);
  const canCreateClient = hasPermission(CLIENT_PERMISSIONS.CLIENTS_CREATE);
  const canUpdateUser = hasPermission(EMPLOYEE_PERMISSIONS.USERS_UPDATE);
  const canUpdateClient = hasPermission(CLIENT_PERMISSIONS.CLIENTS_UPDATE);
  const canCreateAny = canCreateEmployee || canCreateClient;
  const canEditAny = canUpdateUser || canUpdateClient;
  const authResolved = status === "authenticated" || status === "unauthenticated";

  const { data: employees, isLoading: employeesLoading } = useEmployees({ enabled: canViewEmployees });
  const { data: clients, isLoading: clientsLoading } = useClients({ enabled: canViewClients });

  const [createOpen, setCreateOpen] = useState(false);
  const [createRoleOpen, setCreateRoleOpen] = useState(false);
  const [editUser, setEditUser] = useState<Employee | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);

  // Managing roles is an admin-level action, gated the same as creating users.
  const canManageRoles = canCreateEmployee;

  // One directory of everyone: real user accounts (admins/employees/others)
  // plus clients, unified into a single typed list.
  const rows = useMemo<DirectoryRow[]>(() => {
    const userRows: DirectoryRow[] = (employees ?? []).map((user) => {
      const roleNames = user.roles.map((role) => role.name);
      const type: DirectoryType = roleNames.includes("ADMIN")
        ? "Admin"
        : roleNames.includes("EMPLOYEE")
          ? "Employee"
          : roleNames.includes("CLIENT")
            ? "Client"
            : roleNames.length > 0
              ? "Employee"
              : "Other";
      return {
        key: `user:${user.id}`,
        kind: "user",
        id: user.id,
        name: user.name,
        email: user.email,
        type,
        isActive: user.isActive,
      };
    });

    const clientRows: DirectoryRow[] = (clients ?? []).map((client) => ({
      key: `client:${client.id}`,
      kind: "client",
      id: client.id,
      name: client.name,
      email: client.email,
      type: "Client",
      isActive: client.isActive,
    }));

    return [...userRows, ...clientRows].sort((a, b) => a.name.localeCompare(b.name));
  }, [employees, clients]);

  const isLoading = (canViewEmployees && employeesLoading) || (canViewClients && clientsLoading);

  function canEditRow(row: DirectoryRow) {
    return row.kind === "user" ? canUpdateUser : canUpdateClient;
  }

  function openEdit(row: DirectoryRow) {
    if (row.kind === "user") {
      const target = employees?.find((employee) => employee.id === row.id);
      if (target) setEditUser(target);
    } else {
      const target = clients?.find((client) => client.id === row.id);
      if (target) setEditClient(target);
    }
  }

  if (!authResolved) {
    return (
      <div className="grid gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!canViewEmployees && !canViewClients) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>You don&apos;t have permission to view this page.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Everyone in the system — admins, employees, and clients.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {canManageRoles && (
            <Button size="sm" variant="outline" onClick={() => setCreateRoleOpen(true)}>
              <ShieldPlusIcon /> Create role
            </Button>
          )}
          {canCreateAny && (
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <PlusIcon /> Create user
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                {canEditAny && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.email ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={TYPE_BADGE[row.type]}>{row.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.isActive ? "default" : "destructive"}>
                      {row.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  {canEditAny && (
                    <TableCell className="text-right">
                      {canEditRow(row) && (
                        <Button variant="outline" size="sm" onClick={() => openEdit(row)}>
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {createOpen && <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} />}
      <CreateRoleDialog open={createRoleOpen} onOpenChange={setCreateRoleOpen} />
      <EditEmployeeDialog
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        employee={editUser}
      />
      <ClientFormDialog
        open={!!editClient}
        onOpenChange={(open) => !open && setEditClient(null)}
        client={editClient ?? undefined}
      />
    </Card>
  );
}
