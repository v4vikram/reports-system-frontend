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
import { useDeleteCoverageTable } from "../hooks/use-delete-coverage-table";
import type { CoverageTable } from "../types";

interface DeleteCoverageTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: CoverageTable | null;
}

export function DeleteCoverageTableDialog({ open, onOpenChange, table }: DeleteCoverageTableDialogProps) {
  const deleteTable = useDeleteCoverageTable();

  function handleConfirm() {
    if (!table) return;
    deleteTable.mutate(table.id, { onSuccess: () => onOpenChange(false) });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this table?</AlertDialogTitle>
          <AlertDialogDescription>
            This deletes every row in it too. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteTable.isPending}
            className="bg-destructive/10 text-destructive hover:bg-destructive/20"
          >
            {deleteTable.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
