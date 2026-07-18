"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useHasPermission } from "@/features/auth";
import { USER_VIEW_PERMISSIONS, useEmployees } from "@/features/employee";
import { useCreateClient } from "../hooks/use-create-client";
import { useUpdateClient } from "../hooks/use-update-client";
import type { Client } from "../types";
import { clientSchema, type ClientFormValues } from "../validation";

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
}

export function ClientFormDialog({ open, onOpenChange, client }: ClientFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{client ? "Edit client" : "New client"}</DialogTitle>
          <DialogDescription>
            {client
              ? "Update this client's details or reassign it to a different employee."
              : "Add a new client and optionally assign it to an employee."}
          </DialogDescription>
        </DialogHeader>
        {/* Keyed on client id so switching targets gets fresh form state for
            free on remount, instead of syncing it via an effect. */}
        <ClientForm key={client?.id ?? "new"} client={client} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}

// Reusable form body for creating/editing a client. Exported so the unified
// "Create user" dialog can render it alongside the employee form.
export function ClientForm({
  client,
  onOpenChange,
}: {
  client?: Client;
  onOpenChange: (open: boolean) => void;
}) {
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const isEditing = !!client;
  const isPending = createClient.isPending || updateClient.isPending;

  const hasPermission = useHasPermission();
  const canSeeEmployees = USER_VIEW_PERMISSIONS.some((key) => hasPermission(key));
  const { data: employees } = useEmployees({ enabled: canSeeEmployees });

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name ?? "",
      company: client?.company ?? null,
      email: client?.email ?? null,
      phone: client?.phone ?? null,
      address: client?.address ?? null,
      notes: client?.notes ?? null,
      assignedUserId: client?.assignedUserId ?? null,
      portalUserId: client?.portalUserId ?? null,
    },
  });

  // Existing CLIENT-role accounts, for the portal-login picker. A client's
  // portal login is a distinct account from the employee managing them, so
  // only users who already hold the CLIENT role are eligible.
  const portalCandidates = employees?.filter((employee) =>
    employee.roles.some((role) => role.name === "CLIENT")
  );

  function onSubmit(values: ClientFormValues) {
    const mutation = isEditing
      ? updateClient.mutateAsync({ id: client.id, input: values })
      : createClient.mutateAsync(values);

    mutation.then(() => onOpenChange(false));
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {canSeeEmployees && (
          <FormField
            control={form.control}
            name="assignedUserId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned employee</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={null}>Unassigned</SelectItem>
                    {employees?.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {canSeeEmployees && (
          <FormField
            control={form.control}
            name="portalUserId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portal login (optional)</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No portal access" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={null}>No portal access</SelectItem>
                    {portalCandidates?.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} ({employee.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Links an existing CLIENT-role account so this client can log in and see their own
                  events/reports. Remember to also grant that account clients:read/reports:read.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <DialogFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : isEditing ? "Save changes" : "Create client"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
