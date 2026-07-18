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
import { useDeleteEvent } from "../hooks/use-delete-event";
import type { Event } from "../types";

interface DeleteEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
}

export function DeleteEventDialog({ open, onOpenChange, event }: DeleteEventDialogProps) {
  const deleteEvent = useDeleteEvent();

  function handleConfirm() {
    if (!event) return;
    deleteEvent.mutate(event.id, {
      onSuccess: () => onOpenChange(false),
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{event?.title}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes the event and all of its reports. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteEvent.isPending}
            className="bg-destructive/10 text-destructive hover:bg-destructive/20"
          >
            {deleteEvent.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
