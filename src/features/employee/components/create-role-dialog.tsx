"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateRole } from "../hooks/use-create-role";
import { usePermissions } from "../hooks/use-permissions";
import { PermissionPicker } from "./permission-picker";

const createRoleSchema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  description: z.string().max(255).optional(),
});

type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRoleDialog({ open, onOpenChange }: CreateRoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[95vw] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>New role</DialogTitle>
          <DialogDescription>
            Name the role and choose the permissions it grants. You can assign it to users when
            creating or editing them.
          </DialogDescription>
        </DialogHeader>
        {/* Remount per open so the form resets between uses. */}
        {open && <CreateRoleForm onSuccess={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function CreateRoleForm({ onSuccess }: { onSuccess: () => void }) {
  const createRole = useCreateRole();
  const { data: permissions } = usePermissions({ enabled: true });
  const [permKeys, setPermKeys] = useState<Set<string>>(() => new Set());

  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: { name: "", description: "" },
  });

  function onSubmit(values: CreateRoleFormValues) {
    const permissionIds = (permissions ?? [])
      .filter((permission) => permKeys.has(permission.key))
      .map((permission) => permission.id);
    createRole.mutate(
      {
        name: values.name,
        description: values.description?.trim() ? values.description : null,
        permissionIds,
      },
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
                <Input placeholder="e.g. Manager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="What is this role for?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-2">
          <span className="text-sm font-medium">Permissions</span>
          <PermissionPicker permissions={permissions} selectedKeys={permKeys} onChange={setPermKeys} />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={createRole.isPending}>
            {createRole.isPending ? "Creating…" : "Create role"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
