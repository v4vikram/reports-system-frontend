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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateSection } from "../hooks/use-create-section";
import { useUpdateSection } from "../hooks/use-update-section";
import type { Section } from "../types";
import { sectionSchema, type SectionFormValues } from "../validation";

interface SectionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  /** Next available order value, used only when creating. */
  nextOrder?: number;
  section?: Section;
}

export function SectionFormDialog({ open, onOpenChange, reportId, nextOrder, section }: SectionFormDialogProps) {
  const isEditing = !!section;
  const createSection = useCreateSection(reportId);
  const updateSection = useUpdateSection();
  const isPending = createSection.isPending || updateSection.isPending;

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: { name: section?.name ?? "" },
  });

  function onSubmit(values: SectionFormValues) {
    const mutation = isEditing
      ? updateSection.mutateAsync({ id: section.id, input: values })
      : createSection.mutateAsync({ ...values, order: nextOrder ?? 0 });

    mutation.then(() => onOpenChange(false));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Rename section" : "New section"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this section's name." : "Add a new section to this report."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Section-1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving…" : isEditing ? "Save changes" : "Create section"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
