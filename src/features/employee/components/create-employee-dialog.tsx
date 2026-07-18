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
import { useCreateEmployee } from "../hooks/use-create-employee";
import { usePermissions } from "../hooks/use-permissions";
import { useRoles } from "../hooks/use-roles";
import { PermissionPicker } from "./permission-picker";

const createEmployeeSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>;

function useToggleSet() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const toggle = (id: string, checked: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  return { selected, toggle, reset: () => setSelected(new Set()) };
}

// Reusable form body for creating an employee (a user account with roles +
// direct permissions). Used both by the standalone dialog and the unified
// "Create user" dialog.
export function EmployeeCreateForm({ onSuccess }: { onSuccess: () => void }) {
  const createEmployee = useCreateEmployee();
  const { data: roles } = useRoles();
  const { data: permissions } = usePermissions({ enabled: true });

  const roleSel = useToggleSet();
  const [permKeys, setPermKeys] = useState<Set<string>>(() => new Set());

  const form = useForm<CreateEmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  function onSubmit(values: CreateEmployeeFormValues) {
    const permissionIds = (permissions ?? [])
      .filter((permission) => permKeys.has(permission.key))
      .map((permission) => permission.id);
    createEmployee.mutate(
      { ...values, roleIds: [...roleSel.selected], permissionIds },
      { onSuccess }
    );
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-2">
          <span className="text-sm font-medium">Roles</span>
          <div className="grid gap-2 rounded-md border p-3">
            {roles?.map((role) => (
              <label key={role.id} className="flex items-start gap-2">
                <Checkbox
                  checked={roleSel.selected.has(role.id)}
                  onCheckedChange={(checked) => roleSel.toggle(role.id, checked === true)}
                />
                <span className="grid gap-0.5">
                  <span className="text-sm font-medium">{role.name}</span>
                  {role.description && (
                    <span className="text-xs text-muted-foreground">{role.description}</span>
                  )}
                </span>
              </label>
            ))}
            {roles?.length === 0 && (
              <p className="text-sm text-muted-foreground">No roles exist yet.</p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-medium">Direct permissions</span>
          <p className="text-xs text-muted-foreground">
            Extra grants on top of whatever the selected roles already include. Use each group&apos;s
            &ldquo;All&rdquo; box to grant a whole module at once.
          </p>
          <PermissionPicker permissions={permissions} selectedKeys={permKeys} onChange={setPermKeys} />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={createEmployee.isPending}>
            {createEmployee.isPending ? "Creating…" : "Create employee"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

interface CreateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEmployeeDialog({ open, onOpenChange }: CreateEmployeeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[95vw] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>New employee</DialogTitle>
          <DialogDescription>
            Create an account and grant access now — you can change roles and permissions later.
            Share the password out of band; there&apos;s no invite email for admin-created accounts.
          </DialogDescription>
        </DialogHeader>
        {/* Remount per open so the form resets between uses. */}
        {open && <EmployeeCreateForm onSuccess={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}
