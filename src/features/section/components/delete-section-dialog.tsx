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
import { useDeleteSection } from "../hooks/use-delete-section";
import type { Section } from "../types";

interface DeleteSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: Section | null;
}

export function DeleteSectionDialog({ open, onOpenChange, section }: DeleteSectionDialogProps) {
  const deleteSection = useDeleteSection();

  function handleConfirm() {
    if (!section) return;
    deleteSection.mutate(section.id, { onSuccess: () => onOpenChange(false) });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{section?.name}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This deletes every coverage table and row inside it too. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteSection.isPending}
            className="bg-destructive/10 text-destructive hover:bg-destructive/20"
          >
            {deleteSection.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
