"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHasPermission } from "@/features/auth";
import { ClientForm, PERMISSIONS as CLIENT_PERMISSIONS } from "@/features/client";
import { EmployeeCreateForm, PERMISSIONS as EMPLOYEE_PERMISSIONS } from "@/features/employee";

type UserType = "employee" | "client";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// One form to create any kind of user: pick the type, and the fields +
// access controls for that type render below. Employees are real accounts
// with roles/permissions; clients are contact records (no login).
export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const hasPermission = useHasPermission();
  const canCreateEmployee = hasPermission(EMPLOYEE_PERMISSIONS.USERS_CREATE);
  const canCreateClient = hasPermission(CLIENT_PERMISSIONS.CLIENTS_CREATE);

  const [type, setType] = useState<UserType>(canCreateEmployee ? "employee" : "client");

  const close = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[95vw] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>
            Choose what kind of user to create. Employees get an account with roles and
            permissions; clients are contact records.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Type selector only matters when the admin can create both kinds. */}
          {canCreateEmployee && canCreateClient && (
            <div className="grid gap-2">
              <Label>User type</Label>
              <Select value={type} onValueChange={(value) => setType(value as UserType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee — account with roles &amp; access</SelectItem>
                  <SelectItem value="client">Client — contact record</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Keyed on type so switching kinds gives a fresh form. */}
          {type === "employee" && canCreateEmployee ? (
            <EmployeeCreateForm key="employee" onSuccess={close} />
          ) : (
            <ClientForm key="client" onOpenChange={onOpenChange} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
