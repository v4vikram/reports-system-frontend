"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateCoverageRow } from "../hooks/use-create-coverage-row";
import { useUpdateCoverageRow } from "../hooks/use-update-coverage-row";
import type { CoverageRow } from "../types";
import { coverageRowSchema, type CoverageRowFormValues } from "../validation";
import { ImageUploadField } from "./image-upload-field";

interface CoverageRowFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coverageTableId: string;
  /** Next sequential Sr No, used only when creating. */
  nextSrNo: number;
  row?: CoverageRow;
}

export function CoverageRowFormDialog({
  open,
  onOpenChange,
  coverageTableId,
  nextSrNo,
  row,
}: CoverageRowFormDialogProps) {
  const isEditing = !!row;
  const createRow = useCreateCoverageRow(coverageTableId);
  const updateRow = useUpdateCoverageRow();
  const isPending = createRow.isPending || updateRow.isPending;

  const form = useForm<CoverageRowFormValues>({
    resolver: zodResolver(coverageRowSchema),
    defaultValues: {
      srNo: row?.srNo ?? nextSrNo,
      headline: row?.headline ?? null,
      publication: row?.publication ?? null,
      edition: row?.edition ?? null,
      pageNo: row?.pageNo ?? null,
      date: row?.date ? row.date.slice(0, 10) : null,
      link: row?.link ?? null,
      image: row?.image ?? null,
      isTopCoverage: row?.isTopCoverage ?? false,
    },
  });

  function onSubmit(values: CoverageRowFormValues) {
    const mutation = isEditing
      ? updateRow.mutateAsync({ id: row.id, input: values })
      : createRow.mutateAsync(values);

    mutation.then(() => onOpenChange(false));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit row" : "New row"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this coverage row." : "Add a new coverage row to this table."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="srNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sr No</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isTopCoverage"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end gap-2 pb-1.5">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={(c) => field.onChange(c === true)} />
                    </FormControl>
                    <FormLabel className="font-normal">Top coverage</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value || null)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="publication"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publication</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value || null)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="edition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edition</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value || null)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pageNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page No</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value || null)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
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
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="https://…"
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUploadField value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving…" : isEditing ? "Save changes" : "Add row"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
