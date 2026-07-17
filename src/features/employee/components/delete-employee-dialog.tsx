"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteEmployee } from "../hooks/use-delete-employee";
import type { Employee } from "../types";

interface DeleteEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function DeleteEmployeeDialog({ open, onOpenChange, employee }: DeleteEmployeeDialogProps) {
  const deleteEmployee = useDeleteEmployee();

  function handleConfirm() {
    if (!employee) return;
    deleteEmployee.mutate(employee.id, {
      onSuccess: () => onOpenChange(false),
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{employee?.name}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes the account and can&apos;t be undone. Any clients assigned to
            them become unassigned.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteEmployee.isPending}
            className="bg-destructive/10 text-destructive hover:bg-destructive/20"
          >
            {deleteEmployee.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
