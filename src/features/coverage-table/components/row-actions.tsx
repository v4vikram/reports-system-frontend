"use client";

import { CopyIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface RowActionsProps {
  srNo: number;
  canEdit: boolean;
  canDelete: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
  duplicating?: boolean;
  deleting?: boolean;
}

// Row cells are already inline-editable (see report-table.tsx), so there's
// no separate "Edit" action here — a modal editor for data you can already
// click into directly would just be a second, contradictory way to do the
// same thing.
export function RowActions({ srNo, canEdit, canDelete, onDuplicate, onDelete, duplicating, deleting }: RowActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!canEdit && !canDelete) return null;

  return (
    <div className="flex items-center justify-center gap-1">
      {canEdit && (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                disabled={duplicating}
                onClick={onDuplicate}
                aria-label="Duplicate row"
              >
                <CopyIcon />
              </Button>
            }
          />
          <TooltipContent>Duplicate row</TooltipContent>
        </Tooltip>
      )}
      {canDelete && (
        <>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={() => setConfirmOpen(true)}
                  aria-label="Delete row"
                >
                  <Trash2Icon />
                </Button>
              }
            />
            <TooltipContent>Delete row</TooltipContent>
          </Tooltip>
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete row {srNo}?</AlertDialogTitle>
                <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onDelete();
                    setConfirmOpen(false);
                  }}
                  disabled={deleting}
                  className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                >
                  {deleting ? "Deleting…" : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
