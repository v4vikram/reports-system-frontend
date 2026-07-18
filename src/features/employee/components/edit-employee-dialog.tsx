"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAssignEmployeePermissions } from "../hooks/use-assign-employee-permissions";
import { useAssignEmployeeRoles } from "../hooks/use-assign-employee-roles";
import { usePermissions } from "../hooks/use-permissions";
import { useRoles } from "../hooks/use-roles";
import { useUpdateEmployee } from "../hooks/use-update-employee";
import type { Employee } from "../types";
import { PermissionPicker } from "./permission-picker";

const editSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.email("Invalid email address"),
});

type EditFormValues = z.infer<typeof editSchema>;

interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function EditEmployeeDialog({ open, onOpenChange, employee }: EditEmployeeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[95vw] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>Update details, status, roles, and permissions.</DialogDescription>
        </DialogHeader>
        {/* Keyed on id so a fresh form mounts per target. */}
        {employee && (
          <EditEmployeeForm key={employee.id} employee={employee} onDone={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditEmployeeForm({ employee, onDone }: { employee: Employee; onDone: () => void }) {
  const { data: roles } = useRoles();
  const { data: permissions } = usePermissions({ enabled: true });
  const updateEmployee = useUpdateEmployee();
  const assignRoles = useAssignEmployeeRoles();
  const assignPermissions = useAssignEmployeePermissions();

  const [isActive, setIsActive] = useState(employee.isActive);
  const [roleIds, setRoleIds] = useState<Set<string>>(
    () => new Set(employee.roles.map((role) => role.id))
  );
  // Tracked by permission key (that's what the Employee DTO carries); mapped
  // back to ids on submit using the loaded catalog.
  const [permKeys, setPermKeys] = useState<Set<string>>(() => new Set(employee.directPermissions));

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: employee.name, email: employee.email },
  });

  const isPending =
    updateEmployee.isPending || assignRoles.isPending || assignPermissions.isPending;

  function toggle(setter: typeof setRoleIds, id: string, checked: boolean) {
    setter((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function onSubmit(values: EditFormValues) {
    await updateEmployee.mutateAsync({
      id: employee.id,
      name: values.name,
      email: values.email,
      isActive,
    });
    await assignRoles.mutateAsync({ id: employee.id, roleIds: [...roleIds] });
    const permissionIds = (permissions ?? [])
      .filter((permission) => permKeys.has(permission.key))
      .map((permission) => permission.id);
    await assignPermissions.mutateAsync({ id: employee.id, permissionIds });
    onDone();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <label className="flex items-center gap-2">
          <Checkbox checked={isActive} onCheckedChange={(checked) => setIsActive(checked === true)} />
          <span className="text-sm font-medium">Active</span>
        </label>

        <div className="grid gap-2">
          <span className="text-sm font-medium">Roles</span>
          <div className="grid gap-2 rounded-md border p-3">
            {roles?.map((role) => (
              <label key={role.id} className="flex items-start gap-2">
                <Checkbox
                  checked={roleIds.has(role.id)}
                  onCheckedChange={(checked) => toggle(setRoleIds, role.id, checked === true)}
                />
                <span className="grid gap-0.5">
                  <span className="text-sm font-medium">{role.name}</span>
                  {role.description && (
                    <span className="text-xs text-muted-foreground">{role.description}</span>
                  )}
                </span>
              </label>
            ))}
            {roles?.length === 0 && <p className="text-sm text-muted-foreground">No roles exist yet.</p>}
          </div>
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-medium">Direct permissions</span>
          <PermissionPicker permissions={permissions} selectedKeys={permKeys} onChange={setPermKeys} />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
