"use client";

import { useState } from "react";
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
import { useAssignEmployeeRoles } from "../hooks/use-assign-employee-roles";
import { useRoles } from "../hooks/use-roles";
import type { Employee } from "../types";

interface AssignRolesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function AssignRolesDialog({ open, onOpenChange, employee }: AssignRolesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage roles</DialogTitle>
          <DialogDescription>
            {employee ? `Choose which roles ${employee.name} should have.` : ""}
          </DialogDescription>
        </DialogHeader>
        {/* Keyed on employee id so switching targets gets fresh local state
            for free on remount, instead of syncing it via an effect. */}
        {employee && (
          <AssignRolesForm key={employee.id} employee={employee} onOpenChange={onOpenChange} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AssignRolesForm({
  employee,
  onOpenChange,
}: {
  employee: Employee;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: roles } = useRoles();
  const assignRoles = useAssignEmployeeRoles();
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(employee.roles.map((role) => role.id))
  );

  function toggle(roleId: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(roleId);
      } else {
        next.delete(roleId);
      }
      return next;
    });
  }

  function handleSave() {
    assignRoles.mutate(
      { id: employee.id, roleIds: [...selected] },
      { onSuccess: () => onOpenChange(false) }
    );
  }

  return (
    <>
      <div className="grid gap-3">
        {roles?.map((role) => (
          <label key={role.id} className="flex items-start gap-2">
            <Checkbox
              checked={selected.has(role.id)}
              onCheckedChange={(checked) => toggle(role.id, checked === true)}
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
      <DialogFooter>
        <Button onClick={handleSave} disabled={assignRoles.isPending}>
          {assignRoles.isPending ? "Saving…" : "Save"}
        </Button>
      </DialogFooter>
    </>
  );
}
