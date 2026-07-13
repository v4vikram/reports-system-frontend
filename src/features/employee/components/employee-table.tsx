"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuthStore } from "@/features/auth";
import { PERMISSIONS } from "../constants";
import { useUpdateEmployee } from "../hooks/use-update-employee";
import type { Employee } from "../types";
import { AssignPermissionsDialog } from "./assign-permissions-dialog";
import { AssignRolesDialog } from "./assign-roles-dialog";
import { DeleteEmployeeDialog } from "./delete-employee-dialog";

export function EmployeeTable({ employees }: { employees: Employee[] }) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const canUpdate = useAuthStore((state) => state.hasPermission(PERMISSIONS.USERS_UPDATE));
  const canDelete = useAuthStore((state) => state.hasPermission(PERMISSIONS.USERS_DELETE));
  const updateEmployee = useUpdateEmployee();
  const [rolesTarget, setRolesTarget] = useState<Employee | null>(null);
  const [permissionsTarget, setPermissionsTarget] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Direct permissions</TableHead>
            <TableHead>Status</TableHead>
            {(canUpdate || canDelete) && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => {
            const isSelf = employee.id === currentUserId;
            return (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell className="text-muted-foreground">{employee.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {employee.roles.length === 0 ? (
                      <span className="text-xs text-muted-foreground">No roles</span>
                    ) : (
                      employee.roles.map((role) => (
                        <Badge key={role.id} variant="secondary">
                          {role.name}
                        </Badge>
                      ))
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {employee.directPermissions.length === 0 ? (
                      <span className="text-xs text-muted-foreground">None</span>
                    ) : (
                      employee.directPermissions.map((key) => (
                        <Badge key={key} variant="outline" className="font-mono">
                          {key}
                        </Badge>
                      ))
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={employee.isActive ? "default" : "destructive"}>
                    {employee.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                {(canUpdate || canDelete) && (
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      {canUpdate && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isSelf}
                            title={isSelf ? "You can't manage your own roles" : undefined}
                            onClick={() => setRolesTarget(employee)}
                          >
                            Roles
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isSelf}
                            title={isSelf ? "You can't manage your own permissions" : undefined}
                            onClick={() => setPermissionsTarget(employee)}
                          >
                            Permissions
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isSelf || updateEmployee.isPending}
                            title={isSelf ? "You can't deactivate your own account" : undefined}
                            onClick={() =>
                              updateEmployee.mutate({
                                id: employee.id,
                                isActive: !employee.isActive,
                              })
                            }
                          >
                            {employee.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </>
                      )}
                      {canDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isSelf}
                          title={isSelf ? "You can't delete your own account" : undefined}
                          onClick={() => setDeleteTarget(employee)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <AssignRolesDialog
        open={!!rolesTarget}
        onOpenChange={(open) => !open && setRolesTarget(null)}
        employee={rolesTarget}
      />
      <AssignPermissionsDialog
        open={!!permissionsTarget}
        onOpenChange={(open) => !open && setPermissionsTarget(null)}
        employee={permissionsTarget}
      />
      <DeleteEmployeeDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        employee={deleteTarget}
      />
    </>
  );
}
