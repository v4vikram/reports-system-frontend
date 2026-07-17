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
import { useAssignEmployeePermissions } from "../hooks/use-assign-employee-permissions";
import { usePermissions } from "../hooks/use-permissions";
import type { Employee } from "../types";

interface AssignPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function AssignPermissionsDialog({
  open,
  onOpenChange,
  employee,
}: AssignPermissionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Individual permissions</DialogTitle>
          <DialogDescription>
            {employee
              ? `Grant permissions directly to ${employee.name}, on top of whatever their roles already give them.`
              : ""}
          </DialogDescription>
        </DialogHeader>
        {/* Keyed on employee id so switching targets gets fresh local state
            for free on remount, instead of syncing it via an effect. */}
        {employee && (
          <AssignPermissionsForm key={employee.id} employee={employee} onOpenChange={onOpenChange} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AssignPermissionsForm({
  employee,
  onOpenChange,
}: {
  employee: Employee;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: permissions } = usePermissions({ enabled: true });
  const assignPermissions = useAssignEmployeePermissions();
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(employee.directPermissions)
  );

  function toggle(key: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
  }

  function handleSave() {
    if (!permissions) return;
    const permissionIds = permissions
      .filter((permission) => selected.has(permission.key))
      .map((permission) => permission.id);
    assignPermissions.mutate(
      { id: employee.id, permissionIds },
      { onSuccess: () => onOpenChange(false) }
    );
  }

  return (
    <>
      <div className="grid max-h-80 gap-2 overflow-y-auto">
        {permissions?.map((permission) => (
          <label key={permission.id} className="flex items-start gap-2">
            <Checkbox
              checked={selected.has(permission.key)}
              onCheckedChange={(checked) => toggle(permission.key, checked === true)}
            />
            <span className="grid gap-0.5">
              <span className="font-mono text-sm">{permission.key}</span>
              {permission.description && (
                <span className="text-xs text-muted-foreground">{permission.description}</span>
              )}
            </span>
          </label>
        ))}
        {permissions?.length === 0 && (
          <p className="text-sm text-muted-foreground">No permissions exist yet.</p>
        )}
      </div>
      <DialogFooter>
        <Button onClick={handleSave} disabled={assignPermissions.isPending}>
          {assignPermissions.isPending ? "Saving…" : "Save"}
        </Button>
      </DialogFooter>
    </>
  );
}
